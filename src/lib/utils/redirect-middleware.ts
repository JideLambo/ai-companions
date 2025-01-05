// src/lib/utils/redirect-middleware.ts
import { createServerClient } from '@/lib/supabase/client'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function checkOnboardingStatus(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    // Check if user has any companions
    const { data: companions } = await supabase
      .from('companions')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)

    // If user has no companions and isn't on onboarding page, redirect to onboarding
    const isOnboarding = request.nextUrl.pathname === '/onboarding'
    if (!companions?.length && !isOnboarding) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }

    // If user has companions and is on onboarding page, redirect to home
    if (companions?.length && isOnboarding) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Error checking onboarding status:', error)
    return NextResponse.next()
  }
}