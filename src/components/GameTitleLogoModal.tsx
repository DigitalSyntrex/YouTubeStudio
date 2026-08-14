import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  Check,
  Trash2,
  Sparkles,
  Gamepad2,
  Sliders,
  Type,
  Eye,
  Zap,
  RotateCcw,
  Layers,
  Layout,
  Info,
} from "lucide-react";
import { PlaythroughSeries } from "../types";

interface GameTitleLogoModalProps {
  isOpen: boolean;
  onClose: () => void;
  seriesList: PlaythroughSeries[];
  activeSeriesId: string;
  onUpdateSeriesLogo: (
    seriesId: string,
    logoUrl: string | undefined,
    useTitleLogo: boolean
  ) => void;
}

// Preset game title logos for popular games
const SAMPLE_GAME_LOGOS = [
  {
    id: "ff6_logo",
    gameName: "Final Fantasy VI",
    svgData: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" fill="none"><text x="10" y="45" font-family="'Times New Roman', serif" font-size="34" font-weight="900" fill="%23f8fafc" letter-spacing="2">FINAL FANTASY</text><text x="270" y="45" font-family="'Times New Roman', serif" font-size="36" font-weight="900" fill="%2338bdf8">VI</text><text x="12" y="65" font-family="sans-serif" font-size="10" font-weight="800" fill="%23f59e0b" letter-spacing="4">PIXEL REMASTER</text></svg>`,
  },
  {
    id: "elden_logo",
    gameName: "Elden Ring",
    svgData: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 70" fill="none"><text x="10" y="45" font-family="'Georgia', serif" font-size="38" font-weight="900" fill="%23fbbf24" letter-spacing="4">ELDEN RING</text><text x="12" y="62" font-family="sans-serif" font-size="9" font-weight="900" fill="%23f59e0b" letter-spacing="6">SHADOW OF THE ERDTREE</text></svg>`,
  },
  {
    id: "zelda_logo",
    gameName: "Zelda: TotK",
    svgData: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 80" fill="none"><text x="10" y="42" font-family="'Trebuchet MS', sans-serif" font-size="32" font-weight="900" fill="%2310b981" letter-spacing="2">TEARS OF THE KINGDOM</text><text x="12" y="62" font-family="sans-serif" font-size="11" font-weight="800" fill="%2334d399" letter-spacing="5">THE LEGEND OF ZELDA</text></svg>`,
  },
  {
    id: "chrono_logo",
    gameName: "Chrono Trigger",
    svgData: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 70" fill="none"><text x="10" y="42" font-family="'Impact', sans-serif" font-size="36" font-weight="900" fill="%23ef4444" letter-spacing="2">CHRONO</text><text x="170" y="42" font-family="'Impact', sans-serif" font-size="36" font-weight="900" fill="%23f59e0b" letter-spacing="2">TRIGGER</text></svg>`,
  },
  {
    id: "re4_logo",
    gameName: "Resident Evil 4",
    svgData: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 70" fill="none"><text x="10" y="45" font-family="'Arial Black', sans-serif" font-size="32" font-weight="900" fill="%23ef4444" letter-spacing="1">RESIDENT EVIL</text><text x="280" y="48" font-family="'Arial Black', sans-serif" font-size="40" font-weight="900" fill="%23dc2626">4</text></svg>`,
  },
  {
    id: "cyber_logo",
    gameName: "Cyberpunk 2077",
    svgData: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 70" fill="none"><text x="10" y="45" font-family="'Courier New', monospace" font-size="34" font-weight="900" fill="%23facc15" letter-spacing="1">CYBERPUNK</text><text x="240" y="45" font-family="'Courier New', monospace" font-size="32" font-weight="900" fill="%2338bdf8">2077</text></svg>`,
  },
];

export const GameTitleLogoModal: React.FC<GameTitleLogoModalProps> = ({
  isOpen,
  onClose,
  seriesList,
  activeSeriesId,
  onUpdateSeriesLogo,
}) => {
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>(activeSeriesId);

  useEffect(() => {
    if (activeSeriesId) {
      setSelectedSeriesId(activeSeriesId);
    }
  }, [activeSeriesId]);

  const targetSeries = seriesList.find((s) => s.id === selectedSeriesId) || seriesList[0];

  const [logoUrl, setLogoUrl] = useState<string | undefined>(targetSeries?.gameTitleLogo);
  const [useTitleLogo, setUseTitleLogo] = useState<boolean>(
    targetSeries?.useTitleLogo ?? Boolean(targetSeries?.gameTitleLogo)
  );
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [imgDimensions, setImgDimensions] = useState<{ width: number; height: number; aspect: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync state when selected series changes
  useEffect(() => {
    if (targetSeries) {
      setLogoUrl(targetSeries.gameTitleLogo);
      setUseTitleLogo(targetSeries.useTitleLogo ?? Boolean(targetSeries.gameTitleLogo));
      setUploadError(null);
    }
  }, [selectedSeriesId, targetSeries]);

  // Inspect image dimensions whenever logoUrl changes
  useEffect(() => {
    if (!logoUrl) {
      setImgDimensions(null);
      return;
    }
    const img = new Image();
    img.src = logoUrl;
    img.onload = () => {
      const w = img.naturalWidth || 300;
      const h = img.naturalHeight || 80;
      setImgDimensions({ width: w, height: h, aspect: w / h });
    };
  }, [logoUrl]);

  if (!isOpen || !targetSeries) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload a valid image file (PNG, SVG, JPG, WebP, or GIF).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size exceeds 10MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setLogoUrl(dataUrl);
        setUseTitleLogo(true);
      }
    };
    reader.onerror = () => {
      setUploadError("Failed to read image file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleSave = () => {
    onUpdateSeriesLogo(selectedSeriesId, logoUrl, useTitleLogo);
    onClose();
  };

  const handleRemove = () => {
    setLogoUrl(undefined);
    setUseTitleLogo(false);
    onUpdateSeriesLogo(selectedSeriesId, undefined, false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#101424] border border-blue-500/40 rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl shadow-blue-950/80 text-zinc-100 space-y-6 relative animate-in fade-in zoom-in duration-200 my-8">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
              <ImageIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Game Title Logo Settings
                </h2>
                <span className="bg-blue-500/20 text-blue-300 border border-blue-400/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  Custom Branding
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                Replace plain text game titles on the Studio Landing Hub and Active Playthrough Planner with high-CTR game logos.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Series Selector Bar */}
        <div className="bg-[#0b0e1a] border border-blue-500/20 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
            <Gamepad2 className="w-4 h-4 text-blue-400" />
            <span>Select Series:</span>
          </div>
          <select
            value={selectedSeriesId}
            onChange={(e) => setSelectedSeriesId(e.target.value)}
            className="bg-[#181d30] border border-blue-500/40 hover:border-blue-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-500/30 rounded-xl px-3 py-1.5 text-xs font-extrabold text-white focus:outline-none w-full sm:w-auto cursor-pointer shadow-inner"
          >
            {seriesList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.gameTitle} ({s.episodes?.length || 0} Ep)
              </option>
            ))}
          </select>
        </div>

        {/* Live Auto-Adjusting Frame Previews */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold uppercase text-blue-300 tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Auto-Adjusting Frame Previews</span>
            </label>
            {imgDimensions && (
              <span className="text-[11px] font-mono font-bold text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-white/10">
                Natural Size: {imgDimensions.width}×{imgDimensions.height} (Ratio: {imgDimensions.aspect.toFixed(2)})
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* YouTube Studio Planner Header Preview */}
            <div className="bg-gradient-to-b from-[#0b1020] to-[#080a14] border border-cyan-500/30 rounded-2xl p-4 space-y-2">
              <div className="text-[10px] font-extrabold text-cyan-300 uppercase tracking-wider flex items-center justify-between">
                <span>YouTube Studio Planner Header Preview</span>
                <span className="text-zinc-500">Auto-Fit Bounds</span>
              </div>
              <div className="h-24 bg-[#12182c] border border-white/10 rounded-xl p-3 flex items-center justify-center overflow-hidden relative shadow-inner">
                {useTitleLogo && logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={targetSeries.gameTitle}
                    className="max-h-18 max-w-full w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] transition-all"
                  />
                ) : (
                  <span className="text-xl font-black text-white truncate drop-shadow-md">{targetSeries.gameTitle}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Option: Image Logo vs Plain Text */}
        <div className="bg-[#0b0e1b] border border-cyan-500/20 rounded-2xl p-4 space-y-2">
          <label className="flex items-center justify-between gap-4 cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shrink-0">
                <Type className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                  Display Game Logo Image in YouTube Studio Planner
                </span>
                <p className="text-[11px] text-zinc-400">
                  Replaces the plain text game title with the auto-fitting logo image exclusively in the YouTube Studio Planner header.
                </p>
              </div>
            </div>

            <input
              type="checkbox"
              checked={useTitleLogo}
              onChange={(e) => setUseTitleLogo(e.target.checked)}
              className="w-5 h-5 rounded bg-zinc-900 border-zinc-700 text-cyan-500 focus:ring-cyan-500 cursor-pointer shrink-0"
            />
          </label>
        </div>

        {/* File Upload Dropzone */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold uppercase text-zinc-300 tracking-wider flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upload Custom Game Logo File</span>
          </label>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2.5 ${
              isDragging
                ? "border-cyan-400 bg-cyan-500/10 scale-[1.01]"
                : "border-blue-500/30 bg-[#090d18] hover:bg-[#0f1628] hover:border-cyan-400/60"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
              className="hidden"
            />
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-md">
              <Upload className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-white">
                Drag & drop logo file here, or <span className="text-cyan-400 underline">browse computer</span>
              </p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                PNG, SVG, JPG, WebP up to 10MB. Transparent logo background recommended for best auto-framing.
              </p>
            </div>
          </div>

          {uploadError && (
            <p className="text-xs font-bold text-red-400 bg-red-950/40 border border-red-500/40 p-2.5 rounded-xl">
              {uploadError}
            </p>
          )}
        </div>

        {/* Preset Sample Game Title Logos */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold uppercase text-zinc-300 tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Or Pick Sample Preset Title Logo</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SAMPLE_GAME_LOGOS.map((sample) => (
              <button
                key={sample.id}
                onClick={() => {
                  setLogoUrl(sample.svgData);
                  setUseTitleLogo(true);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col items-center gap-1.5 cursor-pointer ${
                  logoUrl === sample.svgData
                    ? "bg-cyan-950/80 border-cyan-400 text-white shadow-md shadow-cyan-950/50 ring-2 ring-cyan-400/40"
                    : "bg-[#0d1222] border-white/10 hover:border-cyan-500/40 text-zinc-300 hover:text-white"
                }`}
              >
                <img src={sample.svgData} alt={sample.gameName} className="h-8 max-w-full object-contain" />
                <span className="text-[10px] font-extrabold text-center line-clamp-1">{sample.gameName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
          {logoUrl ? (
            <button
              onClick={handleRemove}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-bold transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset to Plain Text</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-extrabold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-lg bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white shadow-blue-500/30"
            >
              <Check className="w-4 h-4" />
              <span>Save Game Logo Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
