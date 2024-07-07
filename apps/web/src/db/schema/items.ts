import { text, timestamp, pgTable, integer } from "drizzle-orm/pg-core";
import { cuid2 } from 'drizzle-cuid2/postgres';

export const items = pgTable("items", {
  id: cuid2("id").notNull().defaultRandom().primaryKey(),
  description: text("description").notNull(),
  created_by: cuid2("created_by").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});
