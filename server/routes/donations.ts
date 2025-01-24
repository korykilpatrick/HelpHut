import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middleware/validate';
import { api } from '../../lib/api/impl';
import type { DonationCreate } from '../../lib/api/generated/src/models/DonationCreate';
import type { DonationUpdate } from '../../lib/api/generated/src/models/DonationUpdate';
import { DonationNotFoundError, DonationValidationError, DonationConflictError } from '../../lib/api/impl/donations';

const router = Router();

// Schema validation
const donationCreateSchema = z.object({
  donorId: z.string().uuid(),
  foodTypeId: z.string().uuid(),
  quantity: z.number().min(0),
  unit: z.string(),
  expirationDate: z.coerce.date().optional(),
  storageRequirements: z.string().optional(),
  requiresRefrigeration: z.boolean().default(false),
  requiresFreezing: z.boolean().default(false),
  isFragile: z.boolean().default(false),
  requiresHeavyLifting: z.boolean().default(false),
  pickupWindowStart: z.coerce.date(),
  pickupWindowEnd: z.coerce.date()
}).refine(
  data => data.pickupWindowStart < data.pickupWindowEnd,
  { message: "Pickup window end time must be after start time" }
);

const donationUpdateSchema = z.object({
  foodTypeId: z.string().uuid().optional(),
  quantity: z.number().min(0).optional(),
  unit: z.string().optional(),
  expirationDate: z.coerce.date().optional(),
  storageRequirements: z.string().optional(),
  requiresRefrigeration: z.boolean().optional(),
  requiresFreezing: z.boolean().optional(),
  isFragile: z.boolean().optional(),
  requiresHeavyLifting: z.boolean().optional(),
  pickupWindowStart: z.coerce.date().optional(),
  pickupWindowEnd: z.coerce.date().optional()
}).refine(
  data => !data.pickupWindowStart || !data.pickupWindowEnd || 
          data.pickupWindowStart < data.pickupWindowEnd,
  { message: "Pickup window end time must be after start time" }
);

// Error handler middleware
const handleDonationError = (error: any, res: any) => {
  if (error instanceof DonationNotFoundError) {
    return res.status(404).json({
      error: {
        type: 'NOT_FOUND',
        message: error.message
      }
    });
  }
  
  if (error instanceof DonationValidationError) {
    return res.status(400).json({
      error: {
        type: 'VALIDATION_ERROR',
        message: error.message
      }
    });
  }
  
  if (error instanceof DonationConflictError) {
    return res.status(409).json({
      error: {
        type: 'CONFLICT',
        message: error.message
      }
    });
  }

  // Default error response
  console.error('Unhandled donation error:', error);
  return res.status(500).json({
    error: {
      type: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  });
};

// GET /donations - List donations
router.get('/', async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const donations = await api.donations.listDonations(
      limit ? parseInt(limit as string) : undefined,
      offset ? parseInt(offset as string) : undefined
    );
    res.json({ donations });
  } catch (error) {
    handleDonationError(error, res);
  }
});

// POST /donations - Create donation
router.post('/', validateRequest({ body: donationCreateSchema }), async (req, res) => {
  try {
    const donation = await api.donations.createDonation(req.body);
    res.status(201).json({ 
      donation,
      message: 'Donation created successfully'
    });
  } catch (error) {
    handleDonationError(error, res);
  }
});

// GET /donations/:id - Get donation by ID
router.get('/:id', async (req, res) => {
  try {
    const donation = await api.donations.getDonation(req.params.id);
    res.json({ donation });
  } catch (error) {
    handleDonationError(error, res);
  }
});

// PATCH /donations/:id - Update donation
router.patch('/:id', validateRequest({ body: donationUpdateSchema }), async (req, res) => {
  try {
    const donation = await api.donations.updateDonation(req.params.id, req.body);
    res.json({ 
      donation,
      message: 'Donation updated successfully'
    });
  } catch (error) {
    handleDonationError(error, res);
  }
});

// DELETE /donations/:id - Delete donation
router.delete('/:id', async (req, res) => {
  try {
    await api.donations.deleteDonation(req.params.id);
    res.status(204).send();
  } catch (error) {
    handleDonationError(error, res);
  }
});

export const donationsRouter = router; 