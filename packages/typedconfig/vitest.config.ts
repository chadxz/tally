import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    pool: "forks",
    poolOptions: {
      forks: {
        execArgv: [
          // Allows loading ESM TypeScript modules with `require()`.
          "--experimental-strip-types",
          "--experimental-require-module",
        ],
      },
    },
  },
});
