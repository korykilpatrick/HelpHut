import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middleware/validate';
import { api } from '../../lib/api/impl';
import type { DonorCreate, DonorUpdate } from '../../lib/api/generated/api';

const router = Router();

// Schema validation
const donorCreateSchema = z.object({
  userId: z.string().uuid().optional(),
  name: z.string(),
  contactEmail: z.string().email(),
  contactPhone: z.string(),
  businessHours: z.string().optional(),
  pickupPreferences: z.string().optional(),
  locationId: z.string().uuid().optional()
}) satisfies z.ZodType<DonorCreate>;

const donorUpdateSchema = z.object({
  userId: z.string().uuid().optional(),
  name: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  businessHours: z.string().optional(),
  pickupPreferences: z.string().optional(),
  locationId: z.string().uuid().optional()
}) satisfies z.ZodType<DonorUpdate>;

// GET /donors - List donors
router.get('/', async (req, res, next) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const donors = await api.donors.listDonors(
      limit ? parseInt(limit as string) : undefined,
      offset ? parseInt(offset as string) : undefined
    );
    res.json({ donors });
  } catch (error) {
    next(error);
  }
});

// POST /donors - Create donor
router.post('/', validateRequest({ body: donorCreateSchema }), async (req, res, next) => {
  try {
    const donor = await api.donors.createDonor(req.body);
    res.status(201).json({ donor });
  } catch (error) {
    next(error);
  }
});

// GET /donors/:id - Get donor by ID
router.get('/:id', async (req, res, next) => {
  try {
    const donor = await api.donors.getDonor(req.params.id);
    res.json({ donor });
  } catch (error) {
    next(error);
  }
});

// PATCH /donors/:id - Update donor
router.patch('/:id', validateRequest({ body: donorUpdateSchema }), async (req, res, next) => {
  try {
    const donor = await api.donors.updateDonor(req.params.id, req.body);
    res.json({ donor });
  } catch (error) {
    next(error);
  }
});

// DELETE /donors/:id - Delete donor
router.delete('/:id', async (req, res, next) => {
  try {
    await api.donors.deleteDonor(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export const donorsRouter = router; 