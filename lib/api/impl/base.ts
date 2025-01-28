import { supabase } from '../../db/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

type ApiContext = {
  user?: {
    id: string;
  };
};

export abstract class BaseApiImpl {
  protected db: SupabaseClient;
  protected context?: ApiContext;
  
  constructor(context?: ApiContext) {
    this.db = supabase;
    this.context = context;
  }

  protected handleError(error: any): never {
    console.error('API Error:', error);
    throw {
      status: error.status || 500,
      message: error.message || 'Internal server error'
    };
  }
} 