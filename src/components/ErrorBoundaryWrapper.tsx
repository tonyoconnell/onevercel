import { ErrorBoundary } from 'react-error-boundary';
import { cn } from '@/lib/utils';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div 
      role="alert" 
      className={cn(
        "p-4 rounded-lg border bg-background/95",
        "backdrop-blur supports-[backdrop-filter]:bg-background/60"
      )}
    >
      <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
      <pre className="text-sm text-muted-foreground overflow-auto p-2 bg-muted rounded">
        {error.message}
      </pre>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  );
}

interface ErrorBoundaryWrapperProps {
  children: React.ReactNode;
}

export function ErrorBoundaryWrapper({ children }: ErrorBoundaryWrapperProps) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state here
        window.location.reload();
      }}
      onError={(error) => {
        // Log the error to your error reporting service
        console.error('Error caught by boundary:', error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
} 