import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { config } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

// Cargar variables de entorno
config();

async function runMigrations() {
  const migrationsFolder = resolve('./src/server/db/migrations');
  const journalPath = resolve(migrationsFolder, 'meta/_journal.json');

  // Verificar si existen migraciones
  if (!existsSync(journalPath)) {
    console.log('ℹ️  No hay migraciones pendientes');
    return;
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  console.log('⏳ Ejecutando migraciones...');

  try {
    await migrate(db, { migrationsFolder });
    console.log('✅ Migraciones completadas exitosamente');
  } catch (error) {
    console.error('❌ Error ejecutando migraciones:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();
