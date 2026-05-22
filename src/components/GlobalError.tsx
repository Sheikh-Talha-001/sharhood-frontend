import { FallbackProps } from "react-error-boundary";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export function GlobalErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-lg w-full border border-gray-100">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-3">Something went wrong</h1>
        <p className="text-gray-600 font-medium mb-6">
          An unexpected error occurred in the application. We've been notified and are looking into it.
        </p>
        
        {process.env.NODE_ENV !== "production" && (
          <div className="bg-gray-100 p-4 rounded-xl text-left overflow-auto mb-6 text-xs text-red-600 font-mono max-h-40">
            {error.message}
          </div>
        )}
        
        <button 
          onClick={resetErrorBoundary}
          className="w-full bg-brand-black text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors shadow-sm"
        >
          <RefreshCcw className="w-5 h-5" />
          Try Again
        </button>
      </div>
    </div>
  );
}
