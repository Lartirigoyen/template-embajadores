import { initTRPC } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

/**
 * Contexto de tRPC
 * Aquí puedes agregar información de sesión, usuario, etc.
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    headers: opts.headers,
    // Aquí podrías agregar:
    // - session: await getSession()
    // - user: await getUser()
  };
};

/**
 * Inicialización de tRPC
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Router de tRPC
 */
export const createTRPCRouter = t.router;

/**
 * Procedimiento público (sin autenticación)
 */
export const publicProcedure = t.procedure;

/**
 * Middleware para procedimientos autenticados
 * 
 * @example
 * ```typescript
 * export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
 *   if (!ctx.session || !ctx.session.user) {
 *     throw new TRPCError({ code: 'UNAUTHORIZED' });
 *   }
 *   return next({
 *     ctx: {
 *       ...ctx,
 *       session: { ...ctx.session, user: ctx.session.user },
 *     },
 *   });
 * });
 * ```
 */
