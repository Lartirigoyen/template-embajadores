# AI Development Rules - Template Embajadores Lycsa Suite

Reglas de desarrollo optimizadas para agentes de IA. Más detalles en `instructions/database-actions-guide.md`, `instructions/DESIGN_SYSTEM.md`, y **`instructions/SECURITY.md`**.

## Stack Tecnológico

**Core**: Next.js 15.5.9 App Router | TypeScript 5.7.2 strict | Node 20+ Alpine
**API**: tRPC v11.0.0 (publicProcedure, SuperJSON en httpBatchLink)
**ORM**: Drizzle v0.36.4 (pg driver, schemas: app/audit/scraping)
**DB**: PostgreSQL con pooling
**Validación**: Zod v3.24.1
**Storage**: AWS S3/MinIO (@aws-sdk/client-s3 v3.700.0)
**Excel**: ExcelJS v4.4.0
**UI**: React 19 | Tailwind v3.4.17 | Custom components (NO Shadcn/MUI)
**Fuente**: Aller Regular 400, Bold 700 desde /fonts/
**Docker**: Multi-stage Node 20-alpine, standalone output, nextjs:nodejs user
**Auth**: bcryptjs para hashing, jose para JWT (si aplica)

---

## 🔒 SEGURIDAD (OBLIGATORIO)

**LEER COMPLETO: `SECURITY.md` antes de desarrollar.**

### Requisitos Críticos de Seguridad

1. **TODA aplicación DEBE tener sistema de usuarios y autenticación**
   - NO desarrollar aplicaciones sin login a menos que haya aprobación explícita
   - Sistema de roles implementado (admin, usuario, etc.)

2. **Contraseñas OBLIGATORIAS**:
   - ✅ Mínimo 8 caracteres
   - ✅ Al menos 1 mayúscula
   - ✅ Al menos 1 número
   - ✅ Recomendado: 1 carácter especial (@$!%*?&)
   - ✅ SIEMPRE hash con bcrypt (saltRounds >= 12)
   - ❌ NUNCA almacenar contraseñas en texto plano

3. **Tabla usuarios mínima requerida**:
```typescript
export const usuarios = appSchema.table('usuarios', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  idPublico: uuid('id_publico').notNull().defaultRandom().unique(),
  
  // Autenticación
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  
  // Datos personales
  nombre: varchar('nombre', { length: 100 }).notNull(),
  apellido: varchar('apellido', { length: 100 }).notNull(),
  
  // Control acceso
  rol: varchar('rol', { length: 50 }).notNull().default('usuario'),
  ultimoAcceso: timestamp('ultimo_acceso', { withTimezone: true }),
  
  // Auditoría obligatoria
  fechaCreacion: timestamp('fecha_creacion', { withTimezone: true }).notNull().defaultNow(),
  fechaActualizacion: timestamp('fecha_actualizacion', { withTimezone: true }).notNull().defaultNow(),
  activo: boolean('activo').notNull().default(true),
  adicional: jsonb('adicional').notNull().default({}),
});
```

4. **Validación de contraseñas con Zod**:
```typescript
export const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .regex(/[@$!%*?&]/, 'Se recomienda incluir un carácter especial');
```

5. **Hashing de contraseñas**:
```typescript
import bcrypt from 'bcryptjs';

// Al registrar
const passwordHash = await bcrypt.hash(password, 12);

// Al validar
const valida = await bcrypt.compare(password, user.passwordHash);
```

6. **Creación de usuarios**:
   - Solo administradores pueden crear usuarios
   - NO implementar registro público
   - Admin debe dar de alta todos los usuarios

7. **Auditoría OBLIGATORIA**:
   - Tabla `auditoria` en schema `audit`
   - Registrar: login/logout, cambios de contraseña, operaciones críticas
   - Incluir: usuario, acción, IP, user agent, timestamp

8. **IDs públicos (UUID)**:
   - ❌ NUNCA exponer IDs autoincrementales al frontend
   - ✅ SIEMPRE usar `idPublico` (UUID) en API/frontend
   - Previene enumeración y ataques dirigidos

9. **Variables de entorno seguras**:
```typescript
const envSchema = z.object({
  JWT_SECRET: z.string().min(32, 'Mínimo 32 caracteres'),
  SESSION_SECRET: z.string().min(32, 'Mínimo 32 caracteres'),
  DATABASE_URL: z.string().url(),
});
```

10. **Instalación de dependencias de seguridad**:
```bash
npm install bcryptjs
npm install -D @types/bcryptjs
npm install jose  # Para JWT si aplica
```

**Ver `SECURITY.md` para guía completa de implementación.**

---

## Convenciones Base de Datos

### CRÍTICO - Sistema Dual de IDs

**NUNCA exponer `id` autoincremental al frontend. SIEMPRE usar `id_publico` (UUID).**

- `id` BIGSERIAL PRIMARY KEY → Uso interno, JOINs optimizados
- `id_publico` UUID UNIQUE → Frontend/API, seguridad

**Razones**: Previene enumeración, oculta volumen datos, mejora seguridad.

### Reglas Obligatorias DB

1. **Esquemas**: app (operativo) | audit (logs) | scraping (staging). NUNCA usar public
2. **Nombres**: ESPAÑOL, snake_case. Prefijos solo: rel_ (m2m), stg_ (staging), bulk_ (temp), audit_ (logs)
3. **Campos obligatorios en TODAS las tablas**:
   - id (BIGSERIAL PRIMARY KEY)
   - id_publico (UUID UNIQUE con índice)
   - fecha_creacion (TIMESTAMPTZ)
   - fecha_actualizacion (TIMESTAMPTZ)
   - activo (BOOLEAN, para soft delete)
   - adicional (JSONB)

### Template Drizzle Completo

```typescript
import { pgTable, bigserial, uuid, timestamp, boolean, jsonb, index } from 'drizzle-orm/pg-core';

export const usuarios = pgTable('usuarios', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  idPublico: uuid('id_publico').notNull().defaultRandom().unique(),
  
  // Campos negocio en español
  email: varchar('email', { length: 255 }).notNull().unique(),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  
  // Auditoría
  fechaCreacion: timestamp('fecha_creacion', { withTimezone: true }).notNull().defaultNow(),
  fechaActualizacion: timestamp('fecha_actualizacion', { withTimezone: true }).notNull().defaultNow(),
  activo: boolean('activo').notNull().default(true),
  adicional: jsonb('adicional').notNull().default({}),
}, (table) => ({
  idPublicoIdx: index('idx_usuarios_id_publico').on(table.idPublico),
}));
```

### Flujo Frontend ↔ Backend ↔ DB

```typescript
// Frontend envía UUID
fetch('/api/users/a1b2c3d4-uuid');

// Backend busca por idPublico, usa id interno para JOINs
const user = await db.query.usuarios.findFirst({
  where: eq(usuarios.idPublico, uuidFromFrontend)
});

const ordenes = await db.select()
  .from(ordenes)
  .where(eq(ordenes.usuarioId, user.id)); // JOIN con BIGINT

// Retornar idPublico al frontend
return {
  id: user.idPublico, // UUID
  ordenes: ordenes.map(o => ({ id: o.idPublico }))
};
```

### Operaciones DB

**Soft Delete** (NUNCA DELETE físico):
```typescript
await db.update(usuarios).set({ activo: false, fechaActualizacion: new Date() });
```

**Actualizar** (SIEMPRE incluir fechaActualizacion):
```typescript
import { withUpdatedAt } from '~/server/db/helpers';
await db.update(usuarios).set(withUpdatedAt({ email: 'nuevo@email.com' }));
```

**Queries** (filtrar por activo):
```typescript
await db.select().from(usuarios).where(eq(usuarios.activo, true));
```

**Helpers disponibles**: `src/server/db/helpers/` (softDelete, withUpdatedAt, isActive)

**Migraciones**:
```bash
npm run db:generate  # Generar
npm run db:migrate   # Aplicar (manual)
npm run db:push      # Aplicar (auto en dev)
npm run db:studio    # Ver esquema
```

**REGLA CRÍTICA - Migraciones**:
- NUNCA modificar archivos de migración existentes (src/server/db/migrations/)
- SIEMPRE crear nueva migración para cambios: modificar schema → `npm run db:generate`
- Las migraciones son inmutables una vez creadas
- Razón: Evita inconsistencias entre entornos (dev/qa/prod)

**Nota**: `npm run dev` ejecuta automáticamente `db:push` antes de iniciar el servidor.

### Tipos de Datos

| Uso | Drizzle | Ejemplo |
|-----|---------|---------|
| ID interno | bigserial('id', { mode: 'number' }).primaryKey() | id |
| ID público | uuid('id_publico').notNull().defaultRandom().unique() | idPublico |
| FK | bigint('tabla_id', { mode: 'number' }) | usuarioId |
| Texto corto | varchar('campo', { length: 255 }) | email |
| Texto largo | text('campo') | descripcion |
| Fecha/hora | timestamp('campo', { withTimezone: true }) | fechaCreacion |
| Booleano | boolean('campo') | activo |
| JSON | jsonb('campo') | adicional |
| Decimal | decimal('campo', { precision: 10, scale: 2 }) | precio |

## Sistema de Diseño Lycsa

**Colores Institucionales**:
- Verde #2A7455 (lycsa-verde-600) → Botones primarios, CTAs, navegación activa
- Beige #d5c9b6 (lycsa-beige) → Botones secundarios, acentos
- Gris #595857 (lycsa-accent) → Textos

**Tipografía**: Aller (font-aller, font-aller-bold)
**Componentes**: src/ui/components/ (Button, Input, Card, Modal, Table, Badge, Loader, Toast)
**Estilos**: Solo Tailwind CSS, colores Lycsa, responsive mobile-first

### Escala Tipográfica

```typescript
text-2xl font-bold uppercase tracking-wide  // Títulos grandes
text-xl font-bold capitalize                // Títulos medianos
text-lg font-bold                           // Títulos pequeños
text-base                                   // Cuerpo
text-sm                                     // Secundario
text-xs font-bold uppercase tracking-wide   // Labels
```

## Estructura Proyecto

```
src/
├── app/              # Next.js App Router
│   ├── layout.tsx    # Root con providers
│   ├── globals.css   # Fuentes Aller
│   └── api/trpc/     # tRPC handler
├── server/
│   ├── config/env.ts # Validación env con Zod
│   ├── db/
│   │   ├── connections.ts
│   │   ├── helpers/   # softDelete, withUpdatedAt
│   │   ├── schema/    # Drizzle schemas
│   │   └── migrations/
│   ├── api/
│   │   ├── trpc.ts    # Init
│   │   ├── root.ts    # App router
│   │   └── routers/
│   └── services/      # S3, Excel, etc
└── ui/components/     # Design System
```

**Convenciones archivos**:
- Componentes: PascalCase (Button.tsx)
- Utils: camelCase (formatDate.ts)
- Páginas: lowercase (page.tsx)
- Routers/Schemas: camelCase (userRouter.ts)

## Buenas Prácticas Código

### TypeScript

**Tipado fuerte** (NUNCA any). Usar Zod para validación + inferencia:
```typescript
const createUserSchema = z.object({
  email: z.string().email(),
  nombre: z.string().min(2).max(100),
});
type CreateUserInput = z.infer<typeof createUserSchema>;
```

**Path aliases**: Usar `~/` para imports desde src/

### Server vs Client Components

**Default**: Server Components (sin directiva)
**'use client'**: Solo cuando uses hooks, event handlers, Browser APIs, tRPC client hooks

```typescript
'use client'; // Solo si necesitas:
import { useState, useEffect } from 'react';
const { data } = api.user.list.useQuery();
<button onClick={handler}>Click</button>
```

### tRPC Procedures

```typescript
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const userRouter = createTRPCRouter({
  list: publicProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      return await db.query.usuarios.findMany({
        where: eq(usuarios.activo, true),
        limit: input.limit,
      });
    }),

  create: publicProcedure
    .input(z.object({ email: z.string().email(), nombre: z.string() }))
    .mutation(async ({ input }) => {
      const [user] = await db.insert(usuarios).values(input).returning();
      return { id: user.idPublico, ...input }; // Exponer UUID
    }),
});
```

**Cliente**:
```typescript
'use client';
import { api } from '~/app/_trpc/client';

const { data, isLoading } = api.user.list.useQuery({ limit: 20 });
const createUser = api.user.create.useMutation({
  onSuccess: () => api.useContext().user.list.invalidate()
});
```

### Manejo Errores

```typescript
import { TRPCError } from '@trpc/server';

if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'Usuario no encontrado' });
if (!user.activo) throw new TRPCError({ code: 'FORBIDDEN', message: 'Usuario inactivo' });
```

### Transacciones DB (OBLIGATORIO)

**REGLA CRÍTICA**: TODA mutación que impacte la BD DEBE usar transacciones con try-catch-rollback.

```typescript
import { db } from '~/server/db';
import { TRPCError } from '@trpc/server';

export const orderRouter = createTRPCRouter({
  create: publicProcedure
    .input(createOrderSchema)
    .mutation(async ({ input }) => {
      try {
        // Iniciar transacción
        const result = await db.transaction(async (tx) => {
          // Operación 1: Crear orden
          const [order] = await tx.insert(ordenes)
            .values({
              usuarioId: input.usuarioId,
              total: input.total,
            })
            .returning();

          // Operación 2: Crear items de orden
          await tx.insert(ordenItems).values(
            input.items.map(item => ({
              ordenId: order.id,
              productoId: item.productoId,
              cantidad: item.cantidad,
            }))
          );

          // Operación 3: Actualizar inventario
          for (const item of input.items) {
            await tx.update(productos)
              .set({ 
                stock: sql`stock - ${item.cantidad}`,
                fechaActualizacion: new Date()
              })
              .where(eq(productos.id, item.productoId));
          }

          return order;
        });

        // Si llegamos aquí, COMMIT automático
        return { id: result.idPublico };

      } catch (error) {
        // ROLLBACK automático en caso de error
        console.error('Error creando orden:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Error al procesar la orden',
        });
      }
    }),
});
```

**Sin transacción** (solo para operaciones únicas sin dependencias):
```typescript
// OK para inserts/updates simples sin relaciones
const [user] = await db.insert(usuarios).values(input).returning();
```

### Variables Entorno

```typescript
// src/server/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  S3_ENDPOINT: z.string().url(),
  S3_ACCESS_KEY: z.string().min(1),
});

export const env = envSchema.parse(process.env); // Fail-fast al inicio
```

Usar `env.VARIABLE` en lugar de `process.env.VARIABLE`.

## Componentes UI

### Props TypeScript

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-bold transition-all',
        variant === 'primary' && 'bg-lycsa-verde-600 text-white hover:bg-lycsa-verde-900',
        variant === 'secondary' && 'bg-lycsa-beige hover:bg-lycsa-beige-600',
        className
      )}
      {...props}
    />
  );
}
```

### ForwardRef para Inputs

```typescript
import { forwardRef } from 'react';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, className, ...props }, ref) => (
    <div>
      {label && (
        <label className="text-sm font-bold">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input 
        ref={ref} 
        className={cn(
          'w-full rounded-md border px-3 py-2', 
          error && 'border-red-500',
          className
        )} 
        required={required}
        {...props} 
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
);
```

### Validación de Formularios

**REGLAS OBLIGATORIAS**:

1. **Campos requeridos**: Asterisco rojo (*) en label
2. **Validación cliente**: SIEMPRE validar antes de enviar
3. **Estado error**: Bordes rojos en campos inválidos
4. **Mensajes error**: Texto rojo debajo del campo

```typescript
'use client';
import { useState } from 'react';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email('Email inválido'),
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
});

export function UserForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    // Validar antes de enviar
    const result = formSchema.safeParse(data);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        newErrors[issue.path[0]] = issue.message;
      });
      setErrors(newErrors);
      return; // NO enviar si hay errores
    }
    
    setErrors({});
    // Enviar datos validados
    mutation.mutate(result.data);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Input
        name="email"
        label="Email"
        type="email"
        required
        error={errors.email}
      />
      <Input
        name="nombre"
        label="Nombre"
        required
        error={errors.nombre}
      />
      <Button type="submit">Guardar</Button>
    </form>
  );
}
```

### Accesibilidad

```typescript
<button aria-label="Cerrar" aria-disabled={disabled}>
<label htmlFor="email">Email</label>
<input id="email" type="email" />
<div role="dialog" aria-modal="true">
```

## Estado y Data Fetching

**Local**: useState para formularios
**Global**: Context API (AppProvider + useAppState)
**Data**: tRPC hooks (useQuery, useMutation) con invalidación de cache

```typescript
'use client';
const { data, isLoading } = api.user.list.useQuery();
const create = api.user.create.useMutation({
  onSuccess: () => api.useContext().user.list.invalidate()
});
```

## Testing y Validación

1. **Zod schemas**: Validar inputs antes de procesamiento
2. **Type safety**: Drizzle queries inferencia automática
3. **Env validation**: Fail-fast con envSchema.parse()
4. **Error boundaries**: Wrap componentes críticos

## Checklist Pre-Commit

**Base de Datos**:
- [ ] Nombres español, campos auditoría, esquema correcto
- [ ] Soft delete (NO DELETE), índices, migration generada
- [ ] NUNCA modificar migraciones existentes, crear nueva

**Código**:
- [ ] TypeScript sin errores, ESLint, Prettier
- [ ] Path aliases (~/)
- [ ] Sin console.log

**Componentes**:
- [ ] 'use client' cuando necesario
- [ ] Props tipadas
- [ ] Colores Lycsa, fuente Aller
- [ ] Accesibilidad (aria-*, labels)
- [ ] Campos requeridos con asterisco rojo (*)
- [ ] Validación cliente antes de enviar
- [ ] Bordes rojos en campos con error

**tRPC**:
- [ ] Inputs con Zod
- [ ] Errores TRPCError
- [ ] SuperJSON en httpBatchLink
- [ ] Transacciones para mutaciones que impactan BD
- [ ] Try-catch-rollback en operaciones múltiples

## Scripts

```bash
npm run dev         # Dev server :3000 (ejecuta migraciones automáticamente)
npm run build       # Build producción
npm run db:studio   # Drizzle Studio
npm run db:generate # Generar migration
npm run db:migrate  # Aplicar migrations (manual)
npm run db:push     # Aplicar migrations (auto)
npm run lint        # ESLint
npm run format      # Prettier
npm run type-check  # TypeScript

docker-compose up -d  # Producción
docker-compose -f docker-compose.dev.yml up  # Desarrollo
```

## Referencias

**Detalladas**: `instructions/database-actions-guide.md` (1033 líneas BD completa), `instructions/DESIGN_SYSTEM.md` (Design System detallado)
**Docs**: Next.js 15, tRPC v11, Drizzle ORM, Tailwind CSS, Zod

**Última actualización**: Enero 2026 | v2.0.0-optimized
