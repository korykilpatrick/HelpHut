import 'reflect-metadata';
import express, { type Request, Response, NextFunction } from 'express';
import { registerRoutes } from './routes';
import dotenv from 'dotenv';
import { setupVite, serveStatic, log } from "./vite";

dotenv.config();

// Create Express app
export const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Error handling
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Register routes
const server = await registerRoutes(app);

// ALWAYS serve the app on port 3000
// this serves both the API and the client
const PORT = 3000;
server.listen(PORT, "0.0.0.0", async () => {
  log("🚀 Server started successfully");
  log(`📡 Environment: ${app.get("env")}`);
  log(`🌐 Server listening at http://localhost:${PORT}`);
  
  // Setup Vite after server is listening
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
});

// Start server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT) || 3000;
  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
