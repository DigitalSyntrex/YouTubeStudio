import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Square,
  Bookmark,
  Clock,
  Mic,
  Check,
  Plus,
  Volume2,
  Minimize2,
  Maximize2,
  Sparkles,
  AlertTriangle,
  Swords,
  Crown,
  MapPin,
  MessageSquare,
  FileText,
  Save,
  Radio,
  Gamepad2,
} from "lucide-react";
import { Episode, PlaythroughSeries } from "../types";

interface RecordingTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSeries: PlaythroughSeries;
  episodes: Episode[];
  onUpdateEpisode: (updated: Episode) => void;
  onUpdateStatus: (episodeId: number, newStatus: Episode["status"]) => void;
  initialEpisodeId?: number | null;
  onOpenMirillisActionModal?: () => void;
}

interface ChapterBookmark {
  id: string;
  seconds: number;
  timestamp: string;
  label: string;
  category: "boss" | "loot" | "cutscene" | "area" | "funny" | "outro" | "general";
}

export const RecordingTimerModal: React.FC<RecordingTimerModalProps> = ({
  isOpen,
  onClose,
  activeSeries,
  episodes,
  onUpdateEpisode,
  onUpdateStatus,
  initialEpisodeId,
  onOpenMirillisActionModal,
}) => {
  // Find default episode to record (first not_started or first recorded)
  const defaultEpisode =
    (episodes || []).find((e) => e?.status === "not_started") || episodes?.[0];

  const [selectedEpId, setSelectedEpId] = useState<number>(
    initialEpisodeId || defaultEpisode?.id || 0
  );

  useEffect(() => {
    if (initialEpisodeId) {
      setSelectedEpId(initialEpisodeId);
    } else if (defaultEpisode) {
      setSelectedEpId(defaultEpisode.id);
    }
  }, [initialEpisodeId, isOpen]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [targetMinutes, setTargetMinutes] = useState<number>(
    defaultEpisode?.estDurationMinutes || 105
  );
  const [bookmarks, setBookmarks] = useState<ChapterBookmark[]>([]);
  const [customBookmarkText, setCustomBookmarkText] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<
    ChapterBookmark["category"]
  >("general");
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [autoUpdateRecorded, setAutoUpdateRecorded] = useState<boolean>(true);
  const [updateEpisodeDuration, setUpdateEpisodeDuration] = useState<boolean>(true);
  const [copiedTimestamps, setCopiedTimestamps] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const activeEp = (episodes || []).find((e) => e?.id === selectedEpId) || defaultEpisode;

  // Sync target minutes when active episode changes
  useEffect(() => {
    if (activeEp) {
      setTargetMinutes(activeEp.estDurationMinutes || 105);
    }
  }, [selectedEpId]);

  // Stopwatch timer interval
  useEffect(() => {
    let interval: any = null;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  if (!isOpen) return null;

  // Format helper for HH:MM:SS or MM:SS
  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  const handleStartTimer = () => {
    if (elapsedSeconds === 0 && bookmarks.length === 0) {
      // Add initial 00:00 bookmark automatically
      setBookmarks([
        {
          id: Date.now().toString(),
          seconds: 0,
          timestamp: "00:00",
          label: "Episode Intro & Gameplay Setup",
          category: "general",
        },
      ]);
    }
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePauseTimer = () => {
    setIsPaused(true);
  };

  const handleResumeTimer = () => {
    setIsPaused(false);
  };

  const handleResetTimer = () => {
    if (elapsedSeconds > 0 && !showResetConfirm) {
      setShowResetConfirm(true);
      return;
    }
    setIsRunning(false);
    setIsPaused(false);
    setElapsedSeconds(0);
    setBookmarks([]);
    setShowResetConfirm(false);
    setSaveSuccessMsg("Timer and session timestamps reset to 00:00.");
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleAddMinutes = (minsToAdd: number) => {
    setTargetMinutes((prev) => prev + minsToAdd);
  };

  const handleAddBookmark = (category?: ChapterBookmark["category"], textOverride?: string) => {
    const label = textOverride || customBookmarkText.trim() || getDefaultCategoryLabel(category || selectedCategory);
    const cat = category || selectedCategory;

    const newBm: ChapterBookmark = {
      id: Date.now().toString(),
      seconds: elapsedSeconds,
      timestamp: formatTime(elapsedSeconds),
      label: label,
      category: cat,
    };

    setBookmarks((prev) => [...prev, newBm]);
    setCustomBookmarkText("");
  };

  const getDefaultCategoryLabel = (cat: ChapterBookmark["category"]) => {
    switch (cat) {
      case "boss":
        return activeEp?.bosses?.[0] ? `Boss Battle: ${activeEp.bosses[0]}` : "Major Boss Encounter";
      case "loot":
        return activeEp?.keyEvents?.[0] ? `Acquired: ${activeEp.keyEvents[0]}` : "Key Loot & Gear Found";
      case "cutscene":
        return "Story Cutscene & Dialogue";
      case "area":
        return activeEp?.startPoint ? `Exploring ${activeEp.startPoint}` : "New Area Exploration";
      case "funny":
        return "Funny Commentary / Game Moment";
      case "outro":
        return "Episode Outro & Next Part Teaser";
      default:
        return "Gameplay Progress Highlight";
    }
  };

  const handleDeleteBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  // Generate formatted YouTube description text with timestamps
  const generatedTimestampsText = bookmarks
    .map((b) => `${b.timestamp} - ${b.label}`)
    .join("\n");

  const handleCopyTimestamps = () => {
    navigator.clipboard.writeText(generatedTimestampsText);
    setCopiedTimestamps(true);
    setTimeout(() => setCopiedTimestamps(false), 2000);
  };

  const handleFinishAndSave = () => {
    if (!activeEp) return;

    setIsRunning(false);
    setIsPaused(false);

    const recordedMins = Math.max(1, Math.round(elapsedSeconds / 60));
    // If the session was under 3 minutes (e.g. quick test), keep the original estimated duration unless explicitly wanted
    const shouldApplyDuration = updateEpisodeDuration && (elapsedSeconds >= 180 || recordedMins >= activeEp.estDurationMinutes);
    const finalDuration = shouldApplyDuration ? recordedMins : activeEp.estDurationMinutes;

    // Append timestamps to episode description if not already present
    let updatedDesc = activeEp.youtubeDescription || "";
    if (bookmarks.length > 0) {
      if (!updatedDesc.includes("CHAPTER TIMESTAMPS:") && !updatedDesc.includes("TIMESTAMPS:")) {
        updatedDesc += `\n\nCHAPTER TIMESTAMPS:\n${generatedTimestampsText}`;
      }
    }

    const updatedEp: Episode = {
      ...activeEp,
      estDurationMinutes: finalDuration,
      youtubeDescription: updatedDesc,
      status: autoUpdateRecorded ? "recorded" : activeEp.status,
    };

    onUpdateEpisode(updatedEp);
    if (autoUpdateRecorded) {
      onUpdateStatus(activeEp.id, "recorded");
    }

    setSaveSuccessMsg(`Episode #${activeEp.partNumber} saved! (${finalDuration} mins, status: ${autoUpdateRecorded ? "Recorded" : activeEp.status})`);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  const targetSecs = targetMinutes * 60;
  const progressPct = Math.min(100, Math.round((elapsedSeconds / targetSecs) * 100));
  const remainingSecs = Math.max(0, targetSecs - elapsedSeconds);

  // Status color pacing
  let pacingColor = "text-cyan-400 border-cyan-500/40 bg-cyan-950/30";
  let pacingLabel = "In Good Pace";
  if (progressPct >= 100) {
    pacingColor = "text-red-400 border-red-500/50 bg-red-950/40 animate-pulse";
    pacingLabel = "Target Length Reached / Overtime";
  } else if (progressPct >= 80) {
    pacingColor = "text-amber-300 border-amber-500/40 bg-amber-950/30";
    pacingLabel = "Wrap-Up Soon (Final 20%)";
  }

  // Mini Floating Overlay Layout if minimized
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-[#0c101c] border-2 border-cyan-500/80 rounded-2xl p-3.5 shadow-2xl shadow-cyan-950/80 flex items-center gap-3.5 backdrop-blur-xl text-white">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            {isRunning && !isPaused && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isRunning && !isPaused ? "bg-red-500" : "bg-zinc-500"}`}></span>
          </span>
          <div className="font-mono text-lg font-black tracking-tight text-white">
            {formatTime(elapsedSeconds)}
          </div>
          <span className="text-[10px] text-cyan-300 font-semibold bg-cyan-950/80 border border-cyan-500/40 px-1.5 py-0.5 rounded">
            / {targetMinutes}m
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {!isRunning || isPaused ? (
            <button
              onClick={handleStartTimer}
              className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all cursor-pointer"
              title="Start Recording"
            >
              <Play className="w-4 h-4 fill-white" />
            </button>
          ) : (
            <button
              onClick={handlePauseTimer}
              className="p-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-all cursor-pointer"
              title="Pause Timer"
            >
              <Pause className="w-4 h-4 fill-white" />
            </button>
          )}

          <button
            onClick={() => handleAddBookmark("general")}
            className="px-2.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            title="Add Quick Timestamp"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Mark</span>
          </button>

          <button
            onClick={() => {
              const url = window.location.href.split("#")[0] + "?hud=true";
              window.open(url, "TimerHUD", "width=600,height=220,resizable=yes");
            }}
            className="p-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg transition-all cursor-pointer"
            title="Popout Standalone Always-on-Top Timer Window for Gaming"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={() => setIsMinimized(false)}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-all cursor-pointer"
            title="Expand Session Window"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#0b0e17] border-2 border-cyan-500/50 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl shadow-cyan-950/60 text-white flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-cyan-500/20 bg-gradient-to-r from-[#0d1322] via-[#10172a] to-[#0d1322] flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400 animate-pulse">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Live Playthrough Recording Session Timer
                </h2>
                <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/40 text-red-300 text-[10px] font-black uppercase tracking-wider rounded-md">
                  Studio Tool
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Track real-time gameplay recording duration, pacing warnings, and 1-click YouTube chapter timestamps.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenMirillisActionModal && (
              <button
                onClick={onOpenMirillisActionModal}
                className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105"
                title="Mirillis Action! HUD Overlay & Hotkeys Integration"
              >
                <Radio className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="hidden sm:inline">Action! HUD / Sync</span>
              </button>
            )}

            <button
              onClick={() => setIsMinimized(true)}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all cursor-pointer"
              title="Minimize to Floating Dock"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-6 flex-1">
          {saveSuccessMsg && (
            <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{saveSuccessMsg}</span>
              </div>
              <button onClick={() => setSaveSuccessMsg(null)} className="text-emerald-400 hover:text-white text-xs">
                Dismiss
              </button>
            </div>
          )}

          {/* Episode Picker & Target Setting */}
          <div className="bg-[#101524] border border-blue-500/30 p-4 rounded-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex-1 min-w-[240px]">
                <label className="block text-xs font-bold text-zinc-400 mb-1">
                  Active Episode Being Recorded:
                </label>
                <select
                  value={selectedEpId}
                  onChange={(e) => setSelectedEpId(Number(e.target.value))}
                  className="w-full bg-[#0a0d16] border border-cyan-500/40 focus:border-cyan-400 rounded-lg px-3 py-2 text-xs sm:text-sm font-bold text-white focus:outline-none cursor-pointer"
                >
                  {episodes.map((ep) => (
                    <option key={ep.id} value={ep.id}>
                      Part {ep.partNumber}: {ep.title} ({ep.estDurationMinutes} mins • {ep.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1">
                  Target Duration Goal:
                </label>
                <div className="flex items-center gap-2">
                  {[60, 90, 105, 120].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setTargetMinutes(mins)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        targetMinutes === mins
                          ? "bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-900/40"
                          : "bg-[#0c101a] text-zinc-300 border-zinc-700 hover:border-zinc-500"
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {activeEp && (
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400 border-t border-zinc-800 pt-2.5">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Start: <strong className="text-zinc-200">{activeEp.startPoint || "Game Start"}</strong></span>
                  <span className="text-zinc-600">•</span>
                  <span>End Goal: <strong className="text-zinc-200">{activeEp.endPoint || "Boss Fight"}</strong></span>
                </div>

                {activeEp.bosses?.[0] && (
                  <div className="flex items-center gap-1.5 bg-purple-950/40 border border-purple-500/30 px-2 py-0.5 rounded text-purple-300 font-medium">
                    <Swords className="w-3 h-3 text-purple-400" />
                    <span>Boss: {activeEp.bosses[0]}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Big Timer Display & Circular Pacing Ring */}
          <div className="bg-[#0b0e18] border border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden flex flex-col items-center justify-center space-y-5 shadow-inner">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-transparent to-transparent pointer-events-none" />

            {/* Pacing Badge */}
            <div className={`px-3 py-1 rounded-full border text-xs font-black uppercase tracking-wider flex items-center gap-2 ${pacingColor}`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{pacingLabel}</span>
              <span className="font-mono">({progressPct}%)</span>
            </div>

            {/* Digital Clock Display */}
            <div className="text-center space-y-1">
              <div className="font-mono text-5xl sm:text-7xl font-black tracking-tight text-white drop-shadow-md">
                {formatTime(elapsedSeconds)}
              </div>
              <div className="text-xs text-zinc-400 font-medium flex items-center justify-center gap-3">
                <span>Target: {formatTime(targetSecs)} ({targetMinutes} mins)</span>
                <span>•</span>
                <span>Remaining: {formatTime(remainingSecs)}</span>
              </div>
            </div>

            {/* Linear Progress Bar */}
            <div className="w-full max-w-xl bg-zinc-900 h-3 rounded-full overflow-hidden border border-zinc-700/60 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  progressPct >= 100
                    ? "bg-gradient-to-r from-amber-500 to-red-500"
                    : progressPct >= 80
                    ? "bg-gradient-to-r from-cyan-500 to-amber-400"
                    : "bg-gradient-to-r from-blue-500 to-cyan-400"
                }`}
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Primary Stopwatch Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {!isRunning || isPaused ? (
                <button
                  onClick={handleStartTimer}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-emerald-950/60 flex items-center gap-2.5 cursor-pointer hover:scale-105"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>{isPaused ? "Resume Session" : "Start Recording Session"}</span>
                </button>
              ) : (
                <button
                  onClick={handlePauseTimer}
                  className="px-6 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-amber-950/60 flex items-center gap-2.5 cursor-pointer hover:scale-105"
                >
                  <Pause className="w-5 h-5 fill-white" />
                  <span>Pause Timer</span>
                </button>
              )}

              <button
                onClick={() => handleAddMinutes(5)}
                className="px-3.5 py-3 bg-[#121829] hover:bg-[#1a233b] border border-cyan-500/40 text-cyan-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                title="Add 5 minutes to target duration"
              >
                <Plus className="w-4 h-4" />
                <span>+5 Mins</span>
              </button>

              {showResetConfirm ? (
                <div className="flex items-center gap-1.5 bg-red-950/80 border border-red-500/60 p-1.5 rounded-xl animate-fade-in">
                  <span className="text-[11px] font-bold text-red-300 px-1">Reset session?</span>
                  <button
                    onClick={handleResetTimer}
                    className="px-2.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-lg transition-all cursor-pointer shadow-md"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-2 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleResetTimer}
                  className="px-3.5 py-3 bg-[#121829] hover:bg-[#1a233b] border border-zinc-700 text-zinc-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer hover:border-red-500/50 hover:text-red-300"
                  title="Reset session timer and clear timestamps"
                >
                  <RotateCcw className="w-4 h-4 text-zinc-400 group-hover:text-red-400" />
                  <span>Reset</span>
                </button>
              )}

              <button
                onClick={handleFinishAndSave}
                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg shadow-blue-900/40 flex items-center gap-2 cursor-pointer"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>Finish & Save to Episode</span>
              </button>
            </div>
          </div>

          {/* Quick Chapter Timestamp Bookmark Engine */}
          <div className="bg-[#101422] border border-cyan-500/30 rounded-xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  1-Click Chapter Timestamps ({bookmarks.length} Bookmarked)
                </h3>
              </div>
              <p className="text-xs text-zinc-400">
                Click presets or type a note while recording to auto-generate YouTube description chapters!
              </p>
            </div>

            {/* Category Quick Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleAddBookmark("boss")}
                className="px-3 py-1.5 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-purple-300 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Swords className="w-3.5 h-3.5 text-purple-400" />
                <span>⚔️ Boss Fight</span>
              </button>

              <button
                onClick={() => handleAddBookmark("loot")}
                className="px-3 py-1.5 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>💎 Rare Loot</span>
              </button>

              <button
                onClick={() => handleAddBookmark("cutscene")}
                className="px-3 py-1.5 bg-blue-950/60 hover:bg-blue-900/80 border border-blue-500/40 text-blue-300 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>🎬 Cutscene</span>
              </button>

              <button
                onClick={() => handleAddBookmark("area")}
                className="px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>🗺️ New Area</span>
              </button>

              <button
                onClick={() => handleAddBookmark("funny")}
                className="px-3 py-1.5 bg-pink-950/60 hover:bg-pink-900/80 border border-pink-500/40 text-pink-300 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
                <span>💬 Funny Moment</span>
              </button>

              <button
                onClick={() => handleAddBookmark("outro")}
                className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-300 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 text-red-400" />
                <span>🏁 Outro</span>
              </button>
            </div>

            {/* Custom Note Entry */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customBookmarkText}
                onChange={(e) => setCustomBookmarkText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddBookmark();
                }}
                placeholder="Type custom timestamp note (e.g. Unlocked Figaro Secret Vault) and press Enter..."
                className="flex-1 bg-[#090c16] border border-cyan-500/40 focus:border-cyan-400 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none placeholder:text-zinc-600"
              />
              <button
                onClick={() => handleAddBookmark()}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Bookmark ({formatTime(elapsedSeconds)})</span>
              </button>
            </div>

            {/* Saved Bookmarks List */}
            {bookmarks.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {bookmarks.map((b) => (
                  <div
                    key={b.id}
                    className="flex items-center justify-between p-2.5 bg-[#0a0d18] border border-zinc-800 rounded-lg text-xs hover:border-cyan-500/30 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-cyan-400 font-black px-2 py-0.5 bg-cyan-950/60 border border-cyan-500/30 rounded">
                        {b.timestamp}
                      </span>
                      <span className="text-zinc-200 font-medium">{b.label}</span>
                    </div>

                    <button
                      onClick={() => handleDeleteBookmark(b.id)}
                      className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                      title="Delete timestamp"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-zinc-800 rounded-xl text-xs text-zinc-500">
                No timestamps bookmarked yet. Click any preset button above while recording to log key moments!
              </div>
            )}

            {/* Copy Button */}
            {bookmarks.length > 0 && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleCopyTimestamps}
                  className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{copiedTimestamps ? "Copied Timestamps!" : "Copy Description Timestamps"}</span>
                </button>
              </div>
            )}
          </div>

          {/* Settings & Auto Sync */}
          <div className="bg-[#101422] border border-blue-500/20 rounded-xl p-4 space-y-2.5 text-xs text-zinc-300">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoUpdateRecorded}
                  onChange={(e) => setAutoUpdateRecorded(e.target.checked)}
                  className="rounded border-zinc-700 text-cyan-500 focus:ring-cyan-400"
                />
                <span>Automatically mark status as <strong className="text-amber-300 font-bold">Recorded</strong> when saved</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={updateEpisodeDuration}
                  onChange={(e) => setUpdateEpisodeDuration(e.target.checked)}
                  className="rounded border-zinc-700 text-cyan-500 focus:ring-cyan-400"
                />
                <span>Update episode duration with session length <span className="text-cyan-300 font-mono">({Math.max(1, Math.round(elapsedSeconds / 60))}m)</span></span>
              </label>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-emerald-400" />
                <span>Short sessions under 3 minutes protect and preserve the planned {activeEp.estDurationMinutes}m estimate</span>
              </div>
              <span className="text-zinc-500">Auto-saved locally</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 bg-[#0d1220] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Close Window
          </button>

          <button
            onClick={handleFinishAndSave}
            className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Save & Apply Timestamps</span>
          </button>
        </div>
      </div>
    </div>
  );
};
