// src/app/onboarding/page.tsx
import { createServerClient } from '@/lib/supabase/client'
import { getCategories } from '@/lib/utils/supabase-utils'
import { CategorySelection } from '@/components/onboarding/category-selection'
import { WelcomeHeader } from '@/components/onboarding/welcome-header'

export const dynamic = 'force-dynamic'

export default async function OnboardingPage() {
  const supabase = createServerClient()
  const categories = await getCategories(supabase)
  
  return (
    <main className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <WelcomeHeader />
          <CategorySelection categories={categories} />
        </div>
      </div>
    </main>
  )
}