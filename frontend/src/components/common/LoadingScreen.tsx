import React from 'react';
import { BrandLogo } from './BrandLogo';

export interface LoadingScreenProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Initializing Infinite Portal...',
  subMessage = 'Securing session & loading academic workspace',
  fullScreen = true,
}) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-slate-50/95 backdrop-blur-sm'
    : 'min-h-[50vh] flex items-center justify-center py-12';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center text-center p-8 max-w-sm mx-auto space-y-5 animate-in fade-in duration-300">
        {/* Pulsing Brand Logo */}
        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur-md opacity-30 animate-pulse" />
          <div className="relative p-2 bg-white rounded-2xl shadow-lg border border-slate-100">
            <BrandLogo size="lg" showSubtitle={false} />
          </div>
        </div>

        {/* Brand Name & Loading Message */}
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-slate-800 tracking-tight">
            {message}
          </h3>
          <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
            {subMessage}
          </p>
        </div>

        {/* Animated Loading Bar */}
        <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 rounded-full w-2/5 animate-[pulse_1.5s_ease-in-out_infinite]" />
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>Infinite Tutorial Academic Core</span>
        </div>
      </div>
    </div>
  );
};
