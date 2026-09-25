import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  actionVariant?: 'primary' | 'outline' | 'secondary' | 'accent';
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  compact?: boolean;
  showLogoWatermark?: boolean;
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
  showLogoWatermark = true,
  className = '',
}) => {
  return (
    <div
      className={`text-center rounded-2xl bg-white border border-dashed border-[#DCE5F2] flex flex-col items-center justify-center relative overflow-hidden transition-all duration-200 ${
        compact ? 'p-6 sm:p-8' : 'p-8 sm:p-14'
      } ${className}`}
    >
      {/* Subtle brand emblem watermark behind the empty state */}
      {showLogoWatermark && (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] select-none"
        >
          <img
            src="/logo-emblem-transparent.png"
            alt=""
            className="w-48 sm:w-64 h-auto object-contain filter grayscale"
          />
        </div>
      )}

      {/* Icon Capsule in Brand Colors */}
      <div className="w-16 h-16 rounded-2xl bg-[#EEF4FF] border border-[#DCE5F2] text-[#155EEF] flex items-center justify-center shadow-xs mb-3.5 relative z-10 transition-transform duration-200 hover:scale-105">
        {icon || <FolderOpen className="w-8 h-8 text-[#155EEF] stroke-[1.5]" />}
      </div>

      {/* Title & Description in Brand Typography */}
      <h4 className="text-base sm:text-lg font-bold text-[#0B1F4D] tracking-tight relative z-10">
        {title}
      </h4>
      {description && (
        <p className="text-xs sm:text-sm text-[#5B6B82] max-w-md mt-1.5 leading-relaxed font-normal relative z-10">
          {description}
        </p>
      )}

      {/* Action Buttons */}
      {(actionText || secondaryActionText) && (
        <div className="mt-5 flex items-center gap-3 flex-wrap justify-center relative z-10">
          {actionText && onAction && (
            <Button size="sm" variant={actionVariant} onClick={onAction}>
              {actionText}
            </Button>
          )}
          {secondaryActionText && onSecondaryAction && (
            <Button size="sm" variant="secondary" onClick={onSecondaryAction}>
              {secondaryActionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
