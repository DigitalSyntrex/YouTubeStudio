import React from "react";
import logoPng1 from "../assets/newlogo1.png";

export const TopStudioLogoBanner: React.FC = () => {
  return (
    <div
      id="top-studio-logo-banner"
      className="w-full bg-[#050711] border-b border-blue-500/20 relative overflow-hidden z-40 shadow-2xl"
    >
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(56,189,248,0.25)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-30" />

      {/* Main Banner Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 md:py-4 flex items-center justify-center relative z-10">
        <div className="flex items-center justify-center p-1 sm:p-2 select-none w-full max-w-[1100px]">
          <img
            src={logoPng1}
            alt="Digital Play Grid - Playthrough Planner"
            className="w-auto h-auto max-h-16 min-[400px]:max-h-20 sm:max-h-28 md:max-h-36 lg:max-h-44 xl:max-h-52 2xl:max-h-60 max-w-[95vw] sm:max-w-[88vw] md:max-w-[80vw] lg:max-w-[960px] xl:max-w-[1100px] object-contain filter drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] drop-shadow-[0_0_18px_rgba(56,189,248,0.25)]"
          />
        </div>
      </div>
    </div>
  );
};

