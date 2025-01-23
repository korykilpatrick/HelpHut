import { BaseApiImpl } from './base';
import { Partner, PartnerCreate, PartnerUpdate } from '../generated/model/models';

export class PartnersApiImpl extends BaseApiImpl {
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
} 