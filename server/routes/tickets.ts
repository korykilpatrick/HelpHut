import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middleware/validate';
import { api } from '../../lib/api/impl';
import { TicketCreate, TicketUpdate, TicketPriority, TicketStatus } from '../../lib/api/generated/model/models';

const router = Router();

// Schema validation
const ticketCreateSchema = z.object({
  donationId: z.string().uuid().optional(),
  status: z.nativeEnum(TicketStatus).optional(),
  priority: z.nativeEnum(TicketPriority).optional(),
  volunteerId: z.string().uuid().optional(),
  partnerOrgId: z.string().uuid().optional(),
  pickupLocationId: z.string().uuid().optional(),
  dropoffLocationId: z.string().uuid().optional()
}) satisfies z.ZodType<TicketCreate>;

const ticketUpdateSchema = z.object({
  donationId: z.string().uuid().optional(),
  status: z.nativeEnum(TicketStatus).optional(),
  priority: z.nativeEnum(TicketPriority).optional(),
  volunteerId: z.string().uuid().optional(),
  partnerOrgId: z.string().uuid().optional(),
  pickupLocationId: z.string().uuid().optional(),
  dropoffLocationId: z.string().uuid().optional()
}) satisfies z.ZodType<TicketUpdate>;

// GET /tickets - List tickets
router.get('/', async (req, res, next) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const tickets = await api.tickets.listTickets(
      limit ? parseInt(limit as string) : undefined,
      offset ? parseInt(offset as string) : undefined
    );
    res.json({ tickets });
  } catch (error) {
    next(error);
  }
});

// POST /tickets - Create ticket
router.post('/', validateRequest({ body: ticketCreateSchema }), async (req, res, next) => {
  try {
    const ticket = await api.tickets.createTicket(req.body);
    res.status(201).json({ ticket });
  } catch (error) {
    next(error);
  }
});

// GET /tickets/:id - Get ticket by ID
router.get('/:id', async (req, res, next) => {
  try {
    const ticket = await api.tickets.getTicket(req.params.id);
    res.json({ ticket });
  } catch (error) {
    next(error);
  }
});

// PATCH /tickets/:id - Update ticket
router.patch('/:id', validateRequest({ body: ticketUpdateSchema }), async (req, res, next) => {
  try {
    const ticket = await api.tickets.updateTicket(req.params.id, req.body);
    res.json({ ticket });
  } catch (error) {
    next(error);
  }
});

// DELETE /tickets/:id - Delete ticket
router.delete('/:id', async (req, res, next) => {
  try {
    await api.tickets.deleteTicket(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export const ticketsRouter = router; 