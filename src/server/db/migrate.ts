import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { config } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

// Cargar variables de entorno
config({ path: '.env.local' });
config({ path: '.env' });

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

  // Crear los schemas necesarios antes de migrar
  try {
    await pool.query('CREATE SCHEMA IF NOT EXISTS app;');
    await pool.query('CREATE SCHEMA IF NOT EXISTS audit;');
    await pool.query('CREATE SCHEMA IF NOT EXISTS scraping;');
    console.log("✅ Schemas 'app', 'audit', 'scraping' verificados/creados");
  } catch (err) {
    console.error("❌ Error creando/verificando schemas:", err);
    await pool.end();
    process.exit(1);
  }
  
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
