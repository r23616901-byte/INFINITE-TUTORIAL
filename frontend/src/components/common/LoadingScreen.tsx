import React from 'react';
import { BrandLogo } from './BrandLogo';

export interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading Infinite Tutorial...',
  subMessage = 'Checking your academic portal permissions and records',
  fullScreen = true,
}) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-[#F5F8FC]/95 backdrop-blur-md'
    : 'min-h-[50vh] flex items-center justify-center py-12';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center text-center p-8 max-w-sm mx-auto space-y-5 animate-in fade-in duration-300">
        {/* Pulsing Brand Logo with Royal Blue & Cyan Glow */}
        <div className="relative">
          <div className="absolute -inset-3 bg-gradient-to-r from-[#155EEF] via-[#00B8F8] to-[#F7931E] rounded-3xl blur-lg opacity-25 animate-pulse" />
          <div className="relative p-3 bg-white rounded-2xl shadow-md border border-[#DCE5F2]">
            <BrandLogo size="lg" showSubtitle={false} />
          </div>
        </div>

        {/* Brand Name & Loading Message */}
        <div className="space-y-1.5">
          <h3 className="text-base font-extrabold text-[#0B1F4D] tracking-tight">
            {message}
          </h3>
          <p className="text-xs text-[#5B6B82] max-w-xs leading-relaxed">
            {subMessage}
          </p>
        </div>

        {/* Brand Gradient Loading Bar */}
        <div className="w-48 h-1.5 bg-[#DCE5F2] rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#155EEF] via-[#00B8F8] to-[#155EEF] rounded-full w-2/5 animate-[pulse_1.5s_ease-in-out_infinite]" />
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#5B6B82] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00B8F8] animate-ping" />
          <span>Infinite Tutorial Academic Core</span>
        </div>
      </div>
    </div>
  );
};
