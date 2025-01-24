import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middleware/validate';
import { api } from '../../lib/api/impl';
import type { Database } from '../../lib/db/types';

type Ticket = Database['public']['Tables']['tickets']['Row'];
type TicketCreate = Database['public']['Tables']['tickets']['Insert'];
type TicketUpdate = Database['public']['Tables']['tickets']['Update'];
type TicketStatus = Database['public']['Enums']['ticket_status'];
type TicketPriority = Database['public']['Enums']['ticket_priority'];

const TICKET_STATUS = ['Submitted', 'Scheduled', 'InTransit', 'Delivered', 'Completed'] as const;
const TICKET_PRIORITY = ['Urgent', 'Routine'] as const;

const router = Router();

// Schema validation
const ticketCreateSchema = z.object({
  donationId: z.string().uuid().optional(),
  status: z.enum(['Submitted', 'Scheduled', 'InTransit', 'Delivered', 'Completed']).optional(),
  priority: z.enum(['Urgent', 'Routine']).optional(),
  volunteerId: z.string().uuid().optional(),
  partnerOrgId: z.string().uuid().optional(),
  pickupLocationId: z.string().uuid().optional(),
  dropoffLocationId: z.string().uuid().optional()
});

// Use same schema for updates
const ticketUpdateSchema = ticketCreateSchema;

// GET /tickets - List tickets
router.get('/', async (req, res, next) => {
  try {
    const tickets = await api.tickets.listTickets();
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