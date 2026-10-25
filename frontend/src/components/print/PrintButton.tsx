import React from 'react';
import { Printer } from 'lucide-react';

export interface PrintButtonProps {
  onClick?: () => void;
  label?: string;
  title?: string;
  variant?: 'academic' | 'primary' | 'outline' | 'ghost' | 'white';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  iconOnly?: boolean;
}

export const PrintButton: React.FC<PrintButtonProps> = ({
  onClick,
  label = 'Print Report',
  title = 'Print official certified academic report',
  variant = 'academic',
  size = 'sm',
  className = '',
  disabled = false,
  isLoading = false,
  iconOnly = false,
}) => {
  const variantClasses = {
    // Academic Dark Green (Official Primary Branding)
    academic:
      'bg-[#0A3622] hover:bg-[#072417] text-white border border-[#0A3622] shadow-xs hover:shadow transition-all',
    // Standard Brand Blue
    primary:
      'bg-[#155EEF] hover:bg-[#1048B5] text-white border border-transparent shadow-xs hover:shadow transition-all',
    // Clean Outline
    outline:
      'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs hover:border-slate-400 transition-all',
    // Subtle Ghost
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors',
    // White / Glass for dark navy banners
    white:
      'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-xs transition-colors',
  }[variant];

  const sizeClasses = {
    xs: 'text-[11px] px-2 py-1 gap-1.5 rounded-lg',
    sm: 'text-xs px-3 py-1.5 gap-2 rounded-xl',
    md: 'text-sm px-4 py-2 gap-2 rounded-xl',
    lg: 'text-base px-5 py-2.5 gap-2.5 rounded-xl',
  }[size];

  const iconSizes = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      title={title}
      className={`inline-flex items-center justify-center font-bold select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed print:hidden ${variantClasses} ${
        iconOnly ? 'p-2 rounded-xl' : sizeClasses
      } ${className}`}
    >
      <Printer className={`${iconSizes} flex-shrink-0 ${isLoading ? 'animate-pulse' : ''}`} />
      {!iconOnly && <span>{label}</span>}
    </button>
  );
};
