import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Trophy,
  Sparkles,
  Target,
  Award,
  Flame,
  CheckCircle2,
  X,
  Bell,
  BarChart3,
  Download,
  Share2,
  Zap,
  ArrowRight,
  Film,
  Crown,
  TrendingUp,
  PartyPopper,
  Tv,
  ChevronRight,
} from "lucide-react";
import { PlaythroughSeries, Episode } from "../types";

export type MilestonePercent = 25 | 50 | 75 | 100;

export interface MilestoneRecord {
  id: string;
  seriesId: string;
  gameTitle: string;
  milestone: MilestonePercent;
  unlockedAt: string;
  completedCount: number;
  totalCount: number;
  viewed: boolean;
}

interface MilestoneCelebrationModalProps {
  isOpen: boolean;
  milestone: MilestoneRecord | null;
  series: PlaythroughSeries;
  episodes: Episode[];
  onClose: () => void;
  onOpenExport?: () => void;
}

const MILESTONE_CONFIGS: Record<
  MilestonePercent,
  {
    title: string;
    subtitle: string;
    badgeText: string;
    colorTheme: string;
    bgGradient: string;
    borderColor: string;
    textColor: string;
    icon: React.ReactNode;
    creatorTip: string;
  }
> = {
  25: {
    title: "Quarter Mark Cleared!",
    subtitle: "25% of your Let's Play series is officially produced!",
    badgeText: "25% QUARTER MILESTONE",
    colorTheme: "#38bdf8", // Cyan/Blue
    bgGradient: "from-cyan-950/90 via-[#0a1224] to-blue-950/90",
    borderColor: "border-cyan-400/60",
    textColor: "text-cyan-300",
    icon: <Target className="w-8 h-8 text-cyan-300 animate-pulse" />,
    creatorTip:
      "Pro Creator Tip: At 25%, compile your YouTube Playlist link and add it to all existing video descriptions to boost viewer retention and binge-watching!",
  },
  50: {
    title: "Halfway Champion!",
    subtitle: "50% Milestone Reached! You're halfway through the walkthrough!",
    badgeText: "50% HALFWAY MILESTONE",
    colorTheme: "#a855f7", // Purple
    bgGradient: "from-purple-950/90 via-[#130b24] to-indigo-950/90",
    borderColor: "border-purple-400/60",
    textColor: "text-purple-300",
    icon: <Trophy className="w-8 h-8 text-purple-300 animate-bounce" />,
    creatorTip:
      "Pro Creator Tip: You have enough footage for a mid-series Highlights / Best Boss Fights Short! Clip 60-second clips to drive new subscribers to your channel.",
  },
  75: {
    title: "Final Stretch Unlocked!",
    subtitle: "75% Complete! The epic climax & end-game walkthrough is near!",
    badgeText: "75% FINAL STRETCH",
    colorTheme: "#f59e0b", // Amber/Gold
    bgGradient: "from-amber-950/90 via-[#24130a] to-orange-950/90",
    borderColor: "border-amber-400/60",
    textColor: "text-amber-300",
    icon: <Flame className="w-8 h-8 text-amber-300 animate-pulse" />,
    creatorTip:
      "Pro Creator Tip: Prepare your Channel End-Screens and cards. Link the upcoming Final Boss / Ending Episode to maximize end-screen click-through rate!",
  },
  100: {
    title: "100% Series Masterpiece!",
    subtitle: "CONGRATULATIONS! Your entire playthrough series is 100% completed!",
    badgeText: "100% SERIES COMPLETE",
    colorTheme: "#10b981", // Emerald/Gold
    bgGradient: "from-emerald-950/90 via-[#0a2418] to-teal-950/90",
    borderColor: "border-emerald-400/60",
    textColor: "text-emerald-300",
    icon: <Crown className="w-8 h-8 text-amber-300 animate-bounce" />,
    creatorTip:
      "Pro Creator Tip: Export the full CSV / Markdown playlist archive! Publish a '100% Walkthrough Full Game Movie' compilation for massive long-term YouTube views.",
  },
};

export const MilestoneCelebrationModal: React.FC<MilestoneCelebrationModalProps> = ({
  isOpen,
  milestone,
  series,
  episodes,
  onClose,
  onOpenExport,
}) => {
  if (!isOpen || !milestone) return null;

  const config = MILESTONE_CONFIGS[milestone.milestone] || MILESTONE_CONFIGS[25];

  const totalEp = episodes.length;
  const publishedCount = episodes.filter((e) => e.status === "published").length;
  const uploadedCount = episodes.filter((e) => e.status === "uploaded").length;
  const editedCount = episodes.filter((e) => e.status === "edited").length;
  const recordedCount = episodes.filter((e) => e.status === "recorded").length;
  const notStartedCount = episodes.filter((e) => e.status === "not_started").length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: "spring", damping: 22, stiffness: 300 }}
          className={`relative w-full max-w-xl bg-gradient-to-br ${config.bgGradient} border-2 ${config.borderColor} rounded-3xl shadow-2xl p-6 sm:p-8 text-white overflow-hidden space-y-6`}
        >
          {/* Background Ambient Glow & Confetti Effect */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-black/40 rounded-full blur-2xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-all cursor-pointer z-10"
            title="Dismiss milestone popup"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Celebration Header */}
          <div className="text-center space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-black uppercase tracking-widest text-white shadow-lg backdrop-blur-md">
              <PartyPopper className="w-4 h-4 text-amber-300 animate-bounce" />
              <span>{config.badgeText}</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            </div>

            <div className="flex justify-center my-2">
              <div className="w-20 h-20 rounded-3xl bg-white/10 border-2 border-white/30 flex items-center justify-center shadow-2xl backdrop-blur-md">
                {config.icon}
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {config.title}
            </h2>

            <p className="text-sm font-semibold text-zinc-200 max-w-md mx-auto">
              {series.gameTitle}: <span className="text-amber-300 font-extrabold">{milestone.milestone}% Production Goal Reached!</span>
            </p>
          </div>

          {/* Progress Breakdown Cards */}
          <div className="bg-black/50 border border-white/15 rounded-2xl p-4 space-y-3 relative z-10">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
              <span className="flex items-center gap-1.5">
                <Film className="w-4 h-4 text-cyan-400" />
                <span>Production Progress</span>
              </span>
              <span className="font-mono text-amber-300">
                {milestone.completedCount} of {totalEp} Episodes Produced
              </span>
            </div>

            {/* Visual Bar */}
            <div className="w-full bg-zinc-800/80 rounded-full h-3.5 p-0.5 border border-white/10 overflow-hidden flex">
              <div
                style={{ width: `${(publishedCount / totalEp) * 100}%` }}
                className="bg-emerald-500 h-full rounded-l-full transition-all"
                title={`Published: ${publishedCount}`}
              />
              <div
                style={{ width: `${(uploadedCount / totalEp) * 100}%` }}
                className="bg-cyan-500 h-full transition-all"
                title={`Uploaded: ${uploadedCount}`}
              />
              <div
                style={{ width: `${(editedCount / totalEp) * 100}%` }}
                className="bg-purple-500 h-full transition-all"
                title={`Edited: ${editedCount}`}
              />
              <div
                style={{ width: `${(recordedCount / totalEp) * 100}%` }}
                className="bg-blue-500 h-full transition-all"
                title={`Recorded: ${recordedCount}`}
              />
            </div>

            {/* Status Breakdown Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-bold">
              <div className="bg-emerald-500/15 border border-emerald-500/30 p-2 rounded-xl text-emerald-300 flex items-center justify-between">
                <span>Published</span>
                <span className="font-mono text-xs">{publishedCount}</span>
              </div>
              <div className="bg-cyan-500/15 border border-cyan-500/30 p-2 rounded-xl text-cyan-300 flex items-center justify-between">
                <span>Uploaded</span>
                <span className="font-mono text-xs">{uploadedCount}</span>
              </div>
              <div className="bg-purple-500/15 border border-purple-500/30 p-2 rounded-xl text-purple-300 flex items-center justify-between">
                <span>Edited</span>
                <span className="font-mono text-xs">{editedCount}</span>
              </div>
              <div className="bg-blue-500/15 border border-blue-500/30 p-2 rounded-xl text-blue-300 flex items-center justify-between">
                <span>Recorded</span>
                <span className="font-mono text-xs">{recordedCount}</span>
              </div>
            </div>
          </div>

          {/* Creator Strategy Tip Box */}
          <div className="bg-white/10 border border-white/20 rounded-2xl p-4 space-y-1.5 relative z-10 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-300 uppercase tracking-wider">
              <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>YouTube Creator Milestone Strategy</span>
            </div>
            <p className="text-xs text-zinc-200 leading-relaxed font-medium">
              {config.creatorTip}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-3 pt-2 relative z-10">
            {onOpenExport && (
              <button
                onClick={() => {
                  onClose();
                  onOpenExport();
                }}
                className="px-4 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-400/40 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Download className="w-4 h-4 text-blue-300" />
                <span>Export Playlist Data</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xl hover:scale-105"
            >
              <span>Keep Creating!</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

/* Persistent Milestone Notifications Center Dropdown */
interface MilestoneBellDropdownProps {
  milestoneHistory: MilestoneRecord[];
  activeSeries: PlaythroughSeries;
  onSelectMilestone: (m: MilestoneRecord) => void;
  onClearHistory: () => void;
}

export const MilestoneBellDropdown: React.FC<MilestoneBellDropdownProps> = ({
  milestoneHistory,
  activeSeries,
  onSelectMilestone,
  onClearHistory,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const unviewedCount = milestoneHistory.filter((m) => !m.viewed).length;

  return (
    <div className="relative">
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
          unviewedCount > 0
            ? "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/20"
            : "bg-[#18181b] border-white/10 text-zinc-300 hover:text-white hover:bg-white/5"
        }`}
        title="Production Milestones & Achievements"
      >
        <Bell className="w-4 h-4" />
        {unviewedCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center border-2 border-[#121212] animate-bounce">
            {unviewedCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop click dismiss */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0f1117] border border-amber-500/30 rounded-2xl shadow-2xl p-4 z-50 text-zinc-100 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-500/20 border border-amber-500/40 rounded-lg text-amber-300">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">
                      Production Milestones
                    </h4>
                    <p className="text-[10px] text-zinc-400">
                      Celebrated 25%, 50%, 75%, and 100% goals
                    </p>
                  </div>
                </div>

                {milestoneHistory.length > 0 && (
                  <button
                    onClick={onClearHistory}
                    className="text-[10px] text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                  >
                    Clear History
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                {milestoneHistory.length === 0 ? (
                  <div className="py-8 text-center space-y-2">
                    <Award className="w-8 h-8 text-zinc-600 mx-auto" />
                    <p className="text-xs font-semibold text-zinc-400">
                      No production milestones unlocked yet
                    </p>
                    <p className="text-[10px] text-zinc-500 max-w-xs mx-auto">
                      Mark episodes as recorded, edited, uploaded, or published to unlock 25%, 50%, 75%, and 100% celebrations!
                    </p>
                  </div>
                ) : (
                  milestoneHistory.map((m) => {
                    const cfg = MILESTONE_CONFIGS[m.milestone] || MILESTONE_CONFIGS[25];
                    return (
                      <div
                        key={m.id}
                        onClick={() => {
                          onSelectMilestone(m);
                          setIsOpen(false);
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          m.viewed
                            ? "bg-[#14161f] border-white/5 hover:border-white/20"
                            : "bg-gradient-to-r from-amber-950/30 to-[#14161f] border-amber-500/40 hover:border-amber-400"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                            <Sparkles className="w-4 h-4 text-amber-300" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-black uppercase text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded border border-amber-500/30">
                                {m.milestone}%
                              </span>
                              <span className="text-xs font-extrabold text-white truncate">
                                {cfg.title}
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-400 truncate">
                              {m.gameTitle} • {m.completedCount}/{m.totalCount} Ep
                            </p>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

/* Milestone Progress Tracker Bar Widget for headers / lists */
interface MilestoneTrackerBarProps {
  episodes: Episode[];
  gameTitle: string;
}

export const MilestoneTrackerBar: React.FC<MilestoneTrackerBarProps> = ({
  episodes,
  gameTitle,
}) => {
  const total = episodes.length;
  if (total === 0) return null;

  const completed = episodes.filter((e) => e.status !== "not_started").length;
  const published = episodes.filter((e) => e.status === "published").length;
  const pct = Math.round((completed / total) * 100);

  // Determine next milestone
  let nextMilestone: MilestonePercent = 25;
  if (pct >= 25 && pct < 50) nextMilestone = 50;
  else if (pct >= 50 && pct < 75) nextMilestone = 75;
  else if (pct >= 75) nextMilestone = 100;

  const neededEpForNext = Math.ceil((nextMilestone / 100) * total) - completed;

  return (
    <div className="bg-[#09090b]/90 border border-amber-500/25 rounded-xl p-2.5 sm:p-3 shadow-lg space-y-2">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-5 h-5 rounded-md bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
            <Trophy className="w-3 h-3" />
          </div>
          <div className="min-w-0 flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-white text-[11px] uppercase tracking-wider shrink-0">
              Milestone Progress
            </span>
            <span className="text-[10px] text-zinc-400 truncate">
              {pct >= 100 ? (
                <strong className="text-emerald-400 font-bold">🎉 100% Complete!</strong>
              ) : (
                <span>
                  Next: <strong className="text-amber-300">{nextMilestone}%</strong> ({neededEpForNext > 0 ? neededEpForNext : 0} ep{neededEpForNext === 1 ? "" : "s"} left)
                  <span className="text-zinc-500 hidden md:inline ml-1">
                    • ~{Math.ceil((total - published) / 3)} wks
                  </span>
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-auto sm:ml-0">
          <span className="font-mono font-black text-amber-300 text-xs bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            {pct}%
          </span>
        </div>
      </div>

      {/* Sleek Compact Progress Bar with embedded milestone markers */}
      <div className="relative pt-0.5">
        <div className="w-full bg-zinc-800/90 rounded-full h-2 overflow-hidden border border-white/10 flex relative">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500 transition-all duration-500 rounded-full"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Milestone Tick Lines */}
        <div className="absolute inset-x-0 top-0.5 h-2 flex justify-between pointer-events-none px-0.5">
          {[25, 50, 75, 100].map((m) => {
            const isReached = pct >= m;
            return (
              <div
                key={m}
                className="flex flex-col items-center"
                style={{ position: "absolute", left: `${m}%`, transform: "translateX(-50%)" }}
              >
                <div
                  className={`w-1.5 h-2.5 rounded-sm transition-all ${
                    isReached
                      ? "bg-amber-300 shadow-sm shadow-amber-500/50"
                      : "bg-zinc-600/80"
                  }`}
                  title={`${m}% Milestone`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Compact Milestone Percent Legend */}
      <div className="flex items-center justify-between text-[9px] font-bold text-zinc-500 px-0.5 pt-0.5">
        <span className={pct >= 25 ? "text-cyan-300 font-extrabold" : ""}>25% Quarter</span>
        <span className={pct >= 50 ? "text-purple-300 font-extrabold" : ""}>50% Halfway</span>
        <span className={pct >= 75 ? "text-amber-300 font-extrabold" : ""}>75% Final Stretch</span>
        <span className={pct >= 100 ? "text-emerald-300 font-extrabold" : ""}>100% Done</span>
      </div>
    </div>
  );
};
