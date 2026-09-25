import React, { createContext, useContext, useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingContextType {
  isLoading: boolean;
  message: string;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
  withLoading: <T>(action: () => Promise<T>, message?: string) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('Loading...');

  const startLoading = useCallback((msg = 'Loading...') => {
    setMessage(msg);
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const withLoading = useCallback(
    async <T,>(action: () => Promise<T>, msg = 'Processing action...'): Promise<T> => {
      startLoading(msg);
      try {
        return await action();
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  return (
    <LoadingContext.Provider value={{ isLoading, message, startLoading, stopLoading, withLoading }}>
      {/* Top indeterminate progress line when loading */}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#EEF4FF] overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#0B1F4D] via-[#155EEF] to-[#00B8F8] animate-pulse w-full" />
        </div>
      )}

      {/* Floating non-blocking activity pill */}
      {isLoading && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
          <div className="bg-[#0B1F4D]/95 backdrop-blur-md text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl border border-[#155EEF]/40 flex items-center gap-2.5">
            <Loader2 className="w-4 h-4 text-[#00B8F8] animate-spin" />
            <span>{message}</span>
          </div>
        </div>
      )}

      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export default LoadingContext;
