import { createTRPCRouter } from './trpc';
import { systemRouter } from './routers/system';

/**
 * Router principal de tRPC
 * Aquí se agregan todos los sub-routers
 */
export const appRouter = createTRPCRouter({
  system: systemRouter,
  
  // Agregar aquí tus routers de negocio:
  // productos: productosRouter,
  // categorias: categoriasRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;
