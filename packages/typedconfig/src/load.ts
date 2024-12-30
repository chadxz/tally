import { z } from "zod";
import { createRequire } from "node:module";
import { join } from "node:path";
import {
  EnvConfigExtendedFormats,
  type EnvConfigExtendedFormat,
  type EnvExtendedConfig,
} from "./helpers.ts";
import deepmerge from "deepmerge";

const require = createRequire(import.meta.url);

/**
 * Load the application configuration using the typescript configuration files
 * at the provided {@link path}. The files are loaded based on the following
 * precedence:
 *
 * ```
 * default.ts
 * {NODE_ENV}.ts
 * local.ts
 * local-{NODE_ENV}.ts
 * custom-environment-variables.ts
 * ```
 *
 * All the above files are optional.
 *
 * The `custom-environment-variables.ts` file is used to specify environment
 * variables that map to configuration options, and whether any additional
 * processing is performed on the value prior to assigning to the resulting
 * configuration object. See {@link DeepPartialEnv} for more information.
 *
 * Once the configuration is loaded, it is parsed using the provided
 * {@link schema} to return a fully-typed configuration object.
 */
export function loadConfig<T extends z.ZodTypeAny>(
  path: string,
  schema: T,
): z.infer<T> {
  const data = loadAllConfigFiles(path);
  return schema.parse(data);
}

function loadAllConfigFiles(path: string): RawConfig {
  const env = process.env.NODE_ENV || "development";
  const configs = [
    loadConfigFromFile(join(path, "default.ts")),
    loadConfigFromFile(join(path, `${env}.ts`)),
    loadConfigFromFile(join(path, "local.ts")),
    loadConfigFromFile(join(path, `local-${env}.ts`)),
    loadEnvConfigFromFile(join(path, "custom-environment-variables.ts")),
  ];

  return deepMergeAll(configs);
}

function deepMergeAll(configs: RawConfig[]): RawConfig {
  return configs.reduce((acc, config) => deepmerge(acc, config), {});
}

function loadEnvConfigFromFile(path: string): RawConfig {
  const envConfig = loadConfigFromFile(path);
  return parseEnvConfig(envConfig);
}

function parseEnvConfig(config: RawConfig): RawConfig {
  const result: RawConfig = {};
  Object.entries(config).forEach(([key, value]) => {
    if (isString(value) && process.env[value] !== undefined) {
      result[key] = process.env[value];
      return;
    }

    if (isEnvExtendedConfig(value) && process.env[value.__name] !== undefined) {
      result[key] = parseEnvVarValue(
        process.env[value.__name]!,
        value.__format,
      );
      return;
    }

    if (isRawEnvConfig(value)) {
      result[key] = parseEnvConfig(value);
      return;
    }
  });

  return result;
}

function parseEnvVarValue(value: string, format: EnvConfigExtendedFormat) {
  switch (format) {
    case EnvConfigExtendedFormats.json:
      return JSON.parse(value);
    case EnvConfigExtendedFormats.boolean:
      return value.toLowerCase() === "true";
    case EnvConfigExtendedFormats.number:
      return Number(value);
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

function loadConfigFromFile(path: string): RawConfig {
  try {
    const module = require(path);
    if (module.__esModule && module.default) {
      return module.default;
    }
    return module;
  } catch (e) {
    if (isModuleNotFoundError(e)) {
      // Missing configuration files are OK
      return {};
    }
    throw e;
  }
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isRawEnvConfig(value: unknown): value is RawEnvConfig {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !isEnvExtendedConfig(value)
  );
}

function isEnvExtendedConfig(value: unknown): value is EnvExtendedConfig {
  return (
    typeof value === "object" &&
    value !== null &&
    "__name" in value &&
    "__format" in value
  );
}

function isModuleNotFoundError(e: unknown): e is ModuleNotFoundError {
  return e instanceof Error && "code" in e && e.code === "MODULE_NOT_FOUND";
}

interface ModuleNotFoundError extends Error {
  code: "MODULE_NOT_FOUND";
}

type EnvConfigValue = string | EnvExtendedConfig | RawEnvConfig;
type RawEnvConfig = { [key: string]: EnvConfigValue };
type RawConfig = Record<string, unknown>;
