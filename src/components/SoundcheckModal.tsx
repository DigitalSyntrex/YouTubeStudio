import React, { useState, useEffect } from "react";
import { X, Mic, Volume2, ShieldCheck, CheckSquare, Square, Zap, Sliders, Radio, Play, Pause } from "lucide-react";

interface SoundcheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SoundcheckModal: React.FC<SoundcheckModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [micDb, setMicDb] = useState<number>(-6);
  const [gameDb, setGameDb] = useState<number>(-18);
  const [isTestRunning, setIsTestRunning] = useState<boolean>(true);
  const [audioLevels, setAudioLevels] = useState<number[]>([40, 65, 80, 55, 70, 90, 60, 45, 75, 85, 50, 60]);

  const [checklist, setChecklist] = useState([
    { id: "res", label: "Set Recording Resolution to 1440p60 or 4K60 (Unlocks VP09/AV1 High-Bitrate YouTube Codec)", checked: true },
    { id: "bitrate", label: "OBS Video Encoder: CQP 18 or 35,000 Kbps CBR (Prevents pixelation during particle effects)", checked: true },
    { id: "levels", label: "Audio Balance: Voice Mic (-6dB peak) vs Game BGM (-18dB) calibrated", checked: true },
    { id: "noisegate", label: "OBS Noise Suppression & Expander active (Filters mechanical keyboard clicks)", checked: true },
    { id: "copyright", label: "In-Game Streamer Safe Mode Enabled (Mutes licensed BGM for zero copyright strikes)", checked: true },
    { id: "hotkey", label: "Hotkeys Armed: Pause Recording, Mute Mic, Bookmark Timestamp", checked: false },
    { id: "torgal", label: "Mic Pop Filter centered & 4-6 inches from mouth", checked: true },
  ]);

  // Simulate audio level pulse
  useEffect(() => {
    if (!isTestRunning) return;
    const interval = setInterval(() => {
      setAudioLevels((prev) =>
        prev.map(() => Math.floor(Math.random() * 55) + 35)
      );
    }, 150);
    return () => clearInterval(interval);
  }, [isTestRunning]);

  const toggleCheck = (id: string) => {
    setChecklist(
      checklist.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const completedCount = checklist.filter((i) => i.checked).length;
  const isReady = completedCount === checklist.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#121215] border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-[#18181c]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Creator Recording Studio & Soundcheck
              </h2>
              <p className="text-xs text-zinc-400">
                Pre-flight checklist for voice clarity, game audio balance, and YouTube 4K bitrate settings.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-zinc-200">
          {/* Live Audio Visualizer */}
          <div className="bg-[#18181c] p-5 rounded-xl border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className={`w-4 h-4 ${isTestRunning ? "text-emerald-400 animate-pulse" : "text-zinc-500"}`} />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Voice & Game Audio Balance Simulator
                </span>
              </div>
              <button
                onClick={() => setIsTestRunning(!isTestRunning)}
                className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 font-semibold rounded flex items-center gap-1.5 transition"
              >
                {isTestRunning ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                {isTestRunning ? "Pause Test" : "Run Soundcheck"}
              </button>
            </div>

            {/* Audio Bar Meters */}
            <div className="grid grid-cols-2 gap-4 bg-black/50 p-4 rounded-xl border border-zinc-800">
              {/* Mic Channel */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-indigo-400 flex items-center gap-1">
                    <Mic className="w-3.5 h-3.5" /> Commentary Mic
                  </span>
                  <span className="font-mono font-bold text-white">{micDb} dB</span>
                </div>
                <div className="h-6 bg-zinc-900 rounded-lg p-1 flex items-center gap-1 overflow-hidden">
                  {audioLevels.slice(0, 8).map((lvl, idx) => (
                    <div
                      key={idx}
                      className="flex-1 h-full rounded transition-all duration-100"
                      style={{
                        height: isTestRunning ? `${lvl}%` : "15%",
                        backgroundColor: lvl > 82 ? "#ef4444" : lvl > 65 ? "#eab308" : "#6366f1",
                      }}
                    />
                  ))}
                </div>
                <input
                  type="range"
                  min="-30"
                  max="0"
                  value={micDb}
                  onChange={(e) => setMicDb(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-zinc-700 rounded cursor-pointer"
                />
              </div>

              {/* Game Audio Channel */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" /> Game BGM & SFX
                  </span>
                  <span className="font-mono font-bold text-white">{gameDb} dB</span>
                </div>
                <div className="h-6 bg-zinc-900 rounded-lg p-1 flex items-center gap-1 overflow-hidden">
                  {audioLevels.slice(4, 12).map((lvl, idx) => (
                    <div
                      key={idx}
                      className="flex-1 h-full rounded transition-all duration-100"
                      style={{
                        height: isTestRunning ? `${Math.max(10, lvl - 15)}%` : "10%",
                        backgroundColor: lvl > 85 ? "#ef4444" : lvl > 60 ? "#eab308" : "#10b981",
                      }}
                    />
                  ))}
                </div>
                <input
                  type="range"
                  min="-40"
                  max="-5"
                  value={gameDb}
                  onChange={(e) => setGameDb(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-1 bg-zinc-700 rounded cursor-pointer"
                />
              </div>
            </div>
            <div className="text-[11px] text-zinc-400 text-center font-mono">
              Ideal Ratio: Voice (-6dB peak) sitting 10-12dB above Game Audio (-18dB peak).
            </div>
          </div>

          {/* Interactive Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Pre-Recording Studio Checklist:
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                isReady ? "bg-emerald-500/10 text-emerald-400" : "bg-indigo-500/10 text-indigo-400"
              }`}>
                {completedCount} / {checklist.length} Verified
              </span>
            </div>

            <div className="space-y-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition select-none ${
                    item.checked
                      ? "bg-[#18181c] border-zinc-800 text-zinc-200"
                      : "bg-[#141417] border-zinc-800/60 text-zinc-500"
                  }`}
                >
                  {item.checked ? (
                    <CheckSquare className="w-5 h-5 text-indigo-400 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-zinc-600 shrink-0" />
                  )}
                  <span className={`text-xs font-medium ${item.checked ? "text-white" : "line-through text-zinc-500"}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Ready Banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            isReady
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-indigo-500/10 border-indigo-500/30 text-indigo-300"
          }`}>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 shrink-0" />
              <div>
                <span className="text-sm font-bold">
                  {isReady ? "STUDIO READY TO RECORD!" : "Complete Pre-Flight Soundcheck"}
                </span>
                <p className="text-xs opacity-80">
                  {isReady
                    ? "Audio levels and resolution settings meet 4K YouTube broadcast standards."
                    : "Complete all checklist items above before pressing record."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
