// // src/app/(root)/page.tsx
// import { createServerClient } from '@/lib/supabase/client'
// import { getCategories } from '@/lib/utils/supabase-utils'

// export const dynamic = 'force-dynamic'

// export default async function HomePage() {
//   const supabase = createServerClient()
//   const categories = await getCategories(supabase)
  
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
//         <h1 className="text-4xl font-bold">AI Companions</h1>
//         <div className="mt-8">
//           <h2 className="text-2xl font-semibold mb-4">Categories</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {categories?.map((category) => (
//               <div key={category.id} className="p-4 border rounded-lg">
//                 <h3 className="font-medium">{category.name}</h3>
//                 <p className="text-sm text-gray-600">{category.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </main>
//   )
// }

// src/app/(root)/page.tsx
export default function HomePage() {
    return (
      <main>
        <h1>AI Companions</h1>
      </main>
    )
  }