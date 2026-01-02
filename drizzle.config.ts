import type { Config } from 'drizzle-kit';
import { loadEnvConfig } from '@next/env';

// Cargar variables de entorno
loadEnvConfig(process.cwd());

export default {
  schema: './src/server/db/schema/*',
  out: './src/server/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  schemaFilter: ['app', 'audit', 'scraping'],
  verbose: true,
  strict: true,
} satisfies Config;
