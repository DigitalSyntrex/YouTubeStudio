import React, { useState, useEffect } from "react";
import { Episode, PlaythroughSeries, EpisodeStatus, VideoStats } from "../types";
import {
  Youtube,
  ExternalLink,
  Copy,
  Check,
  Upload,
  Clock,
  Tag,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Globe,
  Settings,
  ChevronRight,
  X,
  Play,
  ArrowUpRight,
  ShieldAlert,
  Info,
  Gamepad2,
  Tv,
  Layers,
  BarChart2,
  Eye,
  ThumbsUp,
  MessageSquare,
  RefreshCw,
  Key,
  TrendingUp,
  Sparkle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { resolveAvatarUrl } from "../data/defaultAvatars";
import { RobustAvatarImg } from "./RobustAvatarImg";

interface YouTubeStudioUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  series?: PlaythroughSeries;
  episodes: Episode[];
  onUpdateEpisodeStatus?: (id: number, status: EpisodeStatus) => void;
  onUpdateEpisode?: (updatedEpisode: Episode) => void;
  onBatchUpdateEpisodes?: (updatedEpisodes: Episode[]) => void;
  onOpenThumbnailStudio?: (episodeId: number) => void;
}

export const parseVideoId = (input: string): string => {
  if (!input) return "";
  const trimmed = input.trim();
  if (trimmed.length === 11 && !trimmed.includes("/") && !trimmed.includes(".")) return trimmed;
  const match = trimmed.match(/(?:v=|\/embed\/|\/watch\?v=|\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : trimmed;
};

export const formatCompactNumber = (num: number): string => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
};

export const YouTubeStudioUploadModal: React.FC<YouTubeStudioUploadModalProps> = ({
  isOpen,
  onClose,
  series,
  episodes,
  onUpdateEpisodeStatus,
  onUpdateEpisode,
  onBatchUpdateEpisodes,
  onOpenThumbnailStudio,
}) => {
  const { userProfile } = useAuth();
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<number>(() => {
    const readyEp = (episodes || []).find((e) => e?.status === "edited" || e?.status === "recorded" || e?.status === "published");
    return readyEp ? readyEp.id : episodes?.[0]?.id || 1;
  });

  const [activeTab, setActiveTab] = useState<"quick_publish" | "video_stats" | "api_setup">("quick_publish");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const [channelId, setChannelId] = useState<string>(() => {
    return localStorage.getItem("youtube_channel_id") || "";
  });

  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem("youtube_api_key") || "";
  });

  const currentEpisode = (episodes || []).find((e) => e?.id === selectedEpisodeId) || episodes?.[0];

  const [videoIdInput, setVideoIdInput] = useState<string>(() => currentEpisode?.youtubeVideoId || "");
  const [manualViews, setManualViews] = useState<string>(() => currentEpisode?.videoStats?.views?.toString() || "");
  const [manualLikes, setManualLikes] = useState<string>(() => currentEpisode?.videoStats?.likes?.toString() || "");
  const [manualComments, setManualComments] = useState<string>(() => currentEpisode?.videoStats?.comments?.toString() || "");

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Sync inputs when selected episode changes
  useEffect(() => {
    if (currentEpisode) {
      setVideoIdInput(currentEpisode.youtubeVideoId || "");
      setManualViews(currentEpisode.videoStats?.views?.toString() || "");
      setManualLikes(currentEpisode.videoStats?.likes?.toString() || "");
      setManualComments(currentEpisode.videoStats?.comments?.toString() || "");
    }
  }, [selectedEpisodeId, currentEpisode?.id, currentEpisode?.youtubeVideoId, currentEpisode?.videoStats]);

  if (!isOpen) return null;

  const gameTitle = series?.gameTitle || "Gaming Playthrough";

  // Formatted YouTube Title
  const formattedTitle = currentEpisode
    ? `Part ${currentEpisode.partNumber} - ${currentEpisode.title} | ${gameTitle} Let's Play`
    : `Let's Play ${gameTitle}`;

  // Formatted Chapters & Timestamps
  const chapterText = currentEpisode?.chapters?.length
    ? currentEpisode.chapters.map((c) => `${c.timestamp} - ${c.title}`).join("\n")
    : "00:00 - Episode Start\n05:30 - Main Gameplay\n18:45 - Boss Encounter";

  // Formatted YouTube Description
  const formattedDescription = currentEpisode
    ? `${currentEpisode.description || `${gameTitle} Part ${currentEpisode.partNumber} Let's Play Gameplay Walkthrough.`}\n\n` +
      `🎮 Game: ${gameTitle}\n` +
      `📍 World / Act: ${currentEpisode.world}\n\n` +
      `⏱️ CHAPTER TIMESTAMPS:\n` +
      `${chapterText}\n\n` +
      `🔥 KEY HIGHLIGHTS & EVENTS:\n` +
      `${currentEpisode.keyEvents?.map((k) => `• ${k}`).join("\n") || "• Epic boss fight and story progression"}\n\n` +
      `⚔️ BOSSES ENCOUNTERED:\n` +
      `${currentEpisode.bosses?.map((b) => `• ${b}`).join("\n") || "• Main Boss Battle"}\n\n` +
      `🔔 Don't forget to Subscribe and ring the bell for future episodes!\n` +
      `#${gameTitle.replace(/[^a-zA-Z0-9]/g, "")} #LetsPlay #GamingWalkthrough #Part${currentEpisode.partNumber}`
    : "";

  // Formatted Comma-Separated Tags
  const formattedTags = currentEpisode?.tags?.length
    ? currentEpisode.tags.join(", ") + `, ${gameTitle.toLowerCase()}, lets play, walkthrough, gameplay, part ${currentEpisode.partNumber}`
    : `${gameTitle.toLowerCase()}, lets play, walkthrough, gameplay, episode 1`;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveChannelId = (id: string) => {
    setChannelId(id);
    localStorage.setItem("youtube_channel_id", id);
  };

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem("youtube_api_key", key);
  };

  // Direct YouTube Studio & Upload Links
  const studioUploadUrl = "https://www.youtube.com/upload";
  const studioDashboardUrl = channelId
    ? `https://studio.youtube.com/channel/${channelId}`
    : "https://studio.youtube.com";

  // Realistic YouTube Video Stats Simulation Generator
  const generateSimulatedStats = (ep: Episode, baseVideoId?: string): VideoStats => {
    const partNum = ep.partNumber;
    const baseViews = Math.max(180, Math.floor(4200 / (1 + (partNum - 1) * 0.14)) + Math.floor(Math.random() * 950));
    const baseLikes = Math.max(14, Math.floor(baseViews * (0.055 + Math.random() * 0.035)));
    const baseComments = Math.max(4, Math.floor(baseLikes * (0.14 + Math.random() * 0.08)));
    return {
      views: baseViews,
      likes: baseLikes,
      comments: baseComments,
      lastUpdated: new Date().toISOString(),
      videoId: baseVideoId || ep.youtubeVideoId || `YT_EP${ep.partNumber}_${Math.floor(Math.random() * 9000 + 1000)}`,
    };
  };

  // Fetch / Sync stats for the single selected episode
  const handleFetchStatsForCurrentEpisode = async () => {
    if (!currentEpisode) return;
    setIsSyncing(true);
    setSyncMessage(null);

    const cleanId = parseVideoId(videoIdInput || currentEpisode.youtubeVideoId || "");

    let fetchedStats: VideoStats | null = null;
    let usedRealApi = false;

    if (apiKey && cleanId) {
      try {
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${cleanId}&key=${apiKey}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.items && data.items.length > 0) {
            const stats = data.items[0].statistics;
            fetchedStats = {
              views: parseInt(stats.viewCount || "0", 10),
              likes: parseInt(stats.likeCount || "0", 10),
              comments: parseInt(stats.commentCount || "0", 10),
              lastUpdated: new Date().toISOString(),
              videoId: cleanId,
            };
            usedRealApi = true;
          }
        }
      } catch (e) {
        console.warn("YouTube API call failed, falling back to simulation:", e);
      }
    }

    if (!fetchedStats) {
      fetchedStats = generateSimulatedStats(currentEpisode, cleanId);
    }

    const updatedEpisode: Episode = {
      ...currentEpisode,
      youtubeVideoId: cleanId || fetchedStats.videoId,
      videoStats: fetchedStats,
    };

    if (onUpdateEpisode) {
      onUpdateEpisode(updatedEpisode);
    }

    setManualViews(fetchedStats.views.toString());
    setManualLikes(fetchedStats.likes.toString());
    setManualComments(fetchedStats.comments.toString());
    setIsSyncing(false);
    setSyncMessage(
      usedRealApi
        ? `✅ Fetched live YouTube API statistics for Part ${currentEpisode.partNumber}!`
        : `✨ Generated video statistics for Part ${currentEpisode.partNumber}!`
    );
    setTimeout(() => setSyncMessage(null), 3500);
  };

  // Batch Sync ALL Episodes Statistics
  const handleBatchSyncAllEpisodes = async () => {
    setIsSyncing(true);
    setSyncMessage(null);

    let updatedList: Episode[] = [];
    let realCount = 0;

    for (const ep of episodes) {
      const cleanId = parseVideoId(ep.youtubeVideoId || "");
      let stats: VideoStats | null = null;

      if (apiKey && cleanId) {
        try {
          const res = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${cleanId}&key=${apiKey}`
          );
          if (res.ok) {
            const data = await res.json();
            if (data.items && data.items.length > 0) {
              const st = data.items[0].statistics;
              stats = {
                views: parseInt(st.viewCount || "0", 10),
                likes: parseInt(st.likeCount || "0", 10),
                comments: parseInt(st.commentCount || "0", 10),
                lastUpdated: new Date().toISOString(),
                videoId: cleanId,
              };
              realCount++;
            }
          }
        } catch (err) {
          // Fall back to simulation
        }
      }

      if (!stats) {
        stats = generateSimulatedStats(ep, cleanId);
      }

      updatedList.push({
        ...ep,
        youtubeVideoId: cleanId || stats.videoId,
        videoStats: stats,
      });
    }

    if (onBatchUpdateEpisodes) {
      onBatchUpdateEpisodes(updatedList);
    }

    setIsSyncing(false);
    setSyncMessage(
      realCount > 0
        ? `✅ Synced statistics for all ${updatedList.length} episodes (${realCount} via YouTube API)!`
        : `✨ Updated video statistics for all ${updatedList.length} episodes!`
    );
    setTimeout(() => setSyncMessage(null), 4000);
  };

  // Save manual views/likes/comments
  const handleSaveManualStats = () => {
    if (!currentEpisode) return;
    const cleanId = parseVideoId(videoIdInput || currentEpisode.youtubeVideoId || "");
    const newStats: VideoStats = {
      views: Math.max(0, parseInt(manualViews, 10) || 0),
      likes: Math.max(0, parseInt(manualLikes, 10) || 0),
      comments: Math.max(0, parseInt(manualComments, 10) || 0),
      lastUpdated: new Date().toISOString(),
      videoId: cleanId || currentEpisode.videoStats?.videoId || `YT_${currentEpisode.partNumber}`,
    };

    const updatedEpisode: Episode = {
      ...currentEpisode,
      youtubeVideoId: cleanId,
      videoStats: newStats,
    };

    if (onUpdateEpisode) {
      onUpdateEpisode(updatedEpisode);
    }

    setSyncMessage(`✅ Saved custom video statistics for Part ${currentEpisode.partNumber}!`);
    setTimeout(() => setSyncMessage(null), 3000);
  };

  // Series Analytics Aggregates
  const episodesWithStats = episodes.filter((e) => e.videoStats);
  const totalSeriesViews = episodes.reduce((acc, e) => acc + (e.videoStats?.views || 0), 0);
  const totalSeriesLikes = episodes.reduce((acc, e) => acc + (e.videoStats?.likes || 0), 0);
  const totalSeriesComments = episodes.reduce((acc, e) => acc + (e.videoStats?.comments || 0), 0);
  const avgViewsPerEp = episodesWithStats.length > 0 ? Math.round(totalSeriesViews / episodesWithStats.length) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0f0f12] border border-red-500/30 rounded-2xl shadow-2xl shadow-red-950/40 text-zinc-100 my-auto overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-950/60 via-zinc-900 to-zinc-950 border-b border-red-500/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 bg-red-600/20 border border-red-500/40 rounded-xl text-red-500 shadow-md shrink-0">
              <Youtube className="w-6 h-6 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-wide text-white truncate">
                  YouTube Studio Direct Upload & Live Video Analytics
                </h2>
                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-md text-[10px] font-extrabold uppercase tracking-wider shrink-0">
                  Direct Hub
                </span>
              </div>
              <p className="text-xs text-zinc-400 truncate">
                1-Click Studio launcher, live video statistics sync & metadata transfer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 ml-2">
            {/* Creator Avatar Badge */}
            <div className="flex items-center gap-2 bg-zinc-950/80 px-2.5 py-1.5 rounded-xl border border-blue-500/30 shadow-inner">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-400/50 flex items-center justify-center text-white text-[10px] font-black shrink-0">
                <RobustAvatarImg
                  src={resolveAvatarUrl(userProfile?.avatarUrl)}
                  alt="Creator"
                  className="w-full h-full object-cover"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-black" />
              </div>
              <div className="min-w-0 hidden sm:block text-left">
                <div className="text-[8px] font-black uppercase tracking-widest text-cyan-400">
                  Creator Tag
                </div>
                <div className="text-[11px] font-bold text-white truncate max-w-[110px]">
                  {userProfile?.displayName || userProfile?.username || "Creator"}
                </div>
              </div>
            </div>

            {/* Game Title Logo Badge */}
            <div className="flex items-center gap-2.5 bg-zinc-950/80 px-3 py-1.5 rounded-xl border border-white/10 shadow-inner">
              {series?.coverImage ? (
                <img
                  src={series.coverImage}
                  alt={gameTitle}
                  className="w-10 h-10 object-cover rounded-lg border border-amber-500/40 shadow-md shrink-0"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-red-500/20 border border-amber-500/40 rounded-lg flex items-center justify-center text-amber-400 font-black text-sm shrink-0">
                  <Gamepad2 className="w-5 h-5 text-amber-400" />
                </div>
              )}
              <div className="min-w-0 hidden md:block text-left">
                <div className="text-[9px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1">
                  <Tv className="w-2.5 h-2.5" />
                  <span>{series?.badgeText || "GAME LOGO"}</span>
                </div>
                <div className="text-xs font-black text-white truncate max-w-[150px]">
                  {gameTitle}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/50 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher & Episode Selector */}
        <div className="px-4 py-3 bg-zinc-950/90 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setActiveTab("quick_publish")}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "quick_publish"
                  ? "bg-red-600 text-white shadow-md shadow-red-950/50"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>1-Click Fast Studio Upload</span>
            </button>
            <button
              onClick={() => setActiveTab("video_stats")}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "video_stats"
                  ? "bg-red-600 text-white shadow-md shadow-red-950/50"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Video Analytics & Stats</span>
              {episodesWithStats.length > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 text-[10px] rounded font-bold">
                  {episodesWithStats.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("api_setup")}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "api_setup"
                  ? "bg-red-600 text-white shadow-md shadow-red-950/50"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>YouTube API / Channel Info</span>
            </button>
          </div>

          {/* Episode Picker */}
          {episodes.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-400">Target Episode:</span>
              <select
                value={selectedEpisodeId}
                onChange={(e) => setSelectedEpisodeId(Number(e.target.value))}
                className="bg-zinc-900 border border-zinc-700/80 rounded-xl px-3 py-1.5 text-xs font-extrabold text-amber-300 focus:outline-none focus:border-red-500 cursor-pointer max-w-[240px] truncate"
              >
                {episodes.map((ep) => (
                  <option key={ep.id} value={ep.id}>
                    Part {ep.partNumber}: {ep.title} ({ep.status.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {syncMessage && (
            <div className="p-3 bg-gradient-to-r from-emerald-950/80 via-zinc-900 to-zinc-950 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-extrabold animate-fade-in flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>{syncMessage}</span>
              </div>
              <button
                onClick={() => setSyncMessage(null)}
                className="text-zinc-400 hover:text-white text-xs px-2 py-0.5 rounded"
              >
                ✕
              </button>
            </div>
          )}

          {activeTab === "quick_publish" ? (
            <>
              {/* Primary Direct YouTube Launcher Banner */}
              <div className="p-5 bg-gradient-to-r from-red-950/50 via-zinc-900 to-zinc-950 border border-red-500/40 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-red-400 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> Direct Launch Workflow
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      Publish <span className="text-red-400">Part {currentEpisode?.partNumber}: {currentEpisode?.title}</span> to YouTube
                    </h3>
                    <p className="text-xs text-zinc-400 max-w-xl">
                      Click below to open YouTube Studio's upload dialogue directly. Then use the 1-click copy boxes below to instantly fill out title, description, timestamps, and tags.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
                    <a
                      href={studioUploadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-5 py-3 bg-red-600 hover:bg-red-500 text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-red-950/80 hover:scale-105 flex items-center justify-center gap-2 cursor-pointer border border-red-400/30"
                    >
                      <Youtube className="w-4 h-4" />
                      <span>Launch YouTube Studio Upload</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>

                    <a
                      href={studioDashboardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-3 bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 border border-zinc-700/70"
                      title="Open YouTube Studio Content Dashboard"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="hidden md:inline">Channel Content</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Status & Quick Analytics Bar */}
              <div className="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-300">Update Status:</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-black border uppercase tracking-wider bg-zinc-800 text-amber-300 border-amber-500/30">
                      {currentEpisode?.status || "not_started"}
                    </span>
                  </div>

                  {currentEpisode?.videoStats && (
                    <div className="flex items-center gap-3 bg-zinc-950/80 px-3 py-1 rounded-xl border border-zinc-800 font-mono text-xs">
                      <span className="text-cyan-300 font-bold flex items-center gap-1" title="Views">
                        <Eye className="w-3.5 h-3.5" />
                        {currentEpisode.videoStats.views.toLocaleString()}
                      </span>
                      <span className="text-emerald-300 font-bold flex items-center gap-1" title="Likes">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        {currentEpisode.videoStats.likes.toLocaleString()}
                      </span>
                      <span className="text-amber-300 font-bold flex items-center gap-1" title="Comments">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {currentEpisode.videoStats.comments.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {onUpdateEpisodeStatus && currentEpisode && (
                    <>
                      <button
                        onClick={() => onUpdateEpisodeStatus(currentEpisode.id, "uploaded")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          currentEpisode.status === "uploaded"
                            ? "bg-blue-600 text-white font-extrabold"
                            : "bg-blue-950/40 text-blue-300 hover:bg-blue-900/60 border border-blue-500/30"
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Uploaded 🔵</span>
                      </button>

                      <button
                        onClick={() => onUpdateEpisodeStatus(currentEpisode.id, "published")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          currentEpisode.status === "published"
                            ? "bg-emerald-600 text-white font-extrabold"
                            : "bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-500/30"
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Published 🟢</span>
                      </button>
                    </>
                  )}

                  <button
                    onClick={handleFetchStatsForCurrentEpisode}
                    disabled={isSyncing}
                    className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    title="Fetch / Refresh video stats for this episode"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                    <span>Fetch Stats</span>
                  </button>
                </div>
              </div>

              {/* 1-Click Copy Package Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Video Title Card */}
                <div className="p-4 bg-zinc-900/60 border border-zinc-800/90 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                      <FileText className="w-3.5 h-3.5 text-amber-400" /> 1. Video Title
                    </span>
                    <button
                      onClick={() => handleCopy(formattedTitle, "title")}
                      className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                        copiedField === "title"
                          ? "bg-emerald-600 text-white"
                          : "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40"
                      }`}
                    >
                      {copiedField === "title" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === "title" ? "Copied!" : "Copy Title"}</span>
                    </button>
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-200 select-all font-semibold">
                    {formattedTitle}
                  </div>
                  <p className="text-[11px] text-zinc-400">High-CTR video title format with Part Number and Game Name.</p>
                </div>

                {/* 2. Tags Card */}
                <div className="p-4 bg-zinc-900/60 border border-zinc-800/90 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider">
                      <Tag className="w-3.5 h-3.5 text-cyan-400" /> 2. YouTube Tags Box
                    </span>
                    <button
                      onClick={() => handleCopy(formattedTags, "tags")}
                      className={`px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                        copiedField === "tags"
                          ? "bg-emerald-600 text-white"
                          : "bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40"
                      }`}
                    >
                      {copiedField === "tags" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === "tags" ? "Copied!" : "Copy Tags"}</span>
                    </button>
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-300 select-all max-h-20 overflow-y-auto">
                    {formattedTags}
                  </div>
                  <p className="text-[11px] text-zinc-400">Paste directly into YouTube Studio's "Tags" input box.</p>
                </div>

                {/* 3. Description & Timestamps Card (Full Span) */}
                <div className="p-4 bg-zinc-900/60 border border-zinc-800/90 rounded-2xl space-y-2.5 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-purple-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <Clock className="w-3.5 h-3.5 text-purple-400" /> 3. Formatted Description & Chapter Timestamps
                      </span>
                      <span className="px-2 py-0.5 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded text-[10px] font-bold">
                        Auto Scrub Markers Ready
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(formattedDescription, "description")}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                        copiedField === "description"
                          ? "bg-emerald-600 text-white"
                          : "bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-950/50"
                      }`}
                    >
                      {copiedField === "description" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedField === "description" ? "Copied Full Description!" : "Copy Full Description & Timestamps"}</span>
                    </button>
                  </div>

                  <textarea
                    readOnly
                    rows={8}
                    value={formattedDescription}
                    className="w-full p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-mono text-zinc-300 leading-relaxed resize-none focus:outline-none select-all"
                  />
                  <p className="text-[11px] text-zinc-400">
                    Includes introductory hook, timestamps formatted starting with <code className="text-amber-300 font-bold">00:00</code> for YouTube video chapters, key event highlights, boss fights, and video hashtags.
                  </p>
                </div>

                {/* 4. Thumbnail & Visual Asset Quick Download */}
                <div className="p-4 bg-zinc-900/60 border border-zinc-800/90 rounded-2xl space-y-3 md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
                        4. 1280x720 High-CTR Thumbnail Asset
                      </h4>
                      <p className="text-xs text-zinc-400">
                        Customize or export your episode's vector/PNG thumbnail ready for YouTube Studio.
                      </p>
                    </div>
                  </div>

                  {onOpenThumbnailStudio && currentEpisode && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenThumbnailStudio(currentEpisode.id);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-emerald-950/50 shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Open Thumbnail Builder (1280x720)</span>
                    </button>
                  )}
                </div>

              </div>
            </>
          ) : activeTab === "video_stats" ? (
            /* Tab 2: Video Analytics & Stats Sync Dashboard */
            <div className="space-y-5">
              
              {/* Series Overview KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-1">
                  <div className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                    <Eye className="w-3 h-3" /> Series Total Views
                  </div>
                  <div className="text-lg font-black text-white font-mono">
                    {totalSeriesViews.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-zinc-400">across all episodes</div>
                </div>

                <div className="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-1">
                  <div className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3" /> Series Total Likes
                  </div>
                  <div className="text-lg font-black text-white font-mono">
                    {totalSeriesLikes.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-zinc-400">audience approval</div>
                </div>

                <div className="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-1">
                  <div className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> Total Comments
                  </div>
                  <div className="text-lg font-black text-white font-mono">
                    {totalSeriesComments.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-zinc-400">community engagement</div>
                </div>

                <div className="p-3.5 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-1">
                  <div className="text-[10px] font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Avg Views / Episode
                  </div>
                  <div className="text-lg font-black text-white font-mono">
                    {avgViewsPerEp.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    {episodesWithStats.length} with stats
                  </div>
                </div>
              </div>

              {/* Selected Episode Stats Sync & Input Box */}
              <div className="p-4 bg-gradient-to-r from-red-950/30 via-zinc-900 to-zinc-950 border border-red-500/30 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                        <BarChart2 className="w-4 h-4 text-red-500" />
                        Part {currentEpisode?.partNumber}: {currentEpisode?.title}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Fetch current stats via YouTube Data API v3 or generate realistic video analytics for card display.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleFetchStatsForCurrentEpisode}
                      disabled={isSyncing}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-xl transition-all shadow-md shadow-red-950/60 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                      <span>{isSyncing ? "Syncing..." : "Fetch / Refresh Stats"}</span>
                    </button>
                  </div>
                </div>

                {/* Video ID Input Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-zinc-300 flex items-center gap-1">
                      <span>YouTube Video ID or URL:</span>
                      <span className="text-[10px] text-zinc-500 font-mono">(e.g. dQw4w9WgXcQ)</span>
                    </label>
                    <input
                      type="text"
                      value={videoIdInput}
                      onChange={(e) => setVideoIdInput(e.target.value)}
                      placeholder="Paste YouTube Video URL or Video ID..."
                      className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="space-y-1 flex flex-col justify-end">
                    <button
                      onClick={handleSaveManualStats}
                      className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold text-xs rounded-xl transition-all border border-zinc-700 cursor-pointer"
                    >
                      Save Stats
                    </button>
                  </div>
                </div>

                {/* Current Stats Live Display & Manual Editor */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1">
                    <label className="text-[11px] font-extrabold text-cyan-400 flex items-center gap-1 uppercase">
                      <Eye className="w-3.5 h-3.5" /> Views Count
                    </label>
                    <input
                      type="number"
                      value={manualViews}
                      onChange={(e) => setManualViews(e.target.value)}
                      placeholder="e.g. 2450"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-cyan-300 font-extrabold focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1">
                    <label className="text-[11px] font-extrabold text-emerald-400 flex items-center gap-1 uppercase">
                      <ThumbsUp className="w-3.5 h-3.5" /> Likes Count
                    </label>
                    <input
                      type="number"
                      value={manualLikes}
                      onChange={(e) => setManualLikes(e.target.value)}
                      placeholder="e.g. 180"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-emerald-300 font-extrabold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1">
                    <label className="text-[11px] font-extrabold text-amber-400 flex items-center gap-1 uppercase">
                      <MessageSquare className="w-3.5 h-3.5" /> Comments Count
                    </label>
                    <input
                      type="number"
                      value={manualComments}
                      onChange={(e) => setManualComments(e.target.value)}
                      placeholder="e.g. 32"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-amber-300 font-extrabold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {currentEpisode?.videoStats?.lastUpdated && (
                  <p className="text-[10px] text-zinc-400 font-mono italic text-right">
                    Last updated: {new Date(currentEpisode.videoStats.lastUpdated).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Batch Actions Box */}
              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" /> Batch Sync All Episodes Video Statistics
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Automatically fetch or simulate statistics for every episode in your playthrough series to show them on all Episode Cards simultaneously.
                  </p>
                </div>

                <button
                  onClick={handleBatchSyncAllEpisodes}
                  disabled={isSyncing}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-black text-xs rounded-xl transition-all shadow-lg shadow-amber-950/60 flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
                  <span>Sync Stats for ALL Episodes ({episodes.length})</span>
                </button>
              </div>

              {/* API Key Settings Box */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-zinc-200 font-bold text-xs uppercase tracking-wider">
                  <Key className="w-4 h-4 text-amber-400" /> Optional YouTube Data API v3 Key Setup
                </div>
                <p className="text-xs text-zinc-400">
                  Provide your Google YouTube Data API Key to query real-time view counts, likes, and comments directly from YouTube's API endpoints. If no API key is set, realistic video statistics simulation is automatically used.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => handleSaveApiKey(e.target.value)}
                    placeholder="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                    className="flex-1 bg-zinc-950 border border-zinc-700/80 rounded-xl px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-red-500"
                  />
                  <span className="text-xs text-zinc-400 font-bold shrink-0">
                    {apiKey ? "🔑 API Key Configured" : "⚡ Simulation Engine Active"}
                  </span>
                </div>
              </div>

            </div>
          ) : (
            /* Tab 3: API Setup & Channel Info */
            <div className="space-y-5">
              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-red-400 font-black text-sm">
                  <Globe className="w-4 h-4" />
                  <span>Custom YouTube Channel ID for Direct Studio Deep-Links</span>
                </div>
                <p className="text-xs text-zinc-400">
                  Enter your YouTube Channel ID (e.g. <code className="text-amber-300">UC1234567890abcdef</code>) to make the "Launch YouTube Studio" button target your specific channel upload queue directly.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={channelId}
                    onChange={(e) => handleSaveChannelId(e.target.value)}
                    placeholder="UCxxxxxxxxxxxxxxxxxxxx"
                    className="flex-1 bg-zinc-950 border border-zinc-700/80 rounded-xl px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-red-500"
                  />
                  <span className="text-xs text-zinc-400 font-bold">
                    {channelId ? "✅ Saved locally" : "Optional"}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3">
                <h4 className="text-xs font-extrabold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                  <Info className="w-4 h-4 text-cyan-400" /> Standard YouTube API Protocol & Analytics
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Web applications can connect to YouTube via Google OAuth 2.0 or YouTube Data API v3 to read video statistics and upload videos directly.
                </p>

                <div className="space-y-2 text-xs text-zinc-400">
                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-start gap-2.5">
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-300 font-mono text-[10px] rounded font-bold">SCOPE</span>
                    <div>
                      <div className="font-bold text-zinc-200">YouTube Data API v3 Read / Upload Scopes</div>
                      <div className="font-mono text-[11px] text-zinc-400">https://www.googleapis.com/auth/youtube.readonly</div>
                    </div>
                  </div>

                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-start gap-2.5">
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-mono text-[10px] rounded font-bold">ENDPOINT</span>
                    <div>
                      <div className="font-bold text-zinc-200">Video Statistics Query</div>
                      <p className="text-[11px] text-zinc-400 font-mono">GET https://www.googleapis.com/youtube/v3/videos?part=statistics&id=VIDEO_ID</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs text-emerald-200">
                  💡 <strong>Creator Analytics Tip:</strong> Use the <strong>Video Analytics & Stats</strong> tab to sync current views, likes, and comments for all your uploaded Let's Play episodes and render them directly on your Episode Cards!
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800/80 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
            <Youtube className="w-3.5 h-3.5 text-red-500" />
            <span>YouTube Studio Direct Integration & Live Analytics Hub</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
