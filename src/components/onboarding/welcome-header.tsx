// src/components/onboarding/welcome-header.tsx
'use client'

import { useContext } from 'react'
import { TelegramWebAppContext } from '@/app/providers'

export function WelcomeHeader() {
  const tg = useContext(TelegramWebAppContext)
  const firstName = tg?.initDataUnsafe?.user?.first_name || 'there'

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-center text-white">
        Welcome {firstName}! Let's set up your first AI Companion
      </h1>
      <p className="text-center text-gray-200">
        Choose your area of interest and I'll match you with the perfect AI companion.
      </p>
    </div>
  )
}