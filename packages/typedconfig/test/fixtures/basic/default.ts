import { z } from "zod";
import type { DeepPartial } from "../../../src";

const schema = z.object({
  applicationName: z.string(),
  environment: z.enum(["development", "test", "production"]),
});

type Config = z.infer<typeof schema>;
type PartialConfig = DeepPartial<Config>;

export default {
  applicationName: "test-app",
  environment: "development",
} satisfies PartialConfig;

export { schema };
