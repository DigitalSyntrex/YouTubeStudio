import React, { useState, useEffect } from "react";
import { Episode, PlaythroughSeries } from "../types";
import {
  Radio,
  Play,
  Pause,
  Clock,
  ExternalLink,
  Gamepad2,
  Bookmark,
  Check,
  X,
  Sparkles,
  Shield,
  Layers,
  Volume2
} from "lucide-react";

interface HudOverlayProps {
  series: PlaythroughSeries;
  episodes: Episode[];
  currentEpisodeId?: number;
}

export const HudOverlay: React.FC<HudOverlayProps> = ({
  series,
  episodes,
  currentEpisodeId
}) => {
  const episode =
    episodes.find((e) => e.id === currentEpisodeId) ||
    episodes.find((e) => e.status === "not_started") ||
    episodes[0];

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const addBookmark = (label: string) => {
    const ts = formatTime(seconds);
    const entry = `${ts} - ${label}`;
    setBookmarks((prev) => [entry, ...prev]);
  };

  const handleCopyBookmarks = () => {
    navigator.clipboard.writeText(bookmarks.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-transparent p-4 flex flex-col justify-between select-none font-sans text-white">
      {/* Top Floating Transparent HUD Widget */}
      <div className="max-w-xl w-full mx-auto bg-black/85 backdrop-blur-md border-2 border-red-500/60 rounded-2xl p-4 shadow-2xl shadow-red-950/80 space-y-3">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-600/30 border border-red-500/50 rounded-lg">
              <span className={`w-2.5 h-2.5 rounded-full ${isRunning ? "bg-red-500 animate-ping" : "bg-zinc-500"}`} />
              <span className="text-[11px] font-black tracking-widest text-red-400 uppercase">
                {isRunning ? "LIVE REC" : "STANDBY"}
              </span>
            </div>

            <span className="text-xs font-black text-amber-400 px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded">
              Part #{episode?.partNumber || 1}
            </span>

            <span className="text-xs font-bold text-zinc-300 truncate max-w-[180px]">
              {series.gameTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-3 py-1 rounded-lg text-xs font-black flex items-center gap-1 cursor-pointer transition-all ${
                isRunning
                  ? "bg-amber-500 hover:bg-amber-400 text-zinc-950"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white"
              }`}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRunning ? "Pause" : "Start"}</span>
            </button>
            <span className="font-mono text-lg font-black text-emerald-400 tracking-tight">
              {formatTime(seconds)}
            </span>
          </div>
        </div>

        {/* Active Episode & Objective Details */}
        <div className="space-y-1">
          <h1 className="text-sm font-black text-white truncate">
            {episode?.title || "Playthrough Episode"}
          </h1>
          <div className="flex items-center justify-between text-[11px] text-zinc-300">
            <span className="truncate">
              🎯 Target: <strong className="text-cyan-300">{episode?.endPoint || "Main Quest Objective"}</strong>
            </span>
            <span className="text-zinc-400 shrink-0">
              Est: {episode?.estDurationMinutes || 90}m
            </span>
          </div>
        </div>

        {/* Quick Chapter Timestamp Logs */}
        <div className="pt-1 flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mr-1">Log:</span>
          {["Boss Battle", "Key Loot", "Cutscene", "Outro"].map((cat) => (
            <button
              key={cat}
              onClick={() => addBookmark(cat)}
              className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded text-[10px] font-bold cursor-pointer transition-colors"
            >
              +{cat}
            </button>
          ))}
          {bookmarks.length > 0 && (
            <button
              onClick={handleCopyBookmarks}
              className="ml-auto px-2 py-0.5 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 rounded text-[10px] font-black cursor-pointer"
            >
              {copied ? "Copied!" : `Copy (${bookmarks.length})`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
