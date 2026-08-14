import React, { useState } from "react";
import {
  X,
  Swords,
  ShieldAlert,
  Crown,
  CheckCircle2,
  Circle,
  Search,
  Plus,
  Copy,
  Check,
  Zap,
  Sparkles,
  Award,
  BookOpen,
  Filter,
  AlertTriangle,
  Gift,
} from "lucide-react";
import { BossEntry, LootEntry, PlaythroughSeries } from "../types";
import { getBossAndLootForSeries } from "../data/bossLootData";
import { safeSetLocalStorage } from "../utils/storageUtils";

interface BossLootCatalogModalProps {
  activeSeries?: PlaythroughSeries;
  onClose: () => void;
}

export const BossLootCatalogModal = ({
  activeSeries,
  onClose,
}: BossLootCatalogModalProps) => {
  const [activeTab, setActiveTab] = useState<"bosses" | "loot" | "summary">("bosses");
  
  const seriesId = activeSeries?.id || "default";

  // Local state for interactive tracking with per-series persistence
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

  const [lootItems, setLootItems] = useState<LootEntry[]>(() => {
    const saved = localStorage.getItem(`yt_loot_${seriesId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return getBossAndLootForSeries(activeSeries).loot;
  });

  // Re-sync whenever activeSeries changes
  React.useEffect(() => {
    const defaultData = getBossAndLootForSeries(activeSeries);

    const savedBosses = localStorage.getItem(`yt_bosses_${seriesId}`);
    if (savedBosses) {
      try {
        const parsed = JSON.parse(savedBosses);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBosses(parsed);
        } else {
          setBosses(defaultData.bosses);
        }
      } catch (e) {
        setBosses(defaultData.bosses);
      }
    } else {
      setBosses(defaultData.bosses);
    }

    const savedLoot = localStorage.getItem(`yt_loot_${seriesId}`);
    if (savedLoot) {
      try {
        const parsed = JSON.parse(savedLoot);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLootItems(parsed);
        } else {
          setLootItems(defaultData.loot);
        }
      } catch (e) {
        setLootItems(defaultData.loot);
      }
    } else {
      setLootItems(defaultData.loot);
    }
  }, [seriesId, activeSeries]);

  // Persist state changes per series
  React.useEffect(() => {
    safeSetLocalStorage(`yt_bosses_${seriesId}`, bosses);
  }, [bosses, seriesId]);

  React.useEffect(() => {
    safeSetLocalStorage(`yt_loot_${seriesId}`, lootItems);
  }, [lootItems, seriesId]);

  // Filters
  const [search, setSearch] = useState("");
  const [missablesOnly, setMissablesOnly] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Form toggle for adding custom boss / loot
  const [showAddForm, setShowAddForm] = useState(false);
  const [addType, setAddType] = useState<"boss" | "loot">("boss");

  // New Boss form fields
  const [newBossName, setNewBossName] = useState("");
  const [newBossEp, setNewBossEp] = useState(1);
  const [newBossLoc, setNewBossLoc] = useState("");
  const [newBossHp, setNewBossHp] = useState("");
  const [newBossWeakness, setNewBossWeakness] = useState("");
  const [newBossSteal, setNewBossSteal] = useState("");
  const [newBossTip, setNewBossTip] = useState("");
  const [newBossMissable, setNewBossMissable] = useState(false);

  // New Loot form fields
  const [newLootName, setNewLootName] = useState("");
  const [newLootCategory, setNewLootCategory] = useState<LootEntry["category"]>("Key Item");
  const [newLootEp, setNewLootEp] = useState(1);
  const [newLootLoc, setNewLootLoc] = useState("");
  const [newLootDesc, setNewLootDesc] = useState("");
  const [newLootMissable, setNewLootMissable] = useState(false);

  // Toggle defeated status
  const handleToggleBoss = (id: string) => {
    setBosses((prev) =>
      prev.map((b) => (b.id === id ? { ...b, defeated: !b.defeated } : b))
    );
  };

  // Toggle loot collected status
  const handleToggleLoot = (id: string) => {
    setLootItems((prev) =>
      prev.map((l) => (l.id === id ? { ...l, collected: !l.collected } : l))
    );
  };

  // Add custom Boss
  const handleAddBoss = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBossName) return;

    const created: BossEntry = {
      id: `boss_custom_${Date.now()}`,
      name: newBossName,
      episodePart: Number(newBossEp),
      location: newBossLoc || "Unknown Area",
      world: "Custom World",
      hp: newBossHp || "N/A",
      weakness: newBossWeakness || "None",
      stealCommon: newBossSteal || "None",
      stealRare: "None",
      dropLoot: "None",
      strategyTip: newBossTip || "Recording Tip: Feature party setups & strategy.",
      isMissable: newBossMissable,
      defeated: false,
    };

    setBosses((prev) => [created, ...prev]);
    setNewBossName("");
    setNewBossHp("");
    setNewBossTip("");
    setShowAddForm(false);
  };

  // Add custom Loot
  const handleAddLoot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLootName) return;

    const created: LootEntry = {
      id: `loot_custom_${Date.now()}`,
      name: newLootName,
      category: newLootCategory,
      episodePart: Number(newLootEp),
      location: newLootLoc || "Unknown Area",
      description: newLootDesc || "Important 100% completion item.",
      isMissable: newLootMissable,
      collected: false,
    };

    setLootItems((prev) => [created, ...prev]);
    setNewLootName("");
    setNewLootDesc("");
    setShowAddForm(false);
  };

  // Statistics
  const totalBossesCount = bosses.length;
  const defeatedBossesCount = bosses.filter((b) => b.defeated).length;
  const bossPercent = totalBossesCount > 0 ? Math.round((defeatedBossesCount / totalBossesCount) * 100) : 0;

  const totalLootCount = lootItems.length;
  const collectedLootCount = lootItems.filter((l) => l.collected).length;
  const lootPercent = totalLootCount > 0 ? Math.round((collectedLootCount / totalLootCount) * 100) : 0;

  const overallPercent = Math.round((bossPercent + lootPercent) / 2);

  const totalMissables = bosses.filter((b) => b.isMissable).length + lootItems.filter((l) => l.isMissable).length;
  const missablesCleared = bosses.filter((b) => b.isMissable && b.defeated).length + lootItems.filter((l) => l.isMissable && l.collected).length;

  // Dynamic game-aware titles & categories
  const hasEspers = lootItems.some((l) => l.category === "Esper" || l.name.toLowerCase().includes("esper"));
  const gameTitleLower = (activeSeries?.gameTitle || "").toLowerCase();

  const getLootTabLabel = () => {
    if (hasEspers || gameTitleLower.includes("ff6") || gameTitleLower.includes("final fantasy")) {
      return `100% Loot & Espers (${filteredLoot.length})`;
    }
    if (gameTitleLower.includes("resident evil") || gameTitleLower.includes("re4")) {
      return `100% Weapons & Rare Items (${filteredLoot.length})`;
    }
    if (gameTitleLower.includes("elden")) {
      return `100% Key Items & Relics (${filteredLoot.length})`;
    }
    if (gameTitleLower.includes("zelda") || gameTitleLower.includes("totk")) {
      return `100% Key Items & Gear (${filteredLoot.length})`;
    }
    if (gameTitleLower.includes("chrono")) {
      return `100% Key Items & Techs (${filteredLoot.length})`;
    }
    return `100% Key Items & Rare Loot (${filteredLoot.length})`;
  };

  const lootExportHeader = (hasEspers || gameTitleLower.includes("ff6") || gameTitleLower.includes("final fantasy"))
    ? `💎 ESPERS, TOOLS & RARE LOOT COLLECTED`
    : `💎 WEAPONS, KEY ITEMS & RARE LOOT COLLECTED`;

  // Filtered lists
  const filteredBosses = bosses.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.location.toLowerCase().includes(search.toLowerCase()) ||
      b.strategyTip.toLowerCase().includes(search.toLowerCase());
    const matchesMissable = !missablesOnly || b.isMissable;
    return matchesSearch && matchesMissable;
  });

  const filteredLoot = lootItems.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.location.toLowerCase().includes(search.toLowerCase()) ||
      l.description.toLowerCase().includes(search.toLowerCase());
    const matchesMissable = !missablesOnly || l.isMissable;
    const matchesCat = categoryFilter === "All" || l.category === categoryFilter;
    return matchesSearch && matchesMissable && matchesCat;
  });

  // Extract categories in use for dynamic dropdown
  const categoriesInUse = Array.from(new Set(lootItems.map((l) => l.category)));

  // Copy 100% summary description for YouTube uploads
  const handleCopyYouTubeSummary = () => {
    const gameTitle = activeSeries?.gameTitle || "Final Fantasy VI Pixel Remaster";
    const text = `🏆 100% WALKTHROUGH & COMPLETION TRACKER - ${gameTitle.toUpperCase()}
--------------------------------------------------
Overall Playthrough Completion: ${overallPercent}%

⚔️ BOSS FIGHTS RECORDED (${defeatedBossesCount}/${totalBossesCount}):
${bosses
  .map(
    (b) =>
      `${b.defeated ? "✅" : "⏳"} Ep ${b.episodePart < 10 ? `0${b.episodePart}` : b.episodePart}: ${b.name} (${b.location})`
  )
  .join("\n")}

${lootExportHeader} (${collectedLootCount}/${totalLootCount}):
${lootItems
  .map(
    (l) =>
      `${l.collected ? "✅" : "⏳"} [${l.category}] ${l.name} - ${l.location} (Ep ${l.episodePart})`
  )
  .join("\n")}

Stay tuned for full episode recordings & 100% achievement guides!`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#121212] border border-white/10 w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="p-5 bg-[#09090b] border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-zinc-100">
                  {activeSeries?.gameTitle || "Game"} — 100% Boss & Loot Catalog
                </h2>
                <span className="text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded">
                  {overallPercent}% COMPLETE
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Track {activeSeries?.gameTitle} encounters, rare drops, missables & completion milestones
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3.5 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Target</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white bg-[#18181b] hover:bg-[#27272a] rounded-lg transition-colors border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar Summary */}
        <div className="bg-[#09090b] px-6 py-3 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6 flex-1">
            {/* Boss Bar */}
            <div className="flex-1">
              <div className="flex justify-between font-medium mb-1">
                <span className="text-zinc-300 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  Boss Defeated Rate ({defeatedBossesCount}/{totalBossesCount})
                </span>
                <span className="font-mono text-amber-400 font-bold">{bossPercent}%</span>
              </div>
              <div className="h-2 w-full bg-[#18181b] rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
                  style={{ width: `${bossPercent}%` }}
                />
              </div>
            </div>

            {/* Loot Bar */}
            <div className="flex-1">
              <div className="flex justify-between font-medium mb-1">
                <span className="text-zinc-300 flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5 text-purple-400" />
                  100% Loot Collected ({collectedLootCount}/{totalLootCount})
                </span>
                <span className="font-mono text-purple-400 font-bold">{lootPercent}%</span>
              </div>
              <div className="h-2 w-full bg-[#18181b] rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-300 transition-all duration-500"
                  style={{ width: `${lootPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#18181b] px-3 py-1.5 rounded-lg border border-white/10 shrink-0">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <span className="text-zinc-300 font-medium">
              Missables Saved: <span className="text-white font-bold">{missablesCleared}/{totalMissables}</span>
            </span>
          </div>
        </div>

        {/* Modal Main Area */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Custom Add Form (Collapsible) */}
          {showAddForm && (
            <div className="bg-[#09090b] border border-blue-500/30 p-4 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
                    Add Custom Catalog Entry
                  </h3>
                </div>
                <div className="flex bg-[#18181b] p-1 rounded-lg border border-white/10 text-xs">
                  <button
                    onClick={() => setAddType("boss")}
                    className={`px-3 py-1 rounded font-bold transition-colors ${
                      addType === "boss" ? "bg-red-500 text-zinc-950" : "text-zinc-400"
                    }`}
                  >
                    Boss Fight
                  </button>
                  <button
                    onClick={() => setAddType("loot")}
                    className={`px-3 py-1 rounded font-bold transition-colors ${
                      addType === "loot" ? "bg-purple-500 text-zinc-950" : "text-zinc-400"
                    }`}
                  >
                    Loot / Item
                  </button>
                </div>
              </div>

              {addType === "boss" ? (
                <form onSubmit={handleAddBoss} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-zinc-400 mb-1">Boss Name</label>
                    <input
                      type="text"
                      value={newBossName}
                      onChange={(e) => setNewBossName(e.target.value)}
                      placeholder="e.g. Ultros (Opera House)"
                      required
                      className="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Episode Part #</label>
                    <input
                      type="number"
                      value={newBossEp}
                      onChange={(e) => setNewBossEp(Number(e.target.value))}
                      className="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Encounter Location</label>
                    <input
                      type="text"
                      value={newBossLoc}
                      onChange={(e) => setNewBossLoc(e.target.value)}
                      placeholder="e.g. Opera Stage"
                      className="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Boss HP</label>
                    <input
                      type="text"
                      value={newBossHp}
                      onChange={(e) => setNewBossHp(e.target.value)}
                      placeholder="e.g. 3,000 HP"
                      className="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Weakness / Steal Item</label>
                    <input
                      type="text"
                      value={newBossSteal}
                      onChange={(e) => setNewBossSteal(e.target.value)}
                      placeholder="e.g. Steal White Cape"
                      className="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Recording Strategy Tip</label>
                    <input
                      type="text"
                      value={newBossTip}
                      onChange={(e) => setNewBossTip(e.target.value)}
                      placeholder="e.g. Keep Runic active with Celes"
                      className="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div className="sm:col-span-3 flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newBossMissable}
                        onChange={(e) => setNewBossMissable(e.target.checked)}
                        className="rounded bg-[#18181b] border-white/20 text-red-500 focus:ring-0"
                      />
                      <span>Mark as Missable Boss (100% Alert)</span>
                    </label>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-500 hover:bg-red-400 text-zinc-950 font-bold rounded-lg transition-colors"
                    >
                      Save Boss Record
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleAddLoot} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-zinc-400 mb-1">Item / Loot Name</label>
                    <input
                      type="text"
                      value={newLootName}
                      onChange={(e) => setNewLootName(e.target.value)}
                      placeholder="e.g. Chainsaw Tool"
                      required
                      className="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Category</label>
                    <select
                      value={newLootCategory}
                      onChange={(e) => setNewLootCategory(e.target.value as any)}
                      className="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-blue-400"
                    >
                      <option value="Esper">Esper / Magicite</option>
                      <option value="Tool">Tool / Ability</option>
                      <option value="Key Item">Key Item</option>
                      <option value="Relic">Relic / Accessory</option>
                      <option value="Weapon/Armor">Weapon / Armor</option>
                      <option value="Missable Chest">Missable Chest</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Episode Part #</label>
                    <input
                      type="number"
                      value={newLootEp}
                      onChange={(e) => setNewLootEp(Number(e.target.value))}
                      className="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-zinc-400 mb-1">Description & Acquisition Method</label>
                    <input
                      type="text"
                      value={newLootDesc}
                      onChange={(e) => setNewLootDesc(e.target.value)}
                      placeholder="e.g. Solve Zozo clock puzzle set to 6:10:50"
                      className="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Location</label>
                    <input
                      type="text"
                      value={newLootLoc}
                      onChange={(e) => setNewLootLoc(e.target.value)}
                      placeholder="e.g. Zozo Skyscraper"
                      className="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div className="sm:col-span-3 flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newLootMissable}
                        onChange={(e) => setNewLootMissable(e.target.checked)}
                        className="rounded bg-[#18181b] border-white/20 text-purple-500 focus:ring-0"
                      />
                      <span>Mark as Permanently Missable</span>
                    </label>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-zinc-950 font-bold rounded-lg transition-colors"
                    >
                      Save Loot Record
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Navigation Tabs & Search Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#09090b] p-3 rounded-xl border border-white/10">
            {/* Tabs */}
            <div className="flex items-center gap-2 border-b md:border-b-0 border-white/10 pb-2 md:pb-0">
              <button
                onClick={() => setActiveTab("bosses")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "bosses"
                    ? "bg-red-500/20 text-red-300 border border-red-500/40"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Boss Encounter Catalog ({filteredBosses.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("loot")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "loot"
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Gift className="w-4 h-4 text-purple-400" />
                <span>{getLootTabLabel()}</span>
              </button>

              <button
                onClick={() => setActiveTab("summary")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "summary"
                    ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Award className="w-4 h-4 text-blue-400" />
                <span>YouTube Description Export</span>
              </button>
            </div>

            {/* Filter controls */}
            {activeTab !== "summary" && (
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name, location..."
                    className="w-full bg-[#18181b] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-blue-400"
                  />
                </div>

                {activeTab === "loot" && (
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-[#18181b] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none"
                  >
                    <option value="All">All Categories</option>
                    {hasEspers && <option value="Esper">Espers & Magicite</option>}
                    <option value="Tool">Tools & Abilities</option>
                    <option value="Key Item">Key Items</option>
                    <option value="Relic">Relics & Accessories</option>
                    <option value="Weapon/Armor">Weapons & Armor</option>
                  </select>
                )}

                <button
                  onClick={() => setMissablesOnly(!missablesOnly)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1 ${
                    missablesOnly
                      ? "bg-red-500/20 border-red-500/40 text-red-300"
                      : "bg-[#18181b] border-white/10 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Missables Only</span>
                </button>
              </div>
            )}
          </div>

          {/* TAB 1: BOSS CATALOG */}
          {activeTab === "bosses" && (
            <div className="space-y-3">
              {filteredBosses.length === 0 ? (
                <div className="text-center py-12 bg-[#09090b] rounded-xl border border-white/10 text-zinc-500 text-xs">
                  No bosses match your current filter criteria.
                </div>
              ) : (
                filteredBosses.map((boss) => (
                  <div
                    key={boss.id}
                    className={`bg-[#09090b] border rounded-xl p-4 transition-all hover:border-white/20 ${
                      boss.defeated
                        ? "border-emerald-500/30 bg-emerald-950/10"
                        : "border-white/10"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      {/* Left Header */}
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggleBoss(boss.id)}
                          className={`mt-0.5 p-1 rounded-lg transition-colors ${
                            boss.defeated
                              ? "text-emerald-400 bg-emerald-500/10"
                              : "text-zinc-600 hover:text-zinc-300"
                          }`}
                          title={boss.defeated ? "Mark as undefeated" : "Mark as defeated"}
                        >
                          {boss.defeated ? (
                            <CheckCircle2 className="w-6 h-6 fill-emerald-500/20" />
                          ) : (
                            <Circle className="w-6 h-6" />
                          )}
                        </button>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                              EP {boss.episodePart < 10 ? `0${boss.episodePart}` : boss.episodePart}
                            </span>
                            <h3 className={`text-sm font-bold ${boss.defeated ? "line-through text-zinc-400" : "text-zinc-100"}`}>
                              {boss.name}
                            </h3>
                            {boss.isMissable && (
                              <span className="text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> MISSABLE
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-zinc-400 mt-1">
                            📍 <span className="text-zinc-200">{boss.location}</span> ({boss.world})
                          </p>
                        </div>
                      </div>

                      {/* Right Quick Stats */}
                      <div className="flex flex-wrap items-center gap-3 text-xs shrink-0">
                        <span className="bg-[#18181b] px-2.5 py-1 rounded border border-white/10 text-zinc-300">
                          ❤️ HP: <strong className="text-white">{boss.hp}</strong>
                        </span>
                        <span className="bg-[#18181b] px-2.5 py-1 rounded border border-white/10 text-zinc-300">
                          ⚡ Weak: <strong className="text-amber-300">{boss.weakness}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Boss Strategy Details */}
                    <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-[#121212] p-3 rounded-lg border border-white/5">
                      <div>
                        <p className="text-zinc-400 font-medium mb-1">🎁 Steal & Loot Drop Table:</p>
                        <div className="space-y-0.5 text-zinc-300 font-mono text-[11px]">
                          <p>• Common Steal: <span className="text-zinc-100">{boss.stealCommon}</span></p>
                          <p>• Rare Steal: <span className="text-amber-300 font-bold">{boss.stealRare}</span></p>
                          <p>• Boss Drop: <span className="text-purple-300">{boss.dropLoot}</span></p>
                        </div>
                      </div>

                      <div>
                        <p className="text-amber-400 font-medium mb-1 flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          Let's Play Strategy Tip:
                        </p>
                        <p className="text-zinc-300 leading-relaxed italic">
                          "{boss.strategyTip}"
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: LOOT & ESPERS CATALOG */}
          {activeTab === "loot" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredLoot.length === 0 ? (
                <div className="col-span-2 text-center py-12 bg-[#09090b] rounded-xl border border-white/10 text-zinc-500 text-xs">
                  No loot items match your current filter criteria.
                </div>
              ) : (
                filteredLoot.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-[#09090b] border rounded-xl p-4 transition-all hover:border-white/20 flex flex-col justify-between ${
                      item.collected
                        ? "border-purple-500/30 bg-purple-950/10"
                        : "border-white/10"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleLoot(item.id)}
                            className={`p-1 rounded-lg transition-colors ${
                              item.collected
                                ? "text-purple-400 bg-purple-500/10"
                                : "text-zinc-600 hover:text-zinc-300"
                            }`}
                            title={item.collected ? "Mark as uncollected" : "Mark as collected"}
                          >
                            {item.collected ? (
                              <CheckCircle2 className="w-5 h-5 fill-purple-500/20" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>

                          <div>
                            <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 mr-2">
                              {item.category.toUpperCase()}
                            </span>
                            <h4 className={`text-xs font-bold inline-block ${item.collected ? "line-through text-zinc-400" : "text-zinc-100"}`}>
                              {item.name}
                            </h4>
                          </div>
                        </div>

                        {item.isMissable && (
                          <span className="text-[9px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded shrink-0">
                            MISSABLE
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-zinc-400 leading-relaxed pl-7">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500 pl-7">
                      <span>📍 {item.location}</span>
                      <span className="font-mono text-zinc-400">EP {item.episodePart < 10 ? `0${item.episodePart}` : item.episodePart}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: YOUTUBE DESCRIPTION EXPORT */}
          {activeTab === "summary" && (
            <div className="space-y-4 bg-[#09090b] p-5 rounded-xl border border-white/10">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    100% Completion Video Description Export
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Copy complete playthrough progress summary formatted for YouTube video descriptions or channel posts
                  </p>
                </div>

                <button
                  onClick={handleCopyYouTubeSummary}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-zinc-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-md"
                >
                  {copiedSummary ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSummary ? "Copied to Clipboard!" : "Copy Full Summary"}</span>
                </button>
              </div>

              <div className="bg-[#121212] p-4 rounded-xl border border-white/10 font-mono text-xs text-zinc-300 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[400px]">
                {`🏆 100% WALKTHROUGH & COMPLETION TRACKER - ${(activeSeries?.gameTitle || "Final Fantasy VI Pixel Remaster").toUpperCase()}
--------------------------------------------------
Overall Playthrough Completion: ${overallPercent}%

⚔️ BOSS FIGHTS RECORDED (${defeatedBossesCount}/${totalBossesCount}):
${bosses
  .map(
    (b) =>
      `${b.defeated ? "✅" : "⏳"} Ep ${b.episodePart < 10 ? `0${b.episodePart}` : b.episodePart}: ${b.name} (${b.location})`
  )
  .join("\n")}

${lootExportHeader} (${collectedLootCount}/${totalLootCount}):
${lootItems
  .map(
    (l) =>
      `${l.collected ? "✅" : "⏳"} [${l.category}] ${l.name} - ${l.location} (Ep ${l.episodePart})`
  )
  .join("\n")}`}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
