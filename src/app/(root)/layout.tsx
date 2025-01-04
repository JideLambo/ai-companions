// src/app/(root)/layout.tsx
import { Navbar } from '@/components/navbar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full">
      <Navbar />
      <main className="md:pt-4">
        {children}
      </main>
    </div>
  )
}