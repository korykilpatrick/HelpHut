import { Router } from 'express';
import { api } from '../../lib/api/impl';
import { validateRequest } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';
import { z } from 'zod';
import type { Database } from '../../lib/db/types';

type User = Database['public']['Tables']['users']['Row'];

const router = Router();

// Schema for status update
const statusUpdateSchema = z.object({
  status: z.enum(['in_transit', 'delivered'])
});

// List available pickups
router.get('/pickups/available', requireAuth, async (req, res, next) => {
  console.log('Route /pickups/available hit');
  try {
    if (!req.user) {
      console.log('No user found in request');
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const volunteerId = (req.user as User).id;
    console.log('Fetching available pickups for volunteer:', volunteerId);
    const pickups = await api.donations.listAvailablePickups(volunteerId);
    console.log('Pickups found:', pickups.length);
    res.json({ pickups });
  } catch (error) {
    console.error('Error in /pickups/available:', error);
    next(error);
  }
});

// List available tickets
router.get('/tickets/available', requireAuth, async (req, res, next) => {
  try {
    const volunteerId = (req.user as User).id;
    const tickets = await api.tickets.listAvailableTickets(volunteerId);
    res.json({ tickets });
  } catch (error) {
    next(error);
  }
});

// Claim a ticket
router.post('/tickets/:id/claim', requireAuth, async (req, res, next) => {
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
  requireAuth,
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
router.get('/tickets/active', requireAuth, async (req, res, next) => {
  try {
    const volunteerId = (req.user as User).id;
    const tickets = await api.tickets.listActiveTickets(volunteerId);
    res.json({ tickets });
  } catch (error) {
    next(error);
  }
});

// Get ticket history
router.get('/tickets/history', requireAuth, async (req, res, next) => {
  try {
    const volunteerId = (req.user as User).id;
    const history = await api.tickets.getTicketHistory(volunteerId);
    res.json({ history });
  } catch (error) {
    next(error);
  }
});

export default router; 