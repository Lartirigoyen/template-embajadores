import { sql } from 'drizzle-orm';

/**
 * Helper para asegurar que updated_at se actualice automáticamente
 * Usar en las operaciones de update
 * 
 * @example
 * ```typescript
 * await db
 *   .update(productos)
 *   .set(withUpdatedAt({
 *     nombre: 'Nuevo nombre',
 *     precio: 100
 *   }))
 *   .where(eq(productos.id, id));
 * ```
 */
export function withUpdatedAt<T extends Record<string, any>>(data: T) {
  return {
    ...data,
    updated_at: sql`NOW()`,
  };
}

/**
 * Helper para obtener timestamp actual (para created_at)
 * 
 * @example
 * ```typescript
 * await db.insert(productos).values({
 *   nombre: 'Producto nuevo',
 *   created_at: now(),
 *   updated_at: now(),
 *   active: true
 * });
 * ```
 */
export function now() {
  return sql`NOW()`;
}
