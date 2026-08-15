import React, { useState, useEffect, useRef } from "react";
import {
  Trophy,
  CheckCircle2,
  Clock,
  Mic,
  Scissors,
  Upload,
  Youtube,
  AlertTriangle,
  Play,
  Swords,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  Filter,
  Check,
  Calendar,
  Zap,
  Target,
  BarChart3,
  PieChart,
  Layers,
  Award,
  BookOpen,
  Image as ImageIcon,
  RefreshCw,
  FolderKanban,
  Gamepad2,
  Maximize2,
  Minimize2,
  Globe,
  Edit2,
  FileText,
  Database,
  Copy,
  Trash2,
  Search,
  X,
  FileCode,
  FolderUp,
  FileCheck
} from "lucide-react";
import { Episode, EpisodeStatus, PlaythroughSeries, QuestEntry, BossEntry, LootEntry } from "../types";
import { getBossAndLootForSeries } from "../data/bossLootData";
import { safeFetchJson } from "../utils/apiUtils";
import { useAuth } from "../context/AuthContext";
import { findSynopsisInDb, CustomSynopsisEntry } from "../utils/gameSynopsisDb";

interface SeriesDashboardProps {
  seriesList: PlaythroughSeries[];
  activeSeries: PlaythroughSeries;
  onSelectSeries: (seriesId: string) => void;
  onOpenPlaythroughView: () => void;
  onUpdateEpisodeStatus?: (episodeId: number, newStatus: EpisodeStatus) => void;
  onOpenThumbnailStudio?: () => void;
  onOpenQuestBranchTracker?: () => void;
  onOpenBossLootCatalog?: () => void;
  onUpdateQuests?: (updatedQuests: QuestEntry[]) => void;
  onOpenGameLogoModal?: () => void;
  onUpdateSeriesSynopsis?: (seriesId: string, synopsis: string, source?: string) => void;
}

const STATUS_CONFIG: Record<
  EpisodeStatus,
  { label: string; color: string; bgColor: string; borderColor: string; icon: React.FC<{ className?: string }> }
> = {
  not_started: {
    label: "Planned / To Record",
    color: "text-zinc-400",
    bgColor: "bg-zinc-800/60",
    borderColor: "border-zinc-700/50",
    icon: Calendar,
  },
  recorded: {
    label: "Recorded Footage",
    color: "text-red-400",
    bgColor: "bg-red-500/15",
    borderColor: "border-red-500/30",
    icon: Mic,
  },
  edited: {
    label: "Edited & Mastered",
    color: "text-amber-400",
    bgColor: "bg-amber-500/15",
    borderColor: "border-amber-500/30",
    icon: Scissors,
  },
  uploaded: {
    label: "Uploaded to YouTube",
    color: "text-blue-400",
    bgColor: "bg-blue-500/15",
    borderColor: "border-blue-500/30",
    icon: Upload,
  },
  published: {
    label: "Published Live",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/15",
    borderColor: "border-emerald-500/30",
    icon: Youtube,
  },
};

export const SeriesDashboard: React.FC<SeriesDashboardProps> = ({
  seriesList,
  activeSeries,
  onSelectSeries,
  onOpenPlaythroughView,
  onUpdateEpisodeStatus,
  onOpenThumbnailStudio,
  onOpenQuestBranchTracker,
  onOpenBossLootCatalog,
  onUpdateQuests,
  onOpenGameLogoModal,
  onUpdateSeriesSynopsis,
}) => {
  const { userProfile } = useAuth();
  const episodes = activeSeries.episodes || [];
  const quests = activeSeries.quests || [];
  const seriesId = activeSeries.id;

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

      const activeMatch =
        (parsed || []).find(
          (p) => p?.gameTitle && activeSeries?.gameTitle && p.gameTitle.toLowerCase().trim() === activeSeries.gameTitle.toLowerCase().trim()
        ) ||
        (parsed || []).find(
          (p) =>
            p?.gameTitle && activeSeries?.gameTitle && (
              activeSeries.gameTitle.toLowerCase().includes(p.gameTitle.toLowerCase().trim()) ||
              p.gameTitle.toLowerCase().trim().includes(activeSeries.gameTitle.toLowerCase().trim())
            )
        );

      if (activeMatch && onUpdateSeriesSynopsis) {
        onUpdateSeriesSynopsis(
          activeSeries.id,
          activeMatch.synopsis,
          `Custom DB (${activeMatch.sourceFile || file.name})`
        );
        setUploadFeedback(
          `Imported ${parsed.length} synopsis entries! Matched & applied custom synopsis for "${activeSeries.gameTitle}".`
        );
      } else {
        setUploadFeedback(`Successfully imported ${parsed.length} game synopses into your local database!`);
      }

      setTimeout(() => setUploadFeedback(null), 6000);
    };
    reader.readAsText(file);
    if (e.target) e.target.value = "";
  };

  const handleRemoveFromDb = (gameTitle: string) => {
    setCustomDb((prev) => {
      const updated = prev.filter((item) => item.gameTitle.toLowerCase().trim() !== gameTitle.toLowerCase().trim());
      localStorage.setItem("yt_custom_synopsis_db", JSON.stringify(updated));
      return updated;
    });
  };

  const activeDbMatch = (customDb || []).find(
    (entry) => entry?.gameTitle && activeSeries?.gameTitle && entry.gameTitle.toLowerCase().trim() === activeSeries.gameTitle.toLowerCase().trim()
  ) || (customDb || []).find(
    (entry) =>
      entry?.gameTitle && activeSeries?.gameTitle && (
        activeSeries.gameTitle.toLowerCase().includes(entry.gameTitle.toLowerCase().trim()) ||
        entry.gameTitle.toLowerCase().trim().includes(activeSeries.gameTitle.toLowerCase().trim())
      )
  );

  const handleScrapeSynopsis = async () => {
    setIsScrapingSynopsis(true);
    try {
      const res = await safeFetchJson<{ synopsis?: string; source?: string }>("/api/gemini/scrape-synopsis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameTitle: activeSeries.gameTitle,
          genre: activeSeries.genre,
          playthroughType: activeSeries.playthroughType,
        }),
      });
      if (res && res.synopsis) {
        if (onUpdateSeriesSynopsis) {
          onUpdateSeriesSynopsis(activeSeries.id, res.synopsis, res.source || "AI Web Scraped via Google Search");
        }
      }
    } catch (err) {
      console.error("Error scraping game synopsis:", err);
    } finally {
      setIsScrapingSynopsis(false);
    }
  };

  // Auto-apply game synopsis from DB library (custom or built-in) if matched by title, before defaulting to live web scrape
  useEffect(() => {
    if (!activeSeries.gameTitle) return;

    const dbMatch = findSynopsisInDb(activeSeries.gameTitle, customDb);

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
      // Default to AI web scrape if no DB match found and synopsis is missing or generic
      if ((!activeSeries.gameSynopsis || activeSeries.gameSynopsis.includes("An epic")) && !isScrapingSynopsis) {
        handleScrapeSynopsis();
      }
    }
  }, [activeSeries.id, activeSeries.gameTitle, activeSeries.gameSynopsis, customDb]);

  // Local state for Bosses & Loot to allow interactive toggling on landing dashboard
  const [bosses, setBosses] = useState<BossEntry[]>(() => {
    const saved = localStorage.getItem(`yt_bosses_${seriesId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return getBossAndLootForSeries(activeSeries).bosses;
  });

  const [loot, setLoot] = useState<LootEntry[]>(() => {
    const saved = localStorage.getItem(`yt_loot_${seriesId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return getBossAndLootForSeries(activeSeries).loot;
  });

  // Re-sync local state when activeSeries changes
  useEffect(() => {
    const savedBosses = localStorage.getItem(`yt_bosses_${seriesId}`);
    if (savedBosses) {
      try {
        const parsed = JSON.parse(savedBosses);
        if (Array.isArray(parsed)) setBosses(parsed);
        else setBosses(getBossAndLootForSeries(activeSeries).bosses);
      } catch (e) {
        setBosses(getBossAndLootForSeries(activeSeries).bosses);
      }
    } else {
      setBosses(getBossAndLootForSeries(activeSeries).bosses);
    }

    const savedLoot = localStorage.getItem(`yt_loot_${seriesId}`);
    if (savedLoot) {
      try {
        const parsed = JSON.parse(savedLoot);
        if (Array.isArray(parsed)) setLoot(parsed);
        else setLoot(getBossAndLootForSeries(activeSeries).loot);
      } catch (e) {
        setLoot(getBossAndLootForSeries(activeSeries).loot);
      }
    } else {
      setLoot(getBossAndLootForSeries(activeSeries).loot);
    }
  }, [seriesId, activeSeries]);

  const toggleBossDefeated = (bossId: string) => {
    const updated = bosses.map((b) => (b.id === bossId ? { ...b, defeated: !b.defeated } : b));
    setBosses(updated);
    localStorage.setItem(`yt_bosses_${seriesId}`, JSON.stringify(updated));
  };

  const toggleLootCollected = (lootId: string) => {
    const updated = loot.map((l) => (l.id === lootId ? { ...l, collected: !l.collected } : l));
    setLoot(updated);
    localStorage.setItem(`yt_loot_${seriesId}`, JSON.stringify(updated));
  };

  const toggleQuestCompleted = (questId: string) => {
    if (!onUpdateQuests) return;
    const updated = quests.map((q) => {
      if (q.id === questId) {
        const newStatus = q.status === "completed" ? "in_progress" : "completed";
        return { ...q, status: newStatus as any };
      }
      return q;
    });
    onUpdateQuests(updated);
  };

  // Minimize state for Series Creator Dashboard window with persistent storage
  const [isDashboardMinimized, setIsDashboardMinimized] = useState<boolean>(() => {
    return localStorage.getItem("yt_series_dashboard_minimized") === "true";
  });

  useEffect(() => {
    localStorage.setItem("yt_series_dashboard_minimized", isDashboardMinimized.toString());
  }, [isDashboardMinimized]);

  // 1. Completion Percentage Math
  const totalEpisodes = episodes.length;
  const publishedEpisodes = episodes.filter((e) => e.status === "published").length;
  const readyEpisodes = episodes.filter((e) => e.status === "published" || e.status === "edited" || e.status === "uploaded").length;
  const completionPercent = totalEpisodes > 0 ? Math.round((publishedEpisodes / totalEpisodes) * 100) : 0;
  const readyPercent = totalEpisodes > 0 ? Math.round((readyEpisodes / totalEpisodes) * 100) : 0;

  // 2. Episodes by Status Counts
  const statusCounts: Record<EpisodeStatus, number> = {
    not_started: 0,
    recorded: 0,
    edited: 0,
    uploaded: 0,
    published: 0,
  };
  episodes.forEach((e) => {
    statusCounts[e.status] = (statusCounts[e.status] || 0) + 1;
  });

  // 3. Runtime Calculations
  const totalPlannedMins = episodes.reduce((acc, ep) => acc + (ep.estDurationMinutes || 90), 0);
  const totalPlannedHours = (totalPlannedMins / 60).toFixed(1);
  const completedMins = episodes
    .filter((e) => e.status === "published" || e.status === "uploaded" || e.status === "edited")
    .reduce((acc, ep) => acc + (ep.estDurationMinutes || 90), 0);
  const completedHours = (completedMins / 60).toFixed(1);
  const remainingMins = totalPlannedMins - completedMins;
  const remainingHours = (remainingMins / 60).toFixed(1);
  const avgEpisodeMins = totalEpisodes > 0 ? Math.round(totalPlannedMins / totalEpisodes) : 90;

  // 4. Upcoming Recording & Editing Tasks Queue
  const nextToRecord = episodes.find((e) => e.status === "not_started");
  const nextToEdit = episodes.find((e) => e.status === "recorded");
  const nextToPublish = episodes.find((e) => e.status === "edited" || e.status === "uploaded");

  // 5. Missable Quests & Loot Alerts
  const missableQuests = quests.filter((q) => q.isMissable && q.status !== "completed");
  const uncollectedMissableLoot = loot.filter((l) => l.isMissable && !l.collected);
  const undefeatedMissableBosses = bosses.filter((b) => b.isMissable && !b.defeated);

  // Check if immediate next episode to record/edit has missables!
  const currentUpNextEpNum = nextToRecord?.partNumber || nextToEdit?.partNumber || 1;
  const immediateMissablesCount =
    missableQuests.filter((q) => q.episodePart === currentUpNextEpNum).length +
    uncollectedMissableLoot.filter((l) => l.episodePart === currentUpNextEpNum).length +
    undefeatedMissableBosses.filter((b) => b.episodePart === currentUpNextEpNum).length;

  return (
    <section className="bg-gradient-to-b from-[#0e1738] via-[#091129] to-[#050a1b] border border-blue-500/35 border-t-blue-400/40 rounded-3xl overflow-hidden shadow-2xl shadow-blue-950/60 relative ring-1 ring-blue-500/20 transition-all duration-300">
      {/* Background Glows & Subtle Grid Depth */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Window Header Bar with Minimize & Expand */}
      <div className="px-4 py-2.5 bg-[#091024]/90 border-b border-blue-500/30 flex items-center justify-between gap-3 relative z-10 backdrop-blur-md">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <div className="flex items-center gap-1.5 text-blue-400 font-extrabold text-xs uppercase tracking-wider shrink-0">
            <Zap className="w-4 h-4 text-blue-400 fill-blue-400" />
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Series Creator Dashboard</span>
          </div>

          <span className="text-xs font-extrabold text-white truncate">
            • {activeSeries?.gameTitle || "Gaming Series"}
          </span>

          {isDashboardMinimized && (
            <span className="text-[11px] text-zinc-400 font-medium truncate hidden sm:inline">
              • {publishedEpisodes}/{totalEpisodes} Ep Published ({completionPercent}%) • ~{totalPlannedHours} hrs
            </span>
          )}
        </div>

        <button
          onClick={() => setIsDashboardMinimized(!isDashboardMinimized)}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg text-xs font-bold border border-amber-500/30 transition-all cursor-pointer shrink-0"
          title={isDashboardMinimized ? "Expand Series Creator Dashboard Window" : "Minimize Series Creator Dashboard Window"}
        >
          {isDashboardMinimized ? (
            <>
              <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Expand</span>
            </>
          ) : (
            <>
              <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Minimize</span>
            </>
          )}
        </button>
      </div>

      {!isDashboardMinimized && (
        <div className="p-3.5 sm:p-4 space-y-3.5 relative z-10">
          {/* Creator Dashboard Header & Series Selector Floating Header Bar */}
          <div className="bg-[#091024]/90 border border-blue-500/30 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2.5 flex-wrap min-w-0">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 text-xs font-black tracking-wider uppercase shadow-sm">
                <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                <span>Series Creator Dashboard</span>
              </span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full border uppercase shadow-sm"
                style={{
                  backgroundColor: `${activeSeries?.accentColor || "#38bdf8"}15`,
                  borderColor: `${activeSeries?.accentColor || "#38bdf8"}40`,
                  color: activeSeries?.accentColor || "#38bdf8",
                }}
              >
                {activeSeries?.playthroughType || "100% Walkthrough"}
              </span>
              {completionPercent >= 100 ? (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Completed</span>
                </span>
              ) : (
                <span className="bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>In Production ({publishedEpisodes}/{totalEpisodes} Ep)</span>
                </span>
              )}
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2 drop-shadow-sm ml-1">
                <span>{activeSeries?.gameTitle || "Gaming Series"}</span>
              </h2>
            </div>

            {/* Series Switcher Dropdown & Actions on Floating Header Bar */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-zinc-400 hidden sm:inline">
                  Series:
                </span>
                <select
                  value={activeSeries?.id}
                  onChange={(e) => onSelectSeries(e.target.value)}
                  className="bg-[#121622] border border-blue-500/40 hover:border-blue-400 focus:border-blue-300 rounded-lg px-2.5 py-1.5 text-xs font-extrabold text-white focus:outline-none transition-all cursor-pointer shadow-md"
                >
                  {[...seriesList]
                    .sort((a, b) => (a?.gameTitle || "").localeCompare(b?.gameTitle || ""))
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s?.gameTitle || "Untitled"} ({s?.episodes?.length || 0} Ep)
                      </option>
                    ))}
                </select>
              </div>

              <button
                onClick={onOpenPlaythroughView}
                className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-lg transition-all shadow-md flex items-center gap-1.5 cursor-pointer ring-1 ring-white/20"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Launch Planner</span>
                <ChevronRight className="w-3.5 h-3.5 text-blue-200" />
              </button>
            </div>
          </div>

          {/* AI Web Scraped & Custom Database Game Synopsis Window */}
          <div className="w-full space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.md"
              className="hidden"
            />

            {uploadFeedback && (
              <div className="bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs font-semibold p-2.5 rounded-xl flex items-center justify-between gap-2 shadow-sm animate-fade-in">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{uploadFeedback}</span>
                </div>
                <button
                  onClick={() => setUploadFeedback(null)}
                  className="text-emerald-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Main Grid: Overall Completion Percentage & Runtime Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
            {/* Left Card: Overall Series Completion Percentage (5 Cols) */}
            <div className="lg:col-span-5 bg-[#0b0e17] border border-white/10 rounded-xl overflow-hidden shadow-md flex flex-col justify-between transition-all">
              {/* Floating Header Bar */}
              <div className="px-3.5 py-2 bg-[#080b12] border-b border-white/10 flex items-center justify-between gap-2">
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <PieChart className="w-3.5 h-3.5 text-blue-400" />
                  <span>Overall Series Completion</span>
                </h3>
                <span className="text-[10px] font-mono font-bold text-blue-300 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded shadow-sm">
                  {publishedEpisodes} / {totalEpisodes} Published
                </span>
              </div>

              {/* Card Body */}
              <div className="p-3.5 space-y-3">
                {/* Circular / Badge Percentage Meter */}
                <div className="flex items-center gap-4 bg-[#070911] p-3 rounded-xl border border-white/5 shadow-inner">
                  <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_6px_rgba(59,130,246,0.3)]" viewBox="0 0 36 36">
                      <path
                        className="text-zinc-800"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-blue-500 transition-all duration-1000 ease-out"
                        strokeDasharray={`${completionPercent}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-xl font-black text-white font-mono drop-shadow-sm">{completionPercent}%</span>
                      <span className="text-[8px] font-bold text-zinc-400 uppercase">Live YT</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-400">Ready Pipeline</span>
                      <span className="font-mono font-bold text-emerald-400">{readyPercent}%</span>
                    </div>
                    <div className="w-full bg-zinc-800/80 rounded-full h-2 overflow-hidden border border-white/5 shadow-inner">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${readyPercent}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-tight">
                      {completionPercent >= 100
                        ? "🏆 All episodes published live on YouTube!"
                        : readyEpisodes > publishedEpisodes
                        ? `🎉 ${readyEpisodes - publishedEpisodes} ep edited & ready to publish!`
                        : "🎬 Record next episode to keep momentum going."}
                    </p>
                  </div>
                </div>

                {/* Runtime Breakdown Specs */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-[#070911] p-2.5 rounded-xl border border-white/5 space-y-0.5">
                    <span className="text-[9px] font-bold uppercase text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-400" />
                      <span>Total Planned</span>
                    </span>
                    <div className="text-base font-black text-white font-mono">~{totalPlannedHours} hrs</div>
                    <div className="text-[9px] text-zinc-500">{totalEpisodes} episodes total</div>
                  </div>

                  <div className="bg-[#070911] p-2.5 rounded-xl border border-white/5 space-y-0.5">
                    <span className="text-[9px] font-bold uppercase text-zinc-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Completed</span>
                    </span>
                    <div className="text-base font-black text-emerald-400 font-mono">~{completedHours} hrs</div>
                    <div className="text-[9px] text-zinc-500">~{remainingHours} hrs remaining</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Episodes by Status Breakdown (7 Cols) */}
            <div className="lg:col-span-7 bg-[#0b0e17] border border-white/10 rounded-xl overflow-hidden shadow-md flex flex-col justify-between transition-all">
              {/* Floating Header Bar */}
              <div className="px-3.5 py-2 bg-[#080b12] border-b border-white/10 flex items-center justify-between gap-2">
                <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Episodes by Production Status</span>
                </h3>
                <span className="text-[10px] text-zinc-400 font-medium">Format: 90-120 Min Videos</span>
              </div>

              {/* Card Body */}
              <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
                {/* Stacked Proportional Bar */}
                <div className="space-y-1">
                  <div className="w-full h-3 bg-zinc-800/90 rounded-full overflow-hidden flex border border-white/5 shadow-inner">
                    {totalEpisodes > 0 && (
                      <>
                        <div
                          style={{ width: `${(statusCounts.published / totalEpisodes) * 100}%` }}
                          className="bg-emerald-500 h-full transition-all"
                          title={`Published: ${statusCounts.published}`}
                        />
                        <div
                          style={{ width: `${(statusCounts.uploaded / totalEpisodes) * 100}%` }}
                          className="bg-blue-500 h-full transition-all"
                          title={`Uploaded: ${statusCounts.uploaded}`}
                        />
                        <div
                          style={{ width: `${(statusCounts.edited / totalEpisodes) * 100}%` }}
                          className="bg-amber-500 h-full transition-all"
                          title={`Edited: ${statusCounts.edited}`}
                        />
                        <div
                          style={{ width: `${(statusCounts.recorded / totalEpisodes) * 100}%` }}
                          className="bg-red-500 h-full transition-all"
                          title={`Recorded: ${statusCounts.recorded}`}
                        />
                        <div
                          style={{ width: `${(statusCounts.not_started / totalEpisodes) * 100}%` }}
                          className="bg-zinc-700 h-full transition-all"
                          title={`Planned: ${statusCounts.not_started}`}
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* 5 Status Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(["not_started", "recorded", "edited", "uploaded", "published"] as EpisodeStatus[]).map((st) => {
                    const conf = STATUS_CONFIG[st];
                    const count = statusCounts[st] || 0;
                    const pct = totalEpisodes > 0 ? Math.round((count / totalEpisodes) * 100) : 0;
                    const IconComp = conf.icon;

                    return (
                      <div
                        key={st}
                        className={`p-2.5 rounded-lg border ${conf.bgColor} ${conf.borderColor} flex flex-col justify-between space-y-1.5 shadow-sm transition-all duration-200`}
                      >
                        <div className="flex items-center justify-between">
                          <IconComp className={`w-3.5 h-3.5 ${conf.color}`} />
                          <span className={`text-xs font-mono font-black ${conf.color}`}>{count}</span>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-zinc-200 truncate">{conf.label.split("/")[0]}</div>
                          <div className="text-[9px] text-zinc-400">{pct}% of series</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Production Pacing Summary Banner */}
                <div className="bg-[#070911] p-2.5 rounded-xl border border-white/5 flex items-center gap-2 text-xs">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-[11px] text-zinc-300 truncate">
                    Pacing Guide: Target ~{avgEpisodeMins} mins/episode for optimal watch time.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Recording & Editing Tasks Queue Window */}
          <div className="bg-[#0b0e17] border border-white/10 rounded-xl overflow-hidden shadow-md">
            {/* Floating Header Bar */}
            <div className="px-3.5 py-2 bg-[#080b12] border-b border-white/10 flex items-center justify-between gap-2">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5 text-blue-400" />
                <span>Production Pipeline Tasks Queue</span>
              </h3>
              <span className="text-[10px] text-zinc-400">Next actionable episodes in your workflow</span>
            </div>

            {/* Pipeline Cards Body */}
            <div className="p-3.5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Card 1: Up Next to Record */}
                <div className="bg-[#070911] border border-red-500/30 border-t-red-400/50 rounded-xl p-3 flex flex-col justify-between space-y-3 relative overflow-hidden shadow-sm hover:border-red-500/50 transition-all">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-[9px] font-extrabold uppercase shadow-sm">
                        <Mic className="w-3 h-3 text-red-400" />
                        <span>Up Next to Record</span>
                      </span>
                      {nextToRecord && (
                        <span className="text-[11px] font-mono font-bold text-zinc-400">
                          Ep {nextToRecord.partNumber}
                        </span>
                      )}
                    </div>

                    {nextToRecord ? (
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-white line-clamp-1">{nextToRecord.title}</h4>
                        <p className="text-[11px] text-zinc-400 line-clamp-1">
                          <strong className="text-zinc-300">Route:</strong> {nextToRecord.startPoint} ➔ {nextToRecord.endPoint}
                        </p>
                        {nextToRecord.keyEvents && nextToRecord.keyEvents.length > 0 && (
                          <div className="text-[10px] text-zinc-400 bg-black/40 p-1.5 rounded-lg border border-white/5 line-clamp-2">
                            <strong className="text-red-300">Key Events:</strong> {nextToRecord.keyEvents.join(" • ")}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-4 text-center text-zinc-500 text-xs font-medium space-y-1">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto opacity-80" />
                        <p>All episodes recorded!</p>
                      </div>
                    )}
                  </div>

                  {nextToRecord && onUpdateEpisodeStatus && (
                    <button
                      onClick={() => onUpdateEpisodeStatus(nextToRecord.id, "recorded")}
                      className="w-full py-1.5 bg-gradient-to-r from-red-600/30 to-rose-600/30 hover:from-red-600/40 hover:to-rose-600/40 text-red-200 border border-red-500/40 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Ep {nextToRecord.partNumber} Recorded</span>
                    </button>
                  )}
                </div>

                {/* Card 2: Up Next to Edit */}
                <div className="bg-[#070911] border border-amber-500/30 border-t-amber-400/50 rounded-xl p-3 flex flex-col justify-between space-y-3 relative overflow-hidden shadow-sm hover:border-amber-500/50 transition-all">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[9px] font-extrabold uppercase shadow-sm">
                        <Scissors className="w-3 h-3 text-amber-400" />
                        <span>Up Next to Edit</span>
                      </span>
                      {nextToEdit && (
                        <span className="text-[11px] font-mono font-bold text-zinc-400">
                          Ep {nextToEdit.partNumber}
                        </span>
                      )}
                    </div>

                    {nextToEdit ? (
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-white line-clamp-1">{nextToEdit.title}</h4>
                        <p className="text-[11px] text-zinc-400 line-clamp-1">
                          <strong className="text-zinc-300">Footage:</strong> ~{nextToEdit.estDurationMinutes || 90} Min
                        </p>
                        {nextToEdit.keyEvents && nextToEdit.keyEvents.length > 0 && (
                          <div className="text-[10px] text-zinc-400 bg-black/40 p-1.5 rounded-lg border border-white/5 line-clamp-2">
                            <strong className="text-amber-300">Highlights:</strong> {nextToEdit.keyEvents.join(" • ")}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-4 text-center text-zinc-500 text-xs font-medium space-y-1">
                        <CheckCircle2 className="w-6 h-6 text-zinc-600 mx-auto" />
                        <p>No recorded footage pending edit</p>
                      </div>
                    )}
                  </div>

                  {nextToEdit && onUpdateEpisodeStatus && (
                    <button
                      onClick={() => onUpdateEpisodeStatus(nextToEdit.id, "edited")}
                      className="w-full py-1.5 bg-gradient-to-r from-amber-600/30 to-orange-600/30 hover:from-amber-600/40 hover:to-orange-600/40 text-amber-200 border border-amber-500/40 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Ep {nextToEdit.partNumber} Edited</span>
                    </button>
                  )}
                </div>

                {/* Card 3: Up Next to Publish */}
                <div className="bg-[#070911] border border-emerald-500/30 border-t-emerald-400/50 rounded-xl p-3 flex flex-col justify-between space-y-3 relative overflow-hidden shadow-sm hover:border-emerald-500/50 transition-all">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[9px] font-extrabold uppercase shadow-sm">
                        <Youtube className="w-3 h-3 text-emerald-400" />
                        <span>Up Next to Publish</span>
                      </span>
                      {nextToPublish && (
                        <span className="text-[11px] font-mono font-bold text-zinc-400">
                          Ep {nextToPublish.partNumber}
                        </span>
                      )}
                    </div>

                    {nextToPublish ? (
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-white line-clamp-1">{nextToPublish.title}</h4>
                        <p className="text-[11px] text-zinc-400 line-clamp-1">
                          <strong className="text-zinc-300">Status:</strong> {nextToPublish.status === "uploaded" ? "Uploaded (Unlisted)" : "Edited & Mastered"}
                        </p>
                        <div className="text-[10px] text-zinc-400 bg-black/40 p-1.5 rounded-lg border border-white/5 line-clamp-2">
                          <strong className="text-emerald-300">Title:</strong> {nextToPublish.title}
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 text-center text-zinc-500 text-xs font-medium space-y-1">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto opacity-80" />
                        <p>No edited videos waiting for publish</p>
                      </div>
                    )}
                  </div>

                  {nextToPublish && onUpdateEpisodeStatus && (
                    <button
                      onClick={() => onUpdateEpisodeStatus(nextToPublish.id, "published")}
                      className="w-full py-1.5 bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/40 hover:to-teal-600/40 text-emerald-200 border border-emerald-500/40 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Youtube className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Publish Ep {nextToPublish.partNumber} Live</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Missable Quests & Uncollected Loot High-Alert Radar Window */}
          <div className="bg-[#0b0e17] border border-red-500/30 rounded-xl overflow-hidden shadow-md">
            {/* Single Floating Header Bar with Action Buttons */}
            <div className="px-3.5 py-2 bg-[#120e1d] border-b border-red-500/30 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 min-w-0">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 animate-pulse" />
                <h3 className="text-xs font-black text-white flex items-center gap-1.5 truncate">
                  <span>100% Missable Content & Loot Guard</span>
                  {immediateMissablesCount > 0 && (
                    <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider shrink-0">
                      {immediateMissablesCount} in Up Next Ep!
                    </span>
                  )}
                </h3>
              </div>

              {/* Action Buttons Pinned to Floating Header Bar */}
              <div className="flex items-center gap-1.5 shrink-0">
                {onOpenQuestBranchTracker && (
                  <button
                    onClick={onOpenQuestBranchTracker}
                    className="px-2.5 py-1 bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3 h-3 text-purple-400" />
                    <span>Side Quest Tracker</span>
                  </button>
                )}
                {onOpenBossLootCatalog && (
                  <button
                    onClick={onOpenBossLootCatalog}
                    className="px-2.5 py-1 bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Swords className="w-3 h-3 text-red-400" />
                    <span>Boss & Loot Catalog</span>
                  </button>
                )}
              </div>
            </div>

            {/* Missables Content Grid */}
            <div className="p-3.5 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Column 1: Missable Side Quests */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-extrabold text-purple-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Missable Side Quests ({missableQuests.length})</span>
                    <span className="text-[9px] text-zinc-500 font-normal">Check off as completed</span>
                  </h4>

                  {missableQuests.length === 0 ? (
                    <div className="bg-[#070911] p-3 rounded-lg border border-white/5 text-center text-xs text-zinc-400">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                      No missable quests remaining for this series!
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                      {missableQuests.map((q) => (
                        <div
                          key={q.id}
                          className="bg-[#070911] hover:bg-[#0f1220] border border-purple-500/20 rounded-lg p-2.5 flex items-start justify-between gap-2 transition-all shadow-sm"
                        >
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 px-1 py-0.2 rounded border border-purple-500/30">
                                Part {q.episodePart || 1}
                              </span>
                              <span className="text-[9px] font-bold text-zinc-400 truncate">{q.location}</span>
                            </div>
                            <h5 className="text-xs font-extrabold text-white truncate">{q.title}</h5>
                            <p className="text-[10px] text-zinc-400 leading-tight truncate">
                              <strong className="text-amber-400">Reward:</strong> {q.keyRewards}
                            </p>
                          </div>

                          <button
                            onClick={() => toggleQuestCompleted(q.id)}
                            className="p-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 rounded-md text-xs transition-all shrink-0 cursor-pointer shadow-sm"
                            title="Mark Quest Completed"
                          >
                            <Check className="w-3.5 h-3.5 text-purple-300" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Column 2: Uncollected Missable Loot & Espers */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-extrabold text-red-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Uncollected Missable Items ({uncollectedMissableLoot.length})</span>
                    <span className="text-[9px] text-zinc-500 font-normal">Check off as found</span>
                  </h4>

                  {uncollectedMissableLoot.length === 0 ? (
                    <div className="bg-[#070911] p-3 rounded-lg border border-white/5 text-center text-xs text-zinc-400">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                      All missable loot & relics collected!
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                      {uncollectedMissableLoot.map((item) => (
                        <div
                          key={item.id}
                          className="bg-[#070911] hover:bg-[#0f1220] border border-red-500/20 rounded-lg p-2.5 flex items-start justify-between gap-2 transition-all shadow-sm"
                        >
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[9px] font-mono font-bold bg-red-500/20 text-red-300 px-1 py-0.2 rounded border border-red-500/30">
                                Part {item.episodePart}
                              </span>
                              <span className="text-[9px] font-bold text-amber-400">{item.category}</span>
                            </div>
                            <h5 className="text-xs font-extrabold text-white truncate">{item.name}</h5>
                            <p className="text-[10px] text-zinc-400 leading-tight line-clamp-1">
                              {item.description}
                            </p>
                          </div>

                          <button
                            onClick={() => toggleLootCollected(item.id)}
                            className="p-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 rounded-md text-xs transition-all shrink-0 cursor-pointer shadow-sm"
                            title="Mark Loot Collected"
                          >
                            <Check className="w-3.5 h-3.5 text-red-300" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
