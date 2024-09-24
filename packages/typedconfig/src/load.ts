import { z } from "zod";
import importSync from "import-sync";
import { join } from "node:path";
import * as yaml from "js-yaml";
import {
  EnvConfigExtendedFormats,
  EnvConfigExtendedFormat,
  EnvExtendedConfig,
} from "./helpers";

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
    ...loadConfigFromFile(join(path, "default.js")),
    ...loadConfigFromFile(join(path, `${env}.js`)),
    ...loadConfigFromFile(join(path, "local.js")),
    ...loadConfigFromFile(join(path, `local-${env}.js`)),
    ...loadEnvConfigFromFile(join(path, "custom-environment-variables.js")),
  };
}

function loadEnvConfigFromFile(path: string): NestedConfig {
  const envConfig = loadConfigFromFile(path);
  return parseEnvConfig(envConfig);
}

function parseEnvConfig(config: NestedConfig): NestedConfig {
  Object.entries(config).forEach(([key, value]) => {
    if (
      isString(value) &&
      Object.prototype.hasOwnProperty.call(process.env, value)
    ) {
      config[key] = process.env[value];
      return;
    }

    if (
      isEnvExtendedConfig(value) &&
      Object.prototype.hasOwnProperty.call(process.env, value.__name)
    ) {
      config[key] = parseEnvVarValue(
        process.env[value.__name]!,
        value.__format,
      );
      return;
    }

    if (isNestedConfig(value)) {
      config[key] = parseEnvConfig(value);
      return;
    }
  });

  return config;
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

function loadConfigFromFile(path: string): NestedConfig {
  try {
    return importSync(path);
  } catch (e) {
    return {};
  }
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isEnvExtendedConfig(value: unknown): value is EnvExtendedConfig {
  return (
    typeof value === "object" &&
    value !== null &&
    "__name" in value &&
    "__format" in value
  );
}

function isNestedConfig(value: unknown): value is NestedConfig {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !isEnvExtendedConfig(value)
  );
}

type ConfigValue = string | EnvExtendedConfig | NestedConfig;
type NestedConfig = { [key: string]: ConfigValue };
