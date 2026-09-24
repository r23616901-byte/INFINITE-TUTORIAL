import React from 'react';
import { AlertTriangle, RotateCcw, ShieldAlert } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
  compact?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to Load Data',
  message = 'An unexpected network error occurred while retrieving academic records. Please try again.',
  onRetry,
  retryText = 'Retry Request',
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />
          <span>{message}</span>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="font-bold underline hover:text-rose-900 flex-shrink-0 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            {retryText}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="p-8 text-center bg-rose-50/50 rounded-2xl border border-rose-100 max-w-lg mx-auto space-y-4 my-6">
      <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-bold text-slate-900 text-base">{title}</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
          {message}
        </p>
      </div>
      {onRetry && (
        <Button
          size="sm"
          variant="outline"
          onClick={onRetry}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          {retryText}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
