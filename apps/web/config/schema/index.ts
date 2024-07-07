import { z } from "zod";

/**
 * Schema for our Configuration. If it's a config option, it's here!
 */
export const ConfigSchema = z.object({
  applicationName: z.string(),
  environment: z.enum(["development", "test", "production"]),
  db: z.object({
    url: z.string().url(),
  })
});

/**
 * Type for our fully-formed Configuration. This will be the type you
 * get from calling `ConfigSchema.parse(someObject)` successfully.
 */
export type Config = z.infer<typeof ConfigSchema>;

/**
 * A type for representing a partial representation of our Configuration. The
 * `config` package constructs a full configuration by merging environment
 * variables and config files:
 * https://github.com/node-config/node-config/wiki/Configuration-Files.
 * `PartialConfig` allows us to specify a partial config and have
 * defaults populate the ones we don't want to override. Any options that are
 * not set but are present in the `ConfigSchema` will cause a runtime
 * error when we call `ConfigSchema.parse(someObject)`.
 */
export type PartialConfig = DeepPartial<Config>;

/**
 * A type for defining environment variables that map to our Configuration
 * options. Environment variables can be specified as a simple string name or
 * can have special parsing by passing `__format`.
 */
export type PartialEnvConfig = DeepEnv<PartialConfig>;

/**
 * Formats that can be used when parsing an env variable. This is an abridged
 * list containing the most likely formats we would ever use. For a full list,
 * see https://github.com/node-config/node-config/wiki/Environment-Variables#custom-environment-variables
 * and https://github.com/node-config/node-config/wiki/Configuration-Files#file-formats.
 */
export enum EnvConfigExtendedFormat {
  json = "json",
  json5 = "json5",
  yaml = "yaml",
  boolean = "boolean",
  number = "number",
}

// Converts our schema to allow specifying only portions for override.
type DeepPartial<T> = T extends object
  ? {
    [P in keyof T]?: DeepPartial<T[P]>;
  }
  : T;

// Converts our schema to type `custom-environment-variables` config file.
type DeepEnv<T> = T extends object
  ? {
    [P in keyof T]: DeepEnv<T[P]>;
  }
  :
  | string
  | {
  __name: string;
  __format: EnvConfigExtendedFormat;
};
