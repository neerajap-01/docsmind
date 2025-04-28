import z from 'zod';

const envSchema = z.object({
  APP_ENV: z.enum(['local', 'production']).default('local'),
  API_ENDPOINT: z.string().trim() //.min(1).default('http://localhost:3000'),
});
// API_ENDPOINT: z.string().trim().min(1).default('http://localhost:3000')
export const env = envSchema.parse(process.env);