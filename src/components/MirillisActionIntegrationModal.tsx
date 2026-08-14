import React, { useState } from "react";
import {
  X,
  Radio,
  Tv,
  Keyboard,
  FolderArchive,
  Volume2,
  Copy,
  Check,
  ExternalLink,
  Zap,
  Sliders,
  Layers,
  Sparkles,
  Info,
  Shield,
  FileSpreadsheet,
} from "lucide-react";
import { PlaythroughSeries, Episode } from "../types";

interface MirillisActionIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSeries: PlaythroughSeries;
  episodes: Episode[];
  activeEpisode?: Episode;
}

export const MirillisActionIntegrationModal: React.FC<
  MirillisActionIntegrationModalProps
> = ({ isOpen, onClose, activeSeries, episodes, activeEpisode }) => {
  const [activeTab, setActiveTab] = useState<
    "overlay" | "hotkeys" | "naming" | "audio"
  >("overlay");
  const [copied, setCopied] = useState<string | null>(null);

  // Default target episode
  const currentEp =
    activeEpisode ||
    episodes.find((e) => e.status === "not_started") ||
    episodes[0];

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const currentUrl = window.location.href.split("#")[0];
  const overlayUrl = `${currentUrl}?hud=true&series=${encodeURIComponent(
    activeSeries.gameTitle
  )}&part=${currentEp?.partNumber || 1}`;

  const recommendedFileName = `${activeSeries.gameTitle.replace(
    /[^a-zA-Z0-0]/g,
    ""
  )}_Part${String(currentEp?.partNumber || 1).padStart(2, "0")}_${(
    currentEp?.title || "Episode"
  ).replace(/[^a-zA-Z0-0]/g, "_")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0d0d10] border border-cyan-500/30 rounded-3xl shadow-2xl shadow-cyan-950/50 flex flex-col overflow-hidden text-zinc-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800/80 bg-zinc-950/60">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-2xl text-red-400">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-white">
                  Mirillis Action! Studio Integration
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-500/20 text-red-300 border border-red-500/40">
                  Live Recording Companion
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Seamless HUD overlay, hotkey synchronization & multi-track audio setup for Action!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800/80 bg-zinc-900/40 px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab("overlay")}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "overlay"
                ? "border-red-500 text-red-400 bg-red-500/10 rounded-t-xl"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>1. Action! HUD URL Overlay</span>
          </button>

          <button
            onClick={() => setActiveTab("hotkeys")}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "hotkeys"
                ? "border-amber-500 text-amber-400 bg-amber-500/10 rounded-t-xl"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Keyboard className="w-4 h-4" />
            <span>2. Hotkey Sync</span>
          </button>

          <button
            onClick={() => setActiveTab("naming")}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "naming"
                ? "border-cyan-500 text-cyan-400 bg-cyan-500/10 rounded-t-xl"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <FolderArchive className="w-4 h-4" />
            <span>3. Output & File Naming</span>
          </button>

          <button
            onClick={() => setActiveTab("audio")}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "audio"
                ? "border-purple-500 text-purple-400 bg-purple-500/10 rounded-t-xl"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>4. Multi-Track & YouTube SEO</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#09090b]/80">
          {/* TAB 1: OVERLAY */}
          {activeTab === "overlay" && (
            <div className="space-y-6">
              <div className="p-4 bg-gradient-to-r from-red-950/40 to-zinc-900 border border-red-500/30 rounded-2xl flex items-start gap-3">
                <Info className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <h4 className="font-extrabold text-red-200">
                    Did you know Mirillis Action! supports native URL Overlay Widgets?
                  </h4>
                  <p className="text-zinc-300 leading-relaxed">
                    Mirillis Action! features up to 6 custom <strong className="text-white">URL Overlay Sources</strong>. You can paste your stream/app HUD widget link into Action! to show active episode goals, boss names, and episode timer live on screen or in your stream recording!
                  </p>
                </div>
              </div>

              {/* Live HUD Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-red-400" />
                    <span>Action! Live Transparent HUD Widget Preview</span>
                  </label>
                  <span className="text-[10px] text-zinc-500">Rendered in 1080p HUD Scale</span>
                </div>

                <div className="relative w-full h-44 bg-zinc-950 rounded-2xl border border-zinc-800/80 overflow-hidden flex items-center justify-center p-4 bg-[radial-gradient(#1e1e24_1px,transparent_1px)] [background-size:16px_16px]">
                  {/* Game Background Mockup */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/20 via-zinc-950 to-blue-950/20 opacity-60 pointer-events-none" />

                  {/* HUD Widget overlay */}
                  <div className="relative z-10 p-3.5 bg-black/75 backdrop-blur-md rounded-2xl border border-red-500/50 shadow-2xl flex items-center gap-4 max-w-lg w-full">
                    <div className="flex items-center gap-2 pr-3 border-r border-zinc-700">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                      <span className="text-xs font-black text-red-400 tracking-wider">REC</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-amber-400 px-1.5 py-0.5 bg-amber-500/20 rounded border border-amber-500/30">
                          Pt #{currentEp?.partNumber || 1}
                        </span>
                        <h5 className="text-xs font-extrabold text-white truncate">
                          {currentEp?.title || "Episode Title"}
                        </h5>
                      </div>
                      <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                        🎮 {activeSeries.gameTitle} • Objective: {currentEp?.endPoint || "Main Quest Goal"}
                      </p>
                    </div>

                    <div className="text-right pl-3 border-l border-zinc-700">
                      <span className="text-xs font-mono font-black text-emerald-400">
                        24:15
                      </span>
                      <p className="text-[9px] text-zinc-500 font-bold uppercase">Pacing OK</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cloud Run Preview / CEF Sign-in Explanation & 1-Click Standalone Popout Window */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/40 rounded-2xl space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold text-amber-200">
                      Why does Mirillis Action! or OBS show a "Sign In" prompt when pasting the URL?
                    </h4>
                    <p className="text-zinc-300 leading-relaxed mt-1">
                      The AI Studio cloud preview environment enforces security authentication for standard browser traffic. Mirillis Action! and OBS use an embedded browser (CEF) which doesn't share your signed-in browser session cookies.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-zinc-950/80 rounded-xl border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-black text-amber-300 block">Recommended 1-Click Solution:</span>
                    <p className="text-[11px] text-zinc-400">
                      Launch the <strong>Standalone Local HUD Window</strong> in your browser, then capture it in Mirillis Action! via <strong>Window Capture / Screen Capture Mode</strong>!
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const popWindow = window.open(
                        `${overlayUrl}`,
                        "ActionHUD",
                        "width=650,height=220,resizable=yes,scrollbars=no,status=no"
                      );
                      if (popWindow) popWindow.focus();
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-amber-950/50 flex items-center gap-1.5 shrink-0 cursor-pointer transition-all hover:scale-105"
                  >
                    <ExternalLink className="w-4 h-4 text-zinc-950" />
                    <span>Launch Local Standalone HUD Popout</span>
                  </button>
                </div>
              </div>

              {/* Action! Setup Instructions */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3">
                <h4 className="text-xs font-extrabold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  How to setup in Mirillis Action!:
                </h4>
                <ol className="text-xs text-zinc-300 space-y-2 list-decimal list-inside leading-relaxed">
                  <li>Open <strong className="text-white">Mirillis Action!</strong> on your PC.</li>
                  <li>Go to <strong className="text-cyan-300">HUD Settings</strong> ➔ <strong className="text-cyan-300">Overlay Sources</strong>.</li>
                  <li>Click <strong className="text-emerald-400">+ Add URL Overlay</strong> and set width to <strong className="text-amber-300">600</strong> and height to <strong className="text-amber-300">120</strong>.</li>
                  <li>Copy and paste your custom app studio link below into the URL box.</li>
                </ol>

                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={overlayUrl}
                    className="flex-1 bg-black/80 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-mono text-zinc-300 focus:outline-none"
                  />
                  <button
                    onClick={() => handleCopy(overlayUrl, "overlay_url")}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {copied === "overlay_url" ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Overlay URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOTKEYS */}
          {activeTab === "hotkeys" && (
            <div className="space-y-6">
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3">
                <Keyboard className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <h4 className="font-extrabold text-amber-200">
                    Mirillis Action! Standard Hotkey Reference & Dual-Monitor Sync
                  </h4>
                  <p className="text-zinc-300 leading-relaxed">
                    By keeping your browser open on a second monitor while playing, you can control Mirillis Action! and this studio planner simultaneously!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                      Mirillis Action! Hotkey
                    </span>
                    <span className="text-xs font-black text-zinc-400 uppercase tracking-wider">
                      Function
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-xl border border-zinc-800">
                      <kbd className="px-2 py-1 bg-zinc-800 text-amber-300 font-mono font-bold rounded border border-zinc-700">
                        F9
                      </kbd>
                      <span className="text-zinc-200 font-medium">Start / Stop Video Recording</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-xl border border-zinc-800">
                      <kbd className="px-2 py-1 bg-zinc-800 text-amber-300 font-mono font-bold rounded border border-zinc-700">
                        F10
                      </kbd>
                      <span className="text-zinc-200 font-medium">Benchmark / Time-Shift Save</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-xl border border-zinc-800">
                      <kbd className="px-2 py-1 bg-zinc-800 text-amber-300 font-mono font-bold rounded border border-zinc-700">
                        F11
                      </kbd>
                      <span className="text-zinc-200 font-medium">Take Screenshot (4K HDR)</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-xl border border-zinc-800">
                      <kbd className="px-2 py-1 bg-zinc-800 text-amber-300 font-mono font-bold rounded border border-zinc-700">
                        Ctrl + F10
                      </kbd>
                      <span className="text-zinc-200 font-medium">Highlight / Chapter Marker</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-red-400 uppercase tracking-wider">
                      App REC Timer Hotkey
                    </span>
                    <span className="text-xs font-black text-zinc-400 uppercase tracking-wider">
                      Action
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-xl border border-zinc-800">
                      <kbd className="px-2 py-1 bg-zinc-800 text-red-300 font-mono font-bold rounded border border-zinc-700">
                        Space
                      </kbd>
                      <span className="text-zinc-200 font-medium">Start / Pause REC Stopwatch</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-xl border border-zinc-800">
                      <kbd className="px-2 py-1 bg-zinc-800 text-red-300 font-mono font-bold rounded border border-zinc-700">
                        B
                      </kbd>
                      <span className="text-zinc-200 font-medium">Add Boss Fight Chapter</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-xl border border-zinc-800">
                      <kbd className="px-2 py-1 bg-zinc-800 text-red-300 font-mono font-bold rounded border border-zinc-700">
                        L
                      </kbd>
                      <span className="text-zinc-200 font-medium">Add Key Loot Chapter</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-zinc-950 rounded-xl border border-zinc-800">
                      <kbd className="px-2 py-1 bg-zinc-800 text-red-300 font-mono font-bold rounded border border-zinc-700">
                        C
                      </kbd>
                      <span className="text-zinc-200 font-medium">Add Cutscene / Story Chapter</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NAMING */}
          {activeTab === "naming" && (
            <div className="space-y-6">
              <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-start gap-3">
                <FolderArchive className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <h4 className="font-extrabold text-cyan-200">
                    Mirillis Action! File Naming & Directory Preset
                  </h4>
                  <p className="text-zinc-300 leading-relaxed">
                    Action! lets you customize output video filenames. Copy our generated filename string for Part #{currentEp?.partNumber} so your raw video files match your episode titles perfectly!
                  </p>
                </div>
              </div>

              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-zinc-300">
                    Suggested Video File Name for Active Episode
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${recommendedFileName}.mp4`}
                      className="flex-1 bg-black/80 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none"
                    />
                    <button
                      onClick={() =>
                        handleCopy(`${recommendedFileName}.mp4`, "filename")
                      }
                      className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      {copied === "filename" ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy File Name</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs space-y-2">
                  <span className="font-bold text-zinc-400 uppercase text-[10px]">
                    Recommended Output Folder Structure:
                  </span>
                  <div className="font-mono text-zinc-300 text-[11px] leading-relaxed">
                    📁 C:\Videos\Action!\{activeSeries.gameTitle.replace(/\s+/g, "_")}\RawRecordings\
                    <br />
                    ├── 🎥 {recommendedFileName}.mp4
                    <br />
                    └── 📝 {recommendedFileName}_chapters.txt
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AUDIO & YOUTUBE SEO */}
          {activeTab === "audio" && (
            <div className="space-y-6">
              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-start gap-3">
                <Volume2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <h4 className="font-extrabold text-purple-200">
                    Action! Multi-Track Audio & YouTube Chapter Sync
                  </h4>
                  <p className="text-zinc-300 leading-relaxed">
                    Mirillis Action! records separated audio tracks (Track 1: System/Game Audio, Track 2: Microphone).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3 text-xs">
                  <h4 className="font-extrabold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-400" />
                    Recommended Action! Audio Settings
                  </h4>
                  <ul className="space-y-2 text-zinc-300 list-disc list-inside leading-relaxed">
                    <li>Enable <strong className="text-purple-300">"Record audio into separate audio track"</strong> in Action! Audio Settings.</li>
                    <li>Set Game Audio to <strong className="text-white">100% Volume</strong> and Mic Audio to <strong className="text-white">Record Always / Push-to-Talk</strong>.</li>
                    <li>Export format: <strong className="text-amber-300">MP4 (NVIDIA NVENC or AMD AMF) 60 FPS</strong>.</li>
                  </ul>
                </div>

                <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3 text-xs">
                  <h4 className="font-extrabold text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    Chapter Markers & Video Editing
                  </h4>
                  <p className="text-zinc-400 leading-relaxed">
                    Use our built-in <strong className="text-white">REC Timer</strong> during your Mirillis Action! recording session to generate 1-click YouTube timestamps and Premiere/DaVinci Resolve XML chapter markers automatically!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Radio className="w-4 h-4 text-red-400 animate-pulse" />
            <span>Mirillis Action! Studio Companion • Active Game: <strong className="text-white">{activeSeries.gameTitle}</strong></span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
