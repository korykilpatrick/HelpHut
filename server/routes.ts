import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { users } from "@db/schema";

export function registerRoutes(app: Express): Server {
  // Health check endpoint
  app.get("/api/health", async (_req, res) => {
    try {
      // Test database connection
      await db.select().from(users).limit(1);
      res.json({ status: "healthy", database: "connected" });
    } catch (error) {
      res.status(500).json({ status: "unhealthy", error: "Database connection failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
