import { defineConfig } from "vitest/config";
import devServer from "@hono/vite-dev-server";
import { nodeAdapter as adapter } from "@hono/vite-dev-server/node";
import build from "@hono/vite-build/netlify-functions";

export default defineConfig({
  envPrefix: "APP_", // stripped off in config.ts
  plugins: [
    devServer({
      entry: "./src/index.ts",
      adapter,
    }),
    build({
      entry: "./src/index.ts",
      output: "functions/server/index.js",
    })
  ],
  test: {
    globals: true,
    environment: "node",
  },
});
