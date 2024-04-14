import { z } from 'zod';

export const EnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  DOMAIN: z.string(),
  SMTP_HOST: z.string(),
  SMTP_FROM: z.string(),
  SMTP_SECURE: z
    .string()
    .transform((v) => v.toLowerCase() === 'true')
    .optional(),
  SMTP_PORT: z.coerce.number().int(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
});

export type Env = z.infer<typeof EnvSchema>;
