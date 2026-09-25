import React, { HTMLAttributes } from 'react';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  headerAction,
  footer,
  icon,
  badge,
  noPadding = false,
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#DCE5F2] shadow-xs hover:shadow-sm transition-all duration-200 overflow-hidden relative ${className}`}
      {...props}
    >
      {(title || subtitle || headerAction || icon || badge) && (
        <div className="px-5 py-4 border-b border-[#F0F4FA] flex items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="w-9 h-9 rounded-xl bg-[#EEF4FF] border border-[#DCE5F2] flex items-center justify-center text-[#155EEF] flex-shrink-0 shadow-2xs">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {title && (
                  <h3 className="text-sm sm:text-base font-bold text-[#0B1F4D] tracking-tight truncate">
                    {title}
                  </h3>
                )}
                {badge && <div>{badge}</div>}
              </div>
              {subtitle && (
                <p className="text-xs text-[#5B6B82] mt-0.5 truncate font-normal">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5 sm:p-6'}>{children}</div>
      {footer && (
        <div className="px-5 py-3.5 bg-[#F8FAFD] border-t border-[#F0F4FA] text-xs text-[#5B6B82] flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  );
};
