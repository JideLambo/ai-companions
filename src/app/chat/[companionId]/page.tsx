// src/app/chat/[companionId]/page.tsx
import { createServerClient } from '@/lib/supabase/server'
import { ChatClient } from '@/components/chat/chat-client'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface ChatPageProps {
  params: Promise<{ companionId: string }>
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { companionId } = await params
  const supabase = createServerClient()
  
  // Get companion details
  const { data: companion } = await supabase
    .from('companions')
    .select('*, categories(*)')
    .eq('id', companionId)
    .single()

  if (!companion) {
    redirect('/')
  }

  // Get chat history
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('companion_id', companionId)
    .order('created_at', { ascending: true })

  return (
    <div className="flex flex-col h-screen">
      <ChatClient companion={companion} initialMessages={messages || []} />
    </div>
  )
}