// src/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Database } from '@/types/supabase'
import crypto from 'crypto'

function validateTelegramWebAppData(data: any) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
  if (!BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN is not set')
  }

  const receivedData = Object.fromEntries(
    Object.entries(data)
      .filter(([key]) => key !== 'hash')
      .sort(([a], [b]) => a.localeCompare(b))
  )

  const dataCheckString = Object.entries(receivedData)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(BOT_TOKEN)
    .digest()

  const hash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex')

  return hash === data.hash
}

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

    // Allow direct access in development mode
    if (process.env.NODE_ENV === 'development') {
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
    }

    const telegramData = request.headers.get('telegram-data')
    if (!telegramData) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const parsedData = JSON.parse(telegramData)
    const isValid = validateTelegramWebAppData(parsedData)

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid authentication data' }, { status: 401 })
    }

    // Create supabase client
    const res = NextResponse.next()
    const supabase = createMiddlewareClient<Database>({ req: request, res })
    
    // Get session
    const { data: { session } } = await supabase.auth.getSession()
    
    // If no session, create anonymous session with Telegram metadata
    if (!session) {
      const { data: { session: newSession }, error } = await supabase.auth.signInWithPassword({
        email: `${parsedData.user.id}@telegram.user`,
        password: process.env.TELEGRAM_USER_DEFAULT_PASSWORD || 'default-secure-password'
      })

      if (error) {
        // If user doesn't exist, sign up
        await supabase.auth.signUp({
          email: `${parsedData.user.id}@telegram.user`,
          password: process.env.TELEGRAM_USER_DEFAULT_PASSWORD || 'default-secure-password',
          options: {
            data: {
              telegram_id: parsedData.user.id,
              username: parsedData.user.username,
              full_name: `${parsedData.user.first_name} ${parsedData.user.last_name || ''}`.trim()
            }
          }
        })
      }
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}