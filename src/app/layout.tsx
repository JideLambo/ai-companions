// src/app/layout.tsx
import './globals.css'
import { Providers } from './providers'
import { TelegramThemeProvider } from '@/components/providers/telegram-theme-provider'
import { TopNav } from '@/components/navigation/top-nav'
import { BottomNav } from '@/components/navigation/bottom-nav'

export const metadata = {
  title: 'Jami AI Companions',
  description: 'Your AI Companions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" async />
      </head>
      <body>
        <Providers>
        <TelegramThemeProvider>
            <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
              <TopNav />
              <main className="flex-1 pt-16 pb-16">
                {children}
              </main>
              <BottomNav />
            </div>
          </TelegramThemeProvider>
        </Providers>
      </body>
    </html>
  )
}