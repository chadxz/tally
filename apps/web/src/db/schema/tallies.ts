import { timestamp, pgTable } from "drizzle-orm/pg-core";
import { cuid2 } from "drizzle-cuid2/postgres";

export const tallies = pgTable("tallies", {
  id: cuid2("id").notNull().defaultRandom().primaryKey(),
  itemId: cuid2("item_id").notNull(),
  createdBy: cuid2("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type InsertTally = typeof tallies.$inferInsert;
export type SelectTally = typeof tallies.$inferSelect;
