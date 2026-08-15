import React, { useState } from "react";
import { Episode, PlaythroughSeries } from "../types";
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  FileText,
  CheckSquare,
  Sparkles,
  BookOpen,
  ListChecks,
  User,
  Map,
  Layers,
  Clock,
  CheckCircle2,
  Calendar,
  Compass
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface PrintCheatSheetModalProps {
  series?: PlaythroughSeries;
  episodes: Episode[];
  onClose: () => void;
}

export const PrintCheatSheetModal: React.FC<PrintCheatSheetModalProps> = ({
  series,
  episodes,
  onClose,
}) => {
  const { userProfile } = useAuth();
  const gameTitle = series?.gameTitle || "Gaming Series";
  const [layoutMode, setLayoutMode] = useState<"roadmap" | "planner" | "checklist" | "bosses">("roadmap");
  const [includeNoteLines, setIncludeNoteLines] = useState<boolean>(true);
  const [includeTimestamps, setIncludeTimestamps] = useState<boolean>(true);
  const [includeBosses, setIncludeBosses] = useState<boolean>(true);
  const [includeChecklist, setIncludeChecklist] = useState<boolean>(true);
  const [broadcasterNotes, setBroadcasterNotes] = useState<string>(
    "• Welcome stream viewers / YouTube audience!\n• Remind viewers to LIKE & SUBSCRIBE\n• Focus on 100% completion & all side collectibles\n• Check mic levels & game audio balance before start"
  );
  const [copied, setCopied] = useState<boolean>(false);

  // Trigger browser print (Save as PDF)
  const handlePrint = () => {
    window.print();
  };

  // Generate plain text cheat sheet for downloading or copying
  const generateTextCheatSheet = () => {
    let txt = `========================================================================\n`;
    txt += `${gameTitle.toUpperCase()} - PLAYTHROUGH ROADMAP & EPISODE BREAKDOWN\n`;
    txt += `Series: ${series?.subtitle || series?.playthroughType || "100% Walkthrough"}\n`;
    txt += `Total Episodes: ${episodes.length} | Est Total Playtime: ~${(episodes.reduce((a, b) => a + b.estDurationMinutes, 0) / 60).toFixed(1)} Hours\n`;
    txt += `Generated: ${new Date().toLocaleDateString()}\n`;
    txt += `========================================================================\n\n`;

    if (broadcasterNotes.trim()) {
      txt += `[ BROADCASTER NOTES / STREAM CHECKLIST ]\n`;
      txt += `${broadcasterNotes.trim()}\n\n`;
      txt += `------------------------------------------------------------------------\n\n`;
    }

    if (includeChecklist) {
      txt += `[ GENERAL RECORDING CHECKLIST ]\n`;
      txt += `[ ] Microphone Level & Noise Gate Check\n`;
      txt += `[ ] Game Audio & BGM Balance Check\n`;
      txt += `[ ] Facecam Framing / Lighting Check\n`;
      txt += `[ ] OBS Recording Route & Disk Space Check\n`;
      txt += `[ ] Title, Chapter Markers & Thumbnail Prompt Ready\n\n`;
      txt += `------------------------------------------------------------------------\n\n`;
    }

    txt += `[ EPISODE BREAKDOWN & ROADMAP ]\n\n`;

    episodes.forEach((ep) => {
      txt += `------------------------------------------------------------------------\n`;
      txt += `EPISODE ${ep.partNumber < 10 ? `0${ep.partNumber}` : ep.partNumber}: ${ep.title}\n`;
      txt += `Status: [ ${ep.status.toUpperCase()} ] | Area: ${ep.world} | ~${ep.estDurationMinutes} mins\n`;
      txt += `Start: ${ep.startPoint}  --->  End: ${ep.endPoint}\n`;

      if (ep.keyEvents && ep.keyEvents.length > 0) {
        txt += `Key Beats:\n`;
        ep.keyEvents.forEach((ke) => (txt += `  • ${ke}\n`));
      }

      if (includeBosses && ep.bossStrategies && ep.bossStrategies.length > 0) {
        txt += `Boss Tactics:\n`;
        ep.bossStrategies.forEach((bs) => (txt += `  [ ] ⚔️ ${bs}\n`));
      }

      if (ep.keyItemsAndEspers && ep.keyItemsAndEspers.length > 0) {
        txt += `Key Items / Loot:\n`;
        ep.keyItemsAndEspers.forEach((item) => (txt += `  [ ] 🎁 ${item}\n`));
      }

      if (includeTimestamps && ep.chapters && ep.chapters.length > 0) {
        txt += `Timestamps:\n`;
        ep.chapters.forEach((ch) => (txt += `  ${ch.timestamp} - ${ch.title}\n`));
      }

      txt += `Production Status: [ ] Recorded   [ ] Edited   [ ] Uploaded   [ ] Published\n`;
      txt += `Notes / Recording Reminders:\n`;
      txt += `  _____________________________________________________________________\n`;
      txt += `  _____________________________________________________________________\n\n`;
    });

    return txt;
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generateTextCheatSheet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadText = () => {
    const text = generateTextCheatSheet();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${gameTitle.replace(/\s+/g, "_")}_Playthrough_Roadmap.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const totalMinutes = episodes.reduce((acc, ep) => acc + ep.estDurationMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const publishedCount = episodes.filter((e) => e.status === "published").length;
  const recordedCount = episodes.filter((e) => e.status === "recorded" || e.status === "edited" || e.status === "uploaded" || e.status === "published").length;
  const completionPct = episodes.length > 0 ? Math.round((publishedCount / episodes.length) * 100) : 0;
  const totalBosses = episodes.reduce((acc, ep) => acc + (ep.bossStrategies?.length || (ep.bosses?.length || 0)), 0);
  const totalLoot = episodes.reduce((acc, ep) => acc + (ep.keyItemsAndEspers?.length || 0), 0);

  // Group episodes by world / stage for roadmap view
  const worldGroups = episodes.reduce((acc, ep) => {
    const worldName = ep.world || "Main Campaign";
    if (!acc[worldName]) acc[worldName] = [];
    acc[worldName].push(ep);
    return acc;
  }, {} as Record<string, Episode[]>);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      {/* Embedded CSS for clean printing */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-cheat-sheet, #printable-cheat-sheet * {
            visibility: visible !important;
          }
          #printable-cheat-sheet {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: #ffffff !important;
            color: #000000 !important;
            padding: 24px !important;
            font-family: system-ui, -apple-system, sans-serif !important;
            box-sizing: border-box !important;
          }
          .no-print {
            display: none !important;
          }
          .print-border-black {
            border-color: #000000 !important;
          }
          .print-bg-white {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .print-text-black {
            color: #000000 !important;
          }
          .page-break-inside-avoid {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>

      <div className="bg-[#121212] border border-white/10 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Header Bar (Hidden during print) */}
        <div className="no-print p-4 sm:p-5 bg-[#09090b] border-b border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Printer className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-100 flex items-center gap-2">
                <span>Series Breakdown & Roadmap Document</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  PDF & Print Ready
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Export full episode walkthrough, milestone roadmap & production checklist formatted for printing or PDF sharing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white bg-[#18181b] hover:bg-[#27272a] rounded-lg transition-colors border border-white/10 shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customization Controls Toolbar (Hidden during print) */}
        <div className="no-print p-4 bg-[#121212] border-b border-white/10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Layout Mode Selector */}
            <div className="flex items-center gap-1.5 bg-[#09090b] p-1 rounded-xl border border-white/10 overflow-x-auto max-w-full">
              <button
                onClick={() => setLayoutMode("roadmap")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  layoutMode === "roadmap"
                    ? "bg-amber-500 text-zinc-950 font-bold shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Project Roadmap</span>
              </button>
              <button
                onClick={() => setLayoutMode("planner")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  layoutMode === "planner"
                    ? "bg-amber-500 text-zinc-950 font-bold shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Full Breakdown Log</span>
              </button>
              <button
                onClick={() => setLayoutMode("checklist")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  layoutMode === "checklist"
                    ? "bg-amber-500 text-zinc-950 font-bold shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <ListChecks className="w-3.5 h-3.5" />
                <span>Master Checklist</span>
              </button>
              <button
                onClick={() => setLayoutMode("bosses")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  layoutMode === "bosses"
                    ? "bg-amber-500 text-zinc-950 font-bold shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Boss & Loot Ref</span>
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyText}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#18181b] hover:bg-[#27272a] text-zinc-200 text-xs font-semibold rounded-lg transition-colors border border-white/10 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Text"}</span>
              </button>

              <button
                onClick={handleDownloadText}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-semibold rounded-lg transition-colors border border-blue-500/30 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .txt</span>
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-black text-xs rounded-lg transition-all shadow-md shadow-amber-500/20 cursor-pointer active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>PRINT / EXPORT PDF</span>
              </button>
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-300 pt-1">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeNoteLines}
                onChange={(e) => setIncludeNoteLines(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 text-amber-500 focus:ring-amber-500 bg-[#18181b]"
              />
              <span>Include Note-Taking Lines</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeTimestamps}
                onChange={(e) => setIncludeTimestamps(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 text-amber-500 focus:ring-amber-500 bg-[#18181b]"
              />
              <span>Include Chapter Timestamps</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeBosses}
                onChange={(e) => setIncludeBosses(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 text-amber-500 focus:ring-amber-500 bg-[#18181b]"
              />
              <span>Include Boss Tactics & Loot</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeChecklist}
                onChange={(e) => setIncludeChecklist(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 text-amber-500 focus:ring-amber-500 bg-[#18181b]"
              />
              <span>Include Technical Soundcheck Box</span>
            </label>
          </div>

          {/* Broadcaster Notes Input */}
          <div className="pt-1">
            <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
              Custom Broadcaster / Recording Notes (Printed at Top of Document):
            </label>
            <textarea
              value={broadcasterNotes}
              onChange={(e) => setBroadcasterNotes(e.target.value)}
              rows={2}
              placeholder="Add key reminders, stream rules, sponsor reads, or call-to-actions..."
              className="w-full bg-[#09090b] border border-white/10 rounded-lg p-2.5 text-xs text-zinc-200 outline-none focus:border-amber-500/50 resize-y"
            />
          </div>
        </div>

        {/* Printable Preview Document Window */}
        <div className="p-6 bg-[#0a0a0a] flex-1 overflow-y-auto">
          <div
            id="printable-cheat-sheet"
            className="bg-white text-zinc-900 p-8 rounded-xl shadow-xl max-w-4xl mx-auto space-y-6 print-bg-white print-text-black"
          >
            {/* Document Header */}
            <div className="border-b-2 border-zinc-900 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                {/* Creator Avatar */}
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-300 flex items-center justify-center text-zinc-100 font-bold text-sm shrink-0">
                  {userProfile?.avatarUrl ? (
                    <img src={userProfile.avatarUrl} alt="Creator" className="w-full h-full object-cover" />
                  ) : (
                    <span>{(userProfile?.displayName || userProfile?.username || "C").slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-zinc-600 flex items-center gap-1.5">
                    <span>PLAYTHROUGH SERIES ROADMAP & EPISODE BREAKDOWN</span>
                    <span>•</span>
                    <span className="text-blue-700 font-bold">
                      {userProfile?.displayName || userProfile?.username || "Creator"}
                    </span>
                  </div>
                  <h1 className="text-2xl font-black text-zinc-950 tracking-tight mt-0.5">
                    {gameTitle}
                  </h1>
                  <p className="text-sm font-semibold text-zinc-700">
                    {series?.subtitle || series?.playthroughType || "100% Walkthrough & Let's Play"}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs font-mono text-zinc-800 space-y-0.5 border-l-2 sm:border-l-0 sm:border-r-2 border-zinc-900 pl-3 sm:pl-0 sm:pr-3">
                <div><strong>Episodes:</strong> {episodes.length} Parts ({totalHours}h est)</div>
                <div><strong>Progress:</strong> {publishedCount}/{episodes.length} Published ({completionPct}%)</div>
                <div><strong>Printed:</strong> {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
              </div>
            </div>

            {/* Custom Broadcaster Notes Block */}
            {broadcasterNotes.trim() && (
              <div className="p-3.5 bg-zinc-100 border border-zinc-300 rounded-lg space-y-1 page-break-inside-avoid">
                <div className="text-[11px] font-black uppercase tracking-wider text-zinc-800 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Broadcaster / Creator Notes & Reminders:</span>
                </div>
                <p className="text-xs text-zinc-800 whitespace-pre-wrap leading-relaxed font-sans">
                  {broadcasterNotes}
                </p>
              </div>
            )}

            {/* Recording Soundcheck Box */}
            {includeChecklist && (
              <div className="p-3 bg-amber-50/80 border border-amber-300 rounded-lg space-y-2 page-break-inside-avoid">
                <div className="text-[11px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-amber-700" />
                  <span>Pre-Recording Technical Soundcheck & Setup:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-medium text-amber-950">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" className="rounded border-amber-400" />
                    <span>Mic Level / Gate</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" className="rounded border-amber-400" />
                    <span>Game Audio / BGM</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" className="rounded border-amber-400" />
                    <span>OBS Disk Space</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" className="rounded border-amber-400" />
                    <span>Facecam / Lighting</span>
                  </label>
                </div>
              </div>
            )}

            {/* LAYOUT MODE 0: PROJECT ROADMAP & STAGE TIMELINE */}
            {layoutMode === "roadmap" && (
              <div className="space-y-6">
                {/* Executive Progress & Metrics Summary */}
                <div className="border border-zinc-300 rounded-xl p-4 bg-zinc-50 space-y-3 page-break-inside-avoid">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-2">
                    <div className="flex items-center gap-2">
                      <Map className="w-4 h-4 text-zinc-900" />
                      <span className="font-bold text-sm text-zinc-900 uppercase tracking-wider">
                        Series Project Roadmap Overview
                      </span>
                    </div>
                    <div className="text-xs font-mono text-zinc-700">
                      Completion: <strong>{completionPct}%</strong> ({publishedCount} of {episodes.length} Episodes Published)
                    </div>
                  </div>

                  {/* Visual Progress Bar for Print */}
                  <div className="space-y-1.5">
                    <div className="w-full bg-zinc-200 rounded-full h-3 overflow-hidden border border-zinc-300 flex">
                      <div
                        className="bg-emerald-600 h-full"
                        style={{ width: `${(episodes.filter(e => e.status === 'published').length / (episodes.length || 1)) * 100}%` }}
                        title="Published"
                      />
                      <div
                        className="bg-blue-600 h-full"
                        style={{ width: `${(episodes.filter(e => e.status === 'uploaded').length / (episodes.length || 1)) * 100}%` }}
                        title="Uploaded"
                      />
                      <div
                        className="bg-purple-600 h-full"
                        style={{ width: `${(episodes.filter(e => e.status === 'edited').length / (episodes.length || 1)) * 100}%` }}
                        title="Edited"
                      />
                      <div
                        className="bg-amber-500 h-full"
                        style={{ width: `${(episodes.filter(e => e.status === 'recorded').length / (episodes.length || 1)) * 100}%` }}
                        title="Recorded"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-[10px] font-mono text-zinc-700 pt-1">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                        Published ({episodes.filter(e => e.status === 'published').length})
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                        Uploaded ({episodes.filter(e => e.status === 'uploaded').length})
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-purple-600 inline-block"></span>
                        Edited ({episodes.filter(e => e.status === 'edited').length})
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                        Recorded ({episodes.filter(e => e.status === 'recorded').length})
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-zinc-400 inline-block"></span>
                        Not Started ({episodes.filter(e => e.status === 'not_started').length})
                      </span>
                    </div>
                  </div>

                  {/* Summary Metric Chips */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                    <div className="bg-white p-2 rounded border border-zinc-200">
                      <div className="text-[10px] text-zinc-500 font-bold uppercase">Total Episodes</div>
                      <div className="text-base font-black text-zinc-900">{episodes.length} Parts</div>
                    </div>
                    <div className="bg-white p-2 rounded border border-zinc-200">
                      <div className="text-[10px] text-zinc-500 font-bold uppercase">Est Playtime</div>
                      <div className="text-base font-black text-zinc-900">~{totalHours} Hours</div>
                    </div>
                    <div className="bg-white p-2 rounded border border-zinc-200">
                      <div className="text-[10px] text-zinc-500 font-bold uppercase">Boss Encounters</div>
                      <div className="text-base font-black text-zinc-900">{totalBosses} Bosses</div>
                    </div>
                    <div className="bg-white p-2 rounded border border-zinc-200">
                      <div className="text-[10px] text-zinc-500 font-bold uppercase">Key Loot Items</div>
                      <div className="text-base font-black text-zinc-900">{totalLoot} Items</div>
                    </div>
                  </div>
                </div>

                {/* Stage-by-Stage / World Arc Breakdown */}
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 border-b-2 border-zinc-900 pb-1 flex items-center justify-between">
                    <span>Stage & Narrative Arc Breakdown</span>
                    <span className="text-xs font-mono text-zinc-600 font-normal">
                      {Object.keys(worldGroups).length} Major Stages / Worlds
                    </span>
                  </h3>

                  {(Object.entries(worldGroups) as [string, Episode[]][]).map(([worldName, worldEps], worldIdx) => {
                    const worldDuration = (worldEps.reduce((acc, e) => acc + e.estDurationMinutes, 0) / 60).toFixed(1);
                    const worldPublished = worldEps.filter((e) => e.status === "published").length;
                    const worldBosses = worldEps.reduce((acc, e) => acc + (e.bossStrategies?.length || 0), 0);

                    return (
                      <div
                        key={worldName}
                        className="border border-zinc-300 rounded-xl p-4 bg-zinc-50 space-y-3 page-break-inside-avoid"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-zinc-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                              {worldIdx + 1}
                            </span>
                            <span className="font-black text-sm text-zinc-950">{worldName}</span>
                            <span className="text-[11px] font-semibold text-zinc-600 bg-zinc-200 px-2 py-0.5 rounded">
                              {worldEps.length} Episodes (~{worldDuration} hrs)
                            </span>
                          </div>

                          <div className="text-xs font-mono text-zinc-700 flex items-center gap-2">
                            <span>Status: {worldPublished}/{worldEps.length} Pub</span>
                            <span>•</span>
                            <span>{worldBosses} Bosses</span>
                          </div>
                        </div>

                        {/* Episodes Table for this Stage */}
                        <table className="w-full text-left border-collapse border border-zinc-300 text-xs bg-white rounded overflow-hidden">
                          <thead>
                            <tr className="bg-zinc-200 text-zinc-900 font-bold border-b border-zinc-300 text-[11px]">
                              <th className="p-1.5 border-r border-zinc-300 w-12 text-center">Part</th>
                              <th className="p-1.5 border-r border-zinc-300">Episode Title & Story Route</th>
                              <th className="p-1.5 border-r border-zinc-300 w-24">Duration</th>
                              <th className="p-1.5 border-r border-zinc-300">Key Objectives & Bosses</th>
                              <th className="p-1.5 w-24 text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {worldEps.map((ep) => (
                              <tr key={ep.id} className="border-b border-zinc-200 text-xs">
                                <td className="p-2 font-mono font-bold text-center border-r border-zinc-200">
                                  EP {ep.partNumber < 10 ? `0${ep.partNumber}` : ep.partNumber}
                                </td>
                                <td className="p-2 border-r border-zinc-200 space-y-0.5">
                                  <div className="font-bold text-zinc-950">{ep.title}</div>
                                  <div className="text-[10px] text-zinc-600 font-mono">
                                    {ep.startPoint} ➔ {ep.endPoint}
                                  </div>
                                </td>
                                <td className="p-2 border-r border-zinc-200 font-mono text-[11px] text-zinc-700">
                                  ~{ep.estDurationMinutes} mins
                                </td>
                                <td className="p-2 border-r border-zinc-200 text-[11px] space-y-0.5">
                                  {ep.keyEvents && ep.keyEvents.length > 0 && (
                                    <div className="text-zinc-800 line-clamp-2">
                                      • {ep.keyEvents.slice(0, 2).join(" • ")}
                                    </div>
                                  )}
                                  {ep.bossStrategies && ep.bossStrategies.length > 0 && (
                                    <div className="text-red-900 font-semibold text-[10px]">
                                      ⚔️ {ep.bossStrategies.map(b => b.split(":")[0]).join(", ")}
                                    </div>
                                  )}
                                </td>
                                <td className="p-2 text-center font-mono text-[10px] uppercase">
                                  <span className="px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-300 font-bold">
                                    {ep.status.replace("_", " ")}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* LAYOUT MODE 1: FULL PLANNER LOG */}
            {layoutMode === "planner" && (
              <div className="space-y-5">
                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-1">
                  Episode Planner & Notes Log
                </h3>

                {(episodes || []).map((ep) => (
                  <div
                    key={ep.id}
                    className="border border-zinc-300 rounded-lg p-4 space-y-3 page-break-inside-avoid bg-zinc-50/50"
                  >
                    {/* Episode Title Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black bg-zinc-900 text-white px-2 py-0.5 rounded">
                          EP {ep.partNumber < 10 ? `0${ep.partNumber}` : ep.partNumber}
                        </span>
                        <span className="font-bold text-sm text-zinc-950">
                          {ep.title}
                        </span>
                        <span className="text-xs font-semibold text-zinc-600 bg-zinc-200 px-2 py-0.5 rounded">
                          {ep.world}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs font-semibold text-zinc-700">
                        <span>~{ep.estDurationMinutes} mins</span>
                        <span className="font-mono text-[11px] uppercase bg-zinc-200 px-1.5 py-0.5 rounded border border-zinc-300">
                          {ep.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    {/* Milestones Row */}
                    <div className="text-xs text-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white p-2.5 rounded border border-zinc-200">
                      <div>
                        <strong className="text-zinc-950">Start:</strong> {ep.startPoint}
                      </div>
                      <div>
                        <strong className="text-zinc-950">End:</strong> {ep.endPoint}
                      </div>
                    </div>

                    {/* Key Events & Boss Tactics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {ep.keyEvents && ep.keyEvents.length > 0 && (
                        <div>
                          <strong className="text-zinc-950 text-[11px] block uppercase mb-1">
                            Key Objectives / Story Beats:
                          </strong>
                          <ul className="list-disc list-inside space-y-0.5 text-zinc-800">
                            {ep.keyEvents.map((ke, idx) => (
                              <li key={idx}>{ke}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {(includeBosses || includeTimestamps) && (
                        <div className="space-y-2">
                          {includeBosses && ep.bossStrategies && ep.bossStrategies.length > 0 && (
                            <div>
                              <strong className="text-zinc-950 text-[11px] block uppercase mb-1 flex items-center gap-1">
                                <span>⚔️ Boss Tactics / Weaknesses:</span>
                              </strong>
                              <ul className="space-y-1">
                                {ep.bossStrategies.map((bs, i) => (
                                  <li key={i} className="flex items-start gap-1.5 text-zinc-800 text-[11px]">
                                    <input type="checkbox" className="mt-0.5 rounded border-zinc-400 shrink-0 cursor-pointer" />
                                    <span>{bs}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {ep.keyItemsAndEspers && ep.keyItemsAndEspers.length > 0 && (
                            <div>
                              <strong className="text-zinc-950 text-[11px] block uppercase mb-1 flex items-center gap-1">
                                <span>🎁 Key Items / Rewards:</span>
                              </strong>
                              <ul className="space-y-1">
                                {ep.keyItemsAndEspers.map((item, i) => (
                                  <li key={i} className="flex items-start gap-1.5 text-zinc-800 text-[11px]">
                                    <input type="checkbox" className="mt-0.5 rounded border-zinc-400 shrink-0 cursor-pointer" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {includeTimestamps && ep.chapters && ep.chapters.length > 0 && (
                            <div>
                              <strong className="text-zinc-950 text-[11px] block uppercase mb-0.5">
                                Chapter Timestamps:
                              </strong>
                              <div className="text-[10px] font-mono text-zinc-700 flex flex-wrap gap-x-2 gap-y-0.5">
                                {ep.chapters.map((c, i) => (
                                  <span key={i}>[{c.timestamp}] {c.title}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Status Checkboxes & Note Lines */}
                    <div className="border-t border-zinc-200 pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3 text-xs font-semibold text-zinc-800">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="checkbox" className="rounded" defaultChecked={ep.status === "recorded" || ep.status === "edited" || ep.status === "uploaded" || ep.status === "published"} />
                          <span>Recorded</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="checkbox" className="rounded" defaultChecked={ep.status === "edited" || ep.status === "uploaded" || ep.status === "published"} />
                          <span>Edited</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="checkbox" className="rounded" defaultChecked={ep.status === "uploaded" || ep.status === "published"} />
                          <span>Uploaded</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input type="checkbox" className="rounded" defaultChecked={ep.status === "published"} />
                          <span>Published</span>
                        </label>
                      </div>

                      {includeNoteLines && (
                        <div className="w-full text-xs text-zinc-500 space-y-1">
                          <div className="text-[10px] font-bold text-zinc-700 uppercase">My Recording Notes:</div>
                          <div className="border-b border-zinc-300 h-4"></div>
                          <div className="border-b border-zinc-300 h-4"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* LAYOUT MODE 2: COMPACT CHECKLIST */}
            {layoutMode === "checklist" && (
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-1">
                  Compact Episode Recording Checklist
                </h3>

                <table className="w-full text-left border-collapse border border-zinc-300 text-xs">
                  <thead>
                    <tr className="bg-zinc-200 text-zinc-900 font-bold border-b border-zinc-300">
                      <th className="p-2 border-r border-zinc-300 w-12 text-center">Part</th>
                      <th className="p-2 border-r border-zinc-300">Episode Title & Milestones</th>
                      <th className="p-2 border-r border-zinc-300 w-28">Area / World</th>
                      <th className="p-2 border-r border-zinc-300 w-36 text-center">Status Checklist</th>
                      <th className="p-2">Handwritten Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(episodes || []).map((ep) => (
                      <tr key={ep.id} className="border-b border-zinc-300 page-break-inside-avoid">
                        <td className="p-2 font-mono font-bold text-center border-r border-zinc-300">
                          {ep.partNumber}
                        </td>
                        <td className="p-2 border-r border-zinc-300 space-y-1">
                          <div className="font-bold text-zinc-950">{ep.title}</div>
                          <div className="text-[11px] text-zinc-600">
                            {ep.startPoint} ➔ {ep.endPoint}
                          </div>
                          {(ep.bossStrategies?.length || ep.keyItemsAndEspers?.length) ? (
                            <div className="text-[10px] space-y-0.5 pt-1 border-t border-zinc-200">
                              {ep.bossStrategies?.map((bs, i) => (
                                <label key={`b-${i}`} className="flex items-start gap-1 text-zinc-900 font-medium cursor-pointer">
                                  <input type="checkbox" className="mt-0.5 rounded border-zinc-400 shrink-0" />
                                  <span>⚔️ {bs}</span>
                                </label>
                              ))}
                              {ep.keyItemsAndEspers?.map((item, i) => (
                                <label key={`k-${i}`} className="flex items-start gap-1 text-zinc-900 font-medium cursor-pointer">
                                  <input type="checkbox" className="mt-0.5 rounded border-zinc-400 shrink-0" />
                                  <span>🎁 {item}</span>
                                </label>
                              ))}
                            </div>
                          ) : null}
                        </td>
                        <td className="p-2 border-r border-zinc-300 text-[11px] text-zinc-700 font-medium">
                          {ep.world}
                        </td>
                        <td className="p-2 border-r border-zinc-300 text-[10px] font-mono space-y-1">
                          <div className="flex justify-between items-center">
                            <span>[ ] REC</span>
                            <span>[ ] EDIT</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>[ ] UPLOAD</span>
                            <span>[ ] PUB</span>
                          </div>
                        </td>
                        <td className="p-2 min-w-[150px]">
                          <div className="border-b border-zinc-200 h-4"></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* LAYOUT MODE 3: BOSS & LOOT QUICK REFERENCE */}
            {layoutMode === "bosses" && (
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-1">
                  Boss Encounters & Key Items Reference
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {episodes.map((ep) => (
                    <div
                      key={ep.id}
                      className="border border-zinc-300 rounded-lg p-3 space-y-2 page-break-inside-avoid bg-zinc-50"
                    >
                      <div className="flex justify-between items-center border-b border-zinc-200 pb-1">
                        <span className="font-bold text-xs text-zinc-950">
                          EP {ep.partNumber}: {ep.shortTitle}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-600 bg-zinc-200 px-1.5 py-0.5 rounded">
                          {ep.world}
                        </span>
                      </div>

                      {ep.bossStrategies && ep.bossStrategies.length > 0 ? (
                        <div>
                          <div className="text-[10px] font-bold text-red-800 uppercase mb-1">Boss Encounters & Tactics:</div>
                          <ul className="text-xs text-zinc-800 space-y-1">
                            {ep.bossStrategies.map((bs, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <input type="checkbox" className="mt-0.5 rounded border-zinc-400 shrink-0 cursor-pointer" />
                                <span>{bs}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="text-xs italic text-zinc-500">No major boss encounters listed.</div>
                      )}

                      {ep.keyItemsAndEspers && ep.keyItemsAndEspers.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold text-amber-800 uppercase mb-1">Key Items / Loot Rewards:</div>
                          <ul className="text-xs text-zinc-800 space-y-1">
                            {ep.keyItemsAndEspers.map((item, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <input type="checkbox" className="mt-0.5 rounded border-zinc-400 shrink-0 cursor-pointer" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="border-t border-zinc-300 pt-3 text-center text-[10px] text-zinc-500 font-mono flex justify-between items-center">
              <span>{gameTitle} - YouTube Let's Play Studio Cheat Sheet</span>
              <span>Keep notes on physical prints or PDF tablets</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
