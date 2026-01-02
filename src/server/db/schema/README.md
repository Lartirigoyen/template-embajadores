# Directorio de schemas

Este directorio debe contener los schemas de Drizzle ORM organizados por dominio.

## ⚠️ IMPORTANTE

Este template NO incluye schemas de ejemplo. Cada proyecto debe crear sus propios schemas según las necesidades del negocio.

## Estructura recomendada

```
schema/
  app/           # Tablas de negocio principal
    productos.ts
    categorias.ts
  audit/         # Auditoría
    logs.ts
  scraping/      # Integraciones
    external.ts
```

## Reglas para crear tablas

### Nomenclatura
- Tablas: plural, snake_case (ej: `productos`, `categorias_productos`)
- Columnas: snake_case (ej: `nombre_completo`, `fecha_nacimiento`)
- Schemas: `app`, `audit`, `scraping` (NUNCA `public`)

### Campos obligatorios en TODAS las tablas

```typescript
import { pgTable, serial, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { pgSchema } from 'drizzle-orm/pg-core';

const appSchema = pgSchema('app');

export const ejemplo = appSchema.table('ejemplo', {
  id: serial('id').primaryKey(),
  
  // ... tus campos de negocio ...
  
  // ⬇️ CAMPOS OBLIGATORIOS ⬇️
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
  active: boolean('active').notNull().default(true),
  additional: jsonb('additional').$type<Record<string, any>>().default({}),
});
```

### Soft Delete
Usar `active = false` en lugar de DELETE físico.

```typescript
// ❌ NO hacer esto
await db.delete(productos).where(eq(productos.id, id));

// ✅ Hacer esto
import { softDelete } from '~/server/db/helpers';
await softDelete(db, productos, eq(productos.id, id));
```

### Updated At automático
Siempre actualizar `updated_at` en updates:

```typescript
import { withUpdatedAt } from '~/server/db/helpers';

await db
  .update(productos)
  .set(withUpdatedAt({
    nombre: 'Nuevo nombre'
  }))
  .where(eq(productos.id, id));
```

## Ejemplo completo de schema

```typescript
import { pgTable, serial, varchar, numeric, timestamp, boolean, jsonb, integer } from 'drizzle-orm/pg-core';
import { pgSchema } from 'drizzle-orm/pg-core';

// Definir schema (NUNCA usar 'public')
const appSchema = pgSchema('app');

export const productos = appSchema.table('productos', {
  id: serial('id').primaryKey(),
  
  // Campos de negocio
  nombre: varchar('nombre', { length: 255 }).notNull(),
  descripcion: varchar('descripcion', { length: 1000 }),
  precio: numeric('precio', { precision: 10, scale: 2 }).notNull(),
  categoria_id: integer('categoria_id').references(() => categorias.id),
  
  // Campos obligatorios
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
  active: boolean('active').notNull().default(true),
  additional: jsonb('additional').$type<Record<string, any>>().default({}),
});

export const categorias = appSchema.table('categorias', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  
  // Campos obligatorios
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
  active: boolean('active').notNull().default(true),
  additional: jsonb('additional').$type<Record<string, any>>().default({}),
});
```

## Generar migración

Después de crear/modificar schemas:

```bash
npm run db:generate
npm run db:migrate
```
