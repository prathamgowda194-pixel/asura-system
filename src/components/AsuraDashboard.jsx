import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Cpu,
  Shield,
  Radio,
  Server,
  Terminal,
  Zap,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Share2,
  Settings,
  Search,
  Volume2,
  VolumeX,
  Bell,
  CheckCircle2,
  Play,
  RotateCw,
  Layers,
  Flame,
  Globe,
  DollarSign,
  TrendingUp,
  X,
  Sliders,
  Database
} from 'lucide-react';
import TeslaOrbVisualizer from './TeslaOrbVisualizer';

/**
 * ASURA Command & Control Dashboard
 * Production-ready Glassmorphism Cybernetic Interface
 */
export default function AsuraDashboard({ onTriggerPipeline }) {
  // Active state for voice core: 'idle' | 'listening' | 'speaking'
  const [voiceState, setVoiceState] = useState('idle');
  const [activeNav, setActiveNav] = useState('Overview');
  const [revenueFilter, setRevenueFilter] = useState('Global');
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(true);

  // Dynamic live clock ticker for uptime
  const [uptimeSeconds, setUptimeSeconds] = useState(339); // 05:39:1 base
  const [synapseFreq, setSynapseFreq] = useState(354);

  useEffect(() => {
    const timer = setInterval(() => {
      setUptimeSeconds(s => s + 1);
      // Subtle pulse variance in synapse frequency
      if (Math.random() > 0.6) {
        setSynapseFreq(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (totalSec) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    const subSec = Math.floor((totalSec % 10) / 3);
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    return `${hours > 0 ? `${hours}:` : ''}${mm}:${ss}:${subSec}`;
  };

  const handleRunPipeline = () => {
    setPipelineRunning(true);
    if (onTriggerPipeline) {
      onTriggerPipeline('Asura-Engineer');
    }
    setTimeout(() => {
      setPipelineRunning(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden relative">
      {/* Background Ambient Radial Lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[25%] w-[600px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] right-[10%] w-[500px] h-[600px] bg-purple-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[5%] w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[130px]" />
        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* TOP HEADER STATUS BAR */}
      <header className="relative z-30 h-14 border-b border-cyan-500/15 bg-slate-950/70 backdrop-blur-xl px-4 lg:px-6 flex items-center justify-between">
        {/* Left Side: Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600/40 via-cyan-400 to-purple-600 flex items-center justify-center shadow-[0_0_12px_rgba(0,240,255,0.4)] border border-cyan-300/40">
            <Zap className="w-4 h-4 text-white fill-cyan-200" />
          </div>
          <div className="flex flex-col">
            <span className="font-cyber font-black tracking-widest text-white text-base leading-none glow-text-cyan">
              ASURA
            </span>
            <span className="text-[9px] font-mono tracking-widest text-cyan-400/80 leading-tight mt-0.5">
              COMMAND & CONTROL
            </span>
          </div>
        </div>

        {/* Center: Engine & Latency telemetry pill */}
        <div className="hidden md:flex items-center space-x-4 bg-slate-900/80 border border-slate-700/60 px-3.5 py-1.5 rounded-full shadow-inner">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f0ff]" />
            <span className="text-xs font-mono tracking-wider text-slate-300">
              VIRTUAL ENGINE-1
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-xs font-mono text-cyan-400">
            LATENCY: <span className="text-emerald-400 font-semibold">11ms</span>
          </div>
        </div>

        {/* Right Side: Tools & User Administrator Avatar */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 bg-slate-900/60 border border-slate-800 rounded-lg p-1">
            <button 
              title="Search System"
              className="p-1.5 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition"
            >
              <Search className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsAudioMuted(!isAudioMuted)} 
              title="Toggle Audio Feedback"
              className="p-1.5 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition"
            >
              {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button 
              title="System Alerts"
              className="p-1.5 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800/80 transition relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
            </button>
          </div>

          <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-800">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 p-[1.5px]">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Chris Voss"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2338bdf8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>';
                    }}
                  />
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-950 rounded-full" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200 leading-tight">
                Chris Voss
              </span>
              <span className="text-[10px] font-mono text-cyan-400/90 tracking-wider">
                ADMINISTRATOR
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT WRAPPER */}
      <div className="flex-1 flex overflow-hidden relative z-20">
        
        {/* LEFT COMPACT NAVIGATION SIDEBAR */}
        <aside className="w-16 lg:w-48 bg-slate-950/80 backdrop-blur-xl border-r border-cyan-500/10 flex flex-col justify-between py-4 select-none shrink-0">
          <div className="space-y-1 px-2">
            {[
              { id: 'Overview', label: 'Overview', icon: Activity },
              { id: 'Telemetry', label: 'Telemetry Grid', icon: Cpu },
              { id: 'Agents', label: 'Neural Agents', icon: Zap },
              { id: 'Defense', label: 'Defense Matrix', icon: Shield },
              { id: 'Audit', label: 'Audit Stream', icon: Terminal },
              { id: 'NodeConfig', label: 'Node Config', icon: Sliders },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border-l-2 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'group-hover:text-cyan-300'}`} />
                  <span className="hidden lg:inline text-xs font-medium tracking-wide">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom System Status */}
          <div className="px-3 pt-4 border-t border-slate-900 hidden lg:block">
            <div className="flex items-center space-x-2 text-[11px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>SYSTEM: ACTIVE</span>
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-0.5">
              v4.1.0 Cloud Core
            </div>
          </div>
        </aside>

        {/* WORKSPACE CONTENT (SCROLLABLE GRID) */}
        <div className="flex-1 overflow-y-auto p-3 lg:p-5 flex flex-col xl:flex-row gap-5 items-start justify-center max-w-[1680px] mx-auto w-full">
          
          {/* OPERATOR PANEL (AMY WINNER) */}
          <section className="w-full xl:w-72 shrink-0 space-y-4">
            <div className="glass-panel rounded-2xl p-4 border border-cyan-500/15 shadow-xl relative overflow-hidden">
              {/* Subtle card glow */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* User Operator Profile */}
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-800/80">
                <div className="relative">
                  <div className="w-11 h-11 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 to-purple-500">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                      alt="Amy Winner"
                      className="w-full h-full object-cover rounded-full bg-slate-900"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23a855f7"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>';
                      }}
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-100 leading-snug">
                    Amy Winner
                  </h3>
                  <div className="text-[10px] font-mono text-cyan-400 flex items-center space-x-1">
                    <span>ADMIN</span>
                    <span>/</span>
                    <span className="text-purple-300">ORCHESTRATOR</span>
                  </div>
                </div>
              </div>

              {/* CORE OPERATIONS */}
              <div className="mt-4 space-y-2">
                <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
                  CORE OPERATIONS
                </div>
                
                {/* Active Selection: Software Production */}
                <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-cyan-950/50 to-slate-900/90 border border-cyan-500/30 text-cyan-200 shadow-[0_0_15px_rgba(0,240,255,0.08)] group hover:border-cyan-400 transition">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
                    <span className="text-xs font-semibold tracking-wide">
                      Software Production
                    </span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* Secondary Operation: Social Media Hub */}
                <button className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800/80 text-slate-300 hover:text-white transition">
                  <div className="flex items-center space-x-2.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs font-medium">
                      Social Media Hub
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    6x
                  </span>
                </button>

                {/* Third Operation: AI Reseller Templates */}
                <button className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800/80 text-slate-300 hover:text-white transition">
                  <div className="flex items-center space-x-2.5">
                    <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-medium">
                      AI Reseller Templates
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    14
                  </span>
                </button>
              </div>

              {/* ACTIVE RUNS / DEPLOYMENTS */}
              <div className="mt-5 space-y-2.5">
                <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
                  ACTIVE DEPLOYMENTS
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
                    <div className="flex items-center space-x-2 text-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
                      <span className="truncate max-w-[130px]">SaaS Landing Page</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                      LIVE
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
                    <div className="flex items-center space-x-2 text-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff]" />
                      <span className="truncate max-w-[130px]">Play Store Game</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                      TEST
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
                    <div className="flex items-center space-x-2 text-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_#a855f7]" />
                      <span className="truncate max-w-[130px]">Crypto Tracker</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950/60 text-purple-300 border border-purple-500/30">
                      READY
                    </span>
                  </div>
                </div>
              </div>

              {/* RESOURCE TELEMETRY GAUGE */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>NET LOAD: <span className="text-cyan-400">24.1%</span></span>
                  <span>MEM USE: <span className="text-purple-400">38%</span></span>
                </div>
                <div className="h-2 rounded-full bg-slate-950 overflow-hidden flex border border-slate-800">
                  <div className="w-[24.1%] bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_8px_#00f0ff]" />
                  <div className="w-[14%] bg-gradient-to-r from-purple-500 to-pink-500" />
                </div>
              </div>

              {/* FOOTER METADATA */}
              <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <button className="flex items-center space-x-1 hover:text-cyan-300 transition">
                  <Settings className="w-3 h-3" />
                  <span>Settings</span>
                </button>
                <span>v2.4.1 Production</span>
              </div>
            </div>
          </section>

          {/* CENTER DECK: ASURA NEURAL CORE + METRICS + REVENUE */}
          <main className="flex-1 max-w-[760px] w-full space-y-4">
            
            {/* CORE VISUALIZER CARD */}
            <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 shadow-2xl relative overflow-hidden">
              {/* Background gradient lighting behind orb */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Header Title & System Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <div className="text-[10px] font-mono tracking-widest text-cyan-400/90 uppercase font-semibold flex items-center space-x-1.5">
                    <span>DEPLOYMENT HUB</span>
                    <span>/</span>
                    <span className="text-purple-300">NEURAL VOICE CORE</span>
                  </div>
                  {/* Aggressive Cybertech Font Header */}
                  <h1 className="text-2xl sm:text-3xl font-cyber font-black tracking-widest text-white mt-0.5 glow-text-cyan flex items-center space-x-2">
                    <span>ASURA</span>
                  </h1>
                </div>

                {/* 4/4 Systems Operational Badge */}
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
                  <span>4/4 SYSTEMS OPERATIONAL</span>
                </div>
              </div>

              {/* PLASMA TESLA LIGHTNING ORB VISUALIZER */}
              <div className="py-2">
                <TeslaOrbVisualizer voiceState={voiceState} />
              </div>

              {/* Status prompt */}
              <p className="text-center text-xs font-mono text-slate-400 mt-2">
                Asura voice core online &bull; Awaiting neural voice instructions
              </p>

              {/* INTERACTIVE STATE SELECTOR ROW */}
              <div className="mt-4 flex items-center justify-center">
                <div className="inline-flex p-1 rounded-xl bg-slate-950/80 border border-slate-800 shadow-inner">
                  {[
                    { id: 'idle', label: 'Idle' },
                    { id: 'listening', label: 'Listening' },
                    { id: 'speaking', label: 'Speaking' }
                  ].map((state) => {
                    const isActive = voiceState === state.id;
                    return (
                      <button
                        key={state.id}
                        onClick={() => setVoiceState(state.id)}
                        className={`px-5 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all duration-200 relative ${
                          isActive
                            ? 'text-white bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {state.label}
                        {isActive && (
                          <motion.div
                            layoutId="activePill"
                            className="absolute inset-0 rounded-lg bg-cyan-400/10 pointer-events-none"
                            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4 METRIC CARDS (2x2 GRID AS SHOWN IN REFERENCE IMAGE) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* CARD 1: SYNAPSE FREQUENCY */}
              <div className="glass-panel-interactive rounded-2xl p-4 border border-cyan-500/15 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">
                    SYNAPSE FREQUENCY
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline space-x-2">
                  <span className="text-3xl font-cyber font-bold text-white tracking-tight">
                    {synapseFreq}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center">
                    <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                    +12% from last cycle
                  </span>
                </div>
                {/* Accent indicator line */}
                <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
                  <div className="w-[74%] h-full bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-[0_0_8px_#00f0ff]" />
                </div>
              </div>

              {/* CARD 2: VOICE UPTIME */}
              <div className="glass-panel-interactive rounded-2xl p-4 border border-purple-500/15 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">
                    VOICE UPTIME
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline space-x-2">
                  <span className="text-3xl font-cyber font-bold text-white tracking-tight">
                    {formatUptime(uptimeSeconds)}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-purple-300/90 mt-1">
                  99.98% voice availability
                </div>
                {/* Accent indicator line */}
                <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
                  <div className="w-[98%] h-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_8px_#c084fc]" />
                </div>
              </div>

              {/* CARD 3: SECURITY STATUS */}
              <div className="glass-panel-interactive rounded-2xl p-4 border border-violet-500/15 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">
                    SECURITY STATUS
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-violet-950/60 border border-violet-500/30 flex items-center justify-center text-violet-400">
                    <Shield className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline space-x-2">
                  <span className="text-3xl font-cyber font-bold text-white tracking-tight">
                    Level 2
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  Real-time anomalous scan
                </div>
                {/* Accent indicator line */}
                <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
                  <div className="w-[60%] h-full bg-gradient-to-r from-violet-500 to-blue-500 shadow-[0_0_8px_#8b5cf6]" />
                </div>
              </div>

              {/* CARD 4: ACTIVE NODES */}
              <div className="glass-panel-interactive rounded-2xl p-4 border border-cyan-500/15 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">
                    ACTIVE NODES
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Server className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline space-x-2">
                  <span className="text-3xl font-cyber font-bold text-white tracking-tight">
                    7 <span className="text-slate-500 text-xl font-normal">/ 24</span>
                  </span>
                </div>
                <div className="text-[11px] font-mono text-cyan-400/90 mt-1">
                  16/17 automated tasks online
                </div>
                {/* Accent indicator line */}
                <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
                  <div className="w-[45%] h-full bg-gradient-to-r from-cyan-400 to-blue-400 shadow-[0_0_8px_#00f0ff]" />
                </div>
              </div>

            </div>

            {/* REVENUE STREAMS PANEL */}
            <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-cyan-500/15 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-cyan-400" />
                  <h3 className="font-semibold text-sm text-slate-100 tracking-wide">
                    Revenue Streams
                  </h3>
                </div>
                
                {/* Filter Tabs: Global | Social Media | Cloud Services */}
                <div className="flex items-center space-x-1 p-1 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px]">
                  {['Global', 'Social Media', 'Cloud Services'].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setRevenueFilter(filter)}
                      className={`px-2.5 py-1 rounded-md transition ${
                        revenueFilter === filter
                          ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stream Rows */}
              <div className="mt-3 space-y-2.5">
                
                {/* Row 1: YouTube Automation Network */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800/70 transition">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-red-950/50 border border-red-500/30 flex items-center justify-center text-red-400">
                      <Play className="w-4 h-4 fill-red-400/40" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-100">
                        YouTube Automation Network
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        12 monetized autonomous niches
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-xs font-cyber font-bold text-white">
                        $28,420.00
                      </div>
                      <div className="text-[10px] font-mono text-emerald-400">
                        +14.2% MoM
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 hidden sm:inline-block">
                      DEPLOYED/ACTIVE
                    </span>
                  </div>
                </div>

                {/* Row 2: Autonomous SaaS Engine API */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800/70 transition">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-100">
                        Autonomous SaaS Engine API
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        4.2M billing api tokens consumed
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-xs font-cyber font-bold text-white">
                        $24,919.40
                      </div>
                      <div className="text-[10px] font-mono text-cyan-400">
                        +28.7% MoM
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 hidden sm:inline-block">
                      ACTIVE
                    </span>
                  </div>
                </div>

                {/* Row 3: Enterprise Contract: Apex Labs */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800/70 transition">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-950/50 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-100">
                        Enterprise Contract: Apex Labs
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        Annual autonomous ops SLA tier
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-xs font-cyber font-bold text-white">
                        $15,000.00
                      </div>
                      <div className="text-[10px] font-mono text-purple-300">
                        Flat Retainer
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950/60 text-purple-300 border border-purple-500/30 hidden sm:inline-block">
                      PAID
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </main>

          {/* RIGHT PANEL: LIVE AGENT ACTIVITY */}
          <AnimatePresence>
            {showRightPanel && (
              <motion.aside
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full xl:w-80 shrink-0 space-y-4"
              >
                <div className="glass-panel rounded-2xl p-4 border border-cyan-500/15 shadow-xl relative">
                  
                  {/* Panel Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f0ff]" />
                      <h3 className="font-semibold text-xs tracking-wider uppercase text-slate-100 font-mono">
                        Live Agent Activity
                      </h3>
                    </div>
                    <button 
                      onClick={() => setShowRightPanel(false)}
                      className="text-slate-500 hover:text-slate-300 p-1 rounded transition"
                      title="Hide Panel"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Agent Feed Cards */}
                  <div className="mt-3 space-y-3">
                    
                    {/* Feed 1: Asura-Engineer */}
                    <div className="p-3 rounded-xl bg-slate-900/50 border border-cyan-500/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 text-xs font-semibold text-cyan-300">
                          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Asura-Engineer</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">1m ago</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Successfully deployed core infrastructure to Vercel.
                      </p>
                      <div className="pt-1">
                        <button
                          onClick={handleRunPipeline}
                          disabled={pipelineRunning}
                          className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(0,240,255,0.15)] transition disabled:opacity-50"
                        >
                          <RotateCw className={`w-3 h-3 ${pipelineRunning ? 'animate-spin text-cyan-400' : ''}`} />
                          <span>{pipelineRunning ? 'Deploying...' : 'Run Pipeline'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Feed 2: Synth-Analyst */}
                    <div className="p-3 rounded-xl bg-slate-900/30 border border-slate-800/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 text-xs font-semibold text-purple-300">
                          <Activity className="w-3.5 h-3.5 text-purple-400" />
                          <span>Synth-Analyst</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">4m ago</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Synchronized revenue streams across Stripe and Solana endpoints.
                      </p>
                    </div>

                    {/* Feed 3: Neural-Guard */}
                    <div className="p-3 rounded-xl bg-slate-900/30 border border-slate-800/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 text-xs font-semibold text-rose-300">
                          <Shield className="w-3.5 h-3.5 text-rose-400" />
                          <span>Neural-Guard</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">11m ago</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Terminated suspicious connection attempt on validator 4 peering port.
                      </p>
                    </div>

                    {/* Feed 4: Dispatcher-AI */}
                    <div className="p-3 rounded-xl bg-slate-900/30 border border-slate-800/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-300">
                          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Dispatcher-AI</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">24m ago</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Allocated new cloud worker backups to agent pool.
                      </p>
                    </div>

                  </div>

                  {/* BOTTOM CLUSTER METRICS LED GAUGE */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-slate-400">CLUSTER SYSTEM LOAD</span>
                      <span className="text-cyan-400 font-semibold">32.4%</span>
                    </div>
                    {/* Segmented LED Cyan block meter */}
                    <div className="grid grid-cols-10 gap-1">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 rounded-sm transition-colors duration-300 ${
                            i < 3
                              ? 'bg-cyan-400 shadow-[0_0_8px_#00f0ff]'
                              : i === 3
                              ? 'bg-cyan-600'
                              : 'bg-slate-800/80'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                </div>
              </motion.aside>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
