import { supabase } from '../../db/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

export abstract class BaseApiImpl {
  protected db: SupabaseClient;
  
  constructor() {
    this.db = supabase;
  }

  protected handleError(error: any): never {
    console.error('API Error:', error);
    throw {
      status: error.status || 500,
      message: error.message || 'Internal server error'
    };
  }
} 