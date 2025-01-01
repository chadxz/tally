import { loadConfig } from "@tally/typedconfig";
import { configSchema } from "../config/schema";
import { resolve } from 'node:path';

// TODO: Use `import.meta.dirname` once drizzle-kit supports ESM
// See https://github.com/drizzle-team/drizzle-kit/issues/107
const path = resolve('.', 'config');
const typedConfig = loadConfig(path, configSchema);

export default typedConfig;
