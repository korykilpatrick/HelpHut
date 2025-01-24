import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middleware/validate';
import { api } from '../../lib/api/impl';
import type { PartnerCreate, PartnerUpdate } from '../../lib/api/generated/api';

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

// GET /partners - List partners
router.get('/', async (req, res, next) => {
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

// POST /partners - Create partner
router.post('/', validateRequest({ body: partnerCreateSchema }), async (req, res, next) => {
  try {
    const partner = await api.partners.createPartner(req.body);
    res.status(201).json({ partner });
  } catch (error) {
    next(error);
  }
});

// GET /partners/:id - Get partner by ID
router.get('/:id', async (req, res, next) => {
  try {
    const partner = await api.partners.getPartner(req.params.id);
    res.json({ partner });
  } catch (error) {
    next(error);
  }
});

// PATCH /partners/:id - Update partner
router.patch('/:id', validateRequest({ body: partnerUpdateSchema }), async (req, res, next) => {
  try {
    const partner = await api.partners.updatePartner(req.params.id, req.body);
    res.json({ partner });
  } catch (error) {
    next(error);
  }
});

// DELETE /partners/:id - Delete partner
router.delete('/:id', async (req, res, next) => {
  try {
    await api.partners.deletePartner(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export const partnersRouter = router; 