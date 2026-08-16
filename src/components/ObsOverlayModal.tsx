import React, { useState, useMemo } from "react";
import { Episode, PlaythroughSeries } from "../types";
import {
  Tv,
  Radio,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Swords,
  Skull,
  Crosshair,
  Sliders,
  Layers,
  Monitor,
  CheckCircle2,
  Trophy,
  X,
  Play,
  RotateCcw,
  Palette,
  Eye,
  Info,
} from "lucide-react";

interface ObsOverlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  series?: PlaythroughSeries;
  episodes: Episode[];
  selectedEpisode?: Episode | null;
  onUpdateEpisode?: (ep: Episode) => void;
}

export const ObsOverlayModal: React.FC<ObsOverlayModalProps> = ({
  isOpen,
  onClose,
  series,
  episodes,
  selectedEpisode,
}) => {
  if (!isOpen) return null;

  const [activeEpId, setActiveEpId] = useState<number>(
    selectedEpisode?.id || episodes[0]?.id || 1
  );
  const [selectedWidget, setSelectedWidget] = useState<
    "lower_third" | "boss_card" | "objective_tracker" | "death_counter" | "stream_bar" | "compact_pill"
  >("lower_third");
  const [selectedTheme, setSelectedTheme] = useState<
    "broadcast" | "pixel_gold" | "crimson_souls" | "cyber_neon" | "clean_glass" | "stealth_mono"
  >("broadcast");
  const [selectedAnchor, setSelectedAnchor] = useState<
    "bottom_left" | "bottom_right" | "top_left" | "top_right" | "bottom_bar" | "top_bar"
  >("bottom_left");
  const [scale, setScale] = useState<number>(1);
  const [autoCycleSecs, setAutoCycleSecs] = useState<number>(15);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  const seriesId = series?.id || "default_series";

  // Live Death & Boss Attempt state
  const [deaths, setDeaths] = useState<number>(() => {
    const val = localStorage.getItem(`obs_deaths_${seriesId}`);
    return val ? parseInt(val, 10) : 0;
  });
  const [bossAttempt, setBossAttempt] = useState<number>(() => {
    const val = localStorage.getItem(`obs_boss_attempt_${seriesId}`);
    return val ? parseInt(val, 10) : 1;
  });

  // Simulated backdrop for live preview
  const [previewBackdrop, setPreviewBackdrop] = useState<
    "dark_grid" | "checkerboard" | "green_screen"
  >("dark_grid");

  const currentEp = useMemo(() => {
    return episodes.find((e) => e.id === activeEpId) || selectedEpisode || episodes[0];
  }, [episodes, activeEpId, selectedEpisode]);

  // Sync state changes to OBS via BroadcastChannel
  const broadcastSync = (type: string, payload: any) => {
    try {
      const channel = new BroadcastChannel("obs_letsplay_sync");
      channel.postMessage({ type, ...payload });
      channel.close();
    } catch (e) {
      console.warn("BroadcastChannel not supported in this frame", e);
    }
  };

  const handleUpdateDeaths = (newCount: number) => {
    const safeCount = Math.max(0, newCount);
    setDeaths(safeCount);
    localStorage.setItem(`obs_deaths_${seriesId}`, String(safeCount));
    broadcastSync("DEATH_UPDATE", { deaths: safeCount });
  };

  const handleUpdateBossAttempt = (newAttempt: number) => {
    const safeAttempt = Math.max(1, newAttempt);
    setBossAttempt(safeAttempt);
    localStorage.setItem(`obs_boss_attempt_${seriesId}`, String(safeAttempt));
    broadcastSync("BOSS_ATTEMPT_UPDATE", { attempt: safeAttempt });
  };

  const handleTriggerVictory = () => {
    broadcastSync("TRIGGER_VICTORY", {});
  };

  const handleSelectEpisode = (epId: number) => {
    setActiveEpId(epId);
    const ep = episodes.find((e) => e.id === epId);
    if (ep) {
      broadcastSync("EPISODE_CHANGE", { episode: ep });
    }
  };

  // Generate clean OBS Browser Source URL
  const generatedObsUrl = useMemo(() => {
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams();
    params.set("obs", "1");
    params.set("type", selectedWidget);
    params.set("theme", selectedTheme);
    params.set("anchor", selectedAnchor);
    if (scale !== 1) params.set("scale", String(scale));
    if (autoCycleSecs > 0 && selectedWidget === "lower_third") {
      params.set("autocycle", String(autoCycleSecs));
    }
    if (currentEp) {
      params.set("ep", String(currentEp.id));
    }
    return `${baseUrl}?${params.toString()}`;
  }, [selectedWidget, selectedTheme, selectedAnchor, scale, autoCycleSecs, currentEp]);

  // Recommended OBS Canvas Dimensions
  const recommendedDimensions = useMemo(() => {
    switch (selectedWidget) {
      case "lower_third":
        return { width: 1920, height: 1080, cropTip: "Full 1080p canvas with alpha-transparent lower third." };
      case "stream_bar":
        return { width: 1920, height: 70, cropTip: "Position at top or bottom edge of your stream." };
      case "boss_card":
        return { width: 480, height: 380, cropTip: "Place in screen corner during tough boss encounters." };
      case "objective_tracker":
        return { width: 440, height: 440, cropTip: "Unobtrusive quest card for RPG & Let's Play series." };
      case "death_counter":
        return { width: 380, height: 160, cropTip: "Instant death and attempt tally counter for Soulslike runs." };
      case "compact_pill":
        return { width: 320, height: 90, cropTip: "Minimalist part number & episode timer pill." };
    }
  }, [selectedWidget]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(generatedObsUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-[#0b0e17] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header Bar */}
        <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-[#0d1627] via-[#0b101c] to-[#0d1627] border-b border-cyan-500/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  OBS Studio Browser Source HUD Overlays
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Transparent 60 FPS
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Generate live, zero-latency browser source overlays for OBS Studio, Streamlabs, and vMix.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Top Quick Actions & URL Generator Card */}
          <div className="bg-[#101626] border border-cyan-500/30 rounded-xl p-4 space-y-3.5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
                  OBS Browser Source URL
                </span>
                <p className="text-xs text-zinc-300">
                  Paste this URL into an OBS <strong>Browser Source</strong>. All background elements render with 100% true alpha transparency.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs rounded-lg transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  {copiedUrl ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedUrl ? "Copied OBS URL!" : "Copy Browser Source URL"}</span>
                </button>

                <a
                  href={generatedObsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-bold text-xs rounded-lg transition-all active:scale-95 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Pop Out Window</span>
                </a>
              </div>
            </div>

            {/* URL Readout & Specs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-black/60 border border-zinc-800 rounded-lg p-2 font-mono text-xs text-zinc-300">
              <span className="text-cyan-400 truncate flex-1">{generatedObsUrl}</span>
              <div className="flex items-center gap-2 shrink-0 text-[11px] text-zinc-400 border-t sm:border-t-0 sm:border-l border-zinc-800 pt-1.5 sm:pt-0 sm:pl-2">
                <span>
                  OBS Size: <strong className="text-white">{recommendedDimensions.width}x{recommendedDimensions.height}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Grid of Customization & Live Interactive Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Customization Controls (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              {/* 1. Widget Type Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                  <span>1. Choose Overlay Widget</span>
                  <span className="text-[10px] text-cyan-400 uppercase font-mono">6 Styles</span>
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: "lower_third", name: "Broadcast Lower-Third", icon: Tv, desc: "Title, Episode & Goal" },
                    { id: "boss_card", name: "Boss Fight & Tactics", icon: Swords, desc: "Weakness & Strategy" },
                    { id: "objective_tracker", name: "Quest Milestones", icon: Sparkles, desc: "Checklist Card" },
                    { id: "death_counter", name: "Death & Retry Tally", icon: Skull, desc: "Soulslike Counter" },
                    { id: "stream_bar", name: "Top Stream Bar", icon: Layers, desc: "Full-width Top/Bottom" },
                    { id: "compact_pill", name: "Compact Floating Pill", icon: Radio, desc: "Minimalist Badge" },
                  ].map((w) => {
                    const Icon = w.icon;
                    return (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => setSelectedWidget(w.id as any)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedWidget === w.id
                            ? "bg-cyan-500/20 border-cyan-400 text-white shadow-sm"
                            : "bg-[#101422] border-zinc-800 text-zinc-300 hover:border-zinc-700"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold mb-0.5">
                          <Icon className={`w-3.5 h-3.5 ${selectedWidget === w.id ? "text-cyan-400" : "text-zinc-400"}`} />
                          <span className="truncate">{w.name}</span>
                        </div>
                        <p className="text-[10px] text-zinc-400">{w.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Visual Theme Preset */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                  <span>2. Visual Theme & Aesthetics</span>
                  <span className="text-[10px] text-zinc-400 font-mono">Matched to Game</span>
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  {[
                    { id: "broadcast", name: "Broadcast Cyan", color: "bg-cyan-400" },
                    { id: "pixel_gold", name: "16-Bit Gold", color: "bg-amber-400" },
                    { id: "crimson_souls", name: "Souls Crimson", color: "bg-red-500" },
                    { id: "cyber_neon", name: "Cyber Neon", color: "bg-fuchsia-400" },
                    { id: "clean_glass", name: "Minimal Glass", color: "bg-zinc-200" },
                    { id: "stealth_mono", name: "Stealth Mono", color: "bg-white" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTheme(t.id as any)}
                      className={`p-2 rounded-lg border text-left transition-all flex items-center gap-2 cursor-pointer ${
                        selectedTheme === t.id
                          ? "bg-white/10 border-cyan-400 text-white font-bold"
                          : "bg-[#101422] border-zinc-800 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${t.color}`}></span>
                      <span className="text-[11px] truncate">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Target Episode Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
                  <span>3. Active Episode to Display</span>
                  <span className="text-[10px] text-amber-300 font-mono">Real-Time Sync</span>
                </label>
                <select
                  value={activeEpId}
                  onChange={(e) => handleSelectEpisode(parseInt(e.target.value, 10))}
                  className="w-full bg-[#101422] border border-zinc-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  {episodes.map((ep) => (
                    <option key={ep.id} value={ep.id}>
                      Part #{ep.partNumber}: {ep.title} ({ep.world})
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Anchor & Rotation Timing */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Screen Anchor</label>
                  <select
                    value={selectedAnchor}
                    onChange={(e) => setSelectedAnchor(e.target.value as any)}
                    className="w-full bg-[#101422] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="bottom_left">Bottom Left (Standard)</option>
                    <option value="bottom_right">Bottom Right</option>
                    <option value="top_left">Top Left</option>
                    <option value="top_right">Top Right</option>
                    <option value="bottom_bar">Bottom Full Bar</option>
                    <option value="top_bar">Top Full Bar</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300">Auto-Cycle Info</label>
                  <select
                    value={autoCycleSecs}
                    onChange={(e) => setAutoCycleSecs(parseInt(e.target.value, 10))}
                    className="w-full bg-[#101422] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value={0}>Static (No Cycling)</option>
                    <option value={10}>Every 10 seconds</option>
                    <option value={15}>Every 15 seconds</option>
                    <option value={30}>Every 30 seconds</option>
                  </select>
                </div>
              </div>

              {/* 5. Live Streamer Controller (Deaths, Boss Attempts, Victory) */}
              <div className="bg-[#101525] border border-red-500/20 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-red-400 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                    <span>Live Stream Controls (Broadcasting)</span>
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">Syncs to OBS instantly</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* Death Tally */}
                  <div className="bg-black/40 rounded-lg p-2 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-rose-400 uppercase">Deaths</span>
                      <div className="text-lg font-black text-white font-mono">{deaths}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleUpdateDeaths(deaths - 1)}
                        className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateDeaths(deaths + 1)}
                        className="w-6 h-6 rounded bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Boss Attempt */}
                  <div className="bg-black/40 rounded-lg p-2 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 uppercase">Boss Attempt</span>
                      <div className="text-lg font-black text-white font-mono">#{bossAttempt}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleUpdateBossAttempt(bossAttempt - 1)}
                        className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateBossAttempt(bossAttempt + 1)}
                        className="w-6 h-6 rounded bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleTriggerVictory}
                  className="w-full inline-flex items-center justify-center gap-2 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs rounded-lg transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Trigger "Boss Slain & Victory" Banner in OBS</span>
                </button>
              </div>
            </div>

            {/* Right: Live Interactive Preview Sandbox (7 cols) */}
            <div className="lg:col-span-7 flex flex-col space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span>Live Transparency Sandbox Preview (16:9 Stream Canvas)</span>
                </span>

                {/* Preview Backdrop Selector */}
                <div className="flex items-center gap-1 bg-[#101422] p-1 rounded-lg border border-zinc-800 text-[11px]">
                  <span className="text-zinc-400 px-1 font-bold">Backdrop:</span>
                  {[
                    { id: "dark_grid", label: "Dark Grid" },
                    { id: "checkerboard", label: "Alpha Checkers" },
                    { id: "green_screen", label: "Green" },
                  ].map((bg) => (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => setPreviewBackdrop(bg.id as any)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                        previewBackdrop === bg.id
                          ? "bg-cyan-500 text-slate-950"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {bg.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* The Live Interactive Sandbox Stage */}
              <div
                className={`relative w-full aspect-video rounded-2xl border-2 border-zinc-800 overflow-hidden shadow-2xl flex flex-col justify-end p-4 sm:p-6 transition-all duration-300 ${
                  previewBackdrop === "dark_grid"
                    ? "bg-[#07090e] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]"
                    : previewBackdrop === "checkerboard"
                    ? "bg-[linear-gradient(45deg,#1f2937_25%,transparent_25%),linear-gradient(-45deg,#1f2937_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1f2937_75%),linear-gradient(-45deg,transparent_75%,#1f2937_75%)] bg-[size:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px]"
                    : "bg-[#00b140]"
                }`}
              >
                {/* Overlay Preview Content */}
                <div className="w-full flex items-end justify-between pointer-events-auto">
                  {selectedWidget === "lower_third" && (
                    <div className="w-full max-w-xl bg-gradient-to-r from-[#091524]/95 via-[#070e1a]/95 to-[#091524]/95 border border-cyan-500/40 rounded-2xl p-4 shadow-[0_0_30px_rgba(6,182,212,0.3)] space-y-2 animate-in fade-in duration-300">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                            PART #{String(currentEp?.partNumber || 1).padStart(2, "0")}
                          </span>
                          <span className="text-xs font-black text-white truncate max-w-xs">
                            {series?.gameTitle || "Playthrough Series"}
                          </span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-600/20 border border-red-500/40 text-[10px] font-mono font-bold text-red-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                          <span>REC 01:24:18</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs font-bold text-white truncate">{currentEp?.title}</div>
                        <div className="flex items-center gap-4 text-[11px] text-zinc-300">
                          <span className="text-amber-300 font-bold">📍 {currentEp?.world}</span>
                          <span className="text-zinc-400">Target: <strong className="text-cyan-200">{currentEp?.endPoint}</strong></span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
                        <span className="font-mono text-rose-400 font-bold">Deaths: {deaths}</span>
                        <span className="font-mono text-amber-300 font-bold">Boss Attempt #{bossAttempt}</span>
                        <span className="font-mono text-zinc-500">{series?.subtitle || "Let's Play"}</span>
                      </div>
                    </div>
                  )}

                  {selectedWidget === "boss_card" && (
                    <div className="max-w-xs w-full bg-[#180505]/95 border border-red-600/60 rounded-2xl p-4 shadow-[0_0_30px_rgba(220,38,38,0.4)] space-y-2 text-xs">
                      <div className="flex items-center justify-between border-b border-red-500/30 pb-2">
                        <span className="font-black text-red-400 uppercase text-[10px]">
                          {currentEp?.shortTitle || "Boss Encounter"}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-amber-300">
                          ATTEMPT #{bossAttempt}
                        </span>
                      </div>
                      <div className="bg-white/5 p-2 rounded border border-white/10 text-[11px]">
                        <span className="text-zinc-200">
                          {currentEp?.bossStrategies?.[0] || "Target encounter tactics"}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedWidget === "death_counter" && (
                    <div className="bg-black/90 border-2 border-rose-500/60 rounded-2xl p-4 shadow-2xl flex items-center gap-3">
                      <Skull className="w-8 h-8 text-rose-500 animate-pulse" />
                      <div>
                        <div className="text-[10px] font-black uppercase text-rose-400">Series Deaths</div>
                        <div className="text-2xl font-black text-white font-mono">{deaths}</div>
                      </div>
                    </div>
                  )}

                  {selectedWidget === "objective_tracker" && (
                    <div className="max-w-xs w-full bg-black/90 border border-cyan-500/40 rounded-2xl p-3.5 space-y-2 text-xs">
                      <div className="font-bold text-white flex items-center justify-between">
                        <span>Milestones #{currentEp?.partNumber}</span>
                        <span className="text-[10px] text-cyan-400">{currentEp?.world}</span>
                      </div>
                      {currentEp?.keyEvents?.slice(0, 3).map((evt, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-zinc-200 bg-white/5 p-1.5 rounded">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="truncate">{evt}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedWidget === "compact_pill" && (
                    <div className="bg-black/90 border border-white/20 rounded-full px-4 py-2 flex items-center gap-2 shadow-2xl">
                      <span className="text-xs font-black text-cyan-400">#{currentEp?.partNumber}</span>
                      <span className="text-xs font-bold text-white">{currentEp?.shortTitle}</span>
                      <span className="text-[10px] font-mono text-zinc-400 bg-white/10 px-2 py-0.5 rounded-full">01:24:18</span>
                    </div>
                  )}

                  {selectedWidget === "stream_bar" && (
                    <div className="w-full bg-[#091524]/95 border-t border-cyan-500/40 p-2 flex items-center justify-between text-xs">
                      <span className="font-black text-white">PART #{currentEp?.partNumber} • {series?.gameTitle}</span>
                      <span className="text-amber-300 font-bold">{currentEp?.world}</span>
                      <span className="text-rose-400 font-mono font-bold">Deaths: {deaths}</span>
                    </div>
                  )}
                </div>

                <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-md rounded text-[10px] font-mono text-zinc-300 border border-white/10">
                  OBS Live Preview
                </div>
              </div>

              {/* OBS Setup 4-Step Quick Instructions */}
              <div className="bg-[#101524] border border-white/10 rounded-xl p-4 space-y-2 text-xs text-zinc-300">
                <div className="font-bold text-white flex items-center gap-2">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <span>How to add to OBS Studio (4 Simple Steps):</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-zinc-300 leading-relaxed pl-1">
                  <li>In OBS Studio, click <strong>Sources (+)</strong> &rarr; Select <strong>Browser</strong>.</li>
                  <li>Paste the copied URL above into the <strong>URL field</strong>.</li>
                  <li>Set <strong>Width: {recommendedDimensions.width}</strong> and <strong>Height: {recommendedDimensions.height}</strong>.</li>
                  <li>Check <strong>"Shutdown source when not visible"</strong> and <strong>"Refresh browser when scene becomes active"</strong>.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#090d16] border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>BroadcastChannel real-time sync active (zero refresh needed)</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-lg transition-all cursor-pointer"
          >
            Close Studio
          </button>
        </div>
      </div>
    </div>
  );
};
