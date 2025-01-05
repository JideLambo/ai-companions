'use client'

// src/components/chat/chat-client.tsx
import { useContext, useState } from 'react'
import { TelegramWebAppContext } from '@/app/providers'
import { createClient } from '@/lib/supabase/client'
import { ChatHeader } from './chat-header'
import { ChatMessages } from './chat-messages'
import { ChatInput } from './chat-input'

interface ChatClientProps {
  companion: any // Add proper type
  initialMessages: any[] // Add proper type
}

export function ChatClient({ companion, initialMessages }: ChatClientProps) {
  const [messages, setMessages] = useState(initialMessages)
  const tg = useContext(TelegramWebAppContext)
  const supabase = createClient()

  const addMessage = async (content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Add user message
      const { data: message } = await supabase
        .from('messages')
        .insert({
          content,
          role: 'user',
          companion_id: companion.id,
          user_id: user.id,
        })
        .select()
        .single()

      if (message) {
        setMessages(current => [...current, message])
      }

      // TODO: Add AI response logic here

    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  return (
    <>
      <ChatHeader companion={companion} />
      <ChatMessages messages={messages} />
      <ChatInput onSend={addMessage} />
    </>
  )
}