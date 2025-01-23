import { BaseApiImpl } from './base';
import { Donation, DonationCreate, DonationUpdate } from '../generated/model/models';

export class DonationsApiImpl extends BaseApiImpl {
  async listDonations(limit?: number, offset?: number): Promise<Donation[]> {
    try {
      let query = this.db
        .from('donations')
        .select('*');
      
      if (limit) {
        query = query.limit(limit);
      }
      if (offset) {
        query = query.range(offset, offset + (limit || 10) - 1);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Donation[];
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createDonation(donation: DonationCreate): Promise<Donation> {
    try {
      const { data, error } = await this.db
        .from('donations')
        .insert(donation)
        .select()
        .single();

      if (error) throw error;
      return data as Donation;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getDonation(id: string): Promise<Donation> {
    try {
      const { data, error } = await this.db
        .from('donations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw { status: 404, message: 'Donation not found' };
      return data as Donation;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateDonation(id: string, update: DonationUpdate): Promise<Donation> {
    try {
      const { data, error } = await this.db
        .from('donations')
        .update(update)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw { status: 404, message: 'Donation not found' };
      return data as Donation;
    } catch (error) {
      return this.handleError(error);
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
      return this.handleError(error);
    }
  }
} 