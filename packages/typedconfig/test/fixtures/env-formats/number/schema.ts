import { z } from "zod";
import type { DeepPartial, DeepPartialEnv } from "../../../../src";

export const schema = z.object({
  numberValue: z.number(),
});

export type Config = z.infer<typeof schema>;
export type PartialConfig = DeepPartial<Config>;
export type PartialEnvConfig = DeepPartialEnv<Config>;
