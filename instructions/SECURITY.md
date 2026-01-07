# 🔒 Guía de Seguridad - Template Embajadores

Políticas y mejores prácticas de seguridad obligatorias para todas las aplicaciones desarrolladas con este template.

## 📋 Tabla de Contenidos

- [Requisitos Obligatorios](#requisitos-obligatorios)
- [Autenticación y Autorización](#autenticación-y-autorización)
- [Gestión de Contraseñas](#gestión-de-contraseñas)
- [Protección de Datos](#protección-de-datos)
- [Seguridad en API](#seguridad-en-api)
- [Variables de Entorno](#variables-de-entorno)
- [Auditoría y Logging](#auditoría-y-logging)
- [Checklist de Implementación](#checklist-de-implementación)

---

## ⚠️ Requisitos Obligatorios

### 🔐 Autenticación Requerida

**TODA aplicación DEBE implementar sistema de usuarios y login**. No se permiten aplicaciones sin autenticación a menos que haya aprobación explícita.

**Razones:**
- Trazabilidad de acciones
- Cumplimiento normativo
- Auditoría de cambios
- Responsabilidad individual

### 👤 Sistema de Usuarios Mínimo

Toda aplicación debe incluir:
- ✅ Tabla de usuarios con roles
- ✅ Sistema de login/logout
- ✅ Gestión de sesiones o tokens
- ✅ **Solo administradores pueden crear usuarios** (NO registro público)
- ✅ Registro de auditoría de accesos

---

## 🔑 Autenticación y Autorización

### Implementación Requerida

```typescript
// Tabla de usuarios (mínimo requerido)
export const usuarios = appSchema.table('usuarios', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  idPublico: uuid('id_publico').notNull().defaultRandom().unique(),
  
  // Datos de autenticación
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  
  // Datos personales
  nombre: varchar('nombre', { length: 100 }).notNull(),
  apellido: varchar('apellido', { length: 100 }).notNull(),
  
  // Control de acceso
  rol: varchar('rol', { length: 50 }).notNull().default('usuario'), // admin, usuario, etc.
  ultimoAcceso: timestamp('ultimo_acceso', { withTimezone: true }),
  
  // Auditoría
  fechaCreacion: timestamp('fecha_creacion', { withTimezone: true }).notNull().defaultNow(),
  fechaActualizacion: timestamp('fecha_actualizacion', { withTimezone: true }).notNull().defaultNow(),
  activo: boolean('activo').notNull().default(true),
  adicional: jsonb('adicional').notNull().default({}),
});
```

### Bibliotecas Recomendadas

**Para hashing de contraseñas:**
```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

**Para tokens JWT (si aplica):**
```bash
npm install jose  # JWT recomendado para Next.js
```

**Para sesiones (alternativa):**
```bash
npm install iron-session
```

---

## 🔐 Gestión de Contraseñas

### Requisitos de Contraseña (OBLIGATORIO)

**Política mínima de contraseñas:**
- ✅ Mínimo 8 caracteres
- ✅ Al menos 1 letra mayúscula
- ✅ Al menos 1 número
- ✅ **Recomendado**: Al menos 1 carácter especial (@$!%*?&)

### Validación con Zod

```typescript
import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .regex(/[@$!%*?&]/, 'Se recomienda incluir un carácter especial (@$!%*?&)');

export const registroSchema = z.object({
  email: z.string().email('Email inválido'),
  password: passwordSchema,
  confirmPassword: z.string(),
  nombre: z.string().min(2, 'Nombre muy corto').max(100, 'Nombre muy largo'),
  apellido: z.string().min(2, 'Apellido muy corto').max(100, 'Apellido muy largo'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});
```

### Hashing de Contraseñas

**NUNCA almacenar contraseñas en texto plano.**

```typescript
import bcrypt from 'bcryptjs';

// Al registrar usuario
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12; // Mayor = más seguro pero más lento
  return bcrypt.hash(password, saltRounds);
}

// Al validar login
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Ejemplo en tRPC router
export const authRouter = createTRPCRouter({
  // Solo admins pueden crear usuarios
  crearUsuario: protectedProcedure  // Requiere autenticación y rol admin
    .input(z.object({
      email: z.string().email(),
      password: passwordSchema,
      nombre: z.string().min(2).max(100),
      apellido: z.string().min(2).max(100),
      rol: z.enum(['admin', 'usuario']).default('usuario'),
    }))
    .mutation(async ({ input, ctx }) => {
      // Verificar que quien crea es admin
      if (ctx.usuario.rol !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Solo administradores pueden crear usuarios',
        });
      }
      
      // Verificar que email no existe
      const existente = await ctx.db.query.usuarios.findFirst({
        where: eq(usuarios.email, input.email),
      });
      
      if (existente) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'El email ya está registrado',
        });
      }
      
      // Hash de contraseña
      const passwordHash = await hashPassword(input.password);
      
      // Crear usuario
      const [usuario] = await ctx.db
        .insert(usuarios)
        .values({
          email: input.email,
          passwordHash,
          nombre: input.nombre,
          apellido: input.apellido,
          rol: input.rol,
        })
        .returning({ idPublico: usuarios.idPublico });
      
      return { success: true, idPublico: usuario.idPublico };
    }),
    
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const usuario = await ctx.db.query.usuarios.findFirst({
        where: eq(usuarios.email, input.email),
      });
      
      if (!usuario || !usuario.activo) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Credenciales inválidas',
        });
      }
      
      // Verificar contraseña
      const valida = await verifyPassword(input.password, usuario.passwordHash);
      
      if (!valida) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Credenciales inválidas',
        });
      }
      
      // Login exitoso - actualizar último acceso
      await ctx.db
        .update(usuarios)
        .set({
          ultimoAcceso: new Date(),
        })
        .where(eq(usuarios.id, usuario.id));
      
      // Aquí crear sesión o JWT
      return {
        success: true,
        idPublico: usuario.idPublico,
        rol: usuario.rol,
      };
    }),
});
```

---

## 🛡️ Protección de Datos

### IDs Públicos (UUID)

**NUNCA exponer IDs autoincrementales al frontend.**

```typescript
// ❌ INCORRECTO - Expone IDs secuenciales
/api/usuarios/1
/api/usuarios/2  // Atacante puede enumerar

// ✅ CORRECTO - Usa UUIDs
/api/usuarios/a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6
```

**Razones:**
- Previene enumeración de recursos
- Oculta volumen de datos
- Dificulta ataques dirigidos

### Sanitización de Inputs

**SIEMPRE validar con Zod en tRPC:**

```typescript
export const updateUserSchema = z.object({
  idPublico: z.string().uuid(),
  nombre: z.string()
    .min(2, 'Nombre muy corto')
    .max(100, 'Nombre muy largo')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/, 'Solo letras'),
  apellido: z.string()
    .min(2, 'Apellido muy corto')
    .max(100, 'Apellido muy largo')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/, 'Solo letras'),
  email: z.string().email('Email inválido'),
});
```

### SQL Injection Prevention

**Drizzle ORM previene SQL injection por defecto**, pero:

```typescript
// ✅ SEGURO - Usar query builder de Drizzle (SIEMPRE PREFERIR)
await db.select().from(usuarios).where(eq(usuarios.email, input.email));

// ❌ PELIGROSO - Concatenación manual con comillas
await db.execute(sql`SELECT * FROM usuarios WHERE email = '${input.email}'`);
// Problema: El valor se inserta como string literal, vulnerable a SQL injection

// ✅ CORRECTO - Drizzle maneja el valor como parámetro seguro
await db.execute(sql`SELECT * FROM usuarios WHERE email = ${input.email}`);
// Sin comillas: Drizzle usa parámetros preparados automáticamente

// Ejemplo de diferencia:
// Peligroso: "SELECT * FROM usuarios WHERE email = 'user@test.com' OR '1'='1'"
// Seguro:    "SELECT * FROM usuarios WHERE email = $1" con parámetro ["user@test.com"]
```

---

## 🔐 Seguridad en API

### CORS Configuration

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: process.env.ALLOWED_ORIGIN || 'http://localhost:3000' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};
```

---

## 🔑 Variables de Entorno

### Gestión de Secrets

**NUNCA commitear secrets al repositorio:**

```bash
# .gitignore debe incluir:
.env
.env*.local
.env.production
```

### Variables Requeridas

```typescript
// src/server/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'qa', 'prod']),
  DATABASE_URL: z.string().url(),
  
  // Secrets de autenticación
  JWT_SECRET: z.string().min(32, 'JWT_SECRET debe tener al menos 32 caracteres'),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET debe tener al menos 32 caracteres'),
  
  // Configuración de seguridad
  ALLOWED_ORIGINS: z.string().default('*'), // ⚠️ Cambiar en producción a dominios específicos
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  
  // Opcionales pero recomendados
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
});

export const env = envSchema.parse(process.env);
```

### Generación de Secrets

```bash
# Generar JWT_SECRET y SESSION_SECRET seguros
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

##  Auditoría y Logging

### Tabla de Auditoría

```typescript
export const auditoria = auditSchema.table('auditoria', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  
  // Quién
  usuarioId: bigint('usuario_id', { mode: 'number' }).references(() => usuarios.id),
  usuarioEmail: varchar('usuario_email', { length: 255 }),
  
  // Qué
  accion: varchar('accion', { length: 100 }).notNull(), // login, logout, create, update, delete
  entidad: varchar('entidad', { length: 100 }).notNull(), // usuarios, productos, etc.
  entidadId: varchar('entidad_id', { length: 255 }), // ID público del registro afectado
  
  // Detalles
  descripcion: text('descripcion'),
  datosAnteriores: jsonb('datos_anteriores'), // Para updates/deletes
  datosNuevos: jsonb('datos_nuevos'), // Para creates/updates
  
  // Contexto
  ip: varchar('ip', { length: 45 }),
  userAgent: text('user_agent'),
  
  // Cuándo
  fecha: timestamp('fecha', { withTimezone: true }).notNull().defaultNow(),
});
```

### Helper de Auditoría

```typescript
// src/server/db/helpers/audit.ts
import { auditoria } from '~/server/db/schema/audit/auditoria';
import { db } from '~/server/db';

export async function registrarAuditoria(params: {
  usuarioId?: number;
  usuarioEmail?: string;
  accion: string;
  entidad: string;
  entidadId?: string;
  descripcion?: string;
  datosAnteriores?: any;
  datosNuevos?: any;
  ip?: string;
  userAgent?: string;
}) {
  await db.insert(auditoria).values({
    ...params,
    fecha: new Date(),
  });
}

// Uso en tRPC
export const productosRouter = createTRPCRouter({
  crear: protectedProcedure
    .input(productoSchema)
    .mutation(async ({ input, ctx }) => {
      const [producto] = await ctx.db
        .insert(productos)
        .values(input)
        .returning();
      
      // Registrar en auditoría
      await registrarAuditoria({
        usuarioId: ctx.usuario.id,
        usuarioEmail: ctx.usuario.email,
        accion: 'create',
        entidad: 'productos',
        entidadId: producto.idPublico,
        descripcion: `Producto creado: ${producto.nombre}`,
        datosNuevos: producto,
        ip: ctx.ip,
        userAgent: ctx.userAgent,
      });
      
      return producto;
    }),
});
```

### Eventos a Auditar (Mínimo)

- ✅ Login exitoso/fallido
- ✅ Logout
- ✅ Cambios de contraseña
- ✅ Creación de usuarios
- ✅ Modificación de roles/permisos
- ✅ Accesos a datos sensibles
- ✅ Exportación de datos
- ✅ Eliminaciones (soft delete)

---

## ✅ Checklist de Implementación

### Fase 1: Autenticación (Obligatorio)

- [ ] Tabla `usuarios` con campos requeridos
- [ ] Solo administradores pueden crear usuarios (NO registro público)
- [ ] Validación de contraseñas (8 chars, mayúscula, número)
- [ ] Hashing con bcrypt (saltRounds >= 12)
- [ ] Sistema de login/logout
- [ ] Gestión de sesiones o JWT

### Fase 2: Autorización (Obligatorio)

- [ ] Sistema de roles implementado
- [ ] Middleware de protección en tRPC
- [ ] Validación de permisos por endpoint
- [ ] IDs públicos (UUID) en todas las tablas
- [ ] NUNCA exponer IDs autoincrementales

### Fase 3: Protección de Datos (Obligatorio)

- [ ] Validación con Zod en todos los inputs
- [ ] Variables de entorno con secrets seguros
- [ ] JWT_SECRET y SESSION_SECRET con 32+ caracteres
- [ ] .env.local en .gitignore
- [ ] HTTPS en producción

### Fase 4: Auditoría (Obligatorio)

- [ ] Tabla de auditoría implementada
- [ ] Registro de logins/logouts
- [ ] Registro de operaciones críticas
- [ ] Logs accesibles para revisión

### Fase 5: Seguridad Avanzada (Recomendado)

- [ ] CORS correctamente configurado
- [ ] Timeout de sesión implementado

---

## 🚨 Incidentes de Seguridad

### Reportar Vulnerabilidades

Si descubres una vulnerabilidad de seguridad:

1. **NO** la hagas pública
2. Reporta al área de TI
3. Incluye:
   - Descripción detallada
   - Pasos para reproducir
   - Impacto potencial
   - Solución propuesta (si la tienes)

### Respuesta a Incidentes

1. **Detectar**: Revisar logs de auditoría regularmente
2. **Contener**: Bloquear acceso si es necesario
3. **Investigar**: Analizar alcance del incidente
4. **Remediar**: Aplicar parches y cambiar credentials
5. **Documentar**: Registrar lecciones aprendidas

---

## 📚 Referencias

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [Drizzle ORM Security](https://orm.drizzle.team/docs/security)
- [bcrypt Best Practices](https://github.com/kelektiv/node.bcrypt.js#security-issues-and-concerns)
