import type { PartialEnvConfig } from "./schema";

export default {
  application: {
    metadata: {
      name: "APP_NAME",
    },
  },
} satisfies PartialEnvConfig;
