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
import { MissableItemsLockoutsModal } from "./components/MissableItemsLockoutsModal";
import { GameTitleLogoModal } from "./components/GameTitleLogoModal";
import { HudOverlay } from "./components/HudOverlay";
import { AchievementToast } from "./components/AchievementToast";
import { triggerAchievement } from "./utils/achievementManager";
import { AchievementUnlockToastData } from "./types";
import { cleanHeroName, normalizeHeroName } from "./utils/gameProtagonists";
import { TopStudioLogoBanner } from "./components/TopStudioLogoBanner";
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
import { SubscriptionProvider, useSubscription } from "./context/SubscriptionContext";
import { AdminProvider, useAdmin } from "./context/AdminContext";
import { SubscriptionModal } from "./components/SubscriptionModal";
import { AboutModal } from "./components/AboutModal";
import { ContactUsModal } from "./components/ContactUsModal";
import { Footer } from "./components/Footer";
import { DemoBanner } from "./components/DemoBanner";
import { AuthModal } from "./components/AuthModal";
import { AccountSettingsModal } from "./components/AccountSettingsModal";
import { AdminDashboardView } from "./components/AdminDashboardView";
import { AdminControlModal } from "./components/AdminControlModal";
import { UserDashboardHeader } from "./components/UserDashboardHeader";
import { fetchUserSeriesList, saveUserSeries, deleteUserSeries } from "./utils/seriesCloudService";
import { findSynopsisInDb } from "./utils/gameSynopsisDb";

function PlaythroughStudioApp() {
  const { currentUser, userProfile, loading } = useAuth();
  const { entitlement, requireEntitlement } = useSubscription();
  const { siteSettings, isAdmin } = useAdmin();

  const [currentTheme, setCurrentTheme] = useState<AppThemeId>(() => getSavedTheme());
  const [showThemeSwitcherModal, setShowThemeSwitcherModal] = useState<boolean>(false);
  const [showAccountSettingsModal, setShowAccountSettingsModal] = useState<boolean>(false);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [accountSettingsTab, setAccountSettingsTab] = useState<
    "overview" | "achievements" | "subscription" | "profile" | "preferences"
  >("overview");

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
    let baseList = Array.isArray(saved) && saved.length > 0 ? saved : defaultPlaythroughSeries;
    if (Array.isArray(saved) && saved.length > 0) {
      // Intelligent merge: ensure all curated default series (like Bloodborne) are available
      const existingIds = new Set(saved.filter(Boolean).map((s) => s.id));
      const missingDefaults = defaultPlaythroughSeries.filter((ds) => !existingIds.has(ds.id));
      if (missingDefaults.length > 0) {
        baseList = [...saved, ...missingDefaults];
      }
    }

    // Auto-fill any missing synopses and ensure missableAlerts from curated series are merged
    const enrichedList = (baseList || []).filter(Boolean).map((s) => {
      const defaultMatch = defaultPlaythroughSeries.find((ds) => ds.id === s.id);
      let mergedEpisodes = Array.isArray(s.episodes) ? s.episodes : [];
      if (defaultMatch && Array.isArray(defaultMatch.episodes) && Array.isArray(s.episodes)) {
        mergedEpisodes = s.episodes.map((ep) => {
          if (!ep) return ep;
          const defEp = (defaultMatch.episodes || []).find(
            (de) => de && (de.id === ep.id || de.partNumber === ep.partNumber)
          );
          if (
            defEp &&
            (!ep.missableAlerts || ep.missableAlerts.length === 0) &&
            defEp.missableAlerts &&
            defEp.missableAlerts.length > 0
          ) {
            return {
              ...ep,
              missableAlerts: defEp.missableAlerts,
            };
          }
          return ep;
        });
      }

      // Check if logo is a default built-in SVG preset or custom user upload
      const isDefaultPresetSvg = defaultPlaythroughSeries.some(
        (ds) => ds.gameTitleLogo && ds.gameTitleLogo === s.gameTitleLogo
      );
      const isCustomUserLogo = Boolean(s.gameTitleLogo && !isDefaultPresetSvg);
      const finalUseTitleLogo = isCustomUserLogo ? (s.useTitleLogo ?? true) : (s.useTitleLogo === true && !isDefaultPresetSvg ? true : false);

      let updatedSeries = {
        ...s,
        useTitleLogo: finalUseTitleLogo,
        episodes: mergedEpisodes,
      };

      if (!updatedSeries.gameSynopsis) {
        const dbMatch = findSynopsisInDb(updatedSeries.gameTitle);
        if (dbMatch) {
          updatedSeries = {
            ...updatedSeries,
            gameSynopsis: dbMatch.synopsis,
            gameSynopsisSource: dbMatch.sourceFile ? `DB Library (${dbMatch.sourceFile})` : "Official DB Library",
            synopsis: dbMatch.synopsis,
            synopsisSource: dbMatch.sourceFile ? `DB Library (${dbMatch.sourceFile})` : "Official DB Library",
          };
        }
      }
      return updatedSeries;
    });

    safeSetLocalStorage("youtube_playthrough_series", enrichedList);
    return enrichedList;
  });

  // Load cloud series for logged in user
  useEffect(() => {
    if (!currentUser) return;

    fetchUserSeriesList(currentUser.uid)
      .then((cloudSeries) => {
        if (Array.isArray(cloudSeries) && cloudSeries.length > 0) {
          // Merge missing defaults with cloud series as well
          const existingIds = new Set(cloudSeries.filter(Boolean).map((s) => s.id));
          const missingDefaults = defaultPlaythroughSeries.filter((ds) => !existingIds.has(ds.id));
          const fullList = missingDefaults.length > 0 ? [...cloudSeries, ...missingDefaults] : cloudSeries;
          setSeriesList(fullList);
          if (!fullList.some((s) => s?.id === activeSeriesId)) {
            setActiveSeriesId(fullList[0].id);
          }
        }
      })
      .catch((err) => {
        console.warn("Failed to load cloud series, using local cache:", err);
      });
  }, [currentUser]);

  const [activeSeriesId, setActiveSeriesId] = useState<string>(() => {
    const savedId = safeGetLocalStorage<string>("youtube_active_series_id", "");
    if (savedId) return savedId;
    return "bloodborne";
  });

  const [currentView, setCurrentView] = useState<"landing" | "playthrough" | "admin">("landing");

  // Security guard: If non-admin somehow ends up in admin view, revert to landing
  useEffect(() => {
    if (currentView === "admin" && !isAdmin) {
      setCurrentView("landing");
    }
  }, [currentView, isAdmin]);

  const handleSelectSeries = (id: string) => {
    setActiveSeriesId(id);
    safeSetLocalStorage("youtube_active_series_id", id);
  };

  const activeSeries = (seriesList || []).find((s) => s?.id === activeSeriesId) || seriesList?.[0] || defaultPlaythroughSeries[0];

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
  const [showMissablesLockoutsModal, setShowMissablesLockoutsModal] = useState<boolean>(false);
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);
  const [showContactUsModal, setShowContactUsModal] = useState<boolean>(false);

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
              episodes: (series.episodes || []).map((ep) =>
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

        for (const ep of series.episodes || []) {
          const epAvatars = ep.id === updated.id ? (updated.heroAvatars || {}) : (ep.heroAvatars || {});
          Object.assign(seriesWideAvatars, epAvatars);
        }

        if (updated.heroAvatars) {
          const updatedNormKeys = new Set(Object.keys(updated.heroAvatars).map((k) => normalizeHeroName(k)));
          const currentEp = (series.episodes || []).find((e) => e?.id === updated.id);
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
          episodes: (series.episodes || []).map((ep) => {
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
              episodes: (series.episodes || []).map((ep) =>
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
          episodes: (series.episodes || []).map((ep) => {
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
          episodes: (series.episodes || []).map((ep) => {
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
    if (!requireEntitlement("canCreateSeries", "Create New Playthrough Series")) {
      return;
    }
    setSeriesList((prev) => [newSeries, ...prev]);
    setActiveSeriesId(newSeries.id);
    if (currentUser) {
      saveUserSeries(currentUser.uid, newSeries);
    }
  };

  const handleDeleteSeries = (id: string) => {
    if (!requireEntitlement("canEditSeries", "Delete Playthrough Series")) {
      return;
    }
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
    if (!requireEntitlement("canEditSeries", "Add New Episode")) {
      return;
    }
    setSeriesList((prevSeries) =>
      prevSeries.map((series) =>
        series.id === activeSeries.id
          ? {
              ...series,
              episodes: [...(series.episodes || []), newEpisode],
            }
          : series
      )
    );
  };

  const handleDuplicateEpisode = (episode: Episode) => {
    const currentEps = activeSeries.episodes || [];
    const maxPart = currentEps.reduce((max, ep) => Math.max(max, ep.partNumber), 0);
    const newEpisode: Episode = {
      ...episode,
      id: Date.now(),
      partNumber: maxPart + 1,
      title: `${episode.title} (Copy)`,
      shortTitle: `${episode.shortTitle || episode.title} (Copy)`,
      status: "not_started",
      videoStats: undefined,
    };
    setSeriesList((prevSeries) =>
      prevSeries.map((series) =>
        series.id === activeSeries.id
          ? {
              ...series,
              episodes: [...(series.episodes || []), newEpisode],
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
              episodes: (series.episodes || []).filter((ep) => ep.id !== id),
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
              gameTitleLogo: logoUrl,
              gameLogoUrl: logoUrl,
              useTitleLogo: useTitleLogo,
            }
          : s
      )
    );
  };

  const handleUpdateSeriesSynopsis = (seriesId: string, synopsis: string, source?: string) => {
    setSeriesList((prevSeries) => {
      const updated = prevSeries.map((s) =>
        s.id === seriesId
          ? {
              ...s,
              gameSynopsis: synopsis,
              gameSynopsisSource: source || s.gameSynopsisSource || "Official DB Library",
              synopsis: synopsis,
              synopsisSource: source || s.synopsisSource || "Official DB Library",
            }
          : s
      );
      safeSetLocalStorage("youtube_playthrough_series", updated);
      
      if (currentUser) {
        const updatedSeries = updated.find((s) => s.id === seriesId);
        if (updatedSeries) {
          saveUserSeries(currentUser.uid, updatedSeries).catch((err) =>
            console.warn("Failed to sync updated synopsis to cloud:", err)
          );
        }
      }
      return updated;
    });
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
              episodes: (series.episodes || []).map((ep) =>
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
              episodes: (series.episodes || []).map((ep) =>
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
        <p className="text-xs font-semibold text-zinc-400">Loading Digital Play Grid Cloud...</p>
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
      {/* Studio Logo Banner at the very top of the page on its own row above everything else */}
      <TopStudioLogoBanner />

      {/* Global Admin Announcement Banner (if enabled in Admin Center) */}
      {siteSettings?.announcementBanner?.enabled && (
        <div
          className={`py-2 px-4 text-center text-xs font-bold transition-all border-b shadow-md flex items-center justify-center gap-2 ${
            siteSettings.announcementBanner.variant === "emerald"
              ? "bg-emerald-950/90 text-emerald-200 border-emerald-500/40"
              : siteSettings.announcementBanner.variant === "blue"
              ? "bg-blue-950/90 text-blue-200 border-blue-500/40"
              : siteSettings.announcementBanner.variant === "rose"
              ? "bg-rose-950/90 text-rose-200 border-rose-500/40"
              : siteSettings.announcementBanner.variant === "purple"
              ? "bg-purple-950/90 text-purple-200 border-purple-500/40"
              : "bg-amber-950/90 text-amber-200 border-amber-500/40"
          }`}
        >
          <span>{siteSettings.announcementBanner.text}</span>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setShowAdminModal(true)}
              className="ml-2 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] uppercase font-mono tracking-wider border border-white/20 cursor-pointer"
            >
              Edit in Admin
            </button>
          )}
        </div>
      )}

      {/* Demonstration / Subscription Tier Status Banner */}
      <DemoBanner />

      {/* Top User Multi-Account Bar */}
      <UserDashboardHeader
        seriesList={seriesList}
        onOpenSettings={(tab) => {
          const validTab =
            typeof tab === "string" && ["overview", "achievements", "subscription", "profile", "preferences"].includes(tab)
              ? (tab as "overview" | "achievements" | "subscription" | "profile" | "preferences")
              : "overview";
          setAccountSettingsTab(validTab);
          setShowAccountSettingsModal(true);
        }}
        onOpenNewSeries={() => setShowNewSeriesModal(true)}
        onOpenAdmin={() => setShowAdminModal(true)}
        onOpenAbout={() => setShowAboutModal(true)}
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
        onOpenAbout={() => setShowAboutModal(true)}
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
        onOpenMissablesLockoutsModal={() => setShowMissablesLockoutsModal(true)}
        onOpenGameLogoModal={() => setShowGameTitleLogoModal(true)}
        onUpdateSeriesLogo={handleUpdateSeriesLogo}
        onOpenAccountSettings={() => setShowAccountSettingsModal(true)}
      />

      {/* Main View: Landing Studio Hub, Active Episode Directory, or Admin Dashboard */}
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
            onOpenAbout={() => setShowAboutModal(true)}
          />
        ) : currentView === "admin" && isAdmin ? (
          <AdminDashboardView
            onNavigateToHub={() => setCurrentView("landing")}
            onNavigateToPlanner={() => setCurrentView("playthrough")}
            onOpenNewSeriesModal={() => setShowNewSeriesModal(true)}
          />
        ) : (
          <EpisodeList
            series={activeSeries}
            episodes={episodes}
            targetLength={targetLength}
            onSelectEpisode={(ep) => setSelectedEpisode(ep)}
            onUpdateStatus={handleUpdateStatus}
            onDuplicateEpisode={handleDuplicateEpisode}
            onDeleteEpisode={handleDeleteEpisode}
            onOpenThumbnailStudio={handleOpenThumbnailStudio}
            onOpenRecordingTimer={handleOpenRecordingTimer}
            onOpenYouTubeStudio={(episodeId) => {
              if (episodeId) {
                const ep = episodes.find((e) => e.id === episodeId);
                if (ep) setSelectedEpisode(ep);
              }
              setShowYouTubeStudioModal(true);
            }}
            onOpenAddEpisodeModal={() => setShowAddEpisodeModal(true)}
            onOpenBossLootCatalog={() => setShowBossLootCatalog(true)}
            onOpenProtagonistDB={() => setShowProtagonistDB(true)}
            onOpenQuestBranchTracker={() => setShowQuestBranchTracker(true)}
            onUpdateQuests={handleUpdateQuests}
            onUpdateSeriesSynopsis={handleUpdateSeriesSynopsis}
            onOpenPrintCheatSheet={() => setShowPrintCheatSheet(true)}
          />
        )}
      </main>

      {/* Page Footer with Direct Contact Us Portal */}
      <Footer
        onOpenContactUs={() => setShowContactUsModal(true)}
        onOpenAbout={() => setShowAboutModal(true)}
        onOpenGuide={() => setShowGuide(true)}
      />

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
        initialTab={accountSettingsTab}
        onOpenAdminPortal={() => setShowAdminModal(true)}
      />

      {/* Admin Control Portal Modal */}
      <AdminControlModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
      />

      {/* Modals & Dialogs */}
      {selectedEpisode && (
        <EpisodeDetailModal
          episode={selectedEpisode}
          activeSeries={activeSeries}
          seriesTitle={activeSeries?.gameTitle || "Game Series"}
          seriesId={activeSeries?.id || "default"}
          onClose={() => setSelectedEpisode(null)}
          onUpdateEpisode={handleUpdateEpisode}
          onDeleteEpisode={handleDeleteEpisode}
          onOpenThumbnailStudio={() => handleOpenThumbnailStudio(selectedEpisode.id)}
          onOpenRecordingTimer={() => handleOpenRecordingTimer(selectedEpisode)}
          allEpisodes={episodes}
          onApplyBrandingToAll={handleApplyBrandingToAll}
          onOpenMissablesHub={() => setShowMissablesLockoutsModal(true)}
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
          seriesLogoUrl={activeSeries?.gameTitleLogo || activeSeries?.gameLogoUrl}
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
          seriesList={seriesList}
          activeSeriesId={activeSeriesId}
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

      {showMissablesLockoutsModal && (
        <MissableItemsLockoutsModal
          isOpen={showMissablesLockoutsModal}
          onClose={() => setShowMissablesLockoutsModal(false)}
          activeSeries={activeSeries}
          series={activeSeries}
          episodes={episodes}
          onUpdateEpisode={handleUpdateEpisode}
          onUpdateEpisodes={handleBatchUpdateEpisodes}
          onBatchUpdateEpisodes={handleBatchUpdateEpisodes}
          onOpenEpisodeDetail={(ep) => setSelectedEpisode(ep)}
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

      {/* Global Subscription & Tier Checkout Modal */}
      <SubscriptionModal />

      {/* Digital Play Grid About Modal */}
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
        onOpenContactUs={() => setShowContactUsModal(true)}
      />

      {/* Digital Play Grid Contact Us Form Modal */}
      <ContactUsModal
        isOpen={showContactUsModal}
        onClose={() => setShowContactUsModal(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <AdminProvider>
          <PlaythroughStudioApp />
        </AdminProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}
