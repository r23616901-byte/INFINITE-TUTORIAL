import React from 'react';

export interface BrandWatermarkProps {
  /** Opacity of the watermark (default 0.045) */
  opacity?: number;
  /** Size preset */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Variant of the logo to use */
  variant?: 'emblem' | 'full';
  /** Position layout */
  position?: 'center' | 'top-right' | 'bottom-right' | 'offset';
  /** Fixed (viewport-bound) or absolute (parent container bound) */
  isFixed?: boolean;
  className?: string;
}

export const BrandWatermark: React.FC<BrandWatermarkProps> = ({
  opacity = 0.045,
  size = 'lg',
  variant = 'full',
  position = 'center',
  isFixed = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-48 sm:w-64 max-w-[80vw]',
    md: 'w-72 sm:w-96 max-w-[85vw]',
    lg: 'w-96 sm:w-[520px] max-w-[90vw]',
    xl: 'w-[450px] sm:w-[700px] max-w-[95vw]',
  }[size];

  const positionClasses = {
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'top-right': 'top-8 right-8 translate-x-4 -translate-y-4',
    'bottom-right': 'bottom-8 right-8 translate-x-4 translate-y-4',
    offset: 'top-[45%] left-[55%] -translate-x-1/2 -translate-y-1/2',
  }[position];

  const positioning = isFixed ? 'fixed' : 'absolute';
  const logoSrc = variant === 'emblem' ? '/logo-emblem-transparent.png' : '/logo-transparent.png';

  return (
    <div
      aria-hidden="true"
      className={`brand-watermark ${positioning} pointer-events-none select-none z-0 overflow-hidden flex items-center justify-center transition-opacity duration-300 ${positionClasses} ${className}`}
      style={{ opacity }}
    >
      <img
        src={logoSrc}
        alt=""
        className={`${sizeClasses} h-auto object-contain filter grayscale contrast-125 mix-blend-multiply`}
        onError={(e) => {
          const target = e.currentTarget;
          if (!target.src.includes('logo-emblem-transparent.png')) {
            target.src = '/logo-emblem-transparent.png';
          }
        }}
      />
    </div>
  );
};
