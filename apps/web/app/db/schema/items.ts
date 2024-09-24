import { text, timestamp, pgTable } from "drizzle-orm/pg-core";
import { cuid2 } from "drizzle-cuid2/postgres";

export const items = pgTable("items", {
  id: cuid2("id").notNull().defaultRandom().primaryKey(),
  description: text("description").notNull(),
  createdBy: cuid2("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type InsertItem = typeof items.$inferInsert;
export type SelectItem = typeof items.$inferSelect;
