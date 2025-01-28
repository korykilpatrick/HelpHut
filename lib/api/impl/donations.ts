import { BaseApiImpl } from './base';
import type { Ticket, TicketStatus, TicketPriority } from '../generated/src/models';
import { toCamelCase, toSnakeCase } from '../../utils/case-transform';
import { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../db/types';
import type { Donation, DonationCreate, DonationUpdate } from '../generated/src/models';
import { DonationCreateToJSON } from '../generated/src/models';

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

// Database types (snake_case)
type DbDonation = Database['public']['Tables']['donations']['Row'];
type DbDonationInsert = Database['public']['Tables']['donations']['Insert'];
type DbDonationUpdate = Database['public']['Tables']['donations']['Update'] & {
  status?: string;
  volunteer_id?: string | null;
};
type DbTicket = Database['public']['Tables']['tickets']['Row'];
type DbDonor = Database['public']['Tables']['donors']['Row'];

// API types (camelCase)
interface AvailablePickup {
  id: string;
  donorName: string;
  pickupLocation: string;
  deliveryLocation: string;
  pickupWindow: {
    start: string;
    end: string;
  };
  foodType: string;
  quantity: string;
  distance: number;
  urgency: 'low' | 'medium' | 'high';
  requirements: {
    refrigeration: boolean;
    freezing: boolean;
    heavyLifting: boolean;
  };
}

interface ActiveDelivery {
  id: string;
  status: 'scheduled' | 'in_transit' | 'delivered';
  pickupLocation: string;
  deliveryLocation: string;
  pickupTime: string;
  foodType: string;
  quantity: string;
}

interface DeliveryRecord {
  id: string;
  date: string;
  pickupLocation: string;
  deliveryLocation: string;
  foodType: string;
  quantity: string;
  impact: {
    mealsProvided: number;
    carbonSaved: number;
  };
  rating?: {
    score: number;
    feedback?: string;
  };
}

// API types for donations
export interface ApiDonationCreate {
  donorId: string;
  foodTypeId: string;
  quantity: number;
  unit: string;
  expirationDate?: Date | null;
  storageRequirements?: string | null;
  requiresRefrigeration?: boolean;
  requiresFreezing?: boolean;
  isFragile?: boolean;
  requiresHeavyLifting?: boolean;
  notes?: string | null;
  pickupWindowStart: Date;
  pickupWindowEnd: Date;
}

export type ApiDonation = Required<Omit<ApiDonationCreate, 'expirationDate' | 'storageRequirements' | 'notes'>> & {
  id: string;
  expirationDate?: Date | null;
  storageRequirements?: string | null;
  notes?: string | null;
  donatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export class DonationsApiImpl extends BaseApiImpl {
  async listDonations(params: {
    limit?: number;
    offset?: number;
    status?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{ donations: DbDonation[] }> {
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
        query = query.eq('status', toSnakeCase({ status: params.status }).status);
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

      return { donations: data as DbDonation[] };
    } catch (error) {
      console.error('Error in listDonations:', error);
      throw error;
    }
  }

  async createDonation(donation: ApiDonationCreate): Promise<ApiDonation> {
    try {
      // Validate pickup window
      const pickupStart = new Date(donation.pickupWindowStart);
      const pickupEnd = new Date(donation.pickupWindowEnd);
      if (pickupStart >= pickupEnd) {
        throw new DonationValidationError('Pickup window end time must be after start time');
      }

      // Convert to database format
      const dbDonation: DbDonationInsert = {
        donor_id: donation.donorId,
        food_type_id: donation.foodTypeId,
        quantity: donation.quantity,
        unit: donation.unit,
        expiration_date: donation.expirationDate ? donation.expirationDate.toISOString() : null,
        storage_requirements: donation.storageRequirements ?? null,
        requires_refrigeration: donation.requiresRefrigeration ?? false,
        requires_freezing: donation.requiresFreezing ?? false,
        is_fragile: donation.isFragile ?? false,
        requires_heavy_lifting: donation.requiresHeavyLifting ?? false,
        pickup_window_start: pickupStart.toISOString(),
        pickup_window_end: pickupEnd.toISOString(),
        notes: donation.notes ?? null,
        donated_at: new Date().toISOString()
      };

      const { data, error } = await this.db
        .from('donations')
        .insert(dbDonation)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to create donation');

      // Convert database response to API format
      return this.mapDbDonationToApi(data);
    } catch (error) {
      console.error('Error in createDonation:', error);
      throw error;
    }
  }

  async getDonation(id: string): Promise<ApiDonation> {
    try {
      const { data, error } = await this.db
        .from('donations')
        .select()
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new DonationNotFoundError(id);

      return data as ApiDonation;
    } catch (error) {
      console.error('Error in getDonation:', error);
      throw error;
    }
  }

  async updateDonation(id: string, update: DbDonationUpdate): Promise<ApiDonation> {
    try {
      // Check if donation exists
      await this.getDonation(id);

      // Validate pickup window if both times are provided
      if (update.pickup_window_start && update.pickup_window_end) {
        if (new Date(update.pickup_window_start) >= new Date(update.pickup_window_end)) {
          throw new DonationValidationError('Pickup window end time must be after start time');
        }
      }

      const updateData = {
        ...update,
        updated_at: new Date().toISOString()
      } satisfies DbDonationUpdate;

      const { data, error } = await this.db
        .from('donations')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new DonationNotFoundError(id);

      return data as ApiDonation;
    } catch (error) {
      console.error('Error in updateDonation:', error);
      throw error;
    }
  }

  private mapDbDonationToApi(dbDonation: DbDonation): ApiDonation {
    return {
      id: dbDonation.id,
      donorId: dbDonation.donor_id || '',
      foodTypeId: dbDonation.food_type_id || '',
      quantity: dbDonation.quantity,
      unit: dbDonation.unit,
      expirationDate: dbDonation.expiration_date ? new Date(dbDonation.expiration_date) : null,
      storageRequirements: dbDonation.storage_requirements,
      requiresRefrigeration: dbDonation.requires_refrigeration,
      requiresFreezing: dbDonation.requires_freezing,
      isFragile: dbDonation.is_fragile,
      requiresHeavyLifting: dbDonation.requires_heavy_lifting,
      pickupWindowStart: new Date(dbDonation.pickup_window_start),
      pickupWindowEnd: new Date(dbDonation.pickup_window_end),
      notes: dbDonation.notes,
      donatedAt: new Date(dbDonation.donated_at),
      createdAt: new Date(dbDonation.created_at),
      updatedAt: new Date(dbDonation.updated_at)
    };
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

  async createDonationWithTicket(donation: ApiDonationCreate): Promise<{ donation: ApiDonation; ticket: Ticket }> {
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

  async listAvailablePickups(volunteerId: string): Promise<AvailablePickup[]> {
    try {
      console.log('Fetching available pickups for volunteer:', volunteerId);

      // First, let's check if we have any donations at all
      const { data: allDonations, error: countError } = await this.db
        .from('donations')
        .select('id');
      
      console.log('Total donations in system:', allDonations?.length);

      // Now let's check tickets separately
      const { data: allTickets, error: ticketError } = await this.db
        .from('tickets')
        .select('id, status, volunteer_id');
      
      console.log('Total tickets in system:', allTickets?.length);
      console.log('Submitted tickets without volunteer:', 
        allTickets?.filter(t => t.status === 'Submitted' && !t.volunteer_id).length);

      // Now our main query, but with left joins instead of inner joins
      const { data, error } = await this.db
        .from('donations')
        .select(`
          id,
          food_type_id,
          quantity,
          unit,
          pickup_window_start,
          pickup_window_end,
          requires_refrigeration,
          requires_freezing,
          requires_heavy_lifting,
          urgency,
          donors:donor_id (
            organization_name,
            location_id
          ),
          tickets (
            id,
            status,
            partner_org_id,
            dropoff_location_id,
            partners:partner_org_id (
              name,
              location_id
            )
          )
        `)
        .eq('tickets.status', 'Submitted')
        .is('tickets.volunteer_id', null)
        .returns<DonationWithDetails[]>();

      console.log('Query error:', error);
      console.log('Returned data:', data);

      if (error) throw error;
      if (!data) return [];

      // Filter out any donations without valid tickets
      const validPickups = data.filter(d => 
        d.tickets && 
        d.tickets.length > 0 && 
        d.donors // Make sure we have donor info
      );

      console.log('Valid pickups after filtering:', validPickups.length);

      return validPickups.map(d => {
        const ticket = d.tickets[0];
        return {
          id: d.id,
          donorName: d.donors.organization_name,
          pickupLocation: 'TODO: Get from donor location_id',
          deliveryLocation: ticket?.partners?.name || 'Awaiting Partner Assignment',
          pickupWindow: {
            start: d.pickup_window_start,
            end: d.pickup_window_end
          },
          foodType: d.food_type_id ?? '',
          quantity: `${d.quantity} ${d.unit}`,
          distance: Math.random() * 10,
          urgency: d.urgency as 'low' | 'medium' | 'high' ?? 'low',
          requirements: {
            refrigeration: d.requires_refrigeration,
            freezing: d.requires_freezing,
            heavyLifting: d.requires_heavy_lifting
          }
        };
      });
    } catch (error) {
      console.error('Error in listAvailablePickups:', error);
      throw error;
    }
  }

  async claimPickup(pickupId: string, volunteerId: string): Promise<void> {
    try {
      const update = {
        volunteer_id: volunteerId,
        status: 'scheduled',
        updated_at: new Date().toISOString()
      } satisfies DbDonationUpdate;

      const { error } = await this.db
        .from('donations')
        .update(update)
        .eq('id', pickupId)
        .eq('status', 'submitted')
        .is('volunteer_id', null);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          throw new DonationConflictError('This pickup has already been claimed');
        }
        throw error;
      }
    } catch (error) {
      console.error('Error in claimPickup:', error);
      throw error;
    }
  }

  async updatePickupStatus(
    pickupId: string,
    volunteerId: string,
    status: 'in_transit' | 'delivered'
  ): Promise<void> {
    try {
      const update = {
        status: status as string,
        updated_at: new Date().toISOString(),
        ...(status === 'delivered' ? { completed_at: new Date().toISOString() } : {})
      } satisfies DbDonationUpdate;

      const { error } = await this.db
        .from('donations')
        .update(update)
        .eq('id', pickupId)
        .eq('volunteer_id', volunteerId);

      if (error) throw error;
    } catch (error) {
      console.error('Error in updatePickupStatus:', error);
      throw error;
    }
  }

  async listActiveDeliveries(volunteerId: string): Promise<ActiveDelivery[]> {
    try {
      type DonationWithDonor = {
        id: string;
        status: string;
        food_type_id: string | null;
        quantity: number;
        unit: string;
        pickup_window_start: string;
        pickup_window_end: string;
        donors: { organization_name: string; location_id: string | null };
      };

      const { data, error } = await this.db
        .from('donations')
        .select(`
          id,
          status,
          food_type_id,
          quantity,
          unit,
          pickup_window_start,
          pickup_window_end,
          donors:donor_id!inner (
            organization_name,
            location_id
          )
        `)
        .eq('volunteer_id', volunteerId)
        .in('status', ['scheduled', 'in_transit'])
        .returns<DonationWithDonor[]>();

      if (error) throw error;
      if (!data) return [];

      return data.map(d => ({
        id: d.id,
        status: d.status as 'scheduled' | 'in_transit' | 'delivered',
        pickupLocation: 'TODO: Get from location_id',
        deliveryLocation: 'TODO: Get from location_id',
        pickupTime: d.pickup_window_start,
        foodType: d.food_type_id ?? '',
        quantity: `${d.quantity} ${d.unit}`
      }));
    } catch (error) {
      console.error('Error in listActiveDeliveries:', error);
      throw error;
    }
  }

  async getDeliveryHistory(volunteerId: string): Promise<DeliveryRecord[]> {
    try {
      type DonationWithDonor = {
        id: string;
        completed_at: string | null;
        food_type_id: string | null;
        quantity: number;
        unit: string;
        impact_metrics: { meals_provided: number; carbon_saved: number } | null;
        donors: { organization_name: string; location_id: string | null };
      };

      const { data, error } = await this.db
        .from('donations')
        .select(`
          id,
          completed_at,
          food_type_id,
          quantity,
          unit,
          impact_metrics,
          donors:donor_id!inner (
            organization_name,
            location_id
          )
        `)
        .eq('volunteer_id', volunteerId)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .returns<DonationWithDonor[]>();

      if (error) throw error;
      if (!data) return [];

      return data.map(d => ({
        id: d.id,
        date: d.completed_at ?? new Date().toISOString(),
        pickupLocation: 'TODO: Get from location_id',
        deliveryLocation: 'TODO: Get from location_id',
        foodType: d.food_type_id ?? '',
        quantity: `${d.quantity} ${d.unit}`,
        impact: {
          mealsProvided: d.impact_metrics?.meals_provided ?? 0,
          carbonSaved: d.impact_metrics?.carbon_saved ?? 0
        }
      }));
    } catch (error) {
      console.error('Error in getDeliveryHistory:', error);
      throw error;
    }
  }
} 