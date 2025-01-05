// src/components/chat/chat-input.tsx
'use client'

import { useState } from 'react'

export function ChatInput({ onSend }: { onSend: (content: string) => void }) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    onSend(message)
    setMessage('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-0 w-full bg-white border-t border-gray-200 p-4"
    >
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </form>
  )
}
