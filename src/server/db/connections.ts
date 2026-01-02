import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from '../config/env';

/**
 * Pool de conexiones para la base de datos principal
 */
export const primaryPool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

/**
 * Cliente Drizzle para la base de datos principal
 */
export const db = drizzle(primaryPool);

/**
 * Pool de conexiones para base de datos secundaria (si existe)
 */
export const secondaryPool = env.DATABASE_SECONDARY_URL
  ? new Pool({
      connectionString: env.DATABASE_SECONDARY_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    })
  : null;

/**
 * Cliente Drizzle para base de datos secundaria (si existe)
 */
export const dbSecondary = secondaryPool ? drizzle(secondaryPool) : null;

/**
 * Verificar conexión a base de datos
 */
export async function checkDatabaseConnection(pool: Pool): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    return false;
  }
}

/**
 * Cerrar todas las conexiones
 */
export async function closeConnections(): Promise<void> {
  await primaryPool.end();
  if (secondaryPool) {
    await secondaryPool.end();
  }
}
