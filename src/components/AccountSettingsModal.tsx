import React, { useState, useEffect } from "react";
import {
  User,
  Settings,
  X,
  Sparkles,
  Camera,
  Check,
  Palette,
  Clock,
  Tv,
  Save,
  LogOut,
  ShieldCheck,
  Database,
  RefreshCw,
  Sliders,
  Trophy,
  Gamepad2,
  Play,
  Film,
  Flame,
  Volume2,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Youtube,
  Layers,
  HardDrive,
  CheckCircle2,
  FolderGit2,
  CircleDot,
  Radio,
  Lock,
  Plus
} from "lucide-react";
import { useAuth, UserProfile } from "../context/AuthContext";
import { AppThemeId, THEME_CONFIGS } from "../utils/themeUtils";
import { PlaythroughSeries, Episode, Achievement } from "../types";
import { DEFAULT_CREATOR_AVATARS, CreatorAvatarPreset } from "../data/defaultAvatars";
import {
  loadAchievements,
  calculateGamerscore,
  playAchievementUnlockSound,
} from "../utils/achievementManager";

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: AppThemeId;
  onSelectTheme: (theme: AppThemeId) => void;
  seriesList?: PlaythroughSeries[];
  activeSeriesId?: string;
  onSelectSeries?: (id: string) => void;
  onOpenPlaythroughView?: () => void;
  onSelectEpisode?: (ep: Episode) => void;
  onOpenNewSeriesModal?: () => void;
}

type TabType = "overview" | "achievements" | "profile" | "preferences";

const PRESET_AVATARS = DEFAULT_CREATOR_AVATARS;

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  seriesList = [],
  activeSeriesId = "",
  onSelectSeries,
  onOpenPlaythroughView,
  onSelectEpisode,
  onOpenNewSeriesModal,
}) => {
  const { currentUser, userProfile, updateUserProfile, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [displayName, setDisplayName] = useState(userProfile?.displayName || "");
  const [bio, setBio] = useState(userProfile?.bio || "");
  const [channelName, setChannelName] = useState(userProfile?.channelName || "");
  const [youtubeUrl, setYoutubeUrl] = useState(userProfile?.youtubeUrl || "");
  const [twitchUrl, setTwitchUrl] = useState(userProfile?.twitchUrl || "");
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatarUrl || "");
  const [defaultDuration, setDefaultDuration] = useState(userProfile?.defaultEpisodeDuration || 90);
  const [recordingRes, setRecordingRes] = useState(userProfile?.recordingResolution || "4K 60fps (3840x2160)");
  const [audioBitrate, setAudioBitrate] = useState(userProfile?.recordingAudioBitrate || "320 kbps (Studio Quality)");
  const [selectedTheme, setSelectedTheme] = useState<AppThemeId>(currentTheme);
  const [avatarCategory, setAvatarCategory] = useState<string>("all");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  // Achievements state
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [achievementFilter, setAchievementFilter] = useState<"all" | "unlocked" | "locked">("all");
  const [showAllSeries, setShowAllSeries] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowAllSeries(false);
      setAchievements(loadAchievements());
      setDisplayName(userProfile?.displayName || "");
      setBio(userProfile?.bio || "");
      setChannelName(userProfile?.channelName || "");
      setYoutubeUrl(userProfile?.youtubeUrl || "");
      setTwitchUrl(userProfile?.twitchUrl || "");
      setAvatarUrl(userProfile?.avatarUrl || "");
      setDefaultDuration(userProfile?.defaultEpisodeDuration || 90);
      setRecordingRes(userProfile?.recordingResolution || "4K 60fps (3840x2160)");
      setAudioBitrate(userProfile?.recordingAudioBitrate || "320 kbps (Studio Quality)");
      setSelectedTheme(currentTheme);
    }
  }, [isOpen, userProfile, currentTheme]);

  if (!isOpen) return null;

  // Gamerscore stats
  const gamerscore = calculateGamerscore(achievements);
  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const recentUnlocked = [...unlockedAchievements].reverse().slice(0, 4);

  // Last worked on series & last episode
  const activeSeries = (seriesList || []).find((s) => s?.id === activeSeriesId) || seriesList?.[0];
  const lastEpisode = activeSeries?.episodes?.[(activeSeries.episodes?.length || 1) - 1] || activeSeries?.episodes?.[0];

  // Series metrics calculation
  const totalEpisodesInCatalog = (seriesList || []).reduce((acc, s) => acc + (s?.episodes?.length || 0), 0);
  const publishedEpisodesCount = (seriesList || []).reduce(
    (acc, s) => acc + (s?.episodes?.filter((e) => e?.status === "published")?.length || 0),
    0
  );
  const recordedEpisodesCount = (seriesList || []).reduce(
    (acc, s) => acc + (s?.episodes?.filter((e) => e?.status === "recorded" || e?.status === "edited" || e?.status === "uploaded")?.length || 0),
    0
  );

  // Active series completion %
  const activeSeriesCompletedCount = activeSeries?.episodes?.filter((e) => e?.status === "published")?.length || 0;
  const activeSeriesTotal = activeSeries?.episodes?.length || 0;
  const activeSeriesPercent = activeSeriesTotal > 0 ? Math.round((activeSeriesCompletedCount / activeSeriesTotal) * 100) : 0;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfile({
        displayName: displayName.trim(),
        bio: bio.trim(),
        channelName: channelName.trim(),
        youtubeUrl: youtubeUrl.trim(),
        twitchUrl: twitchUrl.trim(),
        avatarUrl: avatarUrl.trim(),
        defaultEpisodeDuration: Number(defaultDuration),
        recordingResolution: recordingRes,
        recordingAudioBitrate: audioBitrate,
        theme: selectedTheme,
      });
      onSelectTheme(selectedTheme);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        setAvatarUrl(base64);
        try {
          await updateUserProfile({ avatarUrl: base64 });
          setSavedSuccess(true);
          setTimeout(() => setSavedSuccess(false), 2000);
        } catch (err) {
          console.warn("Auto-save avatar upload error:", err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPresetAvatar = async (url: string) => {
    setAvatarUrl(url);
    try {
      await updateUserProfile({ avatarUrl: url });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      console.warn("Auto-save preset avatar error:", err);
    }
  };

  const filteredAchievements = achievements.filter((ach) => {
    if (achievementFilter === "unlocked") return ach.unlocked;
    if (achievementFilter === "locked") return !ach.unlocked;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0a0d16] border border-blue-500/30 rounded-3xl max-w-5xl w-full p-4 sm:p-6 lg:p-7 space-y-5 shadow-2xl shadow-blue-950/90 relative max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Creator Hero Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 sm:pb-4 border-b border-white/10 pr-8 sm:pr-10">
          <div className="flex items-center gap-3.5">
            <div className="relative group">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-700 border-2 border-blue-400/50 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-900/40">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{(displayName || userProfile?.username || "C").slice(0, 2).toUpperCase()}</span>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-wide">
                  {displayName || userProfile?.displayName || userProfile?.username || "Creator"}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold uppercase tracking-wider">
                  {channelName || "Studio Creator"}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-2">
                <span>@{userProfile?.username || "creator"}</span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Cloud Firestore Synced
                </span>
              </p>
            </div>
          </div>

          {/* Gamer Points Pill Badge */}
          <div className="flex items-center gap-3 bg-[#06080e] border border-amber-500/30 rounded-2xl px-3.5 py-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-amber-400/80 font-bold uppercase tracking-wider">
                Creator Gamer Points
              </div>
              <div className="text-sm font-black text-white flex items-baseline gap-1">
                <span>{gamerscore.unlockedScore.toLocaleString()}</span>
                <span className="text-[10px] text-zinc-400 font-normal">/ {gamerscore.totalScore.toLocaleString()} GP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Responsive Grid layout so no tabs are cut off */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full justify-center px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-center ${
              activeTab === "overview"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-zinc-400 hover:text-white hover:bg-white/5 bg-[#070a12]/60 border border-white/5"
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Dashboard & Series</span>
          </button>

          <button
            onClick={() => setActiveTab("achievements")}
            className={`w-full justify-center px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-center ${
              activeTab === "achievements"
                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                : "text-zinc-400 hover:text-white hover:bg-white/5 bg-[#070a12]/60 border border-white/5"
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate">Achievements ({gamerscore.unlockedCount}/{gamerscore.totalCount})</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full justify-center px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-center ${
              activeTab === "profile"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-zinc-400 hover:text-white hover:bg-white/5 bg-[#070a12]/60 border border-white/5"
            }`}
          >
            <User className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Profile & Branding</span>
          </button>

          <button
            onClick={() => setActiveTab("preferences")}
            className={`w-full justify-center px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-center ${
              activeTab === "preferences"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                : "text-zinc-400 hover:text-white hover:bg-white/5 bg-[#070a12]/60 border border-white/5"
            }`}
          >
            <Sliders className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Preferences & Cloud</span>
          </button>
        </div>

        {/* Tab Contents (Scrollable Container) */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-6">
          {savedSuccess && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Settings successfully synchronized to your Cloud profile!</span>
            </div>
          )}

          {/* TAB 1: OVERVIEW & PLAYTHROUGHS */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#06080e] border border-white/10 space-y-1">
                  <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                    <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />
                    Total Series
                  </div>
                  <div className="text-xl font-black text-white">{seriesList.length}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#06080e] border border-white/10 space-y-1">
                  <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-indigo-400" />
                    Total Episodes
                  </div>
                  <div className="text-xl font-black text-white">{totalEpisodesInCatalog}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#06080e] border border-white/10 space-y-1">
                  <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                    <Youtube className="w-3.5 h-3.5 text-red-400" />
                    Published Videos
                  </div>
                  <div className="text-xl font-black text-emerald-400">{publishedEpisodesCount}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#06080e] border border-white/10 space-y-1">
                  <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    Gamer Points
                  </div>
                  <div className="text-xl font-black text-amber-400">{gamerscore.unlockedScore} GP</div>
                </div>
              </div>

              {/* SPOTLIGHT: Last Worked On Playthrough */}
              {activeSeries ? (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0c101c] via-[#090c16] to-[#06080e] border border-blue-500/40 relative overflow-hidden shadow-xl shadow-blue-950/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                        Last Active Playthrough Series
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold">
                      {activeSeries.playthroughType || "100% Walkthrough"}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {activeSeries.coverImage ? (
                      <img
                        src={activeSeries.coverImage}
                        alt={activeSeries.gameTitle}
                        className="w-20 h-24 object-cover rounded-xl border border-white/20 shadow-md shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-24 rounded-xl bg-gradient-to-tr from-blue-900 to-indigo-950 border border-blue-400/30 flex items-center justify-center text-blue-300 font-black text-xl shrink-0">
                        {activeSeries.gameTitle.slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div className="flex-1 min-w-0 space-y-2">
                      <div>
                        <h3 className="text-lg font-black text-white truncate">
                          {activeSeries.gameTitle}
                        </h3>
                        <p className="text-xs text-zinc-400 truncate">
                          {activeSeries.subtitle || "Complete Walkthrough & Lore Strategy Guide"}
                        </p>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-zinc-400">Series Completion</span>
                          <span className="text-blue-300 font-bold">
                            {activeSeriesCompletedCount} / {activeSeriesTotal} Episodes ({activeSeriesPercent}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/10">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500"
                            style={{ width: `${activeSeriesPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Last Worked Episode Card */}
                  {lastEpisode && (
                    <div className="p-3.5 sm:p-4 rounded-xl bg-[#06080e]/95 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 min-w-0">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Film className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span>Latest Episode Spotlight • Part {lastEpisode.partNumber}</span>
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-white truncate" title={lastEpisode.title}>
                          {lastEpisode.title}
                        </div>
                        <div className="text-[11px] text-zinc-400 truncate" title={`${lastEpisode.startPoint} ➔ ${lastEpisode.endPoint}`}>
                          {lastEpisode.startPoint} ➔ {lastEpisode.endPoint}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pt-1 md:pt-0">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 whitespace-nowrap ${
                            lastEpisode.status === "published"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : lastEpisode.status === "recorded"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : "bg-zinc-800/90 text-zinc-300 border border-zinc-700"
                          }`}
                        >
                          {lastEpisode.status.replace("_", " ")}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            if (onSelectEpisode) {
                              onSelectEpisode(lastEpisode);
                            }
                            if (onOpenPlaythroughView) {
                              onOpenPlaythroughView();
                            }
                            onClose();
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 whitespace-nowrap shadow-md shadow-blue-900/40 active:scale-95"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Open Episode</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              {/* All Series in Library */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    All Series in Your Catalog ({seriesList.length})
                  </h4>
                  <div className="flex items-center gap-2.5">
                    {seriesList.length > 4 && (
                      <button
                        type="button"
                        onClick={() => setShowAllSeries(!showAllSeries)}
                        className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {showAllSeries ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5" />
                            <span>Show Top 4</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5" />
                            <span>View All ({seriesList.length})</span>
                          </>
                        )}
                      </button>
                    )}
                    {onOpenNewSeriesModal && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenNewSeriesModal();
                        }}
                        className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add New Series
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(showAllSeries ? seriesList : seriesList.slice(0, 4)).map((s) => {
                    const isSelected = s.id === activeSeriesId;
                    const pubCount = s.episodes?.filter((e) => e.status === "published").length || 0;
                    const totalEp = s.episodes?.length || 0;
                    const pct = totalEp > 0 ? Math.round((pubCount / totalEp) * 100) : 0;

                    return (
                      <div
                        key={s.id}
                        onClick={() => {
                          if (onSelectSeries) onSelectSeries(s.id);
                        }}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? "bg-blue-950/40 border-blue-500/60 shadow-md shadow-blue-950/50"
                            : "bg-[#06080e] border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {s.coverImage ? (
                            <img
                              src={s.coverImage}
                              alt={s.gameTitle}
                              className="w-10 h-12 object-cover rounded-lg border border-white/10 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-12 rounded-lg bg-blue-900/40 border border-blue-400/20 flex items-center justify-center text-xs font-bold text-blue-300 shrink-0">
                              {s.gameTitle.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white truncate">{s.gameTitle}</div>
                            <div className="text-[11px] text-zinc-400 truncate">
                              {totalEp} episodes • {pct}% completed
                            </div>
                          </div>
                        </div>

                        {isSelected ? (
                          <span className="px-2 py-0.5 rounded-md bg-blue-500/30 text-blue-300 border border-blue-400/40 text-[10px] font-bold">
                            Active
                          </span>
                        ) : (
                          <ChevronRight className="w-4 h-4 text-zinc-500" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Show More / Show Less Button if more than 4 series exist */}
                {seriesList.length > 4 && (
                  <div className="flex justify-center pt-1.5">
                    <button
                      type="button"
                      onClick={() => setShowAllSeries(!showAllSeries)}
                      className="px-4 py-2 rounded-xl bg-[#06080e] hover:bg-[#121c35] text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-400/50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                    >
                      {showAllSeries ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" />
                          <span>Show Less (Displaying 4 of {seriesList.length} series)</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" />
                          <span>Show More Series ({seriesList.length - 4} remaining)</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ACHIEVEMENTS & GAMERSCORE */}
          {activeTab === "achievements" && (
            <div className="space-y-6">
              {/* Gamer Points Showcase Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-yellow-950/20 to-[#06080e] border border-amber-500/40 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        Creator Gamer Points & Trophies
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Unlock achievements by creating episodes, designing thumbnails, and publishing guides
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => playAchievementUnlockSound()}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Test Retro Chime
                  </button>
                </div>

                {/* Big Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-300 font-semibold">
                      Unlocked: <strong className="text-amber-400">{gamerscore.unlockedCount}</strong> / {gamerscore.totalCount} Trophies
                    </span>
                    <span className="text-amber-400 font-black">
                      {gamerscore.unlockedScore.toLocaleString()} / {gamerscore.totalScore.toLocaleString()} GP ({gamerscore.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden border border-amber-500/20">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 rounded-full transition-all duration-500 shadow-sm shadow-amber-400"
                      style={{ width: `${gamerscore.percentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Achievement Filter Tabs */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAchievementFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    achievementFilter === "all"
                      ? "bg-amber-600 text-white"
                      : "bg-[#06080e] border border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  All ({achievements.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAchievementFilter("unlocked")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    achievementFilter === "unlocked"
                      ? "bg-amber-600 text-white"
                      : "bg-[#06080e] border border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  Unlocked ({gamerscore.unlockedCount})
                </button>
                <button
                  type="button"
                  onClick={() => setAchievementFilter("locked")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    achievementFilter === "locked"
                      ? "bg-amber-600 text-white"
                      : "bg-[#06080e] border border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  In Progress & Locked ({gamerscore.totalCount - gamerscore.unlockedCount})
                </button>
              </div>

              {/* Achievements Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredAchievements.map((ach) => {
                  const isUnlocked = ach.unlocked;
                  return (
                    <div
                      key={ach.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                        isUnlocked
                          ? "bg-amber-950/20 border-amber-500/40 shadow-sm shadow-amber-950/40"
                          : "bg-[#06080e] border-white/10 opacity-75"
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                          isUnlocked
                            ? "bg-gradient-to-tr from-amber-600 to-yellow-500 text-white border-amber-400/50 shadow-md shadow-amber-500/30"
                            : "bg-zinc-800/80 text-zinc-500 border-zinc-700"
                        }`}
                      >
                        {isUnlocked ? <Trophy className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className={`text-xs font-bold truncate ${isUnlocked ? "text-white" : "text-zinc-300"}`}>
                            {ach.title}
                          </h4>
                          <span
                            className={`text-[10px] font-black shrink-0 ${
                              isUnlocked ? "text-amber-400" : "text-zinc-500"
                            }`}
                          >
                            +{ach.points} GP
                          </span>
                        </div>

                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          {ach.description}
                        </p>

                        <div className="pt-1 flex items-center justify-between text-[10px]">
                          {isUnlocked ? (
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Unlocked {ach.unlockedAt ? `on ${ach.unlockedAt}` : ""}
                            </span>
                          ) : (
                            <span className="text-zinc-400">
                              Progress: {ach.progress} / {ach.maxProgress}
                            </span>
                          )}

                          <span
                            className={`uppercase text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              ach.rarity === "legendary"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : ach.rarity === "epic"
                                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                : ach.rarity === "rare"
                                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                : "bg-zinc-800 text-zinc-400"
                            }`}
                          >
                            {ach.rarity}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: CREATOR PROFILE & BRANDING */}
          {activeTab === "profile" && (
            <form onSubmit={handleSave} className="space-y-5">
              {/* Avatar Picker & Upload */}
              <div className="p-4 bg-[#06080e] border border-white/10 rounded-2xl space-y-3">
                <label className="block text-xs font-bold text-zinc-200 uppercase tracking-wider">
                  Creator Avatar & Portrait
                </label>

                <div className="flex items-center gap-4">
                  <div className="relative group shrink-0">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-tr from-blue-900 to-indigo-900 border-2 border-blue-400/40 flex items-center justify-center text-white text-xl font-bold">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span>{(displayName || userProfile?.username || "C").slice(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 rounded-2xl flex items-center justify-center text-white cursor-pointer transition-opacity">
                      <Camera className="w-5 h-5" />
                      <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
                    </label>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-zinc-300 mb-1 font-semibold">
                      Upload from device or select a themed portrait preset below:
                    </div>
                    <label className="inline-block px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-300 border border-blue-500/30 text-xs font-bold hover:bg-blue-600/30 transition-colors cursor-pointer">
                      Browse Image File
                      <input type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Preset Avatars */}
                <div className="pt-3 border-t border-white/10 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-zinc-300 font-bold uppercase tracking-wider">
                        Select Default Creator Avatar ({(PRESET_AVATARS || []).length} available):
                      </span>
                    </div>
                    {avatarUrl && (PRESET_AVATARS || []).some((p) => p.url === avatarUrl) && (
                      <span className="text-[11px] text-cyan-300 font-bold bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded-md self-start sm:self-auto">
                        Active: {(PRESET_AVATARS || []).find((p) => p.url === avatarUrl)?.name} • {(PRESET_AVATARS || []).find((p) => p.url === avatarUrl)?.role}
                      </span>
                    )}
                  </div>

                  {/* Category Filter Chips */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: "all", label: `All Avatars (${(PRESET_AVATARS || []).length})` },
                      { id: "Cyber & Heroes", label: `Cyber & Heroes (${(PRESET_AVATARS || []).filter(p => p.category === "Cyber & Heroes").length})` },
                      { id: "Icons & Mythos", label: `Icons & Mythos (${(PRESET_AVATARS || []).filter(p => p.category === "Icons & Mythos").length})` },
                      { id: "Gear & Tech", label: `Gear & Tech (${(PRESET_AVATARS || []).filter(p => p.category === "Gear & Tech").length})` },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setAvatarCategory(cat.id)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          avatarCategory === cat.id
                            ? "bg-blue-600/30 text-blue-300 border-blue-400/50 shadow-sm"
                            : "bg-[#0c101d] text-zinc-400 border-white/10 hover:border-white/20 hover:text-zinc-200"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Avatars Grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-[260px] overflow-y-auto pr-1 p-2 rounded-xl bg-black/40 border border-white/5 custom-synopsis-scrollbar">
                    {(PRESET_AVATARS || [])
                      .filter((p) => avatarCategory === "all" || p.category === avatarCategory)
                      .map((preset) => {
                        const isSelected = avatarUrl === preset.url;
                        return (
                          <button
                            key={preset.id || preset.name}
                            type="button"
                            onClick={() => handleSelectPresetAvatar(preset.url)}
                            className={`group p-1 rounded-xl border flex flex-col items-center gap-1 transition-all text-center cursor-pointer ${
                              isSelected
                                ? "border-blue-400 ring-2 ring-blue-500/50 bg-blue-500/25 shadow-md shadow-blue-500/20"
                                : "border-white/10 hover:border-white/30 bg-[#0a0f1d]/60 hover:bg-[#0f172a]"
                            }`}
                            title={`${preset.name} • ${preset.role || "Avatar"}`}
                          >
                            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-lg overflow-hidden border border-white/10 group-hover:scale-105 transition-transform bg-black/50">
                              <img
                                src={preset.url}
                                alt={preset.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Fallback to public route if needed
                                  (e.target as HTMLImageElement).src = `/${preset.id}.png`;
                                }}
                              />
                              {isSelected && (
                                <div className="absolute inset-0 bg-blue-500/40 flex items-center justify-center">
                                  <Check className="w-4 h-4 text-white drop-shadow-md stroke-[3]" />
                                </div>
                              )}
                            </div>
                            <span
                              className={`text-[9px] font-bold truncate max-w-full leading-tight ${
                                isSelected ? "text-blue-300" : "text-zinc-400 group-hover:text-zinc-200"
                              }`}
                            >
                              {preset.name}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Display Name / Handle
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. MasterGamer"
                    className="w-full px-3.5 py-2.5 bg-[#06080e] border border-white/10 focus:border-blue-500 rounded-xl text-white text-xs placeholder-zinc-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    YouTube Channel Name
                  </label>
                  <input
                    type="text"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    placeholder="e.g. RetroLetPlays HD"
                    className="w-full px-3.5 py-2.5 bg-[#06080e] border border-white/10 focus:border-blue-500 rounded-xl text-white text-xs placeholder-zinc-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    YouTube Channel Link / Handle
                  </label>
                  <input
                    type="text"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="e.g. https://youtube.com/@RetroLetPlays"
                    className="w-full px-3.5 py-2.5 bg-[#06080e] border border-white/10 focus:border-blue-500 rounded-xl text-white text-xs placeholder-zinc-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Twitch / Live Stream URL
                  </label>
                  <input
                    type="text"
                    value={twitchUrl}
                    onChange={(e) => setTwitchUrl(e.target.value)}
                    placeholder="e.g. https://twitch.tv/RetroLetPlays"
                    className="w-full px-3.5 py-2.5 bg-[#06080e] border border-white/10 focus:border-blue-500 rounded-xl text-white text-xs placeholder-zinc-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Creator Bio / Stream Schedule
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. Daily JRPG Walkthroughs, 100% Completion Guides, and Lore Breakdowns..."
                  className="w-full px-3.5 py-2.5 bg-[#06080e] border border-white/10 focus:border-blue-500 rounded-xl text-white text-xs placeholder-zinc-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-900/50 flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Profile Settings
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: PREFERENCES & CLOUD */}
          {activeTab === "preferences" && (
            <form onSubmit={handleSave} className="space-y-5">
              {/* Studio Defaults */}
              <div className="space-y-3 p-4 bg-[#06080e] border border-white/10 rounded-2xl">
                <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-400" />
                  Studio Episode & Capture Defaults
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">
                      Default Target Episode Length
                    </label>
                    <select
                      value={defaultDuration}
                      onChange={(e) => setDefaultDuration(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#0b0e17] border border-white/10 rounded-xl text-white text-xs focus:outline-none"
                    >
                      <option value={45}>45 Minutes (Quick LP)</option>
                      <option value={60}>60 Minutes (Standard)</option>
                      <option value={90}>90 Minutes (Longform / Stream)</option>
                      <option value={120}>120 Minutes (Marathon Walkthrough)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">
                      Preferred Studio Theme
                    </label>
                    <select
                      value={selectedTheme}
                      onChange={(e) => setSelectedTheme(e.target.value as AppThemeId)}
                      className="w-full px-3 py-2 bg-[#0b0e17] border border-white/10 rounded-xl text-white text-xs focus:outline-none"
                    >
                      {Object.values(THEME_CONFIGS).map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">
                      Default Capture Resolution Preset
                    </label>
                    <select
                      value={recordingRes}
                      onChange={(e) => setRecordingRes(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0b0e17] border border-white/10 rounded-xl text-white text-xs focus:outline-none"
                    >
                      <option value="4K 60fps (3840x2160)">4K 60fps (3840x2160) - Max Clarity</option>
                      <option value="1440p 60fps (2560x1440)">1440p 60fps (2560x1440) - Quad HD</option>
                      <option value="1080p 60fps (1920x1080)">1080p 60fps (1920x1080) - Standard High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">
                      Audio Bitrate & Commentary Preset
                    </label>
                    <select
                      value={audioBitrate}
                      onChange={(e) => setAudioBitrate(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0b0e17] border border-white/10 rounded-xl text-white text-xs focus:outline-none"
                    >
                      <option value="320 kbps (Studio Quality)">320 kbps (Studio Master Quality)</option>
                      <option value="256 kbps (High Fidelity)">256 kbps (High Fidelity)</option>
                      <option value="192 kbps (Standard Broadcast)">192 kbps (Standard Broadcast)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Cloud Sync & Storage Info */}
              <div className="p-4 bg-[#06080e] border border-white/10 rounded-2xl space-y-3">
                <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  Cloud Database & Storage Integrity
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                    <div className="text-[10px] text-zinc-400">Firestore Cloud Sync</div>
                    <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Live & Connected
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                    <div className="text-[10px] text-zinc-400">IndexedDB Local Cache</div>
                    <div className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                      <HardDrive className="w-3 h-3" />
                      Persistent Fallback
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                    <div className="text-[10px] text-zinc-400">User UID</div>
                    <div className="text-xs font-mono text-zinc-300 truncate">
                      {userProfile?.uid || currentUser?.uid || "creator_demo"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-900/50 flex items-center gap-1.5 cursor-pointer transition-all disabled:opacity-50"
                >
                  {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Save Studio Preferences
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={async () => {
              await logout();
              onClose();
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
