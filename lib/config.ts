import z from 'zod';

const envSchema = z.object({
  APP_ENV: z.enum(['local', 'production']).default(
    process.env.NEXT_PUBLIC_APP_ENV === 'production' ? 'production' : 'local'
  ),
  API_ENDPOINT: z.string().trim().min(1).default(
    process.env.NEXT_PUBLIC_API_ENDPOINT || 'http://localhost:3000'
  ),
  BASE_URL: z.string().trim().min(1).default(
    process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  ),
});

export const env = envSchema.parse(process.env);