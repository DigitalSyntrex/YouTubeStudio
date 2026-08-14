import React, { useState } from "react";
import { X, Layout, Plus, Trash2, Youtube, Tv, ExternalLink, Check, Copy, Sparkles } from "lucide-react";
import { Episode } from "../types";

interface EndScreenPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  episodes: Episode[];
  selectedEpisode?: Episode | null;
}

export const EndScreenPlannerModal: React.FC<EndScreenPlannerModalProps> = ({
  isOpen,
  onClose,
  episodes,
  selectedEpisode,
}) => {
  if (!isOpen) return null;

  const currentEp = selectedEpisode || episodes[0];

  const nextEp = episodes.find((e) => e.partNumber === (currentEp?.partNumber || 1) + 1) || episodes[1];
  const prevEp = episodes.find((e) => e.partNumber === (currentEp?.partNumber || 1) - 1) || episodes[0];

  const [cards, setCards] = useState([
    { id: "1", type: "Next Episode", title: nextEp ? `Ep ${nextEp.partNumber}: ${nextEp.shortTitle}` : "Next Playthrough Video", pos: "top-right" },
    { id: "2", type: "Subscribe Badge", title: "Subscribe to Channel", pos: "bottom-left" },
    { id: "3", type: "Series Playlist", title: "100% Playthrough Playlist", pos: "bottom-right" },
  ]);

  const [infoCards, setInfoCards] = useState([
    { id: "i1", timestamp: "08:15", teaserText: "Watch Episode 1 - Night of Fire", url: "https://youtube.com/watch?v=..." },
    { id: "i2", timestamp: "24:30", teaserText: "Full Boss Weakness Strategy Guide", url: "https://youtube.com/watch?v=..." },
  ]);

  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    const summary = `END SCREEN PLANNER:\n- Element 1: Next Episode (${nextEp?.shortTitle || "Next Ep"})\n- Element 2: Subscribe Button\n- Element 3: Full Series Playlist\n\ni-CARD POPUPS:\n` +
      infoCards.map((ic) => `${ic.timestamp} -> ${ic.teaserText}`).join("\n");
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#121215] border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-[#18181c]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
              <Tv className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                YouTube End Screen & Info-Cards Planner
              </h2>
              <p className="text-xs text-zinc-400">
                Configure last 20 seconds end-slate elements & mid-video i-Card teaser popups.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-zinc-200">
          {/* Simulated 16:9 Video Player Screen */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
              End Screen 16:9 Player Overlay Canvas (Last 20 Seconds):
            </span>
            <div className="relative aspect-video w-full bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between p-4 shadow-inner">
              {/* Fake Video Canvas background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black via-zinc-900 to-red-950/40 opacity-80" />

              {/* Video Title Overlay */}
              <div className="relative z-10 flex justify-between items-center bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-zinc-800">
                <span className="text-xs font-bold text-white truncate max-w-md">
                  Ep {currentEp?.partNumber}: {currentEp?.title}
                </span>
                <span className="text-[10px] font-mono bg-red-600 text-white px-2 py-0.5 rounded font-bold">
                  0:20 REMAINING
                </span>
              </div>

              {/* Interactive Card Elements Placement */}
              <div className="relative z-10 grid grid-cols-2 gap-4 h-full my-3">
                {/* Top Left */}
                <div className="flex items-start justify-start">
                  <div className="p-2.5 bg-black/80 border border-zinc-700 rounded-lg text-xs text-zinc-300 w-44 shadow-lg">
                    <div className="text-[10px] text-red-400 font-bold uppercase">Best for Viewer Video</div>
                    <div className="text-[11px] font-semibold text-white truncate">Auto YouTube Pick</div>
                  </div>
                </div>

                {/* Top Right */}
                <div className="flex items-start justify-end">
                  <div className="p-2.5 bg-red-600/20 border border-red-500/50 rounded-lg text-xs text-white w-48 shadow-lg">
                    <div className="text-[10px] text-red-300 font-bold uppercase">Next Episode</div>
                    <div className="text-[11px] font-bold truncate">{nextEp?.shortTitle || "Next Ep"}</div>
                  </div>
                </div>

                {/* Bottom Left */}
                <div className="flex items-end justify-start">
                  <div className="p-2 bg-black/80 border border-zinc-700 rounded-full flex items-center gap-2 pr-4 shadow-lg">
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-white text-xs">
                      YT
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-white">Subscribe</div>
                      <div className="text-[9px] text-zinc-400">Click to Join</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Right */}
                <div className="flex items-end justify-end">
                  <div className="p-2.5 bg-amber-500/20 border border-amber-500/40 rounded-lg text-xs text-amber-200 w-48 shadow-lg">
                    <div className="text-[10px] text-amber-400 font-bold uppercase">Playthrough Playlist</div>
                    <div className="text-[11px] font-bold truncate">100% Walkthrough Series</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info-Cards Popups Setup */}
          <div className="bg-[#18181c] p-5 rounded-xl border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Mid-Video i-Card Teaser Popups:
              </span>
              <button
                onClick={() =>
                  setInfoCards([...infoCards, { id: Date.now().toString(), timestamp: "15:00", teaserText: "Watch Related Episode", url: "" }])
                }
                className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" /> Add i-Card
              </button>
            </div>

            <div className="space-y-2">
              {infoCards.map((ic, idx) => (
                <div key={ic.id} className="flex items-center gap-3 bg-black/40 p-3 rounded-lg border border-zinc-800">
                  <input
                    type="text"
                    value={ic.timestamp}
                    onChange={(e) => {
                      const updated = [...infoCards];
                      updated[idx].timestamp = e.target.value;
                      setInfoCards(updated);
                    }}
                    className="w-20 bg-black/60 border border-zinc-700 rounded p-1.5 text-xs font-mono text-amber-400 text-center font-bold"
                  />
                  <input
                    type="text"
                    value={ic.teaserText}
                    onChange={(e) => {
                      const updated = [...infoCards];
                      updated[idx].teaserText = e.target.value;
                      setInfoCards(updated);
                    }}
                    placeholder="Teaser text..."
                    className="flex-1 bg-black/60 border border-zinc-700 rounded p-1.5 text-xs text-white"
                  />
                  <button
                    onClick={() => setInfoCards(infoCards.filter((item) => item.id !== ic.id))}
                    className="p-1.5 text-zinc-500 hover:text-red-400 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Copy Action */}
          <button
            onClick={handleCopySummary}
            className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 transition"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied End Screen Campaign Plan!" : "Copy End Screen & i-Card Campaign Plan"}
          </button>
        </div>
      </div>
    </div>
  );
};
