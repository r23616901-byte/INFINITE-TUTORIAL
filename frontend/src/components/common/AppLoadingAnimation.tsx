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

  // 0s: Startup whoosh
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
      filter.frequency.setValueAtTime(180, t);
      filter.frequency.exponentialRampToValueAtTime(750, t + 0.6);
      filter.frequency.exponentialRampToValueAtTime(140, t + 1.2);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, t);
      osc.frequency.exponentialRampToValueAtTime(260, t + 0.6);
      osc.frequency.exponentialRampToValueAtTime(80, t + 1.2);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.05, t + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 1.3);
    } catch {}
  }

  // 1.8s: Digital particle sparkle
  playSparkle() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const notes = [1318.51, 1567.98, 1975.53, 2093.0, 2637.02];
      notes.forEach((freq, idx) => {
        const delay = idx * 0.08;
        const t = ctx.currentTime + delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.025, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.28);
      });
    } catch {}
  }

  // 3.2s: Graduation cap drop
  playCapDrop() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(240, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.22);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.045, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.38);
    } catch {}
  }

  // 4.3s: Light bulb click-on & soft warm chime
  playBulbClick() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = 'sine';
      clickOsc.frequency.setValueAtTime(1600, t);
      clickOsc.frequency.exponentialRampToValueAtTime(300, t + 0.03);
      clickGain.gain.setValueAtTime(0.07, t);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);
      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);
      clickOsc.start(t);
      clickOsc.stop(t + 0.04);

      [587.33, 739.99, 880.0].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + 0.03);
        gain.gain.setValueAtTime(0.0001, t + 0.03);
        gain.gain.linearRampToValueAtTime(0.03, t + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + 0.03);
        osc.stop(t + 0.55);
      });
    } catch {}
  }

  // 5.5s: Prestigious Completion Chime
  playCompletionChime() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const chords = [
        { freq: 523.25, time: 0 },
        { freq: 659.25, time: 0.12 },
        { freq: 783.99, time: 0.24 },
        { freq: 1046.5, time: 0.38 },
      ];
      chords.forEach((chord) => {
        const t = ctx.currentTime + chord.time;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(chord.freq, t);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.065, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.85);
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
  // 6.8 Seconds cinematic video-like duration as requested ("6 to 7 seconds video like")
  const TOTAL_DURATION = 6800;
  const [elapsed, setElapsed] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
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
    }, 450);
  }, [onComplete]);

  useEffect(() => {
    if (!autoStart) return;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const diff = timestamp - startTimeRef.current;
      setElapsed(diff);

      // Sound triggers at exact points
      if (audioRef.current) {
        if (diff >= 50 && !playedRef.current.whoosh) {
          playedRef.current.whoosh = true;
          audioRef.current.playWhoosh();
        }
        if (diff >= 1800 && !playedRef.current.sparkle) {
          playedRef.current.sparkle = true;
          audioRef.current.playSparkle();
        }
        if (diff >= 3100 && !playedRef.current.cap) {
          playedRef.current.cap = true;
          audioRef.current.playCapDrop();
        }
        if (diff >= 4300 && !playedRef.current.bulb) {
          playedRef.current.bulb = true;
          audioRef.current.playBulbClick();
        }
        if (diff >= 5500 && !playedRef.current.chime) {
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

  // Stage progress calculations across 6.8 seconds:
  // Scene 1: 0 - 1600ms (Infinity drawing)
  const s1 = Math.min(Math.max(elapsed / 1600, 0), 1);
  // Scene 2: 1600 - 3000ms (Energy loops + sparkles)
  const s2 = Math.min(Math.max((elapsed - 1600) / 1400, 0), 1);
  // Scene 3: 3000 - 4300ms (Graduation cap descent & golden rays)
  const s3 = Math.min(Math.max((elapsed - 3000) / 1300, 0), 1);
  // Scene 4: 4300 - 5400ms (Light bulb forming and illuminating)
  const s4 = Math.min(Math.max((elapsed - 4300) / 1100, 0), 1);
  // Scene 5: 5400 - 6800ms (Clear logo & prominent wordings assembly)
  const s5 = Math.min(Math.max((elapsed - 5400) / 1400, 0), 1);

  const PATH_LENGTH = 560;
  const strokeOffset = PATH_LENGTH * (1 - s1);

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
        transition: 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        userSelect: 'none',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* ── Background Subtle Glow Orbs ── */}
      <div
        style={{
          position: 'absolute',
          width: '560px',
          height: '560px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0.03) 60%, transparent 80%)',
          filter: 'blur(45px)',
          transform: `scale(${1 + s2 * 0.15})`,
          transition: 'transform 0.5s ease',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '22%',
          left: '20%',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#60A5FA',
          opacity: s2 * 0.7,
          filter: 'blur(1px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '22%',
          right: '20%',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#F59E0B',
          opacity: s2 * 0.7,
          filter: 'blur(1px)',
        }}
      />

      {/* ── Controls (Sound & Skip) ── */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 100,
        }}
      >
        <button
          onClick={() => {
            if (audioRef.current) audioRef.current.isMuted = !isMuted;
            setIsMuted(!isMuted);
          }}
          style={{
            background: 'rgba(241,245,249,0.9)',
            border: '1px solid #E2E8F0',
            borderRadius: '20px',
            padding: '6px 12px',
            fontSize: '11px',
            fontWeight: 700,
            color: '#64748B',
            cursor: 'pointer',
          }}
        >
          {isMuted ? '🔇 Muted' : '🔊 Sound'}
        </button>

        <button
          onClick={handleFinish}
          style={{
            background: 'rgba(241,245,249,0.9)',
            border: '1px solid #E2E8F0',
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '11px',
            fontWeight: 700,
            color: '#0F172A',
            cursor: 'pointer',
          }}
        >
          Skip →
        </button>
      </div>

      {/* ── Main Fixed Center Stage ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          width: '100%',
          maxWidth: '560px',
        }}
      >
        {/* Soft Golden Light Rays Behind Graduation Cap (Scene 3 & 4) */}
        {s3 > 0.05 && (
          <div
            style={{
              position: 'absolute',
              top: '40px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(251,191,36,0.38) 0%, rgba(245,158,11,0.08) 55%, transparent 75%)',
              filter: 'blur(18px)',
              opacity: s3,
              transform: `scale(${0.8 + s3 * 0.4}) rotate(${s3 * 60}deg)`,
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
        )}

        {/* ── Animated Vector Emblem ── */}
        <svg
          viewBox="0 0 320 230"
          style={{
            width: '290px',
            height: '210px',
            overflow: 'visible',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <defs>
            <filter id="neonGlowVideo" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#2563EB" floodOpacity="0.8" />
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#60A5FA" floodOpacity="0.95" />
            </filter>

            <filter id="amberGlowVideo" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#F59E0B" floodOpacity="0.85" />
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#FDE047" floodOpacity="0.95" />
            </filter>

            <linearGradient id="electricBlueVideo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#00D2FF" />
            </linearGradient>

            <linearGradient id="goldGradientVideo" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
          </defs>

          {/* Guide loop */}
          <path
            d="M 160 115 C 120 70, 55 70, 55 115 C 55 160, 120 160, 160 115 C 200 70, 265 70, 265 115 C 265 160, 200 160, 160 115 Z"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="9"
            strokeLinecap="round"
            opacity={s1 > 0.1 ? 0.35 : 0}
          />

          {/* Scene 1: Glowing Blue Infinity Neon Trail Drawing (0s - 1.6s) */}
          <path
            d="M 160 115 C 120 70, 55 70, 55 115 C 55 160, 120 160, 160 115 C 200 70, 265 70, 265 115 C 265 160, 200 160, 160 115 Z"
            fill="none"
            stroke="url(#electricBlueVideo)"
            strokeWidth="9.5"
            strokeLinecap="round"
            strokeDasharray={PATH_LENGTH}
            strokeDashoffset={strokeOffset}
            filter="url(#neonGlowVideo)"
          />

          {/* Scene 2: Electric Energy Continuous Flow (1.6s - 3s) */}
          {s2 > 0 && (
            <path
              d="M 160 115 C 120 70, 55 70, 55 115 C 55 160, 120 160, 160 115 C 200 70, 265 70, 265 115 C 265 160, 200 160, 160 115 Z"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="45 170"
              strokeDashoffset={-(elapsed * 0.38)}
              opacity={0.9}
              filter="url(#neonGlowVideo)"
            />
          )}

          {/* Scene 2 Sparkles (Golden particles emerging) */}
          {s2 > 0.05 && (
            <g opacity={Math.min(s2 * 1.4, 1)}>
              <circle cx="50" cy="90" r="3" fill="#FBBF24" filter="url(#amberGlowVideo)" />
              <circle cx="270" cy="135" r="3.5" fill="#F59E0B" filter="url(#amberGlowVideo)" />
              <circle cx="160" cy="92" r="2.5" fill="#FBBF24" />
              <circle cx="105" cy="150" r="3" fill="#FBBF24" />
              <circle cx="215" cy="80" r="2.5" fill="#F59E0B" />
            </g>
          )}

          {/* Scene 3: Graduation Cap Drop (3s - 4.3s) */}
          {s3 > 0.02 && (
            <g
              transform={`translate(160, ${58 + (1 - Math.sin(s3 * Math.PI * 0.5)) * -75}) scale(${0.85 + s3 * 0.15})`}
              style={{ opacity: Math.min(s3 * 1.5, 1), transformOrigin: '0px 0px' }}
            >
              <ellipse cx="0" cy="22" rx="38" ry="8" fill="rgba(15,23,42,0.12)" />
              <polygon
                points="0,-20 54,0 0,20 -54,0"
                fill="#0F172A"
                stroke="#2563EB"
                strokeWidth="2.5"
                filter="drop-shadow(0 4px 10px rgba(15,23,42,0.25))"
              />
              <path d="M -23 0 C -23 15, 23 15, 23 0 Z" fill="#1E293B" />
              <circle cx="0" cy="0" r="3.5" fill="#F59E0B" />
              <path d="M 0 0 C 14 5, 28 15, 32 26" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="32" cy="27" r="3" fill="#FBBF24" />
            </g>
          )}

          {/* Scene 4: Glowing Light Bulb Illumination (4.3s - 5.4s) */}
          {s4 > 0.05 && (
            <g transform="translate(160, 162)" opacity={Math.min(s4 * 1.4, 1)}>
              {s4 > 0.25 && (
                <circle cx="0" cy="10" r={20 + s4 * 16} fill="url(#goldGradientVideo)" opacity={0.38} filter="url(#amberGlowVideo)" />
              )}
              {s4 > 0.35 && (
                <g stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" opacity={s4 * 0.95}>
                  <line x1="0" y1="38" x2="0" y2="47" />
                  <line x1="-25" y1="30" x2="-32" y2="37" />
                  <line x1="25" y1="30" x2="32" y2="37" />
                  <line x1="-34" y1="10" x2="-43" y2="10" />
                  <line x1="34" y1="10" x2="43" y2="10" />
                </g>
              )}
              <path
                d="M -15 0 C -24 6, -19 22, -10 28 L -8 33 L 8 33 L 10 28 C 19 22, 24 6, 15 0 Z"
                fill={s4 > 0.3 ? '#FFFBEB' : '#FFFFFF'}
                stroke={s4 > 0.3 ? '#F59E0B' : '#94A3B8'}
                strokeWidth="2.5"
                filter={s4 > 0.3 ? 'url(#amberGlowVideo)' : undefined}
              />
              <path
                d="M -5 19 L -3 10 L 0 15 L 3 10 L 5 19"
                fill="none"
                stroke={s4 > 0.25 ? '#F59E0B' : '#CBD5E1'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M -8 33 L 8 33 M -6 36 L 6 36 M -4 39 L 4 39" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          )}

          {/* Scene 5: Blue & Orange Accent Framing Lines */}
          {s5 > 0.05 && (
            <g opacity={s5}>
              <line
                x1={160 - s5 * 125}
                y1="32"
                x2={160 + s5 * 125}
                y2="32"
                stroke="#2563EB"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line
                x1={160 - s5 * 85}
                y1="214"
                x2={160 + s5 * 85}
                y2="214"
                stroke="#F59E0B"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
          )}
        </svg>

        {/* ── Scene 5 & Final Frame: Wordings & Brand Logo Appearing Prominently ── */}
        <div
          style={{
            marginTop: '12px',
            textAlign: 'center',
            opacity: s5,
            transform: `translateY(${(1 - s5) * 14}px)`,
            transition: 'opacity 0.35s ease, transform 0.35s ease',
            position: 'relative',
          }}
        >
          {/* Main Title: Large, bold, and crystal-clear */}
          <div
            style={{
              fontSize: '36px',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
            }}
          >
            <span style={{ color: '#0F172A' }}>Infinite </span>
            <span style={{ color: '#2563EB' }}>Tutorial</span>
          </div>

          {/* Tagline: Clear and prominent */}
          <div
            style={{
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#475569',
            }}
          >
            <span>Learn</span>
            <span style={{ color: '#2563EB', fontSize: '18px' }}>•</span>
            <span>Track</span>
            <span style={{ color: '#F59E0B', fontSize: '18px' }}>•</span>
            <span>Grow</span>
          </div>

          {/* Shimmer sweep effect */}
          {s5 > 0.35 && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '-20%',
                width: '140%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.75) 50%, transparent 100%)',
                animation: 'logoShimmerVideo 1.4s ease-in-out',
                pointerEvents: 'none',
              }}
            />
          )}
        </div>

        {/* ── Sleek Progress Bar (Full 6.8s Fill) ── */}
        <div
          style={{
            marginTop: '28px',
            width: '200px',
            height: '4px',
            borderRadius: '999px',
            background: '#F1F5F9',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${(elapsed / TOTAL_DURATION) * 100}%`,
              background: 'linear-gradient(90deg, #2563EB, #F59E0B)',
              borderRadius: '999px',
              transition: 'width 0.05s linear',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes logoShimmerVideo {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
