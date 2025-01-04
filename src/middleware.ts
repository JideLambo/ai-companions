// src/middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Database } from '@/types/supabase'

async function validateTelegramWebAppData(data: any) {
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

  async function createHmac(key: string, data: string) {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    const dataToHash = encoder.encode(data);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign(
      'HMAC',
      cryptoKey,
      dataToHash
    );
    
    return new Uint8Array(signature);
  }

  const secretKeyBuffer = await createHmac('WebAppData', BOT_TOKEN);
  
  const hashBuffer = await createHmac(
    new TextDecoder().decode(secretKeyBuffer),
    dataCheckString
  );
  
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex === data.hash;
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
    const isValid = await validateTelegramWebAppData(parsedData)

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid authentication data' }, { status: 401 })
    }

    // Create supabase client
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
    
    const supabase = createMiddlewareClient<Database>({ req: request, res: response });
    
    // Get session
    const { data: { session } } = await supabase.auth.getSession()
    
    // If no session, create anonymous session with Telegram metadata
    if (!session) {
      const { error } = await supabase.auth.signInWithPassword({
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

    return response
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