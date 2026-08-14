import React, { useState, useEffect } from "react";
import { Episode, EpisodeStatus } from "../types";
import {
  Clock,
  Copy,
  Check,
  Sparkles,
  MapPin,
  ListOrdered,
  Image as ImageIcon,
  User,
  CopyPlus,
  Trash2,
  Swords,
  Gift,
  Radio,
  Youtube,
  Eye,
  ThumbsUp,
  MessageSquare,
  Navigation,
  ChevronDown,
} from "lucide-react";
import { getProtagonistForGame, isCharacterValidForGame, cleanHeroName, getHeroAvatarUrl, getBuiltInHeroAvatarSvg, getCharacterEmojiIcon } from "../utils/gameProtagonists";

const formatCompactNumber = (num: number): string => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toString();
};

interface EpisodeCardProps {
  episode: Episode;
  onSelect: (episode: Episode) => void;
  onUpdateStatus: (id: number, status: EpisodeStatus) => void;
  onDuplicate?: (episode: Episode) => void;
  onDelete?: (id: number) => void;
  onOpenRecordingTimer?: (episode: Episode) => void;
  onOpenYouTubeStudio?: (episodeId: number) => void;
}

const PIPELINE_STEPS: { id: EpisodeStatus; label: string }[] = [
  { id: "not_started", label: "PLAN" },
  { id: "recorded", label: "RECORD" },
  { id: "edited", label: "EDIT" },
  { id: "uploaded", label: "UPLOAD" },
  { id: "published", label: "PUBLISH" },
];

const getStepIndex = (status: EpisodeStatus): number => {
  switch (status) {
    case "not_started": return 0;
    case "recorded": return 1;
    case "edited": return 2;
    case "uploaded": return 3;
    case "published": return 4;
    default: return 0;
  }
};

const HeroPortraitAvatar: React.FC<{
  avatarUrl?: string;
  heroName: string;
}> = ({ avatarUrl, heroName }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const heroClean = cleanHeroName(heroName);

  useEffect(() => {
    setImgFailed(false);
  }, [avatarUrl]);

  const finalUrl = (avatarUrl && !imgFailed)
    ? avatarUrl
    : getBuiltInHeroAvatarSvg(heroName);

  return (
    <img
      src={finalUrl}
      alt={heroClean}
      onError={() => setImgFailed(true)}
      className="w-8 h-8 rounded-full object-cover border border-purple-400/80 shadow shrink-0 bg-slate-900"
    />
  );
};

export const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  onSelect,
  onUpdateStatus,
  onDuplicate,
  onDelete,
  onOpenRecordingTimer,
  onOpenYouTubeStudio,
}) => {
  const [copied, setCopied] = useState(false);
  const [justChangedStatus, setJustChangedStatus] = useState(false);

  const handleCopyPackage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const fullText = `${episode.title}

${episode.description}

TAGS:
${episode.tags.map((t) => `#${t.replace(/\s+/g, "")}`).join(" ")}`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusEffects = (status: EpisodeStatus) => {
    switch (status) {
      case "published":
        return {
          label: "Published",
          badgeBg: "bg-[#0f2d22] text-emerald-300 border-emerald-500/50",
          cardBorder: "border-2 border-t-[5px] border-emerald-500/90 hover:border-emerald-400 border-t-emerald-400",
          glowShadow: "shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)]",
          ambientGlow: "bg-emerald-500/15 blur-xl",
          dotColor: "bg-emerald-400",
          stepColor: "text-emerald-400",
        };
      case "uploaded":
        return {
          label: "Uploaded",
          badgeBg: "bg-[#102447] text-blue-300 border-blue-500/50",
          cardBorder: "border-2 border-t-[5px] border-blue-500/90 hover:border-blue-400 border-t-blue-400",
          glowShadow: "shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_35px_rgba(59,130,246,0.5)]",
          ambientGlow: "bg-blue-500/15 blur-xl",
          dotColor: "bg-blue-400",
          stepColor: "text-blue-400",
        };
      case "edited":
        return {
          label: "Edited",
          badgeBg: "bg-[#25153b] text-purple-300 border-purple-500/50",
          cardBorder: "border-2 border-t-[5px] border-purple-500/90 hover:border-purple-400 border-t-purple-400",
          glowShadow: "shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_35px_rgba(168,85,247,0.5)]",
          ambientGlow: "bg-purple-500/15 blur-xl",
          dotColor: "bg-purple-400",
          stepColor: "text-purple-400",
        };
      case "recorded":
        return {
          label: "Recorded",
          badgeBg: "bg-[#2d220f] text-amber-300 border-amber-500/50",
          cardBorder: "border-2 border-t-[5px] border-amber-500/90 hover:border-amber-400 border-t-amber-400",
          glowShadow: "shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)]",
          ambientGlow: "bg-amber-500/15 blur-xl",
          dotColor: "bg-amber-400",
          stepColor: "text-amber-400",
        };
      default:
        return {
          label: "Not Started",
          badgeBg: "bg-[#1a233d] text-slate-200 border-slate-700/80",
          cardBorder: "border-2 border-t-[5px] border-slate-600 hover:border-slate-400 border-t-slate-400",
          glowShadow: "shadow-lg shadow-black/80 hover:shadow-slate-500/20",
          ambientGlow: "bg-slate-600/10 blur-xl",
          stepColor: "text-amber-400",
        };
    }
  };

  const statusEffects = getStatusEffects(episode.status);
  const activeStepIdx = getStepIndex(episode.status);

  const activeThumbnail = episode.thumbnailConfig?.customImage ||
    (episode.suggestedThumbnailPrompt?.startsWith("data:image") || episode.suggestedThumbnailPrompt?.startsWith("http") || episode.suggestedThumbnailPrompt?.startsWith("/")
      ? episode.suggestedThumbnailPrompt
      : null);

  const inferredGame = episode.title.split("#")[0].split("-")[0].trim() || (episode.tags && episode.tags[0]) || "";
  const rawChar = episode.thumbnailConfig?.featuredCharacter || "";
  const isCharValid = rawChar && isCharacterValidForGame(rawChar, inferredGame) && !rawChar.toLowerCase().startsWith("hero of");

  const displayCharacter = isCharValid
    ? rawChar
    : episode.partyMembers && episode.partyMembers.length > 0 && !episode.partyMembers.includes("Main Player")
    ? episode.partyMembers.join(", ")
    : getProtagonistForGame(inferredGame);

  const bossList = episode.bossStrategies && episode.bossStrategies.length > 0
    ? episode.bossStrategies
    : episode.keyEvents?.filter((k) => /boss|fight|defeat|versus|vs\.|battle|dragon|esper|monsters|whelk|ymir|vargas|ultros|atma|kefka/i.test(k)) || [];

  const cleanItemName = (name: string) =>
    name.replace(/\s*\+\s*.*Key Item$/i, "").replace(/\s*\+\s*Key Item$/i, "").trim();

  const itemList = episode.keyItemsAndEspers && episode.keyItemsAndEspers.length > 0
    ? episode.keyItemsAndEspers.map(cleanItemName)
    : [];

  const upperSubtitle = episode.shortTitle || episode.world || "STORY CHAPTER";

  return (
    <div className="relative group flex flex-col h-full">
      {/* Ambient Status Glow */}
      <div className={`absolute -inset-1 rounded-2xl ${statusEffects.ambientGlow} opacity-60 group-hover:opacity-100 transition-all duration-500 pointer-events-none -z-10`} />

      {/* Active Status Change Flash Effect */}
      {justChangedStatus && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-white/40 shadow-2xl animate-bounce flex items-center gap-1.5 pointer-events-none whitespace-nowrap">
          <Sparkles className="w-3 h-3 text-amber-300 animate-spin" />
          <span>Status Updated: {statusEffects.label}!</span>
        </div>
      )}

      {/* Main Card Container */}
      <div
        onClick={() => onSelect(episode)}
        className={`relative overflow-hidden bg-[#0a1226] ${statusEffects.cardBorder} ${statusEffects.glowShadow} rounded-2xl p-3.5 transition-all duration-300 cursor-pointer flex flex-col justify-between flex-1 hover:-translate-y-1 space-y-2.5`}
      >
        {/* Quick Intel Hover Overlay */}
        <div className="absolute top-[75px] inset-x-2 bottom-[65px] bg-[#070e20]/95 backdrop-blur-xl border border-amber-500/40 rounded-xl p-3.5 shadow-2xl flex flex-col justify-between transition-all duration-200 opacity-0 group-hover:opacity-100 pointer-events-none z-30">
          <div className="space-y-2.5 overflow-y-auto max-h-full pr-1">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-black text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>EP {episode.partNumber} Boss & Loot Intel</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                <span className="text-red-400 font-bold">{bossList.length} Bosses</span>
                <span>•</span>
                <span className="text-amber-300 font-bold">{itemList.length} Items</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-red-400 flex items-center gap-1">
                <Swords className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>Key Boss Fights ({bossList.length})</span>
              </div>
              {bossList.length > 0 ? (
                <ul className="space-y-1 pl-0.5 text-xs text-zinc-200">
                  {bossList.slice(0, 3).map((bs, i) => (
                    <li key={i} className="flex items-start gap-1.5 leading-snug bg-red-950/30 p-1.5 rounded border border-red-500/20">
                      <span className="text-red-400 font-bold text-[10px] shrink-0 mt-0.5">⚔️</span>
                      <span className="line-clamp-2 text-[11px] font-medium">{bs}</span>
                    </li>
                  ))}
                  {bossList.length > 3 && (
                    <li className="text-[10px] text-zinc-400 italic pl-1">
                      +{bossList.length - 3} more boss encounters...
                    </li>
                  )}
                </ul>
              ) : (
                <p className="text-[11px] text-zinc-500 italic pl-1">No major boss encounters logged</p>
              )}
            </div>

            <div className="space-y-1 pt-1 border-t border-white/10">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Gift className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Key Items ({itemList.length})</span>
              </div>
              {itemList.length > 0 ? (
                <div className="flex flex-wrap gap-1 pl-0.5">
                  {itemList.map((item, i) => {
                    const parts = item.split(" @ ");
                    const name = parts[0];
                    const loc = parts[1];

                    return (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-200 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-md max-w-full"
                      >
                        <span className="truncate">{name}</span>
                        {loc && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-medium text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30 shrink-0 max-w-[130px]">
                            <MapPin className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                            <span className="truncate">{loc}</span>
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="text-[11px] text-zinc-500 italic pl-1">No unique key items logged</p>
              )}
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 text-center text-[10px] text-amber-300/90 font-bold tracking-wide">
            💡 Click card to open full YouTube Studio planner
          </div>
        </div>

        {/* TOP ROW: EPISODE BADGES & STATUS SELECTOR */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2 relative z-40">
            {/* LEFT: EP ISON BADGE & BOSS SWORDS ICON */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#122347] border border-blue-500/40 text-blue-400 shadow-sm">
                <span className="text-[10px] font-black tracking-wider uppercase">EP</span>
                <span className="text-xs font-black font-mono tracking-tight text-blue-300">
                  {episode.partNumber < 10 ? `0${episode.partNumber}` : episode.partNumber}
                </span>
              </div>
              <span
                className="p-1 inline-flex items-center justify-center bg-[#231e13] border border-amber-500/40 text-amber-400 rounded-lg shrink-0"
                title="Boss & Combat Encounters"
              >
                <Swords className="w-3.5 h-3.5" />
              </span>
              {episode.world && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0c2238] border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold truncate max-w-[130px]">
                  <Navigation className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="truncate">{episode.world}</span>
                </span>
              )}
            </div>

            {/* RIGHT: STATUS SELECTOR */}
            <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5 relative z-50 pointer-events-auto shrink-0">
              <span className={`w-2 h-2 rounded-full ${statusEffects.dotColor} shadow-[0_0_8px_currentColor]`} />
              <div className="relative">
                <select
                  value={episode.status}
                  onChange={(e) => {
                    e.stopPropagation();
                    const newStatus = e.target.value as EpisodeStatus;
                    onUpdateStatus(episode.id, newStatus);
                    setJustChangedStatus(true);
                    setTimeout(() => setJustChangedStatus(false), 1200);
                  }}
                  className={`text-[11px] font-bold pl-2.5 pr-6 py-0.5 rounded-lg border outline-none cursor-pointer transition-all shadow-sm appearance-none ${statusEffects.badgeBg}`}
                >
                  <option value="not_started" className="bg-[#0f172a] text-slate-300 font-bold">
                    Not Started
                  </option>
                  <option value="recorded" className="bg-[#0f172a] text-amber-300 font-bold">
                    Recorded
                  </option>
                  <option value="edited" className="bg-[#0f172a] text-purple-300 font-bold">
                    Edited
                  </option>
                  <option value="uploaded" className="bg-[#0f172a] text-blue-300 font-bold">
                    Uploaded
                  </option>
                  <option value="published" className="bg-[#0f172a] text-emerald-300 font-bold">
                    Published
                  </option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Custom Thumbnail Banner (if present) */}
        {activeThumbnail && (
          <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-white/10 group-hover:border-blue-500/40 transition-colors bg-black">
            <img src={activeThumbnail} alt="Thumbnail Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute top-1.5 right-1.5 bg-black/80 backdrop-blur-sm text-cyan-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-cyan-500/30 flex items-center gap-1">
              <ImageIcon className="w-3 h-3 text-cyan-400" /> Custom Thumbnail
            </div>
          </div>
        )}

        {/* TITLE & SUBTITLE SECTION */}
        <div className="space-y-0.5">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 line-clamp-1">
            {upperSubtitle}
          </p>
          <h3 className="text-sm font-black text-white group-hover:text-blue-300 transition-colors leading-snug line-clamp-2">
            {episode.title}
          </h3>
        </div>

        {/* 5-STEP PRODUCTION PIPELINE STEPPER BAR (INTERACTIVE DIRECT STEP CLICKER) */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-[#060c1c] border border-slate-800/90 hover:border-slate-700 rounded-xl px-2.5 py-2 relative z-40 transition-colors shadow-inner"
        >
          <div className="flex items-center justify-between relative text-[9px] font-extrabold">
            {/* Base connecting line */}
            <div className="absolute top-[5px] left-3 right-3 h-[2px] bg-slate-800/80 -z-0 rounded-full" />

            {/* Active glowing progress fill line */}
            <div
              className="absolute top-[5px] left-3 h-[2px] bg-gradient-to-r from-slate-500 via-amber-400 to-emerald-400 transition-all duration-300 -z-0 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.5)]"
              style={{ width: `calc(${(activeStepIdx / (PIPELINE_STEPS.length - 1)) * 100}% - 12px)` }}
            />

            {PIPELINE_STEPS.map((step, idx) => {
              const isCompleted = idx <= activeStepIdx;
              const isCurrent = idx === activeStepIdx;

              let dotColorClass = "bg-slate-700 border-slate-600 group-hover/step:bg-slate-500 group-hover/step:border-slate-400";
              let textColorClass = "text-slate-500 group-hover/step:text-slate-300";

              if (isCurrent) {
                switch (step.id) {
                  case "published":
                    dotColorClass = "bg-emerald-400 border-emerald-300 ring-2 ring-emerald-500/50 shadow-[0_0_10px_#34d399]";
                    textColorClass = "text-emerald-400 font-black";
                    break;
                  case "uploaded":
                    dotColorClass = "bg-blue-400 border-blue-300 ring-2 ring-blue-500/50 shadow-[0_0_10px_#60a5fa]";
                    textColorClass = "text-blue-400 font-black";
                    break;
                  case "edited":
                    dotColorClass = "bg-purple-400 border-purple-300 ring-2 ring-purple-500/50 shadow-[0_0_10px_#c084fc]";
                    textColorClass = "text-purple-400 font-black";
                    break;
                  case "recorded":
                    dotColorClass = "bg-amber-400 border-amber-300 ring-2 ring-amber-500/50 shadow-[0_0_10px_#fbbf24]";
                    textColorClass = "text-amber-400 font-black";
                    break;
                  default:
                    dotColorClass = "bg-slate-300 border-white ring-2 ring-slate-400/50 shadow-[0_0_10px_#cbd5e1]";
                    textColorClass = "text-slate-200 font-black";
                    break;
                }
              } else if (isCompleted) {
                dotColorClass = "bg-blue-500/80 border-blue-400 text-blue-300";
                textColorClass = "text-blue-300 font-bold";
              }

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (episode.status !== step.id) {
                      onUpdateStatus(episode.id, step.id);
                      setJustChangedStatus(true);
                      setTimeout(() => setJustChangedStatus(false), 1200);
                    }
                  }}
                  title={`1-Click Status: Set to ${step.label} (${step.id.replace("_", " ")})`}
                  className="relative z-10 flex flex-col items-center gap-1 shrink-0 group/step cursor-pointer focus:outline-none"
                >
                  <span className={`w-3 h-3 rounded-full border ${dotColorClass} transition-all duration-200 transform group-hover/step:scale-130 flex items-center justify-center`} />
                  <span className={`text-[8.5px] uppercase tracking-wider ${textColorClass} transition-colors`}>
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* START & END LOCATION ROUTE BOX */}
        <div className="bg-[#060c1c] p-2 rounded-lg border border-slate-800/90 space-y-1 text-[11px]">
          <div className="flex items-center gap-1.5" title={`Start Location: ${episode.startPoint}`}>
            <span className="p-0.5 rounded bg-emerald-500/20 text-emerald-400 shrink-0">
              <Navigation className="w-3 h-3" />
            </span>
            <p className="line-clamp-1">
              <span className="font-bold text-emerald-400 mr-1">Start:</span>
              <span className="text-slate-200 font-medium">{episode.startPoint}</span>
            </p>
          </div>
          <div className="flex items-center gap-1.5 pt-1 border-t border-slate-800/60" title={`End Location: ${episode.endPoint}`}>
            <span className="p-0.5 rounded bg-rose-500/20 text-rose-400 shrink-0">
              <MapPin className="w-3 h-3" />
            </span>
            <p className="line-clamp-1">
              <span className="font-bold text-rose-400 mr-1">End:</span>
              <span className="text-slate-200 font-medium">{episode.endPoint}</span>
            </p>
          </div>
        </div>

        {/* KEY HIGHLIGHTS LIST */}
        <div className="space-y-1">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <ListOrdered className="w-3 h-3 text-blue-400" />
            <span>KEY EVENTS ({episode.keyEvents.length})</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-0.5 pl-0.5">
            {episode.keyEvents.slice(0, 6).map((event, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-blue-400 font-bold text-[10px] leading-tight shrink-0 mt-0.5">•</span>
                <span className="line-clamp-1 text-[11px] text-slate-200">{event}</span>
              </li>
            ))}
            {episode.keyEvents.length > 6 && (
              <li className="text-[10px] text-slate-400 italic pl-2.5 pt-0.5">
                +{episode.keyEvents.length - 6} more key story beats...
              </li>
            )}
          </ul>
        </div>

        {/* YouTube Analytics Bar (if present) */}
        {episode.videoStats && (
          <div
            className="p-2 bg-gradient-to-r from-red-950/40 via-red-900/20 to-zinc-900 border border-red-500/30 rounded-xl flex items-center justify-between text-xs text-zinc-200 shadow-inner group-hover:border-red-500/50 transition-colors"
            title={
              episode.videoStats.lastUpdated
                ? `Last synced: ${new Date(episode.videoStats.lastUpdated).toLocaleTimeString()}`
                : "YouTube Video Statistics"
            }
          >
            <div className="flex items-center gap-1.5 font-bold text-red-400 shrink-0">
              <Youtube className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="text-[10px] uppercase font-black tracking-wider">YT STATS</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 font-mono text-[11px]">
              <span className="flex items-center gap-1 font-extrabold text-white" title={`${episode.videoStats.views.toLocaleString()} Views`}>
                <Eye className="w-3 h-3 text-cyan-400 shrink-0" />
                {formatCompactNumber(episode.videoStats.views)}
              </span>
              <span className="flex items-center gap-1 font-extrabold text-white" title={`${episode.videoStats.likes.toLocaleString()} Likes`}>
                <ThumbsUp className="w-3 h-3 text-emerald-400 shrink-0" />
                {formatCompactNumber(episode.videoStats.likes)}
              </span>
              <span className="flex items-center gap-1 font-extrabold text-white" title={`${episode.videoStats.comments.toLocaleString()} Comments`}>
                <MessageSquare className="w-3 h-3 text-amber-400 shrink-0" />
                {formatCompactNumber(episode.videoStats.comments)}
              </span>
            </div>
          </div>
        )}

        {/* ACTIVE HERO PORTRAITS / PARTY MEMBERS */}
        <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-purple-400" />
              <span>Active Party ({episode.partyMembers?.length || 1})</span>
            </div>
          </div>
          {episode.partyMembers && episode.partyMembers.length > 0 ? (
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              {episode.partyMembers.map((hero, idx) => {
                const avatarUrl = getHeroAvatarUrl(episode.heroAvatars, hero);
                const heroClean = cleanHeroName(hero);
                return (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-2 bg-[#121a38] hover:bg-[#1b254e] border border-purple-500/35 hover:border-purple-400/60 rounded-xl px-2 py-1 text-xs font-bold text-purple-200 shadow-sm transition-all duration-200 max-w-[180px]"
                    title={`Active Hero: ${heroClean}`}
                  >
                    <HeroPortraitAvatar avatarUrl={avatarUrl} heroName={hero} />
                    <span className="truncate text-[11px] font-bold text-slate-200 tracking-wide">{heroClean}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 pt-0.5">
              {(() => {
                const avatarUrl = getHeroAvatarUrl(episode.heroAvatars, displayCharacter);
                const heroClean = cleanHeroName(displayCharacter);
                return (
                  <div
                    className="inline-flex items-center gap-2 bg-[#121a38] border border-purple-500/35 rounded-xl px-2 py-1 text-xs font-bold text-purple-200 shadow-sm"
                    title={`Active Hero: ${heroClean}`}
                  >
                    <HeroPortraitAvatar avatarUrl={avatarUrl} heroName={displayCharacter} />
                    <span className="truncate text-[11px] font-bold text-slate-200 tracking-wide">{heroClean}</span>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* BOTTOM FOOTER TOOLBAR */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 relative z-50 pointer-events-auto"
        >
          {/* LEFT: DURATION */}
          <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold min-w-0">
            <span className="inline-flex items-center gap-1 text-cyan-400 font-bold shrink-0">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>~{episode.estDurationMinutes} mins</span>
            </span>
          </div>

          {/* RIGHT: ACTION BUTTONS */}
          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenRecordingTimer && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenRecordingTimer(episode);
                }}
                title={`Start REC Timer for EP ${episode.partNumber}`}
                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-red-950/80 via-red-900/60 to-red-950/80 hover:from-red-900 hover:to-red-800 text-red-200 font-black text-xs transition-all border border-red-500/50 flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                <span>REC Timer</span>
              </button>
            )}

            {onOpenYouTubeStudio && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenYouTubeStudio(episode.id);
                }}
                title="Open YouTube Studio Upload"
                className="p-1.5 rounded-xl bg-[#121c35] hover:bg-red-900/50 text-red-400 hover:text-white transition-colors border border-slate-700/80 cursor-pointer shadow-sm"
              >
                <Youtube className="w-3.5 h-3.5" />
              </button>
            )}

            {onDuplicate && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(episode);
                }}
                title="Duplicate Episode"
                className="p-1.5 rounded-xl bg-[#121c35] hover:bg-[#1e2e54] text-slate-300 hover:text-cyan-300 transition-colors border border-slate-700/80 cursor-pointer shadow-sm"
              >
                <CopyPlus className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={handleCopyPackage}
              title="Copy Title & Description SEO Package"
              className="p-1.5 rounded-xl bg-[#121c35] hover:bg-[#1e2e54] text-slate-300 hover:text-white transition-colors border border-slate-700/80 cursor-pointer shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Are you sure you want to delete Episode ${episode.partNumber}?`)) {
                    onDelete(episode.id);
                  }
                }}
                title="Delete Episode"
                className="p-1.5 rounded-xl bg-[#121c35] hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors border border-slate-700/80 cursor-pointer shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
