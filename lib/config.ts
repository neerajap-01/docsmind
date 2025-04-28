import z from 'zod';

const envSchema = z.object({
  APP_ENV: z.enum(['local', 'production']).default(
    process.env.APP_ENV === 'production' ? 'production' : 'local'
  ),
  API_ENDPOINT: z.string().trim().min(1).default(
    process.env.API_ENDPOINT || 'http://localhost:3000'
  ),
});

export const env = envSchema.parse(process.env);