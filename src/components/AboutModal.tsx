import React, { useState } from "react";
import {
  Info,
  X,
  Gamepad2,
  Sparkles,
  CheckCircle2,
  Film,
  Calendar,
  Layers,
  Clock,
  Tv,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  Rocket,
  Mail
} from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContactUs?: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onOpenContactUs }) => {
  if (!isOpen) return null;

  return (
    <div
      id="about-dpg-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl bg-[#1c273e] border border-blue-500/35 rounded-3xl shadow-2xl shadow-blue-950/80 overflow-hidden text-zinc-100 my-8">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-500/10 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative z-10 px-6 sm:px-8 py-5 flex items-start justify-between bg-[#162136] border-b border-blue-500/30">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-blue-400 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#141e30] rounded-[14px] flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-blue-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  About Digital Play Grid
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  v2.0
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-blue-300/90 tracking-wide">
                Plan. Play. Publish.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-[#141e30] hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer border border-blue-500/30"
            title="Close About Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="relative z-10 p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar text-sm sm:text-base leading-relaxed bg-[#1c273e]">
          {/* Hero Quote Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#141e30] border border-blue-500/30 text-zinc-200 space-y-2.5 shadow-inner">
            <p className="text-sm sm:text-base text-zinc-200">
              Let’s be honest — making a gaming playthrough sounds easy.
            </p>
            <p className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              <span className="text-cyan-400">Play it.</span>
              <span className="text-blue-400">Record it.</span>
              <span className="text-emerald-400">Upload it.</span>
              <span className="text-amber-400">Done.</span>
            </p>
            <p className="text-xs sm:text-sm text-zinc-300">
              Except there’s planning, episode breakdowns, bosses, key items, notes, thumbnails, editing, scheduling… and suddenly you’re juggling spreadsheets, folders, screenshots, and notes just to keep everything straight.
            </p>
          </div>

          {/* Value Proposition */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#141e30] border border-blue-500/30 space-y-2">
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span>Digital Play Grid (DPG) puts it all in one place.</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300">
              Built for seasoned creators, new creators, and everyone in between, DPG helps you manage your playthrough from the first idea to the final published episode.
            </p>
          </div>

          {/* 4 Core Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pillar 1 */}
            <div className="p-4 rounded-2xl bg-[#141e30] border border-blue-500/20 hover:border-blue-500/40 transition-all space-y-2">
              <div className="flex items-center gap-2 text-blue-300 font-extrabold text-sm sm:text-base">
                <Gamepad2 className="w-4 h-4 text-blue-400" />
                <span>🕹️ Plan Your Playthrough</span>
              </div>
              <p className="text-xs text-zinc-300">
                Break your game into organized episodes with <strong className="text-white">titles, descriptions, gameplay start and end points, bosses, key items, important moments, and notes.</strong>
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-4 rounded-2xl bg-[#141e30] border border-blue-500/20 hover:border-purple-500/40 transition-all space-y-2">
              <div className="flex items-center gap-2 text-purple-300 font-extrabold text-sm sm:text-base">
                <Film className="w-4 h-4 text-purple-400" />
                <span>🎬 Track Your Production</span>
              </div>
              <p className="text-xs text-zinc-300">
                Know exactly where every episode stands with simple production stages:
              </p>
              <div className="p-2 rounded-xl bg-[#162136] border border-purple-500/30 text-[11px] font-bold text-purple-200 flex flex-wrap items-center justify-center gap-1 text-center">
                <span>Planning</span>
                <span>→</span>
                <span>Recording</span>
                <span>→</span>
                <span>Editing</span>
                <span>→</span>
                <span>Thumbnail</span>
                <span>→</span>
                <span>Ready</span>
                <span>→</span>
                <span className="text-emerald-400 font-black">Published</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="p-4 rounded-2xl bg-[#141e30] border border-blue-500/20 hover:border-emerald-500/40 transition-all space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-sm sm:text-base">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>🖼️ Organize Your Content</span>
              </div>
              <p className="text-xs text-zinc-300">
                Keep your episode information and creative assets connected, so you spend less time searching through folders and more time creating.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-4 rounded-2xl bg-[#141e30] border border-blue-500/20 hover:border-amber-500/40 transition-all space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm sm:text-base">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>📅 Stay on Schedule</span>
              </div>
              <p className="text-xs text-zinc-300">
                Plan upcoming releases, track scheduled episodes, and keep your content pipeline moving without relying on scattered notes or spreadsheets.
              </p>
            </div>
          </div>

          {/* Spend Less Time Section */}
          <div className="p-5 rounded-2xl bg-[#141e30] border border-blue-500/20 space-y-3">
            <h4 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>⏱️ Spend Less Time Managing — More Time Creating</span>
            </h4>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              YouTube is where you <strong className="text-blue-300">publish</strong> your videos. DPG is where you <strong className="text-blue-300">build the playthrough.</strong>
            </p>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Everything is designed to streamline the process, reduce the busywork, and help you stay organized without getting buried in your own workflow.
            </p>
            <p className="text-xs sm:text-sm font-semibold text-zinc-200">
              Whether you're planning your first playthrough or your next hundred, <strong className="text-white">Digital Play Grid helps turn the chaos into a plan.</strong>
            </p>
          </div>

          {/* Slogan Footer Callout */}
          <div className="p-4 rounded-2xl bg-[#162136] border border-blue-500/30 text-center space-y-1.5 shadow-lg">
            <p className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-200 to-indigo-200 tracking-wide">
              🎮 Plan. 🕹️ Play. 🚀 Publish.
            </p>
            <p className="text-xs sm:text-sm font-extrabold text-white">
              Digital Play Grid
            </p>
            <p className="text-xs text-blue-300/80 font-medium">
              Your playthrough. Your workflow. One place.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-[#162136] border-t border-blue-500/30 flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="text-xs text-zinc-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Digital Play Grid Studio Suite</span>
          </div>

          <div className="flex items-center gap-2.5">
            {onOpenContactUs && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenContactUs();
                }}
                className="px-3.5 py-2 rounded-xl bg-[#141e30] hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>Contact Team</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-md shadow-blue-600/30 transition-all cursor-pointer"
            >
              Got It, Let's Plan!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
