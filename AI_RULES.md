# AI Development Rules - Template Embajadores Lycsa Suite

Reglas de desarrollo optimizadas para agentes de IA. Más detalles en `instructions/database-actions-guide.md` y `instructions/DESIGN_SYSTEM.md`.

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
npm run db:migrate   # Aplicar
npm run db:studio    # Ver esquema
```

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
  ({ label, error, className, ...props }, ref) => (
    <div>
      {label && <label className="text-sm font-bold">{label}</label>}
      <input ref={ref} className={cn('w-full rounded-md border px-3 py-2', error && 'border-red-500', className)} {...props} />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
);
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

**Código**:
- [ ] TypeScript sin errores, ESLint, Prettier
- [ ] Path aliases (~/)
- [ ] Sin console.log

**Componentes**:
- [ ] 'use client' cuando necesario
- [ ] Props tipadas
- [ ] Colores Lycsa, fuente Aller
- [ ] Accesibilidad (aria-*, labels)

**tRPC**:
- [ ] Inputs con Zod
- [ ] Errores TRPCError
- [ ] SuperJSON en httpBatchLink

## Scripts

```bash
npm run dev         # Dev server :3000
npm run build       # Build producción
npm run db:studio   # Drizzle Studio
npm run db:generate # Generar migration
npm run db:migrate  # Aplicar migrations
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
