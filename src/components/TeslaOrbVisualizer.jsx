import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Plasma Tesla Lightning Orb Visualizer
 * Layered SVG paths with dynamic electric arcs, central incandescent core,
 * ambient shockwave pulses, and state-reactive jitter animations.
 */
export default function TeslaOrbVisualizer({ voiceState = 'idle' }) {
  // Energy level determines jitter frequency and lightning intensity
  const stateConfig = {
    idle: {
      intensity: 1,
      coreScale: [1, 1.08, 0.98, 1.04, 1],
      coreColor: 'rgba(56, 189, 248, 0.4)',
      branchColor: '#38bdf8',
      pulseDuration: 4.5,
      jitterAmount: 1.5,
      arcCount: 6,
    },
    listening: {
      intensity: 1.6,
      coreScale: [1.05, 1.2, 1.02, 1.15, 1.05],
      coreColor: 'rgba(0, 240, 255, 0.6)',
      branchColor: '#00f0ff',
      pulseDuration: 2.2,
      jitterAmount: 2.8,
      arcCount: 8,
    },
    speaking: {
      intensity: 2.5,
      coreScale: [1.1, 1.35, 1.05, 1.4, 1.1],
      coreColor: 'rgba(168, 85, 247, 0.7)',
      branchColor: '#c084fc',
      pulseDuration: 0.9,
      jitterAmount: 5.5,
      arcCount: 12,
    },
  };

  const current = stateConfig[voiceState] || stateConfig.idle;
  const [frameTick, setFrameTick] = useState(0);

  // Dynamic lightning arc micro-variation tick
  useEffect(() => {
    const interval = setInterval(() => {
      setFrameTick(t => (t + 1) % 1000);
    }, voiceState === 'speaking' ? 80 : voiceState === 'listening' ? 140 : 220);
    return () => clearInterval(interval);
  }, [voiceState]);

  // Procedural jagged lightning bolt generator from center (150, 150)
  const generateLightningPaths = () => {
    const cx = 150;
    const cy = 150;
    const arcs = [];
    const count = voiceState === 'speaking' ? 10 : voiceState === 'listening' ? 8 : 6;
    const angleStep = (Math.PI * 2) / count;

    for (let i = 0; i < count; i++) {
      const baseAngle = i * angleStep + (Math.sin(frameTick * 0.3 + i) * 0.25);
      const targetDist = 70 + ((frameTick * 7 + i * 23) % 40);
      let px = cx;
      let py = cy;
      let d = `M ${px} ${py}`;
      const segments = 5;

      for (let s = 1; s <= segments; s++) {
        const segDist = (targetDist / segments) * s;
        const jitterAngle = baseAngle + ((Math.sin(frameTick * 1.5 + i * 5 + s) * 0.45));
        const nx = cx + Math.cos(jitterAngle) * segDist + (Math.cos(s * 11 + frameTick) * (current.jitterAmount * 1.8));
        const ny = cy + Math.sin(jitterAngle) * segDist + (Math.sin(s * 13 + frameTick) * (current.jitterAmount * 1.8));
        d += ` L ${nx.toFixed(1)} ${ny.toFixed(1)}`;
        px = nx;
        py = ny;
      }
      arcs.push({ id: `arc-${i}`, d });
    }
    return arcs;
  };

  const arcs = generateLightningPaths();

  return (
    <div className="relative w-full aspect-square max-w-[340px] mx-auto flex items-center justify-center select-none">
      {/* Deep atmospheric ambient glow */}
      <motion.div
        animate={{
          scale: current.coreScale,
          opacity: [0.35, 0.65, 0.35],
        }}
        transition={{
          duration: current.pulseDuration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-4 rounded-full bg-gradient-to-br from-cyan-500/20 via-purple-600/25 to-blue-600/10 blur-3xl"
      />

      {/* Outer containment perimeter ring with ticks */}
      <div className="absolute inset-0 rounded-full border border-cyan-500/20 p-2 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="w-full h-full rounded-full border border-dashed border-cyan-400/30 relative"
        >
          {/* North, South, East, West calibration notches */}
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-1 bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-1 bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
          <span className="absolute top-1/2 -left-1 -translate-y-1/2 w-1 h-2 bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
          <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-1 h-2 bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
        </motion.div>
      </div>

      {/* Inner glass containment orb */}
      <div className="absolute inset-4 rounded-full bg-slate-950/70 backdrop-blur-md border border-slate-700/60 shadow-[inset_0_0_40px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Subtle holographic scanline across orb */}
        <motion.div
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent pointer-events-none"
        />

        {/* Concentric listening sonar waves (active in listening or speaking) */}
        {voiceState !== 'idle' && (
          <>
            <motion.div
              animate={{ scale: [0.3, 1.1], opacity: [0.8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 m-auto w-44 h-44 rounded-full border border-cyan-400/40 pointer-events-none"
            />
            <motion.div
              animate={{ scale: [0.3, 1.1], opacity: [0.8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 0.6, ease: 'easeOut' }}
              className="absolute inset-0 m-auto w-44 h-44 rounded-full border border-purple-400/40 pointer-events-none"
            />
          </>
        )}

        {/* Layered SVG Plasma Tesla Discharge */}
        <svg
          viewBox="0 0 300 300"
          className="w-full h-full relative z-10 filter drop-shadow-[0_0_12px_rgba(0,240,255,0.7)]"
        >
          <defs>
            {/* Plasma Glow Filter */}
            <filter id="plasmaGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur2" />
              <feMerge>
                <feMergeNode in="blur1" />
                <feMergeNode in="blur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Core Radial Gradient */}
            <radialGradient id="plasmaCoreGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="25%" stopColor="#e0f2fe" stopOpacity="1" />
              <stop offset="55%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="80%" stopColor="#818cf8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </radialGradient>

            {/* Outer Corona Gradient */}
            <radialGradient id="coronaGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#00f0ff" stopOpacity="0.6" />
              <stop offset="75%" stopColor="#7c3aed" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Electric Discharge Layer (Diffuse Violet Glow) */}
          <g filter="url(#plasmaGlow)" opacity="0.65">
            {arcs.map(arc => (
              <path
                key={`glow-${arc.id}`}
                d={arc.d}
                fill="none"
                stroke={voiceState === 'speaking' ? '#c084fc' : '#38bdf8'}
                strokeWidth={voiceState === 'speaking' ? "5" : "3.5"}
                strokeLinecap="round"
                strokeLinejoin="bevel"
              />
            ))}
          </g>

          {/* Middle Electric Cyan Filament Layer */}
          <g filter="url(#plasmaGlow)">
            {arcs.map(arc => (
              <path
                key={`cyan-${arc.id}`}
                d={arc.d}
                fill="none"
                stroke="#00f0ff"
                strokeWidth={voiceState === 'speaking' ? "2.6" : "2"}
                strokeLinecap="round"
                strokeLinejoin="bevel"
              />
            ))}
          </g>

          {/* Hot White-Hot Center Filament Layer */}
          <g>
            {arcs.map(arc => (
              <path
                key={`white-${arc.id}`}
                d={arc.d}
                fill="none"
                stroke="#ffffff"
                strokeWidth={voiceState === 'speaking' ? "1.4" : "1.1"}
                strokeLinecap="round"
                strokeLinejoin="bevel"
                opacity="0.95"
              />
            ))}
          </g>

          {/* Secondary micro-sparks on Speaking state */}
          {voiceState === 'speaking' && (
            <g opacity="0.85">
              {[...Array(6)].map((_, idx) => {
                const angle = (idx * Math.PI) / 3 + frameTick * 0.2;
                const r1 = 35 + (idx * 7) % 25;
                const r2 = r1 + 18;
                return (
                  <line
                    key={`spark-${idx}`}
                    x1={150 + Math.cos(angle) * r1}
                    y1={150 + Math.sin(angle) * r1}
                    x2={150 + Math.cos(angle + 0.1) * r2}
                    y2={150 + Math.sin(angle + 0.1) * r2}
                    stroke="#ffffff"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
          )}

          {/* Central Pulsing Energy Core */}
          <circle
            cx="150"
            cy="150"
            r={voiceState === 'speaking' ? "24" : voiceState === 'listening' ? "20" : "17"}
            fill="url(#plasmaCoreGrad)"
            filter="url(#plasmaGlow)"
          />

          {/* Incandescent white center point */}
          <circle
            cx="150"
            cy="150"
            r={voiceState === 'speaking' ? "9" : "7"}
            fill="#ffffff"
            className="filter drop-shadow-[0_0_15px_#ffffff]"
          />
        </svg>
      </div>

      {/* Orbiting energy sparks / satellites */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute inset-8 pointer-events-none"
      >
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#00f0ff]" />
        <span className="absolute bottom-4 right-1/4 w-1 h-1 rounded-full bg-purple-300 shadow-[0_0_8px_#c084fc]" />
      </motion.div>
    </div>
  );
}
