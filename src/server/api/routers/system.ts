import { createTRPCRouter, publicProcedure } from '../trpc';
import { checkDatabaseConnection, primaryPool, secondaryPool } from '~/server/db';

export const systemRouter = createTRPCRouter({
  /**
   * Health check endpoint
   * Verifica que el servidor está funcionando
   */
  health: publicProcedure.query(() => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }),

  /**
   * Database status
   * Verifica la conexión a las bases de datos
   */
  dbStatus: publicProcedure.query(async () => {
    const primaryStatus = await checkDatabaseConnection(primaryPool);
    const secondaryStatus = secondaryPool
      ? await checkDatabaseConnection(secondaryPool)
      : null;

    return {
      primary: primaryStatus ? 'connected' : 'disconnected',
      secondary: secondaryStatus !== null
        ? (secondaryStatus ? 'connected' : 'disconnected')
        : 'not_configured',
    };
  }),
});
