import { text, timestamp, pgTable } from "drizzle-orm/pg-core";
import { cuid2 } from 'drizzle-cuid2/postgres';

export const users = pgTable("users", {
  id: cuid2("id").notNull().defaultRandom().primaryKey(),
  name: text("name").notNull(),
  created_by: cuid2("created_by").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});
