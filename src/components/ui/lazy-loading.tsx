'use client'

const AVATAR_OPTIONS = [
  { id: 'default', url: '/avatars/minimal.jpg' },
  { id: 'professional', url: '/avatars/advisor.jpg' },
  { id: 'casual', url: '/avatars/friendly.jpg' },
  { id: 'fun', url: '/avatars/playful.jpg' }
]

interface AvatarSelectionProps {
  selectedUrl: string
  onSelect: (url: string) => void
}

export function AvatarSelection({ selectedUrl, onSelect }: AvatarSelectionProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {AVATAR_OPTIONS.map((option) => (
        <button
          key={option.id}
          onClick={() => {
            console.log('Selected URL:', option.url);
            onSelect(option.url);
        }}
          className={`
            relative aspect-square rounded-xl overflow-hidden transition-transform hover:scale-105
            ${selectedUrl === option.url 
              ? 'ring-2 ring-blue-500' 
              : 'hover:ring-2 hover:ring-blue-500/50'
            }
          `}
        >
          <img
            src={option.url}
            alt={`Avatar ${option.id}`}
            loading="lazy"
            className="w-full h-full object-cover transition-opacity duration-300"
            onLoad={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.opacity = '1';
            }}
            style={{ opacity: 0 }}
          />
        </button>
      ))}
    </div>
  )
}