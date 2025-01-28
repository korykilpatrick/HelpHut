import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middleware/validate';
import { api } from '../../lib/api/impl';
import { requireAuth } from '../middleware/auth';
import { DonationNotFoundError, DonationConflictError } from '../../lib/api/impl/donations';
import { PartnersApiImpl } from '../../lib/api/impl/partners';
import type { User } from '@supabase/supabase-js';

const router = Router();

// Error handler middleware
const handleError = (error: any, res: any) => {
  if (error instanceof DonationNotFoundError) {
    return res.status(404).json({
      error: {
        type: 'NOT_FOUND',
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
  console.error('Unhandled partner donation error:', error);
  return res.status(500).json({
    error: {
      type: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  });
};

// GET /partners/donations/available - List available donations
router.get('/available', requireAuth, async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const user = req.user as User;
    if (!user?.id) {
      throw new Error('User ID not found');
    }
    const donations = await new PartnersApiImpl({ user: { id: user.id } }).listAvailableDonations({
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined
    });
    res.json({ donations });
  } catch (error) {
    handleError(error, res);
  }
});

// GET /partners/donations/claimed - List claimed donations
router.get('/claimed', requireAuth, async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const user = req.user as User;
    if (!user?.id) {
      throw new Error('User ID not found');
    }
    const donations = await new PartnersApiImpl({ user: { id: user.id } }).listClaimedDonations({
      limit: limit ? parseInt(limit as string) : undefined,
      offset: offset ? parseInt(offset as string) : undefined
    });
    res.json({ donations });
  } catch (error) {
    handleError(error, res);
  }
});

// POST /partners/donations/:id/claim - Claim a donation
router.post('/:id/claim', requireAuth, async (req, res) => {
  try {
    const user = req.user as User;
    if (!user?.id) {
      throw new Error('User ID not found');
    }
    const ticket = await new PartnersApiImpl({ user: { id: user.id } }).claimDonation(req.params.id);
    res.json({
      ticket,
      message: 'Donation claimed successfully'
    });
  } catch (error) {
    handleError(error, res);
  }
});

export const partnerDonationsRouter = router; 
