'use client'

// src/components/navigation/top-nav.tsx
import { usePathname } from 'next/navigation'
import { ChevronLeft, Bell, Settings } from 'lucide-react'

interface TopNavProps {
  companion?: {
    name: string
    image_url?: string
  }
}

export function TopNav({ companion }: TopNavProps) {
  const pathname = usePathname()
  const isChat = pathname.startsWith('/chat/')
  const isDashboard = pathname === '/dashboard'

  return (
    <nav className="fixed top-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isChat && (
              <button 
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            {companion ? (
              <div className="flex items-center space-x-3">
                {companion.image_url && (
                  <img 
                    src={companion.image_url} 
                    alt={companion.name}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="font-medium text-lg">{companion.name}</span>
              </div>
            ) : (
              <h1 className="font-medium text-lg text-white">
                {isDashboard ? 'Dashboard' : 'AI Companions'}
              </h1>
            )}
          </div>
          
          {isDashboard && (
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}