import { loadConfig } from "@tally/typedconfig";
import { configSchema } from "../config/schema";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const path = join(dirname(fileURLToPath(import.meta.url)), '..', 'config')
const typedConfig = loadConfig(path, configSchema);

export default typedConfig;
