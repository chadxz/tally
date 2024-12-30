/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    pool: "forks",
    poolOptions: {
      forks: {
        execArgv: [
          // Allows loading ESM TypeScript modules with `require()` which is
          // needed by @tally/typedconfig.
          "--experimental-strip-types",
          "--experimental-require-module",
        ],
      },
    },
  },
  plugins: [
    reactRouter(),
    tsconfigPaths(),
  ],
});
