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
  mode = 'full', // Default to full authentic logo graphic matching the uploaded reference
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    xs: {
      box: 'w-6 h-6',
      imgHeight: 'h-6 sm:h-7',
      padding: 'px-2.5 py-1',
      title: 'text-xs',
      sub: 'text-[9px]',
    },
    sm: {
      box: 'w-8 h-8',
      imgHeight: 'h-8 sm:h-9',
      padding: 'px-3 py-1.5',
      title: 'text-sm',
      sub: 'text-[10px]',
    },
    md: {
      box: 'w-10 h-10',
      imgHeight: 'h-12 sm:h-14',
      padding: 'px-4 py-2 sm:py-2.5',
      title: 'text-base',
      sub: 'text-xs',
    },
    lg: {
      box: 'w-14 h-14',
      imgHeight: 'h-15 sm:h-18',
      padding: 'px-5 py-3',
      title: 'text-xl',
      sub: 'text-xs',
    },
    xl: {
      box: 'w-20 h-20',
      imgHeight: 'h-20 sm:h-24',
      padding: 'px-6 py-3.5',
      title: 'text-2xl',
      sub: 'text-sm',
    },
  }[size];

  const isDark = variant === 'dark' || variant === 'white';
  const textColorClass = isDark ? 'text-white' : 'text-[#0B1F4D]';
  const highlightColorClass = isDark ? 'text-[#00B8F8]' : 'text-[#155EEF]';
  const subColorClass = isDark ? 'text-[#A0B3D1]' : 'text-[#5B6B82]';

  // Mark-only mode (e.g. collapsed sidebars or compact circular badges)
  if (showMarkOnly) {
    return (
      <div
        onClick={onLogoClick}
        className={`inline-flex items-center justify-center select-none ${
          onLogoClick ? 'cursor-pointer group' : ''
        } ${className}`}
        title="Infinite Tutorial"
      >
        <div className={`${sizeClasses.box} relative flex-shrink-0 flex items-center justify-center`}>
          <img
            src={logoUrl || (isDark ? '/logo-emblem-dark.png' : '/logo-emblem-transparent.png')}
            alt="Infinite Tutorial Emblem"
            className="w-full h-full object-contain filter drop-shadow-xs transition-transform duration-200"
            onError={() => setImgError(true)}
          />
        </div>
      </div>
    );
  }

  // Full official logo display (matching the authentic brand identity)
  if (mode === 'full' && !imgError) {
    const fullLogoSrc = logoUrl || '/logo-transparent.png';

    // On dark navy surfaces (sidebar, dark login banner):
    // Use the official dark-mode version with luminous white & cyan text that seamlessly matches the blue background
    if (isDark) {
      const darkLogoSrc = logoUrl || '/logo-dark.png';
      return (
        <div
          onClick={onLogoClick}
          className={`flex items-center select-none ${
            onLogoClick ? 'cursor-pointer group' : ''
          } ${className}`}
          title="Infinite Tutorial"
        >
          <img
            src={darkLogoSrc}
            alt="Infinite Tutorial"
            className={`${sizeClasses.imgHeight} w-auto max-w-full object-contain transition-transform duration-200 filter drop-shadow-sm ${
              onLogoClick ? 'group-hover:scale-[1.02]' : ''
            }`}
            onError={() => setImgError(true)}
          />
        </div>
      );
    }

    // On light surfaces: render the transparent full logo directly
    return (
      <div
        onClick={onLogoClick}
        className={`inline-flex items-center select-none ${
          onLogoClick ? 'cursor-pointer group' : ''
        } ${className}`}
        title="Infinite Tutorial"
      >
        <img
          src={fullLogoSrc}
          alt="Infinite Tutorial"
          className={`${sizeClasses.imgHeight} w-auto max-w-[240px] sm:max-w-[280px] object-contain transition-transform duration-200 filter drop-shadow-xs ${
            onLogoClick ? 'group-hover:scale-[1.02]' : ''
          }`}
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Fallback badge mode (if image fails to load)
  return (
    <div
      onClick={onLogoClick}
      className={`inline-flex items-center gap-3 select-none ${
        onLogoClick ? 'cursor-pointer group' : ''
      } ${className}`}
    >
      <div
        className={`${sizeClasses.box} relative flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
          isDark ? 'p-1 bg-white rounded-xl shadow-xs' : ''
        }`}
        title="Infinite Tutorial"
      >
        <img
          src="/logo-emblem-transparent.png"
          alt="Infinite Tutorial Emblem"
          className="w-full h-full object-contain"
          onError={() => setImgError(true)}
        />
      </div>

      <div className="flex flex-col min-w-0">
        <span
          className={`font-black tracking-tight ${textColorClass} ${sizeClasses.title} truncate leading-tight`}
        >
          Infinite <span className={highlightColorClass}>Tutorial</span>
        </span>
        {showSubtitle && (
          <span
            className={`${sizeClasses.sub} ${subColorClass} font-semibold tracking-wider uppercase truncate leading-tight mt-0.5`}
          >
            Academic &amp; Tuition Portal
          </span>
        )}
      </div>
    </div>
  );
};
