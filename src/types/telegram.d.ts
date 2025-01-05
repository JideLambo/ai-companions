// src/types/telegram.d.ts
export interface TelegramWebApp {
    ready: () => void
    expand: () => void
    close: () => void
    initData: string
    initDataUnsafe: {
      query_id: string
      user: {
        id: number
        first_name: string
        last_name?: string
        username?: string
        language_code?: string
        is_premium?: boolean
      }
      auth_date: number
      hash: string
    }
    themeParams: {
      bg_color?: string
      text_color?: string
      hint_color?: string
      link_color?: string
      button_color?: string
      button_text_color?: string
      secondary_bg_color?: string
    }
    colorScheme: 'light' | 'dark'
    isExpanded: boolean
    viewportHeight: number
    viewportStableHeight: number
    MainButton: {
      text: string
      color: string
      textColor: string
      isVisible: boolean
      isActive: boolean
      show: () => void
      hide: () => void
      enable: () => void
      disable: () => void
      setText: (text: string) => void
    }
    BackButton: {
      isVisible: boolean
      show: () => void
      hide: () => void
    }
    platform: string
    version: string
  }
  
  declare global {
    interface Window {
      Telegram?: {
        WebApp: TelegramWebApp
      }
    }
  }