import { Express } from 'express';
import { createServer } from 'http';
import { createApiRouter } from './routes/index';
import { createDocsRouter } from './docs';

export async function registerRoutes(app: Express) {
  // Create HTTP server first
  const server = createServer(app);
  
  // Mount API documentation
  app.use('/docs', await createDocsRouter());
  
  // Mount API routes under /api/v1
  app.use('/api/v1', createApiRouter());
  
  return server;
}
