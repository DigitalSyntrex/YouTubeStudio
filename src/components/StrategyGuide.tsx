import React, { useState } from "react";
import {
  X,
  Youtube,
  ShieldAlert,
  Sparkles,
  Image as ImageIcon,
  BookOpen,
  CheckCircle,
  Zap,
  Copy,
  Check,
  Wand2,
  RefreshCw,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Tag,
  FileText,
  Sliders,
  Layers,
} from "lucide-react";
import { Episode, PlaythroughSeries } from "../types";
import {
  generateSeoPackageForEpisode,
  SeoStyleOption,
  SeoAutoFillResult,
} from "../utils/seoAutoFillGenerator";

interface StrategyGuideProps {
  onClose: () => void;
  activeSeries?: PlaythroughSeries;
  episodes?: Episode[];
  onBatchUpdateEpisodes?: (updatedEpisodes: Episode[]) => void;
  onUpdateEpisode?: (updated: Episode) => void;
  initialTab?: "autofill" | "guide";
}

export const StrategyGuide: React.FC<StrategyGuideProps> = ({
  onClose,
  activeSeries,
  episodes = [],
  onBatchUpdateEpisodes,
  onUpdateEpisode,
  initialTab = "autofill",
}) => {
  const [activeTab, setActiveTab] = useState<"autofill" | "guide">(
    episodes.length > 0 ? initialTab : "guide"
  );

  // SEO Auto-Fill State
  const [seoStyle, setSeoStyle] = useState<SeoStyleOption>("walkthrough");
  const [useAiApi, setUseAiApi] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<string>("");

  // Store generated results per episode ID
  const [generatedPackages, setGeneratedPackages] = useState<
    Record<number, SeoAutoFillResult>
  >(() => {
    // Initial generation for active episodes
    if (!episodes || episodes.length === 0) return {};
    const game = activeSeries?.gameTitle || "YouTube Gaming Series";
    const initialMap: Record<number, SeoAutoFillResult> = {};
    episodes.forEach((ep) => {
      initialMap[ep.id] = generateSeoPackageForEpisode(ep, game, "walkthrough");
    });
    return initialMap;
  });

  // Selected episode IDs to auto-fill (defaults to all)
  const [selectedEpIds, setSelectedEpIds] = useState<number[]>(() =>
    (episodes || []).map((ep) => ep.id)
  );

  // Selected title index per episode ID (allows switching between alternate hook titles)
  const [selectedTitleIndices, setSelectedTitleIndices] = useState<
    Record<number, number>
  >({});

  // Expanded card state
  const [expandedEpId, setExpandedEpId] = useState<number | null>(
    (episodes || []).length > 0 ? episodes[0].id : null
  );

  // Feedback notifications
  const [copiedEpId, setCopiedEpId] = useState<number | null>(null);
  const [appliedSuccess, setAppliedSuccess] = useState<boolean>(false);

  const gameTitle = activeSeries?.gameTitle || "Gaming Series";

  // Regenerate/Update Auto-Fill packages
  const handleGeneratePackages = async () => {
    setIsGenerating(true);
    setGenerationProgress("Reading game core plot beats...");

    const updatedMap: Record<number, SeoAutoFillResult> = {};

    if (useAiApi) {
      // AI-Powered generation via /api/gemini/enhance or smart fallback
      for (let i = 0; i < episodes.length; i++) {
        const ep = episodes[i];
        setGenerationProgress(
          `AI Enhancing Episode ${ep.partNumber}/${episodes.length}: ${ep.shortTitle || ep.title}...`
        );

        try {
          const res = await fetch("/api/gemini/enhance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              gameTitle,
              episodeTitle: ep.title,
              partNumber: ep.partNumber,
              world: ep.world,
              startPoint: ep.startPoint,
              endPoint: ep.endPoint,
              keyEvents: ep.keyEvents ? ep.keyEvents.join("\n") : "",
              style: seoStyle,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.viralTitles && data.enhancedDescription) {
              updatedMap[ep.id] = {
                episodeId: ep.id,
                suggestedTitle: data.viralTitles[0] || ep.title,
                alternativeTitles: data.viralTitles,
                suggestedTags: data.extraTags || [gameTitle, "Walkthrough", "Lets Play"],
                suggestedDescription: data.enhancedDescription,
                chapters: data.chapters || [
                  { timestamp: "00:00", title: `Intro - ${ep.startPoint || "Start"}` },
                  { timestamp: "15:00", title: `Exploring ${ep.world}` },
                  { timestamp: "35:00", title: `Reaching ${ep.endPoint}` },
                ],
              };
            } else {
              updatedMap[ep.id] = generateSeoPackageForEpisode(ep, gameTitle, seoStyle);
            }
          } else {
            updatedMap[ep.id] = generateSeoPackageForEpisode(ep, gameTitle, seoStyle);
          }
        } catch {
          updatedMap[ep.id] = generateSeoPackageForEpisode(ep, gameTitle, seoStyle);
        }
      }
    } else {
      // Instant Client-side Plot Beat Synthesis
      episodes.forEach((ep) => {
        updatedMap[ep.id] = generateSeoPackageForEpisode(ep, gameTitle, seoStyle);
      });
    }

    setGeneratedPackages(updatedMap);
    setIsGenerating(false);
    setGenerationProgress("");
  };

  // Toggle selection for an episode
  const toggleSelectEpisode = (epId: number) => {
    setSelectedEpIds((prev) =>
      prev.includes(epId) ? prev.filter((id) => id !== epId) : [...prev, epId]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedEpIds.length === (episodes || []).length) {
      setSelectedEpIds([]);
    } else {
      setSelectedEpIds((episodes || []).map((ep) => ep.id));
    }
  };

  // Apply Auto-Fill to selected episodes
  const handleApplyAutoFill = () => {
    if (!onBatchUpdateEpisodes || selectedEpIds.length === 0) return;

    const updatedEpisodes = (episodes || []).map((ep) => {
      if (!selectedEpIds.includes(ep.id)) return ep;

      const pkg = generatedPackages[ep.id];
      if (!pkg) return ep;

      const titleIdx = selectedTitleIndices[ep.id] || 0;
      const chosenTitle =
        pkg.alternativeTitles && pkg.alternativeTitles[titleIdx]
          ? pkg.alternativeTitles[titleIdx]
          : pkg.suggestedTitle;

      return {
        ...ep,
        title: chosenTitle,
        tags: pkg.suggestedTags,
        description: pkg.suggestedDescription,
        chapters: pkg.chapters,
        altTitles: pkg.alternativeTitles,
      };
    });

    onBatchUpdateEpisodes(updatedEpisodes);
    setAppliedSuccess(true);
    setTimeout(() => setAppliedSuccess(false), 3000);
  };

  // Copy episode description to clipboard
  const copyDescription = (epId: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEpId(epId);
    setTimeout(() => setCopiedEpId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#121212] border border-white/10 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#09090b] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-white">
                  YouTube SEO & Auto-Fill Studio
                </h2>
                <span className="text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {gameTitle}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Auto-generate high-CTR video titles, tags, and descriptions for all episodes based on core plot beats.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white bg-[#18181b] hover:bg-[#27272a] rounded-lg transition-colors border border-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-[#09090b] border-b border-white/10 px-4 pt-2 flex items-center justify-between gap-2 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("autofill")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "autofill"
                  ? "border-amber-400 text-amber-300 bg-amber-500/10 rounded-t-xl"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>⚡ Auto-Fill Episode Data ({episodes.length} Episodes)</span>
            </button>

            <button
              onClick={() => setActiveTab("guide")}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "guide"
                  ? "border-blue-400 text-blue-300 bg-blue-500/10 rounded-t-xl"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>📖 YouTube SEO & Strategy Rules</span>
            </button>
          </div>

          {appliedSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold animate-pulse">
              <Check className="w-3.5 h-3.5" />
              <span>Applied to {selectedEpIds.length} Episodes!</span>
            </div>
          )}
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 bg-[#0f1117]/60 flex-1">
          {activeTab === "autofill" ? (
            /* TAB 1: AUTO-FILL EPISODE DATA GENERATOR */
            <div className="space-y-5">
              {/* Controls Bar: SEO Style, Generator Engine, Auto-Fill Trigger */}
              <div className="bg-[#121212] p-4 rounded-xl border border-white/10 shadow-xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* SEO Style Switcher */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                      <Sliders className="w-3 h-3 text-amber-400" /> SEO Tone & Hook Style
                    </label>
                    <select
                      value={seoStyle}
                      onChange={(e) => setSeoStyle(e.target.value as SeoStyleOption)}
                      className="w-full bg-[#18181b] border border-white/15 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="walkthrough">🎯 100% Walkthrough & Completionist</option>
                      <option value="viral">🔥 High-CTR Viral Hooks & Excitement</option>
                      <option value="boss">⚔️ Boss Encounter & Combat Centric</option>
                      <option value="lore">📜 Lore, Story Beats & Quest Guides</option>
                    </select>
                  </div>

                  {/* Engine Model Toggle */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                      <Wand2 className="w-3 h-3 text-cyan-400" /> Generation Engine
                    </label>
                    <button
                      onClick={() => setUseAiApi(!useAiApi)}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-bold border transition-all flex items-center justify-between cursor-pointer ${
                        useAiApi
                          ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300"
                          : "bg-zinc-800/80 border-white/10 text-zinc-300"
                      }`}
                    >
                      <span>{useAiApi ? "🤖 Gemini AI Model Enhancement" : "⚡ Instant Plot Beat Synthesizer"}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-black/40">
                        {useAiApi ? "AI API" : "Instant"}
                      </span>
                    </button>
                  </div>

                  {/* Batch Trigger Button */}
                  <div className="space-y-1 flex flex-col justify-end">
                    <button
                      onClick={handleGeneratePackages}
                      disabled={isGenerating}
                      className="w-full py-2 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 fill-black" />
                          <span>Auto-Fill SEO Data For All Episodes</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {isGenerating && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-300 flex items-center gap-2 animate-pulse">
                    <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                    <span>{generationProgress || "Synthesizing episode titles, tags & chapter descriptions..."}</span>
                  </div>
                )}
              </div>

              {/* Episode Batch Selection Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#09090b] p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs font-bold text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedEpIds.length === episodes.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded bg-zinc-800 border-white/20 text-amber-500 focus:ring-amber-400 cursor-pointer"
                    />
                    <span>Select All Episodes ({selectedEpIds.length}/{episodes.length})</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400 hidden sm:inline">
                    Ready to update {selectedEpIds.length} episodes in {gameTitle}
                  </span>
                  <button
                    onClick={handleApplyAutoFill}
                    disabled={selectedEpIds.length === 0 || !onBatchUpdateEpisodes}
                    className="py-1.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-lg shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Apply Auto-Fill To Selected ({selectedEpIds.length})</span>
                  </button>
                </div>
              </div>

              {/* Episode Packages List */}
              <div className="space-y-3">
                {episodes.map((ep) => {
                  const isSelected = selectedEpIds.includes(ep.id);
                  const pkg = generatedPackages[ep.id] || generateSeoPackageForEpisode(ep, gameTitle, seoStyle);
                  const currentTitleIdx = selectedTitleIndices[ep.id] || 0;
                  const activeTitle = pkg.alternativeTitles?.[currentTitleIdx] || pkg.suggestedTitle;
                  const isExpanded = expandedEpId === ep.id;

                  return (
                    <div
                      key={ep.id}
                      className={`bg-[#121212] rounded-xl border transition-all duration-200 overflow-hidden ${
                        isSelected ? "border-amber-500/40 shadow-lg shadow-amber-950/20" : "border-white/10 opacity-75"
                      }`}
                    >
                      {/* Card Header Header */}
                      <div className="p-3.5 bg-[#09090b] border-b border-white/5 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectEpisode(ep.id)}
                            className="w-4 h-4 rounded bg-zinc-800 border-white/20 text-amber-500 focus:ring-amber-400 cursor-pointer shrink-0"
                          />
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-black text-xs rounded border border-amber-500/30">
                              Part {ep.partNumber}
                            </span>
                            <span className="text-[10px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded font-bold uppercase">
                              {ep.world}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-[300px]">
                            {ep.shortTitle || ep.title}
                          </h4>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setExpandedEpId(isExpanded ? null : ep.id)}
                            className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-bold px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 rounded border border-amber-500/30 transition-colors cursor-pointer"
                          >
                            <span>{isExpanded ? "Hide Details" : "Preview Auto-Fill"}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Card Plot Beat & Suggested Title Hook Bar */}
                      <div className="p-3.5 space-y-3 bg-[#0f1117]/80">
                        {/* Core Plot Beat Context */}
                        <div className="text-[11px] text-zinc-400 bg-[#09090b] p-2.5 rounded-lg border border-white/5 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="font-bold text-zinc-300">Plot Beats:</span>
                            <span className="text-amber-300">{ep.startPoint || "Start"}</span>
                            <ArrowRight className="w-3 h-3 text-zinc-500 shrink-0" />
                            <span className="text-cyan-300">{ep.endPoint || "End"}</span>
                          </div>
                          {ep.keyEvents && ep.keyEvents.length > 0 && (
                            <span className="text-[10px] text-zinc-500 italic truncate max-w-[250px]">
                              Beat: {ep.keyEvents[0]}
                            </span>
                          )}
                        </div>

                        {/* Suggested High-CTR Title Selector */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                            <span className="flex items-center gap-1 text-amber-400">
                              <Zap className="w-3 h-3" /> Suggested High-CTR Title
                            </span>
                            <span className="text-zinc-500">
                              Hook Option {currentTitleIdx + 1} of {pkg.alternativeTitles?.length || 1}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              readOnly
                              value={activeTitle}
                              className="flex-1 bg-[#09090b] border border-amber-500/40 text-amber-300 font-extrabold text-xs px-3 py-2 rounded-lg shadow-inner focus:outline-none"
                            />
                            {pkg.alternativeTitles && pkg.alternativeTitles.length > 1 && (
                              <button
                                onClick={() =>
                                  setSelectedTitleIndices((prev) => ({
                                    ...prev,
                                    [ep.id]: ((prev[ep.id] || 0) + 1) % pkg.alternativeTitles.length,
                                  }))
                                }
                                className="px-2.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold rounded-lg border border-amber-500/40 transition-colors cursor-pointer shrink-0"
                                title="Cycle through alternative title hooks"
                              >
                                Cycle Hook ➔
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Expanded Preview: Suggested Tags & Full Description */}
                        {isExpanded && (
                          <div className="pt-2 border-t border-white/10 space-y-3 animate-fadeIn">
                            {/* Suggested Tags */}
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                <Tag className="w-3 h-3 text-cyan-400" /> Auto-Filled SEO Tags ({pkg.suggestedTags?.length || 0})
                              </div>
                              <div className="flex flex-wrap gap-1.5 p-2 bg-[#09090b] rounded-lg border border-white/5">
                                {pkg.suggestedTags?.map((tag, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className="px-2 py-0.5 bg-cyan-950/60 text-cyan-300 text-[10px] font-bold rounded border border-cyan-500/30"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Suggested Description with Chapter Timestamps */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                <span className="flex items-center gap-1 text-purple-400">
                                  <FileText className="w-3 h-3" /> Auto-Filled Description & Timestamps
                                </span>
                                <button
                                  onClick={() => copyDescription(ep.id, pkg.suggestedDescription)}
                                  className="flex items-center gap-1 text-[10px] font-bold text-purple-300 hover:text-white bg-purple-500/20 hover:bg-purple-500/30 px-2 py-0.5 rounded border border-purple-500/40 transition-colors cursor-pointer"
                                >
                                  {copiedEpId === ep.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedEpId === ep.id ? "Copied!" : "Copy Description"}</span>
                                </button>
                              </div>

                              <pre className="p-3 bg-[#09090b] text-[11px] text-zinc-300 font-mono rounded-lg border border-white/5 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                                {pkg.suggestedDescription}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* TAB 2: ORIGINAL YOUTUBE SEO & STRATEGY RULES GUIDE */
            <div className="space-y-6 text-xs text-slate-300 leading-relaxed">
              {/* Section 1: Title Optimization */}
              <div className="bg-[#121212] p-5 rounded-xl border border-white/10 space-y-3">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <Youtube className="w-4 h-4" /> 1. High-CTR Title Anatomy for {gameTitle}
                </h3>
                <p>
                  To maximize Click-Through-Rate (CTR) on YouTube search and recommended feeds, structure your video titles using the **3-Part Hook Method**:
                </p>
                <div className="bg-[#09090b] p-3 rounded-lg border border-white/10 font-mono text-slate-200">
                  <span className="text-amber-400">[HOOK IN ALL CAPS]</span> - <span className="text-purple-300">[{gameTitle} + Episode #]</span> (<span className="text-cyan-300">[Milestone / Boss]</span>)
                </div>
                <p className="text-slate-400">
                  *Example:* <span className="text-slate-200 font-medium">SUPLEXING A PHANTOM TRAIN! - {gameTitle} #04 (Ghost Train & Sabin)</span>
                </p>
                <ul className="space-y-1 text-slate-400 pl-4 list-disc">
                  <li>Place the most exciting plot beat or boss name in ALL CAPS at the beginning of the title.</li>
                  <li>Always include "{gameTitle}" for search indexing.</li>
                  <li>Include episode numbers so viewers can easily navigate your playlist!</li>
                </ul>
              </div>

              {/* Section 2: Chapter Timestamps */}
              <div className="bg-[#121212] p-5 rounded-xl border border-white/10 space-y-3">
                <h3 className="text-sm font-bold text-blue-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> 2. Chapter Timestamps & Google Search indexing
                </h3>
                <p>
                  Google indexes YouTube video chapters directly into Google Search results for queries like *"{gameTitle} boss fight"* or *"how to beat milestone"*.
                </p>
                <ul className="space-y-1.5 text-slate-300 pl-4 list-disc">
                  <li>Always start chapter timestamps with <code className="text-amber-300 bg-[#09090b] px-1 py-0.5 rounded">00:00</code>.</li>
                  <li>Include key boss names, esper acquisitions, and location transitions in chapter titles.</li>
                  <li>Provide at least 3-5 chapter breakdowns per 90-120 minute video.</li>
                </ul>
              </div>

              {/* Section 3: Thumbnail Design Rules */}
              <div className="bg-[#121212] p-5 rounded-xl border border-white/10 space-y-3">
                <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" /> 3. 16:9 Thumbnail Design Best Practices
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300">
                  <div className="bg-[#09090b] p-3 rounded-lg border border-white/5">
                    <span className="font-bold text-amber-300 block mb-1">✅ DO:</span>
                    <p>• Use 1-3 words of bold, high-contrast text on the left side.</p>
                    <p>• Feature character faces or boss sprites on the right side.</p>
                    <p>• Use bright yellow, cyan, or neon purple outlines.</p>
                  </div>
                  <div className="bg-[#09090b] p-3 rounded-lg border border-white/5">
                    <span className="font-bold text-red-400 block mb-1">❌ DON'T:</span>
                    <p>• Do not clutter the bottom-right corner (YouTube time badge covers it!).</p>
                    <p>• Do not write full sentences in the thumbnail.</p>
                    <p>• Avoid dark unreadable font colors on dark backgrounds.</p>
                  </div>
                </div>
              </div>

              {/* Section 4: Copyright & Audio Guidelines */}
              <div className="bg-[#121212] p-5 rounded-xl border border-white/10 space-y-3">
                <h3 className="text-sm font-bold text-red-400 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> 4. Audio & Monetization Guidelines
                </h3>
                <p className="text-slate-300">
                  Follow official publisher policies for gameplay streaming and videos:
                </p>
                <ul className="space-y-1.5 text-slate-300 pl-4 list-disc">
                  <li>**Music tracks:** Keep in-game music enabled with gameplay commentary or visual interaction.</li>
                  <li>**Monetization:** Ad revenue through the YouTube Partner Program is permitted.</li>
                  <li>**Copyright Notices:** Standard publisher copyright text in description is recommended: <br />
                    <code className="text-amber-300/80 bg-[#09090b] px-2 py-1 rounded block mt-1 font-mono text-[11px]">
                      © Game Developer / Publisher All Rights Reserved.
                    </code>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#09090b] border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-zinc-400">
            {episodes.length} episodes loaded in {gameTitle}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#18181b] hover:bg-[#27272a] text-zinc-300 font-bold text-xs rounded-lg transition-colors border border-white/10 cursor-pointer"
            >
              Close
            </button>
            {activeTab === "autofill" && (
              <button
                onClick={handleApplyAutoFill}
                disabled={selectedEpIds.length === 0 || !onBatchUpdateEpisodes}
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                Apply Auto-Fill to Selected ({selectedEpIds.length})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
