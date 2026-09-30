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
    }, 12000); // 12 seconds max safeguard

    // Attempt video playback immediately
    const videoEl = videoRef.current;
    if (videoEl) {
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsVideoReady(true);
          })
          .catch((err) => {
            console.warn('[StartupVideo] Autoplay note:', err?.message || err);
            // Even if autoplay has slight browser delay, wait for user or oncanplay, or complete on error
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
      className={`fixed inset-0 z-[99999] w-screen h-screen bg-[#0B1F4D] overflow-hidden select-none touch-none flex items-center justify-center transition-opacity duration-500 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        width: '100vw',
        height: '100vh',
      }}
    >
      {/* Fallback & Initial Branded Loading Indicator behind video */}
      {!isVideoReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B1F4D] z-10 space-y-3 sm:space-y-4 px-4 text-center py-safe">
          <div className="relative flex-shrink-0">
            {/* Ambient Brand Glow */}
            <div className="absolute -inset-3 sm:-inset-4 bg-gradient-to-r from-[#155EEF] via-[#00B8F8] to-[#F7931E] rounded-full blur-xl opacity-30 animate-pulse" />
            
            {/* Central Spinner with Brand Colors */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#155EEF]/30 border-t-[#00B8F8] border-r-[#F7931E] animate-spin" />
          </div>

          <div className="space-y-0.5 sm:space-y-1">
            <p className="text-sm sm:text-base font-bold tracking-wide text-white break-words">
              INFINITE TUTORIAL
            </p>
            <p className="text-xs sm:text-xs text-[#00B8F8]/80 font-medium tracking-wider uppercase break-words">
              Initializing Portal...
            </p>
          </div>
        </div>
      )}

      {/* Main Full-Viewport Startup Video */}
      <video
        ref={videoRef}
        src="/videos/infinite-tutorial-intro.mp4"
        autoPlay
        muted
        playsInline
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
        className="w-full h-full object-cover object-center absolute inset-0"
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
        }}
      />

      {/* Subtle Top & Bottom Gradient Vignettes for Brand Polish */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 sm:h-24 bg-gradient-to-b from-[#0B1F4D]/60 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 sm:h-28 bg-gradient-to-t from-[#0B1F4D]/70 to-transparent pb-[env(safe-area-inset-bottom)]" />

      {/* Brand Watermark / Subtle Header Indicator (Optional Visual Alignment) */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 md:top-6 md:left-6 z-20 flex items-center gap-2 pointer-events-none pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)]">
        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#00B8F8] animate-pulse flex-shrink-0" />
        <span className="text-[9px] sm:text-[11px] font-semibold tracking-wider uppercase text-white/70 whitespace-nowrap">
          Infinite Tutorial
        </span>
      </div>

      {/* Professional Skip Button in Bottom-Right Corner */}
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 z-20 pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)]">
        <button
          type="button"
          onClick={completeStartup}
          aria-label="Skip introduction video"
          className="group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 md:px-4 md:py-2 rounded-full bg-[#0B1F4D]/80 hover:bg-[#155EEF]/90 backdrop-blur-md border border-[#00B8F8]/40 hover:border-[#F7931E]/60 transition-all duration-200 text-xs sm:text-sm whitespace-nowrap"
        >
          <span className="text-slate-100 group-hover:text-white transition-colors font-medium">Skip</span>
          <SkipForward className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#00B8F8] group-hover:text-[#F7931E] group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0" />
        </button>
      </div>
    </aside>
  );
};

export default StartupVideo;
