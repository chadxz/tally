import { loadConfig } from "@tally/typedconfig";
import { configSchema } from "../config/schema";
import { join } from 'path';

const path = join(import.meta.dirname, '..', 'config')
const typedConfig = loadConfig(path, configSchema);

export default typedConfig;
