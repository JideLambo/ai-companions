// src/lib/utils/supabase-utils.ts
import { Database } from '@/types/supabase'
import { SupabaseClient } from '@supabase/supabase-js'

export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesRow<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

export async function getUser(supabase: SupabaseClient) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export async function getUserProfile(supabase: SupabaseClient, userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export async function getUserSettings(supabase: SupabaseClient, userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error:', error)
    return null
  }
}

export async function getCategories(supabase: SupabaseClient) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

export async function getCompanions(supabase: SupabaseClient, categoryId?: string) {
  try {
    let query = supabase
      .from('companions')
      .select('*, categories(*), user:users(*)')
      .eq('is_public', true)

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    const { data, error } = await query.order('created_at')

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error:', error)
    return []
  }
}