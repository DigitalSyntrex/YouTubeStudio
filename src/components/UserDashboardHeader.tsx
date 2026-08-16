import React from "react";
import {
  User,
  Settings,
  LogOut,
  Sparkles,
  Gamepad2,
  Tv,
  Film,
  Layers,
  Clock,
  ChevronRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award,
  KeyRound,
  Crown
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSubscription } from "../context/SubscriptionContext";
import { useAdmin } from "../context/AdminContext";
import { PlaythroughSeries } from "../types";

interface UserDashboardHeaderProps {
  seriesList: PlaythroughSeries[];
  onOpenSettings: (defaultTab?: "overview" | "achievements" | "subscription" | "profile" | "preferences") => void;
  onOpenNewSeries: () => void;
  onOpenAdmin?: () => void;
}

export const UserDashboardHeader: React.FC<UserDashboardHeaderProps> = ({
  seriesList,
  onOpenSettings,
  onOpenNewSeries,
  onOpenAdmin,
}) => {
  const { userProfile, logout } = useAuth();
  const { entitlement } = useSubscription();
  const { isAdmin } = useAdmin();

  const totalEpisodes = seriesList.reduce((acc, s) => acc + (s.episodes?.length || 0), 0);
  const totalCompleted = seriesList.reduce(
    (acc, s) =>
      acc +
      (s.episodes?.filter((e) => e.status === "published" || e.status === "uploaded").length || 0),
    0
  );
  const completionRate = totalEpisodes > 0 ? Math.round((totalCompleted / totalEpisodes) * 100) : 0;

  return (
    <div className="bg-gradient-to-r from-[#0d1222] via-[#090c17] to-[#0d111d] border-b border-blue-500/20 text-zinc-100 py-3.5 px-4 sm:px-6 lg:px-8 shadow-xl relative z-30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Left: User Profile badge & Channel info */}
        <div
          onClick={() => onOpenSettings("overview")}
          className="flex items-center gap-3.5 min-w-0 cursor-pointer group p-1 -m-1 rounded-2xl hover:bg-white/5 transition-all"
          title="Click to customize Creator Avatar & Profile Settings"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-400/40 group-hover:border-cyan-400 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-900/40 transition-all">
              {userProfile?.avatarUrl ? (
                <img src={userProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{(userProfile?.displayName || userProfile?.username || "U").slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#090c17]" title="Online - Cloud Sync Active" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-white group-hover:text-cyan-300 transition-colors truncate">
                {userProfile?.displayName || userProfile?.username || "Creator"}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 border border-blue-500/30 shrink-0">
                Creator
              </span>
            </div>
            <p className="text-xs text-zinc-400 truncate flex items-center gap-2">
              <span>{userProfile?.channelName || "YouTube Playthroughs"}</span>
              {userProfile?.bio && <span className="hidden md:inline text-zinc-500">• {userProfile.bio}</span>}
            </p>
          </div>
        </div>

        {/* Center: Creator stats badge bar */}
        <div className="hidden lg:flex items-center gap-4 bg-[#060810] px-4 py-1.5 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2 text-xs">
            <Gamepad2 className="w-4 h-4 text-blue-400" />
            <span className="text-zinc-400">Series:</span>
            <span className="font-bold text-white">{seriesList.length}</span>
          </div>
          <div className="w-px h-3.5 bg-white/10" />
          <div className="flex items-center gap-2 text-xs">
            <Film className="w-4 h-4 text-purple-400" />
            <span className="text-zinc-400">Episodes:</span>
            <span className="font-bold text-white">{totalEpisodes}</span>
          </div>
          <div className="w-px h-3.5 bg-white/10" />
          <div className="flex items-center gap-2 text-xs">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-zinc-400">Published:</span>
            <span className="font-bold text-emerald-300">{completionRate}%</span>
          </div>
        </div>

        {/* Right: Admin Portal, Have a key, Account Settings & Log Out */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Admin Control Portal Button (Visible for Syntrex and Master Admins) */}
          {isAdmin && onOpenAdmin && (
            <button
              type="button"
              onClick={() => onOpenAdmin()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-900/60 via-purple-800/60 to-indigo-900/60 hover:from-purple-800 hover:to-indigo-800 border border-purple-400/50 text-purple-200 hover:text-white text-xs font-black transition-all shadow-md shadow-purple-900/30 cursor-pointer animate-pulse"
              title="Open Admin Master Control Portal (Key Vault, Generator & Site Controls)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Admin Portal</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onOpenSettings("subscription")}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-amber-600/15 hover:from-amber-500/25 hover:to-amber-600/25 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Redeem a 17-digit Product Key (DPGXXXXXXYYXXXXXX)"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Have a key?</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenSettings("overview")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#090e1c] hover:bg-blue-950/60 border border-blue-500/30 text-zinc-200 hover:text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Adjust Account Settings & Dashboard Customization"
          >
            <Settings className="w-3.5 h-3.5 text-blue-400" />
            <span>Settings</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/30 hover:bg-red-950/60 border border-red-500/30 text-red-300 hover:text-red-200 text-xs font-semibold transition-all cursor-pointer"
            title="Sign Out of Creator Account"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
