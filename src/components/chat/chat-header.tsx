// src/components/chat/chat-header.tsx
'use client'

export function ChatHeader({ companion }: { companion: any }) {
  return (
    <div className="fixed top-0 w-full bg-white border-b border-gray-200 px-4 py-3 flex items-center">
      <div>
        <h2 className="text-lg font-semibold">{companion.name}</h2>
        <p className="text-sm text-gray-500">{companion.description}</p>
      </div>
    </div>
  )
}