// src/components/chat/chat-messages.tsx
'use client'
import { Message } from '@/types/chat'

export function ChatMessages({ messages }: { messages: Message[] }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 pt-20 pb-24">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`mb-4 ${
            message.role === 'user' ? 'text-right' : 'text-left'
          }`}
        >
          <div
            className={`inline-block p-3 rounded-lg ${
              message.role === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-900'
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}
    </div>
  )
}