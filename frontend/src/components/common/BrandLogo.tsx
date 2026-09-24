import React, { useState } from 'react';

export interface BrandLogoProps {
  showSubtitle?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  logoUrl?: string | null;
  onLogoClick?: () => void;
  className?: string;
  variant?: 'light' | 'dark' | 'white';
  showMarkOnly?: boolean;
  mode?: 'full' | 'badge';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  showSubtitle = true,
  size = 'md',
  logoUrl = null,
  onLogoClick,
  className = '',
  variant = 'light',
  showMarkOnly = false,
  mode = 'badge',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    xs: {
      box: 'w-6 h-6',
      fullHeight: 'h-7',
      title: 'text-xs',
      sub: 'text-[9px]',
    },
    sm: {
      box: 'w-8 h-8',
      fullHeight: 'h-8 sm:h-9',
      title: 'text-sm',
      sub: 'text-[10px]',
    },
    md: {
      box: 'w-10 h-10',
      fullHeight: 'h-10 sm:h-11',
      title: 'text-base',
      sub: 'text-xs',
    },
    lg: {
      box: 'w-14 h-14',
      fullHeight: 'h-14 sm:h-16',
      title: 'text-xl',
      sub: 'text-xs',
    },
    xl: {
      box: 'w-20 h-20',
      fullHeight: 'h-20 sm:h-24',
      title: 'text-2xl',
      sub: 'text-sm',
    },
  }[size];

  const textColorClass =
    variant === 'dark' || variant === 'white'
      ? 'text-white'
      : 'text-slate-900';

  const subColorClass =
    variant === 'dark' || variant === 'white'
      ? 'text-indigo-200'
      : 'text-slate-500';

  // Mark-only mode (e.g. collapsed sidebars, compact icons)
  if (showMarkOnly) {
    return (
      <div
        onClick={onLogoClick}
        className={`inline-flex items-center justify-center select-none ${
          onLogoClick ? 'cursor-pointer group' : ''
        } ${className}`}
        title="Infinite Tutorial"
      >
        <img
          src={logoUrl || '/logo-emblem-transparent.png'}
          alt="Infinite Tutorial Emblem"
          className={`${sizeClasses.box} object-contain transition-transform duration-200 ${
            onLogoClick ? 'group-hover:scale-105' : ''
          }`}
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Full official logo mode (default - renders the complete official 3D branding with pill outline)
  if (mode === 'full' && !imgError) {
    return (
      <div
        onClick={onLogoClick}
        className={`inline-flex items-center gap-3 select-none ${
          onLogoClick ? 'cursor-pointer group' : ''
        } ${className}`}
        title="Infinite Tutorial"
      >
        <img
          src={logoUrl || '/logo-transparent.png'}
          alt="Infinite Tutorial Official Logo"
          className={`${sizeClasses.fullHeight} w-auto max-w-[260px] object-contain transition-transform duration-200 filter drop-shadow-xs ${
            onLogoClick ? 'group-hover:scale-[1.02]' : ''
          }`}
          onError={() => setImgError(true)}
        />
        {showSubtitle && (
          <div className="hidden sm:flex flex-col justify-center border-l border-slate-200/90 pl-2.5 min-w-0">
            <span
              className={`text-[10px] font-bold tracking-wider uppercase leading-none ${subColorClass}`}
            >
              Academic &amp; Tuition
            </span>
            <span className="text-[9px] font-semibold tracking-wide text-blue-600 uppercase leading-tight mt-0.5">
              Portal
            </span>
          </div>
        )}
      </div>
    );
  }

  // Badge mode (emblem mark on left + clean typography on right)
  return (
    <div
      onClick={onLogoClick}
      className={`inline-flex items-center gap-3 select-none ${
        onLogoClick ? 'cursor-pointer group' : ''
      } ${className}`}
    >
      {/* 3D Official Emblem Mark */}
      <div
        className={`${sizeClasses.box} relative flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
          onLogoClick ? 'group-hover:scale-[1.04]' : ''
        }`}
        title="Infinite Tutorial"
      >
        <img
          src="/logo-emblem-transparent.png"
          alt="Infinite Tutorial Emblem"
          className="w-full h-full object-contain filter drop-shadow-xs"
          onError={() => setImgError(true)}
        />
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight ${textColorClass} ${sizeClasses.title} truncate leading-tight`}
          >
            INFINITE{' '}
            <span
              className={
                variant === 'white' ? 'text-blue-300' : 'text-blue-600'
              }
            >
              TUTORIAL
            </span>
          </span>
        </div>
        {showSubtitle && (
          <span
            className={`${sizeClasses.sub} ${subColorClass} font-semibold tracking-wide uppercase truncate leading-tight mt-0.5`}
          >
            Academic &amp; Tuition Portal
          </span>
        )}
      </div>
    </div>
  );
};
