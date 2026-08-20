import React from "react";
import { Settings } from "lucide-react";
import { StudioBannerConfig } from "./StudioBannerModal";
import defaultStudioLogo from "../assets/newlogo1.png";

interface StudioTitleBannerProps {
  config: StudioBannerConfig;
  onOpenSettings: () => void;
  totalSeriesCount?: number;
  totalEpisodesCount?: number;
  totalCompletedEpisodes?: number;
  totalPlannedHours?: string;
}

export const StudioTitleBanner: React.FC<StudioTitleBannerProps> = ({
  config,
  onOpenSettings,
}) => {
  // Use configured logoUrl if available, otherwise fall back to default logo
  const logoSrc =
    config.logoUrl && config.logoUrl.trim().length > 0
      ? config.logoUrl
      : defaultStudioLogo;

  return (
    <section className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#0e1428] via-[#090e1c] to-[#04060d] border border-cyan-500/30 shadow-lg shadow-cyan-950/60 p-2 sm:p-3 text-center ring-1 ring-white/10 group transition-all duration-300">
      {/* Customize Banner Button */}
      {onOpenSettings && (
        <button
          onClick={() => onOpenSettings()}
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

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* PLAYTHROUGH STUDIO LOGO */}
        <div className="flex justify-center py-0.5">
          <div className="relative group/logo w-full flex justify-center">
            <div className="pt-0.5 pb-1 px-2.5 sm:px-4 bg-[#080d1a]/60 rounded-xl border-0 shadow-lg shadow-cyan-950/40 flex flex-col items-center justify-center backdrop-blur-md transition-all duration-300 w-full max-w-[280px] sm:max-w-xs md:max-w-sm">
              <img
                src={logoSrc}
                alt={config.studioName || "Digital Play Grid"}
                className="w-full h-auto max-h-8 min-[400px]:max-h-10 sm:max-h-14 md:max-h-18 lg:max-h-22 xl:max-h-26 object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
