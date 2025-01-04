// src/components/navbar.tsx
'use client'

import { useContext } from 'react'
import { TelegramWebAppContext } from '@/app/providers'

export function Navbar() {
  const tg = useContext(TelegramWebAppContext)
  
  return (
    <div className="fixed top-0 w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary">
      <div className="flex gap-x-2 items-center">
        <h1 className="text-xl font-bold">
          AI Companions
        </h1>
      </div>
      {tg?.initDataUnsafe?.user?.username && (
        <div className="flex items-center gap-x-2">
          <p className="text-sm">
            {tg.initDataUnsafe.user.username}
          </p>
        </div>
      )}
    </div>
  )
}