import React, { useEffect, useRef, useState, useCallback } from 'react';

// ── Web Audio API Synthesizer (Zero External Dependencies, 100% Reliable) ──
class SplashAudioEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playWhoosh() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, t);
      filter.frequency.exponentialRampToValueAtTime(800, t + 0.3);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(130, t);
      osc.frequency.exponentialRampToValueAtTime(280, t + 0.35);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.05, t + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.55);
    } catch {}
  }

  playBulbClick() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = 'sine';
      clickOsc.frequency.setValueAtTime(1500, t);
      clickOsc.frequency.exponentialRampToValueAtTime(300, t + 0.025);
      clickGain.gain.setValueAtTime(0.06, t);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);
      clickOsc.start(t);
      clickOsc.stop(t + 0.035);

      [587.33, 880.0].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + 0.02);
        gain.gain.setValueAtTime(0.0001, t + 0.02);
        gain.gain.linearRampToValueAtTime(0.03, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + 0.02);
        osc.stop(t + 0.38);
      });
    } catch {}
  }

  playCompletionChime() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const chords = [
        { freq: 523.25, time: 0 },
        { freq: 659.25, time: 0.08 },
        { freq: 783.99, time: 0.16 },
        { freq: 1046.5, time: 0.25 },
      ];
      chords.forEach((chord) => {
        const t = ctx.currentTime + chord.time;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(chord.freq, t);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.06, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.6);
      });
    } catch {}
  }
}

export interface AppLoadingAnimationProps {
  onComplete?: () => void;
  autoStart?: boolean;
}

export const AppLoadingAnimation: React.FC<AppLoadingAnimationProps> = ({
  onComplete,
  autoStart = true,
}) => {
  const TOTAL_DURATION = 2500; // 2.5 seconds maximum snappy mobile-first loader
  const [elapsed, setElapsed] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const audioRef = useRef<SplashAudioEngine | null>(null);
  const playedRef = useRef<{ [k: string]: boolean }>({});
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    audioRef.current = new SplashAudioEngine();
    return () => {
      audioRef.current = null;
    };
  }, []);

  const handleFinish = useCallback(() => {
    setIsFadingOut(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 350);
  }, [onComplete]);

  useEffect(() => {
    if (!autoStart) return;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const diff = timestamp - startTimeRef.current;
      setElapsed(diff);

      if (audioRef.current) {
        if (diff >= 30 && !playedRef.current.whoosh) {
          playedRef.current.whoosh = true;
          audioRef.current.playWhoosh();
        }
        if (diff >= 1100 && !playedRef.current.bulb) {
          playedRef.current.bulb = true;
          audioRef.current.playBulbClick();
        }
        if (diff >= 1800 && !playedRef.current.chime) {
          playedRef.current.chime = true;
          audioRef.current.playCompletionChime();
        }
      }

      if (diff < TOTAL_DURATION) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setElapsed(TOTAL_DURATION);
        handleFinish();
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [autoStart, handleFinish]);

  // Stage progress: 0 to 1
  const progress = Math.min(elapsed / TOTAL_DURATION, 1);
  const pLoop = Math.min(elapsed / 1000, 1);
  const pBulb = Math.min(Math.max((elapsed - 900) / 900, 0), 1);
  const pLogo = Math.min(Math.max((elapsed - 1600) / 900, 0), 1);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        userSelect: 'none',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Blue Ambient Glow Orb */}
      <div
        style={{
          position: 'absolute',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.14) 0%, rgba(37,99,235,0.03) 60%, transparent 80%)',
          filter: 'blur(32px)',
          transform: `scale(${0.9 + pBulb * 0.3})`,
          transition: 'transform 0.3s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Skip button for instant mobile tap */}
      <button
        onClick={handleFinish}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(241,245,249,0.8)',
          border: 'none',
          borderRadius: '16px',
          padding: '6px 12px',
          fontSize: '11px',
          fontWeight: 700,
          color: '#64748B',
          cursor: 'pointer',
        }}
      >
        Skip
      </button>

      {/* Main Animated Vector Stage */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <svg
          viewBox="0 0 240 180"
          style={{
            width: '200px',
            height: '150px',
            overflow: 'visible',
          }}
        >
          <defs>
            <filter id="mGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#2563EB" floodOpacity="0.75" />
            </filter>
            <filter id="mAmber" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#F59E0B" floodOpacity="0.8" />
            </filter>
            <linearGradient id="mBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>

          {/* Infinity Loop */}
          <path
            d="M 120 90 C 90 55, 45 55, 45 90 C 45 125, 90 125, 120 90 C 150 55, 195 55, 195 90 C 195 125, 150 125, 120 90 Z"
            fill="none"
            stroke="url(#mBlueGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="420"
            strokeDashoffset={420 * (1 - pLoop)}
            filter="url(#mGlow)"
          />

          {/* Cap on Top */}
          {pLoop > 0.4 && (
            <g
              transform={`translate(120, ${46 + (1 - pLoop) * -20}) scale(${0.8 + pLoop * 0.2})`}
              style={{ transformOrigin: '0px 0px' }}
            >
              <polygon points="0,-12 36,0 0,12 -36,0" fill="#0F172A" stroke="#2563EB" strokeWidth="2" />
              <circle cx="0" cy="0" r="2.5" fill="#F59E0B" />
              <path d="M 0 0 C 10 4, 18 10, 20 18" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          {/* Light Bulb Illumination Effect */}
          {pBulb > 0.1 && (
            <g transform="translate(120, 126)" opacity={pBulb}>
              {/* Radial rays */}
              <circle cx="0" cy="8" r={12 + pBulb * 10} fill="#FEF3C7" opacity={0.4} filter="url(#mAmber)" />
              <path
                d="M -10 0 C -15 4, -12 14, -6 18 L -5 21 L 5 21 L 6 18 C 12 14, 15 4, 10 0 Z"
                fill={pBulb > 0.4 ? '#FEF08A' : '#FFFFFF'}
                stroke="#F59E0B"
                strokeWidth="2"
                filter={pBulb > 0.4 ? 'url(#mAmber)' : undefined}
              />
              <path d="M -3 12 L 0 9 L 3 12" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          )}
        </svg>

        {/* Brand Text */}
        <div
          style={{
            marginTop: '8px',
            textAlign: 'center',
            opacity: pLogo,
            transform: `translateY(${(1 - pLogo) * 10}px)`,
            transition: 'opacity 0.25s ease, transform 0.25s ease',
          }}
        >
          <div style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            <span style={{ color: '#0F172A' }}>Infinite </span>
            <span style={{ color: '#2563EB' }}>Tutorial</span>
          </div>
          <div
            style={{
              marginTop: '4px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#64748B',
            }}
          >
            Learn • Track • Grow
          </div>
        </div>

        {/* Compact Progress Pill */}
        <div
          style={{
            marginTop: '20px',
            width: '120px',
            height: '3px',
            borderRadius: '999px',
            background: '#F1F5F9',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress * 100}%`,
              background: 'linear-gradient(90deg, #2563EB, #F59E0B)',
              borderRadius: '999px',
            }}
          />
        </div>
      </div>
    </div>
  );
};
