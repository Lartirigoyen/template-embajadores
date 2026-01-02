import { sql } from 'drizzle-orm';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';

/**
 * Helper para implementar soft delete
 * 
 * @example
 * ```typescript
 * // En lugar de:
 * await db.delete(productos).where(eq(productos.id, id));
 * 
 * // Usar:
 * await softDelete(db, productos, eq(productos.id, id));
 * ```
 */
export async function softDelete<T extends PgTableWithColumns<any>>(
  db: any,
  table: T,
  where: any
) {
  return db
    .update(table)
    .set({
      active: false,
      updated_at: sql`NOW()`,
    })
    .where(where);
}

/**
 * Helper para restaurar un registro eliminado (soft delete)
 * 
 * @example
 * ```typescript
 * await restoreSoftDeleted(db, productos, eq(productos.id, id));
 * ```
 */
export async function restoreSoftDeleted<T extends PgTableWithColumns<any>>(
  db: any,
  table: T,
  where: any
) {
  return db
    .update(table)
    .set({
      active: true,
      updated_at: sql`NOW()`,
    })
    .where(where);
}

/**
 * Filtro para excluir registros eliminados (soft delete)
 * 
 * @example
 * ```typescript
 * import { eq } from 'drizzle-orm';
 * 
 * const activeProducts = await db
 *   .select()
 *   .from(productos)
 *   .where(and(isActive(productos), eq(productos.categoria_id, categoriaId)));
 * ```
 */
export function isActive<T extends PgTableWithColumns<any>>(table: T) {
  return sql`${table.active} = true`;
}

/**
 * Filtro para obtener SOLO registros eliminados (soft delete)
 * 
 * @example
 * ```typescript
 * const deletedProducts = await db
 *   .select()
 *   .from(productos)
 *   .where(isDeleted(productos));
 * ```
 */
export function isDeleted<T extends PgTableWithColumns<any>>(table: T) {
  return sql`${table.active} = false`;
}
