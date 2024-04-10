import { z } from 'zod';

export const EnvSchema = z.object({
  JWT_SECRET: z.string().min(1),
});

export type Env = z.infer<typeof EnvSchema>;
