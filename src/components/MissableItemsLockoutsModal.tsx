import React, { useState, useMemo } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Lock,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Check,
  Sparkles,
  MapPin,
  X,
  Layers,
  ChevronDown,
  ChevronRight,
  Info,
  CheckCheck
} from "lucide-react";
import { Episode, MissableAlert, PlaythroughSeries } from "../types";

interface MissableItemsLockoutsModalProps {
  isOpen?: boolean;
  activeSeries?: PlaythroughSeries;
  series?: PlaythroughSeries;
  episodes?: Episode[];
  onUpdateEpisode?: (updated: Episode) => void;
  onBatchUpdateEpisodes?: (updatedEpisodes: Episode[]) => void;
  onUpdateEpisodes?: (updatedEpisodes: Episode[]) => void;
  onClose: () => void;
  onOpenEpisodeDetail?: (episode: Episode) => void;
}

const CATEGORIES: MissableAlert["category"][] = [
  "Weapon",
  "Armor",
  "Tool",
  "Rune",
  "Gesture",
  "Key Item",
  "NPC Quest",
  "Secret Area",
  "Boss / Ending",
  "Collectible",
  "Ability / Magic",
  "Trophy / Achievement",
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Weapon: { bg: "bg-red-500/10", text: "text-red-300", border: "border-red-500/30" },
  Armor: { bg: "bg-blue-500/10", text: "text-blue-300", border: "border-blue-500/30" },
  Tool: { bg: "bg-emerald-500/10", text: "text-emerald-300", border: "border-emerald-500/30" },
  Rune: { bg: "bg-cyan-500/10", text: "text-cyan-300", border: "border-cyan-500/30" },
  Gesture: { bg: "bg-purple-500/10", text: "text-purple-300", border: "border-purple-500/30" },
  "Key Item": { bg: "bg-amber-500/10", text: "text-amber-300", border: "border-amber-500/30" },
  "NPC Quest": { bg: "bg-pink-500/10", text: "text-pink-300", border: "border-pink-500/30" },
  "Secret Area": { bg: "bg-indigo-500/10", text: "text-indigo-300", border: "border-indigo-500/30" },
  "Boss / Ending": { bg: "bg-rose-500/15", text: "text-rose-300", border: "border-rose-500/40" },
  Collectible: { bg: "bg-yellow-500/10", text: "text-yellow-300", border: "border-yellow-500/30" },
  "Ability / Magic": { bg: "bg-teal-500/10", text: "text-teal-300", border: "border-teal-500/30" },
  "Trophy / Achievement": { bg: "bg-violet-500/10", text: "text-violet-300", border: "border-violet-500/30" },
};

export const MissableItemsLockoutsModal: React.FC<MissableItemsLockoutsModalProps> = ({
  isOpen = true,
  activeSeries,
  series,
  episodes = [],
  onUpdateEpisode,
  onBatchUpdateEpisodes,
  onUpdateEpisodes,
  onClose,
  onOpenEpisodeDetail,
}) => {
  if (!isOpen) return null;

  const currentSeries = activeSeries || series;
  const gameTitle = currentSeries?.gameTitle || "Gaming Series";

  const handleUpdateEpisodeInternal = (updated: Episode) => {
    if (onUpdateEpisode) {
      onUpdateEpisode(updated);
    } else if (onBatchUpdateEpisodes || onUpdateEpisodes) {
      const updatedList = (episodes || []).map((ep) => (ep.id === updated.id ? updated : ep));
      (onBatchUpdateEpisodes || onUpdateEpisodes)?.(updatedList);
    }
  };
  const [selectedEpFilter, setSelectedEpFilter] = useState<number | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "secured">("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [copiedChecklist, setCopiedChecklist] = useState<boolean>(false);

  // Add / Edit Form State
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [targetEpisodeId, setTargetEpisodeId] = useState<number>(
    episodes.length > 0 ? episodes[0].id : 0
  );
  const [editingAlertId, setEditingAlertId] = useState<string | null>(null);
  const [editingEpisodeId, setEditingEpisodeId] = useState<number | null>(null);

  // Form Fields
  const [formItemName, setFormItemName] = useState<string>("");
  const [formCategory, setFormCategory] = useState<MissableAlert["category"]>("Key Item");
  const [formLocation, setFormLocation] = useState<string>("");
  const [formLockoutTrigger, setFormLockoutTrigger] = useState<string>("");
  const [formHowToGet, setFormHowToGet] = useState<string>("");
  const [formWarning, setFormWarning] = useState<string>("");

  // Flatten all missable alerts across the series with their parent episode
  const allMissablesWithEp = useMemo(() => {
    const list: {
      alert: MissableAlert;
      episode: Episode;
      alertIndex: number;
      uniqueKey: string;
    }[] = [];

    (episodes || []).forEach((ep) => {
      if (!ep || !Array.isArray(ep.missableAlerts)) return;
      ep.missableAlerts.forEach((alert, idx) => {
        if (!alert) return;
        const uniqueKey = alert.id || `${ep.id}_${idx}_${alert.itemName}`;
        list.push({
          alert,
          episode: ep,
          alertIndex: idx,
          uniqueKey,
        });
      });
    });

    return list;
  }, [episodes]);

  // Filtered Missables List
  const filteredList = useMemo(() => {
    return allMissablesWithEp.filter(({ alert, episode }) => {
      // Episode filter
      if (selectedEpFilter !== "all" && episode.partNumber !== selectedEpFilter) {
        return false;
      }
      // Category filter
      if (selectedCategory !== "all" && alert.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (statusFilter === "secured" && !alert.isSecured) {
        return false;
      }
      if (statusFilter === "pending" && alert.isSecured) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = alert.itemName?.toLowerCase().includes(query);
        const matchesLoc = alert.location?.toLowerCase().includes(query);
        const matchesTrigger = alert.lockoutTrigger?.toLowerCase().includes(query);
        const matchesHow = alert.howToGet?.toLowerCase().includes(query);
        const matchesWarning = alert.warning?.toLowerCase().includes(query);
        const matchesEp = `ep ${episode.partNumber}`.toLowerCase().includes(query) || episode.title?.toLowerCase().includes(query);

        if (!matchesName && !matchesLoc && !matchesTrigger && !matchesHow && !matchesWarning && !matchesEp) {
          return false;
        }
      }
      return true;
    });
  }, [allMissablesWithEp, selectedEpFilter, selectedCategory, statusFilter, searchTerm]);

  // Overall Statistics
  const totalCount = allMissablesWithEp.length;
  const securedCount = allMissablesWithEp.filter((m) => m.alert.isSecured).length;
  const pendingCount = totalCount - securedCount;
  const completionPercent = totalCount > 0 ? Math.round((securedCount / totalCount) * 100) : 0;

  // Toggle Secured state
  const handleToggleSecured = (episode: Episode, alertIndex: number) => {
    const updatedAlerts = [...(episode.missableAlerts || [])];
    const target = updatedAlerts[alertIndex];
    if (!target) return;

    updatedAlerts[alertIndex] = {
      ...target,
      isSecured: !target.isSecured,
    };

    handleUpdateEpisodeInternal({
      ...episode,
      missableAlerts: updatedAlerts,
    });
  };

  // Mark all filtered as secured
  const handleMarkAllFilteredSecured = (secured: boolean) => {
    const episodeMap = new Map<number, Episode>();
    (episodes || []).forEach((ep) => {
      episodeMap.set(ep.id, { ...ep, missableAlerts: [...(ep.missableAlerts || [])] });
    });

    filteredList.forEach(({ episode, alertIndex }) => {
      const epInMap = episodeMap.get(episode.id);
      if (epInMap && epInMap.missableAlerts && epInMap.missableAlerts[alertIndex]) {
        epInMap.missableAlerts[alertIndex] = {
          ...epInMap.missableAlerts[alertIndex],
          isSecured: secured,
        };
      }
    });

    const updatedList = Array.from(episodeMap.values());
    if (onBatchUpdateEpisodes) {
      onBatchUpdateEpisodes(updatedList);
    } else if (onUpdateEpisodes) {
      onUpdateEpisodes(updatedList);
    } else if (onUpdateEpisode) {
      updatedList.forEach((ep) => onUpdateEpisode(ep));
    }
  };

  // Delete Alert
  const handleDeleteAlert = (episode: Episode, alertIndex: number) => {
    const updatedAlerts = (episode.missableAlerts || []).filter((_, idx) => idx !== alertIndex);
    handleUpdateEpisodeInternal({
      ...episode,
      missableAlerts: updatedAlerts,
    });
  };

  // Open Edit Form
  const handleStartEdit = (episode: Episode, alert: MissableAlert, alertIndex: number) => {
    setEditingAlertId(alert.id || `${episode.id}_${alertIndex}`);
    setEditingEpisodeId(episode.id);
    setTargetEpisodeId(episode.id);
    setFormItemName(alert.itemName);
    setFormCategory(alert.category);
    setFormLocation(alert.location);
    setFormLockoutTrigger(alert.lockoutTrigger);
    setFormHowToGet(alert.howToGet);
    setFormWarning(alert.warning);
    setShowAddForm(true);
  };

  // Reset & Close Form
  const handleResetForm = () => {
    setEditingAlertId(null);
    setEditingEpisodeId(null);
    setFormItemName("");
    setFormCategory("Key Item");
    setFormLocation("");
    setFormLockoutTrigger("");
    setFormHowToGet("");
    setFormWarning("");
    setShowAddForm(false);
  };

  // Submit Add / Edit Form
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formItemName.trim()) return;

    const targetEp = episodes.find((ep) => ep.id === targetEpisodeId);
    if (!targetEp) return;

    const newAlert: MissableAlert = {
      id: editingAlertId || `missable_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      episodePart: targetEp.partNumber,
      itemName: formItemName.trim(),
      category: formCategory,
      location: formLocation.trim() || "Story Area",
      lockoutTrigger: formLockoutTrigger.trim() || "Advancing to next story chapter",
      howToGet: formHowToGet.trim() || "Obtain before passing the point of no return.",
      warning: formWarning.trim() || "Permanently unavailable if missed in this playthrough!",
      isSecured: false,
    };

    if (editingAlertId && editingEpisodeId) {
      // If editing in same episode
      if (editingEpisodeId === targetEp.id) {
        const updatedAlerts = (targetEp.missableAlerts || []).map((a, idx) => {
          if (a.id === editingAlertId || `${targetEp.id}_${idx}` === editingAlertId) {
            return { ...newAlert, isSecured: a.isSecured };
          }
          return a;
        });
        handleUpdateEpisodeInternal({ ...targetEp, missableAlerts: updatedAlerts });
      } else {
        // Moved to a different episode
        const oldEp = episodes.find((ep) => ep.id === editingEpisodeId);
        if (oldEp) {
          const filteredOld = (oldEp.missableAlerts || []).filter(
            (a, idx) => a.id !== editingAlertId && `${oldEp.id}_${idx}` !== editingAlertId
          );
          handleUpdateEpisodeInternal({ ...oldEp, missableAlerts: filteredOld });
        }
        const updatedNew = [...(targetEp.missableAlerts || []), newAlert];
        handleUpdateEpisodeInternal({ ...targetEp, missableAlerts: updatedNew });
      }
    } else {
      // Add new
      const updatedAlerts = [...(targetEp.missableAlerts || []), newAlert];
      handleUpdateEpisodeInternal({ ...targetEp, missableAlerts: updatedAlerts });
    }

    handleResetForm();
  };

  // Copy Full Series Missables Checklist to Clipboard
  const handleCopyChecklist = () => {
    let md = `# ⚠️ ${gameTitle} - 100% Critical Missable Items & Story Lockouts\n\n`;
    md += `**Series Progress**: ${securedCount} / ${totalCount} Secured (${completionPercent}% Complete)\n\n`;
    md += `---\n\n`;

    (episodes || []).forEach((ep) => {
      if (!ep.missableAlerts || ep.missableAlerts.length === 0) return;
      md += `## 🎬 Episode #${ep.partNumber < 10 ? `0${ep.partNumber}` : ep.partNumber}: ${ep.shortTitle || ep.title}\n`;
      md += `*World/Act: ${ep.world} | Start: ${ep.startPoint} -> End: ${ep.endPoint}*\n\n`;

      ep.missableAlerts.forEach((alert) => {
        const checkMark = alert.isSecured ? "[x]" : "[ ]";
        md += `- ${checkMark} **${alert.itemName}** (${alert.category})\n`;
        md += `  - 📍 **Location**: ${alert.location}\n`;
        md += `  - 🚫 **Lockout Trigger**: ${alert.lockoutTrigger}\n`;
        md += `  - 🗝️ **How To Get**: ${alert.howToGet}\n`;
        md += `  - ⚠️ **Warning**: ${alert.warning}\n\n`;
      });
      md += `---\n\n`;
    });

    navigator.clipboard.writeText(md);
    setCopiedChecklist(true);
    setTimeout(() => setCopiedChecklist(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0e111a] border border-rose-500/30 w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh] transition-all">
        {/* Header Bar */}
        <div className="px-5 py-4 bg-gradient-to-r from-rose-950/80 via-[#131726] to-[#0a0d14] border-b border-rose-500/30 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0 shadow-inner">
              <ShieldAlert className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-300 bg-rose-950/90 px-2.5 py-0.5 rounded-full border border-rose-500/40">
                  100% Walkthrough & Lockout Shield
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  {gameTitle}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                Critical Missable Items & Story Lockouts
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyChecklist}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/70 hover:bg-rose-900/90 text-rose-200 border border-rose-500/40 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              title="Copy markdown checklist for recording notes or stream overlay"
            >
              {copiedChecklist ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedChecklist ? "Copied Checklist!" : "Copy Checklist"}</span>
            </button>

            <button
              onClick={() => {
                handleResetForm();
                setShowAddForm(!showAddForm);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-lg transition-all shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Missable Alert</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors border border-white/10 cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Analytics & Progress Bar */}
        <div className="px-5 py-3.5 bg-[#0b0e18] border-b border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
          <div className="bg-[#121624] p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Missables
              </span>
              <span className="text-base font-black text-white">{totalCount} Items</span>
            </div>
            <Layers className="w-5 h-5 text-rose-400 opacity-60" />
          </div>

          <div className="bg-[#121624] p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                Secured / Collected
              </span>
              <span className="text-base font-black text-emerald-300">{securedCount} Items</span>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-400 opacity-70" />
          </div>

          <div className="bg-[#121624] p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Pending / At Risk
              </span>
              <span className="text-base font-black text-amber-300">{pendingCount} Items</span>
            </div>
            <Lock className="w-5 h-5 text-amber-400 opacity-70" />
          </div>

          <div className="bg-[#121624] p-2.5 rounded-xl border border-white/5 flex flex-col justify-center">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 mb-1">
              <span>Security Score</span>
              <span className="text-rose-300 font-mono">{completionPercent}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-white/5">
              <div
                className="bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-400 h-full transition-all duration-500 rounded-full"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Add / Edit Missable Alert Form (Collapsible) */}
        {showAddForm && (
          <form
            onSubmit={handleSubmitForm}
            className="p-4 sm:p-5 bg-gradient-to-b from-rose-950/40 via-[#111627] to-[#0d101e] border-b border-rose-500/40 space-y-3 shrink-0 animate-fade-in"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-rose-400" />
                <span>{editingAlertId ? "Edit Missable Item Alert" : "Log New Missable Item & Permanent Lockout"}</span>
              </h4>
              <button
                type="button"
                onClick={handleResetForm}
                className="text-slate-400 hover:text-white text-xs flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Target Episode
                </label>
                <select
                  value={targetEpisodeId}
                  onChange={(e) => setTargetEpisodeId(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-400 font-medium"
                >
                  {(episodes || []).map((ep) => (
                    <option key={ep.id} value={ep.id}>
                      EP #{ep.partNumber < 10 ? `0${ep.partNumber}` : ep.partNumber} - {ep.shortTitle || ep.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Item / Quest Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Water Rondo Dance / Genji Glove / Cord of Eye"
                  value={formItemName}
                  onChange={(e) => setFormItemName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-400 placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Category
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-400 font-medium"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  📍 In-Game Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Serpent Trench / South Figaro Cellar / Byrgenwerth"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-rose-400 placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block mb-1">
                  🚫 Permanent Lockout Trigger (Point of No Return) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Boarding the Blackjack Airship / Defeating Rom / Floating Continent"
                  value={formLockoutTrigger}
                  onChange={(e) => setFormLockoutTrigger(e.target.value)}
                  className="w-full bg-slate-900 border border-rose-500/40 rounded-lg px-3 py-1.5 text-xs text-rose-200 focus:outline-none focus:border-rose-400 placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  🗝️ How To Get & Exact Method
                </label>
                <textarea
                  rows={2}
                  placeholder="Detailed instructions: dialogue choices, chest location, pre-requisites..."
                  value={formHowToGet}
                  onChange={(e) => setFormHowToGet(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400 placeholder:text-slate-600 resize-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  ⚠️ Critical Warning & Pacing Note
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. If not learned now, Mog will NEVER be able to learn this dance in World of Ruin!"
                  value={formWarning}
                  onChange={(e) => setFormWarning(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-amber-200 focus:outline-none focus:border-amber-400 placeholder:text-slate-600 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={handleResetForm}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-lg transition-colors shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{editingAlertId ? "Save Changes" : "Create Missable Alert"}</span>
              </button>
            </div>
          </form>
        )}

        {/* Filters & Search Control Toolbar */}
        <div className="p-3.5 sm:p-4 bg-[#0a0d16] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search missables, items, locations, lockout triggers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-lg text-xs text-white focus:outline-none focus:border-rose-400 placeholder:text-slate-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Episode Filter */}
            <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 rounded-lg px-2 py-1 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Ep:</span>
              <select
                value={selectedEpFilter}
                onChange={(e) => setSelectedEpFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer text-xs"
              >
                <option value="all">All Episodes ({episodes.length})</option>
                {(episodes || []).map((ep) => (
                  <option key={ep.id} value={ep.partNumber}>
                    EP {ep.partNumber < 10 ? `0${ep.partNumber}` : ep.partNumber} ({ep.missableAlerts?.length || 0})
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 rounded-lg px-2 py-1 text-xs">
              <Filter className="w-3 h-3 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer text-xs"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 rounded-lg p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                  statusFilter === "all" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("pending")}
                className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                  statusFilter === "pending" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Pending
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("secured")}
                className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                  statusFilter === "secured" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Secured
              </button>
            </div>

            {/* Batch toggle filtered */}
            {filteredList.length > 0 && onBatchUpdateEpisodes && (
              <div className="hidden sm:flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMarkAllFilteredSecured(true)}
                  className="p-1.5 rounded bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                  title="Mark all shown items as secured"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Secure All Filtered</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main List Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-gradient-to-b from-[#0a0d16] via-[#0d101c] to-[#070911]">
          {filteredList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredList.map(({ alert, episode, alertIndex, uniqueKey }) => {
                const catStyle = CATEGORY_COLORS[alert.category] || {
                  bg: "bg-slate-500/10",
                  text: "text-slate-300",
                  border: "border-slate-500/30",
                };

                return (
                  <div
                    key={uniqueKey}
                    className={`rounded-xl border transition-all shadow-md p-4 space-y-3 flex flex-col justify-between ${
                      alert.isSecured
                        ? "bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-400/50"
                        : "bg-[#111524] border-rose-500/30 hover:border-rose-500/60"
                    }`}
                  >
                    {/* Top Row: Title, Episode Tag & Category Badge */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 min-w-0">
                          {/* 1-Click Toggle Checkbox Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleSecured(episode, alertIndex)}
                            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
                              alert.isSecured
                                ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md"
                                : "bg-slate-900 border border-slate-700 text-slate-500 hover:border-rose-400 hover:text-rose-400"
                            }`}
                            title={alert.isSecured ? "Mark as Pending" : "Mark as Secured / Collected"}
                          >
                            {alert.isSecured ? <Check className="w-4 h-4 stroke-[3]" /> : <Circle className="w-3.5 h-3.5" />}
                          </button>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className={`text-sm font-black tracking-tight ${
                                  alert.isSecured ? "text-emerald-200 line-through opacity-80" : "text-white"
                                }`}
                              >
                                {alert.itemName}
                              </span>
                              <span
                                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                              >
                                {alert.category}
                              </span>
                            </div>

                            {/* Episode Part Link */}
                            <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-400">
                              <span className="font-mono font-bold text-rose-400 bg-rose-950/60 px-1.5 py-0.2 rounded border border-rose-500/30">
                                EP #{episode.partNumber < 10 ? `0${episode.partNumber}` : episode.partNumber}
                              </span>
                              <span className="truncate">{episode.shortTitle || episode.title}</span>
                              {onOpenEpisodeDetail && (
                                <button
                                  type="button"
                                  onClick={() => onOpenEpisodeDetail(episode)}
                                  className="text-blue-400 hover:text-blue-300 underline font-semibold text-[10px] ml-1"
                                >
                                  View Ep
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Edit & Delete Action Buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(episode, alert, alertIndex)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors text-xs"
                            title="Edit Alert"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAlert(episode, alertIndex)}
                            className="p-1 rounded bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors text-xs"
                            title="Delete Alert"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Location & Permanent Lockout Trigger Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                        <div className="bg-black/40 p-2 rounded-lg border border-white/5 space-y-0.5">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-blue-400" /> Location
                          </span>
                          <p className="text-slate-200 font-medium text-[11.5px]">{alert.location}</p>
                        </div>

                        <div className="bg-rose-950/30 p-2 rounded-lg border border-rose-500/20 space-y-0.5">
                          <span className="text-[10px] uppercase font-bold text-rose-400 block flex items-center gap-1">
                            <Lock className="w-3 h-3 text-rose-400" /> Lockout Trigger
                          </span>
                          <p className="text-rose-200 font-semibold text-[11.5px]">{alert.lockoutTrigger}</p>
                        </div>
                      </div>

                      {/* How To Get Details */}
                      <div className="bg-slate-950/60 p-2.5 rounded-lg border border-emerald-500/20 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                          🗝️ How To Get & Required Steps:
                        </span>
                        <p className="text-emerald-200/90 text-xs leading-relaxed font-medium">
                          {alert.howToGet}
                        </p>
                      </div>

                      {/* Warning Box */}
                      <div className="bg-amber-950/30 p-2 rounded-lg border border-amber-500/30 flex items-start gap-1.5 text-xs text-amber-200/90">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-[11px] leading-snug font-medium">{alert.warning}</p>
                      </div>
                    </div>

                    {/* Bottom Status Banner */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-slate-400">
                        Status:{" "}
                        <span className={alert.isSecured ? "text-emerald-400" : "text-amber-400 font-bold"}>
                          {alert.isSecured ? "✓ Secured In Playthrough" : "⚠️ Pending Verification"}
                        </span>
                      </span>

                      <button
                        type="button"
                        onClick={() => handleToggleSecured(episode, alertIndex)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          alert.isSecured
                            ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                            : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
                        }`}
                      >
                        {alert.isSecured ? <Circle className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                        <span>{alert.isSecured ? "Mark Unsecured" : "Mark as Secured"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 px-4 bg-[#0d101c] rounded-2xl border border-dashed border-slate-800 space-y-3">
              <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">
                {searchTerm || selectedCategory !== "all" || selectedEpFilter !== "all"
                  ? "No missable alerts match your filter criteria."
                  : "No Critical Missable Items logged for this playthrough yet."}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Track points of no return, missable ultimate weapons, one-time NPC triggers, and permanent story lockouts to guarantee a 100% playthrough.
              </p>
              <button
                type="button"
                onClick={() => {
                  handleResetForm();
                  setShowAddForm(true);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-lg transition-all shadow-md inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Missable Alert</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-5 py-3 bg-[#080b12] border-t border-white/10 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="text-[11px]">
              Missables and lockout alerts are synced automatically to each episode and persisted in your playthrough files.
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-colors cursor-pointer"
          >
            Close Shield
          </button>
        </div>
      </div>
    </div>
  );
};
