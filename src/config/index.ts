import { getEnv } from "./runtime";
import { Config, configSchema } from "./schema";

let cached: Readonly<Config> | null = null;

export const getConfig = () => {
  if (cached) return cached;

  const config = configSchema.safeParse({
    APP_PORT: getEnv("APP_PORT"),
    APP_HOST: getEnv("APP_HOST"),
    APP_ENV: getEnv("APP_ENV"),
    MONGODB_URI: getEnv("MONGODB_URI"),
    BCRYPT_ROUNDS: getEnv("BCRYPT_ROUNDS"),
  });

  if (!config.success) {
    console.error(`Invalid environment variables: ${config.error.message}`);
    process.exit(1);
  }

  cached = Object.freeze(config.data);
  return cached;
};
