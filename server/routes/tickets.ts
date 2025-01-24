import { Router } from 'express';
import { IsOptional, IsUUID, IsEnum } from 'class-validator';
import { validateRequest } from '../middleware/validate.js';
import { api } from '../../lib/api/impl/index.js';
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
class CreateTicketDto {
  @IsOptional()
  @IsUUID()
  donation_id?: string;

  @IsOptional()
  @IsEnum(TICKET_STATUS)
  status?: typeof TICKET_STATUS[number];

  @IsOptional()
  @IsEnum(TICKET_PRIORITY)
  priority?: typeof TICKET_PRIORITY[number];

  @IsOptional()
  @IsUUID()
  volunteer_id?: string;

  @IsOptional()
  @IsUUID()
  partner_org_id?: string;

  @IsOptional()
  @IsUUID()
  pickup_location_id?: string;

  @IsOptional()
  @IsUUID()
  dropoff_location_id?: string;
}

class UpdateTicketDto extends CreateTicketDto {}

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
router.post('/', validateRequest({ body: CreateTicketDto }), async (req, res, next) => {
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
router.patch('/:id', validateRequest({ body: UpdateTicketDto }), async (req, res, next) => {
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