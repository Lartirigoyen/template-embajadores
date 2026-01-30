import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from '../config/env';
import { connectWithRetry } from './connections';
import * as schema from './schema';

/**
 * Script de seed para poblar la base de datos con datos iniciales
 * 
 * IMPORTANTE: Este script usa reintentos automáticos para conectarse
 * Útil cuando la BD está iniciando (Docker, etc)
 */

async function seed() {
  console.log('🌱 Iniciando proceso de seed...\n');
  console.log('📦 Configurando conexión a base de datos...');
  console.log(`📍 DATABASE_URL: ${env.DATABASE_URL.replace(/:[^:@]+@/, ':****@')}\n`);

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
    console.log('✅ Conexión establecida\n');

    const db = drizzle(pool, { schema });

    // ==============================================
    // AGREGA TUS SEEDS AQUÍ
    // ==============================================
    
    console.log('📝 Insertando datos de ejemplo...');
    
    // Ejemplo: Insertar datos en una tabla
    // await db.insert(schema.ejemploTable).values([
    //   { name: 'Ejemplo 1', description: 'Descripción 1' },
    //   { name: 'Ejemplo 2', description: 'Descripción 2' },
    // ]);
    
    console.log('✅ Datos de ejemplo insertados');
    
    // ==============================================
    // FIN DE SEEDS
    // ==============================================

    console.log('\n✅ Seed completado exitosamente');
  } catch (error) {
    console.error('\n❌ Error durante el proceso de seed:');
    console.error(error);
    console.error('\n📋 Pasos de troubleshooting:');
    console.error('1. Verifica que las migraciones se ejecutaron: npm run db:push');
    console.error('2. Verifica que Docker está corriendo: docker ps');
    console.error('3. Revisa las credenciales en .env.local');
    console.error('4. Verifica que el puerto no esté en uso');
    console.error('5. Intenta reiniciar los contenedores: docker-compose restart');
    console.error('6. Verifica que las tablas existen en la BD\n');
    process.exit(1);
  } finally {
    await pool.end();
    console.log('👋 Conexión cerrada');
  }
}

// Ejecutar seed solo si este archivo se ejecuta directamente
if (require.main === module) {
  seed();
}

export { seed };
