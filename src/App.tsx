/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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

export default function App() {
  const [currentTheme, setCurrentTheme] = useState<AppThemeId>(() => getSavedTheme());
  const [showThemeSwitcherModal, setShowThemeSwitcherModal] = useState<boolean>(false);

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
    const merged = [...saved];
    defaultPlaythroughSeries.forEach((defSeries) => {
      const idx = merged.findIndex((s) => s.id === defSeries.id);
      if (idx === -1) {
        merged.unshift(defSeries);
      } else if ((defSeries.episodes?.length || 0) > (merged[idx].episodes?.length || 0)) {
        const existingAvatars: Record<string, string> = {};
        merged[idx].episodes?.forEach((ep) => {
          if (ep.heroAvatars) Object.assign(existingAvatars, ep.heroAvatars);
        });
        merged[idx] = {
          ...merged[idx],
          episodes: defSeries.episodes.map((ep) => ({
            ...ep,
            heroAvatars: { ...existingAvatars, ...(ep.heroAvatars || {}) },
          })),
          quests: defSeries.quests || merged[idx].quests,
        };
      }
    });
    return merged;
  });

  // Attempt to hydrate fuller state from IndexedDB (preserves high-res thumbnail base64 images)
  useEffect(() => {
    loadFromIndexedDB<PlaythroughSeries[]>("youtube_playthrough_series").then((idbSeries) => {
      if (idbSeries && Array.isArray(idbSeries) && idbSeries.length > 0) {
        const merged = [...idbSeries];
        defaultPlaythroughSeries.forEach((defSeries) => {
          const idx = merged.findIndex((s) => s.id === defSeries.id);
          if (idx === -1) {
            merged.unshift(defSeries);
          } else if ((defSeries.episodes?.length || 0) > (merged[idx].episodes?.length || 0)) {
            const existingAvatars: Record<string, string> = {};
            merged[idx].episodes?.forEach((ep) => {
              if (ep.heroAvatars) Object.assign(existingAvatars, ep.heroAvatars);
            });
            merged[idx] = {
              ...merged[idx],
              episodes: defSeries.episodes.map((ep) => ({
                ...ep,
                heroAvatars: { ...existingAvatars, ...(ep.heroAvatars || {}) },
              })),
              quests: defSeries.quests || merged[idx].quests,
            };
          }
        });
        setSeriesList(merged);
      }
    });
  }, []);

  const [activeSeriesId, setActiveSeriesId] = useState<string>(() => {
    return safeGetLocalStorage<string>("youtube_active_series_id", "mafia-definitive-edition");
  });

  const [currentView, setCurrentView] = useState<"landing" | "playthrough">("landing");

  const handleSelectSeries = (id: string) => {
    setActiveSeriesId(id);
    safeSetLocalStorage("youtube_active_series_id", id);
  };

  const activeSeries = seriesList.find((s) => s.id === activeSeriesId) || seriesList[0];

  const [targetLength, setTargetLength] = useState<number>(90);
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
  const [thumbnailEpisodeId, setThumbnailEpisodeId] = useState<number | undefined>(undefined);

  // 10 New Studio Tools Upgrades States
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
  const [showRecordingTimerModal, setShowRecordingTimerModal] = useState<boolean>(false);
  const [showMirillisActionModal, setShowMirillisActionModal] = useState<boolean>(false);
  const [showYouTubeStudioModal, setShowYouTubeStudioModal] = useState<boolean>(false);
  const [showBossEncounterPlanner, setShowBossEncounterPlanner] = useState<boolean>(false);
  const [showCompletionDashboard, setShowCompletionDashboard] = useState<boolean>(false);
  const [showGameTitleLogoModal, setShowGameTitleLogoModal] = useState<boolean>(false);
  const [recordingTimerEpisodeId, setRecordingTimerEpisodeId] = useState<number | null>(null);

  const handleUpdateSeriesLogo = (
    seriesId: string,
    logoUrl: string | undefined,
    useTitleLogo: boolean
  ) => {
    setSeriesList((prevSeries) =>
      prevSeries.map((s) =>
        s.id === seriesId
          ? {
              ...s,
              gameTitleLogo: logoUrl,
              useTitleLogo: useTitleLogo,
            }
          : s
      )
    );
    setToast({
      id: Date.now(),
      title: logoUrl ? "Game Title Logo Applied" : "Title Reverted to Text",
      subtitle: logoUrl
        ? "Game logo will auto-fit across Studio Landing Hub and Planner Header"
        : "Reverted to plain text game title display",
      timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      type: "save",
    });
  };

  const handleUpdateSeriesSynopsis = (
    seriesId: string,
    synopsis: string,
    source?: string
  ) => {
    setSeriesList((prevSeries) =>
      prevSeries.map((s) =>
        s.id === seriesId
          ? {
              ...s,
              gameSynopsis: synopsis,
              gameSynopsisSource: source || "AI Web Scraped via Google Search",
            }
          : s
      )
    );

    // Trigger Gamerscore & Achievement Toast for AI Web Synopsis
    triggerAchievement("lore_master", 1);

    setToast({
      id: Date.now(),
      title: "AI Game Synopsis Applied",
      subtitle: `Web-scraped plot & setting synopsis updated for active game`,
      timestamp: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
      type: "save",
    });
  };

  const handleOpenRecordingTimer = (ep?: Episode) => {
    setRecordingTimerEpisodeId(ep ? ep.id : null);
    setShowRecordingTimerModal(true);
  };

  const [toast, setToast] = useState<ToastData | null>(null);
  const isInitialMount = useRef(true);

  // Production Milestones States & Persistence
  const [milestoneHistory, setMilestoneHistory] = useState<MilestoneRecord[]>(() => {
    return safeGetLocalStorage<MilestoneRecord[]>("youtube_series_milestones", []);
  });
  const [activeCelebrationMilestone, setActiveCelebrationMilestone] = useState<MilestoneRecord | null>(null);

  // Check for newly reached production milestones (25%, 50%, 75%, 100%)
  useEffect(() => {
    if (!seriesList || seriesList.length === 0) return;

    let newRecords: MilestoneRecord[] = [];
    let latestCelebration: MilestoneRecord | null = null;

    seriesList.forEach((series) => {
      const totalCount = series.episodes?.length || 0;
      if (totalCount === 0) return;

      const completedCount = series.episodes.filter((e) => e.status !== "not_started").length;
      const pct = (completedCount / totalCount) * 100;

      const milestones: MilestonePercent[] = [25, 50, 75, 100];
      milestones.forEach((m) => {
        if (pct >= m) {
          const alreadyRecorded = milestoneHistory.some(
            (rec) => rec.seriesId === series.id && rec.milestone === m
          );

          if (!alreadyRecorded) {
            const record: MilestoneRecord = {
              id: `${series.id}_milestone_${m}_${Date.now()}`,
              seriesId: series.id,
              gameTitle: series.gameTitle,
              milestone: m,
              unlockedAt: new Date().toISOString(),
              completedCount,
              totalCount,
              viewed: false,
            };
            newRecords.push(record);
            if (series.id === activeSeriesId) {
              latestCelebration = record;
            } else if (!latestCelebration) {
              latestCelebration = record;
            }
          }
        }
      });
    });

    if (newRecords.length > 0) {
      setMilestoneHistory((prev) => {
        const updated = [...newRecords, ...prev];
        safeSetLocalStorage("youtube_series_milestones", updated);
        return updated;
      });

      if (!isInitialMount.current && latestCelebration) {
        setActiveCelebrationMilestone(latestCelebration);
        const timeStr = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
        setToast({
          id: Date.now(),
          title: `🏆 ${(latestCelebration as MilestoneRecord).milestone}% Milestone Reached!`,
          subtitle: `${(latestCelebration as MilestoneRecord).gameTitle}: ${(latestCelebration as MilestoneRecord).completedCount} of ${(latestCelebration as MilestoneRecord).totalCount} episodes completed!`,
          timestamp: timeStr,
          type: "success",
        });
      }
    }
  }, [seriesList, activeSeriesId]);

  // Save series to IndexedDB & local storage when changed
  useEffect(() => {
    // 1. Asynchronously save full state to IndexedDB (handles large base64 image data)
    saveToIndexedDB("youtube_playthrough_series", seriesList);

    // 2. Save state (with automatic quota fallback) to localStorage
    const savedLocally = safeSetLocalStorage("youtube_playthrough_series", seriesList);

    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" });
    setToast({
      id: Date.now(),
      title: savedLocally ? "Storage Saved" : "Progress Saved (IndexedDB)",
      subtitle: `${activeSeries?.gameTitle || "Playthrough"} series progress updated`,
      timestamp: timeStr,
      type: "save",
    });
  }, [seriesList]);

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

  // Update status handler for active series
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

  // Update episode content handler
  const handleUpdateEpisode = (updated: Episode) => {
    setSeriesList((prevSeries) =>
      prevSeries.map((series) => {
        if (series.id !== activeSeries.id) return series;

        // 1. Gather series-wide heroAvatars across all episodes
        const seriesWideAvatars: Record<string, string> = {};

        for (const ep of series.episodes) {
          const epAvatars = ep.id === updated.id ? (updated.heroAvatars || {}) : (ep.heroAvatars || {});
          Object.assign(seriesWideAvatars, epAvatars);
        }

        // Purge any avatars from seriesWideAvatars if removed in updated.heroAvatars
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

        // Update selectedEpisode with merged seriesWideAvatars
        setSelectedEpisode((prev) => {
          if (!prev || prev.id !== updated.id) return updated;
          return {
            ...updated,
            heroAvatars: { ...seriesWideAvatars, ...(updated.heroAvatars || {}) },
          };
        });

        // 2. Assign merged seriesWideAvatars to all episodes
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

  // Save generated thumbnail to an episode
  const handleApplyThumbnail = (episodeId: number, thumbnailUrl: string) => {
    setSeriesList((prevSeries) =>
      prevSeries.map((series) =>
        series.id === activeSeries.id
          ? {
              ...series,
              episodes: series.episodes.map((ep) =>
                ep.id === episodeId
                  ? {
                      ...ep,
                      suggestedThumbnailPrompt: thumbnailUrl,
                      thumbnailConfig: {
                        ...ep.thumbnailConfig,
                        customImage: thumbnailUrl,
                      },
                    }
                  : ep
              ),
            }
          : series
      )
    );
  };

  // Add new series handler
  const handleAddSeries = (newSeries: PlaythroughSeries) => {
    setSeriesList((prev) => [newSeries, ...prev]);
    setActiveSeriesId(newSeries.id);
  };

  // Delete playthrough series handler
  const handleDeleteSeries = (idToDelete: string) => {
    const remaining = seriesList.filter((s) => s.id !== idToDelete);
    if (remaining.length > 0) {
      setActiveSeriesId(remaining[0].id);
      setSeriesList(remaining);
    } else {
      setSeriesList(defaultPlaythroughSeries);
      setActiveSeriesId(defaultPlaythroughSeries[0].id);
    }
  };

  // Add new episode handler
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

  // Duplicate episode handler
  const handleDuplicateEpisode = (episodeToDuplicate: Episode) => {
    const maxPart = Math.max(...episodes.map((e) => e.partNumber), 0);
    const nextPartNumber = maxPart > 0 ? maxPart + 1 : episodeToDuplicate.partNumber + 1;
    const clonedEpisode: Episode = {
      ...episodeToDuplicate,
      id: Date.now(),
      partNumber: nextPartNumber,
      title: episodeToDuplicate.title.includes("#")
        ? episodeToDuplicate.title.replace(/#\d+/, `#${nextPartNumber < 10 ? "0" + nextPartNumber : nextPartNumber}`)
        : `${episodeToDuplicate.title} (Part ${nextPartNumber})`,
      shortTitle: `${episodeToDuplicate.shortTitle.split("(Part")[0].trim()} (Part ${nextPartNumber})`,
      status: "not_started",
    };

    setSeriesList((prevSeries) =>
      prevSeries.map((series) =>
        series.id === activeSeries.id
          ? {
              ...series,
              episodes: [...series.episodes, clonedEpisode],
            }
          : series
      )
    );
  };

  // Delete single episode handler
  const handleDeleteEpisode = (episodeIdToDelete: number) => {
    setSeriesList((prevSeries) =>
      prevSeries.map((series) =>
        series.id === activeSeries.id
          ? {
              ...series,
              episodes: series.episodes.filter((ep) => ep.id !== episodeIdToDelete),
            }
          : series
      )
    );
  };

  // Handle target length switch - adjusts display estimates dynamically
  const handleSetTargetLength = (length: number) => {
    setTargetLength(length);
    setSeriesList((prevSeries) =>
      prevSeries.map((series) =>
        series.id === activeSeries.id
          ? {
              ...series,
              episodes: series.episodes.map((ep) => {
                const factor = length / 90;
                const adjustedMins = Math.round(
                  ep.estDurationMinutes * (factor > 1.2 ? 1.15 : factor < 0.8 ? 0.85 : 1)
                );
                return {
                  ...ep,
                  estDurationMinutes: adjustedMins,
                };
              }),
            }
          : series
      )
    );
  };

  // Apply branding changes to all episodes in active series
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

  // Update playthrough type handler
  const handleUpdatePlaythroughType = (seriesId: string, newType: string) => {
    setSeriesList((prevSeries) =>
      prevSeries.map((s) => (s.id === seriesId ? { ...s, playthroughType: newType } : s))
    );
  };

  // Import / restore series list handler
  const handleImportSeriesList = (imported: PlaythroughSeries[]) => {
    setSeriesList(imported);
    if (imported.length > 0) {
      setActiveSeriesId(imported[0].id);
    }
  };

  // Update active series accent color handler
  const handleUpdateSeriesAccentColor = (newColor: string) => {
    setSeriesList((prevSeries) =>
      prevSeries.map((s) => (s.id === activeSeries.id ? { ...s, accentColor: newColor } : s))
    );
  };

  // 10 New Studio Tools Handlers
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
            episodes={episodes}
            gameTitle={activeSeries.gameTitle}
            activeSeries={activeSeries}
            onSelectEpisode={(ep) => setSelectedEpisode(ep)}
            onUpdateStatus={handleUpdateStatus}
            onOpenAddEpisode={() => setShowAddEpisodeModal(true)}
            onDuplicateEpisode={handleDuplicateEpisode}
            onDeleteEpisode={handleDeleteEpisode}
            onOpenRecordingTimer={(ep) => handleOpenRecordingTimer(ep)}
            onOpenYouTubeStudio={() => setShowYouTubeStudioModal(true)}
            onUpdateSeriesSynopsis={handleUpdateSeriesSynopsis}
          />
        )}
      </main>

      {/* Episode Detail & YouTube Studio Modal */}
      {selectedEpisode && (
        <EpisodeDetailModal
          episode={selectedEpisode}
          activeSeries={activeSeries}
          onClose={() => setSelectedEpisode(null)}
          onUpdateEpisode={handleUpdateEpisode}
        />
      )}

      {/* Strategy & SEO Guide Modal */}
      {showGuide && (
        <StrategyGuide
          onClose={() => setShowGuide(false)}
          activeSeries={activeSeries}
          episodes={episodes}
          onBatchUpdateEpisodes={handleBatchUpdateEpisodes}
          onUpdateEpisode={handleUpdateEpisode}
        />
      )}

      {/* Playlist Export Modal */}
      {showExport && (
        <ExportModal
          episodes={episodes}
          onClose={() => setShowExport(false)}
          onOpenPrintCheatSheet={() => setShowPrintCheatSheet(true)}
        />
      )}

      {/* Print / PDF Playthrough Cheat Sheet Modal */}
      {showPrintCheatSheet && (
        <PrintCheatSheetModal
          series={activeSeries}
          episodes={episodes}
          onClose={() => setShowPrintCheatSheet(false)}
        />
      )}

      {/* Live Playthrough Recording Session Timer Modal */}
      <RecordingTimerModal
        isOpen={showRecordingTimerModal}
        onClose={() => setShowRecordingTimerModal(false)}
        activeSeries={activeSeries}
        episodes={episodes}
        onUpdateEpisode={handleUpdateEpisode}
        onUpdateStatus={handleUpdateStatus}
        initialEpisodeId={recordingTimerEpisodeId}
        onOpenMirillisActionModal={() => setShowMirillisActionModal(true)}
      />

      {/* Mirillis Action! Studio Integration Modal */}
      <MirillisActionIntegrationModal
        isOpen={showMirillisActionModal}
        onClose={() => setShowMirillisActionModal(false)}
        activeSeries={activeSeries}
        episodes={episodes}
      />

      {/* YouTube Thumbnail Studio Modal */}
      {showThumbnailStudio && (
        <ThumbnailGeneratorModal
          episodes={episodes}
          activeSeries={activeSeries}
          defaultEpisodeId={thumbnailEpisodeId}
          onClose={() => setShowThumbnailStudio(false)}
          onApplyThumbnail={handleApplyThumbnail}
        />
      )}

      {/* Batch Thumbnail Exporter & Custom Branding Presets Modal */}
      {showBatchThumbnailExporter && (
        <BatchThumbnailExporterModal
          episodes={episodes}
          activeSeries={activeSeries}
          onClose={() => setShowBatchThumbnailExporter(false)}
          onApplyBrandingToAll={handleApplyBrandingToAll}
        />
      )}

      {/* 100% Completion Boss & Loot Catalog Modal */}
      {showBossLootCatalog && (
        <BossLootCatalogModal
          activeSeries={activeSeries}
          onClose={() => setShowBossLootCatalog(false)}
        />
      )}

      {/* Quick Boss Weakness Cards Modal */}
      {showBossWeaknessCards && (
        <BossWeaknessCardsModal
          activeSeries={activeSeries}
          onClose={() => setShowBossWeaknessCards(false)}
        />
      )}

      {/* Character & Protagonist Database Modal */}
      {showProtagonistDB && (
        <ProtagonistDBModal
          onClose={() => setShowProtagonistDB(false)}
        />
      )}

      {/* Side Quest & Main Story Branching Tracker Modal */}
      {showQuestBranchTracker && (
        <QuestBranchTrackerModal
          gameTitle={activeSeries.gameTitle}
          episodes={episodes}
          quests={activeQuests}
          onUpdateQuests={handleUpdateQuests}
          onClose={() => setShowQuestBranchTracker(false)}
        />
      )}

      {/* 10 Studio Tools Upgrades Modals */}
      <CtrPredictorModal
        isOpen={showCtrPredictor}
        onClose={() => setShowCtrPredictor(false)}
        episodes={episodes}
        selectedEpisode={selectedEpisode}
      />

      <ChapterManagerModal
        isOpen={showChapterManager}
        onClose={() => setShowChapterManager(false)}
        episodes={episodes}
        onUpdateEpisodeChapters={handleUpdateEpisodeChapters}
      />

      <SoundcheckModal
        isOpen={showSoundcheck}
        onClose={() => setShowSoundcheck(false)}
      />

      <AiPromptCrafterModal
        isOpen={showAiPromptCrafter}
        onClose={() => setShowAiPromptCrafter(false)}
        episodes={episodes}
        selectedEpisode={selectedEpisode}
      />

      <EndScreenPlannerModal
        isOpen={showEndScreenPlanner}
        onClose={() => setShowEndScreenPlanner(false)}
        episodes={episodes}
        selectedEpisode={selectedEpisode}
      />

      <KeyItemsTrackerModal
        isOpen={showKeyItemsTracker}
        onClose={() => setShowKeyItemsTracker(false)}
        series={activeSeries}
      />

      <ShortsClipperModal
        isOpen={showShortsClipper}
        onClose={() => setShowShortsClipper(false)}
        episodes={episodes}
        selectedEpisode={selectedEpisode}
      />

      <ThumbnailPresetModal
        isOpen={showThumbnailPresetStudio}
        onClose={() => setShowThumbnailPresetStudio(false)}
        selectedEpisode={selectedEpisode || episodes[0]}
        onApplyPreset={handleApplyThumbnailPreset}
      />

      <BatchEpisodeEditorModal
        isOpen={showBatchEpisodeEditor}
        onClose={() => setShowBatchEpisodeEditor(false)}
        episodes={episodes}
        onBatchUpdateEpisodes={handleBatchUpdateEpisodes}
      />

      <YouTubeStudioUploadModal
        isOpen={showYouTubeStudioModal}
        onClose={() => setShowYouTubeStudioModal(false)}
        series={activeSeries}
        episodes={episodes}
        onUpdateEpisodeStatus={handleUpdateStatus}
        onUpdateEpisode={handleUpdateEpisode}
        onBatchUpdateEpisodes={handleBatchUpdateEpisodes}
        onOpenThumbnailStudio={(epId) => {
          setThumbnailEpisodeId(epId);
          setShowThumbnailStudio(true);
        }}
      />

      {/* Feature 2: Boss Encounter & Retry Tactics Planner Modal */}
      {showBossEncounterPlanner && (
        <BossEncounterPlannerModal
          activeSeries={activeSeries}
          onClose={() => setShowBossEncounterPlanner(false)}
        />
      )}

      {/* Feature 5: Series Progress & 100% Completion Dashboard Modal */}
      {showCompletionDashboard && (
        <CompletionDashboardModal
          activeSeries={activeSeries}
          episodes={episodes}
          quests={activeQuests}
          onClose={() => setShowCompletionDashboard(false)}
        />
      )}

      {/* Theme & Palette Switcher Modal */}
      {showThemeSwitcherModal && (
        <ThemeSwitcherModal
          currentTheme={currentTheme}
          onSelectTheme={handleSelectTheme}
          activeSeries={activeSeries}
          onUpdateSeriesAccentColor={handleUpdateSeriesAccentColor}
          onClose={() => setShowThemeSwitcherModal(false)}
        />
      )}

      {/* New Playthrough Series Modal */}
      {showNewSeriesModal && (
        <NewSeriesModal
          onClose={() => setShowNewSeriesModal(false)}
          onAddSeries={handleAddSeries}
        />
      )}

      {/* Add New Episode Modal */}
      {showAddEpisodeModal && (
        <AddEpisodeModal
          currentEpisodesCount={episodes.length}
          gameTitle={activeSeries.gameTitle}
          episodes={episodes}
          onClose={() => setShowAddEpisodeModal(false)}
          onAddEpisode={handleAddEpisode}
        />
      )}

      {/* Milestone Celebration Pop-up Modal */}
      <MilestoneCelebrationModal
        isOpen={!!activeCelebrationMilestone}
        milestone={activeCelebrationMilestone}
        series={activeSeries}
        episodes={episodes}
        onClose={() => {
          if (activeCelebrationMilestone) {
            setMilestoneHistory((prev) => {
              const updated = prev.map((m) =>
                m.id === activeCelebrationMilestone.id ? { ...m, viewed: true } : m
              );
              safeSetLocalStorage("youtube_series_milestones", updated);
              return updated;
            });
          }
          setActiveCelebrationMilestone(null);
        }}
        onOpenExport={() => setShowExport(true)}
      />

      {/* Game Title Logo Settings Modal */}
      <GameTitleLogoModal
        isOpen={showGameTitleLogoModal}
        onClose={() => setShowGameTitleLogoModal(false)}
        seriesList={seriesList}
        activeSeriesId={activeSeriesId}
        onUpdateSeriesLogo={handleUpdateSeriesLogo}
      />

      {/* Subtle Toast Notification */}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#070708] py-8 px-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="font-semibold text-zinc-400">
            {activeSeries.gameTitle} • YouTube Let's Play Studio & Playlist Planner
          </p>
          <p>Designed for content creators & YouTube Gaming channels. High-CTR thumbnails, chapter timestamps & batch export.</p>
        </div>
      </footer>
    </div>
  );
}

