# TypedConfig

Typed configuration for TypeScript applications.

**Warning: Relies on experimental Node features.**

The following Node.js experimental flags must be enabled for this package to
work:

- `--experimental-strip-types` to allow loading directly from TypeScript files.
- `--experimental-require-module` to allow performing a synchronous `require`
  on an ESM module.

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

const path = join(import.meta.dirname, "..", "config");
const typedConfig = loadConfig(path, configSchema);
export default typedConfig;
```

```ts
// config/custom-environment-variables.ts
import type { PartialEnvConfig } from "./schema";

export default {
  environment: "NODE_ENV",
} satisfies PartialEnvConfig;
```

```ts
// config/default.ts
import type { PartialConfig } from "./schema";

export default {
  applicationName: "my app",
  environment: "development",
} satisfies PartialConfig;
```

```ts
// config/test.ts
import type { PartialConfig } from "./schema";

export default {
  environment: "test",
} satisfies PartialConfig;
```

```ts
// config/production.ts
import type { PartialConfig } from "./schema";

export default {
  environment: "production",
} satisfies PartialConfig;
```

```ts
// config/schema/index.ts
import type { DeepPartial, DeepPartialEnv } from "@tally/typedconfig";
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
