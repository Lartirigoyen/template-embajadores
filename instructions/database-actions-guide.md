# Guía de Acciones de Base de Datos – PostgreSQL

## 1. USAR ESQUEMAS SIEMPRE

### ✅ Acción Requerida
Toda base de datos debe organizarse con esquemas. Nunca usar el esquema `public` por defecto.

### Esquemas Estándar
```sql
CREATE SCHEMA IF NOT EXISTS app;
CREATE SCHEMA IF NOT EXISTS audit;
```

- **`app`** → tablas operativas de aplicaciones
- **`audit`** → logs y auditoría
- **`scraping`** → (opcional) solo si se trabaja con scraping de datos

---

## 2. PREFIJOS DE TABLAS

### ✅ Regla General
**Las tablas de entidades normales NO llevan prefijo**: productos, usuarios, órdenes, categorías, etc.

**Solo usar prefijos en casos especiales**:

| Prefijo | Cuándo Usar |
|---------|-------------|
| `rel_` | Tablas de relación muchos-a-muchos (junction tables) |
| `stg_` | Datos crudos, staging, sin procesar |
| `bulk_` | Cargas masivas temporales |
| `audit_` | Logs, auditoría, historial |

### Ejemplos
```sql
-- ✅ CORRECTO (nombres en español)
CREATE TABLE app.usuarios (...);
CREATE TABLE app.productos (...);
CREATE TABLE app.ordenes (...);
CREATE TABLE app.categorias (...);
CREATE TABLE app.rel_usuario_rol (...);
CREATE TABLE scraping.stg_productos_raw (...);
CREATE TABLE app.bulk_importacion_clientes (...);
CREATE TABLE audit.audit_intentos_login (...);

-- ❌ INCORRECTO
CREATE TABLE public.usuarios (...);
CREATE TABLE app.usuarios (...);
CREATE TABLE app.products (...);
```

---

## 3. CAMPOS DE AUDITORÍA (OBLIGATORIOS)

### ✅ Acción Requerida
TODA tabla persistente DEBE incluir estos 4 campos:

```sql
fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
activo BOOLEAN NOT NULL DEFAULT TRUE,
adicional JSONB NOT NULL DEFAULT '{}'::JSONB
```

### Semántica de Campos
- **`fecha_creacion`**: Timestamp de creación del registro
- **`fecha_actualizacion`**: Timestamp de última modificación
- **`activo`**: Flag para soft delete (FALSE = eliminado lógicamente)
- **`adicional`**: Campos adicionales en formato flexible

### Excepción
Tablas con prefijo `bulk_` que sean **realmente efímeras** pueden omitir `activo` y `adicional`.

---

## 4. PLANTILLA OBLIGATORIA PARA CREAR TABLAS

### ⚠️ IMPORTANTE: Nombres en Español
**Todos los nombres de tablas y columnas DEBEN estar en español** (excepto los campos de auditoría estándar).

### ✅ Template Estándar

```sql
/**
 * TABLA: app.nombre_tabla
 * DESCRIPCIÓN: [Propósito de la tabla]
 */
CREATE TABLE app.nombre_tabla (
    -- ID INTERNO (PRIMARY KEY) - NUNCA exponer al frontend
    id BIGSERIAL PRIMARY KEY,
    
    -- ID PÚBLICO (para frontend/API) - SIEMPRE usar este en respuestas
    id_publico UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,

    -- Campos específicos del negocio (en español)
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    
    -- Auditoría (OBLIGATORIO)
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    adicional JSONB NOT NULL DEFAULT '{}'::JSONB
);

-- Índice para búsquedas por id_publico
CREATE INDEX idx_nombre_tabla_id_publico ON app.nombre_tabla(id_publico);
```

### ✅ Ejemplo: Tabla de Usuarios

```sql
/**
 * TABLA: app.usuarios
 * DESCRIPCIÓN: Usuarios del sistema
 */
CREATE TABLE app.usuarios (
    id BIGSERIAL PRIMARY KEY,
    id_publico UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    nombre_usuario VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    
    -- Auditoría
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    adicional JSONB NOT NULL DEFAULT '{}'::JSONB
);

CREATE INDEX idx_usuarios_id_publico ON app.usuarios(id_publico);
```

### ✅ Ejemplo: Tabla Relacional

```sql
/**
 * TABLA: app.rel_usuarios_roles
 * DESCRIPCIÓN: Relación muchos-a-muchos entre usuarios y roles
 */
CREATE TABLE app.rel_usuarios_roles (
    id BIGSERIAL PRIMARY KEY,
    id_publico UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    usuario_id BIGINT NOT NULL REFERENCES app.usuarios(id),
    rol_id BIGINT NOT NULL REFERENCES app.roles(id),
    
    -- Auditoría
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    adicional JSONB NOT NULL DEFAULT '{}'::JSONB,
    
    UNIQUE(usuario_id, rol_id)
);

CREATE INDEX idx_rel_usuarios_roles_id_publico ON app.rel_usuarios_roles(id_publico);
```

### ✅ Ejemplo: Tabla de Staging

```sql
/**
 * TABLA: scraping.stg_productos
 * DESCRIPCIÓN: Datos crudos de productos scrapeados
 */
CREATE TABLE scraping.stg_productos (
    id BIGSERIAL PRIMARY KEY,
    id_publico UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    datos_crudos JSONB NOT NULL,
    url_fuente TEXT,
    
    -- Auditoría
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    adicional JSONB NOT NULL DEFAULT '{}'::JSONB
);

CREATE INDEX idx_stg_productos_id_publico ON scraping.stg_productos(id_publico);
```

---

## 5. ACTUALIZAR EL CAMPO `fecha_actualizacion`

### ✅ Acción Requerida en Aplicación
Cada vez que ejecutes un UPDATE, actualiza manualmente `fecha_actualizacion`:

```sql
-- ✅ CORRECTO
UPDATE app.usuarios 
SET 
    email = 'nuevo@email.com',
    fecha_actualizacion = CURRENT_TIMESTAMP
WHERE id = 123;

-- ❌ INCORRECTO (olvidaste fecha_actualizacion)
UPDATE app.usuarios 
SET email = 'nuevo@email.com'
WHERE id = 123;
```

### Opción: Trigger Automático (Opcional)
Si prefieres automatizar:

```sql
CREATE OR REPLACE FUNCTION update_fecha_actualizacion_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_fecha_actualizacion
BEFORE UPDATE ON app.usuarios
FOR EACH ROW
EXECUTE FUNCTION update_fecha_actualizacion_column();
```

---

## 6. TIPOS DE DATOS A USAR

### ✅ Tabla de Referencia

| Caso de Uso | Tipo PostgreSQL | Ejemplo |
|-------------|-----------------|---------|
| ID interno (PK) | `BIGSERIAL` | `id BIGSERIAL PRIMARY KEY` |
| ID público (único) | `UUID` | `id_publico UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE` |
| Foreign Key | `BIGINT` | `usuario_id BIGINT REFERENCES app.usuarios(id)` |
| Fecha y hora | `TIMESTAMPTZ` | `fecha_creacion TIMESTAMPTZ` |
| Booleano | `BOOLEAN` | `activo BOOLEAN` |
| Texto corto (longitud fija) | `VARCHAR(n)` | `codigo VARCHAR(50)` |
| Texto largo | `TEXT` | `descripcion TEXT` |
| Datos JSON flexibles | `JSONB` | `adicional JSONB` |
| Números decimales | `DECIMAL(p,s)` | `precio DECIMAL(10,2)` |
| Enteros pequeños | `INTEGER` | `cantidad INTEGER` |
| Enteros grandes | `BIGINT` | `contador_vistas BIGINT` |
| Enumerados | `VARCHAR + CHECK` | Ver ejemplo abajo |

### ✅ Ejemplo: Campo Enumerado

```sql
CREATE TABLE app.ordenes (
    id BIGSERIAL PRIMARY KEY,
    id_publico UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('pendiente', 'procesando', 'completado', 'cancelado')),
    
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    adicional JSONB NOT NULL DEFAULT '{}'::JSONB
);

CREATE INDEX idx_ordenes_id_publico ON app.ordenes(id_publico);
```

### ❌ Evitar
- `TIMESTAMP` sin zona horaria → Usar `TIMESTAMPTZ`
- `CHAR(n)` → Preferir `VARCHAR(n)`
- `JSON` → Preferir `JSONB` (indexable y más rápido)

---

## 6.1. SEGURIDAD: ID vs ID_PUBLICO

### ⚠️ REGLA CRÍTICA DE SEGURIDAD

**NUNCA exponer el ID autoincremental (BIGINT) al frontend o APIs públicas.**

### ✅ Por qué esta convención?

1. **Seguridad**: Los IDs autoincrementales revelan información sobre el volumen de datos
2. **Enumeración**: Atacantes pueden iterar fácilmente (usuarios/1, usuarios/2, usuarios/3...)
3. **Privacidad**: Oculta patrones de crecimiento del negocio

### ✅ Uso Correcto

```sql
-- ✅ CORRECTO: Buscar por id_publico cuando viene del frontend
SELECT * FROM app.usuarios 
WHERE id_publico = 'uuid-desde-frontend'
  AND activo = TRUE;

-- ✅ CORRECTO: JOIN usando id interno (más eficiente)
SELECT 
    o.id,
    o.id_publico,  -- Exponer este
    u.nombre_usuario
FROM app.ordenes o
INNER JOIN app.usuarios u ON o.usuario_id = u.id  -- JOIN con BIGINT
WHERE o.activo = TRUE;

-- ✅ CORRECTO: Retornar id_publico al frontend
SELECT 
    id_publico as id,  -- Renombrar para frontend
    nombre,
    email
FROM app.usuarios
WHERE id_publico = $1;
```

### ❌ Uso Incorrecto

```sql
-- ❌ INCORRECTO: Exponer id autoincremental
SELECT 
    id,  -- ¡NO! Esto expone el BIGINT
    nombre,
    email
FROM app.usuarios;

-- ❌ INCORRECTO: Buscar por id cuando viene del frontend
SELECT * FROM app.usuarios WHERE id = $1;  -- Debería ser id_publico
```

### ✅ Flujo Completo: Frontend → Backend → Database

```typescript
// 1. Frontend envía UUID
const response = await fetch('/api/users/a1b2c3d4-uuid-here');

// 2. Backend recibe UUID y busca por id_publico
const user = await db.query.usuarios.findFirst({
  where: eq(usuarios.idPublico, uuidFromFrontend)
});

// 3. Backend usa id interno para JOINs
const ordenes = await db.select()
  .from(ordenes)
  .where(eq(ordenes.usuarioId, user.id));  // ✅ JOIN con BIGINT

// 4. Backend retorna id_publico al frontend
return {
  id: user.idPublico,  // ✅ Exponer UUID
  nombre: user.nombre,
  ordenes: ordenes.map(o => ({
    id: o.idPublico,  // ✅ Exponer UUID de orden
    total: o.total
  }))
};
```

---

## 7. CREAR ÍNDICES

### ✅ Cuándo Crear Índices
Crear índice para columnas usadas en:
- **WHERE**: Filtrado de registros
- **JOIN**: Relaciones entre tablas
- **ORDER BY**: Ordenamiento

### ✅ Ejemplos de Índices

```sql
-- Índice simple
CREATE INDEX idx_usuarios_email ON app.usuarios(email);

-- Índice compuesto
CREATE INDEX idx_ordenes_usuario_estado ON app.ordenes(usuario_id, estado);

-- Índice parcial (solo registros activos)
CREATE INDEX idx_usuarios_activo ON app.usuarios(email) WHERE activo = TRUE;

-- Índice GIN para JSONB
CREATE INDEX idx_productos_adicional ON app.productos USING GIN(adicional);

-- Índice para búsqueda de texto
CREATE INDEX idx_productos_nombre_text ON app.productos USING GIN(to_tsvector('spanish', nombre));
```

### ❌ No Crear Índices Para
- Campos booleanos simples (`activo`) sin condición adicional
- Tablas con menos de 1000 registros (salvo necesidad específica)
- Campos que no se consultan

---

## 8. SOFT DELETE (ELIMINACIÓN LÓGICA)

### ✅ Acción Requerida
NUNCA ejecutar `DELETE` físico. Usar `activo = FALSE` en su lugar.

```sql
-- ✅ CORRECTO: Soft delete
UPDATE app.usuarios 
SET 
    activo = FALSE,
    fecha_actualizacion = CURRENT_TIMESTAMP
WHERE id = 123;

-- ❌ INCORRECTO: Delete físico
DELETE FROM app.usuarios WHERE id = 123;
```

### ✅ Queries Considerando `activo`

```sql
-- Consultar solo registros activos
SELECT * FROM app.usuarios WHERE activo = TRUE;

-- Incluir inactivos explícitamente si es necesario
SELECT * FROM app.usuarios WHERE activo = FALSE;

-- Ver todos (activos e inactivos)
SELECT * FROM app.usuarios;
```

### ✅ Restaurar Registro Eliminado

```sql
UPDATE app.usuarios 
SET 
    activo = TRUE,
    fecha_actualizacion = CURRENT_TIMESTAMP
WHERE id = 123;
```

---

## 9. TRABAJAR CON SCRAPING

### ✅ Separación de Datos

1. **Datos crudos** → `scraping.stg_*`
2. **Datos procesados** → tablas normales en `app.*`

### ✅ Ejemplo: Pipeline de Scraping

```sql
-- Paso 1: Tabla de staging (datos crudos)
CREATE TABLE scraping.stg_productos_raw (
    id BIGSERIAL PRIMARY KEY,
    id_publico UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    html_crudo TEXT,
    url_fuente TEXT NOT NULL,
    datos_scrapeados JSONB,
    
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    adicional JSONB NOT NULL DEFAULT '{}'::JSONB
);

CREATE INDEX idx_stg_productos_raw_id_publico ON scraping.stg_productos_raw(id_publico);

-- Paso 2: Tabla procesada (datos curados)
CREATE TABLE app.productos (
    id BIGSERIAL PRIMARY KEY,
    id_publico UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    sku VARCHAR(100) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    precio DECIMAL(10,2),
    id_fuente BIGINT REFERENCES scraping.stg_productos_raw(id),
    
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    adicional JSONB NOT NULL DEFAULT '{}'::JSONB
);

CREATE INDEX idx_productos_id_publico ON app.productos(id_publico);
```

### ✅ Uso Intensivo de JSONB

```sql
-- Insertar datos flexibles
INSERT INTO scraping.stg_productos_raw (html_crudo, url_fuente, datos_scrapeados)
VALUES (
    '<html>...</html>',
    'https://example.com/product/123',
    '{"titulo": "Nombre Producto", "especificaciones": {"peso": "1kg", "color": "azul"}}'::JSONB
);

-- Extraer datos de JSONB
SELECT 
    id,
    datos_scrapeados->>'titulo' as nombre_producto,
    datos_scrapeados->'especificaciones'->>'color' as color
FROM scraping.stg_productos_raw;
```

---

## 10. INSERTAR DATOS

### ✅ Insert Simple

```sql
INSERT INTO app.usuarios (email, nombre_usuario, password_hash)
VALUES ('user@example.com', 'juanperez', '$2b$12$...');

-- Los campos de auditoría se llenan automáticamente con sus defaults
```

### ✅ Insert Múltiple

```sql
INSERT INTO app.productos (sku, nombre, precio)
VALUES 
    ('SKU001', 'Producto 1', 19.99),
    ('SKU002', 'Producto 2', 29.99),
    ('SKU003', 'Producto 3', 39.99);
```

### ✅ Insert con JSONB

```sql
INSERT INTO app.productos (sku, nombre, precio, adicional)
VALUES (
    'SKU004',
    'Producto 4',
    49.99,
    '{"etiquetas": ["electronica", "destacado"], "id_proveedor": 123}'::JSONB
);
```

### ✅ Insert con Returning

```sql
INSERT INTO app.usuarios (email, nombre_usuario, password_hash)
VALUES ('user@example.com', 'juanperez', '$2b$12$...')
RETURNING id, fecha_creacion;
```

---

## 11. MODIFICAR DATOS

### ✅ Update Simple

```sql
UPDATE app.usuarios 
SET 
    email = 'newemail@example.com',
    fecha_actualizacion = CURRENT_TIMESTAMP
WHERE id = 123;
```

### ✅ Update con JSONB

```sql
-- Actualizar todo el JSONB
UPDATE app.productos 
SET 
    adicional = '{"etiquetas": ["nuevo", "oferta"], "descuento": 20}'::JSONB,
    fecha_actualizacion = CURRENT_TIMESTAMP
WHERE id = 456;

-- Agregar una clave al JSONB existente
UPDATE app.productos 
SET 
    adicional = adicional || '{"destacado": true}'::JSONB,
    fecha_actualizacion = CURRENT_TIMESTAMP
WHERE id = 456;

-- Eliminar una clave del JSONB
UPDATE app.productos 
SET 
    adicional = adicional - 'descuento',
    fecha_actualizacion = CURRENT_TIMESTAMP
WHERE id = 456;
```

### ✅ Update Condicional

```sql
UPDATE app.ordenes 
SET 
    estado = 'completado',
    fecha_actualizacion = CURRENT_TIMESTAMP
WHERE estado = 'procesando' 
  AND activo = TRUE;
```

---

## 12. MIGRACIONES

### ✅ Acción Requerida
TODO cambio de esquema debe hacerse a través de migraciones versionadas.

### ❌ Prohibido
- Modificar esquema en producción manualmente
- Ejecutar ALTER TABLE directo en producción sin migration

### ✅ Estructura de Migración

```
migrations/
├── 001_create_usuarios_table.sql
├── 002_add_usuarios_roles.sql
├── 003_create_productos_table.sql
└── 004_add_productos_index.sql
```

### ✅ Ejemplo de Migración

```sql
-- migrations/001_create_usuarios_table.sql

-- UP
CREATE TABLE app.usuarios (
    id BIGSERIAL PRIMARY KEY,
    id_publico UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    nombre_usuario VARCHAR(100) NOT NULL UNIQUE,
    
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    adicional JSONB NOT NULL DEFAULT '{}'::JSONB
);

CREATE INDEX idx_usuarios_id_publico ON app.usuarios(id_publico);
CREATE INDEX idx_usuarios_email ON app.usuarios(email);

-- DOWN
DROP INDEX IF EXISTS idx_usuarios_id_publico;
DROP INDEX IF EXISTS idx_usuarios_email;
DROP TABLE IF EXISTS app.usuarios;
```

---

## 13. FOREIGN KEYS Y RELACIONES

### ✅ Definir Foreign Keys

```sql
CREATE TABLE app.ordenes (
    id BIGSERIAL PRIMARY KEY,
    id_publico UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    usuario_id BIGINT NOT NULL REFERENCES app.usuarios(id),
    
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    adicional JSONB NOT NULL DEFAULT '{}'::JSONB
);

CREATE INDEX idx_ordenes_id_publico ON app.ordenes(id_publico);
```

### ✅ ON DELETE y ON UPDATE

```sql
CREATE TABLE app.ordenes (
    id BIGSERIAL PRIMARY KEY,
    id_publico UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    usuario_id BIGINT NOT NULL REFERENCES app.usuarios(id) ON DELETE CASCADE,
    producto_id BIGINT NOT NULL REFERENCES app.productos(id) ON DELETE RESTRICT,
    
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    adicional JSONB NOT NULL DEFAULT '{}'::JSONB
);

CREATE INDEX idx_ordenes_id_publico ON app.ordenes(id_publico);
```

### ✅ Relaciones Muchos-a-Muchos

```sql
-- Usar prefijo rel_
CREATE TABLE app.rel_orden_producto (
    id BIGSERIAL PRIMARY KEY,
    id_publico UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    orden_id BIGINT NOT NULL REFERENCES app.ordenes(id),
    producto_id BIGINT NOT NULL REFERENCES app.productos(id),
    cantidad INTEGER NOT NULL DEFAULT 1,
    
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    adicional JSONB NOT NULL DEFAULT '{}'::JSONB,
    
    UNIQUE(orden_id, producto_id)
);

CREATE INDEX idx_rel_orden_producto_id_publico ON app.rel_orden_producto(id_publico);
```

---

## 14. CONSTRAINTS Y VALIDACIONES

### ✅ Check Constraints

```sql
CREATE TABLE app.productos (
    id BIGSERIAL PRIMARY KEY,
    id_publico UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
    inventario INTEGER NOT NULL CHECK (inventario >= 0),
    estado VARCHAR(20) CHECK (estado IN ('borrador', 'publicado', 'archivado')),
    
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    adicional JSONB NOT NULL DEFAULT '{}'::JSONB
);

CREATE INDEX idx_productos_id_publico ON app.productos(id_publico);
```

### ✅ Unique Constraints

```sql
-- Unique simple
CREATE TABLE app.usuarios (
    id BIGSERIAL PRIMARY KEY,
    id_publico UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    adicional JSONB NOT NULL DEFAULT '{}'::JSONB
);

CREATE INDEX idx_usuarios_id_publico ON app.usuarios(id_publico);

-- Unique compuesto
CREATE TABLE app.configuracion_usuario (
    id BIGSERIAL PRIMARY KEY,
    id_publico UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    usuario_id BIGINT NOT NULL,
    clave_configuracion VARCHAR(100) NOT NULL,
    valor_configuracion TEXT,
    
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    adicional JSONB NOT NULL DEFAULT '{}'::JSONB,
    
    UNIQUE(usuario_id, clave_configuracion)
);
```

---

## 15. CONSULTAS CONSIDERANDO SOFT DELETE

### ✅ Select Básico (Solo Activos)

```sql
-- Filtrar por activo por defecto
SELECT * FROM app.usuarios WHERE activo = TRUE;

-- Con otros filtros
SELECT * FROM app.usuarios 
WHERE activo = TRUE 
  AND email LIKE '%@company.com';
```

### ✅ Joins con activo

```sql
SELECT 
    o.id,
    o.total,
    u.nombre_usuario
FROM app.ordenes o
INNER JOIN app.usuarios u ON o.usuario_id = u.id
WHERE o.activo = TRUE 
  AND u.activo = TRUE;
```

### ✅ Count Considerando activo

```sql
-- Contar solo activos
SELECT COUNT(*) FROM app.usuarios WHERE activo = TRUE;

-- Contar por estado
SELECT 
    activo,
    COUNT(*) as total
FROM app.usuarios
GROUP BY activo;
```

---

## 16. NAMING CONVENTIONS

### ✅ IDIOMA: ESPAÑOL (OBLIGATORIO)
**TODOS los nombres de tablas y columnas DEBEN estar en español.**

```sql
-- ✅ CORRECTO
CREATE TABLE app.usuarios (
    id BIGSERIAL PRIMARY KEY,
    id_publico UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    nombre_completo VARCHAR(255),
    fecha_nacimiento DATE,
    
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    adicional JSONB NOT NULL DEFAULT '{}'::JSONB
);

CREATE INDEX idx_usuarios_id_publico ON app.usuarios(id_publico);

CREATE TABLE app.productos (
    id BIGSERIAL PRIMARY KEY,
    id_publico UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2),
    categoria_id BIGINT
);

CREATE INDEX idx_productos_id_publico ON app.productos(id_publico);

-- ❌ INCORRECTO (nombres en inglés)
CREATE TABLE app.usuarios (...);
CREATE TABLE app.products (...);
CREATE TABLE app.usuarios (
    id BIGSERIAL,
    first_name VARCHAR(255)  -- ❌ columna en inglés
);
```

**Excepción**: Los campos de auditoría estándar (`fecha_creacion`, `fecha_actualizacion`, `activo`, `adicional`) permanecen en inglés por convención.

### ✅ Reglas de Nombres

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Tablas | `snake_case` en español, singular o plural consistente | `usuarios`, `productos`, `ordenes` |
| Columnas | `snake_case` en español | `nombre_completo`, `usuario_id`, `fecha_creacion` |
| Índices | `idx_tabla_columna` | `idx_usuarios_email` |
| Foreign Keys | `fk_tabla_referencia` | `fk_ordenes_usuario` |
| Unique Constraints | `uq_tabla_columna` | `uq_usuarios_email` |
| Check Constraints | `ck_tabla_validacion` | `ck_productos_precio` |

### ✅ Ejemplo Completo

```sql
CREATE TABLE app.ordenes (
    id BIGSERIAL PRIMARY KEY,
    id_publico UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    usuario_id BIGINT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(20),
    
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    adicional JSONB NOT NULL DEFAULT '{}'::JSONB,
    
    CONSTRAINT fk_ordenes_usuario FOREIGN KEY (usuario_id) REFERENCES app.usuarios(id),
    CONSTRAINT ck_ordenes_total CHECK (total >= 0)
);

CREATE INDEX idx_ordenes_id_publico ON app.ordenes(id_publico);
CREATE INDEX idx_ordenes_usuario_id ON app.ordenes(usuario_id);
CREATE INDEX idx_ordenes_fecha_creacion ON app.ordenes(fecha_creacion);
```

---

## 17. CHECKLIST PRE-COMMIT

Antes de confirmar cambios, verificar:

- [ ] ✅ Tabla usa esquema (`app`, `scraping`, `audit`)
- [ ] ✅ Nombre de tabla y columnas en ESPAÑOL (excepto campos de auditoría estándar)
- [ ] ✅ Nombre de tabla: sin prefijo para entidades normales, con prefijo solo si aplica (`rel_`, `stg_`, `bulk_`, `audit_`)
- [ ] ✅ Campos obligatorios: `id` (BIGSERIAL PK), `id_publico` (UUID UNIQUE), `fecha_creacion`, `fecha_actualizacion`, `activo`, `adicional`
- [ ] ✅ Índice creado para `id_publico`
- [ ] ✅ Tipos de datos correctos (`TIMESTAMPTZ`, `BOOLEAN`, `JSONB`, `BIGINT` para FKs)
- [ ] ✅ Primary key definida como BIGSERIAL
- [ ] ✅ Foreign keys con referencias correctas usando BIGINT
- [ ] ✅ Índices creados para columnas en WHERE/JOIN/ORDER BY
- [ ] ✅ Constraints de validación (CHECK, UNIQUE) donde aplique
- [ ] ✅ Comentarios de documentación en DDL
- [ ] ✅ UPDATEs incluyen `fecha_actualizacion = CURRENT_TIMESTAMP`
- [ ] ✅ Queries filtran por `activo = TRUE` cuando corresponde
- [ ] ✅ No se usa DELETE físico, solo soft delete
- [ ] ✅ Cambios versionados en migración

---

## 18. EJEMPLOS COMPLETOS POR CASO DE USO

### ✅ Caso 1: Tabla Operativa Simple

```sql
/**
 * TABLA: app.categorias
 * DESCRIPCIÓN: Categorías de productos
 */
CREATE TABLE app.categorias (
    id BIGSERIAL PRIMARY KEY,
    id_publico UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    categoria_padre_id BIGINT REFERENCES app.categorias(id),
    
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    adicional JSONB NOT NULL DEFAULT '{}'::JSONB
);

CREATE INDEX idx_categorias_id_publico ON app.categorias(id_publico);
CREATE INDEX idx_categorias_categoria_padre_id ON app.categorias(categoria_padre_id);
CREATE INDEX idx_categorias_activo ON app.categorias(activo) WHERE activo = TRUE;
```

### ✅ Caso 2: Tabla con Datos de Scraping

```sql
/**
 * TABLA: scraping.stg_productos_marketplace
 * DESCRIPCIÓN: Productos scrapeados de marketplace
 */
CREATE TABLE scraping.stg_productos_marketplace (
    id BIGSERIAL PRIMARY KEY,
    id_publico UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    url_fuente TEXT NOT NULL,
    html_crudo TEXT,
    datos_extraidos JSONB NOT NULL,
    timestamp_scraping TIMESTAMPTZ NOT NULL,
    
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    adicional JSONB NOT NULL DEFAULT '{}'::JSONB
);

CREATE INDEX idx_stg_productos_id_publico ON scraping.stg_productos_marketplace(id_publico);
CREATE INDEX idx_stg_productos_timestamp_scraping 
    ON scraping.stg_productos_marketplace(timestamp_scraping);
CREATE INDEX idx_stg_productos_datos_extraidos 
    ON scraping.stg_productos_marketplace USING GIN(datos_extraidos);
```

### ✅ Caso 3: Tabla de Auditoría

```sql
/**
 * TABLA: audit.audit_acciones_usuario
 * DESCRIPCIÓN: Log de acciones de usuarios
 */
CREATE TABLE audit.audit_acciones_usuario (
    id BIGSERIAL PRIMARY KEY,
    id_publico UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    usuario_id BIGINT NOT NULL REFERENCES app.usuarios(id),
    tipo_accion VARCHAR(50) NOT NULL,
    tipo_entidad VARCHAR(50),
    entidad_id BIGINT,
    metadatos JSONB,
    direccion_ip INET,
    agente_usuario TEXT,
    
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    adicional JSONB NOT NULL DEFAULT '{}'::JSONB
);

CREATE INDEX idx_audit_id_publico ON audit.audit_acciones_usuario(id_publico);
CREATE INDEX idx_audit_usuario_id ON audit.audit_acciones_usuario(usuario_id);
CREATE INDEX idx_audit_tipo_accion ON audit.audit_acciones_usuario(tipo_accion);
CREATE INDEX idx_audit_fecha_creacion ON audit.audit_acciones_usuario(fecha_creacion);
```

### ✅ Caso 4: Tabla de Carga Masiva (Temporal)

```sql
/**
 * TABLA: app.bulk_importacion_clientes
 * DESCRIPCIÓN: Importación masiva de clientes desde CSV
 */
CREATE TABLE app.bulk_importacion_clientes (
    id BIGSERIAL PRIMARY KEY,
    id_publico UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
    numero_fila_csv INTEGER,
    codigo_cliente VARCHAR(50),
    nombre_cliente VARCHAR(255),
    email VARCHAR(255),
    telefono VARCHAR(50),
    estado_importacion VARCHAR(20) CHECK (estado_importacion IN ('pendiente', 'procesado', 'error')),
    mensaje_error TEXT,
    
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    -- Excepción: bulk tables pueden omitir activo y adicional
);

CREATE INDEX idx_bulk_importacion_id_publico ON app.bulk_importacion_clientes(id_publico);
```

---

## RESUMEN RÁPIDO

### Al Crear Tabla
1. Usar esquema apropiado
2. Definir `id` como BIGSERIAL PRIMARY KEY
3. Añadir `id_publico` como UUID UNIQUE con índice
4. Aplicar prefijo solo si es caso especial (rel_, stg_, bulk_, audit_)
5. Incluir campos de auditoría (fecha_creacion, fecha_actualizacion, activo, adicional)
6. Agregar foreign keys usando BIGINT
7. Crear índices necesarios (incluyendo id_publico)

### Al Insertar
1. No especificar campos de auditoría (usan defaults)
2. Validar constraints antes de insertar

### Al Actualizar
1. SIEMPRE actualizar `fecha_actualizacion`
2. Filtrar por `activo = TRUE` si aplica

### Al Eliminar
1. NO usar DELETE
2. Usar `UPDATE SET activo = FALSE`

### Al Consultar
1. Filtrar por `activo = TRUE` por defecto
2. Usar índices en WHERE/JOIN/ORDER BY
