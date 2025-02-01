# app/db/connection.py
from supabase import create_client, Client
from app.config import settings

# Initialize the Supabase client using the settings.
# Using the anon key for regular operations. Use service role key for admin operations.
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
