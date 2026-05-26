export type { Database } from "./database"

export interface UserProfile {
  id: string
  username: string | null
  first_name: string | null
  last_name: string | null
  mobile: string | null
  avatar_url: string | null
  joined_at: string
  email?: string
}

export interface AdminUser {
  id: string
  user_id: string
  role: "super_admin" | "game_master" | "volunteer"
}

export interface Game {
  id: string
  name: string
  publisher: string | null
  year: number | null
  description: string | null
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
}

export interface Session {
  id: string
  game_id: string
  game?: Game
  date: string
  location: string
  max_players: number
  status: "upcoming" | "completed" | "cancelled"
  notes: string | null
  confirmed_count?: number
  waitlisted_count?: number
}

export interface Booking {
  id: string
  session_id: string
  player_id: string
  player?: UserProfile
  status: "confirmed" | "waitlisted" | "cancelled"
  needs_teaching: boolean
  waitlist_position: number | null
}

export interface Score {
  id: string
  session_id: string
  player_id: string
  player?: UserProfile
  score: number | null
  is_winner: boolean
  play_duration_minutes: number | null
}

export interface Poll {
  id: string
  type: "game" | "location" | "schedule"
  title: string
  description: string | null
  options: PollOption[]
  is_active: boolean
  starts_at: string
  ends_at: string | null
  vote_counts?: Record<string, number>
  my_vote?: string[]
}

export interface PollOption {
  id: string
  label: string
  image_url?: string
}
