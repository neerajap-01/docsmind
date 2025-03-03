import z from 'zod';

const envSchema = z.object({
  OPENAI_API_KEY: z.string().trim().min(1),
  OPENAI_MODEL: z.string().trim().min(1),
  PINECONE_API_KEY: z.string().trim().min(1),
  PINECONE_ENVIRONMENT: z.string().trim().min(1),
  PINECONE_INDEX_NAME: z.string().trim().min(1),
  PINECONE_NAME_SPACE: z.string().trim().min(1),
  PDF_PATH: z.string().trim().min(1),
  INDEX_INIT_TIMEOUT: z.coerce.number().min(1),
  LANGSMITH_TRACING: z.coerce.boolean(),
  LANGSMITH_ENDPOINT: z.string().trim().min(1),
  LANGSMITH_API_KEY: z.string().trim().min(1),
  LANGSMITH_PROJECT: z.string().trim().min(1),
});

export const env = envSchema.parse(process.env);