import { pgSchema, bigserial, uuid, varchar, timestamp, boolean, jsonb, index } from 'drizzle-orm/pg-core';

const appSchema = pgSchema('app');

// Tabla de ejemplo (se puede eliminar)
export const ejemploTabla = appSchema.table('ejemplo_tabla', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  idPublico: uuid('id_publico').notNull().defaultRandom().unique(),
  
  // Campos negocio
  nombre: varchar('nombre', { length: 255 }).notNull(),
  
  // Auditoría obligatoria
  fechaCreacion: timestamp('fecha_creacion', { withTimezone: true }).notNull().defaultNow(),
  fechaActualizacion: timestamp('fecha_actualizacion', { withTimezone: true }).notNull().defaultNow(),
  activo: boolean('activo').notNull().default(true),
  adicional: jsonb('adicional').notNull().default({}),
}, (table) => ({
  idPublicoIdx: index('idx_ejemplo_tabla_id_publico').on(table.idPublico),
}));
