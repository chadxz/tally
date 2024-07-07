// eslint-disable-next-line no-restricted-imports -- this is the only file 'config' should be imported
import config from "config";

import { ConfigSchema } from "../config/schema";

const typedConfig = ConfigSchema.parse(config);

export default typedConfig;
