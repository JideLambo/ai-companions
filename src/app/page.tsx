// src/app/page.tsx
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = createServerClient()
  
  // Check auth status
  const { data: { session } } = await supabase.auth.getSession()
  
  // Redirect to onboarding if not authenticated
  if (!session) {
    redirect('/onboarding')
  }

  // Get user's companions
  const { data: companions } = await supabase
    .from('companions')
    .select('id')
    .eq('user_id', session.user.id)
    .limit(1)

  // Redirect to onboarding if no companions
  if (!companions?.length) {
    redirect('/onboarding')
  }

  // If they have companions, redirect to the last one
  redirect(`/chat/${companions[0].id}`)
}