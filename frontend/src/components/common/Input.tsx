import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      startIcon,
      endIcon,
      id,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-bold text-[#0B1F4D] uppercase tracking-wider mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative rounded-xl shadow-2xs">
          {startIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5B6B82]">
              {startIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`block w-full rounded-xl border text-sm transition-all duration-150
              ${startIcon ? 'pl-10' : 'pl-3.5'}
              ${endIcon ? 'pr-10' : 'pr-3.5'}
              py-2.5
              ${
                error
                  ? 'border-red-400 text-red-950 placeholder-red-300 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-red-50/20'
                  : 'border-[#DCE5F2] text-[#0B1F4D] placeholder-[#8A9BB0] focus:outline-hidden focus:ring-2 focus:ring-[#155EEF]/20 focus:border-[#155EEF] bg-white'
              }
              ${disabled ? 'bg-[#F5F8FC] text-[#8A9BB0] cursor-not-allowed border-[#DCE5F2]' : 'hover:border-[#B8CDE8]'}
              ${className}
            `}
            {...props}
          />
          {endIcon && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#5B6B82]">
              {endIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>}
        {!error && helperText && <p className="mt-1.5 text-xs text-[#5B6B82]">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
