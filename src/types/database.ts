// Auto-generated from Supabase — will be replaced with `npx supabase gen types` once project is live
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          first_name: string | null
          last_name: string | null
          mobile: string | null
          avatar_url: string | null
          joined_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          first_name?: string | null
          last_name?: string | null
          mobile?: string | null
          avatar_url?: string | null
          joined_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          first_name?: string | null
          last_name?: string | null
          mobile?: string | null
          avatar_url?: string | null
          joined_at?: string
          updated_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          user_id: string
          role: "super_admin" | "game_master" | "volunteer"
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: "super_admin" | "game_master" | "volunteer"
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: "super_admin" | "game_master" | "volunteer"
          created_by?: string | null
          created_at?: string
        }
      }
      games: {
        Row: {
          id: string
          name: string
          publisher: string | null
          year: number | null
          description: string | null
          bgg_id: number | null
          bgg_rank: number | null
          bgg_category: string | null
          bgg_category_rank: number | null
          player_count_min: number | null
          player_count_max: number | null
          time_min: number | null
          time_max: number | null
          min_age: number | null
          weight: number | null
          status: "available" | "wishlisted" | "ordered"
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["games"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<Database["public"]["Tables"]["games"]["Insert"]>
      }
      sessions: {
        Row: {
          id: string
          game_id: string
          date: string
          location: string
          max_players: number
          status: "upcoming" | "completed" | "cancelled"
          notes: string | null
          created_by: string
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["sessions"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string }
        Update: Partial<Database["public"]["Tables"]["sessions"]["Insert"]>
      }
      bookings: {
        Row: {
          id: string
          session_id: string
          player_id: string
          status: "confirmed" | "waitlisted" | "cancelled"
          needs_teaching: boolean
          waitlist_position: number | null
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["bookings"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string }
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>
      }
      scores: {
        Row: {
          id: string
          session_id: string
          player_id: string
          score: number | null
          is_winner: boolean
          play_duration_minutes: number | null
          notes: string | null
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["scores"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string }
        Update: Partial<Database["public"]["Tables"]["scores"]["Insert"]>
      }
      polls: {
        Row: {
          id: string
          type: "game" | "location" | "schedule"
          title: string
          description: string | null
          options: Json
          is_active: boolean
          starts_at: string
          ends_at: string | null
          created_by: string
          created_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["polls"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string }
        Update: Partial<Database["public"]["Tables"]["polls"]["Insert"]>
      }
      poll_votes: {
        Row: {
          id: string
          poll_id: string
          player_id: string
          selected_options: Json
          voted_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["poll_votes"]["Row"], "id" | "voted_at"> & { id?: string; voted_at?: string }
        Update: Partial<Database["public"]["Tables"]["poll_votes"]["Insert"]>
      }
      announcements: {
        Row: {
          id: string
          title: string
          body: string
          is_pinned: boolean
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["announcements"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<Database["public"]["Tables"]["announcements"]["Insert"]>
      }
      faqs: {
        Row: {
          id: string
          question: string
          answer: string
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["faqs"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<Database["public"]["Tables"]["faqs"]["Insert"]>
      }
      guidelines: {
        Row: {
          id: string
          title: string
          bullets: Json
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database["public"]["Tables"]["guidelines"]["Row"], "id" | "created_at" | "updated_at"> & { id?: string; created_at?: string; updated_at?: string }
        Update: Partial<Database["public"]["Tables"]["guidelines"]["Insert"]>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
