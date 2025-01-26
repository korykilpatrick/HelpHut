import { Router } from 'express';
import { usersRouter } from './users';
import { donorsRouter } from './donors';
import { volunteersRouter } from './volunteers';
import { partnersRouter } from './partners';
import { donationsRouter } from './donations';
import { ticketsRouter } from './tickets';
import { foodTypesRouter } from './food-types';
import authRouter from './auth';
import { caseTransformMiddleware } from '../middleware/case-transform';

export function createApiRouter() {
  const router = Router();

  // Apply case transformation middleware to all API routes
  router.use(caseTransformMiddleware);

  // Mount all API routes
  router.use('/auth', authRouter);
  router.use('/users', usersRouter);
  router.use('/donors', donorsRouter);
  router.use('/volunteers', volunteersRouter);
  router.use('/partners', partnersRouter);
  router.use('/donations', donationsRouter);
  router.use('/tickets', ticketsRouter);
  router.use('/food-types', foodTypesRouter);

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
} 