import React, { useState, useEffect, useRef } from "react";
import { Episode, EpisodeStatus, PlaythroughSeries } from "../types";
import { EpisodeCard } from "./EpisodeCard";
import { MilestoneTrackerBar } from "./MilestoneNotification";
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Sparkles,
  RefreshCw,
  Plus,
  Columns,
  Mic,
  Scissors,
  UploadCloud,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronRight,
  CopyPlus,
  Trash2,
  Play,
  Minimize2,
  Maximize2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Check,
  X,
  Radio,
  Youtube,
  Gamepad2,
  Tv,
  Target,
  Eye,
  ThumbsUp,
  MessageSquare,
  Globe,
  Database,
  FileText,
  Edit2,
  FolderUp,
  Copy,
  FileCheck,
  Printer,
  Download,
  Map,
  Layers,
  FileSpreadsheet
} from "lucide-react";
import { formatCompactNumber } from "./YouTubeStudioUploadModal";
import { useAuth } from "../context/AuthContext";
import { findSynopsisInDb, CustomSynopsisEntry } from "../utils/gameSynopsisDb";

interface EpisodeListProps {
  episodes: Episode[];
  series?: PlaythroughSeries;
  gameTitle?: string;
  activeSeries?: PlaythroughSeries;
  targetLength?: string;
  onSelectEpisode: (episode: Episode) => void;
  onUpdateStatus: (id: number, status: EpisodeStatus) => void;
  onOpenAddEpisode?: () => void;
  onOpenAddEpisodeModal?: () => void;
  onDuplicateEpisode?: (episode: Episode) => void;
  onDeleteEpisode?: (id: number) => void;
  onOpenRecordingTimer?: (episode?: Episode) => void;
  onOpenYouTubeStudio?: (episodeId?: number) => void;
  onOpenPrintCheatSheet?: () => void;
  onOpenThumbnailStudio?: (episodeId?: number) => void;
  onOpenBossLootCatalog?: () => void;
  onOpenProtagonistDB?: () => void;
  onOpenQuestBranchTracker?: () => void;
  onUpdateQuests?: any;
  onUpdateSeriesSynopsis?: (seriesId: string, synopsis: string, source?: string) => void;
}

export const EpisodeList: React.FC<EpisodeListProps> = ({
  episodes,
  series,
  gameTitle = "Playthrough",
  activeSeries,
  targetLength,
  onSelectEpisode,
  onUpdateStatus,
  onOpenAddEpisode,
  onOpenAddEpisodeModal,
  onDuplicateEpisode,
  onDeleteEpisode,
  onOpenRecordingTimer,
  onOpenYouTubeStudio,
  onOpenPrintCheatSheet,
  onOpenThumbnailStudio,
  onOpenBossLootCatalog,
  onOpenProtagonistDB,
  onOpenQuestBranchTracker,
  onUpdateQuests,
  onUpdateSeriesSynopsis,
}) => {
  const { userProfile } = useAuth();
  const [search, setSearch] = useState("");
  const [worldFilter, setWorldFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list" | "kanban">("grid");
  const [copiedEpisodeId, setCopiedEpisodeId] = useState<number | null>(null);

  const handleCopyEpisodePackage = (e: React.MouseEvent, episode: Episode) => {
    e.stopPropagation();
    const chaptersText =
      episode.chapters && episode.chapters.length > 0
        ? `\n\nTIMESTAMPS:\n${episode.chapters.map((c) => `${c.timestamp} - ${c.title}`).join("\n")}`
        : "";

    const tagsText =
      episode.tags && episode.tags.length > 0
        ? `\n\nTAGS:\n${episode.tags.map((t) => `#${t.replace(/\s+/g, "")}`).join(" ")}`
        : "";

    const fullText = `${episode.title}\n\n${episode.description || ""}${chaptersText}${tagsText}`;
    navigator.clipboard.writeText(fullText);
    setCopiedEpisodeId(episode.id);
    setTimeout(() => setCopiedEpisodeId(null), 2000);
  };

  // Game Synopsis & Custom Synopsis Database state
  const [isSynopsisWindowMinimized, setIsSynopsisWindowMinimized] = useState(false);
  const [isScrapingSynopsis, setIsScrapingSynopsis] = useState(false);
  const [isEditingSynopsis, setIsEditingSynopsis] = useState(false);
  const [editableSynopsis, setEditableSynopsis] = useState("");
  const [customDb, setCustomDb] = useState<CustomSynopsisEntry[]>(() => {
    const saved = localStorage.getItem("yt_custom_synopsis_db");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });
  const [showSynopsisDbModal, setShowSynopsisDbModal] = useState(false);
  const [searchDbQuery, setSearchDbQuery] = useState("");
  const [templateCopied, setTemplateCopied] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseSynopsisDatabase = (fileText: string, fileName: string): CustomSynopsisEntry[] => {
    const entries: CustomSynopsisEntry[] = [];
    const blocks = fileText.split(/(?=\[[^\]]+\])/g);
    for (const block of blocks) {
      const trimmed = block.trim();
      if (!trimmed) continue;
      const match = trimmed.match(/^\[([^\]]+)\]\s*([\s\S]*)$/);
      if (match) {
        const title = match[1].trim();
        const syn = match[2].trim();
        if (title && syn) {
          entries.push({
            gameTitle: title,
            synopsis: syn,
            sourceFile: fileName,
          });
        }
      }
    }
    return entries;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const parsed = parseSynopsisDatabase(text, file.name);
      if (parsed.length === 0) {
        alert(
          "No valid game synopses found in the text file.\n\nPlease format your file as:\n\n[Game Title]\nSynopsis text...\n\n[Game Title 2]\nSynopsis text..."
        );
        return;
      }

      setCustomDb((prev) => {
        const map = new Map<string, CustomSynopsisEntry>();
        prev.forEach((item) => map.set(item.gameTitle.toLowerCase().trim(), item));
        parsed.forEach((item) => map.set(item.gameTitle.toLowerCase().trim(), item));
        const updated = Array.from(map.values());
        localStorage.setItem("yt_custom_synopsis_db", JSON.stringify(updated));
        return updated;
      });

      const currentTitle = activeSeries?.gameTitle || gameTitle || "";
      const activeMatch =
        (parsed || []).find(
          (p) => p?.gameTitle && currentTitle && p.gameTitle.toLowerCase().trim() === currentTitle.toLowerCase().trim()
        ) ||
        (parsed || []).find(
          (p) =>
            p?.gameTitle && currentTitle && (
              currentTitle.toLowerCase().includes(p.gameTitle.toLowerCase().trim()) ||
              p.gameTitle.toLowerCase().trim().includes(currentTitle.toLowerCase().trim())
            )
        );

      if (activeMatch && onUpdateSeriesSynopsis && activeSeries) {
        onUpdateSeriesSynopsis(
          activeSeries.id,
          activeMatch.synopsis,
          `Custom DB (${activeMatch.sourceFile || file.name})`
        );
        setUploadFeedback(
          `Imported ${parsed.length} synopsis entries! Matched & applied custom synopsis for "${currentTitle}".`
        );
      } else {
        setUploadFeedback(`Successfully imported ${parsed.length} game synopses into your local database!`);
      }

      setTimeout(() => setUploadFeedback(null), 6000);
    };
    reader.readAsText(file);
    if (e.target) e.target.value = "";
  };

  const handleRemoveFromDb = (title: string) => {
    setCustomDb((prev) => {
      const updated = (prev || []).filter((item) => item?.gameTitle && item.gameTitle.toLowerCase().trim() !== title.toLowerCase().trim());
      localStorage.setItem("yt_custom_synopsis_db", JSON.stringify(updated));
      return updated;
    });
  };

  const currentTitle = activeSeries?.gameTitle || gameTitle || "";
  const activeDbMatch = (customDb || []).find(
    (entry) => entry?.gameTitle && currentTitle && entry.gameTitle.toLowerCase().trim() === currentTitle.toLowerCase().trim()
  ) || (customDb || []).find(
    (entry) =>
      entry?.gameTitle && currentTitle && (
        currentTitle.toLowerCase().includes(entry.gameTitle.toLowerCase().trim()) ||
        entry.gameTitle.toLowerCase().trim().includes(currentTitle.toLowerCase().trim())
      )
  );

  const handleScrapeSynopsis = async () => {
    if (!currentTitle) return;
    setIsScrapingSynopsis(true);
    try {
      const res = await fetch("/api/gemini/scrape-synopsis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameTitle: currentTitle,
          genre: activeSeries?.genre,
          playthroughType: activeSeries?.playthroughType,
        }),
      });
      const data = await res.json();
      if (data.synopsis && onUpdateSeriesSynopsis && activeSeries) {
        onUpdateSeriesSynopsis(
          activeSeries.id,
          data.synopsis,
          data.source || "AI Web Scraped via Google Search Grounding"
        );
      }
    } catch (err) {
      console.error("Error scraping game synopsis:", err);
    } finally {
      setIsScrapingSynopsis(false);
    }
  };

  // Auto-apply game synopsis from DB library (custom or built-in) if matched by title, before defaulting to live web scrape
  useEffect(() => {
    if (!currentTitle || !activeSeries) return;

    const dbMatch = findSynopsisInDb(currentTitle, customDb);

    if (dbMatch) {
      if (!activeSeries.gameSynopsis || activeSeries.gameSynopsis !== dbMatch.synopsis) {
        if (onUpdateSeriesSynopsis) {
          onUpdateSeriesSynopsis(
            activeSeries.id,
            dbMatch.synopsis,
            dbMatch.sourceFile ? `DB Library (${dbMatch.sourceFile})` : "Official DB Library"
          );
        }
      }
    } else {
      if ((!activeSeries.gameSynopsis || activeSeries.gameSynopsis.includes("An epic")) && !isScrapingSynopsis) {
        handleScrapeSynopsis();
      }
    }
  }, [activeSeries?.id, currentTitle, activeSeries?.gameSynopsis, customDb]);

  // Custom compact Area Dropdown state
  const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState(false);
  const [areaSearchQuery, setAreaSearchQuery] = useState("");
  const areaDropdownRef = useRef<HTMLDivElement>(null);

  // Close area dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (areaDropdownRef.current && !areaDropdownRef.current.contains(event.target as Node)) {
        setIsAreaDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset area/world filter, search, and status filter when switching active playthroughs
  useEffect(() => {
    setWorldFilter("All");
    setSearch("");
    setStatusFilter("All");
  }, [gameTitle]);

  // Minimize state for interface panels with persistent storage
  const [isOverviewMinimized, setIsOverviewMinimized] = useState<boolean>(() => {
    return localStorage.getItem("yt_overview_minimized") === "true";
  });

  useEffect(() => {
    localStorage.setItem("yt_overview_minimized", isOverviewMinimized.toString());
  }, [isOverviewMinimized]);

  // Calculate Next Up Spotlight Episodes (lowest part numbers by pending status)
  const sortedEpisodes = [...(episodes || [])].sort((a, b) => a.partNumber - b.partNumber);
  const nextToRecord = (sortedEpisodes || []).find((e) => e?.status === "not_started");
  const nextToEdit = (sortedEpisodes || []).find((e) => e?.status === "recorded");
  const nextToUpload = (sortedEpisodes || []).find((e) => e?.status === "edited");

  // Calculate Series Runtime Statistics
  const totalMinutes = episodes.reduce((acc, curr) => acc + (curr.estDurationMinutes || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const recordedMinutes = episodes
    .filter((e) => e.status !== "not_started")
    .reduce((acc, curr) => acc + (curr.estDurationMinutes || 0), 0);
  const recordedHours = (recordedMinutes / 60).toFixed(1);

  const publishedCount = episodes.filter((e) => e.status === "published").length;
  const progressPercent = episodes.length > 0 ? Math.round((publishedCount / episodes.length) * 100) : 0;

  // Extract unique worlds dynamically
  const uniqueWorlds = Array.from(new Set((episodes || []).map((ep) => ep.world))).filter(Boolean);

  const filteredEpisodes = (episodes || []).filter((ep) => {
    if (!ep) return false;
    const searchLower = (search || "").toLowerCase();
    const matchesSearch =
      !searchLower ||
      (ep.title && ep.title.toLowerCase().includes(searchLower)) ||
      (Array.isArray(ep.keyEvents) && ep.keyEvents.some((k) => k && k.toLowerCase().includes(searchLower))) ||
      (ep.startPoint && ep.startPoint.toLowerCase().includes(searchLower)) ||
      (ep.endPoint && ep.endPoint.toLowerCase().includes(searchLower)) ||
      (Array.isArray(ep.partyMembers) && ep.partyMembers.some((p) => p && p.toLowerCase().includes(searchLower))) ||
      (Array.isArray(ep.tags) && ep.tags.some((t) => t && t.toLowerCase().includes(searchLower)));

    const matchesWorld = worldFilter === "All" || ep.world === worldFilter;
    const matchesStatus = statusFilter === "All" || ep.status === statusFilter;

    return matchesSearch && matchesWorld && matchesStatus;
  });

  const getNextStatus = (current: EpisodeStatus): EpisodeStatus => {
    switch (current) {
      case "not_started":
        return "recorded";
      case "recorded":
        return "edited";
      case "edited":
        return "uploaded";
      case "uploaded":
        return "published";
      default:
        return "published";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3.5 sm:px-5 lg:px-6 py-4 space-y-3.5">

      {/* Unified Series Production Overview & Creator Focus Window */}
      <div className="bg-[#0b0e17] rounded-xl border border-white/10 shadow-md overflow-hidden transition-all duration-300">
        {/* Window Header */}
        <div className="px-3.5 py-2 bg-[#080b12] border-b border-white/10 flex items-center justify-between gap-2.5 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <div className="flex items-center gap-1.5 text-blue-400 font-extrabold text-xs uppercase tracking-wider shrink-0">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Series Production Overview & Creator Focus</span>
            </div>

            {isOverviewMinimized && (
              <span className="text-[11px] text-zinc-400 font-medium truncate hidden sm:inline">
                • {totalHours} hrs • {publishedCount}/{episodes.length} published ({progressPercent}%)
              </span>
            )}
          </div>

          <button
            onClick={() => setIsOverviewMinimized(!isOverviewMinimized)}
            className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-md text-xs font-bold border border-amber-500/30 transition-all cursor-pointer shrink-0"
            title={isOverviewMinimized ? "Expand Overview & Creator Focus Window" : "Minimize Overview & Creator Focus Window"}
          >
            {isOverviewMinimized ? (
              <>
                <Maximize2 className="w-3 h-3 text-amber-400" />
                <span>Expand</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3 h-3 text-amber-400" />
                <span>Minimize</span>
              </>
            )}
          </button>
        </div>

        {!isOverviewMinimized ? (
          <div className="p-3.5 space-y-3 bg-[#080a11]">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-wrap">
              <div className="bg-[#05070e] p-2 rounded-lg border border-white/5 flex items-center justify-between shadow-inner">
                <div>
                  <span className="text-zinc-500 text-[9px] uppercase font-bold tracking-wider block">Duration</span>
                  <span className="text-zinc-100 font-black text-xs sm:text-sm">{totalHours} Hours</span>
                  <span className="text-zinc-400 text-[9px] block">{episodes.length} Total Episodes</span>
                </div>
                <div className="p-1.5 bg-blue-500/10 rounded-md text-blue-400 border border-blue-500/20">
                  <Clock className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="bg-[#05070e] p-2 rounded-lg border border-white/5 flex items-center justify-between shadow-inner">
                <div>
                  <span className="text-zinc-500 text-[9px] uppercase font-bold tracking-wider block">Recorded</span>
                  <span className="text-amber-300 font-black text-xs sm:text-sm">{recordedHours} Hours</span>
                  <span className="text-zinc-400 text-[9px] block">
                    {episodes.filter((e) => e.status !== "not_started").length}/{episodes.length} Episodes
                  </span>
                </div>
                <div className="p-1.5 bg-amber-500/10 rounded-md text-amber-400 border border-amber-500/20">
                  <Mic className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="bg-[#05070e] p-2 rounded-lg border border-white/5 flex items-center justify-between shadow-inner">
                <div>
                  <span className="text-zinc-500 text-[9px] uppercase font-bold tracking-wider block">Published</span>
                  <span className="text-emerald-400 font-black text-xs sm:text-sm">{publishedCount} / {episodes.length}</span>
                  <span className="text-emerald-400 text-[9px] block font-semibold">{progressPercent}% Complete</span>
                </div>
                <div className="p-1.5 bg-emerald-500/10 rounded-md text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* 2. Merged Production Milestone Progress Bar Area */}
            <div className="pt-0.5">
              <MilestoneTrackerBar
                episodes={episodes}
                gameTitle={gameTitle}
              />
            </div>

            {/* 3. Integrated Creator Focus Section */}
            {(nextToRecord || nextToEdit || nextToUpload) && (
              <div className="pt-2 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative w-5 h-5 rounded-md overflow-hidden bg-gradient-to-tr from-amber-600 to-amber-400 border border-amber-400/50 flex items-center justify-center text-white text-[9px] font-black shrink-0 shadow-sm">
                      {userProfile?.avatarUrl ? (
                        <img src={userProfile.avatarUrl} alt="Creator" className="w-full h-full object-cover" />
                      ) : (
                        <span>{(userProfile?.displayName || userProfile?.username || "C").slice(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
                        {userProfile?.displayName ? `${userProfile.displayName}'s Creator Focus` : "Creator Focus: Next Up To Work On"}
                      </h4>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-400 hidden sm:inline">
                    Click advance button to fast-track production
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                  {/* Next to Record */}
                  {nextToRecord ? (
                    <div className="p-2.5 bg-[#09090b] rounded-xl border border-amber-500/30 flex flex-col justify-between gap-1.5 hover:border-amber-500/50 transition-colors">
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-extrabold uppercase text-amber-400 mb-0.5">
                          <span className="flex items-center gap-1">
                            <Mic className="w-3 h-3 text-amber-400" /> Next To Record
                          </span>
                          <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30">Pt {nextToRecord.partNumber}</span>
                        </div>
                        <h5 className="font-bold text-white text-xs line-clamp-1">{nextToRecord.title}</h5>
                        <p className="text-[10px] text-zinc-400 line-clamp-1">{nextToRecord.startPoint} ➔ {nextToRecord.endPoint}</p>
                      </div>
                      <div className="pt-1">
                        <button
                          onClick={() => onUpdateStatus(nextToRecord.id, "recorded")}
                          className="w-full py-1 px-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg text-xs font-bold border border-amber-500/40 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Mark Done</span>
                          <ArrowRight className="w-3 h-3 text-amber-400" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-[#09090b]/50 rounded-xl border border-zinc-800/80 text-zinc-500 text-[11px] flex items-center justify-center text-center">
                      🎉 All episodes recorded!
                    </div>
                  )}

                  {/* Next to Edit */}
                  {nextToEdit ? (
                    <div className="p-2.5 bg-[#09090b] rounded-xl border border-purple-500/30 flex flex-col justify-between gap-1.5 hover:border-purple-500/50 transition-colors">
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-extrabold uppercase text-purple-300 mb-0.5">
                          <span className="flex items-center gap-1">
                            <Scissors className="w-3 h-3 text-purple-400" /> Next To Edit
                          </span>
                          <span className="bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded border border-purple-500/30">Pt {nextToEdit.partNumber}</span>
                        </div>
                        <h5 className="font-bold text-white text-xs line-clamp-1">{nextToEdit.title}</h5>
                        <p className="text-[10px] text-zinc-400 line-clamp-1">{nextToEdit.startPoint} ➔ {nextToEdit.endPoint}</p>
                      </div>
                      <button
                        onClick={() => onUpdateStatus(nextToEdit.id, "edited")}
                        className="w-full py-1 px-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg text-xs font-bold border border-purple-500/40 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Mark Edited</span>
                        <ArrowRight className="w-3 h-3 text-purple-400" />
                      </button>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-[#09090b]/50 rounded-xl border border-zinc-800/80 text-zinc-500 text-[11px] flex items-center justify-center text-center">
                      ✂️ No recorded videos waiting for editing.
                    </div>
                  )}

                  {/* Next to Upload */}
                  {nextToUpload ? (
                    <div className="p-2.5 bg-[#09090b] rounded-xl border border-blue-500/30 flex flex-col justify-between gap-1.5 hover:border-blue-500/50 transition-colors">
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-extrabold uppercase text-blue-400 mb-0.5">
                          <span className="flex items-center gap-1">
                            <UploadCloud className="w-3 h-3 text-blue-400" /> Next To Upload
                          </span>
                          <span className="bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded border border-blue-500/30">Pt {nextToUpload.partNumber}</span>
                        </div>
                        <h5 className="font-bold text-white text-xs line-clamp-1">{nextToUpload.title}</h5>
                        <p className="text-[10px] text-zinc-400 line-clamp-1">{nextToUpload.startPoint} ➔ {nextToUpload.endPoint}</p>
                      </div>
                      <div className="flex gap-1.5">
                        {onOpenYouTubeStudio && (
                          <button
                            onClick={() => onOpenYouTubeStudio(nextToUpload.id)}
                            className="py-1 px-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-black transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-md shadow-red-950/40"
                            title="Open YouTube Studio Direct Upload Launcher"
                          >
                            <Youtube className="w-3.5 h-3.5 text-white" />
                            <span>YouTube</span>
                          </button>
                        )}
                        <button
                          onClick={() => onUpdateStatus(nextToUpload.id, "uploaded")}
                          className="flex-1 py-1 px-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg text-xs font-bold border border-blue-500/40 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Mark Uploaded</span>
                          <ArrowRight className="w-3 h-3 text-blue-400" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-[#09090b]/50 rounded-xl border border-zinc-800/80 text-zinc-500 text-[11px] flex items-center justify-center text-center">
                      🚀 No edited videos waiting for upload.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Minimized Compact Strip showing stats + Creator Focus quick items + Milestone Progress Bar */
          <div className="p-3 bg-[#09090b] space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-zinc-300 bg-white/5 px-2 py-1 rounded border border-white/10">
                  {totalHours}h ({episodes.length} eps)
                </span>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                  {publishedCount}/{episodes.length} ({progressPercent}%)
                </span>

                {nextToRecord && (
                  <div className="flex items-center gap-1.5 bg-[#18181b] border border-amber-500/40 px-2.5 py-1 rounded-lg">
                    <Mic className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="text-[10px] font-bold text-amber-300">Pt {nextToRecord.partNumber}</span>
                    <span className="text-[10px] text-zinc-300 max-w-[110px] truncate">{nextToRecord.shortTitle}</span>
                    <button
                      onClick={() => onUpdateStatus(nextToRecord.id, "recorded")}
                      className="text-[9px] font-black bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30 transition-colors cursor-pointer"
                    >
                      Record ➔
                    </button>
                  </div>
                )}

                {nextToEdit && (
                  <div className="flex items-center gap-1.5 bg-[#18181b] border border-purple-500/40 px-2.5 py-1 rounded-lg">
                    <Scissors className="w-3 h-3 text-purple-400 shrink-0" />
                    <span className="text-[10px] font-bold text-purple-300">Pt {nextToEdit.partNumber}</span>
                    <span className="text-[10px] text-zinc-300 max-w-[110px] truncate">{nextToEdit.shortTitle}</span>
                    <button
                      onClick={() => onUpdateStatus(nextToEdit.id, "edited")}
                      className="text-[9px] font-black bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30 transition-colors cursor-pointer"
                    >
                      Edit ➔
                    </button>
                  </div>
                )}

                {nextToUpload && (
                  <div className="flex items-center gap-1.5 bg-[#18181b] border border-blue-500/40 px-2.5 py-1 rounded-lg">
                    <UploadCloud className="w-3 h-3 text-blue-400 shrink-0" />
                    <span className="text-[10px] font-bold text-blue-300">Pt {nextToUpload.partNumber}</span>
                    <span className="text-[10px] text-zinc-300 max-w-[110px] truncate">{nextToUpload.shortTitle}</span>
                    <button
                      onClick={() => onUpdateStatus(nextToUpload.id, "uploaded")}
                      className="text-[9px] font-black bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30 transition-colors cursor-pointer"
                    >
                      Upload ➔
                    </button>
                  </div>
                )}
              </div>

              <span className="text-[10px] font-semibold text-zinc-500 italic">
                Minimized
              </span>
            </div>

            {/* Production Milestone Progress Bar (Minimized View) */}
            <div className="pt-2 border-t border-white/10">
              <MilestoneTrackerBar
                episodes={episodes}
                gameTitle={gameTitle}
              />
            </div>
          </div>
        )}
      </div>

      {/* Controls Bar & High-Impact Search Window */}
      <div className="bg-gradient-to-r from-[#0d1220] via-[#111625] to-[#0d1220] p-2.5 sm:p-3 rounded-2xl border-2 border-blue-500/50 shadow-2xl shadow-blue-950/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {/* Popping High-Contrast Search Input */}
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 group-focus-within:bg-cyan-500/30 group-focus-within:scale-105 transition-all">
                <Search className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
              </div>
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search active playthrough: boss strategies, key events, party members, locations..."
              className="w-full bg-[#090d16] border-2 border-cyan-500/40 hover:border-cyan-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-500/25 rounded-xl pl-11 pr-28 py-1.5 text-xs sm:text-sm font-semibold text-white placeholder-zinc-400 focus:outline-none transition-all shadow-inner shadow-black/80"
            />

            {/* Quick Actions inside Search Bar */}
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {search ? (
                <button
                  onClick={() => setSearch("")}
                  className="px-2 py-0.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              ) : (
                <span className="text-[10px] font-extrabold uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full hidden sm:inline-block">
                  Instant Search
                </span>
              )}
            </div>
          </div>

          {/* Filters & Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Compact Styled Area Dropdown */}
            {uniqueWorlds.length > 0 && (
              <div className="relative" ref={areaDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsAreaDropdownOpen(!isAreaDropdownOpen)}
                  className={`inline-flex items-center gap-2 bg-[#09090b] hover:bg-[#18181b] border rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all cursor-pointer shadow-sm ${
                    worldFilter !== "All"
                      ? "border-amber-500 text-amber-300 bg-amber-500/10"
                      : "border-white/10 hover:border-amber-500/50 text-zinc-200"
                  }`}
                  title={worldFilter === "All" ? "Filter by Area" : `Current Area: ${worldFilter}`}
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate max-w-[130px] sm:max-w-[180px]">
                    {worldFilter === "All" ? "All Areas" : worldFilter}
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] bg-amber-500/20 text-amber-300 rounded font-mono font-extrabold shrink-0">
                    {worldFilter === "All"
                      ? episodes.length
                      : episodes.filter((ep) => ep.world === worldFilter).length}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-amber-400/80 transition-transform duration-200 shrink-0 ${
                      isAreaDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Floating Area Menu */}
                {isAreaDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1.5 z-50 w-72 sm:w-80 bg-[#121212] border border-amber-500/40 rounded-xl shadow-2xl p-2.5 space-y-2 backdrop-blur-xl animate-in fade-in duration-100">
                    <div className="flex items-center justify-between px-1 pb-1 border-b border-white/10">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-400 uppercase tracking-wider">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Playthrough Areas</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono font-semibold bg-white/5 px-2 py-0.5 rounded-full">
                        {uniqueWorlds.length} total
                      </span>
                    </div>

                    {/* Search inside Area Menu if list is long */}
                    {uniqueWorlds.length > 4 && (
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={areaSearchQuery}
                          onChange={(e) => setAreaSearchQuery(e.target.value)}
                          placeholder="Search area name..."
                          className="w-full bg-[#09090b] border border-white/10 rounded-md pl-8 pr-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                    )}

                    {/* Area Options List */}
                    <div className="max-h-60 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                      {/* All Areas Option */}
                      <button
                        type="button"
                        onClick={() => {
                          setWorldFilter("All");
                          setIsAreaDropdownOpen(false);
                          setAreaSearchQuery("");
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                          worldFilter === "All"
                            ? "bg-amber-500 text-zinc-950 font-extrabold shadow-md"
                            : "text-zinc-300 hover:bg-amber-500/15 hover:text-amber-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {worldFilter === "All" && <Check className="w-3.5 h-3.5 shrink-0" />}
                          <span className="truncate">All Areas & Acts</span>
                        </div>
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            worldFilter === "All"
                              ? "bg-zinc-950/20 text-zinc-950"
                              : "bg-white/5 text-zinc-400"
                          }`}
                        >
                          {episodes.length}
                        </span>
                      </button>

                      {/* Filtered Area Items */}
                      {uniqueWorlds
                        .filter((w) =>
                          String(w).toLowerCase().includes(areaSearchQuery.toLowerCase())
                        )
                        .map((w) => {
                          const isSelected = worldFilter === w;
                          const epCount = episodes.filter((ep) => ep.world === w).length;
                          return (
                            <button
                              key={w}
                              type="button"
                              onClick={() => {
                                setWorldFilter(w);
                                setIsAreaDropdownOpen(false);
                                setAreaSearchQuery("");
                              }}
                              title={w}
                              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-amber-500 text-zinc-950 font-extrabold shadow-md"
                                  : "text-zinc-300 hover:bg-amber-500/15 hover:text-amber-300"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0 pr-2">
                                {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                                <span className="truncate">{w}</span>
                              </div>
                              <span
                                className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                                  isSelected
                                    ? "bg-zinc-950/20 text-zinc-950"
                                    : "bg-white/5 text-zinc-400"
                                }`}
                              >
                                {epCount}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#09090b] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-300 outline-none cursor-pointer hover:border-zinc-700"
            >
              <option value="All">All Statuses</option>
              <option value="not_started">⚪ Not Started</option>
              <option value="recorded">🟡 Recorded</option>
              <option value="edited">🟣 Edited</option>
              <option value="uploaded">🔵 Uploaded</option>
              <option value="published">🟢 Published</option>
            </select>

            {/* Add Episode Button */}
            {onOpenAddEpisode && (
              <button
                onClick={onOpenAddEpisode}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-lg text-xs font-bold transition-all shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-zinc-950" />
                <span>Add Episode</span>
              </button>
            )}

            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#09090b] p-0.5 rounded-lg border border-white/10">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1 rounded transition-all cursor-pointer ${viewMode === "grid" ? "bg-amber-500 text-zinc-950 font-bold shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1 rounded transition-all cursor-pointer ${viewMode === "list" ? "bg-amber-500 text-zinc-950 font-bold shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
                title="Compact List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={`p-1 rounded transition-all cursor-pointer ${viewMode === "kanban" ? "bg-amber-500 text-zinc-950 font-bold shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
                title="Kanban Pipeline Board"
              >
                <Columns className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Counter */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-zinc-400">
          Showing <span className="font-semibold text-zinc-200">{filteredEpisodes.length}</span> of {episodes.length} episodes in <span className="text-blue-400 font-bold">{gameTitle}</span>
        </p>
        {(search || worldFilter !== "All" || statusFilter !== "All") && (
          <button
            onClick={() => {
              setSearch("");
              setWorldFilter("All");
              setStatusFilter("All");
            }}
            className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Reset Filters
          </button>
        )}
      </div>

      {/* Episodes Views: Grid, List, or Kanban */}
      {filteredEpisodes.length === 0 ? (
        <div className="text-center py-16 bg-[#121212] rounded-2xl border border-white/10">
          <Sparkles className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-zinc-300">No episodes matched your search</h3>
          <p className="text-sm text-zinc-500 mt-1">Try clearing your filters or adding a new episode.</p>
          <div className="flex justify-center gap-3 mt-4">
            <button
              onClick={() => {
                setSearch("");
                setWorldFilter("All");
                setStatusFilter("All");
              }}
              className="px-4 py-2 bg-[#18181b] hover:bg-[#27272a] text-amber-300 rounded-lg text-xs font-semibold border border-white/10 transition-colors"
            >
              Clear All Filters
            </button>
            {onOpenAddEpisode && (
              <button
                onClick={onOpenAddEpisode}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-zinc-950 rounded-lg text-xs font-bold transition-colors shadow-md shadow-blue-500/20 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Episode</span>
              </button>
            )}
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEpisodes.map((episode) => (
            <EpisodeCard
              key={episode.id}
              episode={episode}
              onSelect={onSelectEpisode}
              onUpdateStatus={onUpdateStatus}
              onDuplicate={onDuplicateEpisode}
              onDelete={onDeleteEpisode}
              onOpenRecordingTimer={onOpenRecordingTimer}
              onOpenYouTubeStudio={onOpenYouTubeStudio}
            />
          ))}
        </div>
      ) : viewMode === "list" ? (
        <div className="space-y-3">
          {filteredEpisodes.map((episode) => {
            const listGlowClass =
              episode.status === "published"
                ? "border-emerald-500/50 hover:border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] bg-gradient-to-r from-emerald-950/25 via-[#121215] to-[#121215]"
                : episode.status === "uploaded"
                ? "border-blue-500/50 hover:border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)] bg-gradient-to-r from-blue-950/25 via-[#121215] to-[#121215]"
                : episode.status === "edited"
                ? "border-purple-500/50 hover:border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)] bg-gradient-to-r from-purple-950/25 via-[#121215] to-[#121215]"
                : episode.status === "recorded"
                ? "border-amber-500/50 hover:border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)] bg-gradient-to-r from-amber-950/25 via-[#121215] to-[#121215]"
                : "border-white/10 hover:border-zinc-500 bg-[#121215]";

            return (
              <div
                key={episode.id}
                onClick={() => onSelectEpisode(episode)}
                className={`border rounded-xl p-4 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group ${listGlowClass}`}
              >
              <div className="flex items-start sm:items-center gap-3">
                <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20 shrink-0">
                  EP {episode.partNumber < 10 ? `0${episode.partNumber}` : episode.partNumber}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-zinc-100 group-hover:text-blue-300 line-clamp-1">
                    {episode.title}
                  </h4>
                  <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{episode.startPoint} ➔ {episode.endPoint}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-zinc-400 shrink-0">
                <span className="bg-[#09090b] px-2.5 py-1 rounded border border-white/10">
                  ~{episode.estDurationMinutes}m
                </span>
                <span
                  className="inline-flex items-center gap-1 bg-purple-500/10 text-purple-300 px-2.5 py-1 rounded border border-purple-500/20 max-w-[180px] sm:max-w-[240px] truncate font-medium"
                  title={`Area / Location: ${episode.world}`}
                >
                  <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                  <span className="truncate">{episode.world}</span>
                </span>

                {episode.videoStats && (
                  <span
                    className="inline-flex items-center gap-2 bg-red-950/40 text-zinc-200 px-2.5 py-1 rounded border border-red-500/30 text-xs font-mono font-bold"
                    title={`Views: ${episode.videoStats.views.toLocaleString()} | Likes: ${episode.videoStats.likes.toLocaleString()} | Comments: ${episode.videoStats.comments.toLocaleString()}`}
                  >
                    <span className="flex items-center gap-1 text-cyan-300">
                      <Eye className="w-3 h-3" />
                      {formatCompactNumber(episode.videoStats.views)}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-300">
                      <ThumbsUp className="w-3 h-3" />
                      {formatCompactNumber(episode.videoStats.likes)}
                    </span>
                    <span className="flex items-center gap-1 text-amber-300">
                      <MessageSquare className="w-3 h-3" />
                      {formatCompactNumber(episode.videoStats.comments)}
                    </span>
                  </span>
                )}
                <select
                  value={episode.status}
                  onChange={(e) => {
                    e.stopPropagation();
                    onUpdateStatus(episode.id, e.target.value as EpisodeStatus);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-[#09090b] border border-white/10 text-xs font-semibold px-2 py-1 rounded text-zinc-200 outline-none"
                >
                  <option value="not_started">⚪ Not Started</option>
                  <option value="recorded">🟡 Recorded</option>
                  <option value="edited">🟣 Edited</option>
                  <option value="uploaded">🔵 Uploaded</option>
                  <option value="published">🟢 Published</option>
                </select>

                {/* Action Buttons Toolbar */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* 1. Start Live Recording Session */}
                  {onOpenRecordingTimer && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenRecordingTimer(episode);
                      }}
                      title={`Start Live Recording Session (EP ${episode.partNumber})`}
                      className="p-1.5 rounded-lg bg-[#2a131b] hover:bg-[#3d1926] text-red-400 hover:text-red-200 border border-red-500/50 transition-all flex items-center justify-center cursor-pointer shadow-sm"
                    >
                      <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                    </button>
                  )}

                  {/* 2. YouTube Studio Upload and 1 Click Copy Panel */}
                  {onOpenYouTubeStudio && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenYouTubeStudio(episode.id);
                      }}
                      title="Youtube Studio Upload and 1 Click Copy Panel"
                      className="p-1.5 rounded-lg bg-[#2a131b]/60 hover:bg-red-900/60 text-red-400 hover:text-white transition-colors border border-red-500/40 cursor-pointer shadow-sm"
                    >
                      <Youtube className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* 3. Duplicate/Clone Episode */}
                  {onDuplicateEpisode && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateEpisode(episode);
                      }}
                      title="Duplicate/Clone Episode"
                      className="p-1.5 rounded-lg bg-[#09090b] hover:bg-[#27272a] text-zinc-300 hover:text-cyan-300 transition-colors border border-white/10 hover:border-cyan-400/40 cursor-pointer shadow-sm"
                    >
                      <CopyPlus className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* 4. Copy Title and Description for Youtube Studio */}
                  <button
                    type="button"
                    onClick={(e) => handleCopyEpisodePackage(e, episode)}
                    title="Copy Title and Description for Youtube Studio"
                    className={`p-1.5 rounded-lg transition-colors border cursor-pointer shadow-sm ${
                      copiedEpisodeId === episode.id
                        ? "bg-emerald-950/80 border-emerald-500 text-emerald-300"
                        : "bg-[#09090b] hover:bg-[#27272a] text-zinc-300 hover:text-white border-white/10 hover:border-cyan-400/40"
                    }`}
                  >
                    {copiedEpisodeId === episode.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* 5. Delete Episode */}
                  {onDeleteEpisode && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Are you sure you want to delete Episode ${episode.partNumber}?`)) {
                          onDeleteEpisode(episode.id);
                        }
                      }}
                      title="Delete Episode"
                      className="p-1.5 rounded-lg bg-[#09090b] hover:bg-red-950/80 text-zinc-400 hover:text-red-400 transition-colors border border-white/10 hover:border-red-500/50 cursor-pointer shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        </div>
      ) : (
        /* Kanban Pipeline View */
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            { id: "not_started", title: "⚪ Not Started", border: "border-zinc-800", headerBg: "bg-zinc-900/60" },
            { id: "recorded", title: "🟡 Recorded", border: "border-amber-500/30", headerBg: "bg-amber-500/10" },
            { id: "edited", title: "🟣 Edited", border: "border-purple-500/30", headerBg: "bg-purple-500/10" },
            { id: "uploaded", title: "🔵 Uploaded", border: "border-blue-500/30", headerBg: "bg-blue-500/10" },
            { id: "published", title: "🟢 Published", border: "border-emerald-500/30", headerBg: "bg-emerald-500/10" },
          ].map((column) => {
            const colEpisodes = filteredEpisodes.filter((e) => e.status === column.id);

            return (
              <div key={column.id} className={`bg-[#121212] rounded-xl border ${column.border} p-2.5 space-y-2 flex flex-col`}>
                <div className={`p-2 rounded-lg text-xs font-bold text-zinc-200 flex items-center justify-between ${column.headerBg}`}>
                  <span>{column.title}</span>
                  <span className="px-2 py-0.5 rounded-full bg-black/40 text-[10px] text-zinc-400">{colEpisodes.length}</span>
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto max-h-[600px] pr-1">
                  {colEpisodes.length === 0 ? (
                    <div className="text-center py-6 text-[11px] text-zinc-600 italic">No episodes</div>
                  ) : (
                    colEpisodes.map((episode) => {
                      const kanbanGlow =
                        episode.status === "published"
                          ? "border-emerald-500/40 hover:border-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)] bg-gradient-to-b from-emerald-950/25 via-[#18181b] to-[#141417]"
                          : episode.status === "uploaded"
                          ? "border-blue-500/40 hover:border-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.25)] bg-gradient-to-b from-blue-950/25 via-[#18181b] to-[#141417]"
                          : episode.status === "edited"
                          ? "border-purple-500/40 hover:border-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.25)] bg-gradient-to-b from-purple-950/25 via-[#18181b] to-[#141417]"
                          : episode.status === "recorded"
                          ? "border-amber-500/40 hover:border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)] bg-gradient-to-b from-amber-950/25 via-[#18181b] to-[#141417]"
                          : "border-white/10 hover:border-white/20 bg-[#18181b]";

                      return (
                        <div
                          key={episode.id}
                          onClick={() => onSelectEpisode(episode)}
                          className={`p-3 border rounded-lg cursor-pointer transition-all space-y-2 group ${kanbanGlow}`}
                        >
                        <div className="flex items-center justify-between text-[10px] text-blue-400 font-mono font-bold">
                          <span>EP {episode.partNumber}</span>
                          <span className="text-zinc-500 text-[9px] font-sans">~{episode.estDurationMinutes}m</span>
                        </div>

                        <h5 className="text-xs font-bold text-zinc-100 line-clamp-2 leading-tight group-hover:text-blue-300">
                          {episode.title}
                        </h5>

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                          <span
                            className="text-[9px] text-zinc-400 bg-black/40 px-1.5 py-0.5 rounded truncate max-w-[120px]"
                            title={episode.world}
                          >
                            {episode.world}
                          </span>

                          <select
                            value={episode.status}
                            onChange={(e) => {
                              e.stopPropagation();
                              onUpdateStatus(episode.id, e.target.value as EpisodeStatus);
                            }}
                            className="text-[10px] bg-black/60 hover:bg-black text-zinc-300 border border-white/10 rounded px-1.5 py-0.5 outline-none cursor-pointer transition-colors"
                          >
                            <option value="not_started">⚪ Not Started</option>
                            <option value="recorded">🟡 Recorded</option>
                            <option value="edited">🟣 Edited</option>
                            <option value="uploaded">🔵 Uploaded</option>
                            <option value="published">🟢 Published</option>
                          </select>
                        </div>
                      </div>
                    );
                  })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


