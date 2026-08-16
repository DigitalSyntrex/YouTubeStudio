import React, { useState, useEffect, useMemo } from "react";
import { Episode, PlaythroughSeries } from "../types";
import {
  Skull,
  Crosshair,
  MapPin,
  Clock,
  Sparkles,
  ShieldAlert,
  Swords,
  CheckCircle2,
  Tv,
  Radio,
  Flame,
  Trophy,
  AlertTriangle,
} from "lucide-react";

export interface ObsOverlayProps {
  series?: PlaythroughSeries;
  episodes: Episode[];
  currentEpisodeId?: number;
}

export const ObsBrowserOverlay: React.FC<ObsOverlayProps> = ({
  series,
  episodes,
  currentEpisodeId,
}) => {
  // Parse URL parameters for OBS browser source customization
  const searchParams = useMemo(() => new URLSearchParams(window.location.search), []);

  const widgetType = searchParams.get("type") || "lower_third"; // lower_third, boss_card, objective_tracker, death_counter, stream_bar, compact_pill
  const theme = searchParams.get("theme") || "broadcast"; // broadcast, pixel_gold, crimson_souls, cyber_neon, clean_glass, stealth_mono
  const scale = parseFloat(searchParams.get("scale") || "1");
  const anchor = searchParams.get("anchor") || "bottom_left"; // bottom_left, bottom_right, top_left, top_right, bottom_bar, top_bar
  const autoCycleSecs = parseInt(searchParams.get("autocycle") || "0", 10);
  const epParam = searchParams.get("ep");

  // Determine active episode
  const activeEp = useMemo(() => {
    if (epParam) {
      const epNum = parseInt(epParam, 10);
      const found = episodes.find((e) => e.id === epNum || e.partNumber === epNum);
      if (found) return found;
    }
    if (currentEpisodeId !== undefined) {
      const found = episodes.find((e) => e.id === currentEpisodeId);
      if (found) return found;
    }
    return episodes[0];
  }, [episodes, epParam, currentEpisodeId]);

  // Series identifier for local keys
  const seriesId = series?.id || "default_series";

  // Live state syncing across tabs via BroadcastChannel & storage events
  const [currentEp, setCurrentEp] = useState<Episode>(activeEp);
  const [deathCount, setDeathCount] = useState<number>(() => {
    const saved = localStorage.getItem(`obs_deaths_${seriesId}`);
    return saved ? parseInt(saved, 10) : 0;
  });
  const [bossAttempt, setBossAttempt] = useState<number>(() => {
    const saved = localStorage.getItem(`obs_boss_attempt_${seriesId}`);
    return saved ? parseInt(saved, 10) : 1;
  });
  const [completedEvents, setCompletedEvents] = useState<Record<number, boolean>>({});
  const [victoryFlash, setVictoryFlash] = useState<boolean>(false);
  const [cycleIndex, setCycleIndex] = useState<number>(0);
  const [elapsedSecs, setElapsedSecs] = useState<number>(0);
  const [isTimerRunning] = useState<boolean>(true);

  // Sync when activeEp changes
  useEffect(() => {
    if (activeEp) setCurrentEp(activeEp);
  }, [activeEp]);

  // Listen to BroadcastChannel for real-time OBS sync from main app
  useEffect(() => {
    const channel = new BroadcastChannel("obs_letsplay_sync");
    channel.onmessage = (event) => {
      const data = event.data;
      if (!data) return;

      if (data.type === "EPISODE_CHANGE" && data.episode) {
        setCurrentEp(data.episode);
      } else if (data.type === "DEATH_UPDATE" && typeof data.deaths === "number") {
        setDeathCount(data.deaths);
      } else if (data.type === "BOSS_ATTEMPT_UPDATE" && typeof data.attempt === "number") {
        setBossAttempt(data.attempt);
      } else if (data.type === "MILESTONE_TOGGLE") {
        setCompletedEvents((prev) => ({ ...prev, [data.index]: data.completed }));
      } else if (data.type === "TRIGGER_VICTORY") {
        setVictoryFlash(true);
        setTimeout(() => setVictoryFlash(false), 5000);
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  // Listen to localStorage changes across browser tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === `obs_deaths_${seriesId}` && e.newValue !== null) {
        setDeathCount(parseInt(e.newValue, 10));
      }
      if (e.key === `obs_boss_attempt_${seriesId}` && e.newValue !== null) {
        setBossAttempt(parseInt(e.newValue, 10));
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [seriesId]);

  // Auto-cycle timer
  useEffect(() => {
    if (!autoCycleSecs || autoCycleSecs <= 0) return;
    const interval = setInterval(() => {
      setCycleIndex((prev) => (prev + 1) % 3);
    }, autoCycleSecs * 1000);
    return () => clearInterval(interval);
  }, [autoCycleSecs]);

  // Session stopwatch
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setElapsedSecs((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Timer format (HH:MM:SS)
  const formattedTime = useMemo(() => {
    const hrs = Math.floor(elapsedSecs / 3600);
    const mins = Math.floor((elapsedSecs % 3600) / 60);
    const secs = elapsedSecs % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    if (hrs > 0) return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    return `${pad(mins)}:${pad(secs)}`;
  }, [elapsedSecs]);

  // Theme styling mapper
  const themeStyles = useMemo(() => {
    switch (theme) {
      case "pixel_gold":
        return {
          wrapper: "border-2 border-amber-400/80 bg-gradient-to-r from-[#1a1408]/95 via-[#0e0c06]/95 to-[#1a1408]/95 shadow-[0_0_25px_rgba(245,158,11,0.35)]",
          accentText: "text-amber-400",
          accentBadge: "bg-amber-500/20 text-amber-300 border border-amber-400/50",
          glow: "shadow-amber-500/20",
          highlight: "text-yellow-300",
          subtext: "text-amber-200/80",
          fontFamily: "font-mono",
        };
      case "crimson_souls":
        return {
          wrapper: "border border-red-600/70 bg-gradient-to-r from-[#180505]/95 via-[#0c0303]/95 to-[#180505]/95 shadow-[0_0_30px_rgba(220,38,38,0.4)]",
          accentText: "text-red-400",
          accentBadge: "bg-red-950/80 text-red-300 border border-red-600/60",
          glow: "shadow-red-600/30",
          highlight: "text-rose-300",
          subtext: "text-zinc-300",
          fontFamily: "font-serif",
        };
      case "cyber_neon":
        return {
          wrapper: "border border-fuchsia-500/70 bg-gradient-to-r from-[#160628]/95 via-[#0d041a]/95 to-[#160628]/95 shadow-[0_0_30px_rgba(217,70,239,0.35)]",
          accentText: "text-fuchsia-400",
          accentBadge: "bg-fuchsia-950/60 text-fuchsia-300 border border-fuchsia-500/50",
          glow: "shadow-fuchsia-500/30",
          highlight: "text-cyan-300",
          subtext: "text-fuchsia-200/80",
          fontFamily: "font-sans",
        };
      case "clean_glass":
        return {
          wrapper: "border border-white/15 bg-black/80 backdrop-blur-xl shadow-2xl",
          accentText: "text-zinc-100",
          accentBadge: "bg-white/10 text-white border border-white/20",
          glow: "shadow-white/10",
          highlight: "text-white",
          subtext: "text-zinc-400",
          fontFamily: "font-sans",
        };
      case "stealth_mono":
        return {
          wrapper: "border-2 border-white bg-black/95 shadow-2xl",
          accentText: "text-white",
          accentBadge: "bg-white text-black font-black",
          glow: "shadow-none",
          highlight: "text-white",
          subtext: "text-zinc-300",
          fontFamily: "font-mono",
        };
      case "broadcast":
      default:
        return {
          wrapper: "border border-cyan-500/40 bg-gradient-to-r from-[#091524]/95 via-[#070e1a]/95 to-[#091524]/95 shadow-[0_0_25px_rgba(6,182,212,0.25)]",
          accentText: "text-cyan-400",
          accentBadge: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40",
          glow: "shadow-cyan-500/20",
          highlight: "text-cyan-200",
          subtext: "text-zinc-300",
          fontFamily: "font-sans",
        };
    }
  }, [theme]);

  // Positioning container class
  const positionClass = useMemo(() => {
    switch (anchor) {
      case "bottom_right":
        return "justify-end items-end p-8";
      case "top_left":
        return "justify-start items-start p-8";
      case "top_right":
        return "justify-end items-start p-8";
      case "top_bar":
        return "justify-center items-start p-0";
      case "bottom_bar":
        return "justify-center items-end p-0";
      case "center":
        return "justify-center items-center p-8";
      case "bottom_left":
      default:
        return "justify-start items-end p-8";
    }
  }, [anchor]);

  const bossStrategy = currentEp?.bossStrategies?.[0];

  return (
    <div
      className={`fixed inset-0 w-screen h-screen pointer-events-none flex ${positionClass} bg-transparent select-none overflow-hidden`}
      style={{ transform: `scale(${scale})`, transformOrigin: anchor.replace("_", " ") }}
    >
      {/* VICTORY CELEBRATION FLASH OVERLAY */}
      {victoryFlash && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 animate-in fade-in zoom-in duration-300">
          <div className="bg-gradient-to-r from-amber-600/90 via-yellow-500/90 to-amber-600/90 border-y-4 border-yellow-300 py-6 px-16 shadow-[0_0_60px_rgba(234,179,8,0.8)] text-center transform -rotate-1">
            <div className="flex items-center justify-center gap-3 text-zinc-950 font-black text-2xl tracking-widest uppercase animate-bounce">
              <Trophy className="w-8 h-8" />
              <span>BOSS SLAIN & TARGET CLEARED!</span>
              <Trophy className="w-8 h-8" />
            </div>
            <p className="text-zinc-900 font-bold text-sm tracking-wide mt-1">
              Objective Accomplished • Episode #{currentEp?.partNumber}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. BROADCAST LOWER-THIRD BANNER WIDGET */}
      {/* ========================================================= */}
      {widgetType === "lower_third" && (
        <div
          className={`pointer-events-auto max-w-2xl w-full rounded-2xl p-4 sm:p-5 ${themeStyles.wrapper} ${themeStyles.fontFamily} transition-all duration-300`}
        >
          {/* Header Row: Game Title, Part Badge, Live REC Indicator */}
          <div className="flex items-center justify-between gap-3 mb-2.5 pb-2.5 border-b border-white/10">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-wider ${themeStyles.accentBadge}`}>
                PART #{String(currentEp?.partNumber || 1).padStart(2, "0")}
              </span>
              <h2 className="text-sm sm:text-base font-black text-white tracking-wide truncate max-w-xs sm:max-w-md">
                {series?.gameTitle || "Playthrough Series"}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-600/20 border border-red-500/40 text-[11px] font-mono font-bold text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span>REC</span>
                <span className="text-zinc-300 ml-1">{formattedTime}</span>
              </div>
            </div>
          </div>

          {/* Body Content */}
          {cycleIndex === 0 && (
            <div className="space-y-1.5 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <span className={`${themeStyles.accentText} uppercase text-[10px] tracking-wider px-1.5 py-0.5 rounded bg-white/5`}>
                  EPISODE {currentEp?.partNumber}
                </span>
                <span className="truncate">{currentEp?.title}</span>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-zinc-300">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <strong className="text-white">{currentEp?.world}</strong>
                </span>
                {currentEp?.endPoint && (
                  <span className="flex items-center gap-1 truncate">
                    <span className="text-zinc-400">Next Target:</span>
                    <strong className={themeStyles.highlight}>{currentEp.endPoint}</strong>
                  </span>
                )}
              </div>
            </div>
          )}

          {cycleIndex === 1 && currentEp?.keyEvents && currentEp.keyEvents.length > 0 && (
            <div className="space-y-1.5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between text-[11px]">
                <span className={`font-bold ${themeStyles.accentText} uppercase flex items-center gap-1`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Episode Objectives & Milestones</span>
                </span>
                <span className="text-[10px] text-zinc-400">{currentEp.world}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {currentEp.keyEvents.slice(0, 2).map((evt, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-md bg-white/5 border border-white/5 truncate ${
                      completedEvents[idx] ? "line-through text-zinc-500 opacity-60" : "text-zinc-200"
                    }`}
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 shrink-0 ${completedEvents[idx] ? "text-emerald-400" : "text-zinc-500"}`}
                    />
                    <span className="truncate">{evt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {cycleIndex === 2 && bossStrategy && (
            <div className="space-y-1.5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-red-400 uppercase flex items-center gap-1">
                  <Swords className="w-3.5 h-3.5 text-red-400" />
                  <span>Encounter Tactics</span>
                </span>
                <span className="text-[10px] text-amber-300 font-mono">Attempt #{bossAttempt}</span>
              </div>
              <div className="text-xs bg-red-950/30 border border-red-500/20 rounded-md p-2 text-zinc-300 leading-relaxed truncate">
                {bossStrategy}
              </div>
            </div>
          )}

          {/* Bottom Micro Ticker */}
          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-mono text-rose-400 font-bold">
                <Skull className="w-3 h-3 text-rose-500" />
                <span>Deaths: {deathCount}</span>
              </span>
              <span className="flex items-center gap-1 font-mono text-amber-300 font-bold">
                <Crosshair className="w-3 h-3 text-amber-400" />
                <span>Attempt #{bossAttempt}</span>
              </span>
            </div>
            <span className="font-mono text-zinc-400">
              {series?.subtitle || "Let's Play"} • ~{currentEp?.estDurationMinutes || 90}m
            </span>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. ACTIVE BOSS FIGHT & TACTICS WIDGET */}
      {/* ========================================================= */}
      {widgetType === "boss_card" && (
        <div
          className={`pointer-events-auto max-w-sm w-full rounded-2xl p-4 sm:p-5 ${themeStyles.wrapper} ${themeStyles.fontFamily} space-y-3 shadow-2xl`}
        >
          <div className="flex items-center justify-between border-b border-red-500/30 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center">
                <Flame className="w-4 h-4 text-red-400 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-red-400">Boss Tactics</span>
                <h3 className="text-sm font-black text-white truncate max-w-[180px]">
                  {currentEp?.shortTitle || "Boss Encounter"}
                </h3>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-red-500/20 text-red-300 border border-red-500/40">
              ATTEMPT #{bossAttempt}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {bossStrategy ? (
              <div className="text-[11px] text-zinc-300 leading-relaxed bg-black/40 rounded-lg p-2.5 border border-white/5">
                <strong className="text-cyan-300 font-bold">Strategy: </strong>
                {bossStrategy}
              </div>
            ) : (
              <div className="text-xs text-zinc-400 py-2">
                Encounter: {currentEp?.title}
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-400">
            <span className="font-mono">Deaths this Run: <strong className="text-rose-400 font-bold">{deathCount}</strong></span>
            <span className="font-mono text-zinc-500">Part #{currentEp?.partNumber}</span>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. DEATH & RETRY TALLY COUNTER */}
      {/* ========================================================= */}
      {widgetType === "death_counter" && (
        <div
          className={`pointer-events-auto rounded-2xl p-4 sm:p-5 ${themeStyles.wrapper} ${themeStyles.fontFamily} shadow-2xl flex items-center gap-4`}
        >
          <div className="w-12 h-12 rounded-xl bg-rose-600/20 border border-rose-500/50 flex items-center justify-center shrink-0">
            <Skull className="w-6 h-6 text-rose-500 animate-pulse" />
          </div>

          <div className="space-y-0.5">
            <div className="text-[10px] font-black uppercase tracking-wider text-rose-400">
              Deaths & Tally
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-mono font-black text-white">
                {deathCount}
              </span>
              <span className="text-xs font-bold text-zinc-400 uppercase">Deaths</span>
            </div>
            <div className="text-[10px] font-mono text-amber-300 font-bold">
              Boss Attempt #{bossAttempt} • Ep #{currentEp?.partNumber}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. QUEST & OBJECTIVES CORNER TRACKER */}
      {/* ========================================================= */}
      {widgetType === "objective_tracker" && (
        <div
          className={`pointer-events-auto max-w-sm w-full rounded-2xl p-4 sm:p-5 ${themeStyles.wrapper} ${themeStyles.fontFamily} space-y-3 shadow-2xl`}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                Episode #{currentEp?.partNumber} Objectives
              </h3>
            </div>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${themeStyles.accentBadge}`}>
              {currentEp?.world}
            </span>
          </div>

          <div className="space-y-1.5">
            {currentEp?.keyEvents && currentEp.keyEvents.length > 0 ? (
              currentEp.keyEvents.map((evt, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 text-xs p-2 rounded-lg border transition-all ${
                    completedEvents[idx]
                      ? "bg-emerald-950/30 border-emerald-500/30 text-zinc-400 line-through"
                      : "bg-white/5 border-white/5 text-zinc-200"
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      completedEvents[idx] ? "text-emerald-400" : "text-zinc-500"
                    }`}
                  />
                  <span className="leading-snug">{evt}</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-zinc-400 py-2">No key milestones listed.</div>
            )}
          </div>

          {currentEp?.endPoint && (
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
              <span className="text-zinc-400">Target Finish:</span>
              <strong className={themeStyles.highlight}>{currentEp.endPoint}</strong>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. TOP BROADCAST STREAM BAR */}
      {/* ========================================================= */}
      {widgetType === "stream_bar" && (
        <div
          className={`pointer-events-auto w-full px-6 py-2.5 ${themeStyles.wrapper} ${themeStyles.fontFamily} flex items-center justify-between gap-4 border-x-0 border-t-0 rounded-none shadow-xl`}
        >
          <div className="flex items-center gap-3">
            <span className={`px-2 py-0.5 rounded text-xs font-black uppercase ${themeStyles.accentBadge}`}>
              PART #{currentEp?.partNumber}
            </span>
            <span className="text-sm font-black text-white truncate max-w-sm sm:max-w-md">
              {series?.gameTitle || "Let's Play"}
            </span>
            <span className="text-xs text-zinc-400 hidden md:inline">|</span>
            <span className="text-xs text-zinc-300 hidden md:inline truncate">{currentEp?.title}</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-amber-300 font-bold">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentEp?.world}</span>
            </span>

            <span className="flex items-center gap-1 font-mono text-rose-400 font-bold">
              <Skull className="w-3.5 h-3.5 text-rose-500" />
              <span>Deaths: {deathCount}</span>
            </span>

            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-600/20 border border-red-500/40 text-red-400 font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              <span>{formattedTime}</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. COMPACT FLOATING PILL */}
      {/* ========================================================= */}
      {widgetType === "compact_pill" && (
        <div
          className={`pointer-events-auto rounded-full px-4 py-2 ${themeStyles.wrapper} ${themeStyles.fontFamily} shadow-2xl flex items-center gap-3`}
        >
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${themeStyles.accentBadge}`}>
            #{currentEp?.partNumber}
          </span>
          <span className="text-xs font-bold text-white truncate max-w-[160px]">
            {currentEp?.shortTitle || currentEp?.title}
          </span>
          <span className="text-[10px] font-mono text-zinc-300 bg-white/10 px-2 py-0.5 rounded-full">
            {formattedTime}
          </span>
        </div>
      )}
    </div>
  );
};
