# TypedConfig

Typed configuration for TypeScript applications.

**Warning: Relies on experimental Node features.**

The following Node.js experimental flags must be enabled for this package to
work:

- `--experimental-strip-types` to allow loading directly from TypeScript files.
- `--experimental-require-module` to allow performing a synchronous `require`
  on an ESM module.
- `--experimental-specifier-resolution=node` to allow required() ESM modules to
  properly resolve imports that point to a directory instead of a file.

## Configuration Files Load Order

```
default.ts
{NODE_ENV}.ts
local.ts
local-{NODE_ENV}.ts
custom-environment-variables.ts
```

## Usage

```ts
// src/config.ts
import { loadConfig } from "@tally/typedconfig";
import { configSchema } from "../config/schema";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const path = join(dirname(fileURLToPath(import.meta.url)), "..", "config");
const typedConfig = loadConfig(path, configSchema);
export default typedConfig;
```

```ts
// config/custom-environment-variables.ts
import { PartialEnvConfig } from "./schema";

const config: PartialEnvConfig = {
  environment: "NODE_ENV",
};
export default config;
```

```ts
// config/default.ts
import { PartialConfig } from "./schema";

const config: PartialConfig = {
  applicationName: "my app",
  environment: "development",
};
export default config;
```

```ts
// config/test.ts
import { PartialConfig } from "./schema";

const config: PartialConfig = {
  environment: "test",
};
export default config;
```

```ts
// config/production.ts
import { PartialConfig } from "./schema";

const config: PartialConfig = {
  environment: "production",
};
export default config;
```

```ts
// config/schema/index.ts
import { DeepPartial, DeepPartialEnv } from "@tally/typedconfig";
import { z } from "zod";

export const configSchema = z.object({
  applicationName: z.string(),
  environment: z.enum(["development", "test", "production"]),
  db: z.object({
    url: z.string().url(),
  }),
});

export type Config = z.infer<typeof configSchema>;
export type PartialConfig = DeepPartial<Config>;
export type PartialEnvConfig = DeepPartialEnv<Config>;
```
