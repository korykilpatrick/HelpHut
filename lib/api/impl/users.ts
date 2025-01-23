import { BaseApiImpl } from './base';
import { User, UserCreate, UserUpdate } from '../generated/model/models';

export class UsersApiImpl extends BaseApiImpl {
  async listUsers(limit?: number, offset?: number): Promise<User[]> {
    try {
      let query = this.db
        .from('users')
        .select('*');
      
      if (limit) {
        query = query.limit(limit);
      }
      if (offset) {
        query = query.range(offset, offset + (limit || 10) - 1);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as User[];
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createUser(user: UserCreate): Promise<User> {
    try {
      const { data, error } = await this.db
        .from('users')
        .insert(user)
        .select()
        .single();

      if (error) throw error;
      return data as User;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getUser(id: string): Promise<User> {
    try {
      const { data, error } = await this.db
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw { status: 404, message: 'User not found' };
      return data as User;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateUser(id: string, update: UserUpdate): Promise<User> {
    try {
      const { data, error } = await this.db
        .from('users')
        .update(update)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw { status: 404, message: 'User not found' };
      return data as User;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const { error } = await this.db
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      return this.handleError(error);
    }
  }
} 