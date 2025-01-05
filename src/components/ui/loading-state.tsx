import { LoadingSpinner } from "./loading-spinner";

// src/components/ui/loading-state.tsx
export function LoadingState({ message = 'Loading...' }: { message?: string }) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8">
        <LoadingSpinner className="h-8 w-8" />
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    )
  }