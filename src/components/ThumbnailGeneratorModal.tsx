import React, { useState, useRef, useEffect } from "react";
import { X, Image, Sparkles, Download, Check, RefreshCw, Layers, Wand2, Copy, Play, Upload, Link, Trash2, Minimize2, Maximize2 } from "lucide-react";
import { Episode, PlaythroughSeries } from "../types";
import { safeFetchJson } from "../utils/apiUtils";
import { exportSvgToPng } from "../utils/svgExport";

// Import pre-generated artwork assets
import narsheMagitek from "../assets/images/ff6_narshe_magitek_1786140670252.jpg";
import operaHouse from "../assets/images/ff6_opera_house_1786140680308.jpg";

interface ThumbnailGeneratorModalProps {
  episodes: Episode[];
  activeSeries?: PlaythroughSeries;
  defaultEpisodeId?: number;
  onClose: () => void;
  onApplyThumbnail?: (episodeId: number, thumbnailUrl: string) => void;
}

export const ThumbnailGeneratorModal: React.FC<ThumbnailGeneratorModalProps> = ({
  episodes,
  activeSeries,
  defaultEpisodeId,
  onClose,
  onApplyThumbnail,
}) => {
  const currentGameTitle = activeSeries?.gameTitle || "YouTube Gaming Series";
  const rawBadge = activeSeries?.badgeText;
  const defaultBadge =
    rawBadge &&
    currentGameTitle &&
    rawBadge.length === 1 &&
    currentGameTitle.length > 1 &&
    rawBadge.toUpperCase() === currentGameTitle.charAt(0).toUpperCase()
      ? currentGameTitle.toUpperCase()
      : rawBadge || currentGameTitle.toUpperCase();

  const [selectedEpId, setSelectedEpId] = useState<number>(
    defaultEpisodeId || episodes?.[0]?.id || 1
  );

  const selectedEpisode = (episodes || []).find((e) => e?.id === selectedEpId) || episodes?.[0];

  // Thumbnail overlay state
  const [mainTitle, setMainTitle] = useState<string>("");
  const [characterTag, setCharacterTag] = useState<string>("");
  const [badgeText, setBadgeText] = useState<string>(defaultBadge);
  const [accentColor, setAccentColor] = useState<string>(activeSeries?.accentColor || "#38bdf8");
  const [bgImageUrl, setBgImageUrl] = useState<string>(narsheMagitek);

  // Generation & Custom Image state
  const [promptText, setPromptText] = useState<string>("");
  const [generating, setGenerating] = useState<boolean>(false);
  const [genNote, setGenNote] = useState<string>("");
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [applied, setApplied] = useState<boolean>(false);
  const [customUrlInput, setCustomUrlInput] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Dynamic UI Overlay state & notification
  const [overlaySyncedNotification, setOverlaySyncedNotification] = useState<boolean>(false);

  // Dynamic UI Overlay Sync: Auto-pulls game title, part number, and episode theme colors
  const syncDynamicOverlay = () => {
    if (!selectedEpisode) return;
    const epTitle = selectedEpisode.thumbnailText || selectedEpisode.shortTitle || selectedEpisode.title;
    setMainTitle(epTitle);

    const badge = activeSeries?.badgeText || currentGameTitle.toUpperCase();
    setBadgeText(badge);

    const color = activeSeries?.accentColor || "#38bdf8";
    setAccentColor(color);

    const charName = selectedEpisode.title.includes("Terra")
      ? "TERRA"
      : selectedEpisode.title.includes("Celes") || selectedEpisode.title.includes("Opera")
      ? "CELES"
      : selectedEpisode.title.includes("Kefka")
      ? "KEFKA"
      : selectedEpisode.title.includes("Sabin")
      ? "SABIN"
      : selectedEpisode.bossStrategies?.[0] || selectedEpisode.partyMembers?.[0] || "16-BIT RPG";
    setCharacterTag(charName);

    setOverlaySyncedNotification(true);
    setTimeout(() => setOverlaySyncedNotification(false), 2500);
  };

  // Auto-update default prompt & overlay text when selected episode changes
  useEffect(() => {
    if (selectedEpisode) {
      syncDynamicOverlay();

      const defaultPrompt = `Gaming artwork for ${currentGameTitle}: ${selectedEpisode.title}. High resolution thumbnail background featuring ${selectedEpisode.startPoint}, key events: ${selectedEpisode.keyEvents?.join(", ")}, 16:9 aspect ratio.`;
      setPromptText(defaultPrompt);

      // Check if episode has custom image saved
      const existingCustom = selectedEpisode.thumbnailConfig?.customImage || selectedEpisode.suggestedThumbnailPrompt;
      if (existingCustom && (existingCustom.startsWith("data:image") || existingCustom.startsWith("http") || existingCustom.startsWith("blob:") || existingCustom.startsWith("/"))) {
        setBgImageUrl(existingCustom);
      } else if (selectedEpisode.title.toLowerCase().includes("opera") || selectedEpisode.title.toLowerCase().includes("celes")) {
        setBgImageUrl(operaHouse);
      } else {
        setBgImageUrl(narsheMagitek);
      }
    }
  }, [selectedEpId]);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setBgImageUrl(event.target.result as string);
        setGenNote("Custom thumbnail image uploaded successfully!");
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle custom URL submit
  const handleApplyCustomUrl = () => {
    if (customUrlInput.trim()) {
      setBgImageUrl(customUrlInput.trim());
      setGenNote("Custom image URL applied to background!");
      setCustomUrlInput("");
    }
  };

  // Handle generating background image via server API based on prompt
  const handleGenerateBgImage = async () => {
    setGenerating(true);
    setGenNote("");
    try {
      const activePrompt = promptText || selectedEpisode.suggestedThumbnailPrompt || `Gaming artwork for ${currentGameTitle}: ${selectedEpisode.title}`;
      const data = await safeFetchJson("/api/gemini/generate-thumbnail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptText: activePrompt,
          gameTitle: currentGameTitle,
          badgeText: badgeText || currentGameTitle,
          style: `${currentGameTitle} style, high resolution gaming thumbnail artwork, epic 16:9 wallpaper`,
        }),
      });
      if (data.imageUrl) {
        setBgImageUrl(data.imageUrl);
        syncDynamicOverlay();
        if (onApplyThumbnail && selectedEpisode) {
          onApplyThumbnail(selectedEpisode.id, data.imageUrl);
        }
        setGenNote(`✨ Dynamic UI Overlay Active: Synced "${currentGameTitle}", Part #${selectedEpisode.partNumber}, and theme color onto generated artwork!`);
      } else {
        throw new Error(data.error || "Failed to generate background image.");
      }
    } catch (err: any) {
      setGenNote(err.message || "Failed to generate artwork. Using fallback image.");
    } finally {
      setGenerating(false);
    }
  };

  const [exportingPng, setExportingPng] = useState(false);

  // Download SVG canvas as 1280x720 PNG
  const handleDownloadPng = async () => {
    if (!svgRef.current || !selectedEpisode) return;
    setExportingPng(true);
    try {
      const cleanTitle = currentGameTitle.replace(/[^a-zA-Z0-9]/g, "_");
      const filename = `${cleanTitle}_EP${selectedEpisode.partNumber}_Thumbnail_1280x720.png`;
      await exportSvgToPng(svgRef.current, filename, 1280, 720);
    } catch (err) {
      console.error("Download PNG error:", err);
    } finally {
      setExportingPng(false);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleApplyToEpisode = () => {
    if (onApplyThumbnail && selectedEpisode) {
      onApplyThumbnail(selectedEpisode.id, bgImageUrl);
      setApplied(true);
      setTimeout(() => setApplied(false), 2000);
    }
  };

  const [isMinimized, setIsMinimized] = useState(false);

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div
          onClick={() => setIsMinimized(false)}
          className="bg-[#121212] border-2 border-cyan-500/60 shadow-2xl rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:bg-[#18181b] transition-all group backdrop-blur-md"
          title="Click to restore Thumbnail Studio window"
        >
          <div className="p-2 bg-cyan-500/20 rounded-xl text-cyan-400 border border-cyan-500/30">
            <Image className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                1280x720
              </span>
              <span className="text-[10px] font-extrabold uppercase text-amber-300">
                Thumbnail Studio Minimized
              </span>
            </div>
            <p className="text-xs font-bold text-white line-clamp-1 max-w-[220px]">
              {mainTitle || "Custom Thumbnail Builder"}
            </p>
          </div>
          <div className="flex items-center gap-1.5 ml-2 border-l border-white/10 pl-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadPng();
              }}
              className="p-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              title="Download 1280x720 PNG"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
              title="Restore Window"
            >
              <Maximize2 className="w-4 h-4 text-cyan-300" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1.5 hover:bg-red-500/20 text-zinc-400 hover:text-red-300 rounded-lg transition-colors cursor-pointer"
              title="Close Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#121212] border border-white/10 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 bg-[#09090b] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Image className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">YouTube Thumbnail Studio</h2>
              <p className="text-xs text-zinc-400">Generate {currentGameTitle} background artwork & overlay episode badges for 1280x720 CTR optimization</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 text-cyan-300 hover:text-cyan-100 bg-cyan-950/50 hover:bg-cyan-900/80 rounded-lg transition-colors border border-cyan-500/30 flex items-center gap-1 text-xs font-bold cursor-pointer"
              title="Minimize Thumbnail Studio window to floating dock"
            >
              <Minimize2 className="w-4 h-4" />
              <span className="hidden sm:inline">Minimize</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white bg-[#18181b] hover:bg-[#27272a] rounded-lg transition-colors border border-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Episode Selection Bar */}
          <div className="bg-[#09090b] p-4 rounded-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1.5">
                Select Episode
              </label>
              <select
                value={selectedEpId}
                onChange={(e) => setSelectedEpId(Number(e.target.value))}
                className="w-full bg-[#18181b] border border-white/10 rounded-lg px-3.5 py-2 text-sm font-semibold text-zinc-100 outline-none focus:border-blue-400 transition-colors"
              >
                {episodes.map((ep) => (
                  <option key={ep.id} value={ep.id}>
                    EP {ep.partNumber < 10 ? `0${ep.partNumber}` : ep.partNumber}: {ep.title} ({ep.world})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2 md:pt-0">
              <button
                onClick={handleGenerateBgImage}
                disabled={generating}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold rounded-lg transition-all shadow-md shadow-blue-900/30 disabled:opacity-50"
              >
                {generating ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
                ) : (
                  <Wand2 className="w-4 h-4 text-cyan-300" />
                )}
                <span>{generating ? `Generating ${currentGameTitle} Art...` : `Generate ${currentGameTitle} Art`}</span>
              </button>
            </div>
          </div>

          {/* Dynamic UI Overlay System Banner */}
          <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/40 border border-cyan-500/30 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-cyan-300 uppercase tracking-wider text-[11px]">
                    ⚡ Dynamic UI Overlay System Active
                  </span>
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 px-1.5 py-0.2 rounded font-bold">
                    Auto-Bound
                  </span>
                  {overlaySyncedNotification && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.2 rounded font-bold animate-bounce">
                      ✨ Synced Canvas Overlay!
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-300">
                  Auto-pulling game title, episode part number, and active theme colors onto 1280x720 canvas
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-[#09090b]/80 px-2.5 py-1 rounded-lg border border-white/10 text-[11px]">
                <span className="text-zinc-400">Game Title:</span>
                <span className="font-bold text-amber-300 max-w-[120px] truncate" title={currentGameTitle}>{currentGameTitle}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#09090b]/80 px-2.5 py-1 rounded-lg border border-white/10 text-[11px]">
                <span className="text-zinc-400">Part #:</span>
                <span className="font-mono font-extrabold text-cyan-300">EP {selectedEpisode.partNumber < 10 ? `0${selectedEpisode.partNumber}` : selectedEpisode.partNumber}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#09090b]/80 px-2.5 py-1 rounded-lg border border-white/10 text-[11px]">
                <span className="text-zinc-400">Theme:</span>
                <span className="w-3 h-3 rounded-full border border-white/30" style={{ backgroundColor: accentColor }} />
                <span className="font-mono font-bold text-zinc-200">{accentColor}</span>
              </div>
              <button
                onClick={syncDynamicOverlay}
                className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/10"
                title="Re-pull game title, part number, and episode theme color into canvas overlay"
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sync Overlay</span>
              </button>
            </div>
          </div>

          {/* Prompt & Customization Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Prompting & Background Presets */}
            <div className="space-y-4">
              <div className="bg-[#18181b] p-4 rounded-xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    {currentGameTitle} AI Art Prompt
                  </span>
                  <button
                    onClick={handleCopyPrompt}
                    className="text-[11px] font-medium text-zinc-400 hover:text-white flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedPrompt ? "Copied!" : "Copy"}
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  className="w-full bg-[#09090b] border border-white/10 rounded-lg p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-400/50 resize-none font-mono"
                  placeholder={`Enter AI prompt for ${currentGameTitle}...`}
                />
                {genNote && (
                  <p className="text-[11px] text-blue-300 bg-blue-500/10 p-2 rounded border border-blue-500/20">
                    {genNote}
                  </p>
                )}
              </div>

              {/* Custom Image Upload & URL Section */}
              <div className="bg-[#18181b] p-4 rounded-xl border border-white/10 space-y-3">
                <span className="text-xs font-bold text-zinc-200 block flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  Add Custom Episode Thumbnail
                </span>

                <div className="space-y-2">
                  {/* File Upload Button */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>Upload Thumbnail File from Device</span>
                  </button>

                  {/* URL Input */}
                  <div className="flex gap-1.5">
                    <input
                      type="url"
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      placeholder="Or paste image URL (https://...)"
                      className="flex-1 bg-[#09090b] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-400 font-mono"
                    />
                    <button
                      onClick={handleApplyCustomUrl}
                      disabled={!customUrlInput.trim()}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold disabled:opacity-50 transition-colors"
                    >
                      <Link className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Preset Background Options */}
              <div className="bg-[#18181b] p-4 rounded-xl border border-white/10 space-y-3">
                <span className="text-xs font-bold text-zinc-200 block">
                  Quick Background Presets
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setBgImageUrl(narsheMagitek)}
                    className={`relative rounded-lg overflow-hidden border-2 aspect-video group transition-all ${
                      bgImageUrl === narsheMagitek ? "border-blue-400 ring-2 ring-blue-500/20" : "border-white/10 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={narsheMagitek} alt="Narshe Magitek" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <span className="absolute bottom-1 left-1 right-1 text-[10px] font-bold bg-black/80 text-white px-1.5 py-0.5 rounded text-center">
                      Narshe Magitek
                    </span>
                  </button>

                  <button
                    onClick={() => setBgImageUrl(operaHouse)}
                    className={`relative rounded-lg overflow-hidden border-2 aspect-video group transition-all ${
                      bgImageUrl === operaHouse ? "border-blue-400 ring-2 ring-blue-500/20" : "border-white/10 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={operaHouse} alt="Opera House" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <span className="absolute bottom-1 left-1 right-1 text-[10px] font-bold bg-black/80 text-white px-1.5 py-0.5 rounded text-center">
                      Opera Stage
                    </span>
                  </button>
                </div>
              </div>

              {/* Text Overlay Controls */}
              <div className="bg-[#18181b] p-4 rounded-xl border border-white/10 space-y-3">
                <span className="text-xs font-bold text-zinc-200 block">
                  Text & Badge Overlays
                </span>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">Main Thumbnail Title</label>
                  <input
                    type="text"
                    value={mainTitle}
                    onChange={(e) => setMainTitle(e.target.value)}
                    className="w-full bg-[#09090b] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Character Tag</label>
                    <input
                      type="text"
                      value={characterTag}
                      onChange={(e) => setCharacterTag(e.target.value)}
                      className="w-full bg-[#09090b] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Accent Theme</label>
                    <div className="flex items-center gap-1.5 mt-1">
                      {["#38bdf8", "#fbbf24", "#a855f7", "#22c55e", "#ef4444"].map((color) => (
                        <button
                          key={color}
                          onClick={() => setAccentColor(color)}
                          className={`w-6 h-6 rounded-full border-2 transition-transform ${
                            accentColor === color ? "scale-110 border-white ring-2 ring-blue-400" : "border-transparent opacity-80"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live 16:9 Thumbnail Canvas Preview */}
            <div className="lg:col-span-2 space-y-4 flex flex-col justify-between">
              <div className="bg-[#09090b] p-4 rounded-xl border border-white/10 flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
                    Live 16:9 Canvas Preview (1280x720 Export Standard)
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">1280 x 720 px</span>
                </div>

                {/* SVG Live Preview */}
                <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10 relative bg-black">
                  <svg
                    ref={svgRef}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1280 720"
                    className="w-full h-full"
                  >
                    <defs>
                      <linearGradient id="overlayGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#09090b" stopOpacity="0.95" />
                        <stop offset="40%" stopColor="#09090b" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#09090b" stopOpacity="0.1" />
                      </linearGradient>
                      <filter id="textShadow" x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow dx="3" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.9" />
                      </filter>
                      <filter id="glowAccent">
                        <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Background Image */}
                    <image
                      href={bgImageUrl}
                      x="0"
                      y="0"
                      width="1280"
                      height="720"
                      preserveAspectRatio="xMidYMid slice"
                    />

                    {/* Dark Vignette Overlay for Readability */}
                    <rect width="1280" height="720" fill="url(#overlayGrad)" />

                    {/* Retro Frame Border */}
                    <rect x="20" y="20" width="1240" height="680" fill="none" stroke={accentColor} strokeWidth="4" rx="12" opacity="0.8" />
                    <rect x="30" y="30" width="1220" height="660" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" rx="8" />

                    {/* Top Left Series Badge */}
                    <g transform="translate(60, 55)">
                      <rect x="0" y="0" width="300" height="44" rx="8" fill="#09090b" opacity="0.9" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                      <text x="150" y="27" fill="#f8fafc" fontSize="15" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="1.5" textAnchor="middle">
                        {badgeText}
                      </text>
                    </g>

                    {/* Top Right Episode Pill */}
                    <g transform="translate(1040, 55)">
                      <rect x="0" y="0" width="180" height="52" rx="10" fill={accentColor} />
                      <text x="90" y="34" fill="#09090b" fontSize="24" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="1" textAnchor="middle">
                        EP {selectedEpisode.partNumber < 10 ? `0${selectedEpisode.partNumber}` : selectedEpisode.partNumber}
                      </text>
                    </g>

                    {/* Center Right Character Callout */}
                    {characterTag && (
                      <g transform="translate(1000, 360)">
                        <circle cx="0" cy="0" r="110" fill={accentColor} opacity="0.15" filter="url(#glowAccent)" />
                        <text x="0" y="10" fill="#ffffff" fontSize="48" fontWeight="900" fontFamily="system-ui, sans-serif" textAnchor="middle" filter="url(#textShadow)">
                          {characterTag.toUpperCase()}
                        </text>
                        <text x="0" y="45" fill={accentColor} fontSize="16" fontWeight="800" fontFamily="system-ui, sans-serif" letterSpacing="2" textAnchor="middle">
                          LET'S PLAY
                        </text>
                      </g>
                    )}

                    {/* Bottom Title Text & Subtitle */}
                    <g transform="translate(60, 540)">
                      <text
                        x="0"
                        y="0"
                        fill="#ffffff"
                        fontSize="58"
                        fontWeight="900"
                        fontFamily="system-ui, sans-serif"
                        letterSpacing="0.5"
                        textAnchor="start"
                        filter="url(#textShadow)"
                      >
                        {mainTitle.slice(0, 32)}
                      </text>
                      <text
                        x="0"
                        y="52"
                        fill={accentColor}
                        fontSize="26"
                        fontWeight="800"
                        fontFamily="system-ui, sans-serif"
                        textAnchor="start"
                        filter="url(#textShadow)"
                      >
                        {selectedEpisode.world.toUpperCase()} • 1080P WALKTHROUGH
                      </text>
                    </g>

                    {/* Bottom Right Quality Badge */}
                    <g transform="translate(1080, 620)">
                      <rect x="0" y="0" width="140" height="40" rx="8" fill="#000000" opacity="0.85" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                      <text x="70" y="26" fill="#f8fafc" fontSize="14" fontWeight="800" fontFamily="system-ui, sans-serif" textAnchor="middle">
                        60 FPS HD
                      </text>
                    </g>
                  </svg>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={handleApplyToEpisode}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#18181b] hover:bg-[#27272a] text-zinc-200 font-semibold text-xs rounded-lg transition-colors border border-white/10"
                >
                  <Check className={`w-4 h-4 ${applied ? "text-emerald-400" : "text-blue-400"}`} />
                  <span>{applied ? "Thumbnail Saved to Episode!" : "Save Thumbnail to Episode"}</span>
                </button>

                <button
                  onClick={handleDownloadPng}
                  disabled={exportingPng}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-400 hover:bg-blue-300 text-zinc-950 font-bold text-xs rounded-lg transition-colors shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {exportingPng ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>{exportingPng ? "Preparing PNG..." : "Download 1280x720 PNG"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
