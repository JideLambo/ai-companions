// src/types/chat.ts
export interface Message {
    id: string
    content: string
    role: 'user' | 'assistant'
    companion_id: string
    user_id: string
    created_at: string
  }
  
  export interface Companion {
    id: string
    name: string
    description: string
    instructions: string
    seed_chat: string
    category_id: string
    user_id: string
    image_url?: string
    personality_traits?: Record<string, number>
    expertise_areas?: string[]
    voice_style?: string
    chat_style?: string
    categories?: {
      id: string
      name: string
      description: string
    }
  }