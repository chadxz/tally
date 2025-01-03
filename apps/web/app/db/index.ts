import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import config from "~/config";

const sql = neon(config.neonUrl);
const db = drizzle(sql);

export default db;
