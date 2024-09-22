/**
 * Helper type to recursively make all properties in a type optional.
 * Use this in your configuration files to allow specifying only portions
 * that you want to override.
 *
 * @example
 * ```ts
 * import { DeepPartial } from "@tally/typedconfig";
 * import { Config } from "./schema";
 *
 * const config: DeepPartial<Config> = {
 *   applicationName: "my app",
 *   environment: "development",
 * };
 *
 * export default config;
 * ```
 */
export type DeepPartial<T> = T extends object
  ? {
    [P in keyof T]?: DeepPartial<T[P]>;
  }
  : T;

/**
 * Helper type to apply to the export of the `custom-environment-variables.ts`
 * file. This allows you to specify environment variables that map to
 * configuration options. Environment variables can be specified as a simple
 * string name or can have special parsing by mapping a config property to an
 * object with properties `__name` and `__format`.
 *
 * @example
 * ```ts
 * import { DeepPartialEnv } from "@tally/typedconfig";
 * import { Config } from "./schema";
 *
 * const config: DeepPartialEnv<Config> = {
 *   environment: "NODE_ENV",
 * };
 *
 * export default config;
 * ```
 */
export type DeepPartialEnv<T> = T extends object
  ? {
    [P in keyof T]?: DeepPartialEnv<T[P]>;
  }
  : string | EnvExtendedConfig;

/**
 * Formats that can be used when parsing an environment variable.
 *
 * @example
 * ```ts
 * import { DeepPartialEnv, EnvConfigExtendedFormat } from "@tally/typedconfig";
 * import { Config } from "./schema";
 *
 * const config: DeepPartialEnv<Config> = {
 *   port: {
 *     __name: "PORT",
 *     __format: EnvConfigExtendedFormats.number,
 *   },
 * };
 *
 * export default config;
 * ```
 */
export const EnvConfigExtendedFormats = {
  json: "json",
  yaml: "yaml",
  boolean: "boolean",
  number: "number",
} as const;

export type EnvExtendedConfig = {
  __name: string;
  __format: EnvConfigExtendedFormat;
};

export type EnvConfigExtendedFormat =
  (typeof EnvConfigExtendedFormats)[keyof typeof EnvConfigExtendedFormats];
