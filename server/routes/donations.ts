import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middleware/validate';
import { api } from '../../lib/api/impl';
import type { DonationCreate, DonationUpdate } from '../../lib/api/generated/api';

const router = Router();

// Schema validation
const donationItemSchema = z.object({
  food_type_id: z.string(),
  quantity: z.number(),
  unit: z.string(),
  expiration_date: z.string().optional(),
  storage_requirements: z.string().optional(),
  notes: z.string().optional()
});

const donationCreateSchema = z.object({
  donorId: z.string().uuid().optional()
}) satisfies z.ZodType<DonationCreate>;

const donationUpdateSchema = z.object({
  donorId: z.string().uuid().optional()
}) satisfies z.ZodType<DonationUpdate>;

// GET /donations - List donations
router.get('/', async (req, res, next) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const donations = await api.donations.listDonations(
      limit ? parseInt(limit as string) : undefined,
      offset ? parseInt(offset as string) : undefined
    );
    res.json({ donations });
  } catch (error) {
    next(error);
  }
});

// POST /donations - Create donation
router.post('/', validateRequest({ body: donationCreateSchema }), async (req, res, next) => {
  try {
    const donation = await api.donations.createDonation(req.body);
    res.status(201).json({ donation });
  } catch (error) {
    next(error);
  }
});

// GET /donations/:id - Get donation by ID
router.get('/:id', async (req, res, next) => {
  try {
    const donation = await api.donations.getDonation(req.params.id);
    res.json({ donation });
  } catch (error) {
    next(error);
  }
});

// PATCH /donations/:id - Update donation
router.patch('/:id', validateRequest({ body: donationUpdateSchema }), async (req, res, next) => {
  try {
    const donation = await api.donations.updateDonation(req.params.id, req.body);
    res.json({ donation });
  } catch (error) {
    next(error);
  }
});

// DELETE /donations/:id - Delete donation
router.delete('/:id', async (req, res, next) => {
  try {
    await api.donations.deleteDonation(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export const donationsRouter = router; 