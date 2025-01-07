// src/components/ui/lazy-loading.tsx
import Image from 'next/image'

const AVATAR_OPTIONS = [
  { id: 'advisor', url: '/avatars/advisor.jpg', width: 200, height: 200, style: 'professional' },
  { id: 'friendly', url: '/avatars/friendly.jpg', width: 200, height: 200, style: 'casual' },
  { id: 'playful', url: '/avatars/playful.jpg', width: 200, height: 200, style: 'humorous' },
  { id: 'minimal', url: '/avatars/minimal.jpg', width: 200, height: 200, style: 'all' }
]

interface AvatarSelectionProps {
  selectedUrl: string
  onSelect: (url: string) => void
}

export function AvatarSelection({ selectedUrl, onSelect }: AvatarSelectionProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {AVATAR_OPTIONS.map((avatar) => (
        <button
          key={avatar.id}
          onClick={() => onSelect(avatar.url)}
          className={`relative aspect-square rounded-xl overflow-hidden
            ${selectedUrl === avatar.url 
              ? 'ring-2 ring-blue-500' 
              : 'hover:ring-2 hover:ring-blue-500/50'
            }`}
        >
          <Image
            src={avatar.url}
            alt={`Avatar ${avatar.id}`}
            width={avatar.width}
            height={avatar.height}
            className="object-cover"
            priority
          />
        </button>
      ))}
    </div>
  )
}