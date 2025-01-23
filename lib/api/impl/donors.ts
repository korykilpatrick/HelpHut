import { BaseApiImpl } from './base';
import { Donor, DonorCreate, DonorUpdate } from '../generated/model/models';

export class DonorsApiImpl extends BaseApiImpl {
  async listDonors(limit?: number, offset?: number): Promise<Donor[]> {
    try {
      let query = this.db
        .from('donors')
        .select('*');
      
      if (limit) {
        query = query.limit(limit);
      }
      if (offset) {
        query = query.range(offset, offset + (limit || 10) - 1);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Donor[];
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createDonor(donor: DonorCreate): Promise<Donor> {
    try {
      const { data, error } = await this.db
        .from('donors')
        .insert(donor)
        .select()
        .single();

      if (error) throw error;
      return data as Donor;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getDonor(id: string): Promise<Donor> {
    try {
      const { data, error } = await this.db
        .from('donors')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw { status: 404, message: 'Donor not found' };
      return data as Donor;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateDonor(id: string, update: DonorUpdate): Promise<Donor> {
    try {
      const { data, error } = await this.db
        .from('donors')
        .update(update)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw { status: 404, message: 'Donor not found' };
      return data as Donor;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteDonor(id: string): Promise<void> {
    try {
      const { error } = await this.db
        .from('donors')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      return this.handleError(error);
    }
  }
} 