---
name: inicializar-proyecto
description: Inicializa proyectos del template embajadores ejecutando instalación de dependencias, configuración de base de datos, migraciones y arranque del servidor. Úsalo cuando el usuario pide iniciar, arrancar, configurar o ejecutar el proyecto por primera vez.
---

# Inicializar Proyecto Embajadores

Este skill automatiza completamente la inicialización de proyectos del template embajadores, desde la instalación hasta tener el servidor corriendo en el navegador.

## Cuándo usar este skill

- Usuario dice: "Inicia el proyecto", "Arranca la aplicación", "Pon esto a funcionar"
- Primera vez que se trabaja con el proyecto
- Después de clonar el repositorio
- Cuando se necesita un setup completo desde cero

## Proceso de inicialización

### 1. Verificar estado del proyecto

Antes de comenzar, verifica:

```bash
# ¿Existen node_modules?
ls node_modules

# ¿Hay archivo .env.local?
ls .env.local
```

### 2. Instalar dependencias

```bash
npm install
```

**Explicar al usuario**: "Instalando todas las librerías necesarias del proyecto..."

### 3. Configurar variables de entorno

Si NO existe `.env.local`:

```bash
# Copiar desde ejemplo
cp .env.local.example .env.local
```

**Verificar credenciales por defecto**:
- `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/lycsa_app`
- `S3_*` para MinIO local

**Explicar al usuario**: "Configurando variables de entorno para desarrollo local..."

### 4. Levantar servicios Docker

```bash
# PostgreSQL + MinIO
docker compose -f docker-compose.dev.yml up -d db minio
```

**Explicar al usuario**: "Iniciando base de datos PostgreSQL y almacenamiento MinIO..."

**Esperar conexión**: Dar tiempo (5-10 segundos) para que PostgreSQL esté listo antes de continuar.

### 5. Iniciar servidor de desarrollo

```bash
npm run dev
```

**Este comando hace automáticamente**:
1. Genera migraciones (`npm run db:generate`)
2. Aplica migraciones (`npm run db:push`)
3. Inicia servidor Next.js en puerto 3000

**Explicar al usuario**: "Iniciando servidor de desarrollo. Esto puede tomar 10-30 segundos..."

**Esperar hasta ver**: "Ready in X ms" o "compiled successfully"

### 6. Abrir navegador

Usar el browser MCP tool para abrir: `http://localhost:3000`

**Explicar al usuario**: "Abriendo aplicación en el navegador..."

### 7. Verificar funcionamiento

Verificar que:
- Servidor está corriendo sin errores
- Página se carga correctamente en el navegador
- Health check responde: `http://localhost:3000/api/health`

## Manejo de errores comunes

### Error: Puerto 3000 en uso

```bash
# Buscar proceso en puerto 3000
netstat -ano | findstr :3000  # Windows
lsof -ti:3000                  # Mac/Linux

# Matar proceso si es necesario
# Windows: taskkill /PID <pid> /F
# Mac/Linux: kill -9 <pid>
```

**Explicar**: "El puerto 3000 ya está siendo usado. Deteniendo el proceso anterior..."

### Error: PostgreSQL no conecta

**Verificar que Docker esté corriendo**:

```bash
docker ps
```

**Solución**: 
1. Reiniciar contenedores: `docker compose -f docker-compose.dev.yml restart db`
2. Verificar logs: `docker compose -f docker-compose.dev.yml logs db`

**Explicar**: "La base de datos no está lista. Reiniciando contenedor..."

### Error: Module not found

**Solución**: Limpiar y reinstalar

```bash
rm -rf node_modules package-lock.json
npm install
```

**Explicar**: "Reinstalando dependencias para corregir el error..."

### Error: Cannot find .env.local

**Solución**: Crear automáticamente

```bash
cp .env.local.example .env.local
```

**Explicar**: "Creando archivo de configuración con valores por defecto..."

## Checklist de completitud

Antes de terminar, verificar:

- [ ] ✅ Dependencias instaladas (`node_modules` existe)
- [ ] ✅ Variables de entorno configuradas (`.env.local` existe)
- [ ] ✅ Docker corriendo (PostgreSQL + MinIO activos)
- [ ] ✅ Migraciones aplicadas (sin errores en consola)
- [ ] ✅ Servidor corriendo en puerto 3000
- [ ] ✅ Navegador abierto en `http://localhost:3000`
- [ ] ✅ Página se carga sin errores

## Comunicación con el usuario

### Inicio del proceso

```
🚀 Voy a inicializar tu proyecto. Plan:

📋 Tareas:
1. ✅ Instalar dependencias
2. ✅ Configurar variables de entorno
3. ✅ Iniciar servicios (PostgreSQL + MinIO)
4. ✅ Aplicar migraciones de base de datos
5. ✅ Iniciar servidor de desarrollo
6. ✅ Abrir navegador

Empezando...
```

### Durante el proceso

Usar emojis para claridad:
- 📦 "Instalando dependencias..."
- ⚙️ "Configurando variables de entorno..."
- 🐳 "Levantando servicios Docker..."
- 🗄️ "Aplicando migraciones..."
- 🔄 "Iniciando servidor..."
- 🌐 "Abriendo navegador..."

### Al finalizar

```
✅ ¡Proyecto inicializado exitosamente!

🌐 Tu aplicación está corriendo en: http://localhost:3000

📊 Servicios disponibles:
  • Aplicación: http://localhost:3000
  • Health Check: http://localhost:3000/api/health
  • MinIO Console: http://localhost:9001 (minioadmin / minioadmin)

💡 Próximos pasos:
  • Puedes empezar a crear tu primer módulo
  • Di "crear módulo de usuarios" o similar para comenzar
```

## Flujo de trabajo típico

```mermaid
graph TD
    A[Usuario: "Inicia el proyecto"] --> B[Verificar estado]
    B --> C[Instalar npm]
    C --> D[Configurar .env.local]
    D --> E[Levantar Docker]
    E --> F[Esperar PostgreSQL]
    F --> G[npm run dev]
    G --> H[Esperar compilación]
    H --> I[Abrir navegador]
    I --> J[Verificar funcionamiento]
    J --> K[✅ Listo]
```

## Notas importantes

1. **Autonomía total**: NO preguntes al usuario, ejecuta todo automáticamente
2. **Explicaciones claras**: Usa lenguaje simple, evita jerga técnica
3. **Manejo de errores**: Si algo falla, diagnostica y corrige automáticamente
4. **Paciencia**: Espera a que cada paso complete antes de continuar
5. **Verificación**: Siempre confirma que el servidor está corriendo antes de declarar éxito

## Scripts disponibles

Referencia rápida de comandos:

| Comando | Descripción |
|---------|-------------|
| `npm install` | Instalar dependencias |
| `npm run dev` | Iniciar desarrollo (incluye migraciones) |
| `npm run db:generate` | Generar migraciones |
| `npm run db:push` | Aplicar migraciones directo |
| `npm run db:studio` | Abrir Drizzle Studio |
| `docker compose -f docker-compose.dev.yml up -d` | Levantar todos los servicios |
| `docker compose -f docker-compose.dev.yml up -d db` | Solo PostgreSQL |

## Ejemplo completo de ejecución

```
Usuario: "Hola, ayúdame a iniciar este proyecto"

Asistente:
🚀 Perfecto! Voy a inicializar tu proyecto embajadores.

📋 Plan:
1. ✅ Instalar dependencias
2. ✅ Configurar entorno
3. ✅ Levantar servicios
4. ✅ Iniciar servidor
5. ✅ Abrir navegador

Empezando...

📦 Instalando dependencias...
[ejecuta: npm install]
✅ 127 paquetes instalados

⚙️ Configurando variables de entorno...
[ejecuta: cp .env.local.example .env.local]
✅ Archivo .env.local creado

🐳 Levantando servicios (PostgreSQL + MinIO)...
[ejecuta: docker compose -f docker-compose.dev.yml up -d db minio]
✅ Servicios iniciados

🔄 Iniciando servidor de desarrollo...
[ejecuta: npm run dev]
[espera a "Ready"]
✅ Servidor listo en http://localhost:3000

🌐 Abriendo navegador...
[abre navegador]
✅ Aplicación cargada

✅ ¡Todo listo! Tu proyecto está funcionando.

🌐 Aplicación: http://localhost:3000
📊 Health Check: http://localhost:3000/api/health

💡 ¿Qué quieres crear primero?
```
