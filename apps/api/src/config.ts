import { z } from "zod";
import camelcaseKeys from "camelcase-keys";
import transformKeys from "./utils/transformKeys";
import stripPrefix from "./utils/stripPrefix";

const configSchema = z
  .object({
    /**
     * The environment the application is running in.
     */
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    /**
     * The Version Control System (VCS) reference that corresponds to the
     * currently running code.
     */
    VCS_REF: z.string().optional().default("unknown"),
  })
  .transform((config) => camelcaseKeys(config));

const viteEnv = transformKeys(import.meta.env, (k) =>
  stripPrefix("APP_", String(k)),
);

export default configSchema.parse({
  ...viteEnv,
  ...process.env,
});
