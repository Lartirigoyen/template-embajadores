import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { env } from '../config/env';
import { connectWithRetry } from './connections';

async function runMigrations() {
  const migrationsFolder = resolve('./src/server/db/migrations');
  const journalPath = resolve(migrationsFolder, 'meta/_journal.json');

  // Verificar si existen migraciones
  if (!existsSync(journalPath)) {
    console.log('ℹ️  No hay migraciones pendientes');
    return;
  }

  console.log('📦 Configurando conexión a base de datos...');
  console.log(`📍 DATABASE_URL: ${env.DATABASE_URL.replace(/:[^:@]+@/, ':****@')}`);

  const pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  try {
    // Intentar conectar con reintentos (útil cuando Docker está iniciando)
    console.log('🔌 Conectando a la base de datos...');
    await connectWithRetry(pool);
    console.log('✅ Conexión establecida');

    // Crear los schemas necesarios antes de migrar
    console.log('📐 Verificando schemas...');
    await pool.query('CREATE SCHEMA IF NOT EXISTS app;');
    await pool.query('CREATE SCHEMA IF NOT EXISTS audit;');
    await pool.query('CREATE SCHEMA IF NOT EXISTS scraping;');
    console.log("✅ Schemas 'app', 'audit', 'scraping' verificados/creados");
    
    const db = drizzle(pool);

    console.log('⏳ Ejecutando migraciones...');
    await migrate(db, { migrationsFolder });
    console.log('✅ Migraciones completadas exitosamente');
  } catch (error) {
    console.error('\n❌ Error durante el proceso de migración:');
    console.error(error);
    console.error('\n📋 Pasos de troubleshooting:');
    console.error('1. Verifica que Docker está corriendo: docker ps');
    console.error('2. Revisa las credenciales en .env.local');
    console.error('3. Verifica que el puerto no esté en uso');
    console.error('4. Intenta reiniciar los contenedores: docker-compose restart\n');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();
