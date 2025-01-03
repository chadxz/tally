import { z } from "zod";
import camelcaseKeys from "camelcase-keys";

/**
 * Schema for our Configuration. If it's a config option, it's here!
 * environment variables are converted to camelCase once validated.
 */
const configSchema = z
  .object({
    APPLICATION_NAME: z
      .string({ description: "The name the application reports in its logs." })
      .default("tally"),
    NODE_ENV: z
      .enum(["development", "test", "production"], {
        message: "NODE_ENV must be one of: development, test, production",
        description: "The environment the application is running in.",
      })
      .default("development"),
    NEON_URL: z
      .string({
        message: "NEON_URL must be provided",
        description: "The full url to the Neon PostgreSQL database.",
      })
      .url("NEON_URL must be a valid postgresql URL"),
  })
  .transform((config) => camelcaseKeys(config));

/**
 * The configuration for our application. This is parsed from the environment,
 * with defaults applied where applicable.
 */
export default configSchema.parse(process.env);
process.env = { HINT: "Use the application configuration" };
