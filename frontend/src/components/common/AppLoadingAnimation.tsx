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

  // Scene 1 (0s): Soft startup whoosh
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
      filter.frequency.exponentialRampToValueAtTime(750, t + 0.45);
      filter.frequency.exponentialRampToValueAtTime(140, t + 0.95);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, t);
      osc.frequency.exponentialRampToValueAtTime(240, t + 0.4);
      osc.frequency.exponentialRampToValueAtTime(85, t + 0.95);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.06, t + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.95);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 1.0);
    } catch {}
  }

  // Scene 2 (1.2s): Digital particle sparkle
  playSparkle() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const notes = [1318.51, 1567.98, 1975.53, 2093.0, 2637.02];
      notes.forEach((freq, idx) => {
        const delay = idx * 0.055;
        const t = ctx.currentTime + delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.025, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.18);
      });
    } catch {}
  }

  // Scene 3 (2.1s): Soft graduation cap touchdown
  playCapDrop() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(130, t + 0.18);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.05, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.3);
    } catch {}
  }

  // Scene 4 (3.2s): Light bulb click-on & warm glow sound
  playBulbClick() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const t = ctx.currentTime;

      // Click snap
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.type = 'sine';
      clickOsc.frequency.setValueAtTime(1600, t);
      clickOsc.frequency.exponentialRampToValueAtTime(280, t + 0.025);
      clickGain.gain.setValueAtTime(0.07, t);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);
      clickOsc.start(t);
      clickOsc.stop(t + 0.035);

      // Warm glow chime
      [587.33, 739.99].forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + 0.03);
        gain.gain.setValueAtTime(0.0001, t + 0.03);
        gain.gain.linearRampToValueAtTime(0.035, t + 0.07);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + 0.03);
        osc.stop(t + 0.45);
      });
    } catch {}
  }

  // Scene 5 (4.2s): Gentle notification chime & completion chord
  playCompletionChime() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const chords = [
        { freq: 523.25, time: 0 },    // C5
        { freq: 659.25, time: 0.11 }, // E5
        { freq: 783.99, time: 0.22 }, // G5
        { freq: 1046.50, time: 0.35 } // C6
      ];
      chords.forEach((chord) => {
        const t = ctx.currentTime + chord.time;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(chord.freq, t);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.065, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.65);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.7);
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
  const [elapsed, setElapsed] = useState(0); // 0 to 5000 ms
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<SplashAudioEngine | null>(null);
  const playedScenes = useRef<{ [key: string]: boolean }>({});
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Initialize audio engine
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

  // Main 60 FPS animation loop
  useEffect(() => {
    if (!autoStart) return;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const diff = timestamp - startTimeRef.current;
      setElapsed(diff);

      // Sound triggers at exact milliseconds
      if (audioRef.current) {
        if (diff >= 50 && !playedScenes.current.whoosh) {
          playedScenes.current.whoosh = true;
          audioRef.current.playWhoosh();
        }
        if (diff >= 1200 && !playedScenes.current.sparkle) {
          playedScenes.current.sparkle = true;
          audioRef.current.playSparkle();
        }
        if (diff >= 2100 && !playedScenes.current.cap) {
          playedScenes.current.cap = true;
          audioRef.current.playCapDrop();
        }
        if (diff >= 3200 && !playedScenes.current.bulb) {
          playedScenes.current.bulb = true;
          audioRef.current.playBulbClick();
        }
        if (diff >= 4150 && !playedScenes.current.chime) {
          playedScenes.current.chime = true;
          audioRef.current.playCompletionChime();
        }
      }

      if (diff < 5000) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        // Complete 5-second animation
        setElapsed(5000);
        handleFinish();
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [autoStart, handleFinish]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.isMuted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  // Progression calculation: 0.0 to 1.0 per scene
  // Scene 1: 0 - 1000ms
  const s1 = Math.min(Math.max(elapsed / 1000, 0), 1);
  // Scene 2: 1000 - 2000ms
  const s2 = Math.min(Math.max((elapsed - 1000) / 1000, 0), 1);
  // Scene 3: 2000 - 3000ms
  const s3 = Math.min(Math.max((elapsed - 2000) / 1000, 0), 1);
  // Scene 4: 3000 - 4000ms
  const s4 = Math.min(Math.max((elapsed - 3000) / 1000, 0), 1);
  // Scene 5: 4000 - 5000ms
  const s5 = Math.min(Math.max((elapsed - 4000) / 1000, 0), 1);

  // SVG lemniscate path length is ~560px
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
        overflow: 'hidden',
        userSelect: 'none',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* ── Background Subtle Glow Particles ── */}
      <div
        style={{
          position: 'absolute',
          width: '540px',
          height: '540px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.09) 0%, rgba(37,99,235,0.02) 60%, transparent 80%)',
          filter: 'blur(40px)',
          transform: `scale(${1 + s2 * 0.15})`,
          transition: 'transform 0.4s ease',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '25%',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#60A5FA',
          opacity: s2 * 0.6,
          filter: 'blur(1px)',
          animation: 'floatParticle 3s infinite ease-in-out',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '25%',
          right: '28%',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#F59E0B',
          opacity: s2 * 0.7,
          filter: 'blur(1px)',
          animation: 'floatParticle 2.5s infinite ease-in-out 0.5s',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '35%',
          right: '22%',
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: '#2563EB',
          opacity: s1 * 0.25,
          filter: 'blur(2px)',
        }}
      />

      {/* ── Top Controls (Mute & Skip) ── */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          right: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 100,
        }}
      >
        <button
          onClick={toggleMute}
          title={isMuted ? 'Unmute' : 'Mute'}
          style={{
            background: 'rgba(241,245,249,0.85)',
            border: '1px solid #E2E8F0',
            borderRadius: '20px',
            padding: '6px 12px',
            fontSize: '11px',
            fontWeight: 600,
            color: '#64748B',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backdropFilter: 'blur(6px)',
          }}
        >
          {isMuted ? '🔇 Muted' : '🔊 Sound'}
        </button>

        <button
          onClick={handleFinish}
          style={{
            background: 'rgba(241,245,249,0.85)',
            border: '1px solid #E2E8F0',
            borderRadius: '20px',
            padding: '6px 14px',
            fontSize: '11px',
            fontWeight: 700,
            color: '#0F172A',
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
            transition: 'all 0.15s ease',
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
          height: '380px',
        }}
      >
        {/* Golden Light Rays Behind Graduation Cap (Scene 3 & 4) */}
        {s3 > 0.05 && (
          <div
            style={{
              position: 'absolute',
              top: '38px',
              width: '190px',
              height: '190px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(251,191,36,0.35) 0%, rgba(245,158,11,0.08) 55%, transparent 75%)',
              filter: 'blur(16px)',
              opacity: s3,
              transform: `scale(${0.8 + s3 * 0.4}) rotate(${s3 * 45}deg)`,
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
        )}

        {/* ── Unified Animation SVG Canvas ── */}
        <svg
          viewBox="0 0 320 240"
          style={{
            width: '280px',
            height: '210px',
            overflow: 'visible',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <defs>
            {/* Blue Neon Glow Filter */}
            <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="4.5" floodColor="#2563EB" floodOpacity="0.7" />
              <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#60A5FA" floodOpacity="0.9" />
            </filter>

            {/* Amber Bulb Glow Filter */}
            <filter id="amberGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#F59E0B" floodOpacity="0.8" />
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#FDE047" floodOpacity="0.9" />
            </filter>

            {/* Energy Gradient */}
            <linearGradient id="electricBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#00D2FF" />
            </linearGradient>

            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
          </defs>

          {/* ══════════════════════════════════════════════════════════
              SCENE 1 & 2: Glowing Infinity Symbol Lemniscate
              ══════════════════════════════════════════════════════════ */}
          {/* Base smooth background loop (faint guide after S1 starts) */}
          <path
            d="M 160 120 C 120 75, 55 75, 55 120 C 55 165, 120 165, 160 120 C 200 75, 265 75, 265 120 C 265 165, 200 165, 160 120 Z"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="8"
            strokeLinecap="round"
            opacity={s1 > 0.1 ? 0.35 : 0}
          />

          {/* Glowing neon drawing path (Scene 1: 0s-1s) */}
          <path
            d="M 160 120 C 120 75, 55 75, 55 120 C 55 165, 120 165, 160 120 C 200 75, 265 75, 265 120 C 265 165, 200 165, 160 120 Z"
            fill="none"
            stroke="url(#electricBlue)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={PATH_LENGTH}
            strokeDashoffset={strokeOffset}
            filter="url(#neonGlow)"
          />

          {/* Electric energy flowing pulse (Scene 2: 1s-2s continuous) */}
          {s2 > 0 && (
            <path
              d="M 160 120 C 120 75, 55 75, 55 120 C 55 165, 120 165, 160 120 C 200 75, 265 75, 265 120 C 265 165, 200 165, 160 120 Z"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="40 180"
              strokeDashoffset={-(elapsed * 0.45)}
              opacity={0.85}
              filter="url(#neonGlow)"
            />
          )}

          {/* Scene 2 Sparkles (Golden particles emerging around the loops) */}
          {s2 > 0.1 && (
            <g opacity={Math.min(s2 * 1.5, 1)}>
              {/* Particle 1 */}
              <circle cx="50" cy="95" r="2.5" fill="#FBBF24" opacity={0.9} filter="url(#amberGlow)" />
              {/* Particle 2 */}
              <circle cx="270" cy="140" r="3" fill="#F59E0B" opacity={0.85} filter="url(#amberGlow)" />
              {/* Particle 3 */}
              <circle cx="160" cy="98" r="2" fill="#FBBF24" opacity={0.9} />
              {/* Particle 4 */}
              <circle cx="105" cy="155" r="2.5" fill="#FBBF24" opacity={0.8} />
              {/* Particle 5 */}
              <circle cx="215" cy="85" r="2" fill="#F59E0B" opacity={0.85} />
            </g>
          )}

          {/* ══════════════════════════════════════════════════════════
              SCENE 3: Graduation Cap Smooth Drop (2s-3s)
              Lands on top of the infinity symbol knot
              ══════════════════════════════════════════════════════════ */}
          {s3 > 0.02 && (
            <g
              transform={`translate(160, ${60 + (1 - Math.sin(s3 * Math.PI * 0.5)) * -70}) scale(${0.85 + s3 * 0.15})`}
              style={{
                opacity: Math.min(s3 * 1.6, 1),
                transformOrigin: '0px 0px',
              }}
            >
              {/* Cap Base / Cap Mortarboard Shadow */}
              <ellipse cx="0" cy="22" rx="36" ry="7" fill="rgba(15,23,42,0.12)" />

              {/* Cap Diamond Top */}
              <polygon
                points="0,-18 52,0 0,18 -52,0"
                fill="#0F172A"
                stroke="#2563EB"
                strokeWidth="2.5"
                filter="drop-shadow(0 4px 8px rgba(15,23,42,0.25))"
              />

              {/* Cap Skull Cap base */}
              <path
                d="M -22 0 C -22 14, 22 14, 22 0 Z"
                fill="#1E293B"
              />

              {/* Cap Button / Center Pin */}
              <circle cx="0" cy="0" r="3.5" fill="#F59E0B" />

              {/* Golden Tassel */}
              <path
                d="M 0 0 C 14 5, 26 14, 30 25"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="30" cy="26" r="3" fill="#FBBF24" />
            </g>
          )}

          {/* ══════════════════════════════════════════════════════════
              SCENE 4: Glowing Light Bulb Underneath (3s-4s)
              Illuminates learning & innovation
              ══════════════════════════════════════════════════════════ */}
          {s4 > 0.05 && (
            <g
              transform="translate(160, 168)"
              opacity={Math.min(s4 * 1.4, 1)}
            >
              {/* Bulb Ambient Flare */}
              {s4 > 0.25 && (
                <circle
                  cx="0"
                  cy="10"
                  r={18 + s4 * 14}
                  fill="url(#goldGradient)"
                  opacity={0.35}
                  filter="url(#amberGlow)"
                />
              )}

              {/* Bulb Radial Light Rays */}
              {s4 > 0.35 && (
                <g stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity={s4 * 0.9}>
                  <line x1="0" y1="36" x2="0" y2="44" />
                  <line x1="-24" y1="28" x2="-30" y2="34" />
                  <line x1="24" y1="28" x2="30" y2="34" />
                  <line x1="-32" y1="10" x2="-40" y2="10" />
                  <line x1="32" y1="10" x2="40" y2="10" />
                </g>
              )}

              {/* Bulb Glass Body */}
              <path
                d="M -14 0 C -22 6, -18 20, -9 26 L -7 31 L 7 31 L 9 26 C 18 20, 22 6, 14 0 Z"
                fill={s4 > 0.3 ? '#FFFBEB' : '#FFFFFF'}
                stroke={s4 > 0.3 ? '#F59E0B' : '#94A3B8'}
                strokeWidth="2.5"
                filter={s4 > 0.3 ? 'url(#amberGlow)' : undefined}
              />

              {/* Bulb Golden Filament (Lights up at S4 > 0.2) */}
              <path
                d="M -5 18 L -3 10 L 0 14 L 3 10 L 5 18"
                fill="none"
                stroke={s4 > 0.25 ? '#F59E0B' : '#CBD5E1'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Bulb Screw Base */}
              <path
                d="M -7 31 L 7 31 M -6 34 L 6 34 M -4 37 L 4 37"
                stroke="#64748B"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* ══════════════════════════════════════════════════════════
              SCENE 5: Blue & Orange Accent Framing Lines (4s-5s)
              ══════════════════════════════════════════════════════════ */}
          {s5 > 0.05 && (
            <g opacity={s5}>
              {/* Top Royal Blue Accent Line */}
              <line
                x1={160 - s5 * 120}
                y1="34"
                x2={160 + s5 * 120}
                y2="34"
                stroke="#2563EB"
                strokeWidth="2"
                strokeLinecap="round"
                opacity={0.8}
              />
              {/* Bottom Orange Accent Line */}
              <line
                x1={160 - s5 * 80}
                y1="220"
                x2={160 + s5 * 80}
                y2="220"
                stroke="#F59E0B"
                strokeWidth="2"
                strokeLinecap="round"
                opacity={0.85}
              />
            </g>
          )}
        </svg>

        {/* ══════════════════════════════════════════════════════════
            SCENE 5 & FINAL FRAME: Typography & Shimmer Tagline
            Slides smoothly in from right / fades into center
            ══════════════════════════════════════════════════════════ */}
        <div
          style={{
            marginTop: '10px',
            textAlign: 'center',
            opacity: s5,
            transform: `translateY(${(1 - s5) * 16}px)`,
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            position: 'relative',
            zIndex: 20,
          }}
        >
          {/* Main Brand Title */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontSize: '32px',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            <span style={{ color: '#0F172A' }}>Infinite</span>
            <span
              style={{
                color: '#2563EB',
                position: 'relative',
              }}
            >
              Tutorial
            </span>
          </div>

          {/* Tagline: "Learn • Track • Grow" */}
          <div
            style={{
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#64748B',
              opacity: Math.min(s5 * 1.5, 1),
            }}
          >
            <span>Learn</span>
            <span style={{ color: '#2563EB', fontSize: '16px' }}>•</span>
            <span>Track</span>
            <span style={{ color: '#F59E0B', fontSize: '16px' }}>•</span>
            <span>Grow</span>
          </div>

          {/* Shimmer light sweep bar */}
          {s5 > 0.4 && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '-30%',
                width: '160%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)',
                animation: 'logoShimmer 1.2s ease-in-out',
                pointerEvents: 'none',
              }}
            />
          )}
        </div>

        {/* ── 5-Second Modern Progress Bar ── */}
        <div
          style={{
            position: 'absolute',
            bottom: '-28px',
            width: '180px',
            height: '3px',
            borderRadius: '999px',
            background: '#F1F5F9',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${(elapsed / 5000) * 100}%`,
              background: 'linear-gradient(90deg, #2563EB, #F59E0B)',
              borderRadius: '999px',
              transition: 'width 0.05s linear',
            }}
          />
        </div>
      </div>

      {/* ── Keyframes for Smooth Motion ── */}
      <style>{`
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-12px) scale(1.2); }
        }
        @keyframes logoShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
