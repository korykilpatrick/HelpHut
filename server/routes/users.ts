import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middleware/validate';
import { api } from '../../lib/api/impl';
import { UserCreate, UserUpdate, UserRole } from '../../lib/api/generated/model/models';

const router = Router();

// Schema validation
const userCreateSchema = z.object({
  email: z.string().email(),
  hashedPassword: z.string(),
  role: z.nativeEnum(UserRole)
}) satisfies z.ZodType<UserCreate>;

const userUpdateSchema = z.object({
  email: z.string().email().optional(),
  hashedPassword: z.string().optional(),
  role: z.nativeEnum(UserRole).optional()
}) satisfies z.ZodType<UserUpdate>;

// GET /users - List users
router.get('/', async (req, res, next) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const users = await api.users.listUsers(
      limit ? parseInt(limit as string) : undefined,
      offset ? parseInt(offset as string) : undefined
    );
    res.json({ users });
  } catch (error) {
    next(error);
  }
});

// POST /users - Create user
router.post('/', validateRequest({ body: userCreateSchema }), async (req, res, next) => {
  try {
    const user = await api.users.createUser(req.body);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
});

// GET /users/:id - Get user by ID
router.get('/:id', async (req, res, next) => {
  try {
    const user = await api.users.getUser(req.params.id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// PATCH /users/:id - Update user
router.patch('/:id', validateRequest({ body: userUpdateSchema }), async (req, res, next) => {
  try {
    const user = await api.users.updateUser(req.params.id, req.body);
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// DELETE /users/:id - Delete user
router.delete('/:id', async (req, res, next) => {
  try {
    await api.users.deleteUser(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export const usersRouter = router; 