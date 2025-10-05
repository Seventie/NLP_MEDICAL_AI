import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Drug schema
export const drugs = pgTable("drugs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  genericName: text("generic_name").notNull(),
  drugClasses: text("drug_classes"),
  brandNames: text("brand_names"),
  activity: text("activity"),
  rxOtc: text("rx_otc"),
  pregnancyCategory: text("pregnancy_category"),
  csa: text("csa"),
  alcohol: text("alcohol"),
  rating: decimal("rating"),
  description: text("description"),
});

export const insertDrugSchema = createInsertSchema(drugs).omit({
  id: true,
});

export type InsertDrug = z.infer<typeof insertDrugSchema>;
export type Drug = typeof drugs.$inferSelect;
