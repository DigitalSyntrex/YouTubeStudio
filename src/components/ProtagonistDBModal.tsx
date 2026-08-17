import React, { useState } from "react";
import { HoloFoilCard } from "./HoloFoilCard";
import {
  X,
  Search,
  Plus,
  Trash2,
  User,
  Gamepad2,
  Sparkles,
  Database,
  Check,
  Tag,
  BookOpen,
  Camera
} from "lucide-react";
import {
  getAllProtagonistDatabase,
  saveCustomProtagonistMapping,
  deleteCustomProtagonistMapping,
  getProtagonistForGame,
  formatGameTitle,
  ProtagonistMapping,
  getHeroAvatarUrl,
  resizeHeroAvatarImage,
  saveGlobalHeroAvatar,
  removeGlobalHeroAvatar,
  cleanHeroName,
  getBuiltInHeroAvatarSvg
} from "../utils/gameProtagonists";

interface ProtagonistDBModalProps {
  onClose: () => void;
}

export const ProtagonistDBModal: React.FC<ProtagonistDBModalProps> = ({ onClose }) => {
  const [dbList, setDbList] = useState<ProtagonistMapping[]>(() => getAllProtagonistDatabase());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // New Custom Entry Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");
  const [newProtagonist, setNewProtagonist] = useState("");
  const [newCategory, setNewCategory] = useState("Action RPG");
  const [successMessage, setSuccessMessage] = useState("");

  // Live Test Lookup Tester State
  const [testGameTitle, setTestGameTitle] = useState("");

  const refreshList = () => {
    setDbList(getAllProtagonistDatabase());
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim() || !newProtagonist.trim()) return;

    saveCustomProtagonistMapping(newKeyword, newProtagonist, newCategory);
    refreshList();

    setSuccessMessage(`Saved character mapping for "${newKeyword.trim()}"!`);
    setNewKeyword("");
    setNewProtagonist("");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleDeleteCustom = (keyword: string) => {
    deleteCustomProtagonistMapping(keyword);
    refreshList();
  };

  // Categories list
  const categories = ["All", "Custom Only", ...Array.from(new Set(dbList.map((item) => item.category || "General")))];

  // Filter list based on search and category
  const filteredList = dbList.filter((item) => {
    const matchesCategory =
      selectedCategory === "All"
        ? true
        : selectedCategory === "Custom Only"
        ? item.isCustom
        : item.category === selectedCategory;

    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      item.protagonist.toLowerCase().includes(query) ||
      item.keywords.some((kw) => kw.toLowerCase().includes(query)) ||
      (item.category && item.category.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  const testResult = testGameTitle.trim() ? getProtagonistForGame(testGameTitle) : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0f0f12] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#141419]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                Protagonist & Character Database
                <span className="text-xs font-normal text-purple-300 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full">
                  {dbList.length} Games Mapped
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Automatic character recognition engine for longform walkthrough titles, thumbnails & descriptions.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Control Bar: Test Lookup & Add Custom Button */}
        <div className="p-4 border-b border-white/10 bg-[#121217] flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Live Test Lookup Input */}
          <div className="w-full md:w-2/3 relative">
            <div className="flex items-center bg-[#09090b] border border-white/10 rounded-xl px-3 py-1.5 focus-within:border-purple-500/50">
              <Sparkles className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Test any game title (e.g. 'Silent Hill 2 Remake', 'Devil May Cry 5')..."
                value={testGameTitle}
                onChange={(e) => setTestGameTitle(e.target.value)}
                className="w-full bg-transparent text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none"
              />
            </div>
            {testResult && (
              <div className="mt-1.5 px-3 py-1 bg-purple-950/40 border border-purple-500/30 rounded-lg text-xs text-purple-200 flex items-center justify-between">
                <span>
                  Detected Character: <strong className="text-purple-300">{testResult}</strong>
                </span>
                <span className="text-[10px] text-purple-400 uppercase font-bold tracking-wider">
                  Auto-Inferred
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? "Close Custom Entry" : "Add Custom Game Protagonist"}</span>
          </button>
        </div>

        {/* Collapsible Add Custom Mapping Form */}
        {showAddForm && (
          <form onSubmit={handleAddCustom} className="p-4 bg-purple-950/20 border-b border-purple-500/20 space-y-3">
            <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Register New Game & Protagonist Character
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">Game Keyword or Title</label>
                <input
                  type="text"
                  placeholder="e.g. Deltarune, Slay the Spire, Mod Name"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  className="w-full bg-[#09090b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-purple-400"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">Protagonist / Main Character(s)</label>
                <input
                  type="text"
                  placeholder="e.g. Kris, Susie, Ralsei"
                  value={newProtagonist}
                  onChange={(e) => setNewProtagonist(e.target.value)}
                  className="w-full bg-[#09090b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-purple-400"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-300 mb-1">Genre Category</label>
                <input
                  type="text"
                  placeholder="e.g. JRPG, Indie, Action RPG"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#09090b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              {successMessage ? (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  {successMessage}
                </span>
              ) : (
                <span className="text-[11px] text-zinc-500">
                  Custom entries take immediate priority across all generator tools.
                </span>
              )}
              <button
                type="submit"
                className="px-4 py-1.5 bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs rounded-lg transition-colors"
              >
                Save Mapping
              </button>
            </div>
          </form>
        )}

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-white/10 space-y-3 bg-[#0c0c0f]">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by game title, character name, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#09090b] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.slice(0, 10).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-purple-500 text-white font-bold shadow-sm shadow-purple-500/20"
                    : "bg-white/5 hover:bg-white/10 text-zinc-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Database List Display */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2.5">
          {filteredList.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 space-y-2">
              <Gamepad2 className="w-8 h-8 mx-auto text-zinc-600" />
              <p className="text-sm font-semibold">No game protagonist mappings found matching "{searchTerm}"</p>
              <p className="text-xs">Click "Add Custom Game Protagonist" above to register it!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredList.map((item, idx) => {
                const heroes = item.protagonist.split("&").flatMap((part) => part.split(",")).map((h) => h.trim()).filter(Boolean);
                const mainHeroName = heroes[0] || item.protagonist;
                const avatarUrl = getHeroAvatarUrl(undefined, mainHeroName);
                const isCustom = Boolean(avatarUrl && !avatarUrl.startsWith("data:image/svg+xml"));

                const handleAvatarUpload = async (file: File) => {
                  if (!file) return;
                  const dataUrl = await resizeHeroAvatarImage(file, 256);
                  if (dataUrl) {
                    // Save avatar for all individual hero names in entry
                    heroes.forEach((h) => {
                      saveGlobalHeroAvatar(h, dataUrl);
                      saveGlobalHeroAvatar(cleanHeroName(h), dataUrl);
                    });
                    saveGlobalHeroAvatar(mainHeroName, dataUrl);
                    saveGlobalHeroAvatar(cleanHeroName(mainHeroName), dataUrl);
                    refreshList();
                  }
                };

                const handleAvatarRemove = () => {
                  heroes.forEach((h) => {
                    removeGlobalHeroAvatar(h);
                    removeGlobalHeroAvatar(cleanHeroName(h));
                  });
                  removeGlobalHeroAvatar(mainHeroName);
                  removeGlobalHeroAvatar(cleanHeroName(mainHeroName));
                  refreshList();
                };

                return (
                  <HoloFoilCard
                    key={idx}
                    className={`p-3.5 rounded-xl border transition-all ${
                      item.isCustom
                        ? "bg-purple-950/20 border-purple-500/40 hover:border-purple-400"
                        : "bg-[#141419] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="relative group shrink-0">
                          <img
                            src={avatarUrl}
                            alt={mainHeroName}
                            className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/50 shadow bg-slate-900"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = getBuiltInHeroAvatarSvg(mainHeroName);
                            }}
                          />
                          <label
                            htmlFor={`protag-avatar-${idx}`}
                            className="absolute -bottom-1 -right-1 p-1 bg-purple-600 hover:bg-purple-500 text-white rounded-full cursor-pointer shadow border border-purple-300 transition-transform transform hover:scale-110"
                            title={`Upload custom image for ${mainHeroName}`}
                          >
                            <Camera className="w-2.5 h-2.5" />
                            <input
                              id={`protag-avatar-${idx}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleAvatarUpload(f);
                              }}
                            />
                          </label>
                        </div>

                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                              <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
                              {formatGameTitle(item.keywords[0])}
                            </span>
                            {item.category && (
                              <span className="text-[10px] font-semibold text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                                {item.category}
                              </span>
                            )}
                            {item.isCustom && (
                              <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 border border-purple-500/40 px-2 py-0.5 rounded">
                                USER CUSTOM
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-300">
                            <User className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                            <span className="truncate">{item.protagonist}</span>
                          </div>
                          {item.keywords.length > 1 && (
                            <p className="text-[10px] text-zinc-500 truncate">
                              Keywords: {item.keywords.map(formatGameTitle).join(", ")}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {isCustom && (
                          <button
                            onClick={handleAvatarRemove}
                            title="Reset to default portrait"
                            className="p-1.5 text-amber-400 hover:bg-amber-500/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {item.isCustom && (
                          <button
                            onClick={() => handleDeleteCustom(item.keywords[0])}
                            title="Delete Custom Mapping"
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </HoloFoilCard>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-[#121217] flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            Auto-detected characters automatically populate in 90-120 min playthrough generation, cards, and thumbnail builder.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-zinc-100 font-semibold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
