import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';

// Cargar variables de entorno desde .env
config();

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
