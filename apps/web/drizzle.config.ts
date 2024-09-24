import { defineConfig } from "drizzle-kit";
import config from "~/config";

export default defineConfig({
  schema: "./app/db/schema/*.ts",
  out: "./app/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: config.db.url,
  },
});
