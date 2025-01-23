import { BaseApiImpl } from './base';
import { Ticket, TicketCreate, TicketUpdate } from '../generated/model/models';

export class TicketsApiImpl extends BaseApiImpl {
  async listTickets(limit?: number, offset?: number): Promise<Ticket[]> {
    try {
      let query = this.db
        .from('tickets')
        .select('*');
      
      if (limit) {
        query = query.limit(limit);
      }
      if (offset) {
        query = query.range(offset, offset + (limit || 10) - 1);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Ticket[];
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createTicket(ticket: TicketCreate): Promise<Ticket> {
    try {
      const { data, error } = await this.db
        .from('tickets')
        .insert(ticket)
        .select()
        .single();

      if (error) throw error;
      return data as Ticket;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getTicket(id: string): Promise<Ticket> {
    try {
      const { data, error } = await this.db
        .from('tickets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw { status: 404, message: 'Ticket not found' };
      return data as Ticket;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateTicket(id: string, update: TicketUpdate): Promise<Ticket> {
    try {
      const { data, error } = await this.db
        .from('tickets')
        .update(update)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw { status: 404, message: 'Ticket not found' };
      return data as Ticket;
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
} 