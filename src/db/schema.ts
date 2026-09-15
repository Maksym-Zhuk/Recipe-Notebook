import { sql } from "drizzle-orm";
import {
  customType,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// drizzle 0.45 has no built-in bytea; hex round-trip works on every driver
const bytea = customType<{ data: Buffer; driverData: unknown }>({
  dataType: () => "bytea",
  toDriver: (v) => sql`decode(${v.toString("hex")}, 'hex')`,
  fromDriver: (v) =>
    typeof v === "string"
      ? Buffer.from(v.slice(2), "hex")
      : Buffer.from(v as Uint8Array),
});

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  ingredients: text("ingredients").notNull().default(""),
  steps: text("steps").notNull().default(""),
  photo: bytea("photo"), // ponytail: фото в bytea, Vercel Blob / R2 коли Neon >0.5 GB
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Recipe = typeof recipes.$inferSelect;
