import React, { useState } from "react";
import {
  X,
  Trophy,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award,
  Sparkles,
  Layers,
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  Zap,
  Target,
  Shield,
  Swords,
  BookOpen,
  PieChart,
  BarChart3,
  Calendar,
  Grid
} from "lucide-react";
import { Episode, PlaythroughSeries, QuestEntry, BossEntry, LootEntry } from "../types";
import { getBossAndLootForSeries } from "../data/bossLootData";

interface CompletionDashboardModalProps {
  activeSeries?: PlaythroughSeries;
  episodes: Episode[];
  quests?: QuestEntry[];
  onClose: () => void;
}

export const CompletionDashboardModal: React.FC<CompletionDashboardModalProps> = ({
  activeSeries,
  episodes,
  quests = [],
  onClose
}) => {
  const seriesId = activeSeries?.id || "default";

  // Load bosses and loot state
  const bosses: BossEntry[] = (() => {
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
  })();

  const loot: LootEntry[] = (() => {
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
  })();

  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "episodes_matrix" | "missables">("overview");

  // Calculations
  const totalEpisodes = episodes.length;
  const publishedEpisodes = episodes.filter((e) => e.status === "published").length;
  const recordedEpisodes = episodes.filter((e) => e.status !== "not_started").length;

  const totalQuests = quests.length;
  const completedQuests = quests.filter((q) => q.status === "completed").length;

  const totalBosses = bosses.length;
  const defeatedBosses = bosses.filter((b) => b.defeated).length;

  const totalLoot = loot.length;
  const collectedLoot = loot.filter((l) => l.collected).length;

  // Percentage Calculations
  const epPercent = totalEpisodes > 0 ? Math.round((publishedEpisodes / totalEpisodes) * 100) : 0;
  const questPercent = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 100;
  const bossPercent = totalBosses > 0 ? Math.round((defeatedBosses / totalBosses) * 100) : 100;
  const lootPercent = totalLoot > 0 ? Math.round((collectedLoot / totalLoot) * 100) : 100;

  // Overall Master 100% Score
  const overallPercent = Math.round(
    (epPercent * 0.3) + (questPercent * 0.25) + (bossPercent * 0.25) + (lootPercent * 0.2)
  );

  // Missables
  const missableQuests = quests.filter((q) => q.isMissable);
  const missableBosses = bosses.filter((b) => b.isMissable);
  const missableLoot = loot.filter((l) => l.isMissable);

  const pendingMissablesCount =
    missableQuests.filter((q) => q.status !== "completed").length +
    missableBosses.filter((b) => !b.defeated).length +
    missableLoot.filter((l) => !l.collected).length;

  // Generate 100% Walkthrough Markdown Summary
  const generate100PercentGuide = () => {
    let md = `# 🏆 100% Completion Walkthrough Checklist: ${activeSeries?.gameTitle || "Playthrough Series"}\n`;
    md += `**Overall Series Completion:** ${overallPercent}% | **Published Episodes:** ${publishedEpisodes}/${totalEpisodes}\n\n`;

    md += `## 📜 Episode Progress Matrix\n`;
    episodes.forEach((e) => {
      md += `- Part #${e.partNumber}: **${e.title}** [Status: ${e.status.toUpperCase()}] (Est. ${e.estDurationMinutes}m)\n`;
    });

    if (bosses.length > 0) {
      md += `\n## ⚔️ Major Boss Encounters (${defeatedBosses}/${totalBosses})\n`;
      bosses.forEach((b) => {
        md += `- [${b.defeated ? "x" : " "}] Part #${b.episodePart}: **${b.name}** (${b.location}) - HP: ${b.hp} | Weakness: ${b.weakness}${b.isMissable ? " [MISSABLE]" : ""}\n`;
      });
    }

    if (quests.length > 0) {
      md += `\n## 🎯 Side Quests & Main Story Milestones (${completedQuests}/${totalQuests})\n`;
      quests.forEach((q) => {
        md += `- [${q.status === "completed" ? "x" : " "}] **${q.title}** (${q.category}) - ${q.location}${q.isMissable ? " [MISSABLE]" : ""}\n`;
      });
    }

    if (loot.length > 0) {
      md += `\n## 💎 Key Items, Relics & Collectibles (${collectedLoot}/${totalLoot})\n`;
      loot.forEach((l) => {
        md += `- [${l.collected ? "x" : " "}] Part #${l.episodePart}: **${l.name}** (${l.category}) - ${l.location}\n`;
      });
    }

    return md;
  };

  const handleCopyGuide = () => {
    navigator.clipboard.writeText(generate100PercentGuide());
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#0e0e11] border-2 border-emerald-500/50 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl shadow-emerald-950/80 overflow-hidden text-white font-sans">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-950/80 via-zinc-950 to-zinc-950 border-b border-emerald-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
              <Trophy className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 px-2 py-0.5 bg-emerald-500/20 rounded border border-emerald-500/30">
                  Feature 5
                </span>
                <span className="text-xs text-zinc-400 font-bold">
                  {activeSeries?.gameTitle || "Playthrough Series"}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Series Progress & 100% Completion Dashboard
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyGuide}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow flex items-center gap-1.5 cursor-pointer transition-all"
            >
              {copiedMarkdown ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedMarkdown ? "Copied Guide!" : "Copy 100% Markdown Guide"}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Master Score Banner */}
        <div className="p-4 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Circular Gauge */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center bg-zinc-900 rounded-full border-2 border-emerald-500/40 shadow-inner">
              <div className="text-center">
                <span className="text-lg sm:text-2xl font-black text-emerald-400 block leading-none">
                  {overallPercent}%
                </span>
                <span className="text-[8px] font-black uppercase text-zinc-400 block mt-0.5">
                  100% INDEX
                </span>
              </div>
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-black uppercase">
                  {overallPercent >= 100 ? "100% PLATINUM CLEAR" : overallPercent >= 75 ? "ENDGAME READY" : "IN PROGRESS"}
                </span>
                {pendingMissablesCount > 0 && (
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-300 border border-red-500/30 rounded text-[10px] font-extrabold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-red-400" />
                    <span>{pendingMissablesCount} MISSABLES AT RISK</span>
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-black text-white truncate">
                {activeSeries?.gameTitle} — Master Completion Status
              </h3>
              <p className="text-xs text-zinc-400">
                Track full series completion across YouTube uploads, side quests, boss trophies, and missable items.
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800 shrink-0 w-full sm:w-auto justify-center">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                activeTab === "overview" ? "bg-emerald-600 text-white shadow" : "text-zinc-400 hover:text-white"
              }`}
            >
              Overview Breakdown
            </button>
            <button
              onClick={() => setActiveTab("episodes_matrix")}
              className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                activeTab === "episodes_matrix" ? "bg-emerald-600 text-white shadow" : "text-zinc-400 hover:text-white"
              }`}
            >
              100% Episode Matrix ({episodes.length})
            </button>
            <button
              onClick={() => setActiveTab("missables")}
              className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                activeTab === "missables" ? "bg-emerald-600 text-white shadow" : "text-zinc-400 hover:text-white"
              }`}
            >
              Missable Items Guard ({pendingMissablesCount})
            </button>
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#0b0b0e]">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* 4 Pillars Breakdown Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Episodes Pillar */}
                <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-zinc-400 uppercase">YouTube Episodes</span>
                    <span className="text-xs font-black text-cyan-400">{publishedEpisodes} / {totalEpisodes}</span>
                  </div>
                  <div className="text-2xl font-black text-white">{epPercent}% Published</div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full transition-all duration-500" style={{ width: `${epPercent}%` }} />
                  </div>
                  <span className="text-[11px] text-zinc-400 block">
                    Recorded: {recordedEpisodes} | Not Started: {totalEpisodes - recordedEpisodes}
                  </span>
                </div>

                {/* Quests Pillar */}
                <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-zinc-400 uppercase">Quests & Milestones</span>
                    <span className="text-xs font-black text-amber-400">{completedQuests} / {totalQuests}</span>
                  </div>
                  <div className="text-2xl font-black text-white">{questPercent}% Cleared</div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full transition-all duration-500" style={{ width: `${questPercent}%` }} />
                  </div>
                  <span className="text-[11px] text-zinc-400 block">
                    Remaining Quests: {totalQuests - completedQuests}
                  </span>
                </div>

                {/* Boss Trophies Pillar */}
                <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-zinc-400 uppercase">Boss Encounters</span>
                    <span className="text-xs font-black text-red-400">{defeatedBosses} / {totalBosses}</span>
                  </div>
                  <div className="text-2xl font-black text-white">{bossPercent}% Defeated</div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-red-400 h-full transition-all duration-500" style={{ width: `${bossPercent}%` }} />
                  </div>
                  <span className="text-[11px] text-zinc-400 block">
                    Remaining Bosses: {totalBosses - defeatedBosses}
                  </span>
                </div>

                {/* Key Loot / Relics Pillar */}
                <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-zinc-400 uppercase">Key Loot & Espers</span>
                    <span className="text-xs font-black text-emerald-400">{collectedLoot} / {totalLoot}</span>
                  </div>
                  <div className="text-2xl font-black text-white">{lootPercent}% Collected</div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full transition-all duration-500" style={{ width: `${lootPercent}%` }} />
                  </div>
                  <span className="text-[11px] text-zinc-400 block">
                    Remaining Treasures: {totalLoot - collectedLoot}
                  </span>
                </div>
              </div>

              {/* Earned Creator Badges Showcase */}
              <div className="p-5 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
                <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Series Completion Achievements & Badges</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className={`p-3 rounded-xl border flex items-center gap-3 ${overallPercent >= 100 ? "bg-amber-500/10 border-amber-500/40 text-amber-300" : "bg-zinc-900/40 border-zinc-800 opacity-50"}`}>
                    <Award className="w-6 h-6 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-xs font-black block">100% Master</span>
                      <span className="text-[10px] text-zinc-400">Complete all content</span>
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border flex items-center gap-3 ${pendingMissablesCount === 0 ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300" : "bg-zinc-900/40 border-zinc-800 opacity-50"}`}>
                    <Shield className="w-6 h-6 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-xs font-black block">Zero Missed</span>
                      <span className="text-[10px] text-zinc-400">All missables secured</span>
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border flex items-center gap-3 ${bossPercent >= 100 ? "bg-red-500/10 border-red-500/40 text-red-300" : "bg-zinc-900/40 border-zinc-800 opacity-50"}`}>
                    <Swords className="w-6 h-6 text-red-400 shrink-0" />
                    <div>
                      <span className="text-xs font-black block">Boss Conqueror</span>
                      <span className="text-[10px] text-zinc-400">Defeat all boss encounters</span>
                    </div>
                  </div>

                  <div className={`p-3 rounded-xl border flex items-center gap-3 ${epPercent >= 100 ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300" : "bg-zinc-900/40 border-zinc-800 opacity-50"}`}>
                    <CheckCircle2 className="w-6 h-6 text-cyan-400 shrink-0" />
                    <div>
                      <span className="text-xs font-black block">Series Published</span>
                      <span className="text-[10px] text-zinc-400">Upload all video parts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "episodes_matrix" && (
            <div className="space-y-4">
              <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-300">
                  Showing 100% Walkthrough Matrix across all {episodes.length} Parts:
                </span>
                <span className="text-zinc-500">
                  Updated Live
                </span>
              </div>

              <div className="overflow-x-auto border border-zinc-800 rounded-2xl bg-zinc-900/60">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-zinc-950 text-zinc-400 font-extrabold uppercase border-b border-zinc-800 text-[10px]">
                    <tr>
                      <th className="p-3">Part #</th>
                      <th className="p-3">Episode Title</th>
                      <th className="p-3">World / Act</th>
                      <th className="p-3">Boss Encounters</th>
                      <th className="p-3">Key Treasures</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80">
                    {episodes.map((ep) => {
                      const epBosses = bosses.filter((b) => b.episodePart === ep.partNumber);
                      const epLoot = loot.filter((l) => l.episodePart === ep.partNumber);

                      return (
                        <tr key={ep.id} className="hover:bg-zinc-900/80 transition-colors">
                          <td className="p-3 font-black text-amber-400">Part #{ep.partNumber}</td>
                          <td className="p-3 font-bold text-white">{ep.title}</td>
                          <td className="p-3 text-zinc-400">{ep.world}</td>
                          <td className="p-3">
                            {epBosses.length > 0 ? (
                              <div className="space-y-1">
                                {epBosses.map((b) => (
                                  <span
                                    key={b.id}
                                    className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold mr-1 ${
                                      b.defeated ? "bg-emerald-950 text-emerald-300 border border-emerald-800" : "bg-red-950 text-red-300 border border-red-800"
                                    }`}
                                  >
                                    {b.name}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-zinc-600 text-[11px]">—</span>
                            )}
                          </td>
                          <td className="p-3">
                            {epLoot.length > 0 ? (
                              <div className="space-y-1">
                                {epLoot.map((l) => (
                                  <span
                                    key={l.id}
                                    className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold mr-1 ${
                                      l.collected ? "bg-cyan-950 text-cyan-300 border border-cyan-800" : "bg-zinc-800 text-zinc-400"
                                    }`}
                                  >
                                    {l.name}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-zinc-600 text-[11px]">—</span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              ep.status === "published"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : ep.status === "recorded"
                                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                : "bg-zinc-800 text-zinc-400"
                            }`}>
                              {ep.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "missables" && (
            <div className="space-y-4">
              <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
                  <div>
                    <h4 className="text-sm font-black text-red-200">Missable Items & Point of No Return Watch</h4>
                    <p className="text-xs text-zinc-400">
                      Ensure you collect these treasures and defeat these bosses before advancing past key story cutscenes!
                    </p>
                  </div>
                </div>

                <span className="px-3 py-1 bg-red-600 text-white font-black text-xs rounded-xl shadow shrink-0">
                  {pendingMissablesCount} Pending
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Missable Quests */}
                <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3">
                  <h5 className="text-xs font-black text-amber-400 uppercase tracking-wider">
                    Missable Quests ({missableQuests.length})
                  </h5>
                  <div className="space-y-2 text-xs">
                    {missableQuests.map((q) => (
                      <div key={q.id} className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800/80 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white block">{q.title}</span>
                          <span className="text-[10px] text-zinc-400">📍 {q.location} • Act: {q.actOrWorld}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          q.status === "completed" ? "bg-emerald-950 text-emerald-300" : "bg-amber-950 text-amber-300"
                        }`}>
                          {q.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missable Bosses */}
                <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3">
                  <h5 className="text-xs font-black text-red-400 uppercase tracking-wider">
                    Missable Boss Trophies ({missableBosses.length})
                  </h5>
                  <div className="space-y-2 text-xs">
                    {missableBosses.map((b) => (
                      <div key={b.id} className="p-2.5 bg-zinc-950 rounded-xl border border-zinc-800/80 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white block">{b.name} (Part #{b.episodePart})</span>
                          <span className="text-[10px] text-zinc-400">📍 {b.location} • Rare Loot: {b.dropLoot}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          b.defeated ? "bg-emerald-950 text-emerald-300" : "bg-red-950 text-red-300"
                        }`}>
                          {b.defeated ? "Defeated" : "Pending"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
