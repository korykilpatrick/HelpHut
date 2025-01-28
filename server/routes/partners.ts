import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';
import { api } from '../../lib/api/impl';
import type { PartnerCreate, PartnerUpdate } from '../../lib/api/generated/api';
import type { Request, Response, NextFunction } from 'express';

const router = Router();

// Schema validation
const partnerCreateSchema = z.object({
  userId: z.string().uuid().optional(),
  name: z.string(),
  maxCapacity: z.number().optional(),
  capacity: z.number().optional(),
  contactEmail: z.string().email(),
  contactPhone: z.string(),
  locationId: z.string().uuid().optional()
}) satisfies z.ZodType<PartnerCreate>;

const partnerUpdateSchema = z.object({
  userId: z.string().uuid().optional(),
  name: z.string().optional(),
  maxCapacity: z.number().optional(),
  capacity: z.number().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  locationId: z.string().uuid().optional()
}) satisfies z.ZodType<PartnerUpdate>;

// Role check middleware
const requirePartnerRole = (req: Request, res: Response, next: NextFunction) => {
  const role = req.user?.role?.toLowerCase();
  if (role !== 'partner' && role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Partner role required.' });
  }
  next();
};

// GET /partners - List partners (Admin only)
router.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const role = req.user?.role?.toLowerCase();
  if (role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin role required.' });
  }

  try {
    const { limit = 10, offset = 0 } = req.query;
    const partners = await api.partners.listPartners(
      limit ? parseInt(limit as string) : undefined,
      offset ? parseInt(offset as string) : undefined
    );
    res.json({ partners });
  } catch (error) {
    next(error);
  }
});

// POST /partners - Create partner (Admin only)
router.post('/', requireAuth, validateRequest({ body: partnerCreateSchema }), async (req: Request, res: Response, next: NextFunction) => {
  const role = req.user?.role?.toLowerCase();
  if (role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin role required.' });
  }

  try {
    const partner = await api.partners.createPartner(req.body);
    res.status(201).json({ partner });
  } catch (error) {
    next(error);
  }
});

// GET /partners/:id - Get partner by ID
router.get('/:id', requireAuth, requirePartnerRole, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Partners can only view their own data
    const role = req.user?.role?.toLowerCase();
    const organizationId = req.user?.organizationId;
    if (role === 'partner' && organizationId !== req.params.id) {
      return res.status(403).json({ error: 'Access denied. You can only view your own data.' });
    }

    const partner = await api.partners.getPartner(req.params.id);
    res.json({ partner });
  } catch (error) {
    next(error);
  }
});

// PATCH /partners/:id - Update partner
router.patch('/:id', requireAuth, requirePartnerRole, validateRequest({ body: partnerUpdateSchema }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Partners can only update their own data
    const role = req.user?.role?.toLowerCase();
    const organizationId = req.user?.organizationId;
    if (role === 'partner' && organizationId !== req.params.id) {
      return res.status(403).json({ error: 'Access denied. You can only update your own data.' });
    }

    const partner = await api.partners.updatePartner(req.params.id, req.body);
    res.json({ partner });
  } catch (error) {
    next(error);
  }
});

// DELETE /partners/:id - Delete partner (Admin only)
router.delete('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  const role = req.user?.role?.toLowerCase();
  if (role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin role required.' });
  }

  try {
    await api.partners.deletePartner(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export const partnersRouter = router; 