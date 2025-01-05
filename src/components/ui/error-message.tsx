// src/components/ui/error-message.tsx
interface ErrorMessageProps {
    title?: string
    message: string
    retry?: () => void
}
  
export function ErrorMessage({ 
    title = 'Something went wrong', 
    message,
    retry
    }: ErrorMessageProps) {
    return (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
        <div className="flex">
            <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                {title}
            </h3>
            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                <p>{message}</p>
            </div>
            {retry && (
                <div className="mt-4">
                <button
                    type="button"
                    onClick={retry}
                    className="rounded-md bg-red-50 dark:bg-red-900/20 px-2 py-1.5 text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-100 dark:hover:bg-red-900/40 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                >
                    Try again
                </button>
                </div>
            )}
            </div>
        </div>
        </div>
    )
}