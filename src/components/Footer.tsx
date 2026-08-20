import React from "react";
import {
  Mail,
  Gamepad2,
  Sparkles,
  Info,
  BookOpen,
  Send,
  Heart,
  ShieldCheck,
  ExternalLink,
  MessageSquare
} from "lucide-react";

interface FooterProps {
  onOpenContactUs: () => void;
  onOpenAbout: () => void;
  onOpenGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenContactUs,
  onOpenAbout,
  onOpenGuide
}) => {
  const currentYear = new Date().getFullYear();
  const contactEmail = "digitalplaygrid@gmail.com";

  return (
    <footer className="mt-16 bg-[#162136] border-t border-blue-500/30 text-zinc-300 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-blue-500/10 blur-3xl pointer-events-none" />

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Brand & Project Info */}
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-[#141e30] rounded-[10px] flex items-center justify-center">
                  <Gamepad2 className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-base font-black text-white tracking-tight">
                Digital Play Grid
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Studio
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-sm">
              The premier playthrough planner, episode indexing, and metadata studio designed for gaming creators.
            </p>
          </div>

          {/* Center: Contact Us Hero Card & Button */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="bg-[#1c273e] border border-blue-500/35 rounded-2xl p-4 sm:p-5 shadow-xl shadow-blue-950/40 w-full max-w-md space-y-3">
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black text-white">Have a Question or Idea?</h4>
                  <p className="text-[11px] text-zinc-400 font-mono">{contactEmail}</p>
                </div>
              </div>

              {/* Contact Us Action Button */}
              <button
                type="button"
                onClick={onOpenContactUs}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-black text-xs transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
              >
                <Mail className="w-4 h-4 text-cyan-300" />
                <span>Contact Us / Draft Email</span>
              </button>
            </div>
          </div>

          {/* Right: Quick Links Navigation */}
          <div className="flex flex-col items-center md:items-end space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2">
              <button
                type="button"
                onClick={onOpenContactUs}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141e30] hover:bg-blue-600/30 border border-blue-500/30 hover:border-blue-400 text-blue-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>Contact Us</span>
              </button>

              <button
                type="button"
                onClick={onOpenAbout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141e30] hover:bg-blue-600/30 border border-blue-500/30 hover:border-blue-400 text-zinc-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>About DPG</span>
              </button>

              <button
                type="button"
                onClick={onOpenGuide}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141e30] hover:bg-blue-600/30 border border-blue-500/30 hover:border-blue-400 text-zinc-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Strategy Guide</span>
              </button>
            </div>

            <p className="text-[11px] text-zinc-500 text-center md:text-right">
              Direct inquiries: <a href={`mailto:${contactEmail}`} className="text-blue-400 hover:underline font-mono">{contactEmail}</a>
            </p>
          </div>
        </div>

        {/* Bottom Micro Bar */}
        <div className="mt-8 pt-5 border-t border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
          <div className="flex items-center gap-1">
            <span>© {currentYear} Digital Play Grid Studio. Plan. Play. Publish.</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-blue-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Creator-First Gaming Toolset</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
