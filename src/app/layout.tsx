import { Providers } from "@/app/providers";
import "./globals.css";


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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}