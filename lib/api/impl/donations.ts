import { BaseApiImpl } from './base';
import type { Donation, DonationCreate, DonationUpdate } from '../generated/src/models';
import { toSnakeCase } from '../../utils/case-transform';

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
      // Validate pickup window
      if (new Date(donation.pickupWindowStart) >= new Date(donation.pickupWindowEnd)) {
        throw new DonationValidationError('Pickup window end time must be after start time');
      }

      // Check if donor exists
      const { data: donor, error: donorError } = await this.db
        .from('donors')
        .select('id')
        .eq('id', donation.donorId)
        .single();

      if (donorError || !donor) {
        throw new DonationValidationError(`Donor with ID ${donation.donorId} not found`);
      }

      // Check if food type exists
      const { data: foodType, error: foodTypeError } = await this.db
        .from('food_types')
        .select('id')
        .eq('id', donation.foodTypeId)
        .single();

      if (foodTypeError || !foodType) {
        throw new DonationValidationError(`Food type with ID ${donation.foodTypeId} not found`);
      }

      // Transform to snake_case before sending to Supabase
      const snakeCaseDonation = toSnakeCase(donation);
      console.log('Sending to Supabase:', snakeCaseDonation);

      const { data, error } = await this.db
        .from('donations')
        .insert(snakeCaseDonation)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique violation
          throw new DonationConflictError('A donation with these details already exists');
        }
        throw error;
      }

      return data as Donation;
    } catch (error) {
      if (error instanceof DonationValidationError || 
          error instanceof DonationConflictError) {
        throw error;
      }
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
      if (!data) throw new DonationNotFoundError(id);
      return data as Donation;
    } catch (error) {
      if (error instanceof DonationNotFoundError) {
        throw error;
      }
      return this.handleError(error);
    }
  }

  async updateDonation(id: string, update: DonationUpdate): Promise<Donation> {
    try {
      // Check if donation exists
      const existing = await this.getDonation(id);

      // Validate pickup window if both times are provided
      if (update.pickupWindowStart && update.pickupWindowEnd) {
        const startTime = new Date(update.pickupWindowStart);
        const endTime = new Date(update.pickupWindowEnd);
        if (startTime >= endTime) {
          throw new DonationValidationError('Pickup window end time must be after start time');
        }
      }

      const { data, error } = await this.db
        .from('donations')
        .update(update)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Donation;
    } catch (error) {
      if (error instanceof DonationNotFoundError || 
          error instanceof DonationValidationError) {
        throw error;
      }
      return this.handleError(error);
    }
  }

  async deleteDonation(id: string): Promise<void> {
    try {
      // Check if donation exists
      await this.getDonation(id);

      const { error } = await this.db
        .from('donations')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      if (error instanceof DonationNotFoundError) {
        throw error;
      }
      this.handleError(error);
    }
  }
} 