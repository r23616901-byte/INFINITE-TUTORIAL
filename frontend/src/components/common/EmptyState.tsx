import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  actionVariant?: 'primary' | 'outline' | 'secondary';
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  compact?: boolean;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  actionVariant = 'primary',
  onAction,
  secondaryActionText,
  onSecondaryAction,
  compact = false,
  className = '',
}) => {
  return (
    <div
      className={`text-center rounded-2xl bg-gradient-to-b from-slate-50/90 to-slate-100/50 border border-dashed border-slate-200 flex flex-col items-center justify-center animate-in fade-in duration-200 ${
        compact ? 'p-6 sm:p-8' : 'p-8 sm:p-14'
      } ${className}`}
    >
      {/* Icon Capsule */}
      <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center shadow-xs mb-3.5 group-hover:scale-105 transition-transform">
        {icon || <FolderOpen className="w-8 h-8 text-slate-400 stroke-[1.5]" />}
      </div>

      {/* Title & Description */}
      <h4 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
        {title}
      </h4>
      {description && (
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-1.5 leading-relaxed font-normal">
          {description}
        </p>
      )}

      {/* Action Buttons */}
      {(actionText || secondaryActionText) && (
        <div className="mt-5 flex items-center gap-3 flex-wrap justify-center">
          {actionText && onAction && (
            <Button size="sm" variant={actionVariant} onClick={onAction}>
              {actionText}
            </Button>
          )}
          {secondaryActionText && onSecondaryAction && (
            <Button size="sm" variant="outline" onClick={onSecondaryAction}>
              {secondaryActionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
