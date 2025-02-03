# app/db/queries.py
from app.db.connection import supabase

def get_user(user_id: str):
    response = supabase.table("users").select("*").eq("id", user_id).execute()
    return response.data

def update_user(user_id: str, user_data: dict):
    response = supabase.table("users").update(user_data).eq("id", user_id).execute()
    return response.data

def delete_user(user_id: str):
    response = supabase.table("users").delete().eq("id", user_id).execute()
    return response.data

def get_partners():
    response = supabase.table("partners").select("*").execute()
    return response.data

