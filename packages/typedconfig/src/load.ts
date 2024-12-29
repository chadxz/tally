import { z } from "zod";
import { createRequire } from "node:module";
import { join } from "node:path";
import * as yaml from "js-yaml";
import {
  EnvConfigExtendedFormats,
  type EnvConfigExtendedFormat,
  type EnvExtendedConfig,
} from "./helpers.ts";

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
 * The `custom-environment-variables.ts` file is optional and can be used to
 * specify environment variables that map to configuration options.
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

function loadAllConfigFiles(path: string) {
  const env = process.env.NODE_ENV || "development";
  return {
    ...loadConfigFromFile(join(path, "default.ts")),
    ...loadConfigFromFile(join(path, `${env}.ts`)),
    ...loadConfigFromFile(join(path, "local.ts")),
    ...loadConfigFromFile(join(path, `local-${env}.ts`)),
    ...loadEnvConfigFromFile(join(path, "custom-environment-variables.ts")),
  };
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
    case EnvConfigExtendedFormats.yaml:
      return yaml.load(value);
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
    return {};
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

type EnvConfigValue = string | EnvExtendedConfig | RawEnvConfig;
type RawEnvConfig = { [key: string]: EnvConfigValue };
type RawConfig = Record<string, unknown>;
