import React, { useState } from "react";
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
  Plus,
  Layers,
  Award,
  Clock,
  RotateCcw,
  Shield,
  FileText,
  ChevronRight
} from "lucide-react";
import { BossEntry, PlaythroughSeries } from "../types";
import { getBossAndLootForSeries } from "../data/bossLootData";
import { safeSetLocalStorage } from "../utils/storageUtils";

interface BossEncounterPlannerModalProps {
  activeSeries?: PlaythroughSeries;
  onClose: () => void;
}

interface RetryLog {
  bossId: string;
  attempts: number;
  notes: string;
}

export const BossEncounterPlannerModal: React.FC<BossEncounterPlannerModalProps> = ({
  activeSeries,
  onClose
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

  // Retry counts persistence
  const [retries, setRetries] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem(`yt_boss_retries_${seriesId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {};
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Defeated" | "Missable">("All");
  const [selectedBoss, setSelectedBoss] = useState<BossEntry | null>(bosses[0] || null);
  const [copiedTimestamp, setCopiedTimestamp] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Boss Form State
  const [newBossName, setNewBossName] = useState("");
  const [newBossEpisode, setNewBossEpisode] = useState<number>(1);
  const [newBossLocation, setNewBossLocation] = useState("");
  const [newBossWorld, setNewBossWorld] = useState("World of Balance");
  const [newBossHp, setNewBossHp] = useState("");
  const [newBossWeakness, setNewBossWeakness] = useState("");
  const [newBossDrop, setNewBossDrop] = useState("");
  const [newBossStrategy, setNewBossStrategy] = useState("");
  const [newBossMissable, setNewBossMissable] = useState(false);

  const saveBosses = (updated: BossEntry[]) => {
    setBosses(updated);
    safeSetLocalStorage(`yt_bosses_${seriesId}`, updated);
  };

  const handleToggleDefeated = (id: string) => {
    const updated = bosses.map((b) => (b.id === id ? { ...b, defeated: !b.defeated } : b));
    saveBosses(updated);
    if (selectedBoss?.id === id) {
      setSelectedBoss((prev) => (prev ? { ...prev, defeated: !prev.defeated } : null));
    }
  };

  const handleAddAttempt = (bossId: string) => {
    const current = retries[bossId] || 0;
    const updated = { ...retries, [bossId]: current + 1 };
    setRetries(updated);
    safeSetLocalStorage(`yt_boss_retries_${seriesId}`, updated);
  };

  const handleResetAttempt = (bossId: string) => {
    const updated = { ...retries, [bossId]: 0 };
    setRetries(updated);
    safeSetLocalStorage(`yt_boss_retries_${seriesId}`, updated);
  };

  const handleCreateBoss = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBossName) return;

    const created: BossEntry = {
      id: `boss_custom_${Date.now()}`,
      name: newBossName,
      episodePart: newBossEpisode,
      location: newBossLocation || "Unknown Area",
      world: newBossWorld,
      hp: newBossHp || "10,000 HP",
      weakness: newBossWeakness || "Fire / Lightning",
      stealCommon: "Potion",
      stealRare: "Elixir",
      dropLoot: newBossDrop || "Boss Trophy",
      strategyTip: newBossStrategy || "Use elemental weaknesses and maintain party HP.",
      isMissable: newBossMissable,
      defeated: false
    };

    const updated = [...bosses, created];
    saveBosses(updated);
    setSelectedBoss(created);
    setShowAddModal(false);

    // Reset Form
    setNewBossName("");
    setNewBossHp("");
    setNewBossWeakness("");
    setNewBossDrop("");
    setNewBossStrategy("");
  };

  const getBossPreparationTips = (boss: BossEntry): string[] => {
    const tips: string[] = [];
    const gameTitle = (activeSeries?.gameTitle || "").toLowerCase();
    const gameGenre = (activeSeries?.gameGenre || "").toLowerCase();
    const seriesId = (activeSeries?.id || "").toLowerCase();

    // Determine game category context
    const isRE = seriesId.includes("resident-evil") || seriesId.includes("re4") || gameTitle.includes("resident evil") || gameTitle.includes("re4") || gameGenre.includes("survival horror");
    const isElden = seriesId.includes("elden") || gameTitle.includes("elden ring") || gameTitle.includes("erdtree") || gameGenre.includes("soulslike");
    const isZelda = seriesId.includes("zelda") || seriesId.includes("totk") || gameTitle.includes("zelda") || gameTitle.includes("tears of the kingdom") || gameTitle.includes("breath of the wild");
    const isCyberpunk = seriesId.includes("cyberpunk") || gameTitle.includes("cyberpunk") || gameTitle.includes("starfield") || gameTitle.includes("mass effect");
    const isJRPG = seriesId.includes("ff6") || seriesId.includes("ff16") || seriesId.includes("chrono") || gameTitle.includes("final fantasy") || gameTitle.includes("chrono") || gameGenre.includes("jrpg") || gameGenre.includes("rpg");

    // 1. Weakness / Elemental Preparation
    const rawWeakness = (boss.weakness || "").trim().toLowerCase();
    const isInvalidWeakness = !rawWeakness || ["none", "n/a", "none / n/a", "strategy dependent", ""].includes(rawWeakness);

    if (!isInvalidWeakness) {
      if (isRE) {
        tips.push(
          `Target Weakness (${boss.weakness}): Equip Shotgun, Rifle or Magnum ammo to target this critical vulnerability.`
        );
      } else if (isElden) {
        tips.push(
          `Exploit Weakness (${boss.weakness}): Apply ${boss.weakness} greases, incantations, or affinity Ashes of War.`
        );
      } else if (isZelda) {
        tips.push(
          `Exploit Weakness (${boss.weakness}): Fuse ${boss.weakness} monster parts / elemental fruit to arrows.`
        );
      } else {
        tips.push(
          `Exploit Weakness (${boss.weakness}): Equip gear, abilities, or elemental magic that deal ${boss.weakness} damage.`
        );
      }
    } else {
      if (isRE) {
        tips.push(
          `No Specific Weakness: Aim for headshots or exposed parasites with high-firepower Shotgun, Magnum, or Heavy Grenades.`
        );
      } else if (isElden) {
        tips.push(
          `No Elemental Weakness: Focus on high physical Stance damage (Jump Attacks / Charged Heavy Hits) for Stagger ripostes.`
        );
      } else {
        tips.push(
          `No Elemental Weakness: Focus on high raw physical attacks, defense-ignoring skills, or heavy staggered strikes.`
        );
      }
    }

    // 2. Steal / Loot Opportunity (STRICTLY ONLY for games with Steal mechanics AND valid steal items)
    const isNonStealGame = isRE || isElden || isZelda || isCyberpunk;

    if (!isNonStealGame) {
      const rawStealRare = (boss.stealRare || "").trim().toLowerCase();
      const rawStealCommon = (boss.stealCommon || "").trim().toLowerCase();
      const isInvalidRare = !rawStealRare || ["none", "n/a", "none / n/a", ""].includes(rawStealRare);
      const isInvalidCommon = !rawStealCommon || ["none", "n/a", "none / n/a", ""].includes(rawStealCommon);

      if (!isInvalidRare) {
        tips.push(
          `Rare Steal Opportunity: Attempt to steal ${boss.stealRare} (Common: ${boss.stealCommon || "None"}) before dealing lethal damage.`
        );
      } else if (!isInvalidCommon) {
        tips.push(
          `Steal Item: Attempt to steal ${boss.stealCommon} during Phase 1 setup.`
        );
      }
    }

    // 3. Missable Warning
    if (boss.isMissable) {
      tips.push(
        `⚠️ Point of No Return: Create a hard manual save slot before entering ${boss.location}. This encounter cannot be revisited!`
      );
    }

    // 4. Game-Specific & Strategy-derived Loadout & Healing Preparation
    const lowerStrat = boss.strategyTip.toLowerCase();

    // Strategy-specific triggers
    if (lowerStrat.includes("knife") || lowerStrat.includes("parry")) {
      tips.push(
        `Knife Durability & Parries: Repair and upgrade your Knife at the Merchant / Smith for emergency parries.`
      );
    } else if (lowerStrat.includes("flash") || lowerStrat.includes("grenade")) {
      tips.push(
        `Flash Grenades: Stock Flash Grenades to instantly stun exposed Las Plagas / parasites or interrupt heavy charges.`
      );
    } else if (lowerStrat.includes("golden") || lowerStrat.includes("egg")) {
      tips.push(
        `Golden Egg Secret: Carry a Golden Chicken Egg for a 70% instant boss health stun attack!`
      );
    } else if (lowerStrat.includes("phoenix down")) {
      tips.push(
        `Instant Kill Shortcut: Toss 1 Phoenix Down or Revive Item for an instant 1-shot kill against undead target.`
      );
    } else if (lowerStrat.includes("blitz") || lowerStrat.includes("pummel")) {
      tips.push(
        `Input Command Readiness: Be prepared to execute Sabin's Blitz Pummel input (Left, Right, Left) immediately.`
      );
    } else if (lowerStrat.includes("runic") || lowerStrat.includes("reflect")) {
      tips.push(
        `Magical Defense: Activate Celes's Runic or Reflect barriers to nullify incoming high-tier Imperial spells.`
      );
    }

    // Baseline Game-Specific Healing & Loadout Prep
    if (isRE) {
      tips.push(
        `Survival Loadout: Stock First Aid Sprays, Green + Red Herb mixtures, max out Body Armor durability, and top off Shotgun/Magnum ammo.`
      );
    } else if (isElden) {
      tips.push(
        `Tarnish Loadout: Allocate Flask charges (Crimson / Cerulean Tears), drink Flask of Wondrous Physick, and prepare Spirit Ash summons.`
      );
    } else if (isZelda) {
      tips.push(
        `Hero Loadout: Cook Hearty Meals for extra hearts, brew Defense/Attack Elixirs, and carry Fairies in pouch.`
      );
    } else if (isCyberpunk) {
      tips.push(
        `Combat Loadout: Equip MaxDoc Mk.3 / BounceBack inhalers, stock EMP Grenades, and activate cyberware implants.`
      );
    } else if (isJRPG) {
      tips.push(
        `Party Loadout: Stock Potions, Hi-Potions, Ethers & Phoenix Downs, equip status-immunity accessories, and verify party HP/MP is maxed.`
      );
    } else {
      tips.push(
        `Battle Loadout: Rest at a checkpoint, stock primary healing items & consumables, and equip your highest damage loadout before triggering ${boss.name}.`
      );
    }

    return tips;
  };

  const filteredBosses = bosses.filter((boss) => {
    const matchesSearch =
      boss.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      boss.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      boss.world.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === "Pending") return matchesSearch && !boss.defeated;
    if (statusFilter === "Defeated") return matchesSearch && boss.defeated;
    if (statusFilter === "Missable") return matchesSearch && boss.isMissable;
    return matchesSearch;
  });

  const totalDefeated = bosses.filter((b) => b.defeated).length;
  const percentDefeated = bosses.length > 0 ? Math.round((totalDefeated / bosses.length) * 100) : 0;

  const generateChapterText = (boss: BossEntry) => {
    return `[00:00] ⚔️ Boss Fight: ${boss.name}\n- Episode Part #${boss.episodePart} (${boss.location})\n- HP: ${boss.hp} | Weakness: ${boss.weakness}\n- Strategy Note: ${boss.strategyTip}`;
  };

  const handleCopyChapter = (boss: BossEntry) => {
    navigator.clipboard.writeText(generateChapterText(boss));
    setCopiedTimestamp(true);
    setTimeout(() => setCopiedTimestamp(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#0e0e11] border-2 border-red-500/50 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl shadow-red-950/80 overflow-hidden text-white font-sans">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-950/80 via-zinc-950 to-zinc-950 border-b border-red-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center text-red-400 shrink-0">
              <Swords className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-red-400 px-2 py-0.5 bg-red-500/20 rounded border border-red-500/30">
                  Feature 2
                </span>
                <span className="text-xs text-zinc-400 font-bold">
                  {activeSeries?.gameTitle || "Playthrough Series"}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Boss Fight & Major Encounter Tactics Planner
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Boss Encounter</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Overview Progress Banner */}
        <div className="px-4 py-3 bg-zinc-950 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] font-black text-zinc-500 uppercase block">Defeated Bosses</span>
              <span className="text-sm sm:text-base font-black text-amber-400">
                {totalDefeated} / {bosses.length} ({percentDefeated}%)
              </span>
            </div>

            <div className="w-32 sm:w-48 bg-zinc-800 h-2.5 rounded-full overflow-hidden border border-zinc-700">
              <div
                className="bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 h-full transition-all duration-500"
                style={{ width: `${percentDefeated}%` }}
              />
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search boss name, location..."
                className="pl-8 pr-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 w-44 sm:w-56"
              />
            </div>

            <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
              {(["All", "Pending", "Defeated", "Missable"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                    statusFilter === st ? "bg-red-600 text-white shadow" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Boss List Column */}
          <div className="lg:col-span-5 border-r border-zinc-800/80 overflow-y-auto p-3 space-y-2 max-h-[50vh] lg:max-h-none">
            {filteredBosses.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-xs">
                No boss encounters match your search criteria.
              </div>
            ) : (
              filteredBosses.map((boss) => {
                const isSelected = selectedBoss?.id === boss.id;
                const retryCount = retries[boss.id] || 0;

                return (
                  <div
                    key={boss.id}
                    onClick={() => setSelectedBoss(boss)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-900 border-red-500/60 shadow-lg"
                        : "bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleDefeated(boss.id);
                        }}
                        className="shrink-0 cursor-pointer text-zinc-400 hover:text-emerald-400 transition-colors"
                      >
                        {boss.defeated ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950" />
                        ) : (
                          <Circle className="w-5 h-5 text-zinc-600" />
                        )}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[9px] font-black">
                            Part #{boss.episodePart}
                          </span>
                          {boss.isMissable && (
                            <span className="px-1.5 py-0.5 bg-red-500/20 text-red-300 border border-red-500/30 rounded text-[9px] font-extrabold flex items-center gap-1">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              <span>MISSABLE</span>
                            </span>
                          )}
                        </div>
                        <h4 className={`text-xs font-black truncate mt-0.5 ${boss.defeated ? "line-through text-zinc-500" : "text-white"}`}>
                          {boss.name}
                        </h4>
                        <span className="text-[10px] text-zinc-400 truncate block">
                          📍 {boss.location}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {retryCount > 0 && (
                        <span className="px-1.5 py-0.5 bg-red-950 text-red-400 border border-red-800/60 rounded text-[9px] font-bold">
                          {retryCount} Wipes
                        </span>
                      )}
                      <ChevronRight className={`w-4 h-4 ${isSelected ? "text-red-400" : "text-zinc-600"}`} />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Selected Boss Details & Strategy Panel */}
          <div className="lg:col-span-7 p-4 sm:p-6 overflow-y-auto space-y-5 bg-[#0b0b0e]">
            {selectedBoss ? (
              <div className="space-y-5">
                {/* Boss Title Header Card */}
                <div className="p-4 bg-gradient-to-r from-red-950/60 via-zinc-900 to-zinc-950 border border-red-500/40 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-[10px] font-black uppercase">
                        Part #{selectedBoss.episodePart} Boss
                      </span>
                      {selectedBoss.isMissable && (
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-300 border border-red-500/40 rounded text-[10px] font-extrabold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-red-400" />
                          <span>MISSABLE TROPHY</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {selectedBoss.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      📍 {selectedBoss.location} • <strong className="text-zinc-300">{selectedBoss.world}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggleDefeated(selectedBoss.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-black shadow-lg flex items-center gap-2 cursor-pointer transition-all ${
                      selectedBoss.defeated
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                        : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{selectedBoss.defeated ? "Status: DEFEATED" : "Mark as Defeated"}</span>
                  </button>
                </div>

                {/* Boss Stats & Weaknesses Grid */}
                {(() => {
                  const gameTitle = (activeSeries?.gameTitle || "").toLowerCase();
                  const gameGenre = (activeSeries?.gameGenre || "").toLowerCase();
                  const currentSeriesId = (activeSeries?.id || "").toLowerCase();
                  const isRE = currentSeriesId.includes("resident-evil") || currentSeriesId.includes("re4") || gameTitle.includes("resident evil") || gameTitle.includes("re4") || gameGenre.includes("survival horror");
                  const isElden = currentSeriesId.includes("elden") || gameTitle.includes("elden ring") || gameTitle.includes("erdtree") || gameGenre.includes("soulslike");
                  const isZelda = currentSeriesId.includes("zelda") || currentSeriesId.includes("totk") || gameTitle.includes("zelda") || gameTitle.includes("tears of the kingdom");
                  const isCyberpunk = currentSeriesId.includes("cyberpunk") || gameTitle.includes("cyberpunk");

                  const rawStealRare = (selectedBoss.stealRare || "").trim().toLowerCase();
                  const rawStealCommon = (selectedBoss.stealCommon || "").trim().toLowerCase();
                  const hasValidStealItem = !isRE && !isElden && !isZelda && !isCyberpunk &&
                    ((rawStealRare && !["none", "n/a", "none / n/a", ""].includes(rawStealRare)) ||
                     (rawStealCommon && !["none", "n/a", "none / n/a", ""].includes(rawStealCommon)));

                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase block">Estimated HP</span>
                        <span className="text-xs font-black text-red-400">{selectedBoss.hp}</span>
                      </div>

                      <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase block">Weakness</span>
                        <span className="text-xs font-black text-amber-400 truncate block">{selectedBoss.weakness}</span>
                      </div>

                      {hasValidStealItem ? (
                        <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-1">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase block">Common Steal</span>
                          <span className="text-xs font-bold text-cyan-300 truncate block">{selectedBoss.stealCommon}</span>
                        </div>
                      ) : (
                        <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-1">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase block">Encounter Zone</span>
                          <span className="text-xs font-bold text-cyan-300 truncate block">{selectedBoss.location}</span>
                        </div>
                      )}

                      <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase block">
                          {hasValidStealItem ? "Rare Loot Drop" : "Guaranteed Reward"}
                        </span>
                        <span className="text-xs font-bold text-emerald-300 truncate block">{selectedBoss.dropLoot || "Victory Reward"}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Live Fight Retry Counter */}
                <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-400 shrink-0">
                      <RotateCcw className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block">
                        Live Recording Wipe / Attempt Counter
                      </span>
                      <p className="text-sm font-black text-white">
                        Total Failed Attempts: <span className="text-red-400 text-base">{retries[selectedBoss.id] || 0} Wipes</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddAttempt(selectedBoss.id)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black shadow cursor-pointer transition-all hover:scale-105"
                    >
                      +1 Wipe Attempt
                    </button>
                    <button
                      onClick={() => handleResetAttempt(selectedBoss.id)}
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Tactical Strategy & Phase Guidance */}
                <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3">
                  <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span>Tactical Strategy & Encounter Breakdown</span>
                  </h4>

                  <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                    {selectedBoss.strategyTip}
                  </p>

                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80 space-y-2 text-xs">
                    <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Recommended Preparation for {selectedBoss.name}:</span>
                    </span>
                    <ul className="list-disc list-inside space-y-1.5 text-zinc-300 text-[11px]">
                      {getBossPreparationTips(selectedBoss).map((tip, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 1-Click YouTube Description Timestamp Generator */}
                <div className="p-4 bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-950 border border-red-500/30 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-red-400" />
                      <span>YouTube Description Chapter Generator</span>
                    </span>

                    <button
                      onClick={() => handleCopyChapter(selectedBoss)}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-black rounded-xl shadow flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      {copiedTimestamp ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedTimestamp ? "Copied Chapter!" : "Copy Boss Chapter"}</span>
                    </button>
                  </div>

                  <pre className="p-3 bg-black/80 rounded-xl text-[11px] text-zinc-300 font-mono whitespace-pre-wrap border border-zinc-800">
                    {generateChapterText(selectedBoss)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-zinc-500 text-sm">
                Select a boss encounter from the left panel to inspect tactics and strategy notes.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add New Boss Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121216] border border-zinc-700 rounded-2xl w-full max-w-lg p-5 space-y-4 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-black flex items-center gap-2">
                <Swords className="w-4 h-4 text-red-400" />
                <span>Add Custom Boss Encounter</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBoss} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 font-bold mb-1">Boss Name</label>
                <input
                  type="text"
                  required
                  value={newBossName}
                  onChange={(e) => setNewBossName(e.target.value)}
                  placeholder="e.g. Ultima Weapon"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Episode Part #</label>
                  <input
                    type="number"
                    value={newBossEpisode}
                    onChange={(e) => setNewBossEpisode(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Estimated HP</label>
                  <input
                    type="text"
                    value={newBossHp}
                    onChange={(e) => setNewBossHp(e.target.value)}
                    placeholder="e.g. 50,000 HP"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Location / Zone</label>
                  <input
                    type="text"
                    value={newBossLocation}
                    onChange={(e) => setNewBossLocation(e.target.value)}
                    placeholder="e.g. Ancient Ruins"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Elemental Weakness</label>
                  <input
                    type="text"
                    value={newBossWeakness}
                    onChange={(e) => setNewBossWeakness(e.target.value)}
                    placeholder="e.g. Ice / Holy"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">Tactical Strategy Note</label>
                <textarea
                  rows={3}
                  value={newBossStrategy}
                  onChange={(e) => setNewBossStrategy(e.target.value)}
                  placeholder="Key mechanics, phase triggers, accessory recommendations..."
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="newBossMissable"
                  checked={newBossMissable}
                  onChange={(e) => setNewBossMissable(e.target.checked)}
                  className="rounded border-zinc-700 text-red-600 focus:ring-0"
                />
                <label htmlFor="newBossMissable" className="text-zinc-300 font-bold cursor-pointer">
                  Missable Boss / Point of No Return
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black shadow cursor-pointer"
                >
                  Save Boss Encounter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
