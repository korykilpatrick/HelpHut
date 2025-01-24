import { Router } from 'express';
import { validateRequest } from '../middleware/validate';
import { api } from '../../lib/api/impl/index';
import type { Database } from '../../lib/db/types';

type User = Database['public']['Tables']['users']['Row'];
type UserCreate = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];
type UserRole = Database['public']['Enums']['user_role'];

const USER_ROLES = ['Admin', 'Donor', 'Volunteer', 'Partner'] as const;

const router = Router();

// Validation schemas
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateUserCreate = (data: any): data is UserCreate => {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.email === 'string' &&
    validateEmail(data.email) &&
    typeof data.hashedPassword === 'string' &&
    typeof data.role === 'string' &&
    USER_ROLES.includes(data.role as any)
  );
};

const validateUserUpdate = (data: any): data is UserUpdate => {
  return (
    typeof data === 'object' &&
    data !== null &&
    (!('email' in data) || (typeof data.email === 'string' && validateEmail(data.email))) &&
    (!('hashedPassword' in data) || typeof data.hashedPassword === 'string') &&
    (!('role' in data) || (typeof data.role === 'string' && USER_ROLES.includes(data.role as any)))
  );
};

const validateQuery = (data: any) => {
  return (
    typeof data === 'object' &&
    data !== null &&
    (!('limit' in data) || (typeof data.limit === 'string' && !isNaN(parseInt(data.limit)))) &&
    (!('offset' in data) || (typeof data.offset === 'string' && !isNaN(parseInt(data.offset))))
  );
};

// Middleware
const validateBody = (validator: (data: any) => boolean) => {
  return (req: any, res: any, next: any) => {
    if (!validator(req.body)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }
    next();
  };
};

const validateQueryParams = (req: any, res: any, next: any) => {
  if (!validateQuery(req.query)) {
    return res.status(400).json({ error: 'Invalid query parameters' });
  }
  next();
};

// Routes
router.get('/', validateQueryParams, async (req, res, next) => {
  try {
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit) : 10;
    const offset = typeof req.query.offset === 'string' ? parseInt(req.query.offset) : 0;
    const users = await api.users.listUsers(limit, offset);
    res.json({ users });
  } catch (error) {
    next(error);
  }
});

router.post('/', validateBody(validateUserCreate), async (req, res, next) => {
  try {
    const user = await api.users.createUser(req.body);
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await api.users.getUser(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', validateBody(validateUserUpdate), async (req, res, next) => {
  try {
    const user = await api.users.updateUser(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await api.users.deleteUser(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export const usersRouter = router; 