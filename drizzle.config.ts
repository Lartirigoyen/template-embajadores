import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';

// Cargar variables de entorno desde .env.local (desarrollo) o .env (producción)
// Next.js usa .env.local por convención para desarrollo local
config({ path: '.env.local' });
config({ path: '.env' });

export default {
  schema: './src/server/db/schema/**/*.ts',
  out: './src/server/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  schemaFilter: ['app', 'audit', 'scraping'],
  verbose: true,
  strict: true,
} satisfies Config;
