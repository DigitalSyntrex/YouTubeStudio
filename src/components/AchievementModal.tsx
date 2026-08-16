import React, { useState, useEffect } from "react";
import {
  X,
  Trophy,
  Award,
  Sparkles,
  Search,
  CheckCircle2,
  Lock,
  RotateCcw,
  Film,
  Download,
  Image,
  Youtube,
  Swords,
  GitBranch,
  Mic,
  Clock,
  Smartphone,
  Shield,
  Palette,
  Printer,
  Filter,
  Flame,
  Zap
} from "lucide-react";
import { Achievement, AchievementCategory, AchievementRarity } from "../types";
import {
  loadAchievements,
  calculateGamerscore,
  triggerAchievement,
  saveAchievements,
} from "../utils/achievementManager";
import { INITIAL_ACHIEVEMENTS } from "../data/achievementsData";
import { useAuth } from "../context/AuthContext";

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAchievementUpdate?: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Film,
  Download,
  Image,
  Youtube,
  Trophy,
  Sparkles,
  Swords,
  GitBranch,
  Mic,
  Clock,
  Smartphone,
  ShieldCheck: Shield,
  Palette,
  Printer,
};

const RARITY_STYLES: Record<
  AchievementRarity,
  {
    border: string;
    bg: string;
    text: string;
    badgeBg: string;
    glow: string;
  }
> = {
  common: {
    border: "border-slate-700/60",
    bg: "bg-slate-900/60",
    text: "text-slate-300",
    badgeBg: "bg-slate-800 text-slate-300 border-slate-600/50",
    glow: "shadow-slate-900/50",
  },
  rare: {
    border: "border-cyan-500/50",
    bg: "bg-cyan-950/30",
    text: "text-cyan-400",
    badgeBg: "bg-cyan-950/80 text-cyan-300 border-cyan-500/40",
    glow: "shadow-cyan-950/40",
  },
  epic: {
    border: "border-purple-500/60",
    bg: "bg-purple-950/30",
    text: "text-purple-400",
    badgeBg: "bg-purple-950/80 text-purple-300 border-purple-500/50",
    glow: "shadow-purple-950/50",
  },
  legendary: {
    border: "border-amber-400/70",
    bg: "bg-amber-950/30",
    text: "text-amber-300",
    badgeBg: "bg-amber-950/90 text-amber-300 border-amber-400/60",
    glow: "shadow-amber-950/60",
  },
};

export const AchievementModal: React.FC<AchievementModalProps> = ({
  isOpen,
  onClose,
  onAchievementUpdate,
}) => {
  const { userProfile } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRarity, setSelectedRarity] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "unlocked" | "locked">("all");
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAchievements(loadAchievements());
      setConfirmReset(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const stats = calculateGamerscore(achievements);

  const handleResetAchievements = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
      return;
    }
    saveAchievements(INITIAL_ACHIEVEMENTS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setConfirmReset(false);
    if (onAchievementUpdate) onAchievementUpdate();
  };

  const handleTestUnlock = (id: string) => {
    const updated = triggerAchievement(id, 99);
    setAchievements(updated);
    if (onAchievementUpdate) onAchievementUpdate();
  };

  const filteredAchievements = achievements.filter((ach) => {
    // Search query
    const matchesSearch =
      ach.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ach.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Category
    const matchesCategory =
      selectedCategory === "all" || ach.category === selectedCategory;

    // Rarity
    const matchesRarity =
      selectedRarity === "all" || ach.rarity === selectedRarity;

    // Status
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "unlocked" && ach.unlocked) ||
      (statusFilter === "locked" && !ach.unlocked);

    return matchesSearch && matchesCategory && matchesRarity && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-[#0b0f19] border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-950/60 flex flex-col overflow-hidden text-slate-100">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#080d1a] border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Trophy className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                CREATOR GAMER POINTS & TROPHIES
              </h2>
              <p className="text-xs text-slate-400">
                Track production milestones, YouTube optimizations, and creator achievements
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Creator Avatar Chip */}
            <div className="flex items-center gap-2 bg-[#0d1527] px-2.5 py-1.5 rounded-xl border border-cyan-500/30 shadow-inner">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-tr from-cyan-600 to-blue-600 border border-cyan-400/50 flex items-center justify-center text-white text-[10px] font-black shrink-0">
                {userProfile?.avatarUrl ? (
                  <img src={userProfile.avatarUrl} alt="Creator" className="w-full h-full object-cover" />
                ) : (
                  <span>{(userProfile?.displayName || userProfile?.username || "C").slice(0, 2).toUpperCase()}</span>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-black" />
              </div>
              <div className="min-w-0 hidden sm:block text-left">
                <div className="text-[8px] font-black uppercase tracking-widest text-cyan-400">
                  Creator Tag
                </div>
                <div className="text-[11px] font-bold text-white truncate max-w-[100px]">
                  {userProfile?.displayName || userProfile?.username || "Creator"}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Points Summary Banner */}
        <div className="p-5 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-amber-950/30 border-b border-cyan-500/20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {/* Points Total Box */}
            <div className="bg-[#0e1626]/80 p-4 rounded-xl border border-amber-500/30 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-amber-500/20 text-amber-300 font-bold">
                <Trophy className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                  Total Gamer Points
                </span>
                <div className="text-2xl font-black text-amber-300 flex items-baseline gap-1">
                  <span>{stats.unlockedScore.toLocaleString()}</span>
                  <span className="text-xs text-slate-400 font-normal">
                    / {stats.totalScore.toLocaleString()} GP
                  </span>
                </div>
              </div>
            </div>

            {/* Trophies Unlocked Box */}
            <div className="bg-[#0e1626]/80 p-4 rounded-xl border border-cyan-500/30 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold">
                <Award className="w-7 h-7 text-cyan-400" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                  Trophies Earned
                </span>
                <div className="text-2xl font-black text-cyan-300 flex items-baseline gap-1">
                  <span>{stats.unlockedCount}</span>
                  <span className="text-xs text-slate-400 font-normal">
                    / {stats.totalCount} Unlocked
                  </span>
                </div>
              </div>
            </div>

            {/* Overall Completion Box */}
            <div className="bg-[#0e1626]/80 p-4 rounded-xl border border-purple-500/30 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-500/20 text-purple-300 font-bold">
                <Sparkles className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                  Completion
                </span>
                <div className="text-2xl font-black text-purple-300">
                  {stats.percentage}%
                </div>
              </div>
            </div>
          </div>

          {/* Points Progress Bar */}
          <div>
            <div className="flex justify-between items-center text-xs text-slate-300 mb-1.5 font-medium">
              <span>Overall Studio Points Progress</span>
              <span className="text-amber-400 font-bold">{stats.percentage}% Complete</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-400 rounded-full transition-all duration-700 shadow-md shadow-amber-500/30"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 bg-[#080d1a] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search achievements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Filter Dropdowns & Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Categories</option>
              <option value="production">Production</option>
              <option value="seo">SEO & Tags</option>
              <option value="thumbnail">Thumbnails</option>
              <option value="lore_boss">Lore & Bosses</option>
              <option value="branding">Branding</option>
            </select>

            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Rarities</option>
              <option value="common">Common</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "unlocked" | "locked")}
              className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Statuses</option>
              <option value="unlocked">Unlocked Only</option>
              <option value="locked">Locked Only</option>
            </select>

            <button
              onClick={handleResetAchievements}
              className={`p-1.5 rounded-xl border transition-all text-xs flex items-center gap-1.5 ml-auto sm:ml-0 font-bold cursor-pointer ${
                confirmReset
                  ? "bg-rose-600 hover:bg-rose-500 text-white border-rose-400 animate-pulse px-2.5"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border-slate-700"
              }`}
              title={confirmReset ? "Click again to confirm reset" : "Reset Achievements Progress"}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {confirmReset && <span className="text-[11px]">Confirm Reset?</span>}
            </button>
          </div>
        </div>

        {/* Achievement Grid */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-4 custom-scrollbar">
          {filteredAchievements.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-500" />
              <p className="text-sm font-bold">No achievements found</p>
              <p className="text-xs text-slate-500">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            filteredAchievements.map((ach) => {
              const style = RARITY_STYLES[ach.rarity] || RARITY_STYLES.common;
              const IconComp = ICON_MAP[ach.iconName] || Trophy;
              const progressPct = Math.round((ach.progress / ach.maxProgress) * 100);

              return (
                <div
                  key={ach.id}
                  className={`relative p-4 rounded-xl border ${
                    ach.unlocked
                      ? `${style.border} ${style.bg} ${style.glow}`
                      : "border-slate-800 bg-slate-950/40 opacity-75 hover:opacity-100"
                  } transition-all duration-300 flex flex-col justify-between group`}
                >
                  {/* Top Content Row */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        {/* Icon Badge */}
                        <div
                          className={`p-3 rounded-xl border ${
                            ach.unlocked
                              ? `${style.border} bg-slate-900/90 ${style.text}`
                              : "border-slate-800 bg-slate-900/40 text-slate-600"
                          } shrink-0 transition-all`}
                        >
                          <IconComp className="w-6 h-6" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3
                              className={`text-sm font-black ${
                                ach.unlocked ? "text-white" : "text-slate-400"
                              }`}
                            >
                              {ach.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${style.badgeBg}`}
                            >
                              {ach.rarity}
                            </span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wide font-medium">
                              {ach.category.replace("_", " & ")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Points Pill */}
                      <div
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-black shrink-0 ${
                          ach.unlocked
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                            : "bg-slate-900 text-slate-500 border-slate-800"
                        }`}
                      >
                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                        <span>+{ach.points} GP</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {ach.description}
                    </p>
                  </div>

                  {/* Bottom Progress & Unlock Status */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    {ach.unlocked ? (
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Unlocked {ach.unlockedAt ? `• ${ach.unlockedAt}` : ""}</span>
                      </div>
                    ) : (
                      <div className="flex-1 mr-3">
                        <div className="flex justify-between text-[11px] text-slate-400 mb-1 font-medium">
                          <span className="flex items-center gap-1 text-slate-500">
                            <Lock className="w-3 h-3" /> Progress
                          </span>
                          <span>
                            {ach.progress} / {ach.maxProgress}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-cyan-500 rounded-full transition-all duration-300"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Quick Demo Test Unlock button */}
                    {!ach.unlocked && (
                      <button
                        onClick={() => handleTestUnlock(ach.id)}
                        className="opacity-0 group-hover:opacity-100 px-2 py-1 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 rounded text-[10px] font-bold transition-opacity"
                        title="Quick Unlock Demo"
                      >
                        Unlock
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3 bg-[#080d1a] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Achievements automatically unlock as you build and publish your playthrough series.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs border border-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
