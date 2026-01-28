# 🔧 Solución de Problemas de Base de Datos

## Problema: "No se puede conectar a la base de datos durante el seed"

Este es un problema común que puede ocurrir por varias razones. Esta guía te ayudará a resolverlo.

## ✅ Soluciones Implementadas en el Template

### 1. **Reintentos Automáticos**
El template ahora incluye lógica de reintentos que espera hasta 20 segundos (10 intentos) para que la base de datos esté disponible. Esto es especialmente útil cuando:
- Docker está iniciando los contenedores
- La base de datos está reiniciándose
- Hay latencia en la red

### 2. **Mensajes de Error Detallados**
Si la conexión falla, ahora recibirás mensajes claros indicando:
- Qué verificar
- Pasos específicos para resolver el problema
- Información sobre la URL de conexión (con credenciales ocultas)

### 3. **Validación de Credenciales**
El sistema valida las variables de entorno antes de intentar conectar, asegurando que `DATABASE_URL` esté correctamente configurada.

## 🔍 Troubleshooting Paso a Paso

### Paso 1: Verificar que Docker está corriendo
```bash
docker ps
```

**Esperado:** Deberías ver tus contenedores de PostgreSQL corriendo.

**Si no hay contenedores:**
```bash
docker-compose up -d
```

### Paso 2: Verificar las variables de entorno

Asegúrate de tener un archivo `.env.local` en la raíz del proyecto:

```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/nombre_bd
```

**Verificar formato:**
- ✅ `postgresql://` (NO `postgres://`)
- ✅ Puerto correcto (default: 5432)
- ✅ Sin espacios en blanco
- ✅ Credenciales correctas

### Paso 3: Probar conexión directa

Intenta conectarte desde la terminal:

```bash
# Linux/Mac
psql -h localhost -p 5432 -U usuario -d nombre_bd

# Windows (PowerShell)
docker exec -it nombre_contenedor psql -U usuario -d nombre_bd
```

### Paso 4: Verificar logs de Docker

```bash
docker-compose logs postgres
```

Busca errores como:
- Puerto en uso
- Permisos incorrectos
- Disco lleno
- Errores de autenticación

### Paso 5: Reiniciar contenedores

```bash
docker-compose restart
# o
docker-compose down && docker-compose up -d
```

### Paso 6: Limpiar y reconstruir (último recurso)

```bash
docker-compose down -v  # ⚠️ ESTO BORRA LOS DATOS
docker-compose up -d
npm run db:push
npm run db:seed
```

## 🚀 Uso del Nuevo Sistema de Seed

### Ejecutar seed
```bash
npm run db:seed
```

### Agregar datos al seed

Edita `src/server/db/seed.ts`:

```typescript
console.log('📝 Insertando usuarios...');
await db.insert(schema.users).values([
  { name: 'Juan', email: 'juan@example.com' },
  { name: 'María', email: 'maria@example.com' },
]);
console.log('✅ Usuarios insertados');
```

## 🐛 Errores Comunes y Soluciones

### Error: "ECONNREFUSED"
**Causa:** La base de datos no está corriendo o el puerto es incorrecto.
**Solución:** 
```bash
docker-compose up -d
docker ps  # verificar que está corriendo
```

### Error: "password authentication failed"
**Causa:** Credenciales incorrectas en `.env.local`
**Solución:** Verifica usuario y contraseña en `docker-compose.yml` y `.env.local`

### Error: "database does not exist"
**Causa:** La base de datos no ha sido creada.
**Solución:**
```bash
# Conectarse al contenedor
docker exec -it nombre_contenedor psql -U postgres
# Crear la BD
CREATE DATABASE nombre_bd;
\q
```

### Error: "timeout"
**Causa:** La base de datos está tardando mucho en iniciar.
**Solución:** El sistema ahora espera automáticamente. Si sigue fallando:
```bash
docker-compose logs postgres  # revisar si hay errores
docker-compose restart
```

### Error: "relation does not exist"
**Causa:** Las migraciones no se han ejecutado.
**Solución:**
```bash
npm run db:push
npm run db:seed
```

## 💡 Mejores Prácticas

1. **Siempre ejecuta las migraciones antes del seed:**
   ```bash
   npm run db:push && npm run db:seed
   ```

2. **Usa `.env.local` para desarrollo local** (no lo commitees)

3. **Verifica Docker antes de comenzar:**
   ```bash
   docker ps && npm run db:seed
   ```

4. **Mantén tus seeds idempotentes** (que se puedan ejecutar múltiples veces sin problemas)

5. **Documenta los datos de seed** en comentarios para que los embajadores sepan qué esperar

## 📚 Recursos Adicionales

- [Documentación de Drizzle ORM](https://orm.drizzle.team/)
- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)
- [Docker Compose](https://docs.docker.com/compose/)

## 🆘 Aún tienes problemas?

Si después de seguir esta guía sigues teniendo problemas:

1. Captura el output completo del error
2. Comparte el resultado de:
   ```bash
   docker ps
   docker-compose logs postgres --tail=50
   ```
3. Verifica que tu archivo `.env.local` tiene el formato correcto (sin compartir las credenciales reales)
