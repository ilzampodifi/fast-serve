import { z } from "zod";

export const configSchema = z.object({
  APP_PORT: z.coerce.number().default(3000).optional(),
  APP_HOST: z.string().default("0.0.0.0").optional(),
  APP_ENV: z.enum(["dev", "prod"]).default("dev").optional(),
  MONGODB_URI: z.string(),
});

export type Config = z.infer<typeof configSchema>;
