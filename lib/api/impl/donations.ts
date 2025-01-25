import { BaseApiImpl } from './base';
import type { Donation, DonationCreate, DonationUpdate, Ticket, TicketStatus, TicketPriority } from '../generated/src/models';
import { toSnakeCase } from '../../utils/case-transform';
import { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../db/types';

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

// Database row types
type DbDonation = Database['public']['Tables']['donations']['Row'] & {
  food_type: Database['public']['Tables']['food_types']['Row'] | null;
};

type DbTicket = Database['public']['Tables']['tickets']['Row'];

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
          food_type:food_types(*)
        `);

      // Apply filters if provided
      if (params.status) {
        query = query.eq('status', params.status);
      }
      if (params.startDate) {
        query = query.gte('created_at', params.startDate);
      }
      if (params.endDate) {
        query = query.lte('created_at', params.endDate);
      }
      if (params.search) {
        query = query.ilike('notes', `%${params.search}%`);
      }

      // Apply pagination
      if (params.limit) {
        query = query.limit(params.limit);
      }
      if (params.offset) {
        query = query.range(params.offset, (params.offset + (params.limit || 10)) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;
      if (!data) return { donations: [] };

      const donations = (data as DbDonation[]).map(row => ({
        id: row.id,
        foodTypeId: row.food_type_id || '',
        quantity: row.quantity,
        unit: row.unit,
        pickupWindowStart: new Date(row.pickup_window_start),
        pickupWindowEnd: new Date(row.pickup_window_end),
        donorId: row.donor_id || '',
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        requiresRefrigeration: row.requires_refrigeration,
        requiresFreezing: row.requires_freezing,
        isFragile: row.is_fragile,
        requiresHeavyLifting: row.requires_heavy_lifting,
        notes: row.notes || undefined
      }));

      return { donations };
    } catch (error) {
      console.error('Error in listDonations:', error);
      throw error;
    }
  }

  async createDonation(donation: DonationCreate): Promise<Donation> {
    try {
      // Validate pickup window
      const pickupStart = new Date(donation.pickupWindowStart);
      const pickupEnd = new Date(donation.pickupWindowEnd);
      if (pickupStart >= pickupEnd) {
        throw new DonationValidationError('Pickup window end time must be after start time');
      }

      // Transform to snake_case for database
      const insertData = {
        donor_id: donation.donorId,
        food_type_id: donation.foodTypeId,
        quantity: donation.quantity,
        unit: donation.unit,
        requires_refrigeration: donation.requiresRefrigeration,
        requires_freezing: donation.requiresFreezing,
        is_fragile: donation.isFragile,
        requires_heavy_lifting: donation.requiresHeavyLifting,
        pickup_window_start: pickupStart.toISOString(),
        pickup_window_end: pickupEnd.toISOString(),
        notes: donation.notes
      } as Database['public']['Tables']['donations']['Insert'];

      const { data, error } = await this.db
        .from('donations')
        .insert(insertData)
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

      const dbDonation = data as DbDonation;
      // Transform the response to match the API format
      return {
        id: dbDonation.id,
        foodTypeId: dbDonation.food_type_id || '',
        quantity: dbDonation.quantity,
        unit: dbDonation.unit,
        pickupWindowStart: new Date(dbDonation.pickup_window_start),
        pickupWindowEnd: new Date(dbDonation.pickup_window_end),
        donorId: dbDonation.donor_id || '',
        createdAt: new Date(dbDonation.created_at),
        updatedAt: new Date(dbDonation.updated_at),
        requiresRefrigeration: dbDonation.requires_refrigeration,
        requiresFreezing: dbDonation.requires_freezing,
        isFragile: dbDonation.is_fragile,
        requiresHeavyLifting: dbDonation.requires_heavy_lifting,
        notes: dbDonation.notes || undefined
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

      const dbDonation = data as DbDonation;

      // Validate required fields
      if (!dbDonation.food_type_id) {
        throw new Error('Donation is missing required food_type_id');
      }
      if (!dbDonation.donor_id) {
        throw new Error('Donation is missing required donor_id');
      }

      // Transform the response to match the API format
      return {
        id: dbDonation.id,
        foodTypeId: dbDonation.food_type_id,
        quantity: dbDonation.quantity,
        unit: dbDonation.unit,
        pickupWindowStart: new Date(dbDonation.pickup_window_start),
        pickupWindowEnd: new Date(dbDonation.pickup_window_end),
        donorId: dbDonation.donor_id,
        createdAt: new Date(dbDonation.created_at),
        updatedAt: new Date(dbDonation.updated_at),
        requiresRefrigeration: dbDonation.requires_refrigeration,
        requiresFreezing: dbDonation.requires_freezing,
        isFragile: dbDonation.is_fragile,
        requiresHeavyLifting: dbDonation.requires_heavy_lifting,
        notes: dbDonation.notes || undefined
      };
    } catch (error) {
      console.error('Error in getDonation:', error);
      throw error;
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

      const row = data as DbDonation;
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

  private async createTicketForDonation(donationId: string): Promise<Ticket> {
    const { data: ticketData, error: ticketError } = await (this.db as SupabaseClient<Database>)
      .from('tickets')
      .insert({
        donation_id: donationId,
        status: 'Submitted' as Database['public']['Enums']['ticket_status'],
        priority: 'Routine' as Database['public']['Enums']['ticket_priority']
      } as Database['public']['Tables']['tickets']['Insert'])
      .select()
      .single();

    if (ticketError) throw ticketError;
    if (!ticketData) throw new Error('Failed to create ticket');

    const dbTicket = ticketData as DbTicket;

    return {
      id: dbTicket.id,
      donationId: dbTicket.donation_id || '',
      status: dbTicket.status as TicketStatus,
      priority: dbTicket.priority as TicketPriority,
      volunteerId: dbTicket.volunteer_id || undefined,
      partnerOrgId: dbTicket.partner_org_id || undefined,
      pickupLocationId: dbTicket.pickup_location_id || undefined,
      dropoffLocationId: dbTicket.dropoff_location_id || undefined,
      createdAt: new Date(dbTicket.created_at),
      updatedAt: new Date(dbTicket.updated_at)
    };
  }

  async createDonationWithTicket(donation: DonationCreate): Promise<{ donation: Donation; ticket: Ticket }> {
    try {
      // Create the donation using existing logic
      const createdDonation = await this.createDonation(donation);
      
      // Create the associated ticket
      const ticket = await this.createTicketForDonation(createdDonation.id);

      return { donation: createdDonation, ticket };
    } catch (error) {
      console.error('Error in createDonationWithTicket:', error);
      if (error instanceof DonationValidationError) {
        throw error;
      }
      if (error instanceof PostgrestError) {
        throw new Error('Database error: ' + error.message);
      }
      throw new Error('Failed to create donation with ticket: ' + (error as Error).message);
    }
  }
} 