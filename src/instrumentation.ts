/**
 * Instrumentación de Next.js
 * Este archivo se ejecuta cuando el servidor inicia y permite configurar
 * monitoreo, telemetría y estado de servicios en el panel de desarrollo
 */

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { checkDatabaseConnection, primaryPool, secondaryPool } = await import('./server/db/connections');
    const { env } = await import('./server/config/env');
    
    console.log('\n' + '='.repeat(60));
    console.log('🚀 TEMPLATE EMBAJADORES - LYCSA SUITE');
    console.log('='.repeat(60));
    
    // Verificar conexión a base de datos principal
    console.log('\n📊 Estado de Conexiones:');
    console.log('-'.repeat(60));
    
    try {
      const primaryConnected = await checkDatabaseConnection(primaryPool, false);
      
      if (primaryConnected) {
        const dbUrl = new URL(env.DATABASE_URL);
        console.log(`✅ Base de datos principal: CONECTADA`);
        console.log(`   Host: ${dbUrl.hostname}:${dbUrl.port}`);
        console.log(`   Database: ${dbUrl.pathname.slice(1)}`);
      } else {
        console.warn('⚠️  Base de datos principal: NO CONECTADA');
        console.warn('   Verifica que la base de datos esté corriendo');
      }
      
      // Verificar base de datos secundaria si existe
      if (secondaryPool && env.DATABASE_SECONDARY_URL) {
        const secondaryConnected = await checkDatabaseConnection(secondaryPool, false);
        
        if (secondaryConnected) {
          const dbUrl = new URL(env.DATABASE_SECONDARY_URL);
          console.log(`✅ Base de datos secundaria: CONECTADA`);
          console.log(`   Host: ${dbUrl.hostname}:${dbUrl.port}`);
          console.log(`   Database: ${dbUrl.pathname.slice(1)}`);
        } else {
          console.warn('⚠️  Base de datos secundaria: NO CONECTADA');
        }
      } else {
        console.log('ℹ️  Base de datos secundaria: NO CONFIGURADA');
      }
      
      console.log('-'.repeat(60));
      console.log('✨ Sistema listo para desarrollo\n');
      
    } catch (error) {
      console.error('\n❌ Error al verificar conexiones de base de datos');
      console.error('-'.repeat(60));
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
      }
      console.error('-'.repeat(60) + '\n');
    }
  }
}
