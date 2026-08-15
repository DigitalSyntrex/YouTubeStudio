import React, { useEffect, useState } from "react";
import { Trophy, X, Sparkles, Flame, Shield, Award, Youtube, Film, Download, Image, Swords, GitBranch, Mic, Clock, Smartphone, Palette, Printer } from "lucide-react";
import { AchievementUnlockToastData, AchievementRarity } from "../types";

interface AchievementToastProps {
  toastData: AchievementUnlockToastData | null;
  onClose: () => void;
}

const RARITY_STYLES: Record<AchievementRarity, { border: string; bg: string; text: string; glow: string; badgeBg: string }> = {
  common: {
    border: "border-slate-500/50",
    bg: "from-slate-900/95 via-slate-950/95 to-slate-900/95",
    text: "text-slate-300",
    glow: "shadow-slate-500/20",
    badgeBg: "bg-slate-700/60 text-slate-200 border-slate-500/40",
  },
  rare: {
    border: "border-cyan-500/60",
    bg: "from-cyan-950/95 via-slate-950/95 to-cyan-900/95",
    text: "text-cyan-400",
    glow: "shadow-cyan-500/30",
    badgeBg: "bg-cyan-900/60 text-cyan-300 border-cyan-500/50",
  },
  epic: {
    border: "border-purple-500/70",
    bg: "from-purple-950/95 via-slate-950/95 to-purple-900/95",
    text: "text-purple-400",
    glow: "shadow-purple-500/40",
    badgeBg: "bg-purple-900/60 text-purple-300 border-purple-500/60",
  },
  legendary: {
    border: "border-amber-400/80",
    bg: "from-amber-950/95 via-slate-950/95 to-amber-900/95",
    text: "text-amber-300",
    glow: "shadow-amber-500/50",
    badgeBg: "bg-amber-900/70 text-amber-200 border-amber-400/70",
  },
};

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

export const AchievementToast: React.FC<AchievementToastProps> = ({ toastData, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toastData) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Allow fade-out animation before clearing
      }, 5500);

      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [toastData, onClose]);

  if (!toastData) return null;

  const { achievement } = toastData;
  const style = RARITY_STYLES[achievement.rarity] || RARITY_STYLES.common;
  const IconComponent = ICON_MAP[achievement.iconName] || Trophy;

  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ease-out transform ${
        visible ? "translate-y-0 opacity-100 scale-100" : "-translate-y-10 opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div
        className={`relative flex items-center gap-4 px-5 py-3.5 rounded-2xl bg-gradient-to-r ${style.bg} border ${style.border} shadow-2xl ${style.glow} backdrop-blur-xl max-w-md w-[92vw] sm:w-[440px]`}
      >
        {/* Glowing Trophy Icon Ring */}
        <div className={`p-3 rounded-xl bg-slate-900/90 border ${style.border} flex items-center justify-center shrink-0 shadow-inner`}>
          <IconComponent className={`w-7 h-7 ${style.text} animate-bounce`} />
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-1">
              <Award className="w-3 h-3" /> ACHIEVEMENT UNLOCKED
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${style.badgeBg}`}>
              {achievement.rarity}
            </span>
          </div>

          <h4 className="text-sm font-black text-white truncate flex items-center gap-2">
            {achievement.title}
          </h4>

          <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{achievement.description}</p>
        </div>

        {/* Points Pill */}
        <div className="flex flex-col items-end shrink-0 pl-1">
          <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-400/50 px-2 py-1 rounded-lg font-black text-xs shadow-sm">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>+{achievement.points} GP</span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            setVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors -mr-1"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
