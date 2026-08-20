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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2 flex items-center justify-center relative z-10">
        {/* Center: Brand Logo */}
        <div className="flex items-center justify-center p-0.5 sm:p-1 select-none w-full max-w-[550px]">
          <img
            src={logoPng1}
            alt="Digital Play Grid - Playthrough Planner"
            className="w-auto h-auto max-h-8 min-[400px]:max-h-10 sm:max-h-14 md:max-h-18 lg:max-h-22 xl:max-h-26 2xl:max-h-28 max-w-[90vw] sm:max-w-[440px] md:max-w-[480px] lg:max-w-[520px] xl:max-w-[550px] object-contain filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] drop-shadow-[0_0_12px_rgba(56,189,248,0.2)]"
          />
        </div>
      </div>
    </div>
  );
};



