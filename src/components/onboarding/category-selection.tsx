'use client';

// src/components/onboarding/category-selection.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { CompanionCustomization } from './companion-customization';

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

const COMPANION_TEMPLATES: Record<string, CompanionTemplate> = {
  'Finance News & Tips': {
    name: 'Market Guru',
    description: 'Your expert guide for financial markets and investment strategies.',
    instructions: 'You are Market Guru, a financial expert who helps users understand market trends and make informed decisions.',
    seed_chat: 'Hi, I\'m Market Guru! I\'ll help you stay updated on finance and guide your actions. Let\'s get started!'
  },
  'Crypto News & Tips': {
    name: 'Crypto Sage',
    description: 'Your cryptocurrency and blockchain technology advisor.',
    instructions: 'You are Crypto Sage, an expert in cryptocurrency who helps users navigate the crypto market.',
    seed_chat: 'Hi, I\'m Crypto Sage! I\'ll help you understand crypto trends and make informed decisions. Ready to explore?'
  },
  'Productivity': {
    name: 'Task Master',
    description: 'Your personal productivity and organization expert.',
    instructions: 'You are Task Master, a productivity expert who helps users organize their time and boost efficiency.',
    seed_chat: 'Hi, I\'m Task Master! I\'ll help you optimize your workflow and achieve more. Shall we begin?'
  },
  'Wellness': {
    name: 'Wellness Guide',
    description: 'Your companion for health, fitness, and mental well-being.',
    instructions: 'You are Wellness Guide, a holistic health advisor who helps users maintain physical and mental well-being.',
    seed_chat: 'Hi, I\'m Wellness Guide! I\'ll help you maintain a balanced, healthy lifestyle. Ready to start your wellness journey?'
  }
}

export function CategorySelection({ categories }: { categories: Category[] }) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          <motion.div
            key="categories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {categories.map((category) => {
              let gradientClass = '';
              switch(category.name) {
                case 'Finance News & Tips':
                  gradientClass = 'bg-gradient-to-br from-green-400 to-blue-500';
                  break;
                case 'Crypto News & Tips':
                  gradientClass = 'bg-gradient-to-br from-purple-500 to-pink-500';
                  break;
                case 'Productivity':
                  gradientClass = 'bg-gradient-to-br from-yellow-400 to-orange-500';
                  break;
                case 'Wellness':
                  gradientClass = 'bg-gradient-to-br from-blue-400 to-indigo-500';
                  break;
                default:
                  gradientClass = 'bg-gradient-to-br from-gray-500 to-gray-700';
              }

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative p-6 rounded-xl transition-transform hover:scale-105 ${gradientClass} hover:shadow-xl group`}
                >
                  <div className="relative z-10">
                    <h3 className="font-medium text-white text-lg">
                      {category.name}
                    </h3>
                    <p className="mt-2 text-white text-sm opacity-90">
                      {category.description}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 rounded-xl transition-opacity" />
                </button>
              )
            })}
          </motion.div>
        ) : (
          <motion.div
            key="customization"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CompanionCustomization
              category={selectedCategory}
              template={COMPANION_TEMPLATES[selectedCategory.name]}
              onBack={() => setSelectedCategory(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}