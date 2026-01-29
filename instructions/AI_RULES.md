# AI Development Rules - Template Embajadores Lycsa Suite

Reglas de desarrollo optimizadas para agentes de IA. Más detalles en `instructions/database-actions-guide.md`, `instructions/DESIGN_SYSTEM.md` y `instructions/COMPONENTS.md`.

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

Definir el schema con `pgSchema` y crear las tablas usando `appSchema.table`:
```typescript
import { pgSchema, bigserial, uuid, timestamp, boolean, jsonb, index } from 'drizzle-orm/pg-core';

const appSchema = pgSchema('app');

export const usuarios = appSchema.table('usuarios', {
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

**NUNCA usar `pgTable` directamente**:
```typescript
// NO USAR
export const users = pgTable('users', { ... });
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

### Migraciones:

```bash
npm run db:generate  # Generar
npm run db:migrate   # Aplicar (manual)
npm run db:push      # Aplicar (auto en dev)
npm run db:studio    # Ver esquema
```

**REGLA CRÍTICA - Migraciones**:
- Usar `CREATE SCHEMA IF NOT EXISTS`, `CREATE TABLE IF NOT EXISTS` y `CREATE INDEX IF NOT EXISTS`
- NUNCA usar `CREATE SCHEMA` sin `IF NOT EXISTS`
- NUNCA modificar archivos de migración existentes (src/server/db/migrations/)
- SIEMPRE crear nueva migración para cambios: modificar schema → `npm run db:generate`
- Las migraciones son inmutables una vez creadas
- Razón: Evita inconsistencias entre entornos (dev/staging/prod)

**Nota**: `npm run dev` ejecuta automáticamente `db:generate` y `db:push` antes de iniciar el servidor.

## Desarrollo Proactivo (Backend + Frontend)

**REGLA CRÍTICA - Crear Stack Completo Automáticamente**:

Cuando el usuario mencione entidades o funcionalidades, **INMEDIATAMENTE crear stack completo** (schemas, routers, páginas, componentes) SIN esperar confirmación.

### Proceso Automático

1. **Identificar entidades** del prompt (sustantivos clave del dominio)
2. **Crear schemas DB** en `src/server/db/schema/{entidad}.ts` con campos obligatorios + campos inferidos
3. **Crear routers tRPC** en `src/server/api/routers/{entidad}.ts` con CRUD completo
4. **Crear páginas** en `src/app/{entidad}/page.tsx` con tabla + formulario
5. **Actualizar** `src/server/api/root.ts` y `src/server/db/schema/index.ts`
6. **Ejecutar migraciones** automáticamente con `npm run dev`
7. **Informar brevemente** qué se creó

**NO hacer**: Preguntar confirmación antes de crear código

### Ejemplo: Usuario dice "necesito gestionar productos y categorías"

**Acción inmediata** (crear automáticamente):

#### 1. Schemas DB (con relaciones y campos obligatorios)

**src/server/db/schema/productos.ts**:
```typescript
import { pgSchema, bigserial, uuid, varchar, text, decimal, bigint, timestamp, boolean, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { categorias } from './categorias';

const appSchema = pgSchema('app');

export const productos = appSchema.table('productos', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  idPublico: uuid('id_publico').notNull().defaultRandom().unique(),
  
  // Campos negocio
  nombre: varchar('nombre', { length: 255 }).notNull(),
  descripcion: text('descripcion'),
  precio: decimal('precio', { precision: 10, scale: 2 }).notNull(),
  stock: bigint('stock', { mode: 'number' }).notNull().default(0),
  categoriaId: bigint('categoria_id', { mode: 'number' }).references(() => categorias.id),
  
  // Auditoría obligatoria
  fechaCreacion: timestamp('fecha_creacion', { withTimezone: true }).notNull().defaultNow(),
  fechaActualizacion: timestamp('fecha_actualizacion', { withTimezone: true }).notNull().defaultNow(),
  activo: boolean('activo').notNull().default(true),
  adicional: jsonb('adicional').notNull().default({}),
}, (table) => ({
  idPublicoIdx: index('idx_productos_id_publico').on(table.idPublico),
  categoriaIdIdx: index('idx_productos_categoria_id').on(table.categoriaId),
}));

export const productosRelations = relations(productos, ({ one }) => ({
  categoria: one(categorias, {
    fields: [productos.categoriaId],
    references: [categorias.id],
  }),
}));
```

**src/server/db/schema/categorias.ts**:
```typescript
import { pgSchema, bigserial, uuid, varchar, text, timestamp, boolean, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { productos } from './productos';

const appSchema = pgSchema('app');

export const categorias = appSchema.table('categorias', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  idPublico: uuid('id_publico').notNull().defaultRandom().unique(),
  
  // Campos negocio
  nombre: varchar('nombre', { length: 255 }).notNull().unique(),
  descripcion: text('descripcion'),
  
  // Auditoría obligatoria
  fechaCreacion: timestamp('fecha_creacion', { withTimezone: true }).notNull().defaultNow(),
  fechaActualizacion: timestamp('fecha_actualizacion', { withTimezone: true }).notNull().defaultNow(),
  activo: boolean('activo').notNull().default(true),
  adicional: jsonb('adicional').notNull().default({}),
}, (table) => ({
  idPublicoIdx: index('idx_categorias_id_publico').on(table.idPublico),
}));

export const categoriasRelations = relations(categorias, ({ many }) => ({
  productos: many(productos),
}));
```

**src/server/db/schema/index.ts**:
```typescript
export * from './productos';
export * from './categorias';
```

#### 2. Routers tRPC (CRUD completo con transacciones)

**src/server/api/routers/productos.ts**:
```typescript
import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { productos } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
import { withUpdatedAt } from '~/server/db/helpers';

export const productosRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.productos.findMany({
      where: eq(productos.activo, true),
      with: { categoria: true },
    });
  }),

  create: publicProcedure
    .input(z.object({
      nombre: z.string().min(2),
      precio: z.string(),
      stock: z.number(),
      categoriaId: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      const categoria = await ctx.db.query.categorias.findFirst({
        where: eq(categorias.idPublico, input.categoriaId),
      });
      
      const [producto] = await ctx.db.insert(productos)
        .values({ ...input, categoriaId: categoria!.id })
        .returning();
      
      return { id: producto.idPublico };
    }),

  delete: publicProcedure
    .input(z.string().uuid())
    .mutation(async ({ ctx, input }) => {
      const producto = await ctx.db.query.productos.findFirst({
        where: eq(productos.idPublico, input),
      });
      
      await ctx.db.update(productos)
        .set(withUpdatedAt({ activo: false }))
        .where(eq(productos.id, producto!.id));
    }),
});
```

#### 3. Páginas con tabla + formulario + validación

**src/app/productos/page.tsx**:
```typescript
'use client';
import { useState } from 'react';
import { api } from '~/app/_trpc/client';
import { Button, Card, Modal, Table, Typography } from '~/ui/components';
import { Input, Select } from '~/ui/components/forms';
import { z } from 'zod';

const productoSchema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  precio: z.string(),
  stock: z.number(),
  categoriaId: z.string().uuid('Selecciona una categoría'),
});

export default function ProductosPage() {
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { data: productos, isLoading } = api.productos.list.useQuery();
  const { data: categorias } = api.categorias.list.useQuery();
  
  const createMutation = api.productos.create.useMutation({
    onSuccess: () => {
      api.useContext().productos.list.invalidate();
      setShowModal(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      nombre: formData.get('nombre'),
      precio: formData.get('precio'),
      stock: Number(formData.get('stock')),
      categoriaId: formData.get('categoriaId'),
    };
    
    const result = productoSchema.safeParse(data);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        newErrors[issue.path[0]] = issue.message;
      });
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    createMutation.mutate(result.data);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-wide text-lycsa-accent">
          Gestión de Productos
        </h1>
        <Button onClick={() => setShowModal(true)}>Nuevo Producto</Button>
      </div>

      <Card>
        <Table
          columns={[
            { key: 'nombre', header: 'Nombre' },
            { key: 'precio', header: 'Precio' },
            { key: 'stock', header: 'Stock' },
            { key: 'categoria.nombre', header: 'Categoría' },
          ]}
          data={productos || []}
        />
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nuevo Producto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="nombre" label="Nombre" required error={errors.nombre} touched={!!errors.nombre} />
          <Input name="precio" label="Precio" type="number" step="0.01" required error={errors.precio} touched={!!errors.precio} />
          <Input name="stock" label="Stock" type="number" required error={errors.stock} touched={!!errors.stock} />
          <Select
            label="Categoría"
            options={categorias?.map(cat => ({ label: cat.nombre, value: cat.id })) || []}
            placeholder="Seleccionar categoría"
            required
            error={errors.categoriaId}
          />
          <Button label="Guardar" type="submit" variant="contained" color="primary" />
        </form>
      </Modal>
    </div>
  );
}
```

#### 4. Actualizar Home (/) según contexto

La página Home (`src/app/page.tsx`) NO es inmutable. Adaptarla al proyecto:

```typescript
// src/app/page.tsx - Ejemplo Dashboard
'use client';
import { Button, Typography } from '~/ui/components';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto p-6">
      <Typography variant="h2" className="mb-6">
        Dashboard - Gestión Comercial
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/productos">
          <Button label="Productos" variant="contained" color="primary" fullWidth />
        </Link>
        <Link href="/categorias">
          <Button label="Categorías" variant="contained" color="primary" fullWidth />
        </Link>
      </div>
    </div>
  );
}
```

### Validaciones Automáticas Pre-Creación

Antes de crear archivos, validar automáticamente:
1. **Archivo existe** → Leer contenido, actualizar o crear versión mejorada
2. **Nombres español + snake_case** → Convertir automáticamente si vienen en inglés
3. **Campos obligatorios** → Agregar (id, idPublico, fechas, activo, adicional)
4. **pgSchema('app')** → NUNCA usar pgTable directamente

### Comunicación al Usuario

Tras completar creación, informar brevemente:
```
Stack completo creado para productos y categorías:

Backend:
- src/server/db/schema/productos.ts
- src/server/db/schema/categorias.ts  
- src/server/api/routers/productos.ts
- src/server/api/routers/categorias.ts

Frontend:
- src/app/productos/page.tsx
- src/app/categorias/page.tsx
- src/app/page.tsx (actualizado)
```

### Validaciones Pre-Creación

Antes de crear schemas, verificar:
1. ¿El archivo ya existe? → No sobrescribir, preguntar primero
2. ¿Nombres en español y snake_case? → Convertir automáticamente
3. ¿Todos los campos obligatorios incluidos? → Agregar si faltan
4. ¿Usa pgSchema('app')? → NUNCA pgTable directo

### Comunicación al Usuario

Tras crear schemas, informar brevemente:
```
He creado los schemas para productos y categorías con sus relaciones.
Archivos generados:
- src/server/db/schema/productos.ts
- src/server/db/schema/categorias.ts
```

**NO preguntar "¿quieres que cree los schemas?"** → Acción directa, informar después.

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
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    
    // Marcar todos como touched al enviar
    setTouched({ email: true, nombre: true });
    
    // Validar antes de enviar
    const result = formSchema.safeParse(data);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        newErrors[issue.path[0] as string] = issue.message;
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
        id="email"
        label="Email"
        type="email"
        required
        error={errors.email}
        touched={touched.email}
      />
      <Input
        id="nombre"
        label="Nombre"
        required
        error={errors.nombre}
        touched={touched.nombre}
      />
      <Button label="Guardar" type="submit" variant="contained" color="primary" />
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

**Detalladas**: `instructions/database-actions-guide.md` (1033 líneas BD completa), `instructions/DESIGN_SYSTEM.md` (Design System detallado), `instructions/COMPONENTS.md` (Librería de componentes)
**Docs**: Next.js 15, tRPC v11, Drizzle ORM, Tailwind CSS, Zod

**Última actualización**: Enero 2026 | v2.0.0-optimized
