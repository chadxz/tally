import { DeepPartial, DeepPartialEnv } from "@tally/typedconfig";
import { z } from "zod";

/**
 * Schema for our Configuration. If it's a config option, it's here!
 */
export const configSchema = z.object({
  applicationName: z.string(),
  environment: z.enum(["development", "test", "production"]),
  db: z.object({
    url: z.string().url(),
  }),
});

export type Config = z.infer<typeof configSchema>;
export type PartialConfig = DeepPartial<Config>;
export type PartialEnvConfig = DeepPartialEnv<Config>;
