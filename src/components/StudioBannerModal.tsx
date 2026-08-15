import React, { useState } from "react";
import defaultStudioLogo from "../assets/playthrough_studio_logo.svg";
import {
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Gamepad2,
  Crown,
  Swords,
  Flame,
  Shield,
  Wand2,
  Tv,
  Star,
  Check,
  RefreshCw,
  Palette,
  Edit3,
  Sliders,
  Type,
} from "lucide-react";

export interface StudioBannerConfig {
  studioName: string;
  tagline: string;
  badgeText: string;
  logoUrl?: string;
  presetLogoId: string;
  useCustomImage: boolean;
  accentColor: "cyan" | "blue" | "purple" | "amber" | "emerald" | "rose";
  showStatsBar: boolean;
}

export const DEFAULT_STUDIO_BANNER_CONFIG: StudioBannerConfig = {
  studioName: "PLAYTHROUGH STUDIO",
  tagline: "",
  badgeText: "",
  presetLogoId: "gamepad_glow",
  logoUrl: "/playthrough_studio_logo.svg",
  useCustomImage: true,
  accentColor: "cyan",
  showStatsBar: true,
};

export const PRESET_STUDIO_EMBLEMS = [
  {
    id: "gamepad_glow",
    name: "Cyber Gamepad",
    icon: Gamepad2,
    gradient: "from-cyan-500 to-blue-600",
    glow: "rgba(6,182,212,0.4)",
    desc: "Modern Controller Glow",
  },
  {
    id: "golden_crown",
    name: "Royal Crown",
    icon: Crown,
    gradient: "from-amber-400 to-yellow-600",
    glow: "rgba(245,158,11,0.4)",
    desc: "100% Completion Royalty",
  },
  {
    id: "rpg_swords",
    name: "Crossed Swords",
    icon: Swords,
    gradient: "from-blue-500 to-indigo-600",
    glow: "rgba(59,130,246,0.4)",
    desc: "Classic Fantasy & RPGs",
  },
  {
    id: "flame_speed",
    name: "Speedrun Flame",
    icon: Flame,
    gradient: "from-rose-500 to-orange-500",
    glow: "rgba(244,63,94,0.4)",
    desc: "Speedruns & Boss Rush",
  },
  {
    id: "cyber_shield",
    name: "Shield Aegis",
    icon: Shield,
    gradient: "from-purple-500 to-indigo-600",
    glow: "rgba(168,85,247,0.4)",
    desc: "Tech & Challenge Runs",
  },
  {
    id: "magic_wand",
    name: "Esper Crystal",
    icon: Wand2,
    gradient: "from-emerald-400 to-teal-600",
    glow: "rgba(16,185,129,0.4)",
    desc: "Lore & Secrets Walkthroughs",
  },
  {
    id: "retro_tv",
    name: "Retro Studio TV",
    icon: Tv,
    gradient: "from-sky-400 to-blue-600",
    glow: "rgba(56,189,248,0.4)",
    desc: "Classic Console Let's Plays",
  },
  {
    id: "star_crest",
    name: "Star Emblem",
    icon: Star,
    gradient: "from-fuchsia-500 to-pink-600",
    glow: "rgba(217,70,239,0.4)",
    desc: "Featured Channel Banner",
  },
];

export const ACCENT_COLOR_OPTIONS = [
  { id: "cyan", label: "Cyan Cyber", bg: "bg-cyan-500", text: "text-cyan-400", border: "border-cyan-500/40" },
  { id: "blue", label: "Electric Blue", bg: "bg-blue-500", text: "text-blue-400", border: "border-blue-500/40" },
  { id: "purple", label: "Neon Purple", bg: "bg-purple-500", text: "text-purple-400", border: "border-purple-500/40" },
  { id: "amber", label: "Gold Legend", bg: "bg-amber-500", text: "text-amber-400", border: "border-amber-500/40" },
  { id: "emerald", label: "Emerald Spark", bg: "bg-emerald-500", text: "text-emerald-400", border: "border-emerald-500/40" },
  { id: "rose", label: "Crimson Boss", bg: "bg-rose-500", text: "text-rose-400", border: "border-rose-500/40" },
] as const;

interface StudioBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: StudioBannerConfig;
  onSave: (newConfig: StudioBannerConfig) => void;
}

export const StudioBannerModal: React.FC<StudioBannerModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [studioName, setStudioName] = useState(config.studioName);
  const [tagline, setTagline] = useState(config.tagline);
  const [badgeText, setBadgeText] = useState(config.badgeText);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(config.logoUrl);
  const [presetLogoId, setPresetLogoId] = useState(config.presetLogoId);
  const [useCustomImage, setUseCustomImage] = useState(config.useCustomImage);
  const [accentColor, setAccentColor] = useState<StudioBannerConfig["accentColor"]>(config.accentColor);
  const [showStatsBar, setShowStatsBar] = useState(config.showStatsBar);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert("Image size too large. Please select an image under 8MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoUrl(event.target.result as string);
          setUseCustomImage(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave({
      studioName: studioName.trim() || "YOUTUBE LET'S PLAY STUDIO",
      tagline: tagline.trim() || "100% Walkthroughs • Longplays • Speedrun Guides",
      badgeText: badgeText.trim() || "OFFICIAL CREATOR STUDIO",
      logoUrl,
      presetLogoId,
      useCustomImage,
      accentColor,
      showStatsBar,
    });
    onClose();
  };

  const selectedPreset = (PRESET_STUDIO_EMBLEMS || []).find((p) => p.id === presetLogoId) || PRESET_STUDIO_EMBLEMS[0];
  const PresetIcon = selectedPreset?.icon || Sparkles;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0c101d] border border-cyan-500/40 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl shadow-cyan-950/80 relative text-zinc-100 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-[#080b14]/90 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-md">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span>Front & Center Studio Banner Settings</span>
              </h2>
              <p className="text-xs text-zinc-400">Customize your Landing Page hero logo, title, and studio branding</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Live Banner Preview */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center justify-between">
              <span>Live Studio Banner Preview</span>
              <span className="text-zinc-500 font-normal">Front & Center Landing Hub</span>
            </label>
            <div className="bg-gradient-to-b from-[#0e1428] via-[#090d1c] to-[#050711] border border-cyan-500/30 rounded-2xl p-6 text-center relative overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-radial from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

              {/* Logo / Crest Front and Center */}
              <div className="flex flex-col items-center justify-center mb-2">
                {/* Arced Title Above Logo */}
                <div className="w-full flex justify-center -mb-2 sm:-mb-3.5 z-20 pointer-events-none overflow-visible">
                  <svg viewBox="0 0 1200 110" className="w-full max-w-md sm:max-w-xl h-auto overflow-visible">
                    <defs>
                      <linearGradient id="modalArcGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="50%" stopColor="#e2e8f0" />
                        <stop offset="100%" stopColor="#94a3b8" />
                      </linearGradient>
                      <path id="modalBannerArcPath" d="M 40 68 Q 600 12 1160 68" fill="none" />
                    </defs>
                    <text fontSize="64" fontWeight="900" letterSpacing="8" fill="url(#modalArcGrad)" stroke="#020617" strokeWidth="3">
                      <textPath href="#modalBannerArcPath" startOffset="50%" textAnchor="middle">
                        {studioName || "PLAYTHROUGH STUDIO PRO"}
                      </textPath>
                    </text>
                  </svg>
                </div>

                {useCustomImage ? (
                  <div className="py-2.5 px-5 bg-[#080d1a]/60 rounded-2xl border-0 shadow-xl flex items-center justify-center w-full max-w-xs sm:max-w-md">
                    <img
                      src={logoUrl && logoUrl.trim().length > 0 ? logoUrl : defaultStudioLogo}
                      alt={studioName}
                      className="w-full h-auto max-h-32 sm:max-h-44 object-contain filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
                    />
                  </div>
                ) : (
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${selectedPreset.gradient} border border-white/30 flex items-center justify-center text-white shadow-xl relative group`}
                    style={{ boxShadow: `0 0 35px ${selectedPreset.glow}` }}
                  >
                    <PresetIcon className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-md" />
                  </div>
                )}
              </div>

              {/* Studio Title */}
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md uppercase">
                {studioName || "YOUTUBE LET'S PLAY STUDIO"}
              </h3>
            </div>
          </div>

          {/* Logo Type Selector: Custom Upload vs Preset Emblem */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              <span>Studio Logo Style</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUseCustomImage(false)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  !useCustomImage
                    ? "bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-950/50"
                    : "bg-[#090d1a] border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-300 shrink-0">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-white">Preset Gaming Emblem</div>
                  <div className="text-[10px] text-zinc-400">Vector gaming crests & icons</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setUseCustomImage(true)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  useCustomImage
                    ? "bg-cyan-500/20 border-cyan-400 text-white shadow-lg shadow-cyan-950/50"
                    : "bg-[#090d1a] border-white/10 text-zinc-400 hover:text-white"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-300 shrink-0">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-white">Upload Custom Logo</div>
                  <div className="text-[10px] text-zinc-400">PNG, SVG, or GIF image file</div>
                </div>
              </button>
            </div>
          </div>

          {/* Custom Upload Form */}
          {useCustomImage ? (
            <div className="bg-[#090d1a] border border-cyan-500/20 rounded-2xl p-4 space-y-3">
              <label className="text-xs font-bold text-zinc-300 block">Upload Custom Studio Logo Image</label>
              <div className="flex items-center gap-3">
                {logoUrl ? (
                  <div className="w-16 h-16 rounded-xl bg-[#030611] border border-white/10 flex items-center justify-center p-2 overflow-hidden shrink-0">
                    <img src={logoUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-white/5 border border-dashed border-white/20 flex items-center justify-center text-zinc-500 shrink-0">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}

                <div className="flex-1 space-y-2">
                  <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-bold cursor-pointer transition-all">
                    <Upload className="w-4 h-4" />
                    <span>Choose File from Computer</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() => setLogoUrl(undefined)}
                      className="block text-[11px] text-rose-400 hover:underline cursor-pointer"
                    >
                      Remove Uploaded Logo
                    </button>
                  )}
                  <p className="text-[10px] text-zinc-400">Supports transparent PNG, SVG vector, or GIF logos up to 8MB.</p>
                </div>
              </div>
            </div>
          ) : (
            /* Preset Emblem Picker Grid */
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-zinc-300 block">
                Select Gaming Crest Emblem
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PRESET_STUDIO_EMBLEMS.map((preset) => {
                  const Icon = preset.icon;
                  const isSelected = presetLogoId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setPresetLogoId(preset.id);
                        setUseCustomImage(false);
                      }}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 relative ${
                        isSelected
                          ? "bg-cyan-500/20 border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400/50"
                          : "bg-[#090d1a] border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${preset.gradient} flex items-center justify-center text-white shadow-md`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-white truncate w-full">{preset.name}</span>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-cyan-400 text-black flex items-center justify-center text-[10px] font-black">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Text Fields */}
          <div className="space-y-4 pt-2 border-t border-white/10">
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">Studio / Channel Title</label>
              <input
                type="text"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                placeholder="e.g. PLAYTHROUGH STUDIO"
                className="w-full px-3.5 py-2.5 bg-[#080b15] border border-white/15 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#080b14] flex items-center justify-end gap-3 sticky bottom-0 z-20">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold cursor-pointer transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs cursor-pointer transition-all shadow-lg shadow-cyan-950/60 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Save Banner Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
