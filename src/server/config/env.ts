import { z } from 'zod';

// Schema para validar variables de entorno
const envSchema = z.object({
  // Node
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Base de datos principal
  DATABASE_URL: z.string().url().optional().default('postgresql://postgres:postgres@localhost:5432/lycsa_app'),

  // Base de datos secundaria (opcional)
  DATABASE_SECONDARY_URL: z.string().url().optional(),

  // S3 / MinIO
  S3_ENDPOINT: z.string().optional(),
  S3_REGION: z.string().default('us-east-1'),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_BUCKET_NAME: z.string().optional(),
  S3_FORCE_PATH_STYLE: z.string().transform((val) => val === 'true').optional(),

  // Next.js
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),

  // Keycloak SSO Silencioso (public client - no secret)
  NEXT_PUBLIC_KEYCLOAK_URL: z.string().url().default('https://auth.lartirigoyen.internal'),
  NEXT_PUBLIC_KEYCLOAK_REALM: z.string().default('larti'),
  NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: z.string().min(1),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
