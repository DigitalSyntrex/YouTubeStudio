import React, { useState, useEffect } from "react";
import {
  Play,
  Sparkles,
  Gamepad2,
  CheckCircle2,
  Clock,
  TrendingUp,
  Layers,
  Image,
  Plus,
  BarChart3,
  Download,
  Swords,
  Search,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  FolderKanban,
  Tv2,
  Printer,
  Zap,
  Star,
  Film,
  Trophy,
  ArrowRight,
  BookOpen,
  Sliders,
  X,
  Radio,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { PlaythroughSeries, Episode, EpisodeStatus, QuestEntry } from "../types";
import { SeriesDashboard } from "./SeriesDashboard";

interface LandingPageProps {
  seriesList: PlaythroughSeries[];
  activeSeriesId: string;
  onSelectSeries: (id: string) => void;
  onOpenPlaythroughView: () => void;
  onOpenNewSeriesModal: () => void;
  onOpenThumbnailStudio: () => void;
  onOpenExport: () => void;
  onOpenPrintCheatSheet: () => void;
  onOpenBossLootCatalog: () => void;
  onOpenQuestBranchTracker: () => void;
  onOpenCtrPredictor: () => void;
  onUpdateEpisodeStatus?: (episodeId: number, status: EpisodeStatus) => void;
  onUpdateQuests?: (updatedQuests: QuestEntry[]) => void;
  onOpenGameLogoModal?: () => void;
  onUpdateSeriesSynopsis?: (seriesId: string, synopsis: string, source?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  seriesList,
  activeSeriesId,
  onSelectSeries,
  onOpenPlaythroughView,
  onOpenNewSeriesModal,
  onOpenThumbnailStudio,
  onOpenExport,
  onOpenPrintCheatSheet,
  onOpenBossLootCatalog,
  onOpenQuestBranchTracker,
  onOpenCtrPredictor,
  onUpdateEpisodeStatus,
  onUpdateQuests,
  onOpenGameLogoModal,
  onUpdateSeriesSynopsis,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "active" | "completed">("all");

  const [showAllSeries, setShowAllSeries] = useState(false);
  const [isPlaylistsMinimized, setIsPlaylistsMinimized] = useState<boolean>(() => {
    return localStorage.getItem("yt_playlists_minimized") === "true";
  });
  const [isShowcaseMinimized, setIsShowcaseMinimized] = useState<boolean>(() => {
    return localStorage.getItem("yt_showcase_minimized") === "true";
  });

  useEffect(() => {
    localStorage.setItem("yt_playlists_minimized", isPlaylistsMinimized.toString());
  }, [isPlaylistsMinimized]);

  useEffect(() => {
    localStorage.setItem("yt_showcase_minimized", isShowcaseMinimized.toString());
  }, [isShowcaseMinimized]);

  const activeSeries = (seriesList || []).find((s) => s?.id === activeSeriesId) || seriesList?.[0];

  // Helper calculation for series completion
  const getSeriesProgress = (episodes: Episode[]) => {
    if (!episodes || episodes.length === 0) return { percent: 0, completedCount: 0, totalCount: 0 };
    const completedCount = episodes.filter(
      (e) => e.status === "published" || e.status === "edited" || e.status === "uploaded"
    ).length;
    const percent = Math.round((completedCount / episodes.length) * 100);
    return { percent, completedCount, totalCount: episodes.length };
  };

  const getSeriesTotalHours = (episodes: Episode[]) => {
    if (!episodes) return "0";
    const totalMins = episodes.reduce((acc, ep) => acc + (ep.estDurationMinutes || 90), 0);
    return (totalMins / 60).toFixed(1);
  };

  // Stats across all series
  const totalSeriesCount = (seriesList || []).length;
  const totalEpisodesCount = (seriesList || []).reduce((acc, s) => acc + (s?.episodes?.length || 0), 0);
  const totalCompletedEpisodes = (seriesList || []).reduce(
    (acc, s) =>
      acc +
      (s?.episodes?.filter((e) => e && (e.status === "published" || e.status === "edited" || e.status === "uploaded"))
        .length || 0),
    0
  );
  const totalPlannedHours = (
    (seriesList || []).reduce(
      (acc, s) => acc + (s?.episodes?.reduce((epAcc, ep) => epAcc + (ep?.estDurationMinutes || 90), 0) || 0),
      0
    ) / 60
  ).toFixed(0);

  const completedSeriesList = (seriesList || []).filter((s) => {
    if (!s) return false;
    const { percent } = getSeriesProgress(s.episodes);
    return percent >= 90;
  });

  const activePlaythroughsList = (seriesList || []).filter((s) => {
    if (!s) return false;
    const { percent } = getSeriesProgress(s.episodes);
    return percent < 90;
  });

  const filteredSeriesList = (seriesList || []).filter((s) => {
    if (!s) return false;
    const searchLower = (searchTerm || "").toLowerCase();
    const matchesSearch =
      !searchLower ||
      (s.gameTitle && s.gameTitle.toLowerCase().includes(searchLower)) ||
      (s.playthroughType && s.playthroughType.toLowerCase().includes(searchLower));
    if (!matchesSearch) return false;

    const { percent } = getSeriesProgress(s.episodes);
    if (filterTab === "active") return percent < 90;
    if (filterTab === "completed") return percent >= 90;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Featured Series Creator Dashboard */}
      <SeriesDashboard
        seriesList={seriesList}
        activeSeries={activeSeries}
        onSelectSeries={onSelectSeries}
        onOpenPlaythroughView={onOpenPlaythroughView}
        onUpdateEpisodeStatus={onUpdateEpisodeStatus}
        onOpenThumbnailStudio={onOpenThumbnailStudio}
        onOpenQuestBranchTracker={onOpenQuestBranchTracker}
        onOpenBossLootCatalog={onOpenBossLootCatalog}
        onUpdateQuests={onUpdateQuests}
        onOpenGameLogoModal={onOpenGameLogoModal}
        onUpdateSeriesSynopsis={onUpdateSeriesSynopsis}
      />

      {/* Playlists & Playthroughs Management Hub Window */}
      <section className="bg-gradient-to-b from-[#0d101a] via-[#090b13] to-[#050609] border border-blue-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-blue-950/40 relative ring-1 ring-white/10 transition-all duration-300">
        {/* Background Glows & Subtle Grid Depth */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Window Header Bar with Minimize & Expand */}
        <div className="px-4 py-2 bg-[#09090b]/90 border-b border-white/10 flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <div className="flex items-center gap-1.5 text-blue-400 font-extrabold text-xs uppercase tracking-wider shrink-0">
              <Gamepad2 className="w-4 h-4 text-blue-400" />
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Gaming Playthrough Playlists</span>
            </div>

            <span className="text-xs font-extrabold text-white truncate">
              • {seriesList.length} Series Total
            </span>

            {isPlaylistsMinimized && (
              <span className="text-[11px] text-zinc-400 font-medium truncate hidden sm:inline">
                • {activePlaythroughsList.length} Active • {completedSeriesList.length} Completed
              </span>
            )}
          </div>

          <button
            onClick={() => setIsPlaylistsMinimized(!isPlaylistsMinimized)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg text-xs font-bold border border-amber-500/30 transition-all cursor-pointer shrink-0"
            title={isPlaylistsMinimized ? "Expand Gaming Playthrough Playlists Window" : "Minimize Gaming Playthrough Playlists Window"}
          >
            {isPlaylistsMinimized ? (
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

        {!isPlaylistsMinimized && (
          <div className="p-5 sm:p-7 space-y-6 relative z-10">
            {/* Header Controls: Search & Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-blue-400" />
                  <span>Series Directory & Walkthroughs</span>
                </h2>
                <p className="text-xs text-zinc-400">
                  Browse recently created, active walkthroughs, and completed video series.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search Input */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-cyan-400 animate-pulse" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search series by game title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-[#090d16] border-2 border-cyan-500/40 hover:border-cyan-400 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-500/30 rounded-xl pl-9 pr-8 py-1.5 text-xs font-bold text-white placeholder-zinc-400 focus:outline-none transition-all w-52 sm:w-64 shadow-inner shadow-black/80"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 bg-[#121215] p-1 rounded-xl border border-white/10 text-xs font-bold">
                  <button
                    onClick={() => setFilterTab("all")}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      filterTab === "all" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    All ({seriesList.length})
                  </button>
                  <button
                    onClick={() => setFilterTab("active")}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      filterTab === "active" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Active ({activePlaythroughsList.length})
                  </button>
                  <button
                    onClick={() => setFilterTab("completed")}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      filterTab === "completed" ? "bg-blue-600 text-white" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Completed ({completedSeriesList.length})
                  </button>
                </div>
              </div>
            </div>

            {/* Playthrough Series Cards Grid - Compact & Responsive */}
            {filteredSeriesList.length === 0 ? (
              <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-8 text-center space-y-3">
                <Gamepad2 className="w-10 h-10 text-zinc-600 mx-auto" />
                <h3 className="text-base font-bold text-zinc-300">No playthrough series match your search</h3>
                <p className="text-xs text-zinc-500 max-w-md mx-auto">
                  Try adjusting your search terms or generate a new playthrough series to start planning your YouTube gaming content.
                </p>
                <button
                  onClick={onOpenNewSeriesModal}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Generate New Playthrough
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {(showAllSeries ? filteredSeriesList : filteredSeriesList.slice(0, 4)).map((series) => {
                    const { percent, completedCount, totalCount } = getSeriesProgress(series.episodes);
                    const totalHours = getSeriesTotalHours(series.episodes);
                    const isSelected = series.id === activeSeriesId;
                    const isCompleted = percent >= 90;

                    return (
                      <div
                        key={series.id}
                        className={`group relative bg-gradient-to-b from-[#111420] via-[#0d0f17] to-[#08090e] border rounded-xl p-3.5 flex flex-col justify-between transition-all duration-300 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-950/40 hover:-translate-y-0.5 ${
                          isSelected
                            ? "border-blue-500/60 ring-2 ring-blue-500/30 shadow-lg shadow-blue-950/30"
                            : "border-white/10"
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Header Row */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border shadow-sm truncate max-w-full"
                                  style={{
                                    backgroundColor: `${series.accentColor || "#38bdf8"}15`,
                                    borderColor: `${series.accentColor || "#38bdf8"}40`,
                                    color: series.accentColor || "#38bdf8",
                                  }}
                                >
                                  {series.playthroughType || "100% Walkthrough"}
                                </span>
                                {isCompleted ? (
                                  <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                                    <Trophy className="w-2.5 h-2.5 text-emerald-400" />
                                    <span>Done</span>
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded-full shadow-sm">
                                    In Progress
                                  </span>
                                )}
                              </div>
                              <h3 className="text-sm font-black text-white group-hover:text-blue-300 transition-colors line-clamp-1 drop-shadow-sm">
                                {series.gameTitle}
                              </h3>
                            </div>

                            {/* Accent Icon */}
                            <div
                              className="w-7 h-7 rounded-lg p-0.5 shrink-0 flex items-center justify-center font-bold text-xs shadow-md"
                              style={{ backgroundColor: `${series.accentColor || "#38bdf8"}20` }}
                            >
                              <Gamepad2 className="w-3.5 h-3.5" style={{ color: series.accentColor || "#38bdf8" }} />
                            </div>
                          </div>

                          {/* Completion Progress Bar */}
                          <div className="space-y-1 bg-[#07080c] p-2 rounded-lg border border-white/10 shadow-inner">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-zinc-400 font-medium">Progress</span>
                              <span className="font-mono font-bold text-zinc-200">{percent}% ({completedCount}/{totalCount} Ep)</span>
                            </div>
                            <div className="w-full bg-zinc-800/80 rounded-full h-1.5 overflow-hidden border border-white/5 shadow-inner">
                              <div
                                className="h-full rounded-full transition-all duration-500 shadow-sm"
                                style={{
                                  width: `${percent}%`,
                                  backgroundColor: isCompleted ? "#10b981" : series.accentColor || "#38bdf8",
                                }}
                              />
                            </div>
                          </div>

                          {/* Stats Specs - Compact horizontal row */}
                          <div className="flex items-center justify-between text-[10px] bg-[#0e1018] px-2.5 py-1.5 rounded-lg border border-white/10 shadow-sm">
                            <div className="flex items-center gap-1 text-zinc-300 font-bold">
                              <Film className="w-3 h-3 text-blue-400 shrink-0" />
                              <span className="truncate">90-120m Ep</span>
                            </div>
                            <div className="flex items-center gap-1 text-zinc-300 font-bold">
                              <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                              <span>~{totalHours}h Total</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Action Footer */}
                        <div className="pt-2.5 mt-3 border-t border-white/10 flex items-center justify-between gap-1.5">
                          <button
                            onClick={() => {
                              onSelectSeries(series.id);
                              onOpenPlaythroughView();
                            }}
                            className="flex-1 py-1.5 px-2.5 bg-gradient-to-r from-blue-600/25 to-indigo-600/25 hover:from-blue-600/35 hover:to-indigo-600/35 text-blue-200 border border-blue-500/40 rounded-lg font-extrabold text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm hover:-translate-y-0.5 active:translate-y-0"
                          >
                            <Play className="w-3 h-3 fill-blue-300" />
                            <span>Open</span>
                          </button>

                          <button
                            onClick={() => {
                              onSelectSeries(series.id);
                              onOpenThumbnailStudio();
                            }}
                            className="p-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg transition-all cursor-pointer shadow-sm hover:-translate-y-0.5"
                            title="Open Thumbnail Studio"
                          >
                            <Image className="w-3.5 h-3.5 text-cyan-400" />
                          </button>

                          <button
                            onClick={() => {
                              onSelectSeries(series.id);
                              onOpenExport();
                            }}
                            className="p-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg transition-all cursor-pointer"
                            title="Export YouTube Playlist Metadata"
                          >
                            <Download className="w-3.5 h-3.5 text-purple-400" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Show More / Show Fewer Option Button */}
                {filteredSeriesList.length > 4 && (
                  <div className="flex justify-center pt-2">
                    <button
                      onClick={() => setShowAllSeries(!showAllSeries)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#121522] hover:bg-[#1a1f33] text-blue-300 hover:text-white border border-blue-500/35 hover:border-blue-400 rounded-xl font-extrabold text-xs transition-all shadow-md cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {showAllSeries ? (
                        <>
                          <ChevronUp className="w-4 h-4 text-blue-400" />
                          <span>Show Fewer (Top 4 Most Recent)</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 text-blue-400" />
                          <span>Show More Playlists ({filteredSeriesList.length - 4} More Series)</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Highlight Section: Completed Playlists */}
      {completedSeriesList.length > 0 && (
        <section className="bg-gradient-to-r from-emerald-950/30 via-[#0d1017] to-[#0a0d14] border border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-950/30 space-y-0 transition-all duration-300">
          {/* Header Bar with Minimize & Expand */}
          <div className="px-5 sm:px-6 py-3.5 bg-[#090b10]/95 border-b border-emerald-500/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Trophy className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-black text-white truncate">
                    Completed Let's Play Series Showcase
                  </h3>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    {completedSeriesList.length} Finished
                  </span>
                </div>
                {!isShowcaseMinimized && (
                  <p className="text-xs text-zinc-400 hidden sm:block">
                    Fully finished walkthroughs ready for YouTube playlist publishing and metadata export.
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setIsShowcaseMinimized(!isShowcaseMinimized)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded-lg text-xs font-bold border border-amber-500/30 transition-all cursor-pointer shrink-0"
              title={isShowcaseMinimized ? "Expand Completed Let's Play Series Showcase Window" : "Minimize Completed Let's Play Series Showcase Window"}
            >
              {isShowcaseMinimized ? (
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

          {!isShowcaseMinimized && (
            <div className="p-5 sm:p-7 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedSeriesList.map((cs) => {
                  const totalHours = getSeriesTotalHours(cs.episodes);
                  return (
                    <div
                      key={cs.id}
                      className="bg-[#090b10] border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-emerald-500/50 transition-colors shadow-sm"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                            100% Completed
                          </span>
                          <span className="text-xs font-mono text-zinc-400">{cs.episodes.length} Episodes</span>
                        </div>
                        <h4 className="text-base font-extrabold text-white truncate">{cs.gameTitle}</h4>
                        <p className="text-xs text-zinc-400 truncate">Total duration: ~{totalHours} hrs • All chapters & thumbnails logged</p>
                      </div>

                      <button
                        onClick={() => {
                          onSelectSeries(cs.id);
                          onOpenExport();
                        }}
                        className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Export Metadata</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
