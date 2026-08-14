import React from "react";
import {
  Film,
  Clock,
  CheckCircle2,
  FolderKanban,
  Settings,
} from "lucide-react";
import { StudioBannerConfig } from "./StudioBannerModal";
import defaultStudioLogo from "../assets/playthrough_studio_logo.svg";

interface StudioTitleBannerProps {
  config: StudioBannerConfig;
  onOpenSettings: () => void;
  totalSeriesCount: number;
  totalEpisodesCount: number;
  totalCompletedEpisodes: number;
  totalPlannedHours: string;
}

export const StudioTitleBanner: React.FC<StudioTitleBannerProps> = ({
  config,
  onOpenSettings,
  totalSeriesCount,
  totalEpisodesCount,
  totalCompletedEpisodes,
  totalPlannedHours,
}) => {
  // Use configured logoUrl if available, otherwise fall back to default logo
  const logoSrc =
    config.logoUrl && config.logoUrl.trim().length > 0
      ? config.logoUrl
      : defaultStudioLogo;

  return (
    <section className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#0e1428] via-[#090e1c] to-[#04060d] border border-cyan-500/30 shadow-lg shadow-cyan-950/60 p-3 sm:p-4 text-center ring-1 ring-white/10 group transition-all duration-300">
      {/* Customize Banner Button */}
      {onOpenSettings && (
        <button
          onClick={onOpenSettings}
          className="absolute top-2.5 right-2.5 z-20 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-cyan-300 transition-all cursor-pointer opacity-80 hover:opacity-100"
          title="Customize Studio Logo & Banner"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      )}
      {/* Background Ambient Lights & Radial Glows */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Grid Pattern Background Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-40" />

      <div className="relative z-10 max-w-2xl mx-auto space-y-1.5 sm:space-y-2">
        {/* PLAYTHROUGH STUDIO LOGO WITH ARCED TEXT ABOVE */}
        <div className="flex justify-center pt-0.5 pb-0.5">
          <div className="relative group/logo w-full flex justify-center">
            <div className="pt-1 pb-1.5 px-3 sm:px-5 bg-[#080d1a]/60 rounded-xl border-0 shadow-lg shadow-cyan-950/40 flex flex-col items-center justify-center backdrop-blur-md transition-all duration-300 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl">
              {/* ARCED TITLE TEXT ABOVE SHIELD */}
              <div className="w-full flex justify-center -mb-2 sm:-mb-3.5 md:-mb-5 z-20 pointer-events-none overflow-visible">
                <svg viewBox="0 0 1200 110" className="w-full max-w-[320px] min-[400px]:max-w-[400px] sm:max-w-[540px] md:max-w-[680px] lg:max-w-[820px] h-auto overflow-visible transition-all duration-300">
                  <defs>
                    <linearGradient id="headerArcGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="45%" stopColor="#f1f5f9" />
                      <stop offset="100%" stopColor="#94a3b8" />
                    </linearGradient>
                    <filter id="headerTextGlow" x="-30%" y="-30%" width="160%" height="160%">
                      <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#000000" floodOpacity="0.95" />
                      <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#38bdf8" floodOpacity="0.75" />
                    </filter>
                    <path id="bannerArcPath" d="M 40 68 Q 600 12 1160 68" fill="none" />
                  </defs>
                  <text fontSize="64" fontWeight="900" letterSpacing="8" fill="url(#headerArcGrad)" stroke="#020617" strokeWidth="3" filter="url(#headerTextGlow)">
                    <textPath href="#bannerArcPath" startOffset="50%" textAnchor="middle">
                      {config.studioName || "PLAYTHROUGH STUDIO PRO"}
                    </textPath>
                  </text>
                </svg>
              </div>

              <img
                src={logoSrc}
                alt={config.studioName || "Playthrough Studio"}
                className="w-full h-auto max-h-16 min-[400px]:max-h-20 sm:max-h-28 md:max-h-36 lg:max-h-44 xl:max-h-52 object-contain filter drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)] transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {/* COMPRESSED METRICS BAR */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-lg mx-auto">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#080c18]/90 border border-white/10 rounded-md shadow-sm backdrop-blur-md">
            <FolderKanban className="w-3 h-3 text-blue-400 shrink-0" />
            <span className="text-xs font-black text-white">{totalSeriesCount}</span>
            <span className="text-[9px] font-bold text-zinc-400 uppercase">Series</span>
          </div>

          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#080c18]/90 border border-white/10 rounded-md shadow-sm backdrop-blur-md">
            <Film className="w-3 h-3 text-purple-400 shrink-0" />
            <span className="text-xs font-black text-white">{totalEpisodesCount}</span>
            <span className="text-[9px] font-bold text-zinc-400 uppercase">Episodes</span>
          </div>

          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#080c18]/90 border border-white/10 rounded-md shadow-sm backdrop-blur-md">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="text-xs font-black text-white">{totalCompletedEpisodes}</span>
            <span className="text-[9px] font-bold text-zinc-400 uppercase">Published</span>
          </div>

          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#080c18]/90 border border-white/10 rounded-md shadow-sm backdrop-blur-md">
            <Clock className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="text-xs font-black text-white">{totalPlannedHours}h</span>
            <span className="text-[9px] font-bold text-zinc-400 uppercase">Planned</span>
          </div>
        </div>
      </div>
    </section>
  );
};
