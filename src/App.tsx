import React, { useState, useEffect, useRef } from "react";
import { Episode, EpisodeStatus, PlaythroughSeries, QuestEntry } from "./types";
import { defaultPlaythroughSeries } from "./data/episodesData";
import { defaultFF6Quests } from "./data/questsData";
import { Header } from "./components/Header";
import { LandingPage } from "./components/LandingPage";
import { EpisodeList } from "./components/EpisodeList";
import { EpisodeDetailModal } from "./components/EpisodeDetailModal";
import { StrategyGuide } from "./components/StrategyGuide";
import { ExportModal } from "./components/ExportModal";
import { ThumbnailGeneratorModal } from "./components/ThumbnailGeneratorModal";
import { BatchThumbnailExporterModal } from "./components/BatchThumbnailExporterModal";
import { BossLootCatalogModal } from "./components/BossLootCatalogModal";
import { BossWeaknessCardsModal } from "./components/BossWeaknessCardsModal";
import { ProtagonistDBModal } from "./components/ProtagonistDBModal";
import { QuestBranchTrackerModal } from "./components/QuestBranchTrackerModal";
import { NewSeriesModal } from "./components/NewSeriesModal";
import { AddEpisodeModal } from "./components/AddEpisodeModal";
import { ThemeSwitcherModal } from "./components/ThemeSwitcherModal";
import { ToastNotification, ToastData } from "./components/ToastNotification";
import {
  MilestoneCelebrationModal,
  MilestoneRecord,
  MilestonePercent,
} from "./components/MilestoneNotification";
import { CtrPredictorModal } from "./components/CtrPredictorModal";
import { ChapterManagerModal } from "./components/ChapterManagerModal";
import { SoundcheckModal } from "./components/SoundcheckModal";
import { AiPromptCrafterModal } from "./components/AiPromptCrafterModal";
import { EndScreenPlannerModal } from "./components/EndScreenPlannerModal";
import { KeyItemsTrackerModal } from "./components/KeyItemsTrackerModal";
import { ShortsClipperModal } from "./components/ShortsClipperModal";
import { ThumbnailPresetModal } from "./components/ThumbnailPresetModal";
import { BatchEpisodeEditorModal } from "./components/BatchEpisodeEditorModal";
import { PrintCheatSheetModal } from "./components/PrintCheatSheetModal";
import { RecordingTimerModal } from "./components/RecordingTimerModal";
import { MirillisActionIntegrationModal } from "./components/MirillisActionIntegrationModal";
import { YouTubeStudioUploadModal } from "./components/YouTubeStudioUploadModal";
import { BossEncounterPlannerModal } from "./components/BossEncounterPlannerModal";
import { CompletionDashboardModal } from "./components/CompletionDashboardModal";
import { GameTitleLogoModal } from "./components/GameTitleLogoModal";
import { HudOverlay } from "./components/HudOverlay";
import { AchievementToast } from "./components/AchievementToast";
import { triggerAchievement } from "./utils/achievementManager";
import { AchievementUnlockToastData } from "./types";
import { cleanHeroName, normalizeHeroName } from "./utils/gameProtagonists";
import {
  safeSetLocalStorage,
  safeGetLocalStorage,
  saveToIndexedDB,
  loadFromIndexedDB,
} from "./utils/storageUtils";
import {
  AppThemeId,
  getSavedTheme,
  saveTheme,
  applyThemeToDocument,
  THEME_CONFIGS,
} from "./utils/themeUtils";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AuthModal } from "./components/AuthModal";
import { AccountSettingsModal } from "./components/AccountSettingsModal";
import { UserDashboardHeader } from "./components/UserDashboardHeader";
import { fetchUserSeriesList, saveUserSeries, deleteUserSeries } from "./utils/seriesCloudService";

function PlaythroughStudioApp() {
  const { currentUser, userProfile, loading } = useAuth();

  const [currentTheme, setCurrentTheme] = useState<AppThemeId>(() => getSavedTheme());
  const [showThemeSwitcherModal, setShowThemeSwitcherModal] = useState<boolean>(false);
  const [showAccountSettingsModal, setShowAccountSettingsModal] = useState<boolean>(false);

  // Sync theme with userProfile preference if available
  useEffect(() => {
    if (userProfile?.theme && userProfile.theme in THEME_CONFIGS) {
      setCurrentTheme(userProfile.theme as AppThemeId);
      saveTheme(userProfile.theme as AppThemeId);
    }
  }, [userProfile?.theme]);

  useEffect(() => {
    applyThemeToDocument(currentTheme);
  }, [currentTheme]);

  const handleSelectTheme = (newTheme: AppThemeId) => {
    setCurrentTheme(newTheme);
    saveTheme(newTheme);
  };

  const [seriesList, setSeriesList] = useState<PlaythroughSeries[]>(() => {
    const saved = safeGetLocalStorage<PlaythroughSeries[]>("youtube_playthrough_series", []);
    if (!saved || saved.length === 0) {
      return defaultPlaythroughSeries;
    }
    return saved;
  });

  // Load cloud series for logged in user
  useEffect(() => {
    if (!currentUser) return;

    fetchUserSeriesList(currentUser.uid).then((cloudSeries) => {
      if (cloudSeries && cloudSeries.length > 0) {
        setSeriesList(cloudSeries);
        if (!cloudSeries.some((s) => s.id === activeSeriesId)) {
          setActiveSeriesId(cloudSeries[0].id);
        }
      }
    });
  }, [currentUser]);

  const [activeSeriesId, setActiveSeriesId] = useState<string>(() => {
    return safeGetLocalStorage<string>("youtube_active_series_id", "mafia-definitive-edition");
  });

  const [currentView, setCurrentView] = useState<"landing" | "playthrough">("landing");

  const handleSelectSeries = (id: string) => {
    setActiveSeriesId(id);
    safeSetLocalStorage("youtube_active_series_id", id);
  };

  const activeSeries = seriesList.find((s) => s.id === activeSeriesId) || seriesList[0];

  const [targetLength, setTargetLength] = useState<number>(() => userProfile?.defaultEpisodeDuration || 90);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [showExport, setShowExport] = useState<boolean>(false);
  const [showThumbnailStudio, setShowThumbnailStudio] = useState<boolean>(false);
  const [showBatchThumbnailExporter, setShowBatchThumbnailExporter] = useState<boolean>(false);
  const [showBossLootCatalog, setShowBossLootCatalog] = useState<boolean>(false);
  const [showBossWeaknessCards, setShowBossWeaknessCards] = useState<boolean>(false);
  const [showProtagonistDB, setShowProtagonistDB] = useState<boolean>(false);
  const [showQuestBranchTracker, setShowQuestBranchTracker] = useState<boolean>(false);
  const [showNewSeriesModal, setShowNewSeriesModal] = useState<boolean>(false);
  const [showAddEpisodeModal, setShowAddEpisodeModal] = useState<boolean>(false);
  const [showGameTitleLogoModal, setShowGameTitleLogoModal] = useState<boolean>(false);

  // 10 New Studio Tools Modals
  const [showCtrPredictor, setShowCtrPredictor] = useState<boolean>(false);
  const [showChapterManager, setShowChapterManager] = useState<boolean>(false);
  const [showSoundcheck, setShowSoundcheck] = useState<boolean>(false);
  const [showAiPromptCrafter, setShowAiPromptCrafter] = useState<boolean>(false);
  const [showEndScreenPlanner, setShowEndScreenPlanner] = useState<boolean>(false);
  const [showKeyItemsTracker, setShowKeyItemsTracker] = useState<boolean>(false);
  const [showShortsClipper, setShowShortsClipper] = useState<boolean>(false);
  const [showThumbnailPresetStudio, setShowThumbnailPresetStudio] = useState<boolean>(false);
  const [showBatchEpisodeEditor, setShowBatchEpisodeEditor] = useState<boolean>(false);
  const [showPrintCheatSheet, setShowPrintCheatSheet] = useState<boolean>(false);
  const [showRecordingTimer, setShowRecordingTimer] = useState<boolean>(false);
  const [recordingTimerInitialEpisode, setRecordingTimerInitialEpisode] = useState<Episode | undefined>(undefined);
  const [showMirillisActionModal, setShowMirillisActionModal] = useState<boolean>(false);
  const [showYouTubeStudioModal, setShowYouTubeStudioModal] = useState<boolean>(false);
  const [showBossEncounterPlanner, setShowBossEncounterPlanner] = useState<boolean>(false);
  const [showCompletionDashboard, setShowCompletionDashboard] = useState<boolean>(false);

  const [thumbnailEpisodeId, setThumbnailEpisodeId] = useState<number | undefined>(undefined);
  const [toast, setToast] = useState<ToastData | null>(null);
  const [achievementToast, setAchievementToast] = useState<AchievementUnlockToastData | null>(null);

  // Milestone Celebration State
  const [milestoneHistory, setMilestoneHistory] = useState<MilestoneRecord[]>(() => {
    return safeGetLocalStorage<MilestoneRecord[]>("youtube_series_milestones", []);
  });
  const [activeCelebrationMilestone, setActiveCelebrationMilestone] = useState<MilestoneRecord | null>(null);

  const isInitialMount = useRef(true);

  // Save series to IndexedDB, local storage & Cloud when changed
  useEffect(() => {
    saveToIndexedDB("youtube_playthrough_series", seriesList);
    const savedLocally = safeSetLocalStorage("youtube_playthrough_series", seriesList);

    if (currentUser) {
      // Sync active series to Firestore cloud collection
      if (activeSeries) {
        saveUserSeries(currentUser.uid, activeSeries);
      }
    }

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" });
    setToast({
      id: Date.now(),
      title: currentUser ? "Cloud & Storage Synced" : savedLocally ? "Storage Saved" : "Progress Saved (IndexedDB)",
      subtitle: `${activeSeries?.gameTitle || "Playthrough"} series progress updated`,
      timestamp: timeStr,
      type: "save",
    });
  }, [seriesList, currentUser]);

  // Current episodes & quests for active series
  const episodes = activeSeries?.episodes || [];
  const activeQuests = activeSeries?.quests || (activeSeries?.id === "ff6" ? defaultFF6Quests : []);

  const handleUpdateQuests = (updatedQuests: QuestEntry[]) => {
    setSeriesList((prevSeries) =>
      prevSeries.map((series) =>
        series.id === activeSeries.id
          ? {
              ...series,
              quests: updatedQuests,
            }
          : series
      )
    );
  };

  const handleUpdateStatus = (id: number, status: EpisodeStatus) => {
    setSeriesList((prevSeries) =>
      prevSeries.map((series) =>
        series.id === activeSeries.id
          ? {
              ...series,
              episodes: series.episodes.map((ep) =>
                ep.id === id ? { ...ep, status } : ep
              ),
            }
          : series
      )
    );
  };

  const handleUpdateEpisode = (updated: Episode) => {
    setSeriesList((prevSeries) =>
      prevSeries.map((series) => {
        if (series.id !== activeSeries.id) return series;

        const seriesWideAvatars: Record<string, string> = {};

        for (const ep of series.episodes) {
          const epAvatars = ep.id === updated.id ? (updated.heroAvatars || {}) : (ep.heroAvatars || {});
          Object.assign(seriesWideAvatars, epAvatars);
        }

        if (updated.heroAvatars) {
          const updatedNormKeys = new Set(Object.keys(updated.heroAvatars).map((k) => normalizeHeroName(k)));
          const currentEp = series.episodes.find((e) => e.id === updated.id);
          if (currentEp && currentEp.heroAvatars) {
            for (const oldKey of Object.keys(currentEp.heroAvatars)) {
              const normOldKey = normalizeHeroName(oldKey);
              if (!updatedNormKeys.has(normOldKey)) {
                for (const k of Object.keys(seriesWideAvatars)) {
                  if (normalizeHeroName(k) === normOldKey) {
                    delete seriesWideAvatars[k];
                  }
                }
              }
            }
          }
        }

        setSelectedEpisode((prev) => {
          if (!prev || prev.id !== updated.id) return updated;
          return {
            ...updated,
            heroAvatars: { ...seriesWideAvatars, ...(updated.heroAvatars || {}) },
          };
        });

        return {
          ...series,
          episodes: series.episodes.map((ep) => {
            const baseEp = ep.id === updated.id ? updated : ep;
            return {
              ...baseEp,
              heroAvatars: { ...seriesWideAvatars },
            };
          }),
        };
      })
    );
  };

  const handleApplyThumbnail = (episodeId: number, thumbnailUrl: string) => {
    setSeriesList((prevSeries) =>
      prevSeries.map((series) =>
        series.id === activeSeries.id
          ? {
              ...series,
              episodes: series.episodes.map((ep) =>
                ep.id === episodeId
                  ? { ...ep, thumbnailCustomImage: thumbnailUrl }
                  : ep
              ),
            }
          : series
      )
    );

    if (selectedEpisode && selectedEpisode.id === episodeId) {
      setSelectedEpisode((prev) => (prev ? { ...prev, thumbnailCustomImage: thumbnailUrl } : null));
    }
  };

  const handleBatchApplyThumbnails = (thumbnailsMap: Record<number, string>) => {
    setSeriesList((prevSeries) =>
      prevSeries.map((series) => {
        if (series.id !== activeSeries.id) return series;
        return {
          ...series,
          episodes: series.episodes.map((ep) => {
            if (thumbnailsMap[ep.id]) {
              return { ...ep, thumbnailCustomImage: thumbnailsMap[ep.id] };
            }
            return ep;
          }),
        };
      })
    );
  };

  const handleBatchApplyPrompts = (promptsMap: Record<number, string>) => {
    setSeriesList((prevSeries) =>
      prevSeries.map((series) => {
        if (series.id !== activeSeries.id) return series;
        return {
          ...series,
          episodes: series.episodes.map((ep) => {
            if (promptsMap[ep.id]) {
              return { ...ep, suggestedThumbnailPrompt: promptsMap[ep.id] };
            }
            return ep;
          }),
        };
      })
    );
  };

  const handleAddSeries = (newSeries: PlaythroughSeries) => {
    setSeriesList((prev) => [newSeries, ...prev]);
    setActiveSeriesId(newSeries.id);
    if (currentUser) {
      saveUserSeries(currentUser.uid, newSeries);
    }
  };

  const handleDeleteSeries = (id: string) => {
    if (seriesList.length <= 1) {
      alert("You must keep at least one playthrough series in your catalog.");
      return;
    }
    const remaining = seriesList.filter((s) => s.id !== id);
    setSeriesList(remaining);
    if (activeSeriesId === id) {
      setActiveSeriesId(remaining[0].id);
    }
    if (currentUser) {
      deleteUserSeries(currentUser.uid, id);
    }
  };

  const handleAddEpisode = (newEpisode: Episode) => {
    setSeriesList((prevSeries) =>
      prevSeries.map((series) =>
        series.id === activeSeries.id
          ? {
              ...series,
              episodes: [...series.episodes, newEpisode],
            }
          : series
      )
    );
  };

  const handleDeleteEpisode = (id: number) => {
    setSeriesList((prevSeries) =>
      prevSeries.map((series) =>
        series.id === activeSeries.id
          ? {
              ...series,
              episodes: series.episodes.filter((ep) => ep.id !== id),
            }
          : series
      )
    );
    if (selectedEpisode?.id === id) {
      setSelectedEpisode(null);
    }
  };

  const handleUpdateSeriesLogo = (seriesId: string, logoUrl: string | undefined, useTitleLogo: boolean) => {
    setSeriesList((prevSeries) =>
      prevSeries.map((s) =>
        s.id === seriesId
          ? {
              ...s,
              gameLogoUrl: logoUrl,
              useTitleLogo: useTitleLogo,
            }
          : s
      )
    );
  };

  const handleUpdateSeriesSynopsis = (seriesId: string, synopsis: string, source?: string) => {
    setSeriesList((prevSeries) =>
      prevSeries.map((s) =>
        s.id === seriesId
          ? {
              ...s,
              synopsis: synopsis,
              synopsisSource: source || s.synopsisSource,
            }
          : s
      )
    );
  };

  const handleOpenThumbnailStudio = (episodeId?: number) => {
    setThumbnailEpisodeId(episodeId);
    setShowThumbnailStudio(true);
  };

  const handleOpenRecordingTimer = (episode?: Episode) => {
    setRecordingTimerInitialEpisode(episode);
    setShowRecordingTimer(true);
  };

  const handleSetTargetLength = (len: number) => {
    setTargetLength(len);
  };

  const handleApplyBrandingToAll = (updatedEpisodes: Episode[]) => {
    setSeriesList((prevSeries) =>
      prevSeries.map((series) =>
        series.id === activeSeries.id
          ? {
              ...series,
              episodes: updatedEpisodes,
            }
          : series
      )
    );
  };

  const handleUpdatePlaythroughType = (seriesId: string, newType: string) => {
    setSeriesList((prevSeries) =>
      prevSeries.map((s) => (s.id === seriesId ? { ...s, playthroughType: newType } : s))
    );
  };

  const handleImportSeriesList = (imported: PlaythroughSeries[]) => {
    setSeriesList(imported);
    if (imported.length > 0) {
      setActiveSeriesId(imported[0].id);
      if (currentUser) {
        for (const s of imported) {
          saveUserSeries(currentUser.uid, s);
        }
      }
    }
  };

  const handleUpdateEpisodeChapters = (epId: number, chapters: any[]) => {
    setSeriesList((prevSeries) =>
      prevSeries.map((series) =>
        series.id === activeSeries.id
          ? {
              ...series,
              episodes: series.episodes.map((ep) =>
                ep.id === epId ? { ...ep, chapters } : ep
              ),
            }
          : series
      )
    );
  };

  const handleBatchUpdateEpisodes = (updatedEpisodes: Episode[]) => {
    setSeriesList((prevSeries) =>
      prevSeries.map((series) =>
        series.id === activeSeries.id
          ? {
              ...series,
              episodes: updatedEpisodes,
            }
          : series
      )
    );
  };

  const handleApplyThumbnailPreset = (epId: number, config: any) => {
    setSeriesList((prevSeries) =>
      prevSeries.map((series) =>
        series.id === activeSeries.id
          ? {
              ...series,
              episodes: series.episodes.map((ep) =>
                ep.id === epId ? { ...ep, thumbnailConfig: config } : ep
              ),
            }
          : series
      )
    );
  };

  const themeConfig = THEME_CONFIGS[currentTheme] || THEME_CONFIGS.midnight;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-xs font-semibold text-zinc-400">Loading Playthrough Studio Cloud...</p>
      </div>
    );
  }

  // Multi-user authentication check: show Login/Register if not authenticated
  if (!currentUser) {
    return <AuthModal initialMode="login" />;
  }

  const isHudMode = typeof window !== "undefined" && window.location.search.includes("hud=true");

  if (isHudMode) {
    return (
      <div className="bg-[#08080a]/90 min-h-screen">
        <HudOverlay series={activeSeries} episodes={episodes} />
      </div>
    );
  }

  return (
    <div
      className={`theme-transition min-h-screen ${themeConfig.classes.rootBg} ${themeConfig.classes.textPrimary} font-sans selection:bg-blue-500/30 selection:text-blue-200 antialiased`}
    >
      {/* Top User Multi-Account Bar */}
      <UserDashboardHeader
        seriesList={seriesList}
        onOpenSettings={() => setShowAccountSettingsModal(true)}
        onOpenNewSeries={() => setShowNewSeriesModal(true)}
      />

      {/* Header Bar */}
      <Header
        seriesList={seriesList}
        activeSeriesId={activeSeriesId}
        onSelectSeries={handleSelectSeries}
        onOpenNewSeriesModal={() => setShowNewSeriesModal(true)}
        onDeleteSeries={handleDeleteSeries}
        onUpdatePlaythroughType={handleUpdatePlaythroughType}
        onImportSeriesList={handleImportSeriesList}
        episodes={episodes}
        targetLength={targetLength}
        setTargetLength={handleSetTargetLength}
        onOpenGuide={() => setShowGuide(true)}
        onOpenExport={() => setShowExport(true)}
        onOpenThumbnailStudio={() => {
          setThumbnailEpisodeId(undefined);
          setShowThumbnailStudio(true);
        }}
        onOpenBatchThumbnailExporter={() => setShowBatchThumbnailExporter(true)}
        onOpenBossLootCatalog={() => setShowBossLootCatalog(true)}
        onOpenBossWeaknessCards={() => setShowBossWeaknessCards(true)}
        onOpenProtagonistDB={() => setShowProtagonistDB(true)}
        onOpenQuestBranchTracker={() => setShowQuestBranchTracker(true)}
        currentView={currentView}
        onToggleView={(view) => setCurrentView(view)}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
        onOpenThemeSwitcher={() => setShowThemeSwitcherModal(true)}
        milestoneHistory={milestoneHistory}
        onSelectMilestone={(m) => setActiveCelebrationMilestone(m)}
        onClearMilestoneHistory={() => {
          setMilestoneHistory([]);
          safeSetLocalStorage("youtube_series_milestones", []);
        }}
        onOpenCtrPredictor={() => setShowCtrPredictor(true)}
        onOpenChapterManager={() => setShowChapterManager(true)}
        onOpenSoundcheck={() => setShowSoundcheck(true)}
        onOpenAiPromptCrafter={() => setShowAiPromptCrafter(true)}
        onOpenEndScreenPlanner={() => setShowEndScreenPlanner(true)}
        onOpenKeyItemsTracker={() => setShowKeyItemsTracker(true)}
        onOpenShortsClipper={() => setShowShortsClipper(true)}
        onOpenThumbnailPresetStudio={() => setShowThumbnailPresetStudio(true)}
        onOpenBatchEpisodeEditor={() => setShowBatchEpisodeEditor(true)}
        onOpenPrintCheatSheet={() => setShowPrintCheatSheet(true)}
        onOpenRecordingTimer={() => handleOpenRecordingTimer()}
        onOpenMirillisActionModal={() => setShowMirillisActionModal(true)}
        onOpenYouTubeStudio={() => setShowYouTubeStudioModal(true)}
        onOpenBossEncounterPlanner={() => setShowBossEncounterPlanner(true)}
        onOpenCompletionDashboard={() => setShowCompletionDashboard(true)}
        onOpenGameLogoModal={() => setShowGameTitleLogoModal(true)}
        onUpdateSeriesLogo={handleUpdateSeriesLogo}
      />

      {/* Main View: Landing Studio Hub or Active Episode Directory */}
      <main className="pb-16">
        {currentView === "landing" ? (
          <LandingPage
            seriesList={seriesList}
            activeSeriesId={activeSeriesId}
            onSelectSeries={(id) => {
              handleSelectSeries(id);
            }}
            onOpenPlaythroughView={() => setCurrentView("playthrough")}
            onOpenNewSeriesModal={() => setShowNewSeriesModal(true)}
            onOpenGameLogoModal={() => setShowGameTitleLogoModal(true)}
            onOpenThumbnailStudio={() => {
              setThumbnailEpisodeId(undefined);
              setShowThumbnailStudio(true);
            }}
            onOpenExport={() => setShowExport(true)}
            onOpenPrintCheatSheet={() => setShowPrintCheatSheet(true)}
            onOpenBossLootCatalog={() => setShowBossLootCatalog(true)}
            onOpenQuestBranchTracker={() => setShowQuestBranchTracker(true)}
            onOpenCtrPredictor={() => setShowCtrPredictor(true)}
            onUpdateEpisodeStatus={handleUpdateStatus}
            onUpdateQuests={handleUpdateQuests}
            onUpdateSeriesSynopsis={handleUpdateSeriesSynopsis}
          />
        ) : (
          <EpisodeList
            series={activeSeries}
            episodes={episodes}
            targetLength={targetLength}
            onSelectEpisode={(ep) => setSelectedEpisode(ep)}
            onUpdateStatus={handleUpdateStatus}
            onOpenThumbnailStudio={handleOpenThumbnailStudio}
            onOpenRecordingTimer={handleOpenRecordingTimer}
            onOpenAddEpisodeModal={() => setShowAddEpisodeModal(true)}
            onOpenBossLootCatalog={() => setShowBossLootCatalog(true)}
            onOpenProtagonistDB={() => setShowProtagonistDB(true)}
            onOpenQuestBranchTracker={() => setShowQuestBranchTracker(true)}
            onUpdateQuests={handleUpdateQuests}
            onUpdateSeriesSynopsis={handleUpdateSeriesSynopsis}
          />
        )}
      </main>

      {/* Account Settings Modal */}
      <AccountSettingsModal
        isOpen={showAccountSettingsModal}
        onClose={() => setShowAccountSettingsModal(false)}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
        seriesList={seriesList}
        activeSeriesId={activeSeriesId}
        onSelectSeries={handleSelectSeries}
        onOpenPlaythroughView={() => setCurrentView("playthrough")}
        onSelectEpisode={(ep) => setSelectedEpisode(ep)}
        onOpenNewSeriesModal={() => setShowNewSeriesModal(true)}
      />

      {/* Modals & Dialogs */}
      {selectedEpisode && (
        <EpisodeDetailModal
          episode={selectedEpisode}
          seriesTitle={activeSeries?.gameTitle || "Game Series"}
          seriesId={activeSeries?.id || "default"}
          onClose={() => setSelectedEpisode(null)}
          onUpdateEpisode={handleUpdateEpisode}
          onDeleteEpisode={handleDeleteEpisode}
          onOpenThumbnailStudio={() => handleOpenThumbnailStudio(selectedEpisode.id)}
          onOpenRecordingTimer={() => handleOpenRecordingTimer(selectedEpisode)}
          allEpisodes={episodes}
          onApplyBrandingToAll={handleApplyBrandingToAll}
        />
      )}

      {showGuide && (
        <StrategyGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />
      )}

      {showExport && (
        <ExportModal
          isOpen={showExport}
          onClose={() => setShowExport(false)}
          seriesTitle={activeSeries?.gameTitle || "Game Series"}
          episodes={episodes}
        />
      )}

      {showThumbnailStudio && (
        <ThumbnailGeneratorModal
          isOpen={showThumbnailStudio}
          onClose={() => setShowThumbnailStudio(false)}
          seriesTitle={activeSeries?.gameTitle || "Game Series"}
          seriesCoverImage={activeSeries?.coverImage}
          seriesLogoUrl={activeSeries?.gameLogoUrl}
          episodes={episodes}
          initialEpisodeId={thumbnailEpisodeId}
          onApplyThumbnail={handleApplyThumbnail}
          onBatchApplyThumbnails={handleBatchApplyThumbnails}
        />
      )}

      {showBatchThumbnailExporter && (
        <BatchThumbnailExporterModal
          isOpen={showBatchThumbnailExporter}
          onClose={() => setShowBatchThumbnailExporter(false)}
          seriesTitle={activeSeries?.gameTitle || "Game Series"}
          episodes={episodes}
        />
      )}

      {showBossLootCatalog && (
        <BossLootCatalogModal
          activeSeries={activeSeries}
          onClose={() => setShowBossLootCatalog(false)}
        />
      )}

      {showBossWeaknessCards && (
        <BossWeaknessCardsModal
          isOpen={showBossWeaknessCards}
          onClose={() => setShowBossWeaknessCards(false)}
          seriesTitle={activeSeries?.gameTitle || "Game Series"}
          seriesId={activeSeries?.id || "default"}
          episodes={episodes}
        />
      )}

      {showProtagonistDB && (
        <ProtagonistDBModal
          isOpen={showProtagonistDB}
          onClose={() => setShowProtagonistDB(false)}
          seriesTitle={activeSeries?.gameTitle || "Game Series"}
        />
      )}

      {showQuestBranchTracker && (
        <QuestBranchTrackerModal
          isOpen={showQuestBranchTracker}
          onClose={() => setShowQuestBranchTracker(false)}
          seriesTitle={activeSeries?.gameTitle || "Game Series"}
          seriesId={activeSeries?.id || "default"}
          quests={activeQuests}
          onUpdateQuests={handleUpdateQuests}
        />
      )}

      {showNewSeriesModal && (
        <NewSeriesModal
          isOpen={showNewSeriesModal}
          onClose={() => setShowNewSeriesModal(false)}
          onAddSeries={handleAddSeries}
        />
      )}

      {showAddEpisodeModal && (
        <AddEpisodeModal
          isOpen={showAddEpisodeModal}
          onClose={() => setShowAddEpisodeModal(false)}
          nextPartNumber={episodes.length + 1}
          onAddEpisode={handleAddEpisode}
          seriesTitle={activeSeries?.gameTitle || "Game Series"}
          seriesId={activeSeries?.id || "default"}
        />
      )}

      {showGameTitleLogoModal && (
        <GameTitleLogoModal
          isOpen={showGameTitleLogoModal}
          onClose={() => setShowGameTitleLogoModal(false)}
          series={activeSeries}
          onUpdateSeriesLogo={handleUpdateSeriesLogo}
        />
      )}

      {showThemeSwitcherModal && (
        <ThemeSwitcherModal
          isOpen={showThemeSwitcherModal}
          onClose={() => setShowThemeSwitcherModal(false)}
          currentTheme={currentTheme}
          onSelectTheme={handleSelectTheme}
        />
      )}

      {/* 10 Advanced Tools Modals */}
      {showCtrPredictor && (
        <CtrPredictorModal
          isOpen={showCtrPredictor}
          onClose={() => setShowCtrPredictor(false)}
          episodes={episodes}
          seriesTitle={activeSeries?.gameTitle || "Game Series"}
        />
      )}

      {showChapterManager && (
        <ChapterManagerModal
          isOpen={showChapterManager}
          onClose={() => setShowChapterManager(false)}
          episodes={episodes}
          seriesTitle={activeSeries?.gameTitle || "Game Series"}
          onUpdateEpisodeChapters={handleUpdateEpisodeChapters}
        />
      )}

      {showSoundcheck && (
        <SoundcheckModal
          isOpen={showSoundcheck}
          onClose={() => setShowSoundcheck(false)}
          seriesTitle={activeSeries?.gameTitle || "Game Series"}
        />
      )}

      {showAiPromptCrafter && (
        <AiPromptCrafterModal
          isOpen={showAiPromptCrafter}
          onClose={() => setShowAiPromptCrafter(false)}
          episodes={episodes}
          seriesTitle={activeSeries?.gameTitle || "Game Series"}
          onBatchApplyPrompts={handleBatchApplyPrompts}
        />
      )}

      {showEndScreenPlanner && (
        <EndScreenPlannerModal
          isOpen={showEndScreenPlanner}
          onClose={() => setShowEndScreenPlanner(false)}
          episodes={episodes}
          seriesTitle={activeSeries?.gameTitle || "Game Series"}
        />
      )}

      {showKeyItemsTracker && (
        <KeyItemsTrackerModal
          isOpen={showKeyItemsTracker}
          onClose={() => setShowKeyItemsTracker(false)}
          seriesTitle={activeSeries?.gameTitle || "Game Series"}
          seriesId={activeSeries?.id || "default"}
        />
      )}

      {showShortsClipper && (
        <ShortsClipperModal
          isOpen={showShortsClipper}
          onClose={() => setShowShortsClipper(false)}
          episodes={episodes}
          seriesTitle={activeSeries?.gameTitle || "Game Series"}
        />
      )}

      {showThumbnailPresetStudio && (
        <ThumbnailPresetModal
          isOpen={showThumbnailPresetStudio}
          onClose={() => setShowThumbnailPresetStudio(false)}
          episodes={episodes}
          seriesTitle={activeSeries?.gameTitle || "Game Series"}
          onApplyThumbnailPreset={handleApplyThumbnailPreset}
        />
      )}

      {showBatchEpisodeEditor && (
        <BatchEpisodeEditorModal
          isOpen={showBatchEpisodeEditor}
          onClose={() => setShowBatchEpisodeEditor(false)}
          episodes={episodes}
          seriesTitle={activeSeries?.gameTitle || "Game Series"}
          onUpdateEpisodes={handleBatchUpdateEpisodes}
        />
      )}

      {showPrintCheatSheet && (
        <PrintCheatSheetModal
          isOpen={showPrintCheatSheet}
          onClose={() => setShowPrintCheatSheet(false)}
          series={activeSeries}
          episodes={episodes}
          quests={activeQuests}
        />
      )}

      {showRecordingTimer && (
        <RecordingTimerModal
          isOpen={showRecordingTimer}
          onClose={() => setShowRecordingTimer(false)}
          episodes={episodes}
          initialEpisode={recordingTimerInitialEpisode}
          onUpdateEpisodeStatus={handleUpdateStatus}
        />
      )}

      {showMirillisActionModal && (
        <MirillisActionIntegrationModal
          isOpen={showMirillisActionModal}
          onClose={() => setShowMirillisActionModal(false)}
          seriesTitle={activeSeries?.gameTitle || "Game Series"}
          episodes={episodes}
        />
      )}

      {showYouTubeStudioModal && (
        <YouTubeStudioUploadModal
          isOpen={showYouTubeStudioModal}
          onClose={() => setShowYouTubeStudioModal(false)}
          episodes={episodes}
          seriesTitle={activeSeries?.gameTitle || "Game Series"}
        />
      )}

      {showBossEncounterPlanner && (
        <BossEncounterPlannerModal
          isOpen={showBossEncounterPlanner}
          onClose={() => setShowBossEncounterPlanner(false)}
          seriesTitle={activeSeries?.gameTitle || "Game Series"}
          seriesId={activeSeries?.id || "default"}
          episodes={episodes}
        />
      )}

      {showCompletionDashboard && (
        <CompletionDashboardModal
          isOpen={showCompletionDashboard}
          onClose={() => setShowCompletionDashboard(false)}
          seriesTitle={activeSeries?.gameTitle || "Game Series"}
          seriesId={activeSeries?.id || "default"}
          episodes={episodes}
          quests={activeQuests}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <ToastNotification toast={toast} onClose={() => setToast(null)} />
      )}

      {/* Gamerscore Achievement Toast */}
      {achievementToast && (
        <AchievementToast
          toast={achievementToast}
          onClose={() => setAchievementToast(null)}
        />
      )}

      {/* Milestone Celebration Modal */}
      {activeCelebrationMilestone && (
        <MilestoneCelebrationModal
          milestoneRecord={activeCelebrationMilestone}
          onClose={() => setActiveCelebrationMilestone(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PlaythroughStudioApp />
    </AuthProvider>
  );
}
