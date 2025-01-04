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

    // Allow all access temporarily for testing
    const res = NextResponse.next()
    const supabase = createMiddlewareClient<Database>({ req: request, res })
    
    // Create an anonymous session if none exists
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      await supabase.auth.signInWithPassword({
        email: 'test@telegram.user',
        password: process.env.TELEGRAM_USER_DEFAULT_PASSWORD || 'default-secure-password'
      })
    }
    
    return res

  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.next() // Allow request through even if there's an error
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}