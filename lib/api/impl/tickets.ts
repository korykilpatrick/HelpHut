import { BaseApiImpl } from './base';
import type { Database } from '../../db/types';

type DbTicket = Database['public']['Tables']['tickets']['Row'];
type DbTicketUpdate = Database['public']['Tables']['tickets']['Update'];
type TicketStatus = Database['public']['Enums']['ticket_status'];
type TicketPriority = Database['public']['Enums']['ticket_priority'];

interface Ticket {
  id: string;
  donationId: string;
  status: TicketStatus;
  priority: TicketPriority;
  volunteerId?: string;
  partnerOrgId?: string;
  pickupLocationId?: string;
  dropoffLocationId?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  donation?: {
    foodType: string;
    quantity: string;
    pickupWindow: {
      start: string;
      end: string;
    };
    requirements: {
      refrigeration: boolean;
      freezing: boolean;
      heavyLifting: boolean;
    };
    donor: {
      name: string;
      locationId?: string;
    };
    impact?: {
      mealsProvided: number;
      carbonSaved: number;
    };
  };
}

export class TicketsApiImpl extends BaseApiImpl {
  async listTickets(limit?: number, offset?: number): Promise<Ticket[]> {
    try {
      const { data, error } = await this.db
        .from('tickets')
        .select()
        .range(offset || 0, (offset || 0) + (limit || 10) - 1);

      if (error) throw error;
      if (!data) return [];

      return data.map(ticket => this.mapDbTicketToTicket(ticket));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createTicket(ticket: DbTicketUpdate): Promise<Ticket> {
    try {
      const { data, error } = await this.db
        .from('tickets')
        .insert(ticket)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to create ticket');

      return this.mapDbTicketToTicket(data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getTicket(id: string): Promise<Ticket> {
    try {
      const { data, error } = await this.db
        .from('tickets')
        .select()
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Ticket not found');

      return this.mapDbTicketToTicket(data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateTicket(id: string, update: DbTicketUpdate): Promise<Ticket> {
    try {
      const { data, error } = await this.db
        .from('tickets')
        .update(update)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to update ticket');

      return this.mapDbTicketToTicket(data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteTicket(id: string): Promise<void> {
    try {
      const { error } = await this.db
        .from('tickets')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async listAvailableTickets(volunteerId: string): Promise<Ticket[]> {
    try {
      const { data, error } = await this.db
        .from('tickets')
        .select(`
          *,
          donations(
            food_type_id,
            quantity,
            unit,
            pickup_window_start,
            pickup_window_end,
            requires_refrigeration,
            requires_freezing,
            requires_heavy_lifting,
            donors(organization_name, location_id)
          )
        `)
        .eq('status', 'Submitted')
        .is('volunteer_id', null);

      if (error) throw error;
      if (!data) return [];

      return data.map(ticket => this.mapDbTicketToTicket(ticket));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async claimTicket(ticketId: string, volunteerId: string): Promise<void> {
    try {
      const update: DbTicketUpdate = {
        volunteer_id: volunteerId,
        status: 'Scheduled' as TicketStatus,
        updated_at: new Date().toISOString()
      };

      const { error } = await this.db
        .from('tickets')
        .update(update)
        .eq('id', ticketId)
        .eq('status', 'Submitted')
        .is('volunteer_id', null);

      if (error) throw error;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateTicketStatus(
    ticketId: string,
    volunteerId: string,
    status: 'InTransit' | 'Delivered'
  ): Promise<void> {
    try {
      const update: DbTicketUpdate = {
        status: status as TicketStatus,
        updated_at: new Date().toISOString()
      };

      if (status === 'Delivered') {
        update.completed_at = new Date().toISOString();
      }

      const { error } = await this.db
        .from('tickets')
        .update(update)
        .eq('id', ticketId)
        .eq('volunteer_id', volunteerId);

      if (error) throw error;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async listActiveTickets(volunteerId: string): Promise<Ticket[]> {
    try {
      console.log('Fetching active tickets for volunteer:', volunteerId);
      
      const { data, error } = await this.db
        .from('tickets')
        .select(`
          *,
          donations(
            food_type_id,
            quantity,
            unit,
            pickup_window_start,
            pickup_window_end,
            donors(organization_name, location_id)
          )
        `)
        .eq('volunteer_id', volunteerId)
        .in('status', ['Scheduled', 'InTransit']);

      if (error) {
        console.error('Error fetching active tickets:', error);
        throw error;
      }
      
      console.log('Active tickets found:', data);
      
      if (!data) return [];

      return data.map(ticket => this.mapDbTicketToTicket(ticket));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getTicketHistory(volunteerId: string): Promise<Ticket[]> {
    try {
      const { data, error } = await this.db
        .from('tickets')
        .select(`
          *,
          donations(
            food_type_id,
            quantity,
            unit,
            impact_metrics,
            donors(organization_name, location_id)
          )
        `)
        .eq('volunteer_id', volunteerId)
        .eq('status', 'Completed')
        .order('completed_at', { ascending: false });

      if (error) throw error;
      if (!data) return [];

      return data.map(ticket => this.mapDbTicketToTicket(ticket));
    } catch (error) {
      return this.handleError(error);
    }
  }

  private mapDbTicketToTicket(dbTicket: DbTicket & { donations?: any }): Ticket {
    return {
      id: dbTicket.id,
      donationId: dbTicket.donation_id || '',
      status: dbTicket.status,
      priority: dbTicket.priority,
      volunteerId: dbTicket.volunteer_id || undefined,
      partnerOrgId: dbTicket.partner_org_id || undefined,
      pickupLocationId: dbTicket.pickup_location_id || undefined,
      dropoffLocationId: dbTicket.dropoff_location_id || undefined,
      createdAt: new Date(dbTicket.created_at),
      updatedAt: new Date(dbTicket.updated_at),
      completedAt: dbTicket.completed_at ? new Date(dbTicket.completed_at) : undefined,
      donation: dbTicket.donations ? {
        foodType: dbTicket.donations.food_type_id,
        quantity: `${dbTicket.donations.quantity} ${dbTicket.donations.unit}`,
        pickupWindow: {
          start: dbTicket.donations.pickup_window_start,
          end: dbTicket.donations.pickup_window_end
        },
        requirements: {
          refrigeration: dbTicket.donations.requires_refrigeration,
          freezing: dbTicket.donations.requires_freezing,
          heavyLifting: dbTicket.donations.requires_heavy_lifting
        },
        donor: {
          name: dbTicket.donations.donors?.organization_name,
          locationId: dbTicket.donations.donors?.location_id
        },
        impact: dbTicket.donations.impact_metrics ? {
          mealsProvided: dbTicket.donations.impact_metrics.meals_provided,
          carbonSaved: dbTicket.donations.impact_metrics.carbon_saved
        } : undefined
      } : undefined
    };
  }
} 