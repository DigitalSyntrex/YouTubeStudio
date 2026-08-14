import React, { useState } from "react";
import { X, Sparkles, TrendingUp, BarChart2, CheckCircle2, AlertCircle, Copy, Check, Zap, Eye, Trophy } from "lucide-react";
import { Episode } from "../types";

interface CtrPredictorModalProps {
  isOpen: boolean;
  onClose: () => void;
  episodes: Episode[];
  selectedEpisode?: Episode | null;
}

export const CtrPredictorModal: React.FC<CtrPredictorModalProps> = ({
  isOpen,
  onClose,
  episodes,
  selectedEpisode,
}) => {
  if (!isOpen) return null;

  const initialEp = selectedEpisode || episodes[0] || null;

  const [titleA, setTitleA] = useState(initialEp ? initialEp.title : "Final Fantasy XVI #01 - ROSARIA'S TRAGEDY & PHOENIX AWAKENING!");
  const [thumbTextA, setThumbTextA] = useState(initialEp ? initialEp.thumbnailConfig.overlayText || "NIGHT OF FIRE!" : "NIGHT OF FIRE!");

  const [titleB, setTitleB] = useState(initialEp && initialEp.altTitles?.[0] ? initialEp.altTitles[0] : "IFRIT vs PHOENIX EIKON AWAKENING! - Final Fantasy XVI Playthrough Ep 1");
  const [thumbTextB, setThumbTextB] = useState("IFRIT vs PHOENIX!");

  const [subscribers, setSubscribers] = useState<number>(10000);
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null);

  const calculateCtrMetrics = (title: string, thumbText: string) => {
    let score = 50;
    const tips: string[] = [];
    const highlights: string[] = [];

    // Length check
    const len = title.length;
    if (len >= 45 && len <= 75) {
      score += 15;
      highlights.push("Optimal title length (45-75 chars)");
    } else if (len > 80) {
      score -= 10;
      tips.push("Title is over 80 chars and may get truncated on mobile screens.");
    } else if (len < 25) {
      score -= 10;
      tips.push("Title is short; consider adding key entity or episode branding.");
    }

    // High emotion / trigger words
    const powerWords = [
      "TRAGEDY", "AWAKENING", "SECRET", "BOSS", "100%", "GUIDE", "FINAL", "IFRIT",
      "PHOENIX", "SHIVA", "TITAN", "BAHAMUT", "ODIN", "LEVIATHAN", "SOLO", "EXPOSED",
      "GOD", "EPISODE", "FINALE", "EPIC", "INSANE", "UNLOCKED", "REVEALED"
    ];
    const upperTitle = title.toUpperCase();
    const matchedWords = powerWords.filter((w) => upperTitle.includes(w));
    if (matchedWords.length >= 2) {
      score += 15;
      highlights.push(`Strong emotional hooks found: ${matchedWords.slice(0, 3).join(", ")}`);
    } else if (matchedWords.length === 1) {
      score += 8;
      highlights.push(`Includes power keyword: ${matchedWords[0]}`);
    } else {
      tips.push("Add high-intent keywords like '100%', 'Boss', 'Guide', or Eikon names to boost CTR.");
    }

    // Numbering / Part branding
    if (/#\d+|EPISODE \d+|EP \d+|PART \d+|#\d+/i.test(title)) {
      score += 10;
      highlights.push("Clear episode/part numbering detected.");
    } else {
      tips.push("Include episode number (e.g. #01 or Ep 1) so viewers identify series sequence.");
    }

    // Brackets check e.g. [100% Walkthrough]
    if (/\[.*?\]|\(.*?\)/.test(title)) {
      score += 8;
      highlights.push("Uses high-visibility brackets e.g. [100% Walkthrough].");
    } else {
      tips.push("Consider adding a bracket tag like [100% Walkthrough] or [4K60] at the start or end.");
    }

    // Thumbnail text check
    const wordCount = thumbText.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount >= 1 && wordCount <= 4) {
      score += 10;
      highlights.push("Thumbnail text is punchy & scannable (1-4 words).");
    } else if (wordCount > 5) {
      score -= 8;
      tips.push("Thumbnail text is too verbose (>5 words); mobile viewers won't read it fast.");
    }

    // Cap score 0 - 100
    score = Math.min(98, Math.max(25, score));

    // Est views initial 48h
    const minEstViews = Math.round(subscribers * (score / 100) * 0.15);
    const maxEstViews = Math.round(subscribers * (score / 100) * 0.45);

    let tier = "Moderate Potential";
    let color = "#eab308";
    if (score >= 85) {
      tier = "Viral Tier (High CTR)";
      color = "#22c55e";
    } else if (score >= 70) {
      tier = "Above Average";
      color = "#3b82f6";
    } else if (score < 50) {
      tier = "Needs Optimization";
      color = "#ef4444";
    }

    return { score, tier, color, tips, highlights, minEstViews, maxEstViews };
  };

  const metricsA = calculateCtrMetrics(titleA, thumbTextA);
  const metricsB = calculateCtrMetrics(titleB, thumbTextB);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTitle(label);
    setTimeout(() => setCopiedTitle(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#121215] border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-[#18181c]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-red-500/20 to-amber-500/20 border border-red-500/30 rounded-xl text-red-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                YouTube CTR Predictor & A/B Title Tester
                <span className="text-xs bg-red-500/20 text-red-400 px-2.5 py-0.5 rounded-full border border-red-500/30 font-medium">
                  AI SEO Engine
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Simulate audience click-through rate, headline emotional impact, and 48-hour view projections.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-zinc-200">
          {/* Channel Size Context Input */}
          <div className="bg-[#1a1a1f] p-4 rounded-xl border border-zinc-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BarChart2 className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-sm font-semibold text-white">Target Channel Audience Scale</div>
                <div className="text-xs text-zinc-400">Adjust active subscribers to calibrate initial 48-hr view velocity</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">Subscribers:</span>
              <input
                type="number"
                value={subscribers}
                onChange={(e) => setSubscribers(Math.max(100, parseInt(e.target.value) || 1000))}
                className="bg-black/50 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm font-mono text-amber-400 w-32 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Side-by-Side A/B Tester */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Version A */}
            <div className="bg-[#18181c] border border-zinc-800 rounded-xl p-5 space-y-4 relative">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="text-sm font-bold text-red-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  VERSION A (Current Title)
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                  {metricsA.score}/100 Score
                </span>
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Video Title:</label>
                <textarea
                  value={titleA}
                  onChange={(e) => setTitleA(e.target.value)}
                  rows={2}
                  className="w-full bg-black/40 border border-zinc-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-red-500 font-sans"
                />
                <div className="flex justify-between text-[11px] text-zinc-500 mt-1">
                  <span>{titleA.length} characters</span>
                  <span>Target: 50 - 75 chars</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Thumbnail Overlay Text:</label>
                <input
                  type="text"
                  value={thumbTextA}
                  onChange={(e) => setThumbTextA(e.target.value)}
                  className="w-full bg-black/40 border border-zinc-700 rounded-lg p-2 text-xs font-bold text-amber-400 focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Metrics Display A */}
              <div className="bg-black/40 p-4 rounded-xl border border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Predicted CTR Tier:</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ color: metricsA.color, backgroundColor: `${metricsA.color}15` }}>
                    {metricsA.tier}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Estimated 48h Views:</span>
                    <span className="font-mono font-bold text-zinc-200">
                      {metricsA.minEstViews.toLocaleString()} - {metricsA.maxEstViews.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-500 rounded-full"
                      style={{ width: `${metricsA.score}%`, backgroundColor: metricsA.color }}
                    />
                  </div>
                </div>

                {/* Highlights */}
                {metricsA.highlights.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Strengths:
                    </div>
                    {metricsA.highlights.map((h, i) => (
                      <div key={i} className="text-[11px] text-zinc-300 pl-4">
                        • {h}
                      </div>
                    ))}
                  </div>
                )}

                {/* Tips */}
                {metricsA.tips.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> SEO Suggestions:
                    </div>
                    {metricsA.tips.map((t, i) => (
                      <div key={i} className="text-[11px] text-zinc-400 pl-4">
                        • {t}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleCopy(titleA, "A")}
                className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold rounded-lg text-zinc-200 flex items-center justify-center gap-2 transition"
              >
                {copiedTitle === "A" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedTitle === "A" ? "Copied Title A!" : "Copy Title A"}
              </button>
            </div>

            {/* Version B */}
            <div className="bg-[#18181c] border border-zinc-800 rounded-xl p-5 space-y-4 relative">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  VERSION B (Alternative Title)
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {metricsB.score}/100 Score
                </span>
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Video Title:</label>
                <textarea
                  value={titleB}
                  onChange={(e) => setTitleB(e.target.value)}
                  rows={2}
                  className="w-full bg-black/40 border border-zinc-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-sans"
                />
                <div className="flex justify-between text-[11px] text-zinc-500 mt-1">
                  <span>{titleB.length} characters</span>
                  <span>Target: 50 - 75 chars</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Thumbnail Overlay Text:</label>
                <input
                  type="text"
                  value={thumbTextB}
                  onChange={(e) => setThumbTextB(e.target.value)}
                  className="w-full bg-black/40 border border-zinc-700 rounded-lg p-2 text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Metrics Display B */}
              <div className="bg-black/40 p-4 rounded-xl border border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Predicted CTR Tier:</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ color: metricsB.color, backgroundColor: `${metricsB.color}15` }}>
                    {metricsB.tier}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Estimated 48h Views:</span>
                    <span className="font-mono font-bold text-zinc-200">
                      {metricsB.minEstViews.toLocaleString()} - {metricsB.maxEstViews.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-500 rounded-full"
                      style={{ width: `${metricsB.score}%`, backgroundColor: metricsB.color }}
                    />
                  </div>
                </div>

                {/* Highlights */}
                {metricsB.highlights.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Strengths:
                    </div>
                    {metricsB.highlights.map((h, i) => (
                      <div key={i} className="text-[11px] text-zinc-300 pl-4">
                        • {h}
                      </div>
                    ))}
                  </div>
                )}

                {/* Tips */}
                {metricsB.tips.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> SEO Suggestions:
                    </div>
                    {metricsB.tips.map((t, i) => (
                      <div key={i} className="text-[11px] text-zinc-400 pl-4">
                        • {t}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleCopy(titleB, "B")}
                className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold rounded-lg text-zinc-200 flex items-center justify-center gap-2 transition"
              >
                {copiedTitle === "B" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedTitle === "B" ? "Copied Title B!" : "Copy Title B"}
              </button>
            </div>
          </div>

          {/* Winner Banner */}
          <div className="bg-gradient-to-r from-red-500/10 via-amber-500/10 to-emerald-500/10 border border-zinc-700/60 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <span className="text-sm font-bold text-white">
                  A/B CTR Recommendation:{" "}
                  {metricsA.score > metricsB.score
                    ? "Version A yields higher CTR projection"
                    : metricsB.score > metricsA.score
                    ? "Version B yields higher CTR projection"
                    : "Both titles show balanced CTR performance"}
                </span>
                <p className="text-xs text-zinc-400 mt-0.5">
                  High-CTR titles combine high emotional contrast, concise thumbnail text, and specific entity keywords.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
