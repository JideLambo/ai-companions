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
    MainButton: {
      text: string
      color: string
      textColor: string
      isVisible: boolean
      isActive: boolean
      isProgressVisible: boolean
      show: () => void
      hide: () => void
      enable: () => void
      disable: () => void
      showProgress: (leaveActive: boolean) => void
      hideProgress: () => void
      onClick: (callback: () => void) => void
      offClick: (callback: () => void) => void
      setText: (text: string) => void
      setParams: (params: {
        text?: string
        color?: string
        text_color?: string
        is_active?: boolean
        is_visible?: boolean
      }) => void
    }
    BackButton: {
      isVisible: boolean
      show: () => void
      hide: () => void
      onClick: (callback: () => void) => void
      offClick: (callback: () => void) => void
    }
    platform: string
    colorScheme: string
    // ... rest of the TelegramWebApp interface
  }
  
  declare global {
    interface Window {
      Telegram?: {
        WebApp: TelegramWebApp
      }
    }
  }