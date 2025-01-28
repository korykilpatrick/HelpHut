import { BaseApiImpl } from './base';
import type { Database } from '../../db/types';
import { DonationNotFoundError, DonationConflictError } from './donations';

type Partner = Database['public']['Tables']['partners']['Row'];
type PartnerCreate = Database['public']['Tables']['partners']['Insert'];
type PartnerUpdate = Database['public']['Tables']['partners']['Update'];

type Donation = {
  id: string;
  foodTypeId: string;
  foodTypeName: string;
  quantity: number;
  unit: string;
  pickupWindowStart: Date;
  pickupWindowEnd: Date;
  donorId: string;
  donorName: string;
  createdAt: Date;
  updatedAt: Date;
  requiresRefrigeration: boolean;
  requiresFreezing: boolean;
  isFragile: boolean;
  requiresHeavyLifting: boolean;
  notes?: string;
};

type Ticket = {
  id: string;
  donationId: string;
  status: Database['public']['Enums']['ticket_status'];
  priority: Database['public']['Enums']['ticket_priority'];
  volunteerId?: string;
  partnerOrgId?: string;
  pickupLocationId?: string;
  dropoffLocationId?: string;
  createdAt: Date;
  updatedAt: Date;
};

type DbDonation = Database['public']['Tables']['donations']['Row'] & {
  food_type: Database['public']['Tables']['food_types']['Row'] | null;
};

type DbTicket = Database['public']['Tables']['tickets']['Row'];

export class PartnersApiImpl extends BaseApiImpl {
  constructor(context?: { user?: { id: string } }) {
    super(context);
  }

  async listPartners(limit?: number, offset?: number): Promise<Partner[]> {
    try {
      let query = this.db
        .from('partners')
        .select('*');
      
      if (limit) {
        query = query.limit(limit);
      }
      if (offset) {
        query = query.range(offset, offset + (limit || 10) - 1);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Partner[];
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createPartner(partner: PartnerCreate): Promise<Partner> {
    try {
      const { data, error } = await this.db
        .from('partners')
        .insert(partner)
        .select()
        .single();

      if (error) throw error;
      return data as Partner;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getPartner(id: string): Promise<Partner> {
    try {
      const { data, error } = await this.db
        .from('partners')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw { status: 404, message: 'Partner not found' };
      return data as Partner;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updatePartner(id: string, update: PartnerUpdate): Promise<Partner> {
    try {
      const { data, error } = await this.db
        .from('partners')
        .update(update)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw { status: 404, message: 'Partner not found' };
      return data as Partner;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deletePartner(id: string): Promise<void> {
    try {
      const { error } = await this.db
        .from('partners')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Partner Donation Endpoints

  async listAvailableDonations(params: { limit?: number; offset?: number }): Promise<Donation[]> {
    try {
      // Get donations that have no partner_org_id (unclaimed by partners)
      const { data, error } = await this.db
        .from('donations')
        .select(`
          *,
          food_type:food_types(*),
          donor:donors(*),
          tickets!inner(*)
        `)
        .is('tickets.partner_org_id', null)
        .order('pickup_window_start', { ascending: true })
        .limit(params.limit || 10)
        .range(params.offset || 0, (params.offset || 0) + (params.limit || 10) - 1);

      if (error) throw error;
      if (!data) return [];

      return (data as (DbDonation & { food_type: { name: string }; donor: { organization_name: string } })[]).map(row => ({
        id: row.id,
        foodTypeId: row.food_type_id || '',
        foodTypeName: row.food_type?.name || '',
        donorId: row.donor_id || '',
        donorName: row.donor?.organization_name || '',
        quantity: row.quantity,
        unit: row.unit,
        pickupWindowStart: new Date(row.pickup_window_start),
        pickupWindowEnd: new Date(row.pickup_window_end),
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        requiresRefrigeration: row.requires_refrigeration,
        requiresFreezing: row.requires_freezing,
        isFragile: row.is_fragile,
        requiresHeavyLifting: row.requires_heavy_lifting,
        notes: row.notes || undefined
      }));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async listClaimedDonations(params: { limit?: number; offset?: number }): Promise<Donation[]> {
    try {
      if (!this.context?.user?.id) {
        throw new Error('User ID not found in context');
      }

      // Get the partner ID for this user
      const { data: partner, error: partnerError } = await this.db
        .from('partners')
        .select('id')
        .eq('user_id', this.context.user.id)
        .single();

      if (partnerError) throw partnerError;
      if (!partner) throw new Error('Partner not found for user');

      // Get donations that have tickets claimed by this partner
      const { data, error } = await this.db
        .from('donations')
        .select(`
          *,
          food_type:food_types(*),
          donor:donors(*),
          tickets!inner(*)
        `)
        .eq('tickets.partner_org_id', partner.id)
        .order('pickup_window_start', { ascending: true })
        .limit(params.limit || 10)
        .range(params.offset || 0, (params.offset || 0) + (params.limit || 10) - 1);

      if (error) throw error;
      if (!data) return [];

      return (data as (DbDonation & { food_type: { name: string }; donor: { organization_name: string } })[]).map(row => ({
        id: row.id,
        foodTypeId: row.food_type_id || '',
        foodTypeName: row.food_type?.name || '',
        donorId: row.donor_id || '',
        donorName: row.donor?.organization_name || '',
        quantity: row.quantity,
        unit: row.unit,
        pickupWindowStart: new Date(row.pickup_window_start),
        pickupWindowEnd: new Date(row.pickup_window_end),
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        requiresRefrigeration: row.requires_refrigeration,
        requiresFreezing: row.requires_freezing,
        isFragile: row.is_fragile,
        requiresHeavyLifting: row.requires_heavy_lifting,
        notes: row.notes || undefined
      }));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async claimDonation(id: string): Promise<Ticket> {
    try {
      if (!this.context?.user?.id) {
        throw new Error('User ID not found in context');
      }

      // Get the partner ID for this user
      const { data: partner, error: partnerError } = await this.db
        .from('partners')
        .select('id')
        .eq('user_id', this.context.user.id)
        .single();

      if (partnerError) throw partnerError;
      if (!partner) throw new Error('Partner not found for user');

      // Get the donation and its ticket
      const { data: donationData, error: donationError } = await this.db
        .from('donations')
        .select(`
          *,
          tickets(*)
        `)
        .eq('id', id)
        .single();

      if (donationError) throw donationError;
      if (!donationData) throw new DonationNotFoundError(id);

      const donation = donationData as DbDonation & { tickets: DbTicket[] };
      const ticket = donation.tickets[0];

      if (!ticket) {
        throw new Error('No ticket found for donation');
      }

      if (ticket.partner_org_id) {
        throw new DonationConflictError('Donation has already been claimed');
      }

      // Update the ticket with the partner's ID and change status to Scheduled
      const { data: updatedTicket, error: updateError } = await this.db
        .from('tickets')
        .update({
          partner_org_id: partner.id,
          status: 'Scheduled' as Database['public']['Enums']['ticket_status']
        })
        .eq('id', ticket.id)
        .select()
        .single();

      if (updateError) throw updateError;
      if (!updatedTicket) throw new Error('Failed to update ticket');

      const dbTicket = updatedTicket as DbTicket;

      return {
        id: dbTicket.id,
        donationId: dbTicket.donation_id || '',
        status: dbTicket.status as Database['public']['Enums']['ticket_status'],
        priority: dbTicket.priority as Database['public']['Enums']['ticket_priority'],
        volunteerId: dbTicket.volunteer_id || undefined,
        partnerOrgId: dbTicket.partner_org_id || undefined,
        pickupLocationId: dbTicket.pickup_location_id || undefined,
        dropoffLocationId: dbTicket.dropoff_location_id || undefined,
        createdAt: new Date(dbTicket.created_at),
        updatedAt: new Date(dbTicket.updated_at)
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
} 