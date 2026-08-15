import React, { useState, useRef } from "react";
import { X, Download, Check, Layers, Palette, Image as ImageIcon, Sparkles, CheckSquare, Square, Copy, RefreshCw, Wand2, Shield, LayoutGrid, Type } from "lucide-react";
import { Episode, PlaythroughSeries } from "../types";

import narsheMagitek from "../assets/images/ff6_narshe_magitek_1786140670252.jpg";
import operaHouse from "../assets/images/ff6_opera_house_1786140680308.jpg";

interface BrandingPreset {
  id: string;
  name: string;
  accentColor: string;
  badgeStyle: "pill" | "banner" | "box";
  frameStyle: "snes" | "neon" | "clean" | "none";
  qualityTag: string;
  watermark: string;
}

const defaultPresets: BrandingPreset[] = [
  {
    id: "snes_gold",
    name: "Golden Retro RPG",
    accentColor: "#fbbf24",
    badgeStyle: "pill",
    frameStyle: "snes",
    qualityTag: "1080P 60FPS",
    watermark: "LET'S PLAY SERIES",
  },
  {
    id: "neon_cyber",
    name: "Neon Cyberpunk",
    accentColor: "#38bdf8",
    badgeStyle: "banner",
    frameStyle: "neon",
    qualityTag: "100% WALKTHROUGH",
    watermark: "PRO GAMING HD",
  },
  {
    id: "red_boss",
    name: "Crimson Boss Fight",
    accentColor: "#ef4444",
    badgeStyle: "box",
    frameStyle: "snes",
    qualityTag: "NO DAMAGE",
    watermark: "HARDCORE MODE",
  },
  {
    id: "emerald_quest",
    name: "Emerald Quest",
    accentColor: "#10b981",
    badgeStyle: "pill",
    frameStyle: "clean",
    qualityTag: "FULL GAME",
    watermark: "PLAYTHROUGH",
  },
  {
    id: "royal_violet",
    name: "Royal Violet",
    accentColor: "#a855f7",
    badgeStyle: "banner",
    frameStyle: "snes",
    qualityTag: "4K 60FPS",
    watermark: "MASTER SERIES",
  },
];

interface BatchThumbnailExporterModalProps {
  episodes: Episode[];
  activeSeries?: PlaythroughSeries;
  onClose: () => void;
  onApplyBrandingToAll?: (updatedEpisodes: Episode[]) => void;
}

export const BatchThumbnailExporterModal: React.FC<BatchThumbnailExporterModalProps> = ({
  episodes,
  activeSeries,
  onClose,
  onApplyBrandingToAll,
}) => {
  const currentGameTitle = activeSeries?.gameTitle || "YouTube Gaming Series";
  const rawBadge = activeSeries?.badgeText;
  const defaultWatermark =
    rawBadge &&
    currentGameTitle &&
    rawBadge.length === 1 &&
    currentGameTitle.length > 1 &&
    rawBadge.toUpperCase() === currentGameTitle.charAt(0).toUpperCase()
      ? currentGameTitle.toUpperCase()
      : rawBadge || currentGameTitle.toUpperCase();

  // Selected episode IDs for batch exporting
  const [selectedEpIds, setSelectedEpIds] = useState<number[]>(() =>
    (episodes || []).map((e) => e.id)
  );

  // Active Branding Preset & Custom Adjustments
  const [activePreset, setActivePreset] = useState<BrandingPreset>({
    id: "custom",
    name: "Custom Channel Branding",
    accentColor: activeSeries?.accentColor || "#38bdf8",
    badgeStyle: "pill",
    frameStyle: "snes",
    qualityTag: "1080P 60FPS",
    watermark: defaultWatermark,
  });

  const [watermarkInput, setWatermarkInput] = useState(defaultWatermark);
  const [qualityTagInput, setQualityTagInput] = useState("1080P 60FPS");
  const [accentColorInput, setAccentColorInput] = useState(activeSeries?.accentColor || "#38bdf8");
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<{ current: number; total: number } | null>(null);
  const [copiedPrompts, setCopiedPrompts] = useState(false);
  const [appliedAll, setAppliedAll] = useState(false);

  // Selection toggle handlers
  const handleToggleSelectAll = () => {
    if (selectedEpIds.length === (episodes || []).length) {
      setSelectedEpIds([]);
    } else {
      setSelectedEpIds((episodes || []).map((e) => e.id));
    }
  };

  const handleToggleEpisode = (id: number) => {
    setSelectedEpIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectPreset = (preset: BrandingPreset) => {
    setActivePreset(preset);
    setWatermarkInput(preset.watermark);
    setQualityTagInput(preset.qualityTag);
    setAccentColorInput(preset.accentColor);
  };

  // SVG to PNG render helper for batch export
  const renderEpisodeSvgToPngBlob = (
    episode: Episode,
    accent: string,
    watermarkText: string,
    qualityText: string
  ): Promise<string> => {
    return new Promise((resolve) => {
      const bgImg = episode.thumbnailConfig?.customImage ||
        (episode.title.toLowerCase().includes("opera") ? operaHouse : narsheMagitek);

      const titleText = (episode.thumbnailText || episode.shortTitle || episode.title).toUpperCase();
      const epNumberStr = episode.partNumber < 10 ? `0${episode.partNumber}` : `${episode.partNumber}`;

      const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
          <defs>
            <linearGradient id="vignette" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stop-color="#09090b" stop-opacity="0.95" />
              <stop offset="45%" stop-color="#09090b" stop-opacity="0.65" />
              <stop offset="100%" stop-color="#09090b" stop-opacity="0.2" />
            </linearGradient>
            <filter id="dropShadow">
              <feDropShadow dx="3" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.9" />
            </filter>
          </defs>
          <image href="${bgImg}" x="0" y="0" width="1280" height="720" preserveAspectRatio="xMidYMid slice" />
          <rect width="1280" height="720" fill="url(#vignette)" />
          <rect x="20" y="20" width="1240" height="680" fill="none" stroke="${accent}" stroke-width="4" rx="12" opacity="0.8" />
          <rect x="30" y="30" width="1220" height="660" fill="none" stroke="#ffffff" stroke-width="1.5" rx="8" opacity="0.25" />
          <g transform="translate(60, 55)">
            <rect x="0" y="0" width="300" height="44" rx="8" fill="#09090b" opacity="0.9" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
            <text x="150" y="27" fill="#f8fafc" font-size="15" font-weight="900" font-family="system-ui, sans-serif" letter-spacing="1.5" text-anchor="middle">${watermarkText}</text>
          </g>
          <g transform="translate(1040, 55)">
            <rect x="0" y="0" width="180" height="52" rx="10" fill="${accent}" filter="url(#dropShadow)" />
            <text x="90" y="34" fill="#09090b" font-size="24" font-weight="900" font-family="system-ui, sans-serif" letter-spacing="1" text-anchor="middle">EP ${epNumberStr}</text>
          </g>
          <g transform="translate(60, 540)">
            <text x="0" y="0" fill="#ffffff" font-size="58" font-weight="900" font-family="system-ui, sans-serif" filter="url(#dropShadow)">${titleText.slice(0, 32)}</text>
            <text x="0" y="52" fill="${accent}" font-size="26" font-weight="800" font-family="system-ui, sans-serif" filter="url(#dropShadow)">${episode.world.toUpperCase()} • 1080P WALKTHROUGH</text>
          </g>
          <g transform="translate(1080, 620)">
            <rect x="0" y="0" width="140" height="40" rx="8" fill="#000000" opacity="0.85" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
            <text x="70" y="26" fill="#f8fafc" font-size="14" font-weight="800" font-family="system-ui, sans-serif" text-anchor="middle">${qualityText}</text>
          </g>
        </svg>
      `;

      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 1280;
        canvas.height = 720;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, 1280, 720);
          const pngUrl = canvas.toDataURL("image/png");
          URL.revokeObjectURL(url);
          resolve(pngUrl);
        } else {
          resolve(url);
        }
      };
      img.src = url;
    });
  };

  // Run sequential batch export download
  const handleBatchDownloadPngs = async () => {
    const selectedEpisodes = episodes.filter((e) => selectedEpIds.includes(e.id));
    if (selectedEpisodes.length === 0) return;

    setExporting(true);
    setExportProgress({ current: 0, total: selectedEpisodes.length });

    for (let i = 0; i < selectedEpisodes.length; i++) {
      const ep = selectedEpisodes[i];
      setExportProgress({ current: i + 1, total: selectedEpisodes.length });

      const pngData = await renderEpisodeSvgToPngBlob(
        ep,
        accentColorInput,
        watermarkInput,
        qualityTagInput
      );

      const link = document.createElement("a");
      link.href = pngData;
      link.download = `${currentGameTitle.replace(/[^a-zA-Z0-9]/g, "_")}_EP${ep.partNumber < 10 ? `0${ep.partNumber}` : ep.partNumber}_1280x720.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Short delay between triggers to prevent browser download block
      await new Promise((r) => setTimeout(r, 400));
    }

    setExporting(false);
    setExportProgress(null);
  };

  // Copy all AI prompts in bulk
  const handleCopyAllPrompts = () => {
    const selectedEpisodes = episodes.filter((e) => selectedEpIds.includes(e.id));
    const formatted = selectedEpisodes
      .map(
        (ep) =>
          `### EPISODE ${ep.partNumber}: ${ep.title}\nPrompt: ${ep.suggestedThumbnailPrompt || `Gaming artwork for ${currentGameTitle}: ${ep.title}. High CTR thumbnail artwork featuring ${ep.startPoint}, area: ${ep.world}.`}`
      )
      .join("\n\n");

    navigator.clipboard.writeText(formatted);
    setCopiedPrompts(true);
    setTimeout(() => setCopiedPrompts(false), 2000);
  };

  // Apply active preset branding parameters to all episodes
  const handleApplyBrandingToAllSeries = () => {
    if (onApplyBrandingToAll) {
      const updated = episodes.map((ep) => ({
        ...ep,
        thumbnailConfig: {
          ...ep.thumbnailConfig,
          themeColor: accentColorInput,
          subText: `${ep.world.toUpperCase()} • ${qualityTagInput}`,
        },
      }));
      onApplyBrandingToAll(updated);
      setAppliedAll(true);
      setTimeout(() => setAppliedAll(false), 2000);
    }
  };

  const selectedCount = selectedEpIds.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#121212] border border-white/10 w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-[#09090b] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">Batch Thumbnail Exporter & Channel Branding</h2>
              <p className="text-xs text-zinc-400">Apply uniform high-CTR channel branding presets & batch export 1280x720 PNGs for all episodes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white bg-[#18181b] hover:bg-[#27272a] rounded-lg transition-colors border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top Presets & Controls Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Presets List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-blue-400" />
                  Channel Branding Presets
                </h3>
              </div>

              <div className="space-y-2">
                {defaultPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      activePreset.id === preset.id
                        ? "bg-[#18181b] border-blue-400 ring-2 ring-blue-500/20"
                        : "bg-[#09090b] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                        style={{ backgroundColor: preset.accentColor }}
                      />
                      <div>
                        <h4 className="text-xs font-bold text-zinc-100">{preset.name}</h4>
                        <p className="text-[10px] text-zinc-400 font-mono">
                          {preset.watermark} • {preset.qualityTag}
                        </p>
                      </div>
                    </div>
                    {activePreset.id === preset.id && (
                      <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Brand Parameters */}
            <div className="lg:col-span-2 bg-[#09090b] p-4 rounded-xl border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/10 pb-2">
                <Type className="w-4 h-4 text-amber-400" />
                Customize Branding Elements
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Channel Watermark Badge
                  </label>
                  <input
                    type="text"
                    value={watermarkInput}
                    onChange={(e) => {
                      setWatermarkInput(e.target.value);
                      setActivePreset((p) => ({ ...p, watermark: e.target.value }));
                    }}
                    placeholder="e.g. LET'S PLAY SERIES"
                    className="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Quality Tag (Bottom Right)
                  </label>
                  <input
                    type="text"
                    value={qualityTagInput}
                    onChange={(e) => {
                      setQualityTagInput(e.target.value);
                      setActivePreset((p) => ({ ...p, qualityTag: e.target.value }));
                    }}
                    placeholder="e.g. 1080P 60FPS"
                    className="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Accent Brand Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColorInput}
                      onChange={(e) => setAccentColorInput(e.target.value)}
                      className="w-8 h-8 rounded bg-transparent border border-white/20 cursor-pointer"
                    />
                    <div className="flex gap-1.5">
                      {["#fbbf24", "#38bdf8", "#ef4444", "#10b981", "#a855f7", "#ec4899"].map((c) => (
                        <button
                          key={c}
                          onClick={() => setAccentColorInput(c)}
                          style={{ backgroundColor: c }}
                          className={`w-6 h-6 rounded-full border border-white/20 transition-transform ${
                            accentColorInput === c ? "scale-110 ring-2 ring-blue-400" : "opacity-80"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-end justify-end">
                  <button
                    onClick={handleApplyBrandingToAllSeries}
                    className="w-full sm:w-auto px-4 py-2 bg-[#18181b] hover:bg-[#27272a] text-blue-300 border border-blue-500/30 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Check className={`w-4 h-4 ${appliedAll ? "text-emerald-400" : "text-blue-400"}`} />
                    <span>{appliedAll ? "Branding Saved to All!" : "Apply Branding to All Episodes"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Episode Batch Selection Bar */}
          <div className="bg-[#09090b] p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleSelectAll}
                className="flex items-center gap-2 text-xs font-bold text-zinc-200 hover:text-white"
              >
                {selectedEpIds.length === episodes.length ? (
                  <CheckSquare className="w-4 h-4 text-blue-400" />
                ) : (
                  <Square className="w-4 h-4 text-zinc-500" />
                )}
                <span>Select All ({episodes.length} Episodes)</span>
              </button>

              <span className="text-xs text-zinc-500">|</span>

              <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20">
                {selectedCount} Selected
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyAllPrompts}
                disabled={selectedCount === 0}
                className="px-3.5 py-2 bg-[#18181b] hover:bg-[#27272a] text-zinc-300 border border-white/10 rounded-lg text-xs font-bold disabled:opacity-50 transition-colors flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>{copiedPrompts ? "Prompts Copied!" : "Copy AI Prompts"}</span>
              </button>

              <button
                onClick={handleBatchDownloadPngs}
                disabled={selectedCount === 0 || exporting}
                className="px-5 py-2 bg-blue-500 hover:bg-blue-400 text-zinc-950 font-bold text-xs rounded-lg disabled:opacity-50 transition-all shadow-md shadow-blue-500/20 flex items-center gap-2"
              >
                {exporting ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>
                  {exporting
                    ? `Downloading (${exportProgress?.current}/${exportProgress?.total})...`
                    : `Batch Export ${selectedCount} PNGs`}
                </span>
              </button>
            </div>
          </div>

          {/* Batch Live Preview Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <LayoutGrid className="w-4 h-4 text-blue-400" />
                Batch Thumbnail Preview ({episodes.length} Episodes)
              </span>
              <span className="text-[11px] text-zinc-500 font-normal">
                Click any card checkbox to toggle export inclusion
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {episodes.map((ep) => {
                const isSelected = selectedEpIds.includes(ep.id);
                const bgImg = ep.thumbnailConfig?.customImage ||
                  (ep.title.toLowerCase().includes("opera") ? operaHouse : narsheMagitek);

                return (
                  <div
                    key={ep.id}
                    onClick={() => handleToggleEpisode(ep.id)}
                    className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all group bg-black shadow-lg ${
                      isSelected
                        ? "border-blue-400 ring-2 ring-blue-500/20 opacity-100"
                        : "border-white/10 opacity-40 hover:opacity-70"
                    }`}
                  >
                    {/* 16:9 Thumbnail Visual */}
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={bgImg}
                        alt={ep.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 p-3 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span
                            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow"
                            style={{ backgroundColor: accentColorInput, color: "#09090b" }}
                          >
                            EP {ep.partNumber < 10 ? `0${ep.partNumber}` : ep.partNumber}
                          </span>
                          <span className="text-[9px] font-bold bg-black/80 text-zinc-200 px-1.5 py-0.5 rounded border border-white/10">
                            {watermarkInput.slice(0, 16)}
                          </span>
                        </div>

                        <div>
                          <h4
                            className="text-xs font-black uppercase text-white line-clamp-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                          >
                            {(ep.thumbnailText || ep.shortTitle || ep.title)}
                          </h4>
                          <p
                            className="text-[9px] font-bold mt-0.5"
                            style={{ color: accentColorInput }}
                          >
                            {ep.world.toUpperCase()}
                          </p>
                        </div>
                      </div>

                      {/* Checkbox badge */}
                      <div className="absolute top-2 left-2 z-10">
                        {isSelected ? (
                          <div className="w-5 h-5 rounded bg-blue-500 text-zinc-950 flex items-center justify-center font-bold">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded border border-white/40 bg-black/60" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
