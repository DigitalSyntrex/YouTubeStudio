import React, { useState } from "react";
import {
  GitBranch,
  X,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Sparkles,
  MapPin,
  Award,
  BookOpen,
  Calendar,
  Layers,
  ChevronRight,
  ShieldAlert,
  Trash2,
  Edit2,
  Copy,
  Check,
  Zap,
} from "lucide-react";
import { QuestEntry, QuestCategory, QuestStatus, Episode } from "../types";

interface QuestBranchTrackerModalProps {
  gameTitle: string;
  episodes: Episode[];
  quests: QuestEntry[];
  onUpdateQuests: (quests: QuestEntry[]) => void;
  onClose: () => void;
}

export const QuestBranchTrackerModal: React.FC<QuestBranchTrackerModalProps> = ({
  gameTitle,
  episodes,
  quests,
  onUpdateQuests,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedLog, setCopiedLog] = useState<boolean>(false);

  // Form modal state for adding / editing quest
  const [showQuestForm, setShowQuestForm] = useState<boolean>(false);
  const [editingQuestId, setEditingQuestId] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState<string>("");
  const [formCategory, setFormCategory] = useState<QuestCategory>("Side Quest");
  const [formActOrWorld, setFormActOrWorld] = useState<string>("World of Balance");
  const [formLocation, setFormLocation] = useState<string>("");
  const [formEpisodePart, setFormEpisodePart] = useState<number>(1);
  const [formRecommendedLevel, setFormRecommendedLevel] = useState<string>("");
  const [formPrerequisites, setFormPrerequisites] = useState<string>("");
  const [formKeyRewards, setFormKeyRewards] = useState<string>("");
  const [formIsMissable, setFormIsMissable] = useState<boolean>(false);
  const [formStatus, setFormStatus] = useState<QuestStatus>("planned");
  const [formNotes, setFormNotes] = useState<string>("");

  // Statistics calculation
  const totalQuests = quests.length;
  const completedQuests = quests.filter((q) => q.status === "completed").length;
  const inProgressQuests = quests.filter((q) => q.status === "in_progress").length;
  const missablePendingQuests = quests.filter((q) => q.isMissable && q.status !== "completed");
  const completionPercentage = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0;

  // Filtered Quests
  const filteredQuests = quests.filter((quest) => {
    const matchesCategory = selectedCategory === "All" || quest.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || quest.status === selectedStatus;
    const matchesSearch =
      searchQuery === "" ||
      quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quest.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (quest.keyRewards && quest.keyRewards.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (quest.prerequisites && quest.prerequisites.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesStatus && matchesSearch;
  });

  // Cycle Status handler
  const handleCycleStatus = (questId: string) => {
    const statusCycle: QuestStatus[] = ["planned", "in_progress", "completed", "missed"];
    const updated = quests.map((q) => {
      if (q.id === questId) {
        const nextIndex = (statusCycle.indexOf(q.status) + 1) % statusCycle.length;
        return { ...q, status: statusCycle[nextIndex] };
      }
      return q;
    });
    onUpdateQuests(updated);
  };

  // Open Form for Adding New Quest
  const handleOpenAddForm = () => {
    setEditingQuestId(null);
    setFormTitle("");
    setFormCategory("Side Quest");
    setFormActOrWorld(episodes[0]?.world || "Act 1");
    setFormLocation("");
    setFormEpisodePart(episodes[0]?.partNumber || 1);
    setFormRecommendedLevel("");
    setFormPrerequisites("");
    setFormKeyRewards("");
    setFormIsMissable(false);
    setFormStatus("planned");
    setFormNotes("");
    setShowQuestForm(true);
  };

  // Open Form for Editing Quest
  const handleOpenEditForm = (quest: QuestEntry) => {
    setEditingQuestId(quest.id);
    setFormTitle(quest.title);
    setFormCategory(quest.category);
    setFormActOrWorld(quest.actOrWorld);
    setFormLocation(quest.location);
    setFormEpisodePart(quest.episodePart || 1);
    setFormRecommendedLevel(quest.recommendedLevel || "");
    setFormPrerequisites(quest.prerequisites || "");
    setFormKeyRewards(quest.keyRewards || "");
    setFormIsMissable(quest.isMissable);
    setFormStatus(quest.status);
    setFormNotes(quest.notes || "");
    setShowQuestForm(true);
  };

  // Save Quest Form (Create / Update)
  const handleSaveQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingQuestId) {
      // Edit existing
      const updated = quests.map((q) =>
        q.id === editingQuestId
          ? {
              ...q,
              title: formTitle,
              category: formCategory,
              actOrWorld: formActOrWorld,
              location: formLocation,
              episodePart: formEpisodePart,
              recommendedLevel: formRecommendedLevel,
              prerequisites: formPrerequisites,
              keyRewards: formKeyRewards,
              isMissable: formIsMissable,
              status: formStatus,
              notes: formNotes,
            }
          : q
      );
      onUpdateQuests(updated);
    } else {
      // Create new
      const newQuest: QuestEntry = {
        id: "q_" + Date.now(),
        title: formTitle,
        category: formCategory,
        actOrWorld: formActOrWorld,
        location: formLocation,
        episodePart: formEpisodePart,
        recommendedLevel: formRecommendedLevel,
        prerequisites: formPrerequisites,
        keyRewards: formKeyRewards,
        isMissable: formIsMissable,
        status: formStatus,
        notes: formNotes,
      };
      onUpdateQuests([newQuest, ...quests]);
    }
    setShowQuestForm(false);
  };

  // Delete Quest
  const handleDeleteQuest = (questId: string) => {
    onUpdateQuests(quests.filter((q) => q.id !== questId));
  };

  // Copy Markdown Progress Summary
  const handleCopyQuestLog = () => {
    const text = `### 🗺️ ${gameTitle} - Side Quest & Main Story Branch Log (${completedQuests}/${totalQuests} Completed - ${completionPercentage}%)\n\n` +
      quests
        .map(
          (q) =>
            `- [${q.status === "completed" ? "X" : " "}] **${q.title}** (${q.category}) - ${q.location} | Ep ${q.episodePart || "?"}${
              q.isMissable ? " 🚨 MISSABLE" : ""
            }${q.keyRewards ? ` | Reward: ${q.keyRewards}` : ""}`
        )
        .join("\n");

    navigator.clipboard.writeText(text);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#1c273e] border border-blue-500/35 w-full max-w-5xl rounded-2xl shadow-2xl shadow-blue-950/60 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-[#162136] border-b border-blue-500/30 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0 shadow-inner">
              <GitBranch className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white">{gameTitle}</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-400/30">
                  Branching Quest Tracker
                </span>
              </div>
              <p className="text-xs text-blue-200/80">
                Track main story acts, missable side quests, character arcs & points of no return.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyQuestLog}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-300 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 rounded-xl transition-all cursor-pointer"
              title="Copy Markdown quest log to clipboard"
            >
              {copiedLog ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
              <span>{copiedLog ? "Copied Log!" : "Copy Quest Log"}</span>
            </button>

            <button
              onClick={handleOpenAddForm}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all shadow-md shadow-purple-900/40 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Quest Branch</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress & Alert Dashboard Banner */}
        <div className="p-4 bg-gradient-to-r from-[#0d1e44] via-[#09142f] to-[#060e22] border-b border-blue-500/20 space-y-3 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-xs">
              <div>
                <span className="text-zinc-500 block text-[10px]">Overall Quest Completion</span>
                <span className="text-zinc-100 font-extrabold text-sm">
                  {completedQuests} / {totalQuests} Quests ({completionPercentage}%)
                </span>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <span className="text-zinc-500 block text-[10px]">In Progress</span>
                <span className="text-amber-300 font-bold text-xs">{inProgressQuests} Active Branches</span>
              </div>
            </div>

            {/* Missable Warning Pill */}
            {missablePendingQuests.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-semibold animate-pulse">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {missablePendingQuests.length} Missable Quest{missablePendingQuests.length > 1 ? "s" : ""} Pending! Watch Point of No Returns.
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-zinc-900 rounded-full h-2.5 overflow-hidden border border-white/5 p-0.5">
            <div
              className="bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="p-4 bg-[#121212] border-b border-white/5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {["All", "Main Story", "Side Quest", "Character Arc", "Secret/Optional", "Point of No Return"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  selectedCategory === cat
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-[#18181b] text-zinc-400 hover:text-zinc-200 border border-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Status Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search quests, rewards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-[#18181b] border border-white/10 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-purple-500/50 w-44 sm:w-56"
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 bg-[#18181b] border border-white/10 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-purple-500/50"
            >
              <option value="All">All Statuses</option>
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="missed">Missed</option>
            </select>
          </div>
        </div>

        {/* Quest List Container */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {filteredQuests.length === 0 ? (
            <div className="text-center py-12 bg-[#09090b] rounded-2xl border border-white/5 space-y-2">
              <GitBranch className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-sm font-semibold text-zinc-400">No quest branches match the selected filters.</p>
              <button
                onClick={handleOpenAddForm}
                className="text-xs text-purple-400 hover:text-purple-300 underline font-semibold"
              >
                Add a new quest branch
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredQuests.map((quest) => (
                <div
                  key={quest.id}
                  className={`p-4 rounded-xl border transition-all space-y-3 relative group ${
                    quest.status === "completed"
                      ? "bg-emerald-950/20 border-emerald-500/30 text-zinc-300"
                      : quest.status === "missed"
                      ? "bg-red-950/20 border-red-500/30 text-zinc-400"
                      : quest.status === "in_progress"
                      ? "bg-amber-950/20 border-amber-500/30 text-zinc-100"
                      : "bg-[#18181b]/80 border-white/10 hover:border-purple-500/40 text-zinc-200"
                  }`}
                >
                  {/* Top Header Row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 pr-12">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                            quest.category === "Main Story"
                              ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
                              : quest.category === "Point of No Return"
                              ? "bg-red-500/10 text-red-300 border-red-500/30"
                              : quest.category === "Character Arc"
                              ? "bg-purple-500/10 text-purple-300 border-purple-500/30"
                              : quest.category === "Secret/Optional"
                              ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
                              : "bg-zinc-800 text-zinc-300 border-zinc-700"
                          }`}
                        >
                          {quest.category}
                        </span>

                        {quest.isMissable && (
                          <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-400" />
                            <span>MISSABLE</span>
                          </span>
                        )}

                        {quest.episodePart && (
                          <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-900 border border-white/10 px-1.5 py-0.5 rounded">
                            Ep Part {quest.episodePart}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-zinc-100 leading-snug">{quest.title}</h3>
                    </div>

                    {/* Action Menu (Edit / Delete) */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleOpenEditForm(quest)}
                        className="p-1 text-zinc-400 hover:text-purple-300 bg-zinc-900 hover:bg-zinc-800 rounded-md transition-colors"
                        title="Edit Quest"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuest(quest.id)}
                        className="p-1 text-zinc-400 hover:text-red-400 bg-zinc-900 hover:bg-zinc-800 rounded-md transition-colors"
                        title="Delete Quest"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Location & Act Details */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-purple-400" />
                      <span>{quest.location || "Unknown Location"}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-blue-400" />
                      <span>{quest.actOrWorld}</span>
                    </span>
                    {quest.recommendedLevel && (
                      <span className="flex items-center gap-1 text-emerald-400 font-medium">
                        <Zap className="w-3.5 h-3.5" />
                        <span>{quest.recommendedLevel}</span>
                      </span>
                    )}
                  </div>

                  {/* Rewards & Prerequisites */}
                  {(quest.keyRewards || quest.prerequisites) && (
                    <div className="p-2.5 bg-[#09090b] rounded-lg border border-white/5 text-xs space-y-1">
                      {quest.keyRewards && (
                        <div className="flex items-start gap-1.5 text-emerald-300">
                          <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-emerald-400 font-semibold">Rewards:</strong> {quest.keyRewards}
                          </span>
                        </div>
                      )}
                      {quest.prerequisites && (
                        <div className="flex items-start gap-1.5 text-zinc-400">
                          <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-zinc-300 font-semibold">Prereqs:</strong> {quest.prerequisites}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Notes if present */}
                  {quest.notes && (
                    <p className="text-[11px] text-zinc-400 italic leading-relaxed border-l-2 border-purple-500/40 pl-2">
                      "{quest.notes}"
                    </p>
                  )}

                  {/* Footer Status Toggle Control */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-zinc-500">Click to cycle status:</span>
                    <button
                      onClick={() => handleCycleStatus(quest.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                        quest.status === "completed"
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
                          : quest.status === "in_progress"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30"
                          : quest.status === "missed"
                          ? "bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30"
                          : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700"
                      }`}
                    >
                      {quest.status === "completed" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      {quest.status === "in_progress" && <Clock className="w-3.5 h-3.5 text-amber-400" />}
                      {quest.status === "missed" && <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
                      {quest.status === "planned" && <Calendar className="w-3.5 h-3.5 text-zinc-400" />}
                      <span className="capitalize">{quest.status.replace("_", " ")}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Form for Add/Edit */}
        {showQuestForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <form
              onSubmit={handleSaveQuest}
              className="bg-[#121212] border border-purple-500/40 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base font-extrabold text-zinc-100 flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-purple-400" />
                  <span>{editingQuestId ? "Edit Quest Branch" : "Add New Quest Branch"}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowQuestForm(false)}
                  className="p-1 text-zinc-400 hover:text-zinc-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Quest Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Suplexing the Phantom Train & Shadow's Rescue"
                    className="w-full px-3 py-2 bg-[#18181b] border border-white/10 rounded-lg text-zinc-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as QuestCategory)}
                      className="w-full px-3 py-2 bg-[#18181b] border border-white/10 rounded-lg text-zinc-100 focus:outline-none focus:border-purple-500"
                    >
                      <option value="Main Story">Main Story</option>
                      <option value="Side Quest">Side Quest</option>
                      <option value="Character Arc">Character Arc</option>
                      <option value="Secret/Optional">Secret/Optional</option>
                      <option value="Point of No Return">Point of No Return</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">Act / World</label>
                    <input
                      type="text"
                      value={formActOrWorld}
                      onChange={(e) => setFormActOrWorld(e.target.value)}
                      placeholder="e.g. World of Balance, Act 1"
                      className="w-full px-3 py-2 bg-[#18181b] border border-white/10 rounded-lg text-zinc-100 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">Location</label>
                    <input
                      type="text"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="e.g. Doma Castle, Phantom Forest"
                      className="w-full px-3 py-2 bg-[#18181b] border border-white/10 rounded-lg text-zinc-100 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">Episode Part #</label>
                    <select
                      value={formEpisodePart}
                      onChange={(e) => setFormEpisodePart(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#18181b] border border-white/10 rounded-lg text-zinc-100 focus:outline-none focus:border-purple-500"
                    >
                      {episodes.map((ep) => (
                        <option key={ep.id} value={ep.partNumber}>
                          Part {ep.partNumber}: {ep.shortTitle}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">Recommended Level</label>
                    <input
                      type="text"
                      value={formRecommendedLevel}
                      onChange={(e) => setFormRecommendedLevel(e.target.value)}
                      placeholder="e.g. Lv 15 - 20"
                      className="w-full px-3 py-2 bg-[#18181b] border border-white/10 rounded-lg text-zinc-100 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as QuestStatus)}
                      className="w-full px-3 py-2 bg-[#18181b] border border-white/10 rounded-lg text-zinc-100 focus:outline-none focus:border-purple-500"
                    >
                      <option value="planned">Planned</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="missed">Missed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Key Rewards</label>
                  <input
                    type="text"
                    value={formKeyRewards}
                    onChange={(e) => setFormKeyRewards(e.target.value)}
                    placeholder="e.g. Excalibur, Phantom Esper, Moogle Charm"
                    className="w-full px-3 py-2 bg-[#18181b] border border-white/10 rounded-lg text-zinc-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Prerequisites</label>
                  <input
                    type="text"
                    value={formPrerequisites}
                    onChange={(e) => setFormPrerequisites(e.target.value)}
                    placeholder="e.g. Needs Rust Key, Recruit Shadow at Inn"
                    className="w-full px-3 py-2 bg-[#18181b] border border-white/10 rounded-lg text-zinc-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isMissableCheck"
                    checked={formIsMissable}
                    onChange={(e) => setFormIsMissable(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 accent-purple-500"
                  />
                  <label htmlFor="isMissableCheck" className="text-zinc-200 font-bold cursor-pointer">
                    Missable Quest / Point of No Return Alert
                  </label>
                </div>

                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Walkthrough / Strategy Notes</label>
                  <textarea
                    rows={2}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="e.g. Wait at airship timer until 0:05 so Shadow leaps aboard..."
                    className="w-full px-3 py-2 bg-[#18181b] border border-white/10 rounded-lg text-zinc-100 focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowQuestForm(false)}
                  className="px-4 py-2 bg-[#18181b] hover:bg-[#27272a] text-zinc-300 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-purple-900/40"
                >
                  {editingQuestId ? "Save Changes" : "Create Quest Branch"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
