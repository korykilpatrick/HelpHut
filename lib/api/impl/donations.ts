import { BaseApiImpl } from './base';
import type { Donation, DonationCreate, DonationUpdate } from '../generated/src/models';
import { toSnakeCase } from '../../utils/case-transform';
import { PostgrestError } from '@supabase/supabase-js';

// Custom error classes for donation-specific errors
export class DonationNotFoundError extends Error {
  status = 404;
  constructor(id: string) {
    super(`Donation with ID ${id} not found`);
    this.name = 'DonationNotFoundError';
  }
}

export class DonationValidationError extends Error {
  status = 400;
  constructor(message: string) {
    super(message);
    this.name = 'DonationValidationError';
  }
}

export class DonationConflictError extends Error {
  status = 409;
  constructor(message: string) {
    super(message);
    this.name = 'DonationConflictError';
  }
}

// Define the database row type
interface DonationRow {
  id: string;
  food_type_id: string;
  food_type: {
    id: string;
    name: string;
  };
  quantity: number;
  unit: string;
  status: string;
  pickup_window_start: string;
  pickup_window_end: string;
  donor_id: string;
  created_at: string;
  updated_at: string;
  requires_refrigeration?: boolean;
  requires_freezing?: boolean;
  is_fragile?: boolean;
  requires_heavy_lifting?: boolean;
  notes?: string;
  ticket?: {
    status: string;
  };
}

export class DonationsApiImpl extends BaseApiImpl {
  async listDonations(params: {
    limit?: number;
    offset?: number;
    status?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ donations: Donation[] }> {
    try {
      console.log('Listing donations with params:', params);
      
      let query = this.db
        .from('donations')
        .select(`
          *,
          food_type:food_types(*),
          ticket:tickets(status)
        `);

      // Apply filters
      if (params.status) {
        query = query.eq('tickets.status', params.status);
      }
      
      if (params.startDate) {
        query = query.gte('pickup_window_start', params.startDate);
      }
      
      if (params.endDate) {
        query = query.lte('pickup_window_end', params.endDate);
      }
      
      if (params.search) {
        query = query.textSearch('food_type_name', params.search);
      }

      // Apply pagination
      if (params.limit) {
        query = query.limit(params.limit);
      }
      if (params.offset) {
        query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
      }

      // Order by pickup window
      query = query.order('pickup_window_start', { ascending: true });

      const { data, error } = await query;
      
      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      // Transform the response to match the API format
      const donations = (data as DonationRow[]).map(row => ({
        id: row.id,
        foodTypeId: row.food_type_id,
        quantity: row.quantity,
        unit: row.unit,
        pickupWindowStart: new Date(row.pickup_window_start),
        pickupWindowEnd: new Date(row.pickup_window_end),
        donorId: row.donor_id,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        requiresRefrigeration: row.requires_refrigeration,
        requiresFreezing: row.requires_freezing,
        isFragile: row.is_fragile,
        requiresHeavyLifting: row.requires_heavy_lifting,
        notes: row.notes,
        ticket: row.ticket ? { status: row.ticket.status } : undefined
      }));

      return { donations };
    } catch (error) {
      console.error('Error in listDonations:', error);
      if (error instanceof PostgrestError) {
        throw new Error('Database error: ' + error.message);
      }
      throw error;
    }
  }

  async createDonation(donation: DonationCreate): Promise<Donation> {
    try {
      // Validate pickup window
      if (new Date(donation.pickupWindowStart) >= new Date(donation.pickupWindowEnd)) {
        throw new DonationValidationError('Pickup window end time must be after start time');
      }

      // Transform to snake_case for database
      const dbDonation = {
        donor_id: donation.donorId,
        food_type_id: donation.foodTypeId,
        quantity: donation.quantity,
        unit: donation.unit,
        requires_refrigeration: donation.requiresRefrigeration,
        requires_freezing: donation.requiresFreezing,
        is_fragile: donation.isFragile,
        requires_heavy_lifting: donation.requiresHeavyLifting,
        pickup_window_start: donation.pickupWindowStart,
        pickup_window_end: donation.pickupWindowEnd
      };

      const { data, error } = await this.db
        .from('donations')
        .insert(dbDonation)
        .select(`
          *,
          food_type:food_types(*)
        `)
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Failed to create donation');
      }

      const row = data as DonationRow;
      // Transform the response to match the API format
      return {
        id: row.id,
        foodTypeId: row.food_type_id,
        quantity: row.quantity,
        unit: row.unit,
        pickupWindowStart: new Date(row.pickup_window_start),
        pickupWindowEnd: new Date(row.pickup_window_end),
        donorId: row.donor_id,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        requiresRefrigeration: row.requires_refrigeration,
        requiresFreezing: row.requires_freezing,
        isFragile: row.is_fragile,
        requiresHeavyLifting: row.requires_heavy_lifting,
        notes: row.notes
      };
    } catch (error) {
      console.error('Error in createDonation:', error);
      if (error instanceof DonationValidationError) {
        throw error;
      }
      if (error instanceof PostgrestError) {
        throw new Error('Database error: ' + error.message);
      }
      throw new Error('Failed to create donation: ' + (error as Error).message);
    }
  }

  async getDonation(id: string): Promise<Donation> {
    try {
      const { data, error } = await this.db
        .from('donations')
        .select(`
          *,
          food_type:food_types(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new DonationNotFoundError(id);

      const row = data as DonationRow;
      // Transform the response to match the API format
      return {
        id: row.id,
        foodTypeId: row.food_type_id,
        quantity: row.quantity,
        unit: row.unit,
        pickupWindowStart: new Date(row.pickup_window_start),
        pickupWindowEnd: new Date(row.pickup_window_end),
        donorId: row.donor_id,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        requiresRefrigeration: row.requires_refrigeration,
        requiresFreezing: row.requires_freezing,
        isFragile: row.is_fragile,
        requiresHeavyLifting: row.requires_heavy_lifting,
        notes: row.notes
      };
    } catch (error) {
      console.error('Error in getDonation:', error);
      if (error instanceof DonationNotFoundError) {
        throw error;
      }
      if (error instanceof PostgrestError) {
        throw new Error('Database error: ' + error.message);
      }
      throw new Error('Failed to get donation: ' + (error as Error).message);
    }
  }

  async updateDonation(id: string, update: DonationUpdate): Promise<Donation> {
    try {
      // Check if donation exists
      await this.getDonation(id);

      // Validate pickup window if both times are provided
      if (update.pickupWindowStart && update.pickupWindowEnd) {
        if (new Date(update.pickupWindowStart) >= new Date(update.pickupWindowEnd)) {
          throw new DonationValidationError('Pickup window end time must be after start time');
        }
      }

      // Transform to snake_case for database
      const dbUpdate = toSnakeCase(update);

      const { data, error } = await this.db
        .from('donations')
        .update(dbUpdate)
        .eq('id', id)
        .select(`
          *,
          food_type:food_types(*)
        `)
        .single();

      if (error) throw error;
      if (!data) throw new DonationNotFoundError(id);

      const row = data as DonationRow;
      // Transform the response to match the API format
      return {
        id: row.id,
        foodTypeId: row.food_type_id,
        quantity: row.quantity,
        unit: row.unit,
        pickupWindowStart: new Date(row.pickup_window_start),
        pickupWindowEnd: new Date(row.pickup_window_end),
        donorId: row.donor_id,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        requiresRefrigeration: row.requires_refrigeration,
        requiresFreezing: row.requires_freezing,
        isFragile: row.is_fragile,
        requiresHeavyLifting: row.requires_heavy_lifting,
        notes: row.notes
      };
    } catch (error) {
      console.error('Error in updateDonation:', error);
      if (error instanceof DonationNotFoundError || 
          error instanceof DonationValidationError) {
        throw error;
      }
      if (error instanceof PostgrestError) {
        throw new Error('Database error: ' + error.message);
      }
      throw new Error('Failed to update donation: ' + (error as Error).message);
    }
  }

  async deleteDonation(id: string): Promise<void> {
    try {
      const { error } = await this.db
        .from('donations')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error in deleteDonation:', error);
      if (error instanceof PostgrestError) {
        throw new Error('Database error: ' + error.message);
      }
      throw new Error('Failed to delete donation: ' + (error as Error).message);
    }
  }
} 