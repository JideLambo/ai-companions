// src/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Database } from '@/types/supabase'

export async function middleware(request: NextRequest) {
  try {
    // Skip middleware for static files and api routes
    if (
      request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.startsWith('/api/') ||
      request.nextUrl.pathname.includes('.')
    ) {
      return NextResponse.next()
    }

    const res = NextResponse.next()
    const supabase = createMiddlewareClient<Database>({ req: request, res })

    // Get Telegram data from header if available
    const telegramData = request.headers.get('telegram-data')
    const isDevelopment = process.env.NODE_ENV === 'development'

    // Get current session
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      if (isDevelopment) {
        // In development, use test account
        await supabase.auth.signInWithPassword({
          email: 'test@telegram.user',
          password: process.env.NEXT_PUBLIC_TELEGRAM_USER_DEFAULT_PASSWORD || 'default-secure-password'
        })
      } else if (telegramData) {
        // In production with Telegram data, authenticate via API
        const response = await fetch(`${request.nextUrl.origin}/api/auth/telegram`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: telegramData
        })
        
        if (!response.ok) {
          return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
        }

        const { data } = await response.json()
        await supabase.auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token
        })
      }
    }

    // Check if user has any companions
    const { data: companions } = await supabase
      .from('companions')
      .select('id')
      .limit(1)

    // Redirect to onboarding if no companions and not already on onboarding page
    if (!companions?.length && !request.nextUrl.pathname.startsWith('/onboarding')) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}