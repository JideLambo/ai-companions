// src/lib/utils/telegram.ts
import { Database } from '@/types/supabase'
import { SupabaseClient } from '@supabase/supabase-js'
import type { TelegramWebApp } from '@/types/telegram'

export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
}

export function initTelegramWebApp(): TelegramWebApp | null {
  // Make sure we're in the browser and Telegram WebApp is available
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const webApp = window.Telegram.WebApp
    webApp.ready()
    webApp.expand()
    
    // Return the WebApp instance for further use
    return webApp
  }
  return null
}

export function getTelegramWebAppData() {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp.initData
  }
  return null
}

export async function createOrUpdateTelegramUser(
  supabase: SupabaseClient<Database>,
  telegramUser: TelegramUser
) {
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('id', telegramUser.id.toString())
    .single()

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching user:', fetchError)
    return null
  }

  const userData = {
    id: telegramUser.id.toString(),
    username: telegramUser.username,
    full_name: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim(),
  }

  if (!existingUser) {
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single()

    if (insertError) {
      console.error('Error creating user:', insertError)
      return null
    }

    return newUser
  }

  const { data: updatedUser, error: updateError } = await supabase
    .from('users')
    .update(userData)
    .eq('id', telegramUser.id.toString())
    .select()
    .single()

  if (updateError) {
    console.error('Error updating user:', updateError)
    return null
  }

  return updatedUser
}