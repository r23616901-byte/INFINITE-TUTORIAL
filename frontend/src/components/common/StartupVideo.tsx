import React, { useState, useEffect, useRef } from 'react';
import { SkipForward } from 'lucide-react';

const INTRO_STORAGE_KEY = 'it_intro_shown';

export interface StartupVideoProps {
  onFinish?: () => void;
  /** Force video to show even if previously viewed in session (defaults to false) */
  forceShow?: boolean;
}

export const StartupVideo: React.FC<StartupVideoProps> = ({ onFinish, forceShow = false }) => {
  const [shouldRender, setShouldRender] = useState<boolean>(() => {
    if (forceShow) return true;
    try {
      return sessionStorage.getItem(INTRO_STORAGE_KEY) !== 'true';
    } catch {
      return true;
    }
  });

  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const finishHandledRef = useRef<boolean>(false);

  // Complete startup video and transition smoothly to main app
  const completeStartup = () => {
    if (finishHandledRef.current) return;
    finishHandledRef.current = true;

    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, 'true');
    } catch {
      // Ignore sessionStorage exceptions (e.g. private browsing storage restrictions)
    }

    // Begin smooth fade-out transition
    setIsFadingOut(true);

    // After fade duration, unmount video component
    setTimeout(() => {
      setShouldRender(false);
      if (onFinish) {
        onFinish();
      }
    }, 450);
  };

  useEffect(() => {
    if (!shouldRender) return;

    // Safety fallback timer: Ensure user is never stuck if video fails silently or network stalls
    const fallbackTimer = setTimeout(() => {
      if (!finishHandledRef.current) {
        completeStartup();
      }
    }, 10000); // 10 seconds max safeguard

    // Attempt video playback immediately with mobile autoplay support
    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.muted = true;
      videoEl.defaultMuted = true;
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsVideoReady(true);
          })
          .catch((err) => {
            console.warn('[StartupVideo] Mobile autoplay notice:', err?.message || err);
            // In case autoplay is restricted, ensure video ready state triggers on user interaction or fallback
            setIsVideoReady(true);
          });
      }
    }

    // Keyboard support: Allow Escape or Space to skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        completeStartup();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(fallbackTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shouldRender]);

  if (!shouldRender) {
    return null;
  }

  return (
    <aside
      aria-label="Infinite Tutorial startup introduction"
      aria-modal="true"
      role="region"
      onClick={completeStartup}
      className={`fixed inset-0 z-[99999] w-screen h-screen h-[100dvh] bg-[#F8FAFC] overflow-hidden select-none flex flex-col items-center justify-center transition-opacity duration-500 ease-out cursor-pointer ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Fallback & Initial Branded Loading Indicator behind video */}
      {!isVideoReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#F8FAFC] z-10 space-y-4 px-4 text-center">
          <div className="relative flex-shrink-0">
            {/* Ambient Brand Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-[#155EEF]/20 via-[#00B8F8]/20 to-[#F7931E]/20 rounded-full blur-xl animate-pulse" />
            
            {/* Central Spinner with Brand Colors */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border-3 border-slate-200 border-t-[#00B8F8] border-r-[#155EEF] animate-spin" />
          </div>

          <div className="space-y-1">
            <p className="text-sm sm:text-base font-bold tracking-wide text-[#0B1F4D]">
              INFINITE TUTORIAL
            </p>
            <p className="text-xs text-[#155EEF] font-semibold tracking-wider uppercase">
              Initializing Portal...
            </p>
          </div>
        </div>
      )}

      {/* 
        Responsive Video Container:
        - Uses object-contain with matching soft background so landscape 16:9 video 
          seamlessly blends on portrait mobile screens without any horizontal cropping.
        - Soft top & bottom gradients seamlessly fade video boundaries.
        - playsInline and webkit-playsinline prevent iOS Safari fullscreen hijack.
      */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Soft edge blend overlays to eliminate hard 16:9 video boundaries on mobile */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-10 sm:h-14 bg-gradient-to-b from-[#F8FAFC] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 sm:h-14 bg-gradient-to-t from-[#F8FAFC] to-transparent z-10" />

        <video
          ref={videoRef}
          src="/videos/infinite-tutorial-intro.mp4"
          autoPlay
          muted
          playsInline
          webkit-playsinline="true"
          x5-playsinline="true"
          preload="auto"
          controls={false}
          disablePictureInPicture
          onLoadedData={() => setIsVideoReady(true)}
          onPlaying={() => setIsVideoReady(true)}
          onEnded={completeStartup}
          onError={() => {
            console.warn('[StartupVideo] Video failed to load or play. Skipping to application.');
            completeStartup();
          }}
          className="w-full h-full max-w-full max-h-full object-contain object-center transition-opacity duration-300"
          style={{
            maxWidth: '100vw',
            maxHeight: '100dvh',
          }}
        />
      </div>

      {/* Brand Header Indicator with Safe-Area Support */}
      <div 
        className="absolute top-3 left-3 sm:top-5 sm:left-5 z-20 flex items-center gap-2 pointer-events-none"
        style={{
          paddingTop: 'env(safe-area-inset-top, 0.5rem)',
          paddingLeft: 'env(safe-area-inset-left, 0.5rem)',
        }}
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B1F4D]/90 backdrop-blur-md shadow-sm border border-white/20">
          <span className="w-2 h-2 rounded-full bg-[#00B8F8] animate-pulse flex-shrink-0" />
          <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-white whitespace-nowrap">
            Infinite Tutorial
          </span>
        </div>
      </div>

      {/* Mobile-Friendly Safe-Area Thumb Skip Button */}
      <div 
        className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom, 0.5rem)',
          paddingRight: 'env(safe-area-inset-right, 0.5rem)',
        }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            completeStartup();
          }}
          aria-label="Skip introduction video"
          className="group flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#0B1F4D] hover:bg-[#155EEF] active:scale-95 text-white shadow-lg border border-slate-200/20 backdrop-blur-md transition-all duration-200 text-xs sm:text-sm font-semibold whitespace-nowrap"
        >
          <span>Skip</span>
          <SkipForward className="w-3.5 h-3.5 text-[#00B8F8] group-hover:text-[#F7931E] group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0" />
        </button>
      </div>

      {/* Subtle Mobile Tap Hint at Bottom */}
      <div 
        className="absolute bottom-4 left-4 z-20 pointer-events-none block md:hidden opacity-70"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom, 0.5rem)',
          paddingLeft: 'env(safe-area-inset-left, 0.5rem)',
        }}
      >
        <span className="text-[11px] font-medium text-slate-500">
          Tap anywhere to skip
        </span>
      </div>
    </aside>
  );
};

export default StartupVideo;
