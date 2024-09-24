import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import config from "~/config";

const sql = neon(config.db.url);
const db = drizzle(sql);

export default db;
