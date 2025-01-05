'use client'

// src/components/navigation/bottom-nav.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MessageSquare, LineChart } from 'lucide-react'

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    {
      label: 'Home',
      icon: Home,
      href: '/dashboard',
      active: pathname === '/dashboard'
    },
    {
      label: 'Chat',
      icon: MessageSquare,
      href: '/chat',
      active: pathname.startsWith('/chat')
    },
    {
      label: 'Insights',
      icon: LineChart,
      href: '/insights',
      active: pathname.startsWith('/insights')
    }
  ]

  return (
    <nav className="fixed bottom-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-around">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center space-y-1 ${
                item.active 
                  ? 'text-blue-500' 
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}