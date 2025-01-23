import { defineConfig } from "vite";
import devServer from "@hono/vite-dev-server";
import build from "@hono/vite-build/netlify-functions";

export default defineConfig({
  plugins: [
    devServer({
      entry: "./src/index.ts",
    }),
    build({
      entry: "./src/index.ts",
      output: "functions/server/index.js"
    })
  ],
});
