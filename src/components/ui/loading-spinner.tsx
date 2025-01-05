// src/components/ui/loading-spinner.tsx
export function LoadingSpinner({ className = '' }: { className?: string }) {
    return (
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-500 ${className}`} />
    )
}