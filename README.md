# 🚀 Template Embajadores - Lycsa Suite

Template fullstack para desarrollo de aplicaciones por dev citizens/embajadores.

## 📋 Características

- ⚡ **Next.js 15** - App Router + React Server Components
- 🔥 **tRPC** - Type-safe API sin código duplicado
- 🗄️ **Drizzle ORM** - ORM TypeScript-first con PostgreSQL
- ☁️ **AWS S3 / MinIO** - Almacenamiento de archivos listo para usar
- 📊 **ExcelJS** - Import/export/procesamiento de Excel
- 🎨 **Tailwind CSS** - Design System Lycsa Suite
- ✅ **Zod** - Validación de schemas y variables de entorno
- 🐳 **Docker** - Dockerfile multi-stage para producción
- 🔒 **TypeScript** - Type-safety en todo el stack

## 🎨 Design System Lycsa Suite

Este template incluye el Design System oficial de Lycsa:

- **Colores institucionales**: Verde y Beige
- **Tipografía**: Aller (Regular, Light, Bold)
- **Componentes**: Button, Input, Card, Modal, Table, Badge, Loader, Toast
- **Estados**: Success, Error, Warning, Info
- **Responsive**: Mobile-first

## 📁 Estructura del Proyecto

```
template-embajadores/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── _trpc/                # Configuración tRPC cliente
│   │   ├── api/                  # API Routes
│   │   │   ├── health/           # Health check
│   │   │   └── trpc/             # tRPC endpoint
│   │   ├── layout.tsx            # Layout principal
│   │   ├── page.tsx              # Home page
│   │   └── globals.css           # Estilos globales
│   │
│   ├── server/                   # Backend
│   │   ├── api/                  # tRPC API
│   │   │   ├── routers/          # Routers de tRPC
│   │   │   ├── trpc.ts           # Configuración tRPC
│   │   │   └── root.ts           # Router principal
│   │   │
│   │   ├── config/               # Configuración
│   │   │   └── env.ts            # Variables de entorno (Zod)
│   │   │
│   │   ├── db/                   # Base de datos
│   │   │   ├── connections.ts    # Conexiones DB
│   │   │   ├── helpers/          # Helpers (soft delete, etc)
│   │   │   ├── migrations/       # Migraciones (vacío)
│   │   │   └── schema/           # Schemas Drizzle (vacío)
│   │   │
│   │   └── services/             # Servicios
│   │       ├── s3/               # Servicio S3/MinIO
│   │       └── excel/            # Servicio Excel
│   │
│   └── ui/                       # UI Components
│       └── components/           # Design System Lycsa
│
├── public/                       # Assets estáticos
│   └── fonts/                    # Tipografía Aller (agregar aquí)
│
├── Dockerfile                    # Imagen producción
├── Dockerfile.dev                # Imagen desarrollo
├── docker-compose.yml            # Compose producción
├── docker-compose.dev.yml        # Compose desarrollo
├── .env.example                  # Variables de entorno ejemplo
└── README.md                     # Este archivo
```

## 🚀 Setup Local

### Prerrequisitos

- Node.js >= 20.0.0
- npm >= 10.0.0
- PostgreSQL 16+ (o usar Docker)

### Instalación

```bash
# 1. Clonar o copiar el template
cd template-embajadores

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno para desarrollo local
cp .env.local.example .env.local
# Editar .env.local con tus valores
# IMPORTANTE: .env.local está en .gitignore y es solo para desarrollo local

# 4. Levantar servicios (PostgreSQL + MinIO)
docker compose -f docker-compose.dev.yml up -d db minio

# 5. Crear tus schemas de base de datos en src/server/db/schema/
# Ver sección "Crear tu Primer Schema" más abajo

# 6. Generar y aplicar migraciones
npm run db:generate   # Genera archivos de migración desde tus schemas
npm run db:migrate    # Aplica las migraciones a la base de datos

# 7. Iniciar desarrollo
npm run dev
```

La aplicación estará disponible en: http://localhost:3000

### Endpoints disponibles

- **App**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health
- **MinIO Console**: http://localhost:9001 (minioadmin / minioadmin)

## 🐳 Setup con Docker

### Desarrollo

```bash
# Configurar variables de entorno primero
cp .env.local.example .env.local
# Editar .env.local si es necesario

# Levantar todo el entorno de desarrollo
docker compose -f docker-compose.dev.yml up

# La app se reconstruirá automáticamente con los cambios
```

### Producción

```bash
# Configurar variables de entorno para producción
cp .env.example .env
# Editar .env con valores de producción

# Build y ejecución
docker compose up --build

# O build separado
docker build -t template-embajadores .
docker run -p 3000:3000 --env-file .env template-embajadores
```

## 🗄️ Base de Datos

### ⚠️ Reglas de Negocio (IMPORTANTE)

Este template **NO incluye tablas de ejemplo**. Las tablas deben ser creadas según las necesidades de cada proyecto siguiendo estas reglas:

#### Nomenclatura

- **Tablas**: plural, snake_case → `productos`, `categorias_productos`
- **Columnas**: snake_case → `nombre_completo`, `fecha_nacimiento`
- **Schemas**: `app`, `audit`, `scraping` (NUNCA `public`)

#### Campos Obligatorios

Todas las tablas deben incluir:

```typescript
created_at: timestamp('created_at').notNull().defaultNow(),
updated_at: timestamp('updated_at').notNull().defaultNow(),
active: boolean('active').notNull().default(true),
additional: jsonb('additional').$type<Record<string, any>>().default({}),
```

### Crear tu Primer Schema

1. Crear archivo en `src/server/db/schema/app/productos.ts`:

```typescript
import { pgTable, serial, varchar, numeric, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { pgSchema } from 'drizzle-orm/pg-core';

const appSchema = pgSchema('app');

export const productos = appSchema.table('productos', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  precio: numeric('precio', { precision: 10, scale: 2 }).notNull(),
  
  // Campos obligatorios
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
  active: boolean('active').notNull().default(true),
  additional: jsonb('additional').$type<Record<string, any>>().default({}),
});
```

2. Generar y aplicar migración:

```bash
npm run db:generate
npm run db:migrate
```

### Soft Delete

Usar `active = false` en lugar de DELETE:

```typescript
import { softDelete, isActive } from '~/server/db/helpers';

// En lugar de eliminar
await softDelete(db, productos, eq(productos.id, id));

// Filtrar solo activos
await db.select().from(productos).where(isActive(productos));
```

### Updated At Automático

```typescript
import { withUpdatedAt } from '~/server/db/helpers';

await db
  .update(productos)
  .set(withUpdatedAt({ nombre: 'Nuevo nombre' }))
  .where(eq(productos.id, id));
```

### Múltiples Bases de Datos

El template soporta conexión a múltiples bases de datos:

```typescript
// Base de datos principal
import { db } from '~/server/db';

// Base de datos secundaria (opcional)
import { dbSecondary } from '~/server/db';

// Configurar en .env
DATABASE_URL=postgresql://...
DATABASE_SECONDARY_URL=postgresql://...
```

## ☁️ S3 / MinIO

### Configuración

En `.env`:

```bash
# Para MinIO local
S3_ENDPOINT=http://localhost:9000
S3_FORCE_PATH_STYLE=true

# Para AWS S3
S3_ENDPOINT=
S3_FORCE_PATH_STYLE=false
```

### Uso

```typescript
import { uploadFile, downloadFile, deleteFile, listFiles } from '~/server/services/s3';

// Subir archivo
await uploadFile({
  key: 'carpeta/archivo.pdf',
  body: buffer,
  contentType: 'application/pdf',
});

// Descargar archivo
const response = await downloadFile({ key: 'carpeta/archivo.pdf' });

// Listar archivos
const files = await listFiles({ prefix: 'carpeta/' });

// Eliminar archivo
await deleteFile({ key: 'carpeta/archivo.pdf' });
```

## 📊 Excel

### Crear Excel

```typescript
import { createExcel } from '~/server/services/excel';

const buffer = await createExcel({
  sheetName: 'Productos',
  columns: [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Nombre', key: 'nombre', width: 30 },
    { header: 'Precio', key: 'precio', width: 15 },
  ],
  data: [
    { id: 1, nombre: 'Producto 1', precio: 100 },
    { id: 2, nombre: 'Producto 2', precio: 200 },
  ],
});

// Guardar o enviar
fs.writeFileSync('productos.xlsx', buffer);
```

### Leer Excel

```typescript
import { readExcel, validateExcelStructure } from '~/server/services/excel';

// Validar estructura
const validation = await validateExcelStructure(
  buffer,
  ['id', 'nombre', 'precio']
);

if (!validation.valid) {
  throw new Error(`Columnas faltantes: ${validation.missingColumns.join(', ')}`);
}

// Leer datos
const data = await readExcel({ buffer });
console.log(data); // [{ id: '1', nombre: 'Producto 1', ... }]
```

### Excel con múltiples hojas

```typescript
import { createMultiSheetExcel } from '~/server/services/excel';

const buffer = await createMultiSheetExcel([
  {
    name: 'Productos',
    columns: [...],
    data: [...]
  },
  {
    name: 'Categorías',
    columns: [...],
    data: [...]
  }
]);
```

## 🔥 tRPC

### Crear un Router

1. Crear `src/server/api/routers/productos.ts`:

```typescript
import { createTRPCRouter, publicProcedure } from '../trpc';
import { z } from 'zod';
import { db } from '~/server/db';
import { productos } from '~/server/db/schema/app/productos';

export const productosRouter = createTRPCRouter({
  listar: publicProcedure.query(async () => {
    return db.select().from(productos).where(isActive(productos));
  }),

  crear: publicProcedure
    .input(z.object({
      nombre: z.string().min(1),
      precio: z.number().positive(),
    }))
    .mutation(async ({ input }) => {
      return db.insert(productos).values({
        ...input,
        created_at: now(),
        updated_at: now(),
        active: true,
      }).returning();
    }),
});
```

2. Agregar al router principal en `src/server/api/root.ts`:

```typescript
import { productosRouter } from './routers/productos';

export const appRouter = createTRPCRouter({
  system: systemRouter,
  productos: productosRouter, // ← Agregar aquí
});
```

### Usar en el Cliente

```typescript
'use client';

import { api } from '~/app/_trpc/Provider';

export default function ProductosPage() {
  const { data, isLoading } = api.productos.listar.useQuery();
  const crearMutation = api.productos.crear.useMutation();

  const handleCrear = async () => {
    await crearMutation.mutateAsync({
      nombre: 'Producto nuevo',
      precio: 100,
    });
  };

  return <div>...</div>;
}
```

## 🎨 Componentes UI

Todos los componentes del Design System están disponibles:

```typescript
import { Button, Input, Card, Modal, Table, Badge, Loader, useToast } from '~/ui/components';

// Button
<Button variant="primary" size="md" onClick={handleClick}>
  Guardar
</Button>

// Input
<Input
  label="Nombre"
  placeholder="Ingrese el nombre"
  error="Campo requerido"
/>

// Card
<Card title="Título" subtitle="Subtítulo">
  Contenido
</Card>

// Modal
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirmar"
>
  ¿Estás seguro?
</Modal>

// Table
<Table
  columns={[
    { key: 'id', header: 'ID' },
    { key: 'nombre', header: 'Nombre' },
  ]}
  data={productos}
/>

// Badge
<Badge variant="success">Activo</Badge>

// Loader
<Loader size="md" text="Cargando..." />

// Toast
const { addToast } = useToast();
addToast('Guardado exitosamente', 'success');
```

## 📝 Scripts

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo
npm run build            # Build para producción
npm run start            # Iniciar servidor de producción

# Base de datos
npm run db:generate      # Generar migración
npm run db:migrate       # Aplicar migraciones
npm run db:studio        # Abrir Drizzle Studio

# Code quality
npm run lint             # Ejecutar ESLint
npm run format           # Formatear código con Prettier
npm run format:check     # Verificar formato
npm run type-check       # Verificar tipos TypeScript
```

## 🔒 Variables de Entorno

Ver `.env.example` para todas las variables disponibles.

**Variables requeridas**:
- `DATABASE_URL`: Conexión a PostgreSQL

**Variables opcionales**:
- `DATABASE_SECONDARY_URL`: Segunda base de datos
- `S3_*`: Configuración S3/MinIO
- `NEXT_PUBLIC_APP_URL`: URL pública

## 🚢 Deploy a Producción

### Dockerfile

El template incluye un Dockerfile multi-stage optimizado:

```bash
docker build -t lycsa-app .
docker run -p 3000:3000 --env-file .env lycsa-app
```

### Checklist Pre-Deploy

- [ ] Configurar variables de entorno de producción
- [ ] Ejecutar migraciones en DB de producción
- [ ] Configurar S3 real (o mantener MinIO)
- [ ] Verificar health check: `/api/health`
- [ ] Configurar logging y monitoreo

## 🤝 Crear tu Primer CRUD

### 1. Definir Schema

`src/server/db/schema/app/productos.ts`

```typescript
import { pgSchema, pgTable, serial, varchar, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

const appSchema = pgSchema('app');

export const productos = appSchema.table('productos', {
  id: serial('id').primaryKey(),
  nombre: varchar('nombre', { length: 255 }).notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
  active: boolean('active').notNull().default(true),
  additional: jsonb('additional').$type<Record<string, any>>().default({}),
});
```

### 2. Generar Migración

```bash
npm run db:generate
npm run db:migrate
```

### 3. Crear Router tRPC

`src/server/api/routers/productos.ts`

```typescript
import { createTRPCRouter, publicProcedure } from '../trpc';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '~/server/db';
import { productos } from '~/server/db/schema/app/productos';
import { softDelete, isActive, withUpdatedAt, now } from '~/server/db/helpers';

export const productosRouter = createTRPCRouter({
  listar: publicProcedure.query(async () => {
    return db.select().from(productos).where(isActive(productos));
  }),

  obtener: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const [producto] = await db
        .select()
        .from(productos)
        .where(eq(productos.id, input.id))
        .limit(1);
      return producto;
    }),

  crear: publicProcedure
    .input(z.object({ nombre: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const [producto] = await db
        .insert(productos)
        .values({
          nombre: input.nombre,
          created_at: now(),
          updated_at: now(),
          active: true,
        })
        .returning();
      return producto;
    }),

  actualizar: publicProcedure
    .input(z.object({
      id: z.number(),
      nombre: z.string().min(1),
    }))
    .mutation(async ({ input }) => {
      const [producto] = await db
        .update(productos)
        .set(withUpdatedAt({ nombre: input.nombre }))
        .where(eq(productos.id, input.id))
        .returning();
      return producto;
    }),

  eliminar: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await softDelete(db, productos, eq(productos.id, input.id));
    }),
});
```

### 4. Registrar Router

`src/server/api/root.ts`

```typescript
export const appRouter = createTRPCRouter({
  system: systemRouter,
  productos: productosRouter, // ← Agregar
});
```

### 5. Crear Página

`src/app/productos/page.tsx`

```typescript
'use client';

import { api } from '~/app/_trpc/Provider';
import { Button, Card, Table, useToast } from '~/ui/components';
import { useState } from 'react';

export default function ProductosPage() {
  const { addToast } = useToast();
  const { data: productos, refetch } = api.productos.listar.useQuery();
  const crearMutation = api.productos.crear.useMutation();
  const eliminarMutation = api.productos.eliminar.useMutation();

  const handleCrear = async () => {
    try {
      await crearMutation.mutateAsync({ nombre: 'Producto nuevo' });
      addToast('Producto creado', 'success');
      refetch();
    } catch (error) {
      addToast('Error al crear producto', 'error');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card title="Productos">
        <div className="mb-4">
          <Button onClick={handleCrear}>Crear Producto</Button>
        </div>
        
        <Table
          columns={[
            { key: 'id', header: 'ID' },
            { key: 'nombre', header: 'Nombre' },
          ]}
          data={productos ?? []}
        />
      </Card>
    </div>
  );
}
```

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [tRPC Docs](https://trpc.io/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zod Docs](https://zod.dev)

## 🔧 Scripts NPM Disponibles

### Desarrollo
- `npm run dev` - Aplica migraciones y levanta el servidor de desarrollo
- `npm run build` - Build de producción
- `npm start` - Inicia el servidor de producción

### Base de Datos
- `npm run db:generate` - **Genera archivos de migración** desde tus schemas de Drizzle
- `npm run db:migrate` - **Aplica las migraciones** generadas a la base de datos
- `npm run db:push` - **Push directo** de schema a DB (sin generar archivos de migración, útil para desarrollo rápido)
- `npm run db:studio` - Abre Drizzle Studio para visualizar la base de datos

### Calidad de Código
- `npm run lint` - Ejecuta ESLint
- `npm run format` - Formatea código con Prettier
- `npm run format:check` - Verifica formato sin modificar
- `npm run type-check` - Verifica tipos de TypeScript

### Flujo de Trabajo Recomendado

**Desarrollo con Migraciones (Recomendado para producción):**
```bash
# 1. Crear o modificar schema
# 2. Generar migración
npm run db:generate

# 3. Revisar archivos en src/server/db/migrations/
# 4. Aplicar migración
npm run db:migrate

# 5. Commitear schema + archivos de migración
git add src/server/db/schema src/server/db/migrations
git commit -m "feat: agregar tabla productos"
```

**Desarrollo Rápido (Solo para experimentar):**
```bash
# Push directo sin crear archivos de migración
npm run db:push
# ⚠️ No usar en producción, no deja historial de cambios
```

## 🔍 Troubleshooting

### Variables de entorno no se cargan

**Problema:** La app no encuentra DATABASE_URL u otras variables.

**Solución:**
```bash
# Asegúrate de tener .env.local para desarrollo
cp .env.local.example .env.local

# Verifica que el archivo existe
ls -la .env.local

# Next.js carga automáticamente:
# 1. .env.local (prioridad alta, solo desarrollo)
# 2. .env (fallback)
```

### Error: "No migrations found"

**Problema:** Al ejecutar `npm run db:migrate` dice que no hay migraciones.

**Solución:**
```bash
# 1. Asegúrate de tener schemas definidos en src/server/db/schema/
# 2. Genera las migraciones primero
npm run db:generate

# 3. Ahora aplica las migraciones
npm run db:migrate
```

### Error de conexión a PostgreSQL

**Problema:** Cannot connect to database.

**Solución:**
```bash
# Verifica que PostgreSQL está corriendo
docker compose -f docker-compose.dev.yml up -d db

# Verifica que DATABASE_URL es correcto en .env.local
# Desarrollo local: postgresql://postgres:postgres@localhost:5432/lycsa_app
# Docker: postgresql://postgres:postgres@db:5432/lycsa_app
```

### Diferencia entre db:push y db:migrate

**db:generate + db:migrate (Recomendado):**
- ✅ Crea archivos de migración versionados
- ✅ Historial de cambios rastreable
- ✅ Rollback posible
- ✅ Usar en producción
- ⚠️ Requiere dos pasos

**db:push (Solo desarrollo):**
- ✅ Rápido para experimentar
- ✅ Un solo comando
- ❌ Sin historial de cambios
- ❌ No usar en producción
- ❌ No permite rollback

## ⚠️ Notas Importantes

- ✅ Este template NO incluye tablas de ejemplo
- ✅ NO crear tablas en el schema `public`
- ✅ Siempre usar soft delete (`active = false`)
- ✅ Usar `.env.local` para desarrollo local (está en .gitignore)
- ✅ Usar `.env` para valores por defecto o CI/CD
- ✅ Generar migraciones con `db:generate` + `db:migrate` para producción
- ✅ Siempre incluir los 4 campos obligatorios
- ✅ Usar helpers `withUpdatedAt` en updates
- ✅ Usar helpers `softDelete` en lugar de DELETE

## 📄 Licencia

Template interno de Lycsa Suite para uso de embajadores.

---

**¿Preguntas?** Contacta al equipo de desarrollo.
