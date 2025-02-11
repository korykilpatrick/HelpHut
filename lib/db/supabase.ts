import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types.js';

config();

if (!process.env.SUPABASE_URL) {
  throw new Error('Missing env.SUPABASE_URL');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
}
if (!process.env.SUPABASE_ANON_KEY) {
  throw new Error('Missing env.SUPABASE_ANON_KEY');
}

console.log('Initializing Supabase clients with URL:', process.env.SUPABASE_URL);

// Client for auth operations (using anon key)
export const supabaseAuth = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  }
);

// Admin client for database operations (using service role key)
export const supabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true
    }
  }
);

export async function verifyConnection() {
  console.log('Verifying Supabase connection...');
  try {
    // Test auth connection
    const { data: authData, error: authError } = await supabaseAuth.auth.getSession();
    if (authError) {
      console.error('Failed to connect to Supabase Auth:', authError);
      throw authError;
    }
    console.log('Successfully connected to Supabase Auth');

    // Test database connection
    const { data, error } = await supabase.from('users').select('id').limit(1);
    if (error) {
      console.error('Failed to connect to Supabase Database:', error);
      throw error;
    }
    console.log('Successfully connected to Supabase Database');
    
    return true;
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
    throw new Error('Failed to establish Supabase connection');
  }
}
