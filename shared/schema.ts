import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  type: text("type").notNull(), // 'auto', 'map', 'manual'
  createdAt: timestamp("created_at").defaultNow(),
});

export const queries = pgTable("queries", {
  id: serial("id").primaryKey(),
  locationId: integer("location_id").references(() => locations.id).notNull(),
  prompt: text("prompt").notNull(),
  extractedParams: jsonb("extracted_params"), // JSON object with extracted parameters
  response: text("response"),
  visualizationData: jsonb("visualization_data"), // Chart data, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  locationId: integer("location_id").references(() => locations.id).notNull(),
  sessionId: text("session_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLocationSchema = createInsertSchema(locations).pick({
  name: true,
  latitude: true,
  longitude: true,
  type: true,
});

export const insertQuerySchema = createInsertSchema(queries).pick({
  locationId: true,
  prompt: true,
  extractedParams: true,
  response: true,
  visualizationData: true,
});

export const insertConversationSchema = createInsertSchema(conversations).pick({
  locationId: true,
  sessionId: true,
});

export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Location = typeof locations.$inferSelect;
export type InsertQuery = z.infer<typeof insertQuerySchema>;
export type Query = typeof queries.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;
