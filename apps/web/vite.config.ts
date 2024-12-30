/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import { vitePlugin as remix } from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

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
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_lazyRouteDiscovery: true,
        v3_singleFetch: true,
        v3_routeConfig: true,
      },
    }),
    tsconfigPaths(),
  ],
});
