import { timestamp, pgTable } from "drizzle-orm/pg-core";
import { cuid2 } from 'drizzle-cuid2/postgres';

export const tallies = pgTable("tallies", {
  id: cuid2("id").notNull().defaultRandom().primaryKey(),
  item_id: cuid2("item_id").notNull(),
  created_by: cuid2("created_by").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
