import { Router } from 'express';
import { api } from '../../lib/api/impl';

export const createUsersRouter = () => {
  const router = Router();

  // List users
  router.get('/', async (req, res, next) => {
    try {
      const { limit, offset } = req.query;
      const users = await api.users.listUsers(
        limit ? parseInt(limit as string) : undefined,
        offset ? parseInt(offset as string) : undefined
      );
      res.json(users);
    } catch (error) {
      next(error);
    }
  });

  // Create user
  router.post('/', async (req, res, next) => {
    try {
      const user = await api.users.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  });

  // Get user by ID
  router.get('/:id', async (req, res, next) => {
    try {
      const user = await api.users.getUser(req.params.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  });

  // Update user
  router.patch('/:id', async (req, res, next) => {
    try {
      const user = await api.users.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  });

  // Delete user
  router.delete('/:id', async (req, res, next) => {
    try {
      await api.users.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  return router;
}; 