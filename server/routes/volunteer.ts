import { Router } from 'express';
import { api } from '../../lib/api/impl';
import { validateRequest } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';
import { z } from 'zod';
import type { Database } from '../../lib/db/types';
import { supabase } from '../../lib/db/supabase';
import type { User as AuthUser } from '@supabase/supabase-js';

type User = AuthUser & {
  id: string;
  role: string;
};

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

    // Get the volunteer record for this user
    const { data: volunteer, error: volunteerError } = await supabase
      .from('volunteers')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (volunteerError) throw volunteerError;
    if (!volunteer) {
      return res.status(404).json({ error: 'Volunteer record not found' });
    }

    console.log('Fetching available pickups for volunteer:', volunteer.id);
    const pickups = await api.donations.listAvailablePickups(volunteer.id);
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
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get the volunteer record for this user
    const { data: volunteer, error: volunteerError } = await supabase
      .from('volunteers')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (volunteerError) throw volunteerError;
    if (!volunteer) {
      return res.status(404).json({ error: 'Volunteer record not found' });
    }

    const tickets = await api.tickets.listAvailableTickets(volunteer.id);
    res.json({ tickets });
  } catch (error) {
    next(error);
  }
});

// Claim a ticket
router.post('/tickets/:id/claim', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const ticketId = req.params.id;

    // Get the volunteer record for this user
    const { data: volunteer, error: volunteerError } = await supabase
      .from('volunteers')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (volunteerError) throw volunteerError;
    if (!volunteer) {
      return res.status(404).json({ error: 'Volunteer record not found' });
    }

    await api.tickets.claimTicket(ticketId, volunteer.id);
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
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const ticketId = req.params.id;
      const { status } = req.body;

      // Get the volunteer record for this user
      const { data: volunteer, error: volunteerError } = await supabase
        .from('volunteers')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (volunteerError) throw volunteerError;
      if (!volunteer) {
        return res.status(404).json({ error: 'Volunteer record not found' });
      }

      await api.tickets.updateTicketStatus(ticketId, volunteer.id, status);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
);

// List active tickets
router.get('/tickets/active', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('Getting active tickets for user:', userId);

    // Get the volunteer record for this user
    const { data: volunteer, error: volunteerError } = await supabase
      .from('volunteers')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (volunteerError) {
      console.error('Error getting volunteer record:', volunteerError);
      throw volunteerError;
    }
    if (!volunteer) {
      console.log('No volunteer record found for user:', userId);
      return res.status(404).json({ error: 'Volunteer record not found' });
    }

    console.log('Found volunteer record:', volunteer);

    const tickets = await api.tickets.listActiveTickets(volunteer.id);
    console.log('Active tickets returned:', tickets);
    
    res.json({ tickets });
  } catch (error) {
    console.error('Error in /tickets/active:', error);
    next(error);
  }
});

// Get ticket history
router.get('/tickets/history', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get the volunteer record for this user
    const { data: volunteer, error: volunteerError } = await supabase
      .from('volunteers')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (volunteerError) throw volunteerError;
    if (!volunteer) {
      return res.status(404).json({ error: 'Volunteer record not found' });
    }

    const history = await api.tickets.getTicketHistory(volunteer.id);
    res.json({ history });
  } catch (error) {
    next(error);
  }
});

export default router; 