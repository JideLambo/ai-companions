// src/types/supabase.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      companions: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          category_id: string | null
          instructions: string | null
          seed_chat: string | null
          image_url: string | null
          telegram_chat_id: string | null
          personality_traits: Json | null
          expertise_areas: string[] | null
          voice_style: string | null
          chat_style: string | null
          knowledge_cutoff: string | null
          is_public: boolean
          initialization_prompt: string | null
          response_format: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          category_id?: string | null
          instructions?: string | null
          seed_chat?: string | null
          image_url?: string | null
          telegram_chat_id?: string | null
          personality_traits?: Json | null
          expertise_areas?: string[] | null
          voice_style?: string | null
          chat_style?: string | null
          knowledge_cutoff?: string | null
          is_public?: boolean
          initialization_prompt?: string | null
          response_format?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          category_id?: string | null
          instructions?: string | null
          seed_chat?: string | null
          image_url?: string | null
          telegram_chat_id?: string | null
          personality_traits?: Json | null
          expertise_areas?: string[] | null
          voice_style?: string | null
          chat_style?: string | null
          knowledge_cutoff?: string | null
          is_public?: boolean
          initialization_prompt?: string | null
          response_format?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          companion_id: string
          user_id: string
          content: string
          role: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          companion_id: string
          user_id: string
          content: string
          role: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          companion_id?: string
          user_id?: string
          content?: string
          role?: string
          metadata?: Json | null
          created_at?: string
        }
      }
      user_settings: {
        Row: {
          user_id: string
          telegram_user_id: string | null
          notification_preferences: Json | null
          theme: string | null
          language: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          telegram_user_id?: string | null
          notification_preferences?: Json | null
          theme?: string | null
          language?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          telegram_user_id?: string | null
          notification_preferences?: Json | null
          theme?: string | null
          language?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}