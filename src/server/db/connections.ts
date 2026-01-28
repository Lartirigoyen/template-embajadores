import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from '../config/env';

/**
 * Esperar con reintentos para que la base de datos esté disponible
 * Útil cuando la BD está iniciando (Docker, etc)
 */
async function waitForDatabase(pool: Pool, maxRetries = 10, delayMs = 2000): Promise<void> {
  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      
      if (attempt > 1) {
        console.log(`✅ Conexión establecida después de ${attempt} intentos`);
      }
      return;
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        break;
      }
      
      console.log(`⏳ Esperando base de datos... (intento ${attempt}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  throw new Error(
    `No se pudo conectar a la base de datos después de ${maxRetries} intentos.\n` +
    `Error: ${lastError?.message}\n\n` +
    `Verifica que:\n` +
    `1. La base de datos está corriendo (Docker: docker-compose up -d)\n` +
    `2. DATABASE_URL está correctamente configurada en .env.local\n` +
    `3. Las credenciales son correctas\n` +
    `4. El puerto no está bloqueado por un firewall`
  );
}

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
 * Verificar conexión a base de datos con reintentos
 */
export async function checkDatabaseConnection(
  pool: Pool, 
  withRetries = false
): Promise<boolean> {
  try {
    if (withRetries) {
      await waitForDatabase(pool);
    } else {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
    }
    return true;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    return false;
  }
}

/**
 * Conectar con reintentos - útil para scripts (migraciones, seeds)
 */
export async function connectWithRetry(pool: Pool): Promise<void> {
  await waitForDatabase(pool);
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
