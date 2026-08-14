import React, { useState } from "react";
import { X, Plus, Play, Sparkles, RefreshCw, Check, ArrowRight } from "lucide-react";
import { Episode } from "../types";
import { safeFetchJson } from "../utils/apiUtils";

interface AddEpisodeModalProps {
  currentEpisodesCount: number;
  gameTitle: string;
  episodes?: Episode[];
  onClose: () => void;
  onAddEpisode: (episode: Episode) => void;
}

export const AddEpisodeModal: React.FC<AddEpisodeModalProps> = ({
  currentEpisodesCount,
  gameTitle,
  episodes = [],
  onClose,
  onAddEpisode,
}) => {
  const nextPart = currentEpisodesCount + 1;
  const partFormatted = nextPart < 10 ? `0${nextPart}` : `${nextPart}`;

  // Find previous episode if available
  const prevEp = episodes && episodes.length > 0 ? episodes[episodes.length - 1] : null;

  const [title, setTitle] = useState(`${gameTitle} #${partFormatted} - NEW EPISODE`);
  const [shortTitle, setShortTitle] = useState(`Episode ${nextPart}`);
  const [world, setWorld] = useState(prevEp?.world || "Main Quest");
  const [estDuration, setEstDuration] = useState(105);
  const [startPoint, setStartPoint] = useState(
    prevEp ? prevEp.endPoint : "Game Opening & Tutorial"
  );
  const [endPoint, setEndPoint] = useState(
    prevEp ? `Explore ${prevEp.world} & Next Milestone` : "Destination & Boss Defeat"
  );
  const [keyEventsText, setKeyEventsText] = useState("Key story beat 1\nKey story beat 2");
  const [partyMembersText, setPartyMembersText] = useState(
    prevEp?.partyMembers?.join(", ") || "Hero, Ally"
  );
  const [bossStrategiesText, setBossStrategiesText] = useState("Boss Strategy: Focus weak point");
  const [tagsText, setTagsText] = useState(`${gameTitle}, Lets Play, Walkthrough, Episode ${nextPart}`);

  const [generatingMilestones, setGeneratingMilestones] = useState(false);
  const [milestoneNote, setMilestoneNote] = useState<string | null>(null);

  // Auto-generate start & end milestones using previous episode context & AI
  const handleAutoGenerateMilestones = async () => {
    setGeneratingMilestones(true);
    setMilestoneNote(null);
    try {
      const prevEnd = prevEp?.endPoint || "Game Opening";
      const data = await safeFetchJson("/api/gemini/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameTitle,
          episodeTitle: title,
          partNumber: nextPart,
          world,
          prevEpisodeEndPoint: prevEnd,
          startPoint: startPoint || prevEnd,
          endPoint,
          keyEvents: keyEventsText,
          style: "High energy, SEO optimized JRPG walkthrough",
        }),
      });

      if (data.suggestedStartPoint) {
        setStartPoint(data.suggestedStartPoint);
      } else if (prevEnd) {
        setStartPoint(prevEnd);
      }

      if (data.suggestedEndPoint) {
        setEndPoint(data.suggestedEndPoint);
      }

      if (data.viralTitles && data.viralTitles.length > 0) {
        setTitle(data.viralTitles[0]);
      }

      if (data.keyEvents && data.keyEvents.length > 0) {
        setKeyEventsText(data.keyEvents.join("\n"));
      }

      setMilestoneNote(`✨ Milestones auto-linked from Episode ${prevEp ? prevEp.partNumber : 'start'} to Episode ${nextPart}!`);
      setTimeout(() => setMilestoneNote(null), 4000);
    } catch (err: any) {
      // Fallback
      if (prevEp) {
        setStartPoint(prevEp.endPoint);
        setEndPoint(`Advancing into ${world} & Defeating Area Boss`);
        setMilestoneNote(`Linked start milestone from Ep ${prevEp.partNumber} end point.`);
      }
    } finally {
      setGeneratingMilestones(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const keyEvents = keyEventsText.split("\n").filter((line) => line.trim().length > 0);
    const partyMembers = partyMembersText.split(",").map((p) => p.trim()).filter(Boolean);
    const bossStrategies = bossStrategiesText.split("\n").filter((line) => line.trim().length > 0);
    const tags = tagsText.split(",").map((t) => t.trim()).filter(Boolean);

    const newEp: Episode = {
      id: Date.now(),
      partNumber: nextPart,
      world,
      title: title.trim(),
      shortTitle: shortTitle.trim() || `Part ${nextPart}`,
      altTitles: [`${gameTitle} Episode ${nextPart} Walkthrough`],
      estDurationMinutes: estDuration,
      startPoint: startPoint.trim(),
      endPoint: endPoint.trim(),
      keyEvents,
      keyItemsAndEspers: ["Key Item"],
      partyMembers,
      status: "not_started",
      description: `Welcome to Episode ${nextPart} of our ${gameTitle} 100% Walkthrough & Let's Play (90-120 Min Longform)!\n\nIn this episode we progress from ${startPoint} to ${endPoint}.\n\nTIMESTAMPS:\n00:00 - Episode Start & Setup (${startPoint})\n22:15 - Area Exploration & Side Quests\n48:30 - Dungeon & Key Encounters\n1:15:00 - Major Boss Battle & Lore\n1:35:00 - Reaching ${endPoint} & Outro\n\n#${gameTitle.replace(/\s+/g, "")} #LetsPlay #Gaming #Walkthrough`,
      chapters: [
        { timestamp: "00:00", title: startPoint.trim() },
        { timestamp: "22:15", title: "Area Exploration & Side Quests" },
        { timestamp: "48:30", title: "Dungeon & Key Encounters" },
        { timestamp: "1:15:00", title: "Major Boss Battle & Lore" },
        { timestamp: "1:35:00", title: endPoint.trim() }
      ],
      tags,
      thumbnailConfig: {
        backgroundPreset: "vector",
        featuredCharacter: partyMembers[0] || "Hero",
        overlayText: shortTitle.toUpperCase(),
        subText: `EPISODE ${partFormatted}`,
        themeColor: "#38bdf8"
      },
      bossStrategies,
      equipmentNotes: "Check local shop before advancing."
    };

    onAddEpisode(newEp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#121212] border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-5 bg-[#09090b] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Play className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">Add Episode #{nextPart}</h2>
              <p className="text-xs text-zinc-400">{gameTitle} Playthrough</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white bg-[#18181b] hover:bg-[#27272a] rounded-lg transition-colors border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">YouTube Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#09090b] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Short Title / Subtitle</label>
              <input
                type="text"
                value={shortTitle}
                onChange={(e) => setShortTitle(e.target.value)}
                className="w-full bg-[#09090b] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Act / Area / World</label>
              <input
                type="text"
                value={world}
                onChange={(e) => setWorld(e.target.value)}
                className="w-full bg-[#09090b] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* AI Start & End Milestone Auto-Generation Strip */}
          <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-xs font-bold text-purple-200">
                  Auto-Link Milestones & AI Studio
                </span>
              </div>
              <button
                type="button"
                onClick={handleAutoGenerateMilestones}
                disabled={generatingMilestones}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-purple-900/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {generatingMilestones ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                )}
                <span>Auto-Generate Milestones</span>
              </button>
            </div>
            {prevEp && (
              <p className="text-[11px] text-zinc-400">
                Start milestone automatically set to Episode #{prevEp.partNumber}'s End Point (<strong className="text-purple-300">{prevEp.endPoint}</strong>).
              </p>
            )}
            {milestoneNote && (
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 animate-in fade-in">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{milestoneNote}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Start Point (Milestone)</label>
              <input
                type="text"
                value={startPoint}
                onChange={(e) => setStartPoint(e.target.value)}
                placeholder="Starting milestone or location..."
                className="w-full bg-[#09090b] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">End Point (Milestone)</label>
              <input
                type="text"
                value={endPoint}
                onChange={(e) => setEndPoint(e.target.value)}
                placeholder="Destination or boss victory..."
                className="w-full bg-[#09090b] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Key Story Beats / Events (One per line)</label>
            <textarea
              rows={2}
              value={keyEventsText}
              onChange={(e) => setKeyEventsText(e.target.value)}
              className="w-full bg-[#09090b] border border-white/10 rounded-lg px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Boss Tactics & Notes</label>
            <input
              type="text"
              value={bossStrategiesText}
              onChange={(e) => setBossStrategiesText(e.target.value)}
              className="w-full bg-[#09090b] border border-white/10 rounded-lg px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">SEO Tags (comma separated)</label>
            <input
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              className="w-full bg-[#09090b] border border-white/10 rounded-lg px-3.5 py-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-400"
            />
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#18181b] hover:bg-[#27272a] text-zinc-300 rounded-lg text-xs font-semibold border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-500 hover:bg-blue-400 text-zinc-950 rounded-lg text-xs font-bold transition-colors shadow-md shadow-blue-500/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Episode</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
