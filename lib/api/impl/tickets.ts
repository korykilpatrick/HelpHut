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
    quantity: number;
    unit: string;
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
      organizationName: string;
      locationId?: string;
    };
    impact?: {
      mealsProvided: number;
      carbonSaved: number;
    };
  };
}

interface TicketWithDetails extends Omit<Ticket, 'donation'> {
  donation?: {
    foodType: string;
    quantity: number;
    unit: string;
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
      organizationName: string;
      locationId?: string;
    };
    notes?: string;
  };
  pickupLocation?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  dropoffLocation?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  partner?: {
    name: string;
    contactPhone: string;
    contactEmail: string;
  };
  volunteer?: {
    displayName: string;
    phone: string;
    vehicleType?: string;
  };
}

interface TicketFilters {
  volunteerId?: string;
  partnerId?: string;
  donorId?: string;
  status?: TicketStatus | TicketStatus[];
  startDate?: Date;
  endDate?: Date;
}

interface ActiveTicketFilters extends Omit<TicketFilters, 'status'> {
  priority?: TicketPriority;
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

  async listActiveTickets(volunteerId: string, filters?: ActiveTicketFilters): Promise<TicketWithDetails[]> {
    try {
      console.log('Fetching active tickets for volunteer:', volunteerId);
      
      // Combine required filters with optional filters
      const ticketFilters: TicketFilters = {
        volunteerId,
        status: ['Scheduled', 'InTransit'],
        ...filters
      };
      
      const tickets = await this.getTicketsWithDetails(ticketFilters);
      
      console.log('Active tickets found:', tickets);
      
      return tickets;
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

  async getTicketWithDetails(id: string): Promise<TicketWithDetails> {
    try {
      const { data, error } = await this.db
        .from('tickets')
        .select(`
          *,
          donations (
            *,
            food_types (
              name
            ),
            donors (
              organization_name,
              location_id
            )
          ),
          pickup_locations: locations!tickets_pickup_location_id_fkey (
            street,
            city,
            state,
            zip
          ),
          dropoff_locations: locations!tickets_dropoff_location_id_fkey (
            street,
            city,
            state,
            zip
          ),
          partners (
            name,
            contact_phone,
            contact_email
          ),
          volunteers (
            users (
              display_name
            ),
            phone,
            vehicle_type
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Ticket not found');

      // Transform the data into our TicketWithDetails format
      const baseTicket = this.mapDbTicketToTicket(data);
      const ticket: TicketWithDetails = {
        ...baseTicket,
        donation: baseTicket.donation as TicketWithDetails['donation']
      };
      
      if (data.donations) {
        const donation = data.donations[0]; // Get the first donation
        if (donation) {
          ticket.donation = {
            foodType: donation.food_types?.name || 'Unknown',
            quantity: donation.quantity,
            unit: donation.unit,
            pickupWindow: {
              start: donation.pickup_window_start,
              end: donation.pickup_window_end
            },
            requirements: {
              refrigeration: donation.requires_refrigeration,
              freezing: donation.requires_freezing,
              heavyLifting: donation.requires_heavy_lifting
            },
            donor: {
              organizationName: donation.donors?.organization_name || 'Unknown',
              locationId: donation.donors?.location_id
            },
            notes: donation.notes
          };
        }
      }

      if (data.pickup_locations) {
        const pl = data.pickup_locations;
        ticket.pickupLocation = {
          street: pl.street === null ? undefined : pl.street,
          city: pl.city === null ? undefined : pl.city,
          state: pl.state === null ? undefined : pl.state,
          zip: pl.zip === null ? undefined : pl.zip
        };
      }

      if (data.dropoff_locations) {
        const dl = data.dropoff_locations;
        ticket.dropoffLocation = {
          street: dl.street === null ? undefined : dl.street,
          city: dl.city === null ? undefined : dl.city,
          state: dl.state === null ? undefined : dl.state,
          zip: dl.zip === null ? undefined : dl.zip
        };
      }

      if (data.partners) {
        ticket.partner = {
          name: data.partners.name,
          contactPhone: data.partners.contact_phone,
          contactEmail: data.partners.contact_email
        };
      }

      if (data.volunteers) {
        ticket.volunteer = {
          displayName: data.volunteers.users?.display_name || 'Unknown',
          phone: data.volunteers.phone,
          vehicleType: data.volunteers.vehicle_type
        };
      }

      return ticket;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getTicketsWithDetails(filters?: TicketFilters): Promise<TicketWithDetails[]> {
    try {
      console.log('getTicketsWithDetails called with filters:', filters);

      let query = this.db
        .from('tickets')
        .select(`
          *,
          donations (
            *,
            food_types (
              name
            ),
            donors (
              organization_name,
              location_id
            )
          ),
          pickup_locations: locations!tickets_pickup_location_id_fkey (
            street,
            city,
            state,
            zip
          ),
          dropoff_locations: locations!tickets_dropoff_location_id_fkey (
            street,
            city,
            state,
            zip
          ),
          partners (
            name,
            contact_phone,
            contact_email
          ),
          volunteers (
            users (
              display_name
            ),
            phone,
            vehicle_type
          )
        `);

      // Apply filters if provided
      if (filters) {
        console.log('Applying filters to query...');
        if (filters.volunteerId) {
          console.log('Filtering by volunteerId:', filters.volunteerId);
          query = query.eq('volunteer_id', filters.volunteerId);
        }
        if (filters.partnerId) {
          console.log('Filtering by partnerId:', filters.partnerId);
          query = query.eq('partner_org_id', filters.partnerId);
        }
        if (filters.donorId) {
          console.log('Filtering by donorId:', filters.donorId);
          query = query.eq('donations.donors.id', filters.donorId);
        }
        if (filters.status) {
          console.log('Filtering by status:', filters.status);
          if (Array.isArray(filters.status)) {
            query = query.in('status', filters.status);
          } else {
            query = query.eq('status', filters.status);
          }
        }
        if (filters.startDate) {
          console.log('Filtering by startDate:', filters.startDate);
          query = query.gte('created_at', filters.startDate.toISOString());
        }
        if (filters.endDate) {
          console.log('Filtering by endDate:', filters.endDate);
          query = query.lte('created_at', filters.endDate.toISOString());
        }
      }

      console.log('Executing query...');
      const { data, error } = await query;

      if (error) {
        console.error('Database query error:', error);
        throw error;
      }
      
      console.log('Query results:', data);
      if (!data) return [];

      // Transform the data into TicketWithDetails format
      console.log('Transforming data...');
      const transformedTickets = data.map(dbTicket => {
        const baseTicket = this.mapDbTicketToTicket(dbTicket);
        const ticket: TicketWithDetails = {
          ...baseTicket,
          donation: dbTicket.donations ? {
            foodType: dbTicket.donations.food_types?.name || dbTicket.donations.food_type_id,
            quantity: dbTicket.donations.quantity,
            unit: dbTicket.donations.unit,
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
              organizationName: dbTicket.donations.donors?.organization_name || 'Unknown',
              locationId: dbTicket.donations.donors?.location_id
            },
            notes: dbTicket.donations.notes
          } : undefined,
          pickupLocation: dbTicket.pickup_locations ? {
            street: dbTicket.pickup_locations.street ?? undefined,
            city: dbTicket.pickup_locations.city ?? undefined,
            state: dbTicket.pickup_locations.state ?? undefined,
            zip: dbTicket.pickup_locations.zip ?? undefined
          } : undefined,
          dropoffLocation: dbTicket.dropoff_locations ? {
            street: dbTicket.dropoff_locations.street ?? undefined,
            city: dbTicket.dropoff_locations.city ?? undefined,
            state: dbTicket.dropoff_locations.state ?? undefined,
            zip: dbTicket.dropoff_locations.zip ?? undefined
          } : undefined,
          partner: dbTicket.partners ? {
            name: dbTicket.partners.name,
            contactPhone: dbTicket.partners.contact_phone,
            contactEmail: dbTicket.partners.contact_email
          } : undefined,
          volunteer: dbTicket.volunteers ? {
            displayName: dbTicket.volunteers.users?.display_name || 'Unknown',
            phone: dbTicket.volunteers.phone,
            vehicleType: dbTicket.volunteers.vehicle_type
          } : undefined
        };

        return ticket;
      });

      console.log('Returning transformed tickets:', transformedTickets);
      return transformedTickets;
    } catch (error) {
      console.error('Error in getTicketsWithDetails:', error);
      return this.handleError(error);
    }
  }

  private mapDbTicketToTicket(dbTicket: DbTicket & { donations?: any }): Ticket {
    const ticket: Ticket = {
      id: dbTicket.id,
      donationId: dbTicket.donation_id || '',
      status: dbTicket.status,
      priority: dbTicket.priority,
      volunteerId: dbTicket.volunteer_id ?? undefined,
      partnerOrgId: dbTicket.partner_org_id ?? undefined,
      pickupLocationId: dbTicket.pickup_location_id ?? undefined,
      dropoffLocationId: dbTicket.dropoff_location_id ?? undefined,
      createdAt: new Date(dbTicket.created_at),
      updatedAt: new Date(dbTicket.updated_at),
      completedAt: dbTicket.completed_at ? new Date(dbTicket.completed_at) : undefined
    };

    if (dbTicket.donations) {
      const donation = dbTicket.donations[0];
      if (donation) {
        ticket.donation = {
          foodType: donation.food_type_id || 'Unknown',
          quantity: donation.quantity,
          unit: donation.unit,
          pickupWindow: {
            start: donation.pickup_window_start,
            end: donation.pickup_window_end
          },
          requirements: {
            refrigeration: donation.requires_refrigeration,
            freezing: donation.requires_freezing,
            heavyLifting: donation.requires_heavy_lifting
          },
          donor: {
            organizationName: donation.donors?.organization_name || 'Unknown',
            locationId: donation.donors?.location_id
          }
        };
      }
    }

    return ticket;
  }
} 