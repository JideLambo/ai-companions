// src/app/chat/[companionId]/page.tsx
import { Suspense } from 'react'
import { createServerClient } from '@/lib/supabase/client'
import { ChatClient } from '@/components/chat/chat-client'
import { LoadingState } from '@/components/ui/loading-state'
import { ErrorMessage } from '@/components/ui/error-message'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface ChatPageProps {
  params: {
    companionId: string
  }
}

async function ChatContent({ companionId }: { companionId: string }) {
  const supabase = createServerClient()
  
  try {
    // Get companion details
    const { data: companion, error: companionError } = await supabase
      .from('companions')
      .select('*, categories(*)')
      .eq('id', companionId)
      .single()

    if (companionError) throw companionError
    if (!companion) redirect('/')

    // Get chat history
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*')
      .eq('companion_id', companionId)
      .order('created_at', { ascending: true })

    if (messagesError) throw messagesError

    return (
      <div className="flex flex-col flex-1">
        <ChatClient companion={companion} initialMessages={messages || []} />
      </div>
    )
  } catch (error) {
    return (
      <div className="flex-1 p-4">
        <ErrorMessage 
          title="Failed to load chat"
          message="There was an error loading the chat. Please try again."
          retry={() => window.location.reload()}
        />
      </div>
    )
  }
}

export default function ChatPage({ params }: ChatPageProps) {
  return (
    <Suspense fallback={<LoadingState message="Loading chat..." />}>
      <ChatContent companionId={params.companionId} />
    </Suspense>
  )
}