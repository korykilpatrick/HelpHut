import { Router } from 'express';
import { api } from '../../lib/api/impl';
import { validateRequest } from '../middleware/validate';
import { z } from 'zod';
import type { User } from '../../lib/db/types';

const router = Router();

// Schema for status update
const statusUpdateSchema = z.object({
  status: z.enum(['in_transit', 'delivered'])
});

// List available tickets
router.get('/tickets/available', async (req, res, next) => {
  try {
    const volunteerId = (req.user as User).id;
    const tickets = await api.tickets.listAvailableTickets(volunteerId);
    res.json({ tickets });
  } catch (error) {
    next(error);
  }
});

// Claim a ticket
router.post('/tickets/:id/claim', async (req, res, next) => {
  try {
    const volunteerId = (req.user as User).id;
    const ticketId = req.params.id;
    await api.tickets.claimTicket(ticketId, volunteerId);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Update ticket status
router.post(
  '/tickets/:id/status',
  validateRequest({ body: statusUpdateSchema }),
  async (req, res, next) => {
    try {
      const volunteerId = (req.user as User).id;
      const ticketId = req.params.id;
      const { status } = req.body;
      await api.tickets.updateTicketStatus(ticketId, volunteerId, status);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
);

// List active tickets
router.get('/tickets/active', async (req, res, next) => {
  try {
    const volunteerId = (req.user as User).id;
    const tickets = await api.tickets.listActiveTickets(volunteerId);
    res.json({ tickets });
  } catch (error) {
    next(error);
  }
});

// Get ticket history
router.get('/tickets/history', async (req, res, next) => {
  try {
    const volunteerId = (req.user as User).id;
    const history = await api.tickets.getTicketHistory(volunteerId);
    res.json({ history });
  } catch (error) {
    next(error);
  }
});

export default router; 