// // src/app/(root)/layout.tsx
// import { Navbar } from '@/components/navbar'

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <div className="h-full">
//       <Navbar />
//       <main className="md:pt-4">
//         {children}
//       </main>
//     </div>
//   )
// }

// src/app/layout.tsx
import './globals.css'
import { Providers } from './providers'

export const metadata = {
  title: 'AI Companions',
  description: 'Your AI Companions in Telegram',
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
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}