import type { Express } from "express";
import { createServer, type Server } from "http";
import { supabase, verifyConnection } from "../lib/db/supabase";
import { z } from "zod";

// Validation schemas
const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['Admin', 'Donor', 'Volunteer', 'Partner'])
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export function registerRoutes(app: Express): Server {
  // Health check endpoint
  app.get("/api/health", async (_req, res) => {
    try {
      // Test database connection
      await verifyConnection();
      res.json({ status: "healthy", database: "connected" });
    } catch (error) {
      res.status(500).json({ status: "unhealthy", error: "Database connection failed" });
    }
  });

  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, role } = signUpSchema.parse(req.body);

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      });

      if (authError) {
        console.error('Auth error:', authError);
        return res.status(400).json({ error: authError.message });
      }

      if (!authData.user) {
        console.error('No user data returned');
        return res.status(400).json({ error: "Failed to create user" });
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          role,
          password_hash: 'HASHED_' + password // TODO: Implement proper password hashing
        });

      if (profileError) {
        console.error('Profile error:', profileError);
        // Rollback auth user creation if possible
        return res.status(400).json({ error: profileError.message });
      }

      res.status(201).json({ user: authData.user });
    } catch (error) {
      console.error('Signup error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { email, password } = signInSchema.parse(req.body);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Signin error:', error);
        return res.status(401).json({ error: error.message });
      }

      if (!data.user) {
        console.error('No user data returned');
        return res.status(401).json({ error: "Invalid credentials" });
      }

      res.json({ user: data.user });
    } catch (error) {
      console.error('Signin error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/auth/signout", async (_req, res) => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: "Signed out successfully" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
