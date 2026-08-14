import React, { useState, useEffect, useRef } from "react";
import { Play, Sparkles, Download, CheckCircle, Clock, BookOpen, Layers, Image, Type, Plus, Gamepad2, Trash2, AlertTriangle, Swords, UserCheck, Target, Cloud, FileJson, Upload, RefreshCw, ShieldCheck, HardDrive, Check, X, ChevronDown, ChevronUp, GitBranch, Zap, TrendingUp, Mic, BarChart3, Wand2, Tv, Key, Smartphone, Palette, Printer, Home, LayoutGrid, Radio, Youtube, Sun, Moon, FolderKanban, Film, CheckCircle2, Settings, Trophy, Award, Database, Edit2 } from "lucide-react";
import { Episode, PLAYTHROUGH_TYPES, PlaythroughSeries } from "../types";
import { MilestoneBellDropdown, MilestoneRecord } from "./MilestoneNotification";
import { safeFetchJson } from "../utils/apiUtils";
import { AppThemeId, THEME_CONFIGS } from "../utils/themeUtils";
import { StudioTitleBanner } from "./StudioTitleBanner";
import { StudioBannerModal, StudioBannerConfig, DEFAULT_STUDIO_BANNER_CONFIG } from "./StudioBannerModal";
import { AchievementModal } from "./AchievementModal";
import { calculateGamerscore, loadAchievements, triggerAchievement } from "../utils/achievementManager";
import { SynopsisDbModal } from "./SynopsisDbModal";
import defaultStudioLogo from "../assets/playthrough_studio_logo.svg";

interface HeaderProps {
  seriesList: PlaythroughSeries[];
  activeSeriesId: string;
  onSelectSeries: (id: string) => void;
  onOpenNewSeriesModal: () => void;
  onOpenAddEpisodeModal?: () => void;
  onDeleteSeries: (id: string) => void;
  onUpdatePlaythroughType?: (seriesId: string, newType: string) => void;
  onImportSeriesList?: (imported: PlaythroughSeries[]) => void;
  episodes: Episode[];
  targetLength: number; // 60, 90, 120
  setTargetLength: (length: number) => void;
  onOpenGuide: () => void;
  onOpenExport: () => void;
  onOpenThumbnailStudio: () => void;
  onOpenBatchThumbnailExporter?: () => void;
  onOpenBossLootCatalog?: () => void;
  onOpenProtagonistDB?: () => void;
  onOpenQuestBranchTracker?: () => void;
  onOpenBossWeaknessCards?: () => void;
  onUpdateSeriesSynopsis?: (seriesId: string, synopsis: string, source?: string) => void;

  // View mode navigation
  currentView?: "landing" | "playthrough";
  onToggleView?: (view: "landing" | "playthrough") => void;

  // Theme management props
  currentTheme?: AppThemeId;
  onSelectTheme?: (themeId: AppThemeId) => void;
  onOpenThemeSwitcher?: () => void;

  // 10 Studio Tools Upgrades Callbacks
  onOpenCtrPredictor?: () => void;
  onOpenChapterManager?: () => void;
  onOpenSoundcheck?: () => void;
  onOpenAiPromptCrafter?: () => void;
  onOpenEndScreenPlanner?: () => void;
  onOpenKeyItemsTracker?: () => void;
  onOpenShortsClipper?: () => void;
  onOpenThumbnailPresetStudio?: () => void;
  onOpenBatchEpisodeEditor?: () => void;
  onOpenPrintCheatSheet?: () => void;
  onOpenRecordingTimer?: () => void;
  onOpenMirillisActionModal?: () => void;
  onOpenYouTubeStudio?: () => void;
  onOpenBossEncounterPlanner?: () => void;
  onOpenCompletionDashboard?: () => void;
  // Milestone Notifications Props
  milestoneHistory?: MilestoneRecord[];
  onSelectMilestone?: (m: MilestoneRecord) => void;
  onClearMilestoneHistory?: () => void;
  // Game Title Logo Props
  onOpenGameLogoModal?: () => void;
  onUpdateSeriesLogo?: (seriesId: string, logoUrl: string | undefined, useTitleLogo: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  seriesList,
  activeSeriesId,
  onSelectSeries,
  onOpenNewSeriesModal,
  onOpenAddEpisodeModal,
  onDeleteSeries,
  onUpdatePlaythroughType,
  onImportSeriesList,
  episodes,
  targetLength,
  setTargetLength,
  onOpenGuide,
  onOpenExport,
  onOpenThumbnailStudio,
  onOpenBatchThumbnailExporter,
  onOpenBossLootCatalog,
  onOpenProtagonistDB,
  onOpenQuestBranchTracker,
  onOpenBossWeaknessCards,
  currentView = "landing",
  onToggleView,
  currentTheme = "midnight",
  onSelectTheme,
  onOpenThemeSwitcher,
  milestoneHistory = [],
  onSelectMilestone,
  onClearMilestoneHistory,
  onOpenCtrPredictor,
  onOpenChapterManager,
  onOpenSoundcheck,
  onOpenAiPromptCrafter,
  onOpenEndScreenPlanner,
  onOpenKeyItemsTracker,
  onOpenShortsClipper,
  onOpenThumbnailPresetStudio,
  onOpenBatchEpisodeEditor,
  onOpenPrintCheatSheet,
  onOpenRecordingTimer,
  onOpenMirillisActionModal,
  onOpenYouTubeStudio,
  onOpenBossEncounterPlanner,
  onOpenCompletionDashboard,
  onOpenGameLogoModal,
  onUpdateSeriesLogo,
  onUpdateSeriesSynopsis,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showBackupSyncModal, setShowBackupSyncModal] = useState(false);
  const [showDataExportMenu, setShowDataExportMenu] = useState(false);
  const [showStudioSuiteMenu, setShowStudioSuiteMenu] = useState(false);
  const [studioSuiteTab, setStudioSuiteTab] = useState<"all" | "production" | "visuals" | "gamedb" | "analytics">("all");

  // Synopsis State & Handlers
  const [showSynopsisDbModal, setShowSynopsisDbModal] = useState(false);
  const [isEditingSynopsis, setIsEditingSynopsis] = useState(false);
  const [editableSynopsis, setEditableSynopsis] = useState("");
  const [isScrapingSynopsis, setIsScrapingSynopsis] = useState(false);

  const sortedSeriesList = [...seriesList].sort((a, b) => a.gameTitle.localeCompare(b.gameTitle));
  const activeSeries = sortedSeriesList.find((s) => s.id === activeSeriesId) || sortedSeriesList[0] || seriesList[0];

  const handleScrapeSynopsis = async () => {
    if (!activeSeries?.gameTitle) return;
    setIsScrapingSynopsis(true);
    try {
      const res = await fetch("/api/gemini/scrape-synopsis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameTitle: activeSeries.gameTitle,
          genre: activeSeries.genre,
          playthroughType: activeSeries.playthroughType,
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

  const [isSlimHeader, setIsSlimHeader] = useState<boolean>(() => {
    return localStorage.getItem("youtube_studio_slim_header") === "true";
  });

  const toggleSlimHeader = () => {
    setIsSlimHeader((prev) => {
      const next = !prev;
      localStorage.setItem("youtube_studio_slim_header", String(next));
      return next;
    });
  };

  const exportMenuRef = useRef<HTMLDivElement>(null);
  const studioSuiteMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowDataExportMenu(false);
      }
      if (studioSuiteMenuRef.current && !studioSuiteMenuRef.current.contains(event.target as Node)) {
        setShowStudioSuiteMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync & Cloud Backup States
  const [syncState, setSyncState] = useState<"synced" | "out_of_sync" | "syncing" | "no_cloud">("synced");
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [backupMsg, setBackupMsg] = useState<string | null>(null);

  const formatSeriesDate = (dateStr?: string) => {
    if (!dateStr) return "Added Aug 2026";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return `Added ${dateStr}`;
      return `Added ${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    } catch {
      return `Added ${dateStr}`;
    }
  };

  const totalEpisodes = episodes.length;
  const publishedCount = episodes.filter((e) => e.status === "published").length;
  const readyCount = episodes.filter((e) => e.status === "uploaded" || e.status === "edited").length;

  const totalEstMinutes = episodes.reduce((acc, curr) => acc + curr.estDurationMinutes, 0);
  const totalHours = (totalEstMinutes / 60).toFixed(1);

  // Check sync status against server backup
  useEffect(() => {
    let isMounted = true;
    const checkSyncStatus = async () => {
      try {
        const data = await safeFetchJson("/api/backup");
        if (!isMounted) return;
        if (data.backup) {
          setLastSyncTime(data.updatedAt ? new Date(data.updatedAt).toLocaleTimeString() : null);
          const currentStr = JSON.stringify(seriesList);
          const backupStr = JSON.stringify(data.backup);
          if (currentStr === backupStr) {
            setSyncState("synced");
          } else {
            setSyncState("out_of_sync");
          }
        } else {
          setSyncState("no_cloud");
        }
      } catch (err) {
        if (isMounted) setSyncState("synced"); // Default to local synced
      }
    };
    checkSyncStatus();
    return () => { isMounted = false; };
  }, [seriesList]);

  // Cloud backup action
  const handleCloudBackup = async () => {
    setSyncState("syncing");
    setBackupMsg(null);
    try {
      const data = await safeFetchJson("/api/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seriesList }),
      });
      if (data.success) {
        setSyncState("synced");
        const timeStr = new Date(data.updatedAt).toLocaleTimeString();
        setLastSyncTime(timeStr);
        setBackupMsg(`Cloud backup created successfully at ${timeStr}!`);
      } else {
        throw new Error(data.error || "Backup failed");
      }
    } catch (err: any) {
      setSyncState("out_of_sync");
      setBackupMsg(`Backup note: ${err.message || "Failed to reach server"}. Note that Local Storage automatically saves all series state.`);
    }
  };

  // Cloud restore action
  const handleCloudRestore = async () => {
    setSyncState("syncing");
    setBackupMsg(null);
    try {
      const data = await safeFetchJson("/api/backup");
      if (data.backup && Array.isArray(data.backup) && data.backup.length > 0) {
        onImportSeriesList?.(data.backup);
        setSyncState("synced");
        const timeStr = data.updatedAt ? new Date(data.updatedAt).toLocaleTimeString() : "Just now";
        setLastSyncTime(timeStr);
        setBackupMsg(`Restored ${data.backup.length} playthrough series from Cloud Backup!`);
      } else {
        setBackupMsg("No cloud backup found on server.");
        setSyncState("no_cloud");
      }
    } catch (err: any) {
      setBackupMsg(`Restore error: ${err.message || "Failed to reach server"}`);
    }
  };

  // Download JSON file for safe-keeping
  const handleDownloadJsonBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(seriesList, null, 2));
    const downloadAnchor = document.createElement("a");
    const timestamp = new Date().toISOString().slice(0, 10);
    const fileName = activeSeries
      ? `${activeSeries.gameTitle.replace(/[^a-zA-Z0-9]/g, "_")}_Series_Backup_${timestamp}.json`
      : `YouTube_Playthrough_Backup_${timestamp}.json`;
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setBackupMsg(`Exported JSON backup file: ${fileName}`);
  };

  // Import JSON file from local disk
  const handleImportJsonFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].gameTitle) {
          onImportSeriesList?.(parsed);
          setBackupMsg(`Successfully imported ${parsed.length} playthrough series!`);
        } else if (parsed && parsed.gameTitle && parsed.episodes) {
          // Single series object imported
          onImportSeriesList?.([parsed, ...seriesList.filter((s) => s.id !== parsed.id)]);
          setBackupMsg(`Successfully imported series "${parsed.gameTitle}"!`);
        } else {
          setBackupMsg("Error: Selected JSON file is not a valid playthrough backup format.");
        }
      } catch (err) {
        setBackupMsg("Error: Invalid JSON file structure.");
      }
    };
    reader.readAsText(file);
    // Reset file input
    event.target.value = "";
  };

  const handleDelete = () => {
    if (activeSeries) {
      onDeleteSeries(activeSeries.id);
      setShowConfirmDelete(false);
    }
  };

  // Studio Front & Center Title Banner State
  const [bannerConfig, setBannerConfig] = useState<StudioBannerConfig>(() => {
    const saved = localStorage.getItem("youtube_studio_banner_config");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return DEFAULT_STUDIO_BANNER_CONFIG;
  });

  const [showBannerModal, setShowBannerModal] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [gamerscore, setGamerscore] = useState(() => calculateGamerscore(loadAchievements()));

  useEffect(() => {
    const handleUnlocked = () => {
      setGamerscore(calculateGamerscore(loadAchievements()));
    };
    window.addEventListener("achievement_unlocked", handleUnlocked);
    return () => window.removeEventListener("achievement_unlocked", handleUnlocked);
  }, []);

  const handleSaveBannerConfig = (newConfig: StudioBannerConfig) => {
    setBannerConfig(newConfig);
    localStorage.setItem("youtube_studio_banner_config", JSON.stringify(newConfig));
    triggerAchievement("brand_architect");
  };

  // Stats for Studio Title Banner
  const totalSeriesCount = seriesList.length;
  const totalEpisodesCount = seriesList.reduce((acc, s) => acc + (s.episodes?.length || 0), 0);
  const totalCompletedEpisodes = seriesList.reduce(
    (acc, s) =>
      acc +
      (s.episodes?.filter((e) => e.status === "published" || e.status === "edited" || e.status === "uploaded")
        .length || 0),
    0
  );
  const totalPlannedHours = (
    seriesList.reduce(
      (acc, s) => acc + (s.episodes?.reduce((epAcc, ep) => epAcc + (ep.estDurationMinutes || 90), 0) || 0),
      0
    ) / 60
  ).toFixed(1);

  if (isSlimHeader) {
    const publishedPercent = totalEpisodes > 0 ? Math.round((publishedCount / totalEpisodes) * 100) : 0;
    return (
      <header className="bg-[#121212] border-b border-white/10 text-zinc-100 py-2 px-3 sm:px-5 lg:px-6 sticky top-0 z-40 backdrop-blur-xl bg-opacity-95 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Brand + Active Series Select + Format */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="flex items-center gap-2 shrink-0">
              {activeSeries?.coverImage ? (
                <img
                  src={activeSeries.coverImage}
                  alt={activeSeries.gameTitle}
                  className="w-8 h-8 rounded-lg object-cover border border-cyan-400/60 shadow-sm"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/50 flex items-center justify-center text-cyan-300 font-black text-xs">
                  <Gamepad2 className="w-4 h-4 text-cyan-300" />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 min-w-0 flex-1">
              <select
                value={activeSeriesId}
                onChange={(e) => onSelectSeries(e.target.value)}
                className="bg-[#090d16] border border-blue-500/40 hover:border-cyan-400 focus:border-cyan-300 rounded-lg px-2.5 py-1 text-xs font-extrabold text-white focus:outline-none max-w-[180px] sm:max-w-xs md:max-w-md truncate cursor-pointer shadow-inner"
              >
                {sortedSeriesList.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#0f172a] text-white font-semibold">
                    {s.gameTitle} ({s.episodes.length} Ep)
                  </option>
                ))}
              </select>

              {/* Quick Format selector badge */}
              {activeSeries && (
                <div className="hidden md:inline-flex items-center gap-1 text-[10px] font-bold text-blue-200 bg-blue-950/80 border border-blue-500/30 px-2 py-0.5 rounded-md shrink-0">
                  <Target className="w-3 h-3 text-blue-400" />
                  <select
                    value={activeSeries.playthroughType || "100% Walkthrough"}
                    onChange={(e) => onUpdatePlaythroughType?.(activeSeries.id, e.target.value)}
                    className="bg-transparent text-blue-200 font-extrabold focus:outline-none cursor-pointer border-0 p-0 hover:text-white"
                  >
                    {PLAYTHROUGH_TYPES.map((t) => (
                      <option key={t} value={t} className="bg-[#18181b] text-zinc-100 font-normal">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Center: Live Progress Bar */}
          <div className="hidden lg:flex items-center gap-3 bg-[#080d1a] px-3 py-1 rounded-xl border border-white/10 shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300">
              <Film className="w-3.5 h-3.5 text-purple-400" />
              <span>{publishedCount}/{totalEpisodes} Ep ({publishedPercent}%)</span>
            </div>
            <div className="w-24 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${publishedPercent}%` }}
              />
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-cyan-300">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>~{totalHours}h</span>
            </div>
          </div>

          {/* Right: Add Episode + Trophy + Expand Header */}
          <div className="flex items-center gap-1.5 shrink-0">
            {onOpenAddEpisodeModal && (
              <button
                onClick={onOpenAddEpisodeModal}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add Episode</span>
              </button>
            )}

            {/* Expand Header Button */}
            <button
              onClick={toggleSlimHeader}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-200 border border-cyan-500/40 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm shadow-cyan-950/50"
              title="Expand to Full Header Mode"
            >
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[11px] font-bold">Full Header</span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-[#121212] border-b border-white/10 text-zinc-100 py-2.5 px-3 sm:px-5 lg:px-6">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* View Mode & Hub Navigation Bar with Inline Center Studio Logo */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 border-b border-white/10 pb-2.5">
          {/* Left: Studio Navigation Buttons */}
          <div className="flex items-center gap-1 bg-[#09090b] p-1 rounded-xl border border-white/10 shrink-0">
            <button
              onClick={() => onToggleView?.("landing")}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === "landing"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Studio Landing Hub</span>
            </button>
            <button
              onClick={() => onToggleView?.("playthrough")}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === "playthrough"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Active Playthrough Planner</span>
            </button>
          </div>

          {/* Center: Front & Center Studio Logo & Arced Title (Fluidly Responsive) */}
          <div
            className="flex-1 min-w-0 flex flex-col items-center justify-center relative group cursor-pointer my-1 md:my-0 transition-all duration-300 hover:scale-[1.02]"
            onClick={() => setShowBannerModal(true)}
            title="Customize Studio Logo & Banner"
          >
            {/* Arced Studio Title Above Crest - Raised with increased font size and zero overlap */}
            <div className="w-full flex justify-center -mb-2 sm:-mb-3.5 md:-mb-5 lg:-mb-6 xl:-mb-7 z-20 pointer-events-none transition-all duration-300 overflow-visible">
              <svg
                viewBox="0 0 1200 110"
                className="w-full max-w-[320px] min-[400px]:max-w-[400px] sm:max-w-[540px] md:max-w-[680px] lg:max-w-[820px] xl:max-w-[960px] 2xl:max-w-[1080px] h-auto overflow-visible transition-all duration-300"
              >
                <defs>
                  <linearGradient id="headerArcGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="45%" stopColor="#f1f5f9" />
                    <stop offset="100%" stopColor="#94a3b8" />
                  </linearGradient>
                  <filter id="headerTextGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#000000" floodOpacity="0.95" />
                    <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#38bdf8" floodOpacity="0.75" />
                  </filter>
                  <path id="bannerArcPath" d="M 40 68 Q 600 12 1160 68" fill="none" />
                </defs>
                <text fontSize="64" fontWeight="900" letterSpacing="8" fill="url(#headerArcGrad)" stroke="#020617" strokeWidth="3" filter="url(#headerTextGlow)">
                  <textPath href="#bannerArcPath" startOffset="50%" textAnchor="middle">
                    {bannerConfig.studioName || "PLAYTHROUGH STUDIO PRO"}
                  </textPath>
                </text>
              </svg>
            </div>

            {/* Shield Logo Frame - Clean borderless layout */}
            <div className="relative py-1 px-3 sm:py-1.5 sm:px-6 md:py-2 md:px-8 lg:py-2.5 lg:px-10 bg-[#080d1a]/60 rounded-xl sm:rounded-2xl border-0 shadow-lg shadow-cyan-950/40 flex items-center justify-center backdrop-blur-md transition-all duration-300">
              <img
                src={bannerConfig.logoUrl && bannerConfig.logoUrl.trim().length > 0 ? bannerConfig.logoUrl : defaultStudioLogo}
                alt={bannerConfig.studioName || "Playthrough Studio"}
                className="h-10 min-[400px]:h-12 sm:h-16 md:h-20 lg:h-24 xl:h-28 2xl:h-32 w-auto object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] transition-all duration-300"
              />
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 absolute top-1.5 right-1.5 sm:top-2 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Right: Points, Milestones, Slim Header Toggle & Engine Status */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Slim Header Mode Toggle */}
            <button
              onClick={toggleSlimHeader}
              className="flex items-center gap-1 bg-[#09090b] hover:bg-cyan-950/60 text-cyan-300 px-2.5 sm:px-3 py-1.5 rounded-xl border border-cyan-500/40 hover:border-cyan-400 transition-all cursor-pointer font-bold text-xs shadow-sm"
              title="Switch to Slim Header Mode (De-clutter top area)"
            >
              <ChevronUp className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Slim Header</span>
            </button>

            {/* Points Trophy Badge Button */}
            <button
              onClick={() => setShowAchievementModal(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 hover:from-amber-900 hover:to-slate-800 text-amber-300 px-2.5 sm:px-3 py-1.5 rounded-xl border border-amber-500/50 shadow-md shadow-amber-950/50 transition-all hover:scale-105 cursor-pointer font-bold text-xs"
              title="Open Studio Points & Trophies Showcase"
            >
              <Trophy className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="font-black text-amber-300">{gamerscore.unlockedScore.toLocaleString()} PTS</span>
              <span className="hidden sm:inline-block bg-amber-500/20 text-amber-200 px-1.5 py-0.5 rounded text-[10px] font-extrabold border border-amber-400/30">
                {gamerscore.unlockedCount}/{gamerscore.totalCount}
              </span>
            </button>

            <MilestoneBellDropdown
              milestoneHistory={milestoneHistory}
              activeSeries={activeSeries}
              onSelectMilestone={(m) => onSelectMilestone?.(m)}
              onClearHistory={() => onClearMilestoneHistory?.()}
            />

            <div className="text-[11px] font-bold text-zinc-400 hidden lg:flex items-center gap-2 bg-[#09090b] px-3 py-1.5 rounded-xl border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>YouTube Studio Engine Online</span>
            </div>
          </div>
        </div>

        {/* Global Production Metrics Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-0.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#080c18]/90 border border-white/10 rounded-lg shadow-sm backdrop-blur-md">
            <FolderKanban className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="text-xs font-black text-white">{totalSeriesCount}</span>
            <span className="text-[10px] font-bold text-zinc-400 uppercase">Series</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#080c18]/90 border border-white/10 rounded-lg shadow-sm backdrop-blur-md">
            <Film className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="text-xs font-black text-white">{totalEpisodesCount}</span>
            <span className="text-[10px] font-bold text-zinc-400 uppercase">Episodes</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#080c18]/90 border border-white/10 rounded-lg shadow-sm backdrop-blur-md">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-xs font-black text-white">{totalCompletedEpisodes}</span>
            <span className="text-[10px] font-bold text-zinc-400 uppercase">Published</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#080c18]/90 border border-white/10 rounded-lg shadow-sm backdrop-blur-md">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-xs font-black text-white">{totalPlannedHours}h</span>
            <span className="text-[10px] font-bold text-zinc-400 uppercase">Planned</span>
          </div>
        </div>

        {/* Streamlined Playthrough Series Banner & Hero Metrics Ticker */}
        <div className="bg-gradient-to-r from-blue-950/90 via-[#0d1326]/90 to-indigo-950/90 p-3 sm:p-4 rounded-2xl border border-blue-500/40 shadow-xl shadow-blue-950/40 space-y-3 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-[280px]">
              {activeSeries?.coverImage ? (
                <img
                  src={activeSeries.coverImage}
                  alt={activeSeries.gameTitle}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border-2 border-cyan-400/80 shadow-md shadow-cyan-950/50 shrink-0 hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-500/20 border border-blue-400/50 flex items-center justify-center text-blue-300 shadow-md shadow-blue-500/30 shrink-0">
                  <Gamepad2 className="w-6 h-6 text-cyan-300 animate-pulse" />
                </div>
              )}

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-400/40 text-[9px] font-black uppercase text-cyan-300 tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>ACTIVE SERIES PLANNER</span>
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <select
                      value={activeSeriesId}
                      onChange={(e) => onSelectSeries(e.target.value)}
                      className="bg-[#090d16] border border-blue-400/60 hover:border-cyan-400 focus:border-cyan-300 focus:ring-1 focus:ring-cyan-400/30 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-extrabold text-white focus:outline-none max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl truncate transition-all cursor-pointer shadow-inner shadow-black/60"
                    >
                      {sortedSeriesList.map((s) => (
                        <option key={s.id} value={s.id} className="bg-[#0f172a] text-white font-semibold py-1 text-xs sm:text-sm">
                          {s.gameTitle} ({s.episodes.length} Ep • {s.playthroughType || "100% Walkthrough"} • {formatSeriesDate(s.createdAt)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onOpenNewSeriesModal}
                title="Generate full longform playthrough series in 90-120 min format"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border border-cyan-400/50 rounded-xl text-xs font-black transition-all shadow-md shadow-blue-500/30 hover:scale-[1.02] cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-200 fill-cyan-200/30 animate-pulse" />
                <span>Generate Playthrough (90-120 Min)</span>
              </button>

              <button
                onClick={() => setShowConfirmDelete(true)}
                title="Delete Active Playthrough Series"
                className="inline-flex items-center gap-1 px-2.5 py-2 bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/40 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm shadow-red-950/20"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          </div>

          {/* STREAMLINED HERO METRICS TICKER BAR */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 overflow-x-auto text-[11px] font-bold text-zinc-300">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg text-blue-200 shadow-sm shrink-0">
                <Layers className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Episodes: <strong className="text-white font-extrabold">{totalEpisodes}</strong></span>
              </div>

              <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg text-amber-200 shadow-sm shrink-0">
                <Radio className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Recorded: <strong className="text-white font-extrabold">{episodes.filter(e => e.status === "recorded").length}</strong></span>
              </div>

              <div className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-lg text-purple-200 shadow-sm shrink-0">
                <CheckCircle className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Ready/Edited: <strong className="text-white font-extrabold">{readyCount}</strong></span>
              </div>

              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-emerald-200 shadow-sm shrink-0">
                <Youtube className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Published: <strong className="text-white font-extrabold">{publishedCount}</strong></span>
              </div>

              <div className="flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-lg text-cyan-200 shadow-sm shrink-0">
                <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Total Series Runtime: <strong className="text-white font-extrabold">~{totalHours} hrs</strong></span>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-1 text-[10px] text-blue-300/80 font-semibold shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Production Metrics</span>
            </div>
          </div>
        </div>

        {/* Main Header Row with Iconography Navigation & Studio Suite */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
          {/* Active Series Branding with Prominent Large Game Title */}
          <div className="flex items-center gap-3">
            {activeSeries?.coverImage ? (
              <img
                src={activeSeries.coverImage}
                alt={activeSeries.gameTitle}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover border-2 border-amber-400/80 shadow-xl shadow-amber-950/50 shrink-0 hover:scale-105 transition-transform"
              />
            ) : (
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl p-0.5 shadow-lg shadow-blue-950/40 shrink-0"
                style={{ background: `linear-gradient(135deg, ${activeSeries?.accentColor || "#38bdf8"}, #6366f1)` }}
              >
                <div className="w-full h-full bg-[#09090b] rounded-[10px] flex items-center justify-center">
                  <Play className="w-5 h-5 text-blue-400 fill-blue-400/20 ml-0.5" />
                </div>
              </div>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  YouTube Studio Planner
                </span>

                <span
                  className="text-[11px] font-medium px-2 py-0.5 rounded border"
                  style={{
                    backgroundColor: `${activeSeries?.accentColor || "#38bdf8"}15`,
                    borderColor: `${activeSeries?.accentColor || "#38bdf8"}30`,
                    color: activeSeries?.accentColor || "#38bdf8",
                  }}
                >
                  {(() => {
                    const badge = activeSeries?.badgeText;
                    const title = activeSeries?.gameTitle;
                    if (
                      badge &&
                      title &&
                      badge.length === 1 &&
                      title.length > 1 &&
                      badge.toUpperCase() === title.charAt(0).toUpperCase()
                    ) {
                      return title.toUpperCase();
                    }
                    return badge || title?.toUpperCase() || "100% WALKTHROUGH";
                  })()}
                </span>

                {activeSeries && (
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-300 bg-blue-950/60 border border-blue-500/30 px-2 py-0.5 rounded-md">
                    <Target className="w-3 h-3 text-blue-400" />
                    <span>Format:</span>
                    <select
                      value={activeSeries.playthroughType || "100% Walkthrough"}
                      onChange={(e) => onUpdatePlaythroughType?.(activeSeries.id, e.target.value)}
                      className="bg-transparent text-blue-200 font-extrabold focus:outline-none cursor-pointer border-0 p-0 hover:text-white"
                      title="Change Playthrough Type for active series"
                    >
                      {PLAYTHROUGH_TYPES.map((t) => (
                        <option key={t} value={t} className="bg-[#18181b] text-zinc-100 font-normal">
                          {t}
                        </option>
                      ))}
                      {!PLAYTHROUGH_TYPES.includes((activeSeries.playthroughType || "") as any) && activeSeries.playthroughType && (
                        <option value={activeSeries.playthroughType} className="bg-[#18181b] text-zinc-100 font-normal">
                          {activeSeries.playthroughType}
                        </option>
                      )}
                    </select>
                  </div>
                )}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                {activeSeries?.useTitleLogo && activeSeries?.gameTitleLogo ? (
                  <div className="py-1.5 px-4 bg-[#080d1a]/90 rounded-2xl border border-cyan-500/40 shadow-lg shadow-cyan-950/60 flex items-center justify-center overflow-hidden max-h-20 sm:max-h-28 min-h-[56px] backdrop-blur-md">
                    <img
                      src={activeSeries.gameTitleLogo}
                      alt={activeSeries.gameTitle}
                      className="max-h-16 sm:max-h-24 max-w-full w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                    />
                  </div>
                ) : (
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white drop-shadow-md">
                    {activeSeries?.gameTitle || "YouTube Let's Play Series"}
                  </h1>
                )}

                {/* Choice Switcher: Text Title vs Game Logo */}
                {activeSeries && (
                  <div className="inline-flex items-center bg-[#090f20] border border-cyan-500/30 rounded-xl p-0.5 shadow-sm text-xs font-extrabold shrink-0">
                    <button
                      onClick={() => onUpdateSeriesLogo?.(activeSeries.id, activeSeries.gameTitleLogo, false)}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                        !activeSeries.useTitleLogo
                          ? "bg-cyan-500 text-black font-black shadow-sm"
                          : "text-zinc-400 hover:text-white"
                      }`}
                      title="Show normal text title in YouTube Studio Planner"
                    >
                      <Type className="w-3 h-3" />
                      <span>Text</span>
                    </button>
                    <button
                      onClick={() => {
                        if (activeSeries.gameTitleLogo) {
                          onUpdateSeriesLogo?.(activeSeries.id, activeSeries.gameTitleLogo, true);
                        } else {
                          onOpenGameLogoModal?.();
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                        activeSeries.useTitleLogo && activeSeries.gameTitleLogo
                          ? "bg-cyan-500 text-black font-black shadow-sm"
                          : "text-zinc-400 hover:text-white"
                      }`}
                      title="Show game logo image in YouTube Studio Planner"
                    >
                      <Image className="w-3 h-3" />
                      <span>Logo</span>
                    </button>

                    {onOpenGameLogoModal && (
                      <button
                        onClick={onOpenGameLogoModal}
                        className="p-1 rounded-lg text-cyan-400 hover:text-cyan-200 hover:bg-cyan-500/20 transition-all cursor-pointer ml-0.5"
                        title="Upload custom game title logo or pick preset"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Iconography-based Toolbar & Studio Suite Dropdown Navigation */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {/* Icon Button: YouTube Studio Direct Upload Hub */}
            {onOpenYouTubeStudio && (
              <button
                onClick={onOpenYouTubeStudio}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black shadow-md shadow-red-950/60 transition-all hover:scale-105 cursor-pointer border border-red-400/30"
                title="Open YouTube Studio Direct Upload & 1-Click Copy Panel"
              >
                <Youtube className="w-4 h-4 text-white animate-pulse shrink-0" />
                <span className="hidden sm:inline">YouTube</span>
              </button>
            )}

            {/* Quick Action: Add Episode */}
            {onOpenAddEpisodeModal && (
              <button
                onClick={onOpenAddEpisodeModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-extrabold shadow-md shadow-blue-900/30 transition-all hover:scale-105 cursor-pointer"
                title="Add New Episode"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Episode</span>
              </button>
            )}

            {/* Icon Button: Print / PDF Cheat Sheet */}
            {onOpenPrintCheatSheet && (
              <button
                onClick={onOpenPrintCheatSheet}
                className="p-2 text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 rounded-xl transition-all shadow-sm hover:scale-105 cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                title="Print or Export PDF Playthrough Cheat Sheet for Stream/Recording"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span className="hidden lg:inline">Cheat Sheet</span>
              </button>
            )}

            {/* Unified Studio Suite Dropdown (Consolidating Creator Tools & Game Databases) */}
            <div className="relative" ref={studioSuiteMenuRef}>
              <button
                onClick={() => setShowStudioSuiteMenu(!showStudioSuiteMenu)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-extrabold text-amber-300 bg-amber-950/50 hover:bg-amber-900/70 border border-amber-500/40 rounded-xl transition-all shadow-md shadow-amber-900/20 hover:scale-105 cursor-pointer"
                title="Studio Suite: Production Tools, Thumbnails, Game Databases & Analytics"
              >
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Studio Suite</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full font-black border border-amber-500/30">
                  16
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-amber-300 transition-transform ${showStudioSuiteMenu ? "rotate-180" : ""}`} />
              </button>

              {showStudioSuiteMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-[520px] bg-[#121212]/95 border border-amber-500/40 rounded-2xl shadow-2xl z-50 p-3 space-y-3 backdrop-blur-xl max-h-[80vh] overflow-y-auto">
                  {/* Category Filter Tabs */}
                  <div className="flex items-center gap-1 border-b border-white/10 pb-2 text-[10px] font-bold overflow-x-auto">
                    <button
                      onClick={() => setStudioSuiteTab("all")}
                      className={`px-2 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                        studioSuiteTab === "all" ? "bg-amber-500 text-zinc-950 font-extrabold" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      All Tools
                    </button>
                    <button
                      onClick={() => setStudioSuiteTab("production")}
                      className={`px-2 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                        studioSuiteTab === "production" ? "bg-amber-500 text-zinc-950 font-extrabold" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      🎬 Production
                    </button>
                    <button
                      onClick={() => setStudioSuiteTab("visuals")}
                      className={`px-2 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                        studioSuiteTab === "visuals" ? "bg-amber-500 text-zinc-950 font-extrabold" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      🎨 Thumbnails
                    </button>
                    <button
                      onClick={() => setStudioSuiteTab("gamedb")}
                      className={`px-2 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                        studioSuiteTab === "gamedb" ? "bg-amber-500 text-zinc-950 font-extrabold" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      🗡️ Game DB
                    </button>
                  </div>

                  {/* Category Section 1: Production & SEO */}
                  {(studioSuiteTab === "all" || studioSuiteTab === "production") && (
                    <div className="space-y-1.5">
                      <div className="px-1 text-[10px] font-black uppercase tracking-wider text-red-400 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-red-400" />
                        <span>Production & YouTube SEO</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {onOpenYouTubeStudio && (
                          <button
                            onClick={() => { onOpenYouTubeStudio(); setShowStudioSuiteMenu(false); }}
                            className="flex items-start gap-2 p-2 text-left bg-zinc-900/60 hover:bg-zinc-800/90 border border-zinc-800/80 hover:border-red-500/40 rounded-xl transition-all cursor-pointer group"
                          >
                            <Youtube className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5 animate-pulse" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-extrabold text-zinc-200 group-hover:text-white truncate">YouTube Studio Hub</div>
                              <p className="text-[10px] text-zinc-400 truncate">1-Click upload launcher & metadata</p>
                            </div>
                          </button>
                        )}

                        {onOpenRecordingTimer && (
                          <button
                            onClick={() => { onOpenRecordingTimer(); setShowStudioSuiteMenu(false); }}
                            className="flex items-start gap-2 p-2 text-left bg-zinc-900/60 hover:bg-zinc-800/90 border border-zinc-800/80 hover:border-red-500/40 rounded-xl transition-all cursor-pointer group"
                          >
                            <Radio className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-extrabold text-zinc-200 group-hover:text-white truncate">Live Session REC Timer</div>
                              <p className="text-[10px] text-zinc-400 truncate">Stopwatch & 1-click timestamps</p>
                            </div>
                          </button>
                        )}

                        {onOpenMirillisActionModal && (
                          <button
                            onClick={() => { onOpenMirillisActionModal(); setShowStudioSuiteMenu(false); }}
                            className="flex items-start gap-2 p-2 text-left bg-zinc-900/60 hover:bg-zinc-800/90 border border-zinc-800/80 hover:border-red-500/40 rounded-xl transition-all cursor-pointer group"
                          >
                            <Radio className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-extrabold text-zinc-200 group-hover:text-white truncate">Mirillis Action! Sync</div>
                              <p className="text-[10px] text-zinc-400 truncate">HUD overlay & multi-track audio</p>
                            </div>
                          </button>
                        )}

                        {onOpenCtrPredictor && (
                          <button
                            onClick={() => { onOpenCtrPredictor(); setShowStudioSuiteMenu(false); }}
                            className="flex items-start gap-2 p-2 text-left bg-zinc-900/60 hover:bg-zinc-800/90 border border-zinc-800/80 hover:border-red-500/40 rounded-xl transition-all cursor-pointer group"
                          >
                            <TrendingUp className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-extrabold text-zinc-200 group-hover:text-white truncate">CTR Predictor & A/B</div>
                              <p className="text-[10px] text-zinc-400 truncate">Predict click-rate & views</p>
                            </div>
                          </button>
                        )}

                        {onOpenChapterManager && (
                          <button
                            onClick={() => { onOpenChapterManager(); setShowStudioSuiteMenu(false); }}
                            className="flex items-start gap-2 p-2 text-left bg-zinc-900/60 hover:bg-zinc-800/90 border border-zinc-800/80 hover:border-amber-500/40 rounded-xl transition-all cursor-pointer group"
                          >
                            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-extrabold text-zinc-200 group-hover:text-white truncate">Chapter Manager</div>
                              <p className="text-[10px] text-zinc-400 truncate">YouTube scrubber timestamps</p>
                            </div>
                          </button>
                        )}

                        {onOpenSoundcheck && (
                          <button
                            onClick={() => { onOpenSoundcheck(); setShowStudioSuiteMenu(false); }}
                            className="flex items-start gap-2 p-2 text-left bg-zinc-900/60 hover:bg-zinc-800/90 border border-zinc-800/80 hover:border-indigo-500/40 rounded-xl transition-all cursor-pointer group"
                          >
                            <Mic className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-extrabold text-zinc-200 group-hover:text-white truncate">Soundcheck & Checklist</div>
                              <p className="text-[10px] text-zinc-400 truncate">Live dB voice balance & 4K check</p>
                            </div>
                          </button>
                        )}

                        {onOpenShortsClipper && (
                          <button
                            onClick={() => { onOpenShortsClipper(); setShowStudioSuiteMenu(false); }}
                            className="flex items-start gap-2 p-2 text-left bg-zinc-900/60 hover:bg-zinc-800/90 border border-zinc-800/80 hover:border-pink-500/40 rounded-xl transition-all cursor-pointer group"
                          >
                            <Smartphone className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-extrabold text-zinc-200 group-hover:text-white truncate">Shorts & TikTok Clipper</div>
                              <p className="text-[10px] text-zinc-400 truncate">9:16 vertical highlight clips</p>
                            </div>
                          </button>
                        )}

                        {onOpenEndScreenPlanner && (
                          <button
                            onClick={() => { onOpenEndScreenPlanner(); setShowStudioSuiteMenu(false); }}
                            className="flex items-start gap-2 p-2 text-left bg-zinc-900/60 hover:bg-zinc-800/90 border border-zinc-800/80 hover:border-red-500/40 rounded-xl transition-all cursor-pointer group"
                          >
                            <Tv className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-extrabold text-zinc-200 group-hover:text-white truncate">End Screen Planner</div>
                              <p className="text-[10px] text-zinc-400 truncate">20s end-slate & i-Cards</p>
                            </div>
                          </button>
                        )}

                        {onOpenBatchEpisodeEditor && (
                          <button
                            onClick={() => { onOpenBatchEpisodeEditor(); setShowStudioSuiteMenu(false); }}
                            className="flex items-start gap-2 p-2 text-left bg-zinc-900/60 hover:bg-zinc-800/90 border border-zinc-800/80 hover:border-blue-500/40 rounded-xl transition-all cursor-pointer group"
                          >
                            <Layers className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-extrabold text-zinc-200 group-hover:text-white truncate">Batch Mass Editor</div>
                              <p className="text-[10px] text-zinc-400 truncate">Bulk episode status updates</p>
                            </div>
                          </button>
                        )}

                        {onOpenGuide && (
                          <button
                            onClick={() => { onOpenGuide(); setShowStudioSuiteMenu(false); }}
                            className="flex items-start gap-2 p-2 text-left bg-zinc-900/60 hover:bg-zinc-800/90 border border-zinc-800/80 hover:border-emerald-500/40 rounded-xl transition-all cursor-pointer group"
                          >
                            <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-extrabold text-zinc-200 group-hover:text-white truncate">YouTube SEO Guide</div>
                              <p className="text-[10px] text-zinc-400 truncate">Auto-fill titles, tags & descriptions</p>
                            </div>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Category Section 2: Visuals & Thumbnails */}
                  {(studioSuiteTab === "all" || studioSuiteTab === "visuals") && (
                    <div className="space-y-1.5 pt-1.5 border-t border-white/10">
                      <div className="px-1 text-[10px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                        <Image className="w-3 h-3 text-cyan-400" />
                        <span>Thumbnails & Graphic Design</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        <button
                          onClick={() => { onOpenThumbnailStudio(); setShowStudioSuiteMenu(false); }}
                          className="flex items-start gap-2 p-2 text-left bg-zinc-900/60 hover:bg-zinc-800/90 border border-zinc-800/80 hover:border-cyan-500/40 rounded-xl transition-all cursor-pointer group"
                        >
                          <Image className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-extrabold text-zinc-200 group-hover:text-white truncate">1280x720 Thumbnail Studio</div>
                            <p className="text-[10px] text-zinc-400 truncate">Live canvas thumbnail builder</p>
                          </div>
                        </button>

                        {onOpenBatchThumbnailExporter && (
                          <button
                            onClick={() => { onOpenBatchThumbnailExporter(); setShowStudioSuiteMenu(false); }}
                            className="flex items-start gap-2 p-2 text-left bg-zinc-900/60 hover:bg-zinc-800/90 border border-zinc-800/80 hover:border-amber-500/40 rounded-xl transition-all cursor-pointer group"
                          >
                            <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-extrabold text-zinc-200 group-hover:text-white truncate">Batch Thumbnail Exporter</div>
                              <p className="text-[10px] text-zinc-400 truncate">Export graphics for all episodes</p>
                            </div>
                          </button>
                        )}

                        {onOpenThumbnailPresetStudio && (
                          <button
                            onClick={() => { onOpenThumbnailPresetStudio(); setShowStudioSuiteMenu(false); }}
                            className="flex items-start gap-2 p-2 text-left bg-zinc-900/60 hover:bg-zinc-800/90 border border-zinc-800/80 hover:border-purple-500/40 rounded-xl transition-all cursor-pointer group"
                          >
                            <Palette className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-extrabold text-zinc-200 group-hover:text-white truncate">Presets & Badges</div>
                              <p className="text-[10px] text-zinc-400 truncate">Preset themes & badge stamps</p>
                            </div>
                          </button>
                        )}

                        {onOpenGameLogoModal && (
                          <button
                            onClick={() => { onOpenGameLogoModal(); setShowStudioSuiteMenu(false); }}
                            className="flex items-start gap-2 p-2 text-left bg-zinc-900/60 hover:bg-zinc-800/90 border border-cyan-500/40 hover:border-cyan-400 rounded-xl transition-all cursor-pointer group"
                          >
                            <Image className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-extrabold text-zinc-200 group-hover:text-white truncate">Game Title Logo Settings</div>
                              <p className="text-[10px] text-zinc-400 truncate">Replace text title with auto-fitting game logo</p>
                            </div>
                          </button>
                        )}

                        {onOpenAiPromptCrafter && (
                          <button
                            onClick={() => { onOpenAiPromptCrafter(); setShowStudioSuiteMenu(false); }}
                            className="flex items-start gap-2 p-2 text-left bg-zinc-900/60 hover:bg-zinc-800/90 border border-zinc-800/80 hover:border-indigo-500/40 rounded-xl transition-all cursor-pointer group"
                          >
                            <Wand2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-extrabold text-zinc-200 group-hover:text-white truncate">AI Prompt Crafter</div>
                              <p className="text-[10px] text-zinc-400 truncate">Midjourney & DALL-E 3 formulas</p>
                            </div>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Category Section 3: Game Knowledge Bases */}
                  {(studioSuiteTab === "all" || studioSuiteTab === "gamedb") && (
                    <div className="space-y-1.5 pt-1.5 border-t border-white/10">
                      <div className="px-1 text-[10px] font-black uppercase tracking-wider text-purple-400 flex items-center gap-1">
                        <Swords className="w-3 h-3 text-purple-400" />
                        <span>Game Knowledge & Walkthrough DB</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {onOpenBossEncounterPlanner && (
                          <button
                            onClick={() => { onOpenBossEncounterPlanner(); setShowStudioSuiteMenu(false); }}
                            className="flex items-start gap-2 p-2 text-left bg-zinc-900/60 hover:bg-zinc-800/90 border border-red-500/40 hover:border-red-400 rounded-xl transition-all cursor-pointer group"
                          >
                            <Swords className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-extrabold text-zinc-200 group-hover:text-white truncate">Boss Encounter & Retry Planner</div>
                              <p className="text-[10px] text-zinc-400 truncate">Phase breakdowns, wiped retries & tactics</p>
                            </div>
                          </button>
                        )}

                        {onOpenCompletionDashboard && (
                          <button
                            onClick={() => { onOpenCompletionDashboard(); setShowStudioSuiteMenu(false); }}
                            className="flex items-start gap-2 p-2 text-left bg-zinc-900/60 hover:bg-zinc-800/90 border border-emerald-500/40 hover:border-emerald-400 rounded-xl transition-all cursor-pointer group"
                          >
                            <BarChart3 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5 animate-bounce" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-extrabold text-zinc-200 group-hover:text-white truncate">100% Series Completion Dashboard</div>
                              <p className="text-[10px] text-zinc-400 truncate">Overall score, trophies & missables guard</p>
                            </div>
                          </button>
                        )}
                        {onOpenBossWeaknessCards && (
                          <button
                            onClick={() => { onOpenBossWeaknessCards(); setShowStudioSuiteMenu(false); }}
                            className="flex items-start gap-2 p-2 text-left bg-zinc-900/60 hover:bg-zinc-800/90 border border-zinc-800/80 hover:border-red-500/40 rounded-xl transition-all cursor-pointer group"
                          >
                            <Zap className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-extrabold text-zinc-200 group-hover:text-white truncate">Boss Weakness Cards</div>
                              <p className="text-[10px] text-zinc-400 truncate">Vulnerabilities & instant tactics</p>
                            </div>
                          </button>
                        )}

                        {onOpenBossLootCatalog && (
                          <button
                            onClick={() => { onOpenBossLootCatalog(); setShowStudioSuiteMenu(false); }}
                            className="flex items-start gap-2 p-2 text-left bg-zinc-900/60 hover:bg-zinc-800/90 border border-zinc-800/80 hover:border-emerald-500/40 rounded-xl transition-all cursor-pointer group"
                          >
                            <Swords className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-extrabold text-zinc-200 group-hover:text-white truncate">100% Boss & Loot Catalog</div>
                              <p className="text-[10px] text-zinc-400 truncate">Boss list & drop rates</p>
                            </div>
                          </button>
                        )}

                        {onOpenProtagonistDB && (
                          <button
                            onClick={() => { onOpenProtagonistDB(); setShowStudioSuiteMenu(false); }}
                            className="flex items-start gap-2 p-2 text-left bg-zinc-900/60 hover:bg-zinc-800/90 border border-zinc-800/80 hover:border-indigo-500/40 rounded-xl transition-all cursor-pointer group"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-extrabold text-zinc-200 group-hover:text-white truncate">Character DB</div>
                              <p className="text-[10px] text-zinc-400 truncate">Party roles, builds & lore</p>
                            </div>
                          </button>
                        )}

                        {onOpenQuestBranchTracker && (
                          <button
                            onClick={() => { onOpenQuestBranchTracker(); setShowStudioSuiteMenu(false); }}
                            className="flex items-start gap-2 p-2 text-left bg-zinc-900/60 hover:bg-zinc-800/90 border border-zinc-800/80 hover:border-purple-500/40 rounded-xl transition-all cursor-pointer group"
                          >
                            <GitBranch className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-extrabold text-zinc-200 group-hover:text-white truncate">Quest Branch Tracker</div>
                              <p className="text-[10px] text-zinc-400 truncate">Act progression & side quests</p>
                            </div>
                          </button>
                        )}

                        {onOpenKeyItemsTracker && (
                          <button
                            onClick={() => { onOpenKeyItemsTracker(); setShowStudioSuiteMenu(false); }}
                            className="flex items-start gap-2 p-2 text-left bg-zinc-900/60 hover:bg-zinc-800/90 border border-zinc-800/80 hover:border-amber-500/40 rounded-xl transition-all cursor-pointer group"
                          >
                            <Key className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-extrabold text-zinc-200 group-hover:text-white truncate">Key Items & Relics</div>
                              <p className="text-[10px] text-zinc-400 truncate">Weapons, gear & missables</p>
                            </div>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Export & Backup Dropdown Menu */}
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setShowDataExportMenu(!showDataExportMenu)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 border border-blue-400/40 rounded-xl transition-all font-bold shadow-md shadow-blue-900/40 hover:scale-105 shrink-0 cursor-pointer"
                title="Export Playlist, Sync & Download Backups"
              >
                <Download className="w-4 h-4 text-cyan-200 shrink-0" />
                <span>Export & Backup</span>
                <ChevronDown className={`w-3.5 h-3.5 text-blue-200 transition-transform ${showDataExportMenu ? "rotate-180" : ""}`} />
              </button>

              {showDataExportMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-[#121212] border border-blue-500/40 rounded-2xl shadow-2xl z-50 p-2 space-y-1 backdrop-blur-xl">
                  <div className="px-3 py-1.5 border-b border-white/10 text-[10px] font-extrabold uppercase tracking-wider text-blue-400">
                    Export & Backup Actions
                  </div>

                  {onOpenPrintCheatSheet && (
                    <button
                      onClick={() => { onOpenPrintCheatSheet(); setShowDataExportMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-bold text-amber-300 hover:text-amber-200 hover:bg-amber-500/20 rounded-xl transition-colors group cursor-pointer border border-amber-500/20 bg-amber-950/20 my-1"
                    >
                      <Printer className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                      <div>
                        <div>Print / PDF Playthrough Cheat Sheet</div>
                        <p className="text-[10px] text-zinc-400 font-normal">Printable notes & PDF guide for stream/rec</p>
                      </div>
                    </button>
                  )}

                  <button
                    onClick={() => { onOpenExport(); setShowDataExportMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-bold text-zinc-200 hover:text-white hover:bg-blue-500/20 rounded-xl transition-colors group cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-blue-400 shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <div>Export Playlist & Descriptions</div>
                      <p className="text-[10px] text-zinc-400 font-normal">Batch Markdown, CSV & JSON format</p>
                    </div>
                  </button>

                  <button
                    onClick={() => { setShowBackupSyncModal(true); setShowDataExportMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-bold text-zinc-200 hover:text-white hover:bg-cyan-500/20 rounded-xl transition-colors group cursor-pointer"
                  >
                    <HardDrive className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate">Local Storage & Cloud Sync</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-black shrink-0 ${
                          syncState === "synced"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : syncState === "out_of_sync"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        }`}>
                          {syncState === "synced" ? "Synced" : syncState === "out_of_sync" ? "Sync Needed" : "Syncing..."}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 font-normal truncate">LocalStorage, IndexedDB & Cloud backup status</p>
                    </div>
                  </button>

                  <button
                    onClick={() => { handleDownloadJsonBackup(); setShowDataExportMenu(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs font-bold text-zinc-200 hover:text-white hover:bg-emerald-500/20 rounded-xl transition-colors group cursor-pointer"
                  >
                    <FileJson className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <div>Save JSON Backup File</div>
                      <p className="text-[10px] text-zinc-400 font-normal">Download .json backup to your device</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid & Target Duration Switcher - Auto-Fit Single Row */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 pt-4 border-t border-white/10">
          {/* Game Synopsis Window - Expanded on Left Side (3/6 cols) */}
          <div className="col-span-1 md:col-span-3 bg-[#09090b] p-3.5 rounded-xl border border-cyan-500/30 flex flex-col justify-between overflow-hidden shadow-md">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1 flex-wrap gap-1">
              <span className="flex items-center gap-1.5 font-bold text-cyan-300">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                Game Synopsis
              </span>
              <div className="flex items-center gap-1 flex-wrap">
                {/* DB Library Button */}
                <button
                  onClick={() => setShowSynopsisDbModal(true)}
                  className="px-2 py-0.5 bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 rounded text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                  title="Browse & upload custom synopsis database library"
                >
                  <Database className="w-3 h-3 text-blue-400" />
                  <span>DB Library</span>
                </button>

                {/* Re-Scrape Web AI Button */}
                <button
                  onClick={handleScrapeSynopsis}
                  disabled={isScrapingSynopsis}
                  className="px-2 py-0.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  title="Re-scrape game synopsis from web using AI"
                >
                  <RefreshCw className={`w-3 h-3 text-cyan-400 ${isScrapingSynopsis ? "animate-spin" : ""}`} />
                  <span>{isScrapingSynopsis ? "Scraping..." : "Re-Scrape Web"}</span>
                </button>

                {/* Manual Edit Button */}
                <button
                  onClick={() => {
                    setEditableSynopsis(activeSeries?.gameSynopsis || "");
                    setIsEditingSynopsis(!isEditingSynopsis);
                  }}
                  className="px-2 py-0.5 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 rounded text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                  title="Edit game synopsis manually"
                >
                  <Edit2 className="w-3 h-3 text-amber-400" />
                  <span>{isEditingSynopsis ? "Cancel" : "Edit"}</span>
                </button>
              </div>
            </div>

            {isEditingSynopsis ? (
              <div className="space-y-1.5 pt-1">
                <textarea
                  value={editableSynopsis}
                  onChange={(e) => setEditableSynopsis(e.target.value)}
                  rows={2}
                  className="w-full bg-[#080c18] border border-cyan-500/50 rounded-lg p-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  placeholder="Enter custom game story & world synopsis..."
                />
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => setIsEditingSynopsis(false)}
                    className="px-2.5 py-0.5 bg-zinc-800 text-zinc-400 hover:text-white text-[10px] font-bold rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (onUpdateSeriesSynopsis && activeSeries) {
                        onUpdateSeriesSynopsis(activeSeries.id, editableSynopsis, "Custom User Edit");
                      }
                      setIsEditingSynopsis(false);
                    }}
                    className="px-2.5 py-0.5 bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold rounded cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs text-zinc-200 line-clamp-3 leading-relaxed italic mt-0.5">
                  {activeSeries?.gameSynopsis ? `"${activeSeries.gameSynopsis}"` : "No game synopsis loaded for this active series."}
                </p>
                {activeSeries?.gameSynopsisSource && (
                  <span className="text-[9px] text-zinc-500 font-mono block mt-1 truncate">
                    Source: {activeSeries.gameSynopsisSource}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Shifted & Compacted Stats Windows on Right Side */}
          <div className="bg-[#09090b] p-3 rounded-xl border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
              <span className="text-[11px] font-medium text-zinc-400">Total Episodes</span>
              <Layers className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            </div>
            <div>
              <div className="text-lg font-bold text-zinc-100">{totalEpisodes} Episodes</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">
                100% Series Track
              </div>
            </div>
          </div>

          <div className="bg-[#09090b] p-3 rounded-xl border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
              <span className="text-[11px] font-medium text-zinc-400">Est. Total Playtime</span>
              <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            </div>
            <div>
              <div className="text-lg font-bold text-zinc-100">~{totalHours} Hours</div>
              <div className="text-[10px] text-zinc-400 mt-0.5 truncate">
                Avg {totalEpisodes > 0 ? Math.round(totalEstMinutes / totalEpisodes) : 0}m / ep
              </div>
            </div>
          </div>

          <div className="bg-[#09090b] p-3 rounded-xl border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
              <span className="text-[11px] font-medium text-zinc-400">Published / Ready</span>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            </div>
            <div>
              <div className="text-lg font-bold text-zinc-100">
                {publishedCount} / {totalEpisodes}
              </div>
              <div className="text-[10px] text-emerald-400 mt-0.5 truncate">
                {readyCount} edited/ready
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Synopsis Database Modal */}
      {showSynopsisDbModal && (
        <SynopsisDbModal
          activeSeries={activeSeries}
          onUpdateSeriesSynopsis={onUpdateSeriesSynopsis}
          onClose={() => setShowSynopsisDbModal(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#121212] border border-red-500/30 w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-100">Delete Playthrough Series?</h3>
                <p className="text-xs text-zinc-400">This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-zinc-300 leading-relaxed space-y-1">
              <p>
                Are you sure you want to delete <strong className="text-red-300 font-bold">{activeSeries?.gameTitle}</strong>?
              </p>
              <p className="text-zinc-400">
                This will permanently remove all <strong className="text-zinc-100 font-bold">{totalEpisodes} episodes</strong>, chapter timestamps, thumbnail graphics, and YouTube SEO data for this series.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 bg-[#18181b] hover:bg-[#27272a] text-zinc-300 border border-white/10 rounded-xl text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-red-950/50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete Series</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backup & Cloud Sync Modal */}
      {showBackupSyncModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#121212] border border-blue-500/30 w-full max-w-xl rounded-2xl p-6 shadow-2xl space-y-5 my-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
                  <Cloud className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-zinc-100 flex items-center gap-2">
                    <span>Data Sync & Safe-Keeping</span>
                  </h3>
                  <p className="text-xs text-zinc-400">LocalStorage Status & Cloud Backup Sync Manager</p>
                </div>
              </div>
              <button
                onClick={() => { setShowBackupSyncModal(false); setBackupMsg(null); }}
                className="p-1.5 text-zinc-400 hover:text-zinc-100 bg-[#18181b] hover:bg-[#27272a] rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sync Status Banner */}
            <div className="p-4 bg-[#09090b] border border-white/10 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                  <span>Local Storage & Backup State</span>
                </span>
                <span
                  className={`text-xs font-extrabold px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${
                    syncState === "synced"
                      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                      : syncState === "out_of_sync"
                      ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                      : "bg-blue-500/10 text-blue-300 border-blue-500/30"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {syncState === "synced"
                    ? "Local Data Synced to Cloud"
                    : syncState === "out_of_sync"
                    ? "Local Changes Pending Cloud Sync"
                    : "Ready for Backup"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
                <div className="bg-[#18181b] p-2.5 rounded-lg border border-white/5">
                  <span className="text-[11px] text-zinc-500 block">Total Series Saved:</span>
                  <strong className="text-zinc-200 font-bold">{seriesList.length} Playthrough Series</strong>
                </div>
                <div className="bg-[#18181b] p-2.5 rounded-lg border border-white/5">
                  <span className="text-[11px] text-zinc-500 block">Last Cloud Backup:</span>
                  <strong className="text-zinc-200 font-bold">{lastSyncTime || "Not synced yet"}</strong>
                </div>
              </div>

              {backupMsg && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs font-semibold text-blue-200 flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{backupMsg}</span>
                </div>
              )}
            </div>

            {/* Quick Actions Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Backup & Restore Options</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Cloud Sync Now */}
                <button
                  onClick={handleCloudBackup}
                  disabled={syncState === "syncing"}
                  className="p-3.5 bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/30 rounded-xl text-left space-y-1.5 transition-all group disabled:opacity-50"
                >
                  <div className="flex items-center gap-2 text-blue-300 font-bold text-xs">
                    <Cloud className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <span>Save to Cloud Backup</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-normal">
                    Syncs all current LocalStorage series and episodes safely to the cloud server storage.
                  </p>
                </button>

                {/* 2. Download JSON File */}
                <button
                  onClick={handleDownloadJsonBackup}
                  className="p-3.5 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 rounded-xl text-left space-y-1.5 transition-all group"
                >
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                    <FileJson className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span>Download JSON Backup File</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-normal">
                    Exports a formatted <code className="text-emerald-300 font-mono">.json</code> backup file directly to your device for offline safe-keeping.
                  </p>
                </button>

                {/* 3. Restore from Cloud */}
                <button
                  onClick={handleCloudRestore}
                  disabled={syncState === "syncing"}
                  className="p-3.5 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 rounded-xl text-left space-y-1.5 transition-all group disabled:opacity-50"
                >
                  <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                    <RefreshCw className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                    <span>Restore from Cloud Backup</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-normal">
                    Overwrites local state with the latest saved cloud backup from the server.
                  </p>
                </button>

                {/* 4. Import / Restore JSON File */}
                <label className="p-3.5 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 rounded-xl text-left space-y-1.5 transition-all group cursor-pointer block">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                    <Upload className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>Import JSON Backup File</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-normal">
                    Upload a previously saved <code className="text-amber-300 font-mono">.json</code> file to restore your entire playthrough library.
                  </p>
                  <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleImportJsonFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>LocalStorage auto-saves active automatically</span>
              </span>
              <button
                onClick={() => { setShowBackupSyncModal(false); setBackupMsg(null); }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-blue-900/40"
              >
                Close Manager
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Studio Banner Settings Modal */}
      <StudioBannerModal
        isOpen={showBannerModal}
        onClose={() => setShowBannerModal(false)}
        config={bannerConfig}
        onSave={handleSaveBannerConfig}
      />

      {/* Gamerscore & Trophies Showcase Modal */}
      <AchievementModal
        isOpen={showAchievementModal}
        onClose={() => setShowAchievementModal(false)}
        onAchievementUpdate={() => setGamerscore(calculateGamerscore(loadAchievements()))}
      />
    </header>
  );
};

