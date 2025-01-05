// src/components/ui/avatar-placeholder.tsx
'use client'

import { useMemo } from 'react'
import { UserCircle } from 'lucide-react'

interface AvatarPlaceholderProps {
  name?: string
  size?: number
  className?: string
  style?: 'professional' | 'casual' | 'humorous'
}

export function AvatarPlaceholder({ 
  name, 
  size = 40,
  className = '',
  style = 'professional'
}: AvatarPlaceholderProps) {
  const colors = useMemo(() => {
    switch (style) {
      case 'professional':
        return ['from-blue-500 to-indigo-500', 'text-indigo-100']
      case 'casual':
        return ['from-green-500 to-emerald-500', 'text-emerald-100']
      case 'humorous':
        return ['from-yellow-500 to-orange-500', 'text-orange-100']
      default:
        return ['from-gray-500 to-gray-700', 'text-gray-100']
    }
  }, [style])

  if (!name) {
    return (
      <div 
        className={`flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <UserCircle className="w-full h-full text-gray-300" />
      </div>
    )
  }

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div 
      className={`rounded-full flex items-center justify-center bg-gradient-to-br ${colors[0]} ${className}`}
      style={{ width: size, height: size }}
    >
      <span className={`text-sm font-medium ${colors[1]}`}>
        {initials}
      </span>
    </div>
  )
}