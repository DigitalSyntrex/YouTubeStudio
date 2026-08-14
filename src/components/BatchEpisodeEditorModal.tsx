import React, { useState } from "react";
import { X, CheckSquare, Square, Layers, Edit, Check, Copy, Tag, Clock, Trash2, Sparkles } from "lucide-react";
import { Episode, EpisodeStatus } from "../types";

interface BatchEpisodeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  episodes: Episode[];
  onBatchUpdateEpisodes: (updatedEpisodes: Episode[]) => void;
}

export const BatchEpisodeEditorModal: React.FC<BatchEpisodeEditorModalProps> = ({
  isOpen,
  onClose,
  episodes,
  onBatchUpdateEpisodes,
}) => {
  if (!isOpen) return null;

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [targetStatus, setTargetStatus] = useState<EpisodeStatus>("published");
  const [tagToAppend, setTagToAppend] = useState<string>("4K60");
  const [durationToSet, setDurationToSet] = useState<number>(120);
  const [copied, setCopied] = useState<boolean>(false);

  const isAllSelected = selectedIds.length === episodes.length && episodes.length > 0;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(episodes.map((e) => e.id));
    }
  };

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleApplyStatusChange = () => {
    if (selectedIds.length === 0) return;
    const updated = episodes.map((ep) => {
      if (selectedIds.includes(ep.id)) {
        return { ...ep, status: targetStatus };
      }
      return ep;
    });
    onBatchUpdateEpisodes(updated);
  };

  const handleApplyTagAppend = () => {
    if (selectedIds.length === 0 || !tagToAppend.trim()) return;
    const updated = episodes.map((ep) => {
      if (selectedIds.includes(ep.id)) {
        const existingTags = ep.tags || [];
        if (!existingTags.includes(tagToAppend)) {
          return { ...ep, tags: [...existingTags, tagToAppend] };
        }
      }
      return ep;
    });
    onBatchUpdateEpisodes(updated);
  };

  const handleApplyDurationSet = () => {
    if (selectedIds.length === 0) return;
    const updated = episodes.map((ep) => {
      if (selectedIds.includes(ep.id)) {
        return { ...ep, estDurationMinutes: durationToSet };
      }
      return ep;
    });
    onBatchUpdateEpisodes(updated);
  };

  const handleCopyDescriptions = () => {
    const selectedEps = episodes.filter((e) => selectedIds.includes(e.id));
    if (selectedEps.length === 0) return;

    const formatted = selectedEps
      .map(
        (ep) =>
          `===============================\nEPISODE ${ep.partNumber}: ${ep.title}\n===============================\n${ep.description}\n\n`
      )
      .join("\n");

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAutoChainMilestones = () => {
    if (episodes.length === 0) return;
    const sorted = [...episodes].sort((a, b) => a.partNumber - b.partNumber);
    const updated = sorted.map((ep, idx) => {
      if (idx === 0) return ep;
      const prevEp = sorted[idx - 1];
      return {
        ...ep,
        startPoint: prevEp.endPoint || ep.startPoint,
      };
    });
    onBatchUpdateEpisodes(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#121215] border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-[#18181c]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Batch Episode Mass Editor & Bulk Status Manager
              </h2>
              <p className="text-xs text-zinc-400">
                Perform bulk status changes, mass tag append, and bulk description exports across episodes.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-zinc-200">
          {/* Select All Bar & Series Milestone Quick Action */}
          <div className="bg-[#18181c] p-4 rounded-xl border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-2 text-xs font-bold text-white hover:text-blue-400 transition cursor-pointer"
            >
              {isAllSelected ? <CheckSquare className="w-5 h-5 text-blue-400" /> : <Square className="w-5 h-5 text-zinc-600" />}
              {isAllSelected ? "Deselect All Episodes" : "Select All Episodes"}
            </button>

            <button
              type="button"
              onClick={handleAutoChainMilestones}
              className="px-3.5 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-sm"
              title="Automatically links every episode's Start Milestone to the previous episode's End Milestone"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Auto-Chain All Start/End Milestones</span>
            </button>

            <span className="text-xs font-mono font-bold text-blue-400">
              {selectedIds.length} of {episodes.length} Episodes Selected
            </span>
          </div>

          {/* Bulk Actions Panel */}
          {selectedIds.length > 0 && (
            <div className="bg-black/50 p-4 rounded-xl border border-zinc-800 space-y-4">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block">
                Bulk Operations for {selectedIds.length} Selected Episodes:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Status Change */}
                <div className="space-y-1.5">
                  <label className="text-[11px] text-zinc-400 block font-semibold">Bulk Set Status:</label>
                  <div className="flex gap-2">
                    <select
                      value={targetStatus}
                      onChange={(e) => setTargetStatus(e.target.value as EpisodeStatus)}
                      className="bg-[#18181c] border border-zinc-700 rounded p-2 text-xs text-white flex-1"
                    >
                      <option value="published">Published</option>
                      <option value="uploaded">Uploaded</option>
                      <option value="edited">Edited</option>
                      <option value="recorded">Recorded</option>
                      <option value="not_started">Not Started</option>
                    </select>
                    <button
                      onClick={handleApplyStatusChange}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded transition"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Tag Append */}
                <div className="space-y-1.5">
                  <label className="text-[11px] text-zinc-400 block font-semibold">Bulk Append Tag:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagToAppend}
                      onChange={(e) => setTagToAppend(e.target.value)}
                      placeholder="e.g. 4K60"
                      className="bg-[#18181c] border border-zinc-700 rounded p-2 text-xs text-white flex-1"
                    />
                    <button
                      onClick={handleApplyTagAppend}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded transition"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Duration Set */}
                <div className="space-y-1.5">
                  <label className="text-[11px] text-zinc-400 block font-semibold">Bulk Duration (Mins):</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={durationToSet}
                      onChange={(e) => setDurationToSet(Number(e.target.value))}
                      className="bg-[#18181c] border border-zinc-700 rounded p-2 text-xs text-white flex-1"
                    />
                    <button
                      onClick={handleApplyDurationSet}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded transition"
                    >
                      Set
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCopyDescriptions}
                className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition border border-zinc-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied Selected Descriptions!" : `Export ${selectedIds.length} Descriptions to Clipboard`}
              </button>
            </div>
          )}

          {/* Episodes Selection List */}
          <div className="space-y-2">
            {episodes.map((ep) => {
              const isSelected = selectedIds.includes(ep.id);
              return (
                <div
                  key={ep.id}
                  onClick={() => toggleSelect(ep.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition select-none ${
                    isSelected
                      ? "bg-blue-950/30 border-blue-500/50 text-white"
                      : "bg-[#18181c] border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 text-blue-400 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-zinc-600 shrink-0" />
                    )}
                    <div>
                      <div className="text-xs font-bold text-white">
                        Ep #{ep.partNumber}: {ep.shortTitle}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5">
                        {ep.estDurationMinutes} mins • {ep.world}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    ep.status === "published"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-zinc-800 text-zinc-400"
                  }`}>
                    {ep.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
