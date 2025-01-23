import { Router } from 'express';
import { createUsersRouter } from './users';

export const createApiRouter = () => {
  const router = Router();

  // Mount API routes
  router.use('/users', createUsersRouter());
  
  // Error handling middleware
  router.use((err: any, req: any, res: any, next: any) => {
    console.error('API Error:', err);
    res.status(err.status || 500).json({
      error: {
        message: err.message || 'Internal server error',
        status: err.status || 500
      }
    });
  });

  return router;
}; 