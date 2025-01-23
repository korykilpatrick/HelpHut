import { BaseApiImpl } from './base';
import { Volunteer, VolunteerCreate, VolunteerUpdate } from '../generated/model/models';

export class VolunteersApiImpl extends BaseApiImpl {
  async listVolunteers(limit?: number, offset?: number): Promise<Volunteer[]> {
    try {
      let query = this.db
        .from('volunteers')
        .select('*');
      
      if (limit) {
        query = query.limit(limit);
      }
      if (offset) {
        query = query.range(offset, offset + (limit || 10) - 1);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Volunteer[];
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createVolunteer(volunteer: VolunteerCreate): Promise<Volunteer> {
    try {
      const { data, error } = await this.db
        .from('volunteers')
        .insert(volunteer)
        .select()
        .single();

      if (error) throw error;
      return data as Volunteer;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getVolunteer(id: string): Promise<Volunteer> {
    try {
      const { data, error } = await this.db
        .from('volunteers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw { status: 404, message: 'Volunteer not found' };
      return data as Volunteer;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateVolunteer(id: string, update: VolunteerUpdate): Promise<Volunteer> {
    try {
      const { data, error } = await this.db
        .from('volunteers')
        .update(update)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw { status: 404, message: 'Volunteer not found' };
      return data as Volunteer;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteVolunteer(id: string): Promise<void> {
    try {
      const { error } = await this.db
        .from('volunteers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      return this.handleError(error);
    }
  }
} 