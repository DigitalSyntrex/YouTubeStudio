import React from "react";
import { X, Palette, Check, Sparkles, Moon, Monitor, Eye } from "lucide-react";
import { AppThemeId, THEME_CONFIGS } from "../utils/themeUtils";
import { PlaythroughSeries } from "../types";

interface ThemeSwitcherModalProps {
  currentTheme: AppThemeId;
  onSelectTheme: (themeId: AppThemeId) => void;
  activeSeries?: PlaythroughSeries;
  onUpdateSeriesAccentColor?: (color: string) => void;
  onClose: () => void;
}

const ACCENT_SWATCHES = [
  { name: "Electric Blue", hex: "#38bdf8" },
  { name: "Neon Fuchsia", hex: "#d946ef" },
  { name: "Cyber Cyan", hex: "#06b6d4" },
  { name: "Emerald Mint", hex: "#10b981" },
  { name: "Sunset Orange", hex: "#f97316" },
  { name: "Arcade Gold", hex: "#eab308" },
  { name: "Royal Indigo", hex: "#6366f1" },
  { name: "Crimson Red", hex: "#ef4444" },
];

export const ThemeSwitcherModal: React.FC<ThemeSwitcherModalProps> = ({
  currentTheme,
  onSelectTheme,
  activeSeries,
  onUpdateSeriesAccentColor,
  onClose,
}) => {
  const themeList = Object.values(THEME_CONFIGS);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#121215] border border-white/15 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#18181c]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Studio Theme & Atmosphere</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                  Dark Themes
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Select your preferred gaming theme atmosphere & accent colors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Section 1: Visual Theme Presets */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-400" />
                <span>Select Atmosphere ({themeList.length} Options)</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {themeList.map((config) => {
                const isSelected = currentTheme === config.id;
                return (
                  <button
                    key={config.id}
                    onClick={() => onSelectTheme(config.id)}
                    className={`relative p-4 rounded-xl border text-left transition-all flex flex-col justify-between group overflow-hidden cursor-pointer ${
                      isSelected
                        ? "border-blue-400 ring-2 ring-blue-500/40 bg-zinc-800/90 shadow-lg"
                        : "border-white/10 hover:border-white/25 bg-zinc-900/60 hover:bg-zinc-800/50"
                    }`}
                  >
                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-blue-500 text-white rounded-full p-1 shadow-md z-10">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}

                    <div>
                      {/* Theme Preview Card Graphic */}
                      <div
                        className="w-full h-20 rounded-lg p-2.5 mb-3 border flex flex-col justify-between shadow-inner relative"
                        style={{
                          backgroundColor: config.previewBg,
                          borderColor: config.previewAccent + "40",
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className="h-2.5 w-16 rounded"
                            style={{ backgroundColor: config.previewAccent }}
                          />
                          <div
                            className="h-2 w-8 rounded opacity-60 bg-white"
                          />
                        </div>
                        <div
                          className="p-2 rounded border flex items-center justify-between"
                          style={{
                            backgroundColor: config.previewCard,
                            borderColor: "rgba(255,255,255,0.15)",
                          }}
                        >
                          <div
                            className="h-2 w-20 rounded bg-zinc-200"
                          />
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: config.previewAccent }}
                          />
                        </div>
                      </div>

                      {/* Theme Name & Mode Icon */}
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                          {config.name}
                        </h4>
                        <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-extrabold flex items-center gap-1">
                          <Moon className="w-3 h-3" /> Dark
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {config.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Active Series Accent Color Swatches */}
          {activeSeries && onUpdateSeriesAccentColor && (
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                    Series Accent Color Tint ({activeSeries?.gameTitle || "Active Series"})
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">Current:</span>
                  <div
                    className="w-4 h-4 rounded-full border border-white/30 shadow"
                    style={{ backgroundColor: activeSeries.accentColor || "#38bdf8" }}
                  />
                  <span className="text-xs font-mono text-zinc-300 uppercase">
                    {activeSeries.accentColor || "#38bdf8"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-1">
                {ACCENT_SWATCHES.map((swatch) => {
                  const isSelected = activeSeries.accentColor?.toLowerCase() === swatch.hex.toLowerCase();
                  return (
                    <button
                      key={swatch.hex}
                      onClick={() => onUpdateSeriesAccentColor(swatch.hex)}
                      title={`${swatch.name} (${swatch.hex})`}
                      className={`h-10 rounded-lg border flex flex-col items-center justify-center transition-all relative cursor-pointer ${
                        isSelected
                          ? "border-white ring-2 ring-blue-400/60 scale-105"
                          : "border-white/10 hover:border-white/40 hover:scale-102"
                      }`}
                      style={{ backgroundColor: swatch.hex }}
                    >
                      {isSelected && (
                        <Check className="w-4 h-4 text-black drop-shadow stroke-[3]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 bg-[#18181c] flex items-center justify-between">
          <span className="text-xs text-zinc-400 flex items-center gap-1.5">
            <Monitor className="w-3.5 h-3.5 text-zinc-500" />
            <span>Theme settings are saved automatically.</span>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors shadow-md cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
