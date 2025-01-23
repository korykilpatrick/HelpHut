export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          new_value: string | null
          old_value: string | null
          record_id: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          record_id?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          record_id?: string | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      donation_items: {
        Row: {
          created_at: string
          donation_id: string | null
          expiration_date: string | null
          food_type_id: string | null
          id: string
          quantity: number
          storage_requirements: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          donation_id?: string | null
          expiration_date?: string | null
          food_type_id?: string | null
          id?: string
          quantity?: number
          storage_requirements?: string | null
          unit?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          donation_id?: string | null
          expiration_date?: string | null
          food_type_id?: string | null
          id?: string
          quantity?: number
          storage_requirements?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donation_items_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donation_items_food_type_id_fkey"
            columns: ["food_type_id"]
            isOneToOne: false
            referencedRelation: "food_types"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          created_at: string
          donated_at: string
          donor_id: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          donated_at?: string
          donor_id?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          donated_at?: string
          donor_id?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "donors"
            referencedColumns: ["id"]
          },
        ]
      }
      donors: {
        Row: {
          business_hours: string | null
          contact_email: string
          contact_phone: string
          created_at: string
          id: string
          location_id: string | null
          name: string
          pickup_preferences: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          business_hours?: string | null
          contact_email: string
          contact_phone: string
          created_at?: string
          id?: string
          location_id?: string | null
          name: string
          pickup_preferences?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          business_hours?: string | null
          contact_email?: string
          contact_phone?: string
          created_at?: string
          id?: string
          location_id?: string | null
          name?: string
          pickup_preferences?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donors_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      food_types: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          created_at: string
          donation_item_id: string | null
          expiration_date: string | null
          food_type_id: string | null
          id: string
          partner_org_id: string | null
          quantity: number
          status: Database["public"]["Enums"]["inventory_status"]
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          donation_item_id?: string | null
          expiration_date?: string | null
          food_type_id?: string | null
          id?: string
          partner_org_id?: string | null
          quantity?: number
          status?: Database["public"]["Enums"]["inventory_status"]
          unit?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          donation_item_id?: string | null
          expiration_date?: string | null
          food_type_id?: string | null
          id?: string
          partner_org_id?: string | null
          quantity?: number
          status?: Database["public"]["Enums"]["inventory_status"]
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_donation_item_id_fkey"
            columns: ["donation_item_id"]
            isOneToOne: false
            referencedRelation: "donation_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_food_type_id_fkey"
            columns: ["food_type_id"]
            isOneToOne: false
            referencedRelation: "food_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_partner_org_id_fkey"
            columns: ["partner_org_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          city: string | null
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          state: string | null
          street: string | null
          updated_at: string
          zip: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          state?: string | null
          street?: string | null
          updated_at?: string
          zip?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          state?: string | null
          street?: string | null
          updated_at?: string
          zip?: string | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          capacity: number | null
          contact_email: string
          contact_phone: string
          created_at: string
          id: string
          location_id: string | null
          max_capacity: number | null
          name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          capacity?: number | null
          contact_email: string
          contact_phone: string
          created_at?: string
          id?: string
          location_id?: string | null
          max_capacity?: number | null
          name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          capacity?: number | null
          contact_email?: string
          contact_phone?: string
          created_at?: string
          id?: string
          location_id?: string | null
          max_capacity?: number | null
          name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partners_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partners_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      shifts: {
        Row: {
          created_at: string
          end_time: string
          id: string
          shift_date: string
          start_time: string
          updated_at: string
          volunteer_id: string
        }
        Insert: {
          created_at?: string
          end_time: string
          id?: string
          shift_date: string
          start_time: string
          updated_at?: string
          volunteer_id: string
        }
        Update: {
          created_at?: string
          end_time?: string
          id?: string
          shift_date?: string
          start_time?: string
          updated_at?: string
          volunteer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shifts_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "volunteers"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_attachments: {
        Row: {
          attachment: string
          created_at: string
          id: string
          ticket_id: string
          updated_at: string
        }
        Insert: {
          attachment: string
          created_at?: string
          id?: string
          ticket_id: string
          updated_at?: string
        }
        Update: {
          attachment?: string
          created_at?: string
          id?: string
          ticket_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_attachments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_notes: {
        Row: {
          created_at: string
          id: string
          note: string
          ticket_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          note: string
          ticket_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string
          ticket_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_notes_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_tags: {
        Row: {
          created_at: string
          id: string
          tag: string
          ticket_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          tag: string
          ticket_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          tag?: string
          ticket_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_tags_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          created_at: string
          donation_id: string | null
          dropoff_location_id: string | null
          id: string
          partner_org_id: string | null
          pickup_location_id: string | null
          priority: Database["public"]["Enums"]["ticket_priority"]
          status: Database["public"]["Enums"]["ticket_status"]
          updated_at: string
          volunteer_id: string | null
        }
        Insert: {
          created_at?: string
          donation_id?: string | null
          dropoff_location_id?: string | null
          id?: string
          partner_org_id?: string | null
          pickup_location_id?: string | null
          priority?: Database["public"]["Enums"]["ticket_priority"]
          status?: Database["public"]["Enums"]["ticket_status"]
          updated_at?: string
          volunteer_id?: string | null
        }
        Update: {
          created_at?: string
          donation_id?: string | null
          dropoff_location_id?: string | null
          id?: string
          partner_org_id?: string | null
          pickup_location_id?: string | null
          priority?: Database["public"]["Enums"]["ticket_priority"]
          status?: Database["public"]["Enums"]["ticket_status"]
          updated_at?: string
          volunteer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_donation_id_fkey"
            columns: ["donation_id"]
            isOneToOne: false
            referencedRelation: "donations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_dropoff_location_id_fkey"
            columns: ["dropoff_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_partner_org_id_fkey"
            columns: ["partner_org_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_pickup_location_id_fkey"
            columns: ["pickup_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "volunteers"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          password_hash: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          password_hash: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          password_hash?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      volunteer_availability_time: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          start_time: string
          updated_at: string
          volunteer_id: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          start_time: string
          updated_at?: string
          volunteer_id: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          start_time?: string
          updated_at?: string
          volunteer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_availability_time_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "volunteers"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteer_availability_zones: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          volunteer_id: string
          zone: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          volunteer_id: string
          zone: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          volunteer_id?: string
          zone?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_availability_zones_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "volunteers"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteer_skills: {
        Row: {
          created_at: string
          id: string
          skill: string
          updated_at: string
          volunteer_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          skill: string
          updated_at?: string
          volunteer_id: string
        }
        Update: {
          created_at?: string
          id?: string
          skill?: string
          updated_at?: string
          volunteer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_skills_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "volunteers"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteers: {
        Row: {
          created_at: string
          email: string
          id: string
          location_id: string | null
          name: string
          phone: string
          updated_at: string
          user_id: string | null
          vehicle_type: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          location_id?: string | null
          name: string
          phone: string
          updated_at?: string
          user_id?: string | null
          vehicle_type?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          location_id?: string | null
          name?: string
          phone?: string
          updated_at?: string
          user_id?: string | null
          vehicle_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "volunteers_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "volunteers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      inventory_status: "Available" | "Reserved" | "Distributed"
      ticket_priority: "Urgent" | "Routine"
      ticket_status:
        | "Submitted"
        | "Scheduled"
        | "InTransit"
        | "Delivered"
        | "Completed"
      user_role: "Admin" | "Donor" | "Volunteer" | "Partner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never
