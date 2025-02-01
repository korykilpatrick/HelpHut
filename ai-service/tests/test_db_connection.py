import sys, os
from app.db.connection import supabase

def test_supabase_connection():
    try:
        # Query the public users table
        response = supabase.table("users").select("*").execute()
        print("\nDatabase connection test results:")
        print("--------------------------------")
        print(f"Connected successfully to Supabase")
        print(f"Number of users found: {len(response.data)}")
        
        if not response.data:
            print("\nNote: No users found in the public.users table. This could mean:")
            print("1. No users have been created yet")
            print("2. The SUPABASE_ANON_KEY might not have the correct permissions")
            print("3. The users table might be empty")
            print("\nTry creating a user through the auth UI or API first.")
        else:
            print(f"\nFound {len(response.data)} user(s) in the database")
            
    except Exception as e:
        print(f"\nError querying Supabase: {str(e)}")
        print("\nPossible issues:")
        print("1. Check if your SUPABASE_URL and SUPABASE_ANON_KEY are correct")
        print("2. Verify that the users table exists in your database")
        print("3. Ensure your Supabase project is running")
        print("4. Check if your IP is allowed in Supabase's security settings")
        raise

if __name__ == "__main__":
    test_supabase_connection()
