import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

if (!process.env.SUPABASE_URL) {
  throw new Error('Missing env.SUPABASE_URL');
}
if (!process.env.SUPABASE_KEY) {
  throw new Error('Missing env.SUPABASE_KEY');
}

export const supabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
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
