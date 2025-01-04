// src/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Database } from '@/types/supabase'

interface TelegramInitData {
  hash: string
  [key: string]: string | number | undefined
}

async function validateTelegramWebAppData(data: TelegramInitData) {
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

  // Use Web Crypto API instead of Node's crypto
  const encoder = new TextEncoder()
  
  // Create secret key using WebApp string
  const secretKeyData = await crypto.subtle.importKey(
    'raw',
    encoder.encode(BOT_TOKEN),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  // Sign the data
  const signature = await crypto.subtle.sign(
    'HMAC',
    secretKeyData,
    encoder.encode(dataCheckString)
  )

  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(signature))
  const calculatedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  return calculatedHash === data.hash
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

    const parsedData = JSON.parse(telegramData) as TelegramInitData
    const isValid = await validateTelegramWebAppData(parsedData)

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
      await supabase.auth.signInWithPassword({
        email: `${parsedData.user_id}@telegram.user`,
        password: process.env.TELEGRAM_USER_DEFAULT_PASSWORD || 'default-secure-password'
      }).then(async ({ error }) => {
        // If sign in fails, create new user
        if (error) {
          await supabase.auth.signUp({
            email: `${parsedData.user_id}@telegram.user`,
            password: process.env.TELEGRAM_USER_DEFAULT_PASSWORD || 'default-secure-password',
            options: {
              data: {
                telegram_id: parsedData.user_id,
                username: parsedData.username,
                full_name: parsedData.first_name
              }
            }
          })
        }
      })
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}