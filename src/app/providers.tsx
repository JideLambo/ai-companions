'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createContext } from 'react'
import type { TelegramWebApp } from '@/types/telegram'
import { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

export const TelegramWebAppContext = createContext<TelegramWebApp | null>(null)
export const SupabaseContext = createContext<SupabaseClient<Database> | null>(null)

export function Providers({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient())
  const [tg, setTg] = useState<TelegramWebApp | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp
      webApp.ready()
      webApp.expand()
      setTg(webApp)
    }
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return null
  }

  return (
    <SupabaseContext.Provider value={supabase}>
      <TelegramWebAppContext.Provider value={tg}>
        {children}
      </TelegramWebAppContext.Provider>
    </SupabaseContext.Provider>
  )
}