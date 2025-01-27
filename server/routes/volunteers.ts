import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middleware/validate';
import { api } from '../../lib/api/impl';

const router = Router();

// Schema validation
const volunteerCreateSchema = z.object({
  userId: z.string().uuid().optional(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  vehicleType: z.string().optional(),
  locationId: z.string().uuid().optional()
});

const volunteerUpdateSchema = z.object({
  userId: z.string().uuid().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  vehicleType: z.string().optional(),
  locationId: z.string().uuid().optional()
});

const statusUpdateSchema = z.object({
  status: z.enum(['in_transit', 'delivered'])
});

// GET /volunteers - List volunteers
router.get('/', async (req, res, next) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const volunteers = await api.volunteers.listVolunteers(
      limit ? parseInt(limit as string) : undefined,
      offset ? parseInt(offset as string) : undefined
    );
    res.json({ volunteers });
  } catch (error) {
    next(error);
  }
});

// POST /volunteers - Create volunteer
router.post('/', validateRequest({ body: volunteerCreateSchema }), async (req, res, next) => {
  try {
    const volunteer = await api.volunteers.createVolunteer(req.body);
    res.status(201).json({ volunteer });
  } catch (error) {
    next(error);
  }
});

// GET /volunteers/:id - Get volunteer by ID
router.get('/:id', async (req, res, next) => {
  try {
    const volunteer = await api.volunteers.getVolunteer(req.params.id);
    res.json({ volunteer });
  } catch (error) {
    next(error);
  }
});

// PATCH /volunteers/:id - Update volunteer
router.patch('/:id', validateRequest({ body: volunteerUpdateSchema }), async (req, res, next) => {
  try {
    const volunteer = await api.volunteers.updateVolunteer(req.params.id, req.body);
    res.json({ volunteer });
  } catch (error) {
    next(error);
  }
});

// DELETE /volunteers/:id - Delete volunteer
router.delete('/:id', async (req, res, next) => {
  try {
    await api.volunteers.deleteVolunteer(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Pickup and Delivery Routes

// GET /volunteers/:id/pickups/available - List available pickups
router.get('/:id/pickups/available', async (req, res, next) => {
  try {
    const volunteerId = req.params.id;
    const pickups = await api.donations.listAvailablePickups(volunteerId);
    res.json({ pickups });
  } catch (error) {
    next(error);
  }
});

// POST /volunteers/:id/pickups/:pickupId/claim - Claim a pickup
router.post('/:id/pickups/:pickupId/claim', async (req, res, next) => {
  try {
    const volunteerId = req.params.id;
    const pickupId = req.params.pickupId;
    await api.donations.claimPickup(pickupId, volunteerId);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// POST /volunteers/:id/pickups/:pickupId/status - Update pickup status
router.post(
  '/:id/pickups/:pickupId/status',
  validateRequest({ body: statusUpdateSchema }),
  async (req, res, next) => {
    try {
      const volunteerId = req.params.id;
      const pickupId = req.params.pickupId;
      const { status } = req.body;
      await api.donations.updatePickupStatus(pickupId, volunteerId, status);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
);

// GET /volunteers/:id/deliveries/active - List active deliveries
router.get('/:id/deliveries/active', async (req, res, next) => {
  try {
    const volunteerId = req.params.id;
    const deliveries = await api.donations.listActiveDeliveries(volunteerId);
    res.json({ deliveries });
  } catch (error) {
    next(error);
  }
});

// GET /volunteers/:id/deliveries/history - Get delivery history
router.get('/:id/deliveries/history', async (req, res, next) => {
  try {
    const volunteerId = req.params.id;
    const history = await api.donations.getDeliveryHistory(volunteerId);
    res.json({ history });
  } catch (error) {
    next(error);
  }
});

export const volunteersRouter = router; 