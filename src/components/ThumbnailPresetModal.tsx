import React, { useState } from "react";
import { X, Sparkles, Check, Image, Layers, Palette, ShieldAlert } from "lucide-react";
import { Episode } from "../types";

interface ThumbnailPresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEpisode?: Episode | null;
  onApplyPreset: (episodeId: number, config: any) => void;
}

export const ThumbnailPresetModal: React.FC<ThumbnailPresetModalProps> = ({
  isOpen,
  onClose,
  selectedEpisode,
  onApplyPreset,
}) => {
  if (!isOpen || !selectedEpisode) return null;

  const [activeBadge, setActiveBadge] = useState<string>("100% GUIDE");
  const [activeTheme, setActiveTheme] = useState<string>("#ef4444");

  const presets = [
    {
      id: "immersive_cinematic",
      title: "Immersive Cinematic Story",
      subText: "GOLD RPG FILIGREE & VIGNETTE",
      color: "#eab308",
      bgPreset: "gradient",
      badge: "STORY MODE",
      frameStyle: "gold_rpg",
      previewClass: "from-amber-950 via-zinc-900 to-yellow-950 border-amber-400/70 shadow-amber-500/10 ring-1 ring-amber-500/30",
    },
    {
      id: "fire_eikon",
      title: "Eikon Flame Crimson",
      subText: "HIGH-CONTRAST FIRE & EMBERS",
      color: "#ef4444",
      bgPreset: "vector",
      badge: "100% GUIDE",
      frameStyle: "boss_flame",
      previewClass: "from-red-950 via-zinc-900 to-amber-950 border-red-500/50",
    },
    {
      id: "shiva_frost",
      title: "Shiva Glacial Sapphire",
      subText: "ICE CRYSTAL FROST OVERLAY",
      color: "#38bdf8",
      bgPreset: "gradient",
      badge: "4K 60FPS",
      frameStyle: "neon",
      previewClass: "from-sky-950 via-zinc-900 to-blue-950 border-sky-500/50",
    },
    {
      id: "titan_earth",
      title: "Titan Earth Obsidian",
      subText: "STONE & MOUNTAIN ROCKS",
      color: "#eab308",
      bgPreset: "vector",
      badge: "S-RANK",
      frameStyle: "snes",
      previewClass: "from-amber-950 via-zinc-900 to-yellow-950 border-amber-500/50",
    },
    {
      id: "bahamut_light",
      title: "Bahamut Celestial Gold",
      subText: "CELESTIAL RAY TRACING",
      color: "#6366f1",
      bgPreset: "gradient",
      badge: "NO DAMAGE",
      frameStyle: "gold_rpg",
      previewClass: "from-indigo-950 via-zinc-900 to-purple-950 border-indigo-500/50",
    },
    {
      id: "odin_darkness",
      title: "Odin Dark Zantetsuken",
      subText: "DEEP VOID SHADOWS & NEON",
      color: "#8b5cf6",
      bgPreset: "dark",
      badge: "NO COMMENTARY",
      frameStyle: "cyber_glitch",
      previewClass: "from-purple-950 via-zinc-900 to-zinc-950 border-purple-500/50",
    },
  ];

  const badgesList = [
    "100% GUIDE", "NO DAMAGE", "S-RANK", "1440p 60FPS", "FINAL BOSS", "NO COMMENTARY", "FIRST LOOK", "PLATINUM TROPHY"
  ];

  const handleApply = (preset: typeof presets[0]) => {
    const updatedConfig = {
      ...selectedEpisode.thumbnailConfig,
      themeColor: preset.color,
      backgroundPreset: preset.bgPreset,
      frameStyle: preset.frameStyle as any,
      subText: `${preset.badge} • ${preset.subText}`,
    };
    onApplyPreset(selectedEpisode.id, updatedConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#121215] border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-[#18181c]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Thumbnail Preset Packs & Badge Studio
              </h2>
              <p className="text-xs text-zinc-400">
                Apply pre-made high-CTR theme presets for Episode #{selectedEpisode.partNumber}: {selectedEpisode.shortTitle}.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-zinc-200">
          {/* Badge Stamps Bar */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
              Quick Badge Stamp Overlays:
            </span>
            <div className="flex flex-wrap gap-2">
              {badgesList.map((badge) => (
                <button
                  key={badge}
                  onClick={() => setActiveBadge(badge)}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg border transition ${
                    activeBadge === badge
                      ? "bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20"
                      : "bg-[#18181c] text-zinc-300 border-zinc-700 hover:border-zinc-500"
                  }`}
                >
                  {badge}
                </button>
              ))}
            </div>
          </div>

          {/* Preset Packs Grid */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
              High-CTR Design Preset Themes:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {presets.map((preset) => (
                <div
                  key={preset.id}
                  className={`p-4 rounded-xl border bg-gradient-to-br ${preset.previewClass} space-y-3 relative group hover:scale-[1.02] transition duration-200`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-mono uppercase font-bold text-amber-400 bg-black/60 px-2 py-0.5 rounded border border-amber-500/30">
                        {preset.badge}
                      </span>
                      <h3 className="text-sm font-black text-white mt-2">{preset.title}</h3>
                      <p className="text-[11px] text-zinc-300 opacity-90">{preset.subText}</p>
                    </div>

                    <div
                      className="w-5 h-5 rounded-full border border-white/40 shadow-md"
                      style={{ backgroundColor: preset.color }}
                    />
                  </div>

                  <button
                    onClick={() => handleApply(preset)}
                    className="w-full py-2 bg-black/60 hover:bg-black text-white font-bold text-xs rounded-lg border border-white/20 flex items-center justify-center gap-1.5 transition"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Apply Theme to Ep #{selectedEpisode.partNumber}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
