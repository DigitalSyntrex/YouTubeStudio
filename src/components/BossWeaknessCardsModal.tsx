import React, { useState } from "react";
import { HoloFoilCard } from "./HoloFoilCard";
import { safeSetLocalStorage } from "../utils/storageUtils";
import {
  X,
  Swords,
  Search,
  Filter,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Copy,
  Check,
  Zap,
  Flame,
  Snowflake,
  Skull,
  Sparkles,
  Gift,
  ShieldAlert,
  MapPin,
  Heart,
  Grid,
  List,
  Layers,
  Award,
} from "lucide-react";
import { BossEntry, PlaythroughSeries } from "../types";
import { getBossAndLootForSeries } from "../data/bossLootData";

interface BossWeaknessCardsModalProps {
  activeSeries?: PlaythroughSeries;
  onClose: () => void;
}

export const BossWeaknessCardsModal: React.FC<BossWeaknessCardsModalProps> = ({
  activeSeries,
  onClose,
}) => {
  const seriesId = activeSeries?.id || "default";

  // Load bosses with local storage persistence
  const [bosses, setBosses] = useState<BossEntry[]>(() => {
    const saved = localStorage.getItem(`yt_bosses_${seriesId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return getBossAndLootForSeries(activeSeries).bosses;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [elementFilter, setElementFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Defeated" | "Missable">("All");
  const [viewMode, setViewMode] = useState<"cards" | "compact">("cards");
  const [copiedCheatSheet, setCopiedCheatSheet] = useState(false);

  // Sync state back to localStorage
  const handleToggleDefeated = (id: string) => {
    const updated = bosses.map((b) => (b.id === id ? { ...b, defeated: !b.defeated } : b));
    setBosses(updated);
    safeSetLocalStorage(`yt_bosses_${seriesId}`, updated);
  };

  // Helper function to extract elemental weakness badges
  const parseWeaknessBadges = (weaknessStr: string) => {
    if (!weaknessStr || weaknessStr.toLowerCase() === "none") {
      return [{ label: "None / Neutral", bg: "bg-zinc-800 text-zinc-400 border-zinc-700", icon: null }];
    }

    const lower = weaknessStr.toLowerCase();
    const badges: { label: string; bg: string; icon: React.ReactNode }[] = [];

    if (lower.includes("fire")) {
      badges.push({ label: "Fire", bg: "bg-orange-500/20 text-orange-300 border-orange-500/40", icon: <Flame className="w-3 h-3 text-orange-400" /> });
    }
    if (lower.includes("ice") || lower.includes("cold") || lower.includes("frost")) {
      badges.push({ label: "Ice", bg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40", icon: <Snowflake className="w-3 h-3 text-cyan-400" /> });
    }
    if (lower.includes("lightning") || lower.includes("thunder") || lower.includes("bolt")) {
      badges.push({ label: "Lightning", bg: "bg-amber-500/20 text-amber-300 border-amber-500/40", icon: <Zap className="w-3 h-3 text-amber-400" /> });
    }
    if (lower.includes("holy") || lower.includes("sacred") || lower.includes("pearl")) {
      badges.push({ label: "Holy", bg: "bg-yellow-500/20 text-yellow-200 border-yellow-500/40", icon: <Sparkles className="w-3 h-3 text-yellow-300" /> });
    }
    if (lower.includes("poison") || lower.includes("bio") || lower.includes("venom")) {
      badges.push({ label: "Poison", bg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40", icon: <Skull className="w-3 h-3 text-emerald-400" /> });
    }
    if (lower.includes("water")) {
      badges.push({ label: "Water", bg: "bg-blue-500/20 text-blue-300 border-blue-500/40", icon: <span className="text-xs">💧</span> });
    }
    if (lower.includes("wind")) {
      badges.push({ label: "Wind", bg: "bg-teal-500/20 text-teal-300 border-teal-500/40", icon: <span className="text-xs">💨</span> });
    }
    if (lower.includes("phoenix down") || lower.includes("instakill") || lower.includes("undead")) {
      badges.push({ label: "Instakill / Undead", bg: "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse", icon: <AlertTriangle className="w-3 h-3 text-red-400" /> });
    }

    if (badges.length === 0) {
      badges.push({ label: weaknessStr, bg: "bg-purple-500/20 text-purple-300 border-purple-500/40", icon: <Zap className="w-3 h-3 text-purple-400" /> });
    }

    return badges;
  };

  const gameTitle = (activeSeries?.gameTitle || "").toLowerCase();
  const gameGenre = (activeSeries?.gameGenre || "").toLowerCase();
  const currentSeriesId = (activeSeries?.id || "").toLowerCase();
  const isRE = currentSeriesId.includes("resident-evil") || currentSeriesId.includes("re4") || gameTitle.includes("resident evil") || gameTitle.includes("re4") || gameGenre.includes("survival horror");
  const isElden = currentSeriesId.includes("elden") || gameTitle.includes("elden ring") || gameTitle.includes("erdtree") || gameGenre.includes("soulslike");
  const isZelda = currentSeriesId.includes("zelda") || currentSeriesId.includes("totk") || gameTitle.includes("zelda") || gameTitle.includes("tears of the kingdom");
  const isCyberpunk = currentSeriesId.includes("cyberpunk") || gameTitle.includes("cyberpunk");
  const isNonStealGame = isRE || isElden || isZelda || isCyberpunk;

  const hasValidSteal = (b: BossEntry) => {
    if (isNonStealGame) return false;
    const rare = (b.stealRare || "").trim().toLowerCase();
    const common = (b.stealCommon || "").trim().toLowerCase();
    const invalid = ["none", "n/a", "none / n/a", ""];
    return !invalid.includes(rare) || !invalid.includes(common);
  };

  // Filter Logic
  const filteredBosses = bosses.filter((b) => {
    const matchesSearch =
      searchQuery === "" ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.weakness.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.stealCommon.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.dropLoot.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesElement =
      elementFilter === "All" || b.weakness.toLowerCase().includes(elementFilter.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Pending" && !b.defeated) ||
      (statusFilter === "Defeated" && b.defeated) ||
      (statusFilter === "Missable" && b.isMissable);

    return matchesSearch && matchesElement && matchesStatus;
  });

  // Calculate statistics
  const totalBosses = bosses.length;
  const defeatedCount = bosses.filter((b) => b.defeated).length;
  const pendingCount = totalBosses - defeatedCount;
  const missableCount = bosses.filter((b) => b.isMissable && !b.defeated).length;

  // Copy Cheat Sheet
  const handleCopyCheatSheet = () => {
    const lines = filteredBosses.map(
      (b) =>
        `• ${b.name} (Part ${b.episodePart} - ${b.location}): HP ${b.hp} | Weakness: [${b.weakness}] | Steal: ${b.stealRare !== "None" ? b.stealRare : b.stealCommon} | Tip: ${b.strategyTip}`
    );

    const cheatText = `🎮 ${activeSeries?.gameTitle || "Game"} BOSS WEAKNESS CHEAT SHEET (${defeatedCount}/${totalBosses} Defeated)\n\n` + lines.join("\n\n");

    navigator.clipboard.writeText(cheatText);
    setCopiedCheatSheet(true);
    setTimeout(() => setCopiedCheatSheet(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#121212] border border-red-500/30 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-[#09090b] border-b border-white/10 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 shadow-inner">
              <Swords className="w-6 h-6 text-red-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-zinc-100">{activeSeries?.gameTitle || "Game"}</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-300 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                  Quick Boss Weakness Cards
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Instant elemental vulnerability cheat-sheets, HP stats, steal tables & strategy tips for live recording.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCheatSheet}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-300 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 rounded-xl transition-all cursor-pointer"
              title="Copy Boss Weakness Cheat Sheet for streaming overlays or notes"
            >
              {copiedCheatSheet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-red-400" />}
              <span>{copiedCheatSheet ? "Copied Cheat Sheet!" : "Copy Cheat Sheet"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-100 bg-[#18181b] hover:bg-[#27272a] rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="p-4 bg-[#0d0d10] border-b border-white/5 flex flex-wrap items-center justify-between gap-4 shrink-0 text-xs">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Boss Progress</span>
              <span className="text-zinc-100 font-extrabold text-sm">
                {defeatedCount} / {totalBosses} Defeated ({totalBosses > 0 ? Math.round((defeatedCount / totalBosses) * 100) : 0}%)
              </span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Remaining</span>
              <span className="text-amber-300 font-bold text-xs">{pendingCount} Bosses Ahead</span>
            </div>
          </div>

          {missableCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-xs font-semibold animate-pulse">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{missableCount} Missable Boss Item / Encounter Warnings!</span>
            </div>
          )}

          {/* View Toggle */}
          <div className="flex items-center bg-[#18181b] border border-white/10 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("cards")}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                viewMode === "cards" ? "bg-red-600 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid Cards</span>
            </button>
            <button
              onClick={() => setViewMode("compact")}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                viewMode === "compact" ? "bg-red-600 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Compact Cheat List</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 bg-[#121212] border-b border-white/5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Elemental Filters */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-zinc-500 text-[10px] uppercase font-bold pr-1">Weakness:</span>
            {["All", "Fire", "Ice", "Lightning", "Holy", "Poison", "Water"].map((elem) => (
              <button
                key={elem}
                onClick={() => setElementFilter(elem)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  elementFilter === elem
                    ? "bg-red-600 text-white shadow-sm"
                    : "bg-[#18181b] text-zinc-400 hover:text-zinc-200 border border-white/5"
                }`}
              >
                {elem}
              </button>
            ))}
          </div>

          {/* Search & Status Filters */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search boss, weakness, drop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-[#18181b] border border-white/10 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-red-500/50 w-44 sm:w-56"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-[#18181b] border border-white/10 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-red-500/50"
            >
              <option value="All">All Bosses</option>
              <option value="Pending">Pending Only</option>
              <option value="Defeated">Defeated Only</option>
              <option value="Missable">Missable Warnings</option>
            </select>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 overflow-y-auto flex-1">
          {filteredBosses.length === 0 ? (
            <div className="text-center py-12 bg-[#09090b] rounded-2xl border border-white/5 space-y-2">
              <Swords className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-sm font-semibold text-zinc-400">No boss weakness cards found matching criteria.</p>
            </div>
          ) : viewMode === "cards" ? (
            /* Cards View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredBosses.map((boss) => {
                const weaknessBadges = parseWeaknessBadges(boss.weakness);

                return (
                  <HoloFoilCard
                    key={boss.id}
                    className={`p-4 rounded-xl border transition-all space-y-3 relative flex flex-col justify-between ${
                      boss.defeated
                        ? "bg-zinc-950/40 border-zinc-800 text-zinc-500 opacity-75 hover:opacity-100"
                        : "bg-[#18181b]/90 border-red-500/30 hover:border-red-500/60 text-zinc-100 shadow-lg shadow-black/40"
                    }`}
                  >
                    {/* Top Row: Name & Defeated Check */}
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400">
                            <span className="text-red-400">Ep {boss.episodePart}</span>
                            <span>•</span>
                            <span>{boss.world}</span>
                          </div>
                          <h3 className={`text-sm font-extrabold ${boss.defeated ? "line-through text-zinc-400" : "text-white"}`}>
                            {boss.name}
                          </h3>
                        </div>

                        <button
                          onClick={() => handleToggleDefeated(boss.id)}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer shrink-0 ${
                            boss.defeated
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30"
                              : "bg-zinc-900 text-zinc-400 border-white/10 hover:text-zinc-200"
                          }`}
                          title={boss.defeated ? "Mark as Pending" : "Mark as Defeated"}
                        >
                          {boss.defeated ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4" />}
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                        <span className="text-zinc-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                          <span className="truncate max-w-[180px]">{boss.location}</span>
                        </span>
                        <span className="font-extrabold text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-500/20 text-[11px] flex items-center gap-1">
                          <Heart className="w-3 h-3 text-red-500 fill-red-500/30" />
                          <span>HP {boss.hp}</span>
                        </span>
                      </div>
                    </div>

                    {/* Weakness Badges Box */}
                    <div className="p-2.5 bg-[#09090b] rounded-lg border border-white/5 space-y-1.5">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400">
                        Elemental Vulnerabilities
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {weaknessBadges.map((badge, idx) => (
                          <span
                            key={idx}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold border ${badge.bg}`}
                          >
                            {badge.icon}
                            <span>{badge.label}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Steal & Drop Loot Table */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-zinc-950/60 p-2 rounded-lg border border-white/5">
                      {hasValidSteal(boss) ? (
                        <>
                          <div>
                            <span className="text-zinc-500 block text-[9px] uppercase font-extrabold">Steal Items</span>
                            <span className="text-amber-300 font-semibold block truncate">
                              {boss.stealRare !== "None" ? `Rare: ${boss.stealRare}` : boss.stealCommon}
                            </span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block text-[9px] uppercase font-extrabold">Drop Loot</span>
                            <span className="text-emerald-300 font-semibold block truncate">{boss.dropLoot}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <span className="text-zinc-500 block text-[9px] uppercase font-extrabold">Encounter Zone</span>
                            <span className="text-amber-300 font-semibold block truncate">{boss.location}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block text-[9px] uppercase font-extrabold">Guaranteed Reward</span>
                            <span className="text-emerald-300 font-semibold block truncate">{boss.dropLoot || "Victory Reward"}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Strategy Tip */}
                    <p className="text-[11px] text-zinc-300 bg-red-950/20 border-l-2 border-red-500/50 pl-2 py-1 leading-snug italic">
                      "{boss.strategyTip}"
                    </p>
                  </HoloFoilCard>
                );
              })}
            </div>
          ) : (
            /* Compact Table List View */
            <div className="bg-[#18181b] rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full text-left text-xs text-zinc-200">
                <thead className="bg-[#09090b] text-[10px] uppercase font-extrabold text-zinc-400 border-b border-white/10">
                  <tr>
                    <th className="p-3">Status</th>
                    <th className="p-3">Boss Name</th>
                    <th className="p-3">Location & Ep</th>
                    <th className="p-3">HP</th>
                    <th className="p-3">Weakness</th>
                    <th className="p-3">Steal / Drop Loot</th>
                    <th className="p-3">Pro Tip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredBosses.map((boss) => {
                    const weaknessBadges = parseWeaknessBadges(boss.weakness);
                    return (
                      <tr
                        key={boss.id}
                        className={`hover:bg-white/5 transition-colors ${boss.defeated ? "opacity-50 line-through" : ""}`}
                      >
                        <td className="p-3">
                          <button
                            onClick={() => handleToggleDefeated(boss.id)}
                            className="p-1 text-zinc-400 hover:text-emerald-400"
                          >
                            {boss.defeated ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4" />}
                          </button>
                        </td>
                        <td className="p-3 font-bold text-white">{boss.name}</td>
                        <td className="p-3 text-zinc-400">
                          {boss.location} <span className="text-red-400 text-[10px] font-bold">(Ep {boss.episodePart})</span>
                        </td>
                        <td className="p-3 font-extrabold text-red-300">{boss.hp}</td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {weaknessBadges.map((b, idx) => (
                              <span key={idx} className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${b.bg}`}>
                                {b.label}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-[11px]">
                          {hasValidSteal(boss) ? (
                            <>
                              <div className="text-amber-300 font-medium">Steal: {boss.stealRare !== "None" ? boss.stealRare : boss.stealCommon}</div>
                              <div className="text-emerald-300 font-medium">Drop: {boss.dropLoot}</div>
                            </>
                          ) : (
                            <div className="text-emerald-300 font-medium">Reward: {boss.dropLoot || "Victory Reward"}</div>
                          )}
                        </td>
                        <td className="p-3 text-[11px] text-zinc-300 max-w-xs leading-tight">{boss.strategyTip}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
