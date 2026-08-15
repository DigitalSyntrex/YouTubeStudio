import React, { useState } from "react";
import { X, Clock, Plus, Trash2, Copy, Check, AlertCircle, Sparkles, CheckCircle2, ArrowUpDown } from "lucide-react";
import { Chapter, Episode } from "../types";

interface ChapterManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  episodes: Episode[];
  onUpdateEpisodeChapters: (episodeId: number, chapters: Chapter[]) => void;
}

export const ChapterManagerModal: React.FC<ChapterManagerModalProps> = ({
  isOpen,
  onClose,
  episodes,
  onUpdateEpisodeChapters,
}) => {
  if (!isOpen) return null;

  const [selectedEpId, setSelectedEpId] = useState<number>(episodes?.[0]?.id || 0);
  const currentEp = (episodes || []).find((e) => e?.id === selectedEpId) || episodes?.[0];

  const [chapters, setChapters] = useState<Chapter[]>(currentEp?.chapters || [
    { timestamp: "00:00", title: "Episode Introduction" },
    { timestamp: "05:20", title: "Exploration & Quest Progression" },
    { timestamp: "18:45", title: "Boss Encounter & Combat Strategy" },
    { timestamp: "32:10", title: "Key Loot & Episode Outro" },
  ]);

  const [copied, setCopied] = useState(false);

  // Sync state when selected episode changes
  const handleSelectEpisode = (epId: number) => {
    setSelectedEpId(epId);
    const ep = (episodes || []).find((e) => e?.id === epId);
    if (ep) {
      setChapters(ep.chapters && ep.chapters.length > 0 ? ep.chapters : [
        { timestamp: "00:00", title: "Introduction & Recount" },
        { timestamp: "10:00", title: "Main Quest Objective" },
        { timestamp: "25:00", title: "Boss Encounter" },
      ]);
    }
  };

  const handleAddChapter = () => {
    const lastTimestamp = chapters[chapters.length - 1]?.timestamp || "00:00";
    // simple increment
    let newTs = "10:00";
    if (lastTimestamp) {
      const parts = lastTimestamp.split(":").map(Number);
      if (parts.length === 2) {
        const newMin = parts[0] + 5;
        newTs = `${newMin < 10 ? "0" : ""}${newMin}:${parts[1] < 10 ? "0" : ""}${parts[1]}`;
      }
    }
    setChapters([...chapters, { timestamp: newTs, title: "New Chapter Event" }]);
  };

  const handleUpdateChapter = (index: number, field: "timestamp" | "title", value: string) => {
    const updated = [...chapters];
    updated[index] = { ...updated[index], [field]: value };
    setChapters(updated);
  };

  const handleDeleteChapter = (index: number) => {
    if (chapters.length <= 1) return;
    setChapters(chapters.filter((_, i) => i !== index));
  };

  const handleSortChapters = () => {
    const sorted = [...chapters].sort((a, b) => {
      const toSeconds = (ts: string) => {
        const parts = ts.split(":").map(Number);
        if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
        if (parts.length === 2) return parts[0] * 60 + parts[1];
        return 0;
      };
      return toSeconds(a.timestamp) - toSeconds(b.timestamp);
    });
    setChapters(sorted);
  };

  const handleSaveToEpisode = () => {
    if (currentEp) {
      onUpdateEpisodeChapters(currentEp.id, chapters);
    }
  };

  // Validation
  const hasZeroStart = chapters.some((c) => c.timestamp === "00:00" || c.timestamp === "0:00");
  const hasMinCount = chapters.length >= 3;
  const isValidYouTube = hasZeroStart && hasMinCount;

  // Formatted Output String
  const formattedText = `CHAPTER TIMESTAMPS:\n` + chapters.map((c) => `${c.timestamp} - ${c.title}`).join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedText);
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
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                YouTube Chapter & Timestamp Manager
              </h2>
              <p className="text-xs text-zinc-400">
                Create & validate scannable chapter markers for video progress scrubbers.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-zinc-200">
          {/* Episode Selector */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#18181c] p-4 rounded-xl border border-zinc-800">
            <div>
              <label className="text-xs text-zinc-400 block mb-1 font-semibold">Select Target Episode:</label>
              <select
                value={selectedEpId}
                onChange={(e) => handleSelectEpisode(Number(e.target.value))}
                className="bg-black/50 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 font-medium"
              >
                {episodes.map((ep) => (
                  <option key={ep.id} value={ep.id}>
                    Ep {ep.partNumber}: {ep.shortTitle} ({ep.estDurationMinutes} mins)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSortChapters}
                className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold rounded-lg text-zinc-300 flex items-center gap-1.5 transition"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" /> Sort Timestamps
              </button>
              <button
                onClick={handleAddChapter}
                className="px-3 py-2 bg-red-600 hover:bg-red-500 text-xs font-semibold rounded-lg text-white flex items-center gap-1.5 transition shadow-lg shadow-red-900/20"
              >
                <Plus className="w-3.5 h-3.5" /> Add Chapter
              </button>
            </div>
          </div>

          {/* Validation Status Box */}
          <div className={`p-4 rounded-xl border flex items-center gap-3 ${
            isValidYouTube
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-amber-500/10 border-amber-500/30 text-amber-300"
          }`}>
            {isValidYouTube ? <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" /> : <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />}
            <div className="text-xs">
              <span className="font-bold">{isValidYouTube ? "Valid YouTube Chapters" : "Chapter Rule Warning:"}</span>{" "}
              {!hasZeroStart && "Chapters MUST start with 00:00 for YouTube scrubbing bar to trigger. "}
              {!hasMinCount && "YouTube requires at least 3 chapter timestamps. "}
              {isValidYouTube && "Chapters meet all YouTube player requirements and will automatically generate scrub markers on video upload."}
            </div>
          </div>

          {/* Chapter Items Editor */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Chapter Timeline:</label>
            <div className="space-y-2">
              {chapters.map((chapter, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-[#18181c] p-3 rounded-xl border border-zinc-800 hover:border-zinc-700 transition">
                  <span className="text-xs font-mono text-zinc-500 w-6 text-center">{idx + 1}</span>
                  <input
                    type="text"
                    value={chapter.timestamp}
                    onChange={(e) => handleUpdateChapter(idx, "timestamp", e.target.value)}
                    placeholder="00:00"
                    className="w-24 bg-black/50 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs font-mono text-amber-400 focus:outline-none focus:border-red-500 text-center font-bold"
                  />
                  <input
                    type="text"
                    value={chapter.title}
                    onChange={(e) => handleUpdateChapter(idx, "title", e.target.value)}
                    placeholder="Chapter title..."
                    className="flex-1 bg-black/50 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                  <button
                    onClick={() => handleDeleteChapter(idx)}
                    disabled={chapters.length <= 1}
                    className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg disabled:opacity-30 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Raw Output Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">YouTube Description Output:</label>
              <button
                onClick={handleCopy}
                className="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Description Block"}
              </button>
            </div>
            <textarea
              readOnly
              value={formattedText}
              rows={4}
              className="w-full bg-black/60 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-zinc-300 focus:outline-none select-all"
            />
          </div>

          {/* Save Button */}
          <div className="pt-2 flex justify-end gap-3 border-t border-zinc-800">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold rounded-lg text-zinc-300 transition"
            >
              Close
            </button>
            <button
              onClick={() => {
                handleSaveToEpisode();
                onClose();
              }}
              className="px-5 py-2 bg-red-600 hover:bg-red-500 text-xs font-semibold rounded-lg text-white flex items-center gap-1.5 shadow-lg shadow-red-900/30 transition"
            >
              <Check className="w-4 h-4" /> Save to Episode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
