import { text, timestamp, pgTable } from "drizzle-orm/pg-core";
import { cuid2 } from "drizzle-cuid2/postgres";

export const users = pgTable("users", {
  id: cuid2("id").notNull().defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdBy: cuid2("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
