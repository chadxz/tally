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
 * export default {
 *   applicationName: "my app",
 *   environment: "development",
 * } satisfies DeepPartial<Config>;
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
 * export default {
 *   environment: "NODE_ENV",
 *   emailEnabled: {
 *     __name: "EMAIL_ENABLED",
 *     __format: EnvConfigExtendedFormats.boolean,
 *   },
 * } satisfies DeepPartialEnv<Config>;
 * ```
 */
export type DeepPartialEnv<T> =
  T extends Array<unknown>
    ? string | EnvExtendedConfig
    : T extends object
      ? {
          [P in keyof T]?: DeepPartialEnv<T[P]>;
        }
      : string | EnvExtendedConfig;

/**
 * Formats that can be used when parsing an environment variable. `json` is
 * primarily useful when specifying an array as an environment variable. `boolean`
 * directly maps an environment variable to a boolean, and `number` converts a
 * string environment variable to a number. This allows a more strict Zod schema.
 *
 * @example
 * ```ts
 * import { DeepPartialEnv, EnvConfigExtendedFormat } from "@tally/typedconfig";
 * import { Config } from "./schema";
 *
 * export default {
 *   port: {
 *     __name: "PORT",
 *     __format: EnvConfigExtendedFormats.number,
 *   },
 * } satisfies DeepPartialEnv<Config>;
 * ```
 */
export const EnvConfigExtendedFormats = {
  json: "json",
  boolean: "boolean",
  number: "number",
} as const;

export type EnvExtendedConfig = {
  __name: string;
  __format: EnvConfigExtendedFormat;
};

export type EnvConfigExtendedFormat =
  (typeof EnvConfigExtendedFormats)[keyof typeof EnvConfigExtendedFormats];
