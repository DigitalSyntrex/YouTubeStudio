import React, { useState } from "react";
import { X, Film, Plus, Trash2, Smartphone, Copy, Check, Sparkles, CheckCircle2 } from "lucide-react";
import { Episode } from "../types";

interface ShortsClipperModalProps {
  isOpen: boolean;
  onClose: () => void;
  episodes: Episode[];
  selectedEpisode?: Episode | null;
}

interface ClipEntry {
  id: string;
  episodePart: number;
  timecode: string; // "02:18 - 02:58"
  title: string;
  hookOverlay: string;
  platform: "YouTube Shorts" | "TikTok" | "Instagram Reels";
  status: "planned" | "rendered" | "published";
  tags: string[];
}

export const ShortsClipperModal: React.FC<ShortsClipperModalProps> = ({
  isOpen,
  onClose,
  episodes,
  selectedEpisode,
}) => {
  if (!isOpen) return null;

  const currentEp = selectedEpisode || episodes[0];

  const [clips, setClips] = useState<ClipEntry[]>([
    {
      id: "c1",
      episodePart: currentEp?.partNumber || 1,
      timecode: "02:18 - 02:58",
      title: "Ifrit Awakens & Punches Phoenix",
      hookOverlay: "THIS CUTSCENE BROKE THE INTERNET! 🔥",
      platform: "YouTube Shorts",
      status: "published",
      tags: ["#Shorts", "#FF16", "#FinalFantasy16", "#Eikon"],
    },
    {
      id: "c2",
      episodePart: currentEp?.partNumber || 1,
      timecode: "48:15 - 48:55",
      title: "Clive Sword Parrying Lord Murdoch",
      hookOverlay: "CAN YOU PERFECT PARRY THIS COMBAT? ⚔️",
      platform: "TikTok",
      status: "rendered",
      tags: ["#Gaming", "#FF16Clips", "#ParryMaster"],
    },
  ]);

  const [newTimecode, setNewTimecode] = useState("10:00 - 10:45");
  const [newTitle, setNewTitle] = useState("Boss Finisher Moment");
  const [newHook, setNewHook] = useState("UNBELIEVABLE BOSS FINISHER!");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAddClip = () => {
    const newClip: ClipEntry = {
      id: Date.now().toString(),
      episodePart: currentEp?.partNumber || 1,
      timecode: newTimecode,
      title: newTitle,
      hookOverlay: newHook,
      platform: "YouTube Shorts",
      status: "planned",
      tags: ["#Shorts", `#Ep${currentEp?.partNumber || 1}`, "#FF16"],
    };
    setClips([...clips, newClip]);
    setNewTitle("");
  };

  const handleDeleteClip = (id: string) => {
    setClips(clips.filter((c) => c.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setClips(
      clips.map((c) => {
        if (c.id === id) {
          const nextStatus =
            c.status === "planned" ? "rendered" : c.status === "rendered" ? "published" : "planned";
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const handleCopyTags = (clip: ClipEntry) => {
    const tagStr = `${clip.title} - ${clip.hookOverlay}\n${clip.tags.join(" ")}`;
    navigator.clipboard.writeText(tagStr);
    setCopiedId(clip.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#121215] border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-[#18181c]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-pink-500/10 border border-pink-500/30 rounded-xl text-pink-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                YouTube Shorts & TikTok Highlight Clipper
              </h2>
              <p className="text-xs text-zinc-400">
                Mark viral high-energy moments for 9:16 vertical clip campaigns.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-zinc-200">
          {/* Add Clip Form */}
          <div className="bg-[#18181c] p-4 rounded-xl border border-zinc-800 space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Add New Short / Reel Clip Highlight:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Timecode e.g. 02:18 - 02:58"
                value={newTimecode}
                onChange={(e) => setNewTimecode(e.target.value)}
                className="bg-black/50 border border-zinc-700 rounded-lg p-2 text-xs font-mono text-amber-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Clip Title / Highlight Event"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="bg-black/50 border border-zinc-700 rounded-lg p-2 text-xs text-white focus:outline-none"
              />
              <input
                type="text"
                placeholder="Hook Text Overlay e.g. WAIT FOR IT..."
                value={newHook}
                onChange={(e) => setNewHook(e.target.value)}
                className="bg-black/50 border border-zinc-700 rounded-lg p-2 text-xs text-pink-400 focus:outline-none font-bold"
              />
            </div>
            <button
              onClick={handleAddClip}
              disabled={!newTitle.trim()}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-500 disabled:opacity-40 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-lg shadow-pink-900/30 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Save Clip Marker
            </button>
          </div>

          {/* Clips List */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
              Planned Vertical Clips ({clips.length}):
            </span>

            <div className="space-y-3">
              {clips.map((clip) => (
                <div key={clip.id} className="bg-[#18181c] p-4 rounded-xl border border-zinc-800 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {clip.timecode}
                      </span>
                      <span className="text-xs font-bold text-white">Ep {clip.episodePart}: {clip.title}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(clip.id)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border transition ${
                          clip.status === "published"
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : clip.status === "rendered"
                            ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700"
                        }`}
                      >
                        {clip.status}
                      </button>

                      <button
                        onClick={() => handleDeleteClip(clip.id)}
                        className="p-1 text-zinc-500 hover:text-red-400 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs font-bold text-pink-400 bg-black/40 p-2 rounded border border-zinc-800 flex items-center justify-between">
                    <span>Hook Overlay: "{clip.hookOverlay}"</span>
                    <button
                      onClick={() => handleCopyTags(clip)}
                      className="text-[10px] text-zinc-300 hover:text-white font-semibold flex items-center gap-1"
                    >
                      {copiedId === clip.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copiedId === clip.id ? "Copied Tags" : "Copy Tags"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
