'use client'

// src/components/onboarding/companion-customization.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AvatarSelection } from '@/components/ui/lazy-loading'

interface Category {
  id: string
  name: string
  description: string
}

interface CompanionTemplate {
  name: string
  description: string
  instructions: string
  seed_chat: string
}

interface PersonalityStyle {
  id: string
  name: string
  description: string
  previewMessage: string
  traits: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    stability: number
  }
}

const PERSONALITY_STYLES: PersonalityStyle[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Formal and business-like approach',
    previewMessage: 'I maintain a professional demeanor while providing expert guidance.',
    traits: {
      openness: 0.6,      // Open to new ideas but grounded
      conscientiousness: 0.9, // Highly organized and responsible
      extraversion: 0.5,   // Balanced social approach
      agreeableness: 0.7,  // Cooperative but can be direct
      stability: 0.8       // Emotionally stable and composed
    }
  },
  {
    id: 'casual',
    name: 'Casual',
    description: 'Friendly and approachable style',
    previewMessage: 'Hey! I\'m here to help in a relaxed and friendly way.',
    traits: {
      openness: 0.8,      // Very open to different approaches
      conscientiousness: 0.6, // Organized but flexible
      extraversion: 0.8,   // Outgoing and energetic
      agreeableness: 0.9,  // Very friendly and accommodating
      stability: 0.7       // Generally stable but shows emotion
    }
  },
  {
    id: 'humorous',
    name: 'Humorous',
    description: 'Light-hearted and entertaining',
    previewMessage: 'Ready to tackle challenges with a smile and maybe a dad joke or two! 😄',
    traits: {
      openness: 0.9,      // Very open to unconventional ideas
      conscientiousness: 0.5, // Balanced between fun and work
      extraversion: 0.9,   // Highly outgoing
      agreeableness: 0.8,  // Very friendly but can be playfully sarcastic
      stability: 0.6       // More emotional variation for humor
    }
  }
]

// const AVATAR_OPTIONS = [
//   { id: 'advisor', url: '/avatars/advisor.jpg', style: 'professional' },
//   { id: 'friendly', url: '/avatars/friendly.jpg', style: 'casual' },
//   { id: 'playful', url: '/avatars/playful.jpg', style: 'humorous' },
//   { id: 'minimal', url: '/avatars/minimal.jpg', style: 'all' }
// ]

export function CompanionCustomization({ 
  category,
  template,
  onBack
}: {
  category: Category
  template: CompanionTemplate
  onBack: () => void
}) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState(template.name)
  const [personalityStyle, setPersonalityStyle] = useState<PersonalityStyle | null>(null)
  const [imageUrl] = useState<string>('')
  const [isCreating, setIsCreating] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  const handleNext = () => {
    if (step === 1 && name.trim()) {
      setStep(2)
    } else if (step === 2 && personalityStyle) {
      setStep(3)
    }
  }

  const handleBack = () => {
    if (step === 1) {
      onBack()
    } else {
      setStep(step - 1)
    }
  }

  const handleCreate = async () => {
    if (!personalityStyle || !imageUrl) return

    try {
      setIsCreating(true)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user found')

      // Create companion with customizations
      const { data: companion, error: companionError } = await supabase
        .from('companions')
        .insert({
          name,
          description: template.description,
          instructions: template.instructions,
          seed_chat: template.seed_chat,
          category_id: category.id,
          user_id: user.id,
          is_public: true,
          personality_traits: personalityStyle.traits,
          chat_style: personalityStyle.id,
          image_url: imageUrl,
          expertise_areas: [category.name],
          voice_style: personalityStyle.id,
          response_format: {
            model: "gpt-4",
            temperature: personalityStyle.id === 'professional' ? 0.7 : 
                        personalityStyle.id === 'casual' ? 0.8 : 0.9,
            max_tokens: 150,
            frequency_penalty: 0.5,
            presence_penalty: 0.5
          },
          initialization_prompt: `You are ${name}, a ${personalityStyle.id} AI companion specialized in ${category.name}.
            ${template.instructions}
            Maintain a ${personalityStyle.description.toLowerCase()} while helping users.
            
            Core traits:
            - Openness: ${personalityStyle.traits.openness * 100}%
            - Conscientiousness: ${personalityStyle.traits.conscientiousness * 100}%
            - Extraversion: ${personalityStyle.traits.extraversion * 100}%
            - Agreeableness: ${personalityStyle.traits.agreeableness * 100}%
            - Emotional Stability: ${personalityStyle.traits.stability * 100}%
            
            Key behaviors:
            - Professional tone: ${personalityStyle.id === 'professional' ? 'High' : 'Moderate'}
            - Casual language: ${personalityStyle.id === 'casual' ? 'High' : 'Moderate'}
            - Humor usage: ${personalityStyle.id === 'humorous' ? 'High' : 'Low'}
            
            Remember to:
            1. Stay in character consistently
            2. Use appropriate language for your personality type
            3. Maintain expertise in ${category.name}
            4. Be helpful while reflecting your personality traits`
        })
        .select()
        .single()

      if (companionError) throw companionError

      // Create welcome message
      const welcomeMessage = `Hi! I'm ${name}, your ${personalityStyle.id} companion for ${category.name}. ${template.seed_chat}`
      
      await supabase
        .from('messages')
        .insert({
          content: welcomeMessage,
          role: 'assistant',
          companion_id: companion.id,
          user_id: user.id,
        })

      router.push(`/chat/${companion.id}`)
    } catch (error) {
      console.error('Error creating companion:', error)
      setIsCreating(false)
    }
  }

  // Filter avatars based on selected personality style
  // const filteredAvatars = personalityStyle
  //   ? AVATAR_OPTIONS.filter(avatar => 
  //       avatar.style === 'all' || avatar.style === personalityStyle.id
  //     )
  //   : AVATAR_OPTIONS

  return (
    <div className="space-y-6 px-4">
      {/* Progress Indicator */}
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={handleBack}
          className="flex items-center text-gray-400 hover:text-white"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </button>
        <div className="flex space-x-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 w-16 rounded-full ${
                i === step ? 'bg-blue-500' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1: Name */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white text-center">
            Name your companion
          </h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            placeholder="Enter a name..."
            className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <p className="text-right text-gray-400 text-sm">
            {name.length}/20 characters
          </p>
        </div>
      )}

      {/* Step 2: Personality */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white text-center">
            Choose a personality
          </h2>
          <div className="grid gap-4">
            {PERSONALITY_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => setPersonalityStyle(style)}
                className={`p-4 rounded-lg text-left transition ${
                  personalityStyle?.id === style.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-800 text-gray-100 hover:bg-gray-700'
                }`}
              >
                <h3 className="font-semibold text-lg">{style.name}</h3>
                <p className="text-sm opacity-90">{style.description}</p>
                <p className="mt-2 text-sm italic">&quot;{style.previewMessage}&quot;</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Avatar */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center text-white">
            Choose an avatar
          </h2>
          <AvatarSelection 
            selectedUrl={avatarUrl}
            onSelect={setAvatarUrl}
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-end pt-4">
        {step < 3 ? (
          <button
            onClick={handleNext}
            disabled={!name.trim() || (step === 2 && !personalityStyle)}
            className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        ) : (
          <button
            onClick={handleCreate}
            disabled={isCreating || !avatarUrl}  // Changed from imageUrl to avatarUrl
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Creating...' : 'Create Companion'}
          </button>
        )}
      </div>
    </div>
  )
}