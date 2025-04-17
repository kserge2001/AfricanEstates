import { pgTable, text, serial, integer, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  phone: text("phone"),
  isAgent: boolean("is_agent").default(false),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  area: doublePrecision("area"),
  country: text("country").notNull(),
  city: text("city").notNull(),
  neighborhood: text("neighborhood"),
  address: text("address"),
  propertyType: text("property_type").notNull(), // apartment, house, villa, land, commercial
  listingType: text("listing_type").notNull(), // sale, rent
  yearBuilt: integer("year_built"),
  features: text("features"),  // JSON stringified array
  mainImage: text("main_image").notNull(),
  images: text("images"), // JSON stringified array
  userId: integer("user_id").notNull(),
  featured: boolean("featured").default(false),
  status: text("status").default("active"), // active, sold, rented
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  phone: true,
  isAgent: true,
});

export const insertPropertySchema = createInsertSchema(properties)
  .omit({ id: true, userId: true, createdAt: true, featured: true })
  .extend({
    features: z.string().optional(),
    images: z.string().optional(),
  });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

// For validation in property search
export const propertySearchSchema = z.object({
  listingType: z.string().optional(),
  country: z.string().optional(),
  propertyType: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  minArea: z.number().optional(),
  maxArea: z.number().optional(),
  features: z.array(z.string()).optional(),
  yearBuilt: z.number().optional(),
});

export type PropertySearch = z.infer<typeof propertySearchSchema>;

// Financing Request Schema
export const financingRequestSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  salary: z.number().positive("Salary must be a positive number"),
  jobTitle: z.string().min(1, "Job title is required"),
  loanAmount: z.number().positive("Loan amount must be a positive number"),
  monthlyPayment: z.number().positive("Monthly payment must be a positive number"),
  preferredCurrency: z.string().min(1, "Preferred currency is required"),
  phoneNumber: z.string().optional(),
  additionalComments: z.string().optional(),
});

export type FinancingRequest = z.infer<typeof financingRequestSchema>;
