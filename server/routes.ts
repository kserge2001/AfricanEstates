import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertPropertySchema, propertySearchSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // API routes
  app.get("/api/properties", async (req, res) => {
    try {
      const properties = await storage.getAllProperties();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/featured", async (req, res) => {
    try {
      const properties = await storage.getFeaturedProperties();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      const property = await storage.getProperty(propertyId);

      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }

      res.json(property);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch property" });
    }
  });

  app.post("/api/properties/search", async (req, res) => {
    try {
      const searchCriteria = propertySearchSchema.parse(req.body);
      const properties = await storage.searchProperties(searchCriteria);
      res.json(properties);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Invalid search parameters", details: error.errors });
      }
      res.status(500).json({ error: "Failed to search properties" });
    }
  });

  app.post("/api/properties", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "You must be logged in to post a property" });
    }

    try {
      const propertyData = insertPropertySchema.parse(req.body);
      const userId = req.user!.id;
      
      const property = await storage.createProperty({
        ...propertyData,
        userId
      });

      res.status(201).json(property);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: "Invalid property data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create property" });
    }
  });

  app.get("/api/user/:id/properties", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const properties = await storage.getUserProperties(userId);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user properties" });
    }
  });

  app.get("/api/countries", async (_req, res) => {
    // Return a static list of African countries
    const countries = [
      "Nigeria", "Kenya", "South Africa", "Ghana", "Egypt", 
      "Tanzania", "Morocco", "Algeria", "Ethiopia", "Uganda",
      "Rwanda", "Senegal", "Ivory Coast", "Cameroon", "Namibia"
    ];
    res.json(countries);
  });

  const httpServer = createServer(app);
  return httpServer;
}
