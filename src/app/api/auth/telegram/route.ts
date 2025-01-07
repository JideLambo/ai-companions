import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

// Initialize Supabase admin client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function validateTelegramWebAppData(initData: string) {
  try {
    // Parse the initData string into key-value pairs
    const searchParams = new URLSearchParams(initData)
    const data: Record<string, string> = {}
    for (const [key, value] of searchParams) {
      data[key] = value
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      throw new Error('TELEGRAM_BOT_TOKEN is not set')
    }

    // Remove hash from the data before sorting
    const hash = data.hash
    delete data.hash

    // Sort the data alphabetically
    const sortedData = Object.fromEntries(
      Object.entries(data).sort(([a], [b]) => a.localeCompare(b))
    )

    // Create the data check string
    const dataCheckString = Object.entries(sortedData)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')

    // Generate the secret key
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest()

    // Calculate the hash
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex')

    return calculatedHash === hash
  } catch (error) {
    console.error('Error validating Telegram data:', error)
    return false
  }
}

// export async function POST(request: Request) {
//   try {
//     const { telegramUser, initData } = await request.json()

//     // Validate the request
//     if (!telegramUser || !initData) {
//       return NextResponse.json(
//         { error: 'Missing required data' },
//         { status: 400 }
//       )
//     }

//     // Validate Telegram WebApp data
//     const isValid = validateTelegramWebAppData(initData)
//     if (!isValid) {
//       return NextResponse.json(
//         { error: 'Invalid authentication data' },
//         { status: 401 }
//       )
//     }

//     // Create or get user
//     const email = `telegram${telegramUser.id}@example.com`
//     const password = crypto.randomBytes(20).toString('hex')

//     // Try to sign in first to see if user exists
//     const { data: existingData, error: signInError } = await supabase.auth.signInWithPassword({
//       email,
//       password: process.env.NEXT_PUBLIC_TELEGRAM_USER_DEFAULT_PASSWORD || 'default-secure-password'
//     })

//     // If sign in fails, create a new user
//     if (signInError || !existingData.user) {
//       console.log('Creating new user for:', email)
      
//       const { data: { user: newUser }, error: createError } = await supabase
//         .auth.admin.createUser({
//           email,
//           password: process.env.NEXT_PUBLIC_TELEGRAM_USER_DEFAULT_PASSWORD || 'default-secure-password',
//           email_confirm: true,
//           user_metadata: {
//             telegram_id: telegramUser.id.toString(),
//             username: telegramUser.username,
//             full_name: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim()
//           }
//         })

//       if (createError) throw createError

//       // Sign in with the newly created user
//       const { data: newSignInData, error: newSignInError } = await supabase.auth.signInWithPassword({
//         email,
//         password: process.env.NEXT_PUBLIC_TELEGRAM_USER_DEFAULT_PASSWORD || 'default-secure-password'
//       })

//       if (newSignInError) throw newSignInError

//       return NextResponse.json({
//         data: {
//           user: newSignInData.user,
//           access_token: newSignInData.session?.access_token,
//           refresh_token: newSignInData.session?.refresh_token
//         }
//       })
//     }

//     // Return existing user data
//     return NextResponse.json({
//       data: {
//         user: existingData.user,
//         access_token: existingData.session?.access_token,
//         refresh_token: existingData.session?.refresh_token
//       }
//     })

//   } catch (error) {
//     console.error('Authentication error:', error)
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     )
//   }
// }

export async function POST(request: Request) {
  try {
    const { telegramUser, initData } = await request.json()

    if (!telegramUser || !initData) {
      return NextResponse.json(
        { error: 'Missing required data' },
        { status: 400 }
      )
    }

    const isValid = validateTelegramWebAppData(initData)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid authentication data' },
        { status: 401 }
      )
    }

    const email = `telegram${telegramUser.id}@example.com`
    const defaultPassword = process.env.NEXT_PUBLIC_TELEGRAM_USER_DEFAULT_PASSWORD || 'default-secure-password'

    const { data: existingData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: defaultPassword
    })

    if (signInError || !existingData.user) {
      console.log('Creating new user for:', email)
      
      const { error: createError } = await supabase
        .auth.admin.createUser({
          email,
          password: defaultPassword,
          email_confirm: true,
          user_metadata: {
            telegram_id: telegramUser.id.toString(),
            username: telegramUser.username,
            full_name: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim()
          }
        })

      if (createError) throw createError

      const { data: newSignInData, error: newSignInError } = await supabase.auth.signInWithPassword({
        email,
        password: defaultPassword
      })

      if (newSignInError) throw newSignInError

      return NextResponse.json({
        data: {
          user: newSignInData.user,
          access_token: newSignInData.session?.access_token,
          refresh_token: newSignInData.session?.refresh_token
        }
      })
    }

    return NextResponse.json({
      data: {
        user: existingData.user,
        access_token: existingData.session?.access_token,
        refresh_token: existingData.session?.refresh_token
      }
    })

  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}