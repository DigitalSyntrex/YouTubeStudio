import React, { useState } from "react";
import { X, Key, ShieldCheck, CheckSquare, Square, Search, Trophy, Sparkles, Filter, Plus } from "lucide-react";
import { PlaythroughSeries } from "../types";

interface KeyItemsTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  series: PlaythroughSeries;
}

interface ItemEntry {
  id: string;
  name: string;
  category: "Weapon" | "Relic / Accessory" | "Eikon Shard" | "Key Item";
  location: string;
  episodePart: number;
  obtained: boolean;
  isMissable: boolean;
  notes: string;
}

export const KeyItemsTrackerModal: React.FC<KeyItemsTrackerModalProps> = ({
  isOpen,
  onClose,
  series,
}) => {
  if (!isOpen) return null;

  const isFF16 = series.id === "final-fantasy-xvi";

  const defaultItems: ItemEntry[] = isFF16
    ? [
        { id: "1", name: "Gotterdammerung (Blade of Ruin)", category: "Weapon", location: "Blacksmith's Blues IV Quest Reward", episodePart: 8, obtained: true, isMissable: false, notes: "375 Atk / 375 Stagger. Requires Orichalcum & Darksteel." },
        { id: "2", name: "Ragnarok Sword", category: "Weapon", location: "Blacksmith's Blues IV Completion", episodePart: 7, obtained: true, isMissable: false, notes: "Ingredient for Gotterdammerung." },
        { id: "3", name: "Excalibur Blade", category: "Weapon", location: "Side Quest: Blacksmith's Blues II", episodePart: 6, obtained: true, isMissable: false, notes: "Crafted at Blackthorne's Forge." },
        { id: "4", name: "Fire Shard (Ifrit)", category: "Eikon Shard", location: "Phoenix Gate Underground Catacombs", episodePart: 4, obtained: true, isMissable: false, notes: "Unlocks Ignition ability." },
        { id: "5", name: "Wind Shard (Garuda)", category: "Eikon Shard", location: "Eye of the Tempest (Benedikta Encounter)", episodePart: 3, obtained: true, isMissable: false, notes: "Unlocks Gouge & Deadly Embrace." },
        { id: "6", name: "Earth Shard (Titan)", category: "Eikon Shard", location: "Drake's Fang Mothercrystal (Hugo Kupka)", episodePart: 5, obtained: true, isMissable: false, notes: "Unlocks Titanic Block & Windup." },
        { id: "7", name: "Light Shard (Bahamut)", category: "Eikon Shard", location: "Crystalline Dominion Stratosphere", episodePart: 6, obtained: true, isMissable: false, notes: "Unlocks Gigaflare & Megaflare." },
        { id: "8", name: "Dark Shard (Odin)", category: "Eikon Shard", location: "Drake's Spine Citadel Tower (Barnabas)", episodePart: 7, obtained: true, isMissable: false, notes: "Unlocks Zantetsuken & Dancing Steel." },
        { id: "9", name: "Berserker Ring", category: "Relic / Accessory", location: "Patronage Board Reward (850 Renown)", episodePart: 5, obtained: false, isMissable: false, notes: "Triggers Precision Dodge fiery counter." },
        { id: "10", name: "Cid's Lighter", category: "Key Item", location: "Drake's Head Sanctuary (Passed by Cid)", episodePart: 4, obtained: true, isMissable: false, notes: "Cid's legacy artifact." },
      ]
    : [
        { id: "1", name: "Atma Weapon (Ultima Sword)", category: "Weapon", location: "Cave to the Sealed Gate / Floating Continent", episodePart: 10, obtained: true, isMissable: true, notes: "Grows stronger with user HP." },
        { id: "2", name: "Paladin Shield", category: "Relic / Accessory", location: "Uncurse Cursed Shield (256 Battles)", episodePart: 18, obtained: false, isMissable: false, notes: "Absorbs all elemental damage." },
        { id: "3", name: "Master's Scroll (Offering)", category: "Relic / Accessory", location: "Ancient Castle Chest (Katana Soul Drop)", episodePart: 16, obtained: true, isMissable: false, notes: "Grants 4x physical attacks per turn." },
        { id: "4", name: "Genji Glove", category: "Relic / Accessory", location: "Returners Hideout / Dragon's Neck Auction", episodePart: 3, obtained: true, isMissable: false, notes: "Dual-wield two weapons simultaneously." },
      ];

  const [items, setItems] = useState<ItemEntry[]>(defaultItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // New Item Form State
  const [newName, setNewName] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newCategory, setNewCategory] = useState<ItemEntry["category"]>("Key Item");
  const [newEp, setNewEp] = useState<number>(1);

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem: ItemEntry = {
      id: Date.now().toString(),
      name: newName.trim(),
      category: newCategory,
      location: newLocation.trim() || "Custom Recorded Location",
      episodePart: newEp || 1,
      obtained: true,
      isMissable: false,
      notes: "Manually added key item",
    };

    setItems([newItem, ...items]);
    setNewName("");
    setNewLocation("");
  };

  const toggleItem = (id: string) => {
    setItems(items.map((it) => (it.id === id ? { ...it, obtained: !it.obtained } : it)));
  };

  const obtainedCount = items.filter((i) => i.obtained).length;
  const totalCount = items.length;
  const pct = Math.round((obtainedCount / (totalCount || 1)) * 100);

  const filteredItems = items.filter((it) => {
    const matchesSearch =
      it.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      it.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || it.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#121215] border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-[#18181c]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Key Items, Relics & Gear Tracker
              </h2>
              <p className="text-xs text-zinc-400">
                100% Completion tracker for key weapons, accessories & quest items.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-zinc-200">
          {/* Progress Header */}
          <div className="bg-[#18181c] p-4 rounded-xl border border-zinc-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-zinc-400">Collected Relics & Key Items</div>
              <div className="text-xl font-bold text-white">
                {obtainedCount} / {totalCount} Items Obtained ({pct}%)
              </div>
            </div>
            <div className="w-36 bg-black/50 h-3 rounded-full overflow-hidden border border-zinc-800">
              <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {/* Key Item & Location Logger */}
          <div className="bg-[#18181c] p-4 rounded-xl border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> Key Item & Location Logger
              </h3>
              <span className="text-[10px] text-zinc-500">Manually log missing items</span>
            </div>

            <form onSubmit={handleAddCustomItem} className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                type="text"
                placeholder="Item name (e.g. Master Key)..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="sm:col-span-4 bg-[#121215] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                required
              />
              <input
                type="text"
                placeholder="Location found (e.g. Citadel East Wing)..."
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="sm:col-span-4 bg-[#121215] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as ItemEntry["category"])}
                className="sm:col-span-2 bg-[#121215] border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Key Item">Key Item</option>
                <option value="Weapon">Weapon</option>
                <option value="Relic / Accessory">Relic</option>
                <option value="Eikon Shard">Eikon Shard</option>
              </select>
              <button
                type="submit"
                className="sm:col-span-2 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs py-1.5 rounded-lg transition flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Item</span>
              </button>
            </form>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search key items, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#18181c] border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#18181c] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Categories</option>
              <option value="Weapon">Weapons</option>
              <option value="Relic / Accessory">Relics / Accessories</option>
              <option value="Eikon Shard">Eikon Shards</option>
              <option value="Key Item">Key Items</option>
            </select>
          </div>

          {/* Items List */}
          <div className="space-y-2.5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition select-none ${
                  item.obtained
                    ? "bg-[#18181c] border-zinc-800 text-zinc-200"
                    : "bg-[#141417] border-zinc-800/60 text-zinc-500"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.obtained ? (
                    <CheckSquare className="w-5 h-5 text-amber-400 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-zinc-600 shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${item.obtained ? "text-white" : "text-zinc-400"}`}>
                        {item.name}
                      </span>
                      <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded border border-zinc-700">
                        {item.category}
                      </span>
                      {item.isMissable && (
                        <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">
                          MISSABLE
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      Ep {item.episodePart} • {item.location}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-500 text-right max-w-xs truncate hidden sm:block">
                  {item.notes}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
