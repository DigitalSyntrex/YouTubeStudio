import React, { useState } from "react";
import { Episode, PlaythroughSeries } from "../types";
import { safeFetchJson } from "../utils/apiUtils";
import { ThumbnailBuilder } from "./ThumbnailBuilder";
import { getGameCharacterList, getCharacterBadgeIcon, cleanHeroName, normalizeHeroName, getCharacterEmojiIcon, getHeroAvatarUrl, resizeHeroAvatarImage, saveGlobalHeroAvatar, removeGlobalHeroAvatar } from "../utils/gameProtagonists";
import {
  X,
  Copy,
  Check,
  Sparkles,
  Youtube,
  BookOpen,
  MapPin,
  List,
  Tag,
  Clock,
  RefreshCw,
  Image as ImageIcon,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Minimize2,
  Maximize2,
  Plus,
  Users,
  UserCheck,
  UserPlus,
  Camera,
  Trash2,
  User,
  Upload
} from "lucide-react";

interface EpisodeDetailModalProps {
  episode: Episode;
  activeSeries?: PlaythroughSeries;
  onClose: () => void;
  onUpdateEpisode: (updated: Episode) => void;
}

export const EpisodeDetailModal: React.FC<EpisodeDetailModalProps> = ({
  episode,
  activeSeries,
  onClose,
  onUpdateEpisode,
}) => {
  const [activeTab, setActiveTab] = useState<"package" | "gameplay" | "ai" | "thumbnail">("package");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  // Editable states
  const [editedTitle, setEditedTitle] = useState(episode.title);
  const [editedDescription, setEditedDescription] = useState(episode.description);

  // AI enhancement states
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  const handleHeroImageUpload = async (heroName: string, file: File) => {
    if (!file) return;
    try {
      const dataUrl = await resizeHeroAvatarImage(file, 256);
      if (dataUrl) {
        const cleanName = cleanHeroName(heroName);
        const normName = normalizeHeroName(heroName);

        // Save to global avatar store
        saveGlobalHeroAvatar(heroName, dataUrl);
        saveGlobalHeroAvatar(cleanName, dataUrl);

        const updatedAvatars: Record<string, string> = {
          ...(episode.heroAvatars || {}),
          [cleanName]: dataUrl,
          [normName]: dataUrl,
        };

        // Map root key for character alias matching
        if (normName.includes("terra")) {
          updatedAvatars["terra"] = dataUrl;
        } else if (normName.includes("relm")) {
          updatedAvatars["relm"] = dataUrl;
        } else if (normName.includes("gau")) {
          updatedAvatars["gau"] = dataUrl;
        } else if (normName.includes("strago")) {
          updatedAvatars["strago"] = dataUrl;
        } else if (normName.includes("cyan")) {
          updatedAvatars["cyan"] = dataUrl;
        } else if (normName.includes("mog")) {
          updatedAvatars["mog"] = dataUrl;
        }

        onUpdateEpisode({
          ...episode,
          heroAvatars: updatedAvatars,
        });

        const starCount =
          activeSeries?.episodes?.filter((ep) =>
            ep.partyMembers?.some((p) => normalizeHeroName(p) === normName)
          ).length || 1;

        setAppliedNotification(
          `Portrait for "${cleanName}" uploaded & auto-applied across all ${starCount} episode${starCount === 1 ? "" : "s"} starring ${cleanName}!`
        );
        setTimeout(() => setAppliedNotification(null), 4500);
      }
    } catch (err) {
      console.error("Error uploading hero portrait:", err);
    }
  };

  const handleRemoveHeroImage = (heroName: string) => {
    const cleanName = cleanHeroName(heroName);
    const normName = normalizeHeroName(heroName);

    removeGlobalHeroAvatar(heroName);
    removeGlobalHeroAvatar(cleanName);

    const updatedAvatars = { ...(episode.heroAvatars || {}) };

    for (const key of Object.keys(updatedAvatars)) {
      if (normalizeHeroName(key) === normName) {
        delete updatedAvatars[key];
      }
    }

    onUpdateEpisode({
      ...episode,
      heroAvatars: updatedAvatars,
    });

    setAppliedNotification(`Removed portrait for "${cleanName}" across all series episodes.`);
    setTimeout(() => setAppliedNotification(null), 3500);
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCopyFullPackage = () => {
    const fullText = `TITLE:
${editedTitle}

DESCRIPTION:
${editedDescription}

CHAPTER TIMESTAMPS:
${episode.chapters.map((c) => `${c.timestamp} - ${c.title}`).join("\n")}

TAGS:
${episode.tags.join(", ")}
${episode.tags.map((t) => `#${t.replace(/\s+/g, "")}`).join(" ")}`;

    handleCopy(fullText, "full_package");
  };

  const currentGameTitle = activeSeries?.gameTitle || "YouTube Gaming Series";

  // Previous episode in series for auto milestone linking
  const prevEpisode = activeSeries?.episodes?.find(
    (ep) => ep.partNumber === episode.partNumber - 1
  );

  const runAiEnhance = async () => {
    setLoadingAi(true);
    setAiResult(null);
    try {
      const data = await safeFetchJson("/api/gemini/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameTitle: currentGameTitle,
          episodeTitle: editedTitle,
          partNumber: episode.partNumber,
          world: episode.world,
          prevEpisodeEndPoint: prevEpisode?.endPoint || "",
          startPoint: episode.startPoint,
          endPoint: episode.endPoint,
          description: editedDescription,
          keyEvents: episode.keyEvents.join(", "),
          style: "High energy, SEO optimized, engaging YouTube Let's Play",
        }),
      });
      setAiResult(data);
    } catch (err) {
      console.error("AI enhancement error:", err);
    } finally {
      setLoadingAi(false);
    }
  };

  const applyFullAiPackage = () => {
    if (!aiResult) return;
    const newTitle = aiResult.viralTitles?.[0] || editedTitle;
    const newDesc = aiResult.enhancedDescription || editedDescription;
    const newStart = aiResult.suggestedStartPoint || episode.startPoint;
    const newEnd = aiResult.suggestedEndPoint || episode.endPoint;
    const newKeyEvents = aiResult.keyEvents && aiResult.keyEvents.length > 0 ? aiResult.keyEvents : episode.keyEvents;
    const newChapters = aiResult.chapters && aiResult.chapters.length > 0 ? aiResult.chapters : episode.chapters;
    const newTags = aiResult.extraTags && aiResult.extraTags.length > 0 ? aiResult.extraTags : episode.tags;
    const newOverlay = aiResult.thumbnailTextIdeas?.[0] || episode.thumbnailConfig.overlayText;

    setEditedTitle(newTitle);
    setEditedDescription(newDesc);

    const updatedEp: Episode = {
      ...episode,
      title: newTitle,
      description: newDesc,
      startPoint: newStart,
      endPoint: newEnd,
      keyEvents: newKeyEvents,
      chapters: newChapters,
      tags: newTags,
      thumbnailConfig: {
        ...episode.thumbnailConfig,
        overlayText: newOverlay,
      },
    };

    onUpdateEpisode(updatedEp);
    setAppliedNotification("Complete AI package (including Start/End Milestones) applied!");
    setTimeout(() => setAppliedNotification(null), 3000);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div
          onClick={() => setIsMinimized(false)}
          className="bg-[#121212] border-2 border-blue-500/60 shadow-2xl rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:bg-[#18181b] transition-all group backdrop-blur-md"
          title="Click to restore Episode Studio window"
        >
          <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400 border border-blue-500/30">
            <Youtube className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                EP {episode.partNumber < 10 ? `0${episode.partNumber}` : episode.partNumber}
              </span>
              <span className="text-[10px] font-extrabold uppercase text-amber-300">
                Minimized Studio
              </span>
            </div>
            <p className="text-xs font-bold text-white line-clamp-1 max-w-[200px]">
              {episode.shortTitle}
            </p>
          </div>
          <div className="flex items-center gap-1.5 ml-2 border-l border-white/10 pl-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopyFullPackage();
              }}
              className="p-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              title="Copy YouTube Metadata Package"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
              title="Restore Window"
            >
              <Maximize2 className="w-4 h-4 text-cyan-300" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1.5 hover:bg-red-500/20 text-zinc-400 hover:text-red-300 rounded-lg transition-colors cursor-pointer"
              title="Close Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#121212] border border-white/10 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-[#09090b] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-md border border-blue-500/20">
              EP {episode.partNumber < 10 ? `0${episode.partNumber}` : episode.partNumber}
            </span>
            <div>
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider block">
                {currentGameTitle} • {episode.world}
              </span>
              <h2 className="text-lg font-bold text-zinc-100 line-clamp-1">
                {episode.shortTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyFullPackage}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-400 hover:bg-blue-300 text-zinc-950 font-bold text-xs rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              {copiedField === "full_package" ? (
                <Check className="w-4 h-4 text-zinc-950" />
              ) : (
                <Copy className="w-4 h-4 text-zinc-950" />
              )}
              <span>{copiedField === "full_package" ? "Copied All!" : "Copy Full YouTube Package"}</span>
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 text-cyan-300 hover:text-cyan-100 bg-cyan-950/50 hover:bg-cyan-900/80 rounded-lg transition-colors border border-cyan-500/30 flex items-center gap-1 text-xs font-bold cursor-pointer"
              title="Minimize window to floating dock"
            >
              <Minimize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Minimize</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white bg-[#18181b] hover:bg-[#27272a] rounded-lg transition-colors border border-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex border-b border-white/10 bg-[#09090b] px-4 gap-2 overflow-x-auto">
          {[
            { id: "package", label: "YouTube Package", icon: Youtube },
            { id: "gameplay", label: "Story & Pacing", icon: MapPin },
            { id: "ai", label: "AI Generator Studio", icon: Sparkles },
            { id: "thumbnail", label: "Thumbnail Builder", icon: ImageIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-amber-400 text-amber-300 bg-amber-500/10 font-bold"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-900/50">
          {appliedNotification && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 animate-pulse">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{appliedNotification}</span>
            </div>
          )}

          {/* TAB 1: YOUTUBE METADATA PACKAGE */}
          {activeTab === "package" && (
            <div className="space-y-6">
              {/* Primary Video Title */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Youtube className="w-4 h-4" /> Primary YouTube Title
                  </label>
                  <button
                    onClick={() => handleCopy(editedTitle, "title")}
                    className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    {copiedField === "title" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === "title" ? "Copied!" : "Copy Title"}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => {
                    setEditedTitle(e.target.value);
                    onUpdateEpisode({ ...episode, title: e.target.value });
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 font-semibold focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Alternative Titles (CTR Options) */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Alternative Viral Title Options (CTR Focused)
                </span>
                <div className="space-y-2">
                  {episode.altTitles.map((alt, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 bg-slate-900 p-2.5 rounded-lg border border-slate-800/80 text-xs text-slate-200"
                    >
                      <span className="font-medium">{alt}</span>
                      <button
                        onClick={() => handleCopy(alt, `alt_${idx}`)}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded text-[11px] font-semibold shrink-0"
                      >
                        {copiedField === `alt_${idx}` ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description Box */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-purple-400" /> YouTube Description Box (Ready to Paste)
                  </label>
                  <button
                    onClick={() => handleCopy(editedDescription, "description")}
                    className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    {copiedField === "description" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === "description" ? "Copied!" : "Copy Description"}</span>
                  </button>
                </div>
                <textarea
                  rows={12}
                  value={editedDescription}
                  onChange={(e) => {
                    setEditedDescription(e.target.value);
                    onUpdateEpisode({ ...episode, description: e.target.value });
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 leading-relaxed focus:outline-none focus:border-amber-400 resize-y"
                />
              </div>

              {/* Chapter Timestamps */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-400" /> Exact Chapter Timestamps ({episode.chapters.length})
                  </label>
                  <button
                    onClick={() =>
                      handleCopy(
                        episode.chapters.map((c) => `${c.timestamp} - ${c.title}`).join("\n"),
                        "chapters"
                      )
                    }
                    className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    {copiedField === "chapters" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === "chapters" ? "Copied!" : "Copy Timestamps"}</span>
                  </button>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5 font-mono text-xs">
                  {episode.chapters.map((chap, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-slate-300">
                      <span className="text-amber-400 font-bold w-16">{chap.timestamp}</span>
                      <span className="text-slate-400">-</span>
                      <span>{chap.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-emerald-400" /> Video Tags & Hashtags
                  </label>
                  <button
                    onClick={() => handleCopy(episode.tags.join(", "), "tags")}
                    className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    {copiedField === "tags" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === "tags" ? "Copied!" : "Copy Tags"}</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {episode.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-slate-900 text-slate-300 text-xs font-medium rounded-md border border-slate-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STORY & GAMEPLAY PACING */}
          {activeTab === "gameplay" && (() => {
            const availableRoster = getGameCharacterList(currentGameTitle, episode);
            const currentParty = episode.partyMembers || [];

            return (
              <div className="space-y-6">
                {/* Active Heroes / Party Roster Selector */}
                <div className="bg-slate-950 p-5 rounded-xl border border-blue-500/30 space-y-4 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30">
                        <Users className="w-4 h-4 text-blue-300" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                          Active Heroes & Party Roster
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Select or add the heroes active in Episode #{episode.partNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateEpisode({ ...episode, partyMembers: availableRoster });
                        }}
                        className="px-2.5 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-bold transition-colors cursor-pointer"
                        title="Select all game roster characters"
                      >
                        Select All
                      </button>
                      {currentParty.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateEpisode({ ...episode, partyMembers: [] });
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold transition-colors cursor-pointer"
                          title="Clear selected heroes"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Selected Active Heroes Badges & Image Upload Cards */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Currently Active in Episode ({currentParty.length})
                      </span>
                      <span className="text-[10px] text-blue-300/80 italic font-medium hidden sm:inline">
                        📷 Upload a small hero image file to display on the episode card
                      </span>
                    </div>
                    {currentParty.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                        {currentParty.map((hero, idx) => {
                          const avatarUrl = getHeroAvatarUrl(episode.heroAvatars, hero);
                          const isCustom = Boolean(avatarUrl && !avatarUrl.startsWith("data:image/svg+xml"));

                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/90 border border-blue-500/30 hover:border-blue-400 transition-all shadow-sm"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <img
                                  src={avatarUrl}
                                  alt={hero}
                                  className="w-8 h-8 rounded-full object-cover border-2 border-blue-400 shadow-sm shrink-0 bg-slate-950"
                                />
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-slate-100 truncate">{cleanHeroName(hero)}</p>
                                  <p className="text-[10px] text-slate-400 truncate">
                                    {isCustom ? "Custom Upload" : "Vector Portrait"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                {/* Upload Image Button */}
                                <label
                                  htmlFor={`hero-img-file-${idx}`}
                                  className="p-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-white transition-colors cursor-pointer border border-blue-500/30"
                                  title={`Upload small image file for ${hero}`}
                                >
                                  <Camera className="w-3.5 h-3.5" />
                                  <input
                                    id={`hero-img-file-${idx}`}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleHeroImageUpload(hero, file);
                                    }}
                                  />
                                </label>

                                {/* Remove Image if uploaded */}
                                {isCustom && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveHeroImage(hero)}
                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 transition-colors border border-slate-700"
                                    title="Remove custom hero image"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                {/* Remove Hero from Party */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = currentParty.filter((_, i) => i !== idx);
                                    onUpdateEpisode({ ...episode, partyMembers: updated });
                                  }}
                                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors border border-slate-700"
                                  title={`Remove ${hero} from episode`}
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-900/60 rounded-lg border border-dashed border-slate-800 text-xs text-slate-500 italic">
                        No active heroes selected for this episode yet. Toggle heroes from the game roster below or add a custom hero name.
                      </div>
                    )}
                  </div>

                  {/* Toggle Quick Game Roster */}
                  {availableRoster.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-800/60">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Toggle Game Roster ({currentGameTitle})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {availableRoster.map((hero, idx) => {
                          const normHero = normalizeHeroName(hero);
                          const isActive = currentParty.some((p) => {
                            const normP = normalizeHeroName(p);
                            return normP === normHero || (normHero.length >= 3 && normP.length >= 3 && (normP.includes(normHero) || normHero.includes(normP)));
                          });
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                let updated: string[];
                                if (isActive) {
                                  updated = currentParty.filter((p) => {
                                    const normP = normalizeHeroName(p);
                                    return !(normP === normHero || (normHero.length >= 3 && normP.length >= 3 && (normP.includes(normHero) || normHero.includes(normP))));
                                  });
                                } else {
                                  updated = [...currentParty, hero];
                                }
                                onUpdateEpisode({ ...episode, partyMembers: updated });
                              }}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
                                isActive
                                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm"
                                  : "bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800 hover:border-slate-700"
                              }`}
                            >
                              {isActive ? (
                                <UserCheck className="w-3 h-3 text-amber-400" />
                              ) : (
                                <Plus className="w-3 h-3 text-slate-500" />
                              )}
                              <span>{cleanHeroName(hero)}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Custom Hero Input Form */}
                  <div className="pt-2 border-t border-slate-800/60">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.currentTarget;
                        const input = form.elements.namedItem("customHeroName") as HTMLInputElement;
                        const nameVal = input?.value.trim();
                        if (!nameVal) return;

                        if (!currentParty.some((p) => p.toLowerCase() === nameVal.toLowerCase())) {
                          onUpdateEpisode({ ...episode, partyMembers: [...currentParty, nameVal] });
                        }
                        input.value = "";
                      }}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="text"
                        name="customHeroName"
                        placeholder="Add custom hero or guest character..."
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-400 placeholder:text-slate-600"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shrink-0 shadow-sm cursor-pointer"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Add Hero</span>
                      </button>
                    </form>
                  </div>
                </div>

                {/* Start & End Milestones */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Start Milestone
                  </span>
                  <p className="text-sm font-semibold text-slate-100 mt-1">{episode.startPoint}</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> End Milestone
                  </span>
                  <p className="text-sm font-semibold text-slate-100 mt-1">{episode.endPoint}</p>
                </div>
              </div>

              {/* Key Events Sequence */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <List className="w-4 h-4 text-amber-400" /> Story Progression & Key Beats
                </h4>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
                  {episode.keyEvents.map((event, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs text-slate-200">
                      <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="mt-1 leading-relaxed">{event}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Items & Locations Acquired */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-400" /> Key Items, Equipment & Acquisition Locations
                  </span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    {episode.keyItemsAndEspers?.length || 0} Logged
                  </span>
                </h4>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  {/* Badges List */}
                  {episode.keyItemsAndEspers && episode.keyItemsAndEspers.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {episode.keyItemsAndEspers.map((item, idx) => {
                        const cleanName = item.replace(/\s*\+\s*.*Key Item$/i, "").replace(/\s*\+\s*Key Item$/i, "").trim();
                        const parts = cleanName.split(" @ ");
                        const itemName = parts[0];
                        const itemLoc = parts[1];

                        return (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 text-purple-300 border border-purple-500/20 text-xs font-semibold rounded-lg group hover:border-purple-500/40 transition-colors"
                          >
                            <span>✨ {itemName}</span>
                            {itemLoc && (
                              <span className="text-[10px] text-purple-400/80 font-normal bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-500/20">
                                📍 {itemLoc}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                const updatedItems = episode.keyItemsAndEspers.filter((_, i) => i !== idx);
                                onUpdateEpisode({ ...episode, keyItemsAndEspers: updatedItems });
                              }}
                              className="ml-1 text-slate-500 hover:text-red-400 p-0.5 rounded transition-colors"
                              title="Remove Key Item"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No key items logged for this episode yet.</p>
                  )}

                  {/* Manual Add Key Item Form */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.currentTarget;
                        const nameInput = form.elements.namedItem("newItemName") as HTMLInputElement;
                        const locInput = form.elements.namedItem("newItemLoc") as HTMLInputElement;
                        const nameVal = nameInput?.value.trim();
                        const locVal = locInput?.value.trim();

                        if (!nameVal) return;

                        const formattedEntry = locVal ? `${nameVal} @ ${locVal}` : nameVal;
                        const existingList = episode.keyItemsAndEspers || [];
                        onUpdateEpisode({
                          ...episode,
                          keyItemsAndEspers: [...existingList, formattedEntry],
                        });

                        nameInput.value = "";
                        if (locInput) locInput.value = "";
                      }}
                      className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                    >
                      <input
                        type="text"
                        name="newItemName"
                        placeholder="Key Item name (e.g. Purah Pad, Small Key)..."
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-400 placeholder:text-slate-600"
                        required
                      />
                      <input
                        type="text"
                        name="newItemLoc"
                        placeholder="Location found (e.g. Great Sky Island Chest)..."
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-400 placeholder:text-slate-600"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 shrink-0 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Item</span>
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Boss Strategies */}
              {episode.bossStrategies && episode.bossStrategies.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400" /> Boss Battle Strategies & Mechanics
                  </h4>
                  <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl space-y-2">
                    {episode.bossStrategies.map((strat, idx) => (
                      <p key={idx} className="text-xs text-amber-200 leading-relaxed font-medium">
                        • {strat}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Equipment Notes */}
              {episode.equipmentNotes && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Equipment & Secret Pro-Tips
                  </span>
                  <p>{episode.equipmentNotes}</p>
                </div>
              )}
            </div>
          );
        })()}

          {/* TAB 3: AI ASSISTANT STUDIO (GEMINI) */}
          {activeTab === "ai" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-950 p-6 rounded-2xl border border-purple-800/40 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">AI Title, Description & Timestamp Generator</h3>
                    <p className="text-xs text-slate-400">
                      Tailored specifically for <strong className="text-amber-300">{currentGameTitle}</strong> Episode {episode.partNumber} ({episode.world}).
                    </p>
                  </div>
                </div>

                <button
                  onClick={runAiEnhance}
                  disabled={loadingAi}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loadingAi ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  )}
                  <span>{loadingAi ? `Generating AI Copy for ${currentGameTitle}...` : `Generate Title, Description, Key Events & Timestamps`}</span>
                </button>
              </div>

              {/* AI Results */}
              {aiResult && (
                <div className="space-y-6">
                  {/* Master Apply Button */}
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                        ✨ AI Package Ready for {currentGameTitle}
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Update start & end milestones, title, description, key events, timestamps, and tags in 1 click.
                      </p>
                    </div>
                    <button
                      onClick={applyFullAiPackage}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg shadow-md shrink-0 flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Apply Complete Package</span>
                    </button>
                  </div>

                  {/* AI Generated Start & End Milestones */}
                  {(aiResult.suggestedStartPoint || aiResult.suggestedEndPoint) && (
                    <div className="bg-slate-950 p-5 rounded-xl border border-purple-500/30 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-purple-400" />
                          <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                            AI Linked Start & End Milestones
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            const updated = {
                              ...episode,
                              startPoint: aiResult.suggestedStartPoint || episode.startPoint,
                              endPoint: aiResult.suggestedEndPoint || episode.endPoint,
                            };
                            onUpdateEpisode(updated);
                            setAppliedNotification("Start & End Milestones applied to episode!");
                            setTimeout(() => setAppliedNotification(null), 2000);
                          }}
                          className="px-2.5 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded text-[11px] font-bold border border-purple-500/30 cursor-pointer"
                        >
                          Apply Milestones Only
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                          <div className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
                            <span>Start Milestone</span>
                            {prevEpisode && (
                              <span className="text-purple-400 font-normal">
                                (linked from Ep #{prevEpisode.partNumber})
                              </span>
                            )}
                          </div>
                          <p className="font-semibold text-emerald-300">
                            {aiResult.suggestedStartPoint || episode.startPoint}
                          </p>
                        </div>
                        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                          <div className="text-[10px] uppercase font-bold text-zinc-400">
                            End Milestone (Inferred from AI Description)
                          </div>
                          <p className="font-semibold text-blue-300">
                            {aiResult.suggestedEndPoint || episode.endPoint}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Viral Titles */}
                  {aiResult.viralTitles && (
                    <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                        AI Suggested Catchy Titles for {currentGameTitle}
                      </span>
                      <div className="space-y-2">
                        {aiResult.viralTitles.map((t: string, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-3 bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs font-semibold text-slate-100"
                          >
                            <span>{t}</span>
                            <button
                              onClick={() => {
                                setEditedTitle(t);
                                onUpdateEpisode({ ...episode, title: t });
                                setAppliedNotification("Title updated!");
                                setTimeout(() => setAppliedNotification(null), 2000);
                              }}
                              className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded text-[11px]"
                            >
                              Use This Title
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Enhanced Description */}
                  {aiResult.enhancedDescription && (
                    <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                          AI Enhanced Overview & Description
                        </span>
                        <button
                          onClick={() => {
                            setEditedDescription(aiResult.enhancedDescription);
                            onUpdateEpisode({ ...episode, description: aiResult.enhancedDescription });
                            setAppliedNotification("Description updated!");
                            setTimeout(() => setAppliedNotification(null), 2000);
                          }}
                          className="px-2.5 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded text-[11px] font-bold border border-purple-500/30"
                        >
                          Apply to Description Box
                        </button>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-line bg-slate-900 p-3 rounded-lg border border-slate-800">
                        {aiResult.enhancedDescription}
                      </p>
                    </div>
                  )}

                  {/* AI Key Events & Chapters */}
                  {aiResult.chapters && (
                    <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                          AI Generated Chapter Timestamps ({aiResult.chapters.length})
                        </span>
                        <button
                          onClick={() => {
                            onUpdateEpisode({ ...episode, chapters: aiResult.chapters });
                            setAppliedNotification("Timestamps updated!");
                            setTimeout(() => setAppliedNotification(null), 2000);
                          }}
                          className="px-2.5 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded text-[11px] font-bold border border-blue-500/30"
                        >
                          Apply Timestamps
                        </button>
                      </div>
                      <div className="space-y-1 font-mono text-xs">
                        {aiResult.chapters.map((chap: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 text-slate-300 bg-slate-900 p-2 rounded border border-slate-800/80">
                            <span className="text-amber-400 font-bold">{chap.timestamp}</span>
                            <span className="text-slate-500">-</span>
                            <span>{chap.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: THUMBNAIL BUILDER */}
          {activeTab === "thumbnail" && (
            <ThumbnailBuilder
              episode={episode}
              activeSeries={activeSeries}
              onUpdateConfig={(config) => {
                onUpdateEpisode({ ...episode, thumbnailConfig: config });
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
