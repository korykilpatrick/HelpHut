import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types.js';

dotenv.config();

if (!process.env.SUPABASE_URL) {
  throw new Error('Missing env.SUPABASE_URL');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing env.SUPABASE_SERVICE_ROLE_KEY');
}
if (!process.env.SUPABASE_ANON_KEY) {
  throw new Error('Missing env.SUPABASE_ANON_KEY');
}

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
  try {
    const { data, error } = await supabase.from('inventory').select('id').limit(1);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
    throw new Error('Failed to establish Supabase connection');
  }
}

// Verify connection immediately
verifyConnection()
  .then(() => console.log('Successfully connected to Supabase'))
  .catch((error) => {
    console.error('Failed to connect to Supabase:', error);
    process.exit(1); // Exit if we can't connect to the database
  });
