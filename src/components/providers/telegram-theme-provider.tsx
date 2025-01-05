// src/components/providers/telegram-theme-provider.tsx
'use client'

import { useContext, useEffect } from 'react'
import { TelegramWebAppContext } from '@/app/providers'

export function TelegramThemeProvider({
  children
}: {
  children: React.ReactNode
}) {
  const tg = useContext(TelegramWebAppContext)

  useEffect(() => {
    if (tg?.themeParams) {
      const root = document.documentElement
      root.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#ffffff')
      root.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#000000')
      root.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#999999')
      root.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color || '#2481cc')
      root.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#2481cc')
      root.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color || '#ffffff')
      root.style.setProperty('--tg-color-scheme', tg.colorScheme || 'light')
    }
  }, [tg])

  return children
}