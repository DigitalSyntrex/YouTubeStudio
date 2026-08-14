import React, { useState, useRef, useEffect } from "react";
import { Episode, PlaythroughSeries, ThumbnailConfig } from "../types";
import { safeFetchJson } from "../utils/apiUtils";
import { exportSvgToPng } from "../utils/svgExport";
import {
  Sparkles,
  Download,
  RefreshCw,
  Layers,
  Palette,
  User,
  Type,
  AlertCircle,
  Upload,
  Link,
  Trash2,
  Move,
  Maximize2,
  RotateCw,
  Sliders,
  Check,
  ChevronDown,
  Layout,
  Eye,
  Shield,
  Box,
  Circle,
  Baseline,
} from "lucide-react";
import {
  getProtagonistForGame,
  getGameCharacterList,
  isCharacterValidForGame,
  getCharacterBadgeIcon,
  getHeroAvatarUrl,
} from "../utils/gameProtagonists";

interface ThumbnailBuilderProps {
  episode: Episode;
  activeSeries?: PlaythroughSeries;
  onUpdateConfig: (config: ThumbnailConfig) => void;
}

const BADGE_STYLES = [
  { id: "pill", label: "Rounded Pill", desc: "Classic Pill" },
  { id: "banner", label: "Slanted Banner", desc: "Action Banner" },
  { id: "box", label: "Sharp Box", desc: "Clean Rectangle" },
  { id: "shield", label: "RPG Shield", desc: "Fantasy Crest" },
  { id: "hexagon", label: "Cyber Hexagon", desc: "Sci-Fi Hex" },
  { id: "ribbon", label: "Notched Ribbon", desc: "Award Ribbon" },
  { id: "diamond", label: "Diamond Crest", desc: "Elite Diamond" },
  { id: "starburst", label: "CTR Starburst", desc: "High CTR Burst" },
  { id: "circle", label: "Round Emblem", desc: "Stamp Circle" },
  { id: "tag", label: "Chamfer Tag", desc: "Ticket Tag" },
];

const renderBadgeMiniPreview = (
  styleId: string,
  fillColor: string = "#eab308",
  textColor: string = "#020617"
) => {
  return (
    <svg viewBox="-10 -10 160 70" className="w-14 h-7 flex-shrink-0 drop-shadow">
      {styleId === "banner" ? (
        <path d="M 0 0 L 150 0 L 135 50 L 0 50 Z" fill={fillColor} />
      ) : styleId === "shield" ? (
        <path d="M 0 0 L 140 0 L 140 35 L 70 55 L 0 35 Z" fill={fillColor} />
      ) : styleId === "box" ? (
        <rect x="0" y="0" width="140" height="50" rx="2" fill={fillColor} />
      ) : styleId === "hexagon" ? (
        <path d="M 18 0 L 122 0 L 140 25 L 122 50 L 18 50 L 0 25 Z" fill={fillColor} />
      ) : styleId === "ribbon" ? (
        <path d="M 0 0 L 140 0 L 124 25 L 140 50 L 0 50 L 16 25 Z" fill={fillColor} />
      ) : styleId === "diamond" ? (
        <path d="M 70 -6 L 152 25 L 70 56 L -12 25 Z" fill={fillColor} />
      ) : styleId === "starburst" ? (
        <polygon points="70,-10 88,2 110,-5 112,18 135,18 126,40 142,55 118,60 110,80 88,72 70,82 52,72 30,80 22,60 -2,55 14,40 5,18 28,18 30,-5 52,2" fill={fillColor} />
      ) : styleId === "circle" ? (
        <circle cx="70" cy="25" r="34" fill={fillColor} />
      ) : styleId === "tag" ? (
        <path d="M 14 0 L 126 0 L 140 14 L 140 36 L 126 50 L 14 50 L 0 36 L 0 14 Z" fill={fillColor} />
      ) : (
        <rect x="0" y="0" width="140" height="50" rx="25" fill={fillColor} />
      )}
      <text x="70" y="33" fill={textColor} fontSize="22" fontWeight="900" textAnchor="middle">
        EP 01
      </text>
    </svg>
  );
};

export const ThumbnailBuilder: React.FC<ThumbnailBuilderProps> = ({
  episode,
  activeSeries,
  onUpdateConfig,
}) => {
  const currentGameTitle = activeSeries?.gameTitle || "YouTube Gaming Series";
  const rawBadge = activeSeries?.badgeText;
  const currentBadge =
    rawBadge &&
    currentGameTitle &&
    rawBadge.length === 1 &&
    currentGameTitle.length > 1 &&
    rawBadge.toUpperCase() === currentGameTitle.charAt(0).toUpperCase()
      ? currentGameTitle.toUpperCase()
      : rawBadge || currentGameTitle.toUpperCase();

  const initialChar = episode.thumbnailConfig?.featuredCharacter || "";
  const isInitialValid =
    initialChar &&
    isCharacterValidForGame(initialChar, currentGameTitle) &&
    !initialChar.toLowerCase().startsWith("hero of");
  const defaultChar = isInitialValid
    ? initialChar
    : episode.partyMembers && episode.partyMembers.length > 0 && !episode.partyMembers.includes("Main Player")
    ? episode.partyMembers[0]
    : getProtagonistForGame(currentGameTitle);

  const [config, setConfig] = useState<ThumbnailConfig>({
    backgroundPreset: episode.thumbnailConfig?.backgroundPreset || "narshe",
    featuredCharacter: defaultChar,
    overlayText:
      episode.thumbnailConfig.overlayText || episode.shortTitle.toUpperCase() || "EPISODE TITLE",
    subText: episode.thumbnailConfig.subText || `EPISODE ${episode.partNumber}`,
    themeColor: episode.thumbnailConfig.themeColor || activeSeries?.accentColor || "#eab308",
    showEpisodeBadge: episode.thumbnailConfig.showEpisodeBadge ?? true,
    showLogo: episode.thumbnailConfig.showLogo ?? true,
    showDuration: episode.thumbnailConfig.showDuration ?? true,
    customImage: episode.thumbnailConfig.customImage,

    // Title Positioning & Sizing Defaults
    titleX: episode.thumbnailConfig.titleX ?? 70,
    titleY: episode.thumbnailConfig.titleY ?? 480,
    titleFontSize: episode.thumbnailConfig.titleFontSize ?? 64,
    titleRotation: episode.thumbnailConfig.titleRotation ?? 0,
    titleFontFamily: episode.thumbnailConfig.titleFontFamily ?? "sans",
    titleStrokeWidth: episode.thumbnailConfig.titleStrokeWidth ?? 4,
    titleStrokeColor: episode.thumbnailConfig.titleStrokeColor ?? "#000000",
    titleColor: episode.thumbnailConfig.titleColor ?? "#ffffff",

    // Subtitle Positioning & Sizing Defaults
    subX: episode.thumbnailConfig.subX ?? 70,
    subY: episode.thumbnailConfig.subY ?? 545,
    subFontSize: episode.thumbnailConfig.subFontSize ?? 28,
    subRotation: episode.thumbnailConfig.subRotation ?? 0,
    subColor: episode.thumbnailConfig.subColor ?? (episode.thumbnailConfig.themeColor || "#eab308"),
    subFontFamily: episode.thumbnailConfig.subFontFamily ?? episode.thumbnailConfig.titleFontFamily ?? "sans",
    subStrokeWidth: episode.thumbnailConfig.subStrokeWidth ?? 0,
    subStrokeColor: episode.thumbnailConfig.subStrokeColor ?? "#000000",

    // Episode Badge Positioning & Sizing Defaults
    badgeX: episode.thumbnailConfig.badgeX ?? 1080,
    badgeY: episode.thumbnailConfig.badgeY ?? 65,
    badgeScale: episode.thumbnailConfig.badgeScale ?? 1.0,
    badgeStyle: episode.thumbnailConfig.badgeStyle ?? "pill",
    badgeColor: episode.thumbnailConfig.badgeColor || episode.thumbnailConfig.themeColor || activeSeries?.accentColor || "#eab308",
    badgeTextColor: episode.thumbnailConfig.badgeTextColor || "#020617",

    // Character Graphic Positioning & Sizing Defaults
    charX: episode.thumbnailConfig.charX ?? 900,
    charY: episode.thumbnailConfig.charY ?? 380,
    charScale: episode.thumbnailConfig.charScale ?? 1.0,

    // Frame & Dark Overlay
    overlayOpacity: episode.thumbnailConfig.overlayOpacity ?? 0.35,
    frameStyle: episode.thumbnailConfig.frameStyle ?? "snes",
  });

  const [activeTab, setActiveTab] = useState<
    "layout" | "text" | "badge" | "hero" | "art" | "theme"
  >("layout");
  const [activeTextSubTab, setActiveTextSubTab] = useState<
    "title" | "sub" | "presets" | "all"
  >("all");
  const [selectedElement, setSelectedElement] = useState<
    "title" | "sub" | "badge" | "char" | null
  >(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [elementStartPos, setElementStartPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [exportingPng, setExportingPng] = useState(false);
  const [isBadgeDropdownOpen, setIsBadgeDropdownOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const badgeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        badgeDropdownRef.current &&
        !badgeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsBadgeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [overlaySyncedNotification, setOverlaySyncedNotification] = useState<boolean>(false);

  // Dynamic UI Overlay Sync: Auto-pulls game title, part number, and episode theme color
  const syncDynamicOverlay = (overrideChanges?: Partial<ThumbnailConfig>) => {
    const epThemeColor = activeSeries?.accentColor || episode.thumbnailConfig?.themeColor || "#eab308";
    const epPartNumStr = `EPISODE ${episode.partNumber < 10 ? "0" + episode.partNumber : episode.partNumber}`;
    const epTitleText = episode.thumbnailConfig?.overlayText || episode.shortTitle?.toUpperCase() || episode.title?.toUpperCase();

    const overlayUpdates: Partial<ThumbnailConfig> = {
      themeColor: epThemeColor,
      subColor: epThemeColor,
      badgeColor: epThemeColor,
      subText: epPartNumStr,
      overlayText: epTitleText,
      badgeTextColor: "#020617",
      ...overrideChanges,
    };

    handleMultipleChanges(overlayUpdates);
    setOverlaySyncedNotification(true);
    setTimeout(() => setOverlaySyncedNotification(false), 3000);
  };

  useEffect(() => {
    // Auto-sync dynamic overlay upon episode load/change
    const epThemeColor = activeSeries?.accentColor || episode.thumbnailConfig?.themeColor || "#eab308";
    const epPartNumStr = `EPISODE ${episode.partNumber < 10 ? "0" + episode.partNumber : episode.partNumber}`;
    const epTitleText = episode.thumbnailConfig?.overlayText || episode.shortTitle?.toUpperCase() || episode.title?.toUpperCase();

    handleMultipleChanges({
      themeColor: config.themeColor || epThemeColor,
      subColor: config.subColor || epThemeColor,
      badgeColor: config.badgeColor || epThemeColor,
      subText: config.subText || epPartNumStr,
      overlayText: config.overlayText || epTitleText,
    });
  }, [episode.id, activeSeries?.id]);

  const handleTextChange = (key: keyof ThumbnailConfig, value: any) => {
    const updated = { ...config, [key]: value };
    setConfig(updated);
    onUpdateConfig(updated);
  };

  const handleMultipleChanges = (changes: Partial<ThumbnailConfig>) => {
    const updated = { ...config, ...changes };
    setConfig(updated);
    onUpdateConfig(updated);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        handleTextChange("customImage", event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      handleTextChange("customImage", urlInput.trim());
      setUrlInput("");
    }
  };

  // Convert Mouse Event to SVG 1280x720 Canvas Coordinates
  const getSvgCoordinates = (e: React.MouseEvent<SVGSVGElement> | MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = 1280 / rect.width;
    const scaleY = 720 / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // Start dragging on Canvas
  const handleMouseDownOnElement = (
    elementType: "title" | "sub" | "badge" | "char",
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setSelectedElement(elementType);
    setIsDragging(true);

    if (elementType === "title") {
      setActiveTab("text");
      setActiveTextSubTab("title");
    } else if (elementType === "sub") {
      setActiveTab("text");
      setActiveTextSubTab("sub");
    } else if (elementType === "badge") {
      setActiveTab("badge");
    } else if (elementType === "char") {
      setActiveTab("hero");
    }

    const svgCoords = getSvgCoordinates(e);
    setDragStart(svgCoords);

    if (elementType === "title") {
      setElementStartPos({ x: config.titleX ?? 70, y: config.titleY ?? 480 });
    } else if (elementType === "sub") {
      setElementStartPos({ x: config.subX ?? 70, y: config.subY ?? 545 });
    } else if (elementType === "badge") {
      setElementStartPos({ x: config.badgeX ?? 1080, y: config.badgeY ?? 65 });
    } else if (elementType === "char") {
      setElementStartPos({ x: config.charX ?? 900, y: config.charY ?? 380 });
    }
  };

  const handleMouseMoveOnCanvas = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging || !selectedElement) return;
    const currentSvgPos = getSvgCoordinates(e);
    const dx = Math.round(currentSvgPos.x - dragStart.x);
    const dy = Math.round(currentSvgPos.y - dragStart.y);

    const newX = Math.max(-100, Math.min(1380, elementStartPos.x + dx));
    const newY = Math.max(-100, Math.min(820, elementStartPos.y + dy));

    if (selectedElement === "title") {
      handleMultipleChanges({ titleX: newX, titleY: newY });
    } else if (selectedElement === "sub") {
      handleMultipleChanges({ subX: newX, subY: newY });
    } else if (selectedElement === "badge") {
      handleMultipleChanges({ badgeX: newX, badgeY: newY });
    } else if (selectedElement === "char") {
      handleMultipleChanges({ charX: newX, charY: newY });
    }
  };

  const handleMouseUpCanvas = () => {
    setIsDragging(false);
  };

  const generateAiThumbnail = async () => {
    setLoadingAi(true);
    setAiError(null);
    try {
      const data = await safeFetchJson("/api/gemini/generate-thumbnail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameTitle: currentGameTitle,
          badgeText: currentBadge,
          promptText: `${config.featuredCharacter} in ${config.backgroundPreset} environment, ${episode.title}`,
          style: "High contrast YouTube gaming thumbnail artwork",
        }),
      });
      if (data.imageUrl) {
        handleTextChange("customImage", data.imageUrl);
        syncDynamicOverlay({ customImage: data.imageUrl });
        if (data.isFallback) {
          setAiError(`⚡ Dynamic UI Overlay Applied! Synced "${currentGameTitle}", Part #${episode.partNumber}, & theme color.`);
        }
      } else {
        throw new Error(data.error || "Failed to generate thumbnail image");
      }
    } catch (err: any) {
      setAiError(err.message || "Error generating AI image");
    } finally {
      setLoadingAi(false);
    }
  };

  const autoGenerateEpisodeBackground = async () => {
    setLoadingAi(true);
    setAiError(null);
    try {
      const promptText = `${currentGameTitle} - Episode ${episode.partNumber}: ${
        episode.shortTitle || episode.title
      } in ${episode.world}. Hero: ${config.featuredCharacter}. Key events: ${
        episode.keyEvents?.slice(0, 2).join(", ") || "Epic gaming moment"
      }`;

      const data = await safeFetchJson("/api/gemini/generate-thumbnail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameTitle: currentGameTitle,
          badgeText: currentBadge,
          promptText: promptText,
          style:
            "Ultra high resolution cinematic 16:9 YouTube thumbnail background wallpaper with dramatic high-contrast lighting, vivid gaming aesthetic, epic boss fight aura",
        }),
      });
      if (data.imageUrl) {
        handleTextChange("customImage", data.imageUrl);
        syncDynamicOverlay({ customImage: data.imageUrl });
        if (data.isFallback) {
          setAiError(`⚡ Dynamic UI Overlay Applied! Synced "${currentGameTitle}", Part #${episode.partNumber}, & theme color.`);
        }
      } else {
        throw new Error(data.error || "Failed to generate background image");
      }
    } catch (err: any) {
      setAiError(err.message || "Error generating background image");
    } finally {
      setLoadingAi(false);
    }
  };

  const downloadSvgAsPng = async () => {
    if (!svgRef.current) return;
    setExportingPng(true);
    setAiError(null);
    try {
      const cleanTitle = currentGameTitle.replace(/[^a-zA-Z0-9]/g, "_");
      const epNum = episode.partNumber < 10 ? `0${episode.partNumber}` : episode.partNumber;
      const filename = `${cleanTitle}_EP${epNum}_Thumbnail_1280x720.png`;
      await exportSvgToPng(svgRef.current, filename, 1280, 720);
    } catch (err: any) {
      console.error("PNG export error:", err);
      setAiError(err.message || "Failed to export 1280x720 PNG");
    } finally {
      setExportingPng(false);
    }
  };

  // Font family resolution for SVG text
  const getFontFamilyCss = (fontFamilyKey?: string) => {
    switch (fontFamilyKey) {
      case "bebas":
        return "'Bebas Neue', 'Oswald', 'Trebuchet MS', sans-serif";
      case "impact":
        return "Impact, 'Arial Black', 'Trebuchet MS', sans-serif";
      case "anton":
        return "'Anton', 'Arial Black', sans-serif";
      case "cinematic":
        return "'Cinzel', 'Trajan Pro', Georgia, serif";
      case "serif":
        return "'Playfair Display', Georgia, 'Times New Roman', serif";
      case "futuristic":
        return "'Orbitron', 'Chakra Petch', 'Rajdhani', sans-serif";
      case "comic":
        return "'Bangers', 'Comic Sans MS', 'Chalkboard SE', cursive";
      case "brush":
        return "'Permanent Marker', 'Rock Salt', 'Brush Script MT', cursive";
      case "display":
        return "'Fredoka', 'Comfortaa', 'Outfit', sans-serif";
      case "mono":
        return "'Courier New', Courier, monospace";
      case "sans":
      default:
        return "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
    }
  };

  // Preset Layout Templates
  const applyLayoutPreset = (
    preset:
      | "bottom_left"
      | "center_punch"
      | "top_left"
      | "diagonal"
      | "split"
      | "immersive"
      | "boss_fight"
      | "lore_book"
      | "minimal_clean"
  ) => {
    switch (preset) {
      case "immersive":
        handleMultipleChanges({
          titleX: 640,
          titleY: 390,
          titleFontSize: 82,
          titleRotation: 0,
          titleFontFamily: "cinematic",
          titleColor: "#ffffff",
          titleStrokeColor: "#000000",
          titleStrokeWidth: 6,
          subX: 640,
          subY: 475,
          subFontSize: 30,
          subRotation: 0,
          subColor: "#fef08a",
          subStrokeColor: "#000000",
          subStrokeWidth: 4,
          badgeX: 640,
          badgeY: 75,
          badgeStyle: "shield",
          badgeColor: "#eab308",
          badgeTextColor: "#020617",
          charX: 640,
          charY: 590,
          charScale: 0.85,
          frameStyle: "gold_rpg",
          overlayOpacity: 0.45,
        });
        break;
      case "boss_fight":
        handleMultipleChanges({
          titleX: 640,
          titleY: 210,
          titleFontSize: 88,
          titleRotation: 0,
          titleFontFamily: "impact",
          titleColor: "#ef4444",
          titleStrokeColor: "#000000",
          titleStrokeWidth: 8,
          subX: 640,
          subY: 290,
          subFontSize: 34,
          subRotation: 0,
          subColor: "#f97316",
          subStrokeColor: "#000000",
          subStrokeWidth: 4,
          badgeX: 1100,
          badgeY: 75,
          badgeStyle: "starburst",
          badgeColor: "#ef4444",
          badgeTextColor: "#ffffff",
          charX: 640,
          charY: 480,
          charScale: 1.15,
          frameStyle: "boss_flame",
          overlayOpacity: 0.5,
        });
        break;
      case "lore_book":
        handleMultipleChanges({
          titleX: 80,
          titleY: 220,
          titleFontSize: 70,
          titleRotation: 0,
          titleFontFamily: "serif",
          titleColor: "#fef08a",
          titleStrokeColor: "#0f172a",
          titleStrokeWidth: 4,
          subX: 80,
          subY: 285,
          subFontSize: 28,
          subRotation: 0,
          subColor: "#e2e8f0",
          subStrokeColor: "#000000",
          subStrokeWidth: 2,
          badgeX: 1100,
          badgeY: 75,
          badgeStyle: "ribbon",
          badgeColor: "#ca8a04",
          badgeTextColor: "#ffffff",
          charX: 920,
          charY: 420,
          charScale: 1.1,
          frameStyle: "gold_rpg",
          overlayOpacity: 0.4,
        });
        break;
      case "minimal_clean":
        handleMultipleChanges({
          titleX: 640,
          titleY: 580,
          titleFontSize: 68,
          titleRotation: 0,
          titleFontFamily: "sans",
          titleColor: "#ffffff",
          titleStrokeColor: "#000000",
          titleStrokeWidth: 4,
          subX: 640,
          subY: 645,
          subFontSize: 24,
          subRotation: 0,
          subColor: "#38bdf8",
          subStrokeColor: "#000000",
          subStrokeWidth: 2,
          badgeX: 640,
          badgeY: 60,
          badgeStyle: "pill",
          badgeColor: "#38bdf8",
          badgeTextColor: "#020617",
          charX: 640,
          charY: 300,
          charScale: 0.95,
          frameStyle: "minimal",
          overlayOpacity: 0.3,
        });
        break;
      case "bottom_left":
        handleMultipleChanges({
          titleX: 70,
          titleY: 480,
          titleFontSize: 64,
          titleRotation: 0,
          subX: 70,
          subY: 550,
          subFontSize: 28,
          subRotation: 0,
          badgeX: 1080,
          badgeY: 65,
          charX: 900,
          charY: 380,
          charScale: 1.0,
        });
        break;
      case "center_punch":
        handleMultipleChanges({
          titleX: 640,
          titleY: 360,
          titleFontSize: 80,
          titleRotation: -3,
          subX: 640,
          subY: 440,
          subFontSize: 34,
          subRotation: -3,
          badgeX: 640,
          badgeY: 100,
          charX: 640,
          charY: 580,
          charScale: 0.8,
        });
        break;
      case "top_left":
        handleMultipleChanges({
          titleX: 70,
          titleY: 160,
          titleFontSize: 72,
          titleRotation: 0,
          subX: 70,
          subY: 230,
          subFontSize: 30,
          subRotation: 0,
          badgeX: 1080,
          badgeY: 650,
          charX: 920,
          charY: 450,
          charScale: 1.1,
        });
        break;
      case "diagonal":
        handleMultipleChanges({
          titleX: 100,
          titleY: 460,
          titleFontSize: 76,
          titleRotation: -7,
          subX: 120,
          subY: 540,
          subFontSize: 32,
          subRotation: -7,
          badgeX: 1050,
          badgeY: 80,
          charX: 880,
          charY: 340,
          charScale: 1.25,
        });
        break;
      case "split":
        handleMultipleChanges({
          titleX: 80,
          titleY: 380,
          titleFontSize: 60,
          titleRotation: 0,
          subX: 80,
          subY: 445,
          subFontSize: 26,
          subRotation: 0,
          badgeX: 80,
          badgeY: 70,
          charX: 960,
          charY: 360,
          charScale: 1.3,
        });
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic UI Overlay System Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-blue-950/40 border border-amber-500/30 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-amber-300 uppercase tracking-wider text-[11px]">
                ⚡ Dynamic UI Overlay System Active
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-200 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold">
                Auto-Bound
              </span>
              {overlaySyncedNotification && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.2 rounded font-bold animate-bounce">
                  ✨ Synced Canvas Overlay!
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-300">
              Auto-pulling game title, episode part number, and series theme colors into canvas overlays upon generation
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px]">
            <span className="text-slate-400">Game:</span>
            <span className="font-bold text-amber-300 max-w-[120px] truncate" title={currentGameTitle}>{currentGameTitle}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px]">
            <span className="text-slate-400">Part #:</span>
            <span className="font-mono font-extrabold text-cyan-300">EP {episode.partNumber < 10 ? `0${episode.partNumber}` : episode.partNumber}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px]">
            <span className="text-slate-400">Theme:</span>
            <span className="w-3 h-3 rounded-full border border-white/30" style={{ backgroundColor: config.themeColor || activeSeries?.accentColor || "#eab308" }} />
            <span className="font-mono font-bold text-slate-200">{config.themeColor || activeSeries?.accentColor || "#eab308"}</span>
          </div>
          <button
            onClick={() => syncDynamicOverlay()}
            className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/10"
            title="Re-pull game title, part number, and theme colors into thumbnail overlays"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Sync Dynamic Overlay</span>
          </button>
        </div>
      </div>

      {/* Visual 16:9 Interactive SVG Canvas Preview */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
          <span className="flex items-center gap-1.5 font-bold text-amber-400">
            <Move className="w-3.5 h-3.5" />
            <span>Interactive Canvas Preview (Click & Drag elements or use Sliders below)</span>
          </span>
          <span className="text-[11px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono">
            Selected: <strong className="text-amber-300 uppercase">{selectedElement || "None"}</strong>
          </span>
        </div>

        <div className="relative group bg-black rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl aspect-video w-full select-none">
          {config.customImage && (
            <button
              onClick={() => handleTextChange("customImage", undefined)}
              className="absolute top-3 right-3 z-20 bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs px-2.5 py-1 rounded shadow-lg border border-red-400/30 transition-all cursor-pointer"
            >
              Reset Graphic Mode
            </button>
          )}

          <svg
            ref={svgRef}
            viewBox="0 0 1280 720"
            className="w-full h-full object-contain cursor-crosshair"
            xmlns="http://www.w3.org/2000/svg"
            onMouseMove={handleMouseMoveOnCanvas}
            onMouseUp={handleMouseUpCanvas}
            onMouseLeave={handleMouseUpCanvas}
            onClick={() => setSelectedElement(null)}
          >
            <defs>
              <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="50%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>

              <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.95" />
              </filter>

              <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <clipPath id="heroCircleClip">
                <circle cx="0" cy="0" r="140" />
              </clipPath>
            </defs>

            {/* Background Image / Preset */}
            {config.customImage ? (
              <>
                <image
                  href={config.customImage}
                  x="0"
                  y="0"
                  width="1280"
                  height="720"
                  preserveAspectRatio="xMidYMid slice"
                />
                <rect width="1280" height="720" fill="#000000" opacity={config.overlayOpacity ?? 0.35} />
              </>
            ) : (
              <>
                <rect width="1280" height="720" fill="url(#bgGrad)" />
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                </pattern>
                <rect width="1280" height="720" fill="url(#grid)" />
                <rect width="1280" height="720" fill="#000000" opacity={config.overlayOpacity ?? 0.15} />
              </>
            )}

            {/* Frame Styles */}
            {config.frameStyle === "snes" && (
              <>
                <rect
                  x="24"
                  y="24"
                  width="1232"
                  height="672"
                  fill="none"
                  stroke={config.themeColor}
                  strokeWidth="6"
                  rx="12"
                  opacity="0.85"
                />
                <rect
                  x="36"
                  y="36"
                  width="1208"
                  height="648"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  rx="8"
                  opacity="0.35"
                />
                <circle cx="30" cy="30" r="3" fill="#94a3b8" />
                <circle cx="1250" cy="30" r="3" fill="#94a3b8" />
                <circle cx="30" cy="690" r="3" fill="#94a3b8" />
                <circle cx="1250" cy="690" r="3" fill="#94a3b8" />
              </>
            )}

            {config.frameStyle === "neon" && (
              <>
                <rect
                  x="20"
                  y="20"
                  width="1240"
                  height="680"
                  fill="none"
                  stroke={config.themeColor}
                  strokeWidth="8"
                  rx="16"
                  filter="url(#glow)"
                />
                <rect
                  x="12"
                  y="12"
                  width="1256"
                  height="696"
                  fill="none"
                  stroke={config.themeColor}
                  strokeWidth="2"
                  rx="20"
                  opacity="0.6"
                />
              </>
            )}

            {config.frameStyle === "minimal" && (
              <>
                <rect
                  x="30"
                  y="30"
                  width="1220"
                  height="660"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  opacity="0.6"
                />
                <path d="M 22 30 L 38 30 M 30 22 L 30 38" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
                <path d="M 1242 30 L 1258 30 M 1250 22 L 1250 38" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
                <path d="M 22 690 L 38 690 M 30 682 L 30 698" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
                <path d="M 1242 690 L 1258 690 M 1250 682 L 1250 698" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
              </>
            )}

            {config.frameStyle === "gold_rpg" && (
              <>
                <rect
                  x="18"
                  y="18"
                  width="1244"
                  height="684"
                  fill="none"
                  stroke="#fef08a"
                  strokeWidth="3"
                  rx="4"
                />
                <rect
                  x="26"
                  y="26"
                  width="1228"
                  height="668"
                  fill="none"
                  stroke="#eab308"
                  strokeWidth="6"
                  rx="2"
                />
                <rect
                  x="36"
                  y="36"
                  width="1208"
                  height="648"
                  fill="none"
                  stroke="#854d0e"
                  strokeWidth="2"
                />
                <g fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5">
                  <polygon points="26,12 40,26 26,40 12,26" />
                  <polygon points="1254,12 1268,26 1254,40 1240,26" />
                  <polygon points="26,680 40,694 26,708 12,694" />
                  <polygon points="1254,680 1268,694 1254,708 1240,694" />
                </g>
              </>
            )}

            {config.frameStyle === "cyber_glitch" && (
              <>
                <g stroke="#38bdf8" strokeWidth="4" fill="none">
                  <path d="M 16 65 L 16 16 L 65 16" />
                  <path d="M 1215 16 L 1264 16 L 1264 65" />
                  <path d="M 16 655 L 16 704 L 65 704" />
                  <path d="M 1215 704 L 1264 704 L 1264 655" />
                </g>
                <g stroke="#f43f5e" strokeWidth="2" fill="none" opacity="0.8">
                  <path d="M 28 85 L 28 28 L 85 28" />
                  <path d="M 1195 28 L 1252 28 L 1252 85" />
                  <path d="M 28 635 L 28 692 L 85 692" />
                  <path d="M 1195 692 L 1252 692 L 1252 635" />
                </g>
                <line x1="640" y1="12" x2="640" y2="28" stroke="#38bdf8" strokeWidth="3" />
                <line x1="640" y1="692" x2="640" y2="708" stroke="#38bdf8" strokeWidth="3" />
                <line x1="12" y1="360" x2="28" y2="360" stroke="#38bdf8" strokeWidth="3" />
                <line x1="1252" y1="360" x2="1268" y2="360" stroke="#38bdf8" strokeWidth="3" />
              </>
            )}

            {config.frameStyle === "anime_speed" && (
              <>
                <rect x="15" y="15" width="1250" height="690" fill="none" stroke="#ef4444" strokeWidth="4" />
                <g stroke="#f8fafc" strokeWidth="2.5" opacity="0.75">
                  <line x1="0" y1="0" x2="120" y2="120" />
                  <line x1="0" y1="40" x2="100" y2="140" />
                  <line x1="40" y1="0" x2="140" y2="100" />

                  <line x1="1280" y1="0" x2="1160" y2="120" />
                  <line x1="1280" y1="40" x2="1180" y2="140" />
                  <line x1="1240" y1="0" x2="1140" y2="100" />

                  <line x1="0" y1="720" x2="120" y2="600" />
                  <line x1="1280" y1="720" x2="1160" y2="600" />
                </g>
              </>
            )}

            {config.frameStyle === "vintage_crt" && (
              <>
                <rect x="0" y="0" width="1280" height="720" fill="none" stroke="#0f172a" strokeWidth="24" rx="20" />
                <rect x="12" y="12" width="1256" height="696" fill="none" stroke="#334155" strokeWidth="8" rx="16" />
                <rect x="20" y="20" width="1240" height="680" fill="none" stroke="#000000" strokeWidth="4" rx="12" opacity="0.8" />
                <circle cx="1235" cy="695" r="5" fill="#22c55e" filter="url(#glow)" />
              </>
            )}

            {config.frameStyle === "boss_flame" && (
              <>
                <rect x="12" y="12" width="1256" height="696" fill="none" stroke="#ef4444" strokeWidth="6" rx="12" filter="url(#glow)" />
                <rect x="24" y="24" width="1232" height="672" fill="none" stroke="#f97316" strokeWidth="3" rx="8" />
                <g fill="#ef4444" opacity="0.8">
                  <circle cx="28" cy="28" r="8" filter="url(#glow)" />
                  <circle cx="1252" cy="28" r="8" filter="url(#glow)" />
                  <circle cx="28" cy="692" r="8" filter="url(#glow)" />
                  <circle cx="1252" cy="692" r="8" filter="url(#glow)" />
                </g>
              </>
            )}

            {config.frameStyle === "double_line" && (
              <>
                <rect x="16" y="16" width="1248" height="688" fill="none" stroke={config.themeColor || "#eab308"} strokeWidth="6" rx="10" />
                <rect x="28" y="28" width="1224" height="664" fill="none" stroke={config.themeColor || "#eab308"} strokeWidth="2" rx="6" opacity="0.8" />
                <g fill={config.themeColor || "#eab308"}>
                  <rect x="10" y="10" width="12" height="12" rx="2" />
                  <rect x="1258" y="10" width="12" height="12" rx="2" />
                  <rect x="10" y="698" width="12" height="12" rx="2" />
                  <rect x="1258" y="698" width="12" height="12" rx="2" />
                </g>
              </>
            )}

            {config.frameStyle === "gradient_glow" && (
              <>
                <rect x="14" y="14" width="1252" height="692" fill="none" stroke={config.themeColor || "#eab308"} strokeWidth="10" rx="18" filter="url(#glow)" />
                <rect x="26" y="26" width="1228" height="668" fill="none" stroke="#38bdf8" strokeWidth="3" rx="12" opacity="0.85" />
                <circle cx="28" cy="28" r="10" fill={config.themeColor || "#eab308"} filter="url(#glow)" />
                <circle cx="1252" cy="28" r="10" fill="#38bdf8" filter="url(#glow)" />
                <circle cx="28" cy="692" r="10" fill="#38bdf8" filter="url(#glow)" />
                <circle cx="1252" cy="692" r="10" fill={config.themeColor || "#eab308"} filter="url(#glow)" />
              </>
            )}

            {config.frameStyle === "tech_corner" && (
              <>
                <g stroke="#38bdf8" strokeWidth="3.5" fill="none">
                  <path d="M 12 70 L 12 12 L 120 12" />
                  <path d="M 1160 12 L 1268 12 L 1268 70" />
                  <path d="M 12 650 L 12 708 L 120 708" />
                  <path d="M 1160 708 L 1268 708 L 1268 650" />
                </g>
                <g stroke="#38bdf8" strokeWidth="1.5" opacity="0.6">
                  <line x1="640" y1="8" x2="640" y2="28" />
                  <line x1="640" y1="692" x2="640" y2="712" />
                  <line x1="8" y1="360" x2="28" y2="360" />
                  <line x1="1252" y1="360" x2="1272" y2="360" />
                </g>
                <text x="32" y="32" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold" opacity="0.8">
                  SYS.720p // HIGH-CTR
                </text>
                <text x="1170" y="32" fill="#38bdf8" fontSize="11" fontFamily="monospace" fontWeight="bold" opacity="0.8">
                  REC.LIVE
                </text>
              </>
            )}

            {config.frameStyle === "comic_action" && (
              <>
                <rect x="10" y="10" width="1260" height="700" fill="none" stroke="#000000" strokeWidth="16" />
                <rect x="22" y="22" width="1236" height="676" fill="none" stroke="#facc15" strokeWidth="6" />
                <g fill="#000000">
                  <polygon points="10,10 60,10 10,60" />
                  <polygon points="1270,10 1220,10 1270,60" />
                  <polygon points="10,710 60,710 10,660" />
                  <polygon points="1270,710 1220,710 1270,660" />
                </g>
              </>
            )}

            {config.frameStyle === "royal_crest" && (
              <>
                <rect x="16" y="16" width="1248" height="688" fill="none" stroke="#fef08a" strokeWidth="4" rx="4" />
                <rect x="24" y="24" width="1232" height="672" fill="none" stroke="#ca8a04" strokeWidth="2" />
                <g fill="#eab308" stroke="#ca8a04" strokeWidth="1.5">
                  <path d="M 16 16 L 50 16 L 33 33 L 16 50 Z" />
                  <path d="M 1264 16 L 1230 16 L 1247 33 L 1264 50 Z" />
                  <path d="M 16 704 L 50 704 L 33 687 L 16 670 Z" />
                  <path d="M 1264 704 L 1230 704 L 1247 687 L 1264 670 Z" />
                </g>
                <circle cx="33" cy="33" r="6" fill="#ef4444" />
                <circle cx="1247" cy="33" r="6" fill="#ef4444" />
                <circle cx="33" cy="687" r="6" fill="#ef4444" />
                <circle cx="1247" cy="687" r="6" fill="#ef4444" />
              </>
            )}

            {config.frameStyle === "arcadium" && (
              <>
                <rect x="12" y="12" width="1256" height="696" fill="none" stroke="#ec4899" strokeWidth="6" rx="12" filter="url(#glow)" />
                <rect x="22" y="22" width="1236" height="676" fill="none" stroke="#06b6d4" strokeWidth="3" rx="8" />
                <g fill="#f43f5e">
                  <circle cx="30" cy="30" r="6" />
                  <circle cx="1250" cy="30" r="6" />
                  <circle cx="30" cy="690" r="6" />
                  <circle cx="1250" cy="690" r="6" />
                </g>
              </>
            )}

            {config.frameStyle === "polaroid_card" && (
              <>
                <rect x="0" y="0" width="1280" height="720" fill="none" stroke="#09090b" strokeWidth="32" />
                <rect x="24" y="24" width="1232" height="672" fill="none" stroke="#27272a" strokeWidth="4" />
                <g fill="#a1a1aa">
                  <circle cx="40" cy="40" r="5" />
                  <circle cx="1240" cy="40" r="5" />
                  <circle cx="40" cy="680" r="5" />
                  <circle cx="1240" cy="680" r="5" />
                </g>
              </>
            )}

            {config.frameStyle === "cyber_circuit" && (
              <>
                <rect x="14" y="14" width="1252" height="692" fill="none" stroke="#06b6d4" strokeWidth="4" rx="6" />
                <rect x="24" y="24" width="1232" height="672" fill="none" stroke="#10b981" strokeWidth="1.5" rx="4" strokeDasharray="12 6" />
                <g stroke="#06b6d4" strokeWidth="2" fill="none">
                  <path d="M 14 60 L 50 60 L 70 80 L 140 80" />
                  <path d="M 1266 60 L 1230 60 L 1210 80 L 1140 80" />
                  <path d="M 14 660 L 50 660 L 70 640 L 140 640" />
                  <path d="M 1266 660 L 1230 660 L 1210 640 L 1140 640" />
                  <path d="M 600 14 L 600 40 L 620 50 L 680 50" />
                  <path d="M 600 706 L 600 680 L 620 670 L 680 670" />
                </g>
                <g fill="#10b981">
                  <circle cx="140" cy="80" r="4" />
                  <circle cx="1140" cy="80" r="4" />
                  <circle cx="140" cy="640" r="4" />
                  <circle cx="1140" cy="640" r="4" />
                  <circle cx="680" cy="50" r="4" />
                  <circle cx="680" cy="670" r="4" />
                </g>
                <g fill="#06b6d4">
                  <rect x="10" y="10" width="10" height="10" rx="2" />
                  <rect x="1260" y="10" width="10" height="10" rx="2" />
                  <rect x="10" y="700" width="10" height="10" rx="2" />
                  <rect x="1260" y="700" width="10" height="10" rx="2" />
                </g>
              </>
            )}

            {config.frameStyle === "retro_vhs" && (
              <>
                <rect x="12" y="12" width="1256" height="696" fill="none" stroke="#ef4444" strokeWidth="4" rx="10" opacity="0.8" />
                <rect x="16" y="16" width="1256" height="696" fill="none" stroke="#06b6d4" strokeWidth="4" rx="10" opacity="0.8" />
                <rect x="14" y="14" width="1252" height="692" fill="none" stroke="#ffffff" strokeWidth="2" rx="10" />
                <rect x="30" y="26" width="220" height="28" rx="4" fill="#000000" opacity="0.85" />
                <text x="40" y="45" fill="#ef4444" fontSize="13" fontFamily="monospace" fontWeight="900">
                  PLAY ▶ 0:24:18
                </text>
                <text x="1140" y="45" fill="#22c55e" fontSize="12" fontFamily="monospace" fontWeight="bold">
                  SP ⚡ AUTO
                </text>
                <g stroke="#ffffff" strokeWidth="2" opacity="0.6">
                  <line x1="8" y1="200" x2="24" y2="200" />
                  <line x1="8" y1="360" x2="28" y2="360" />
                  <line x1="8" y1="520" x2="24" y2="520" />
                  <line x1="1256" y1="200" x2="1272" y2="200" />
                  <line x1="1252" y1="360" x2="1272" y2="360" />
                  <line x1="1256" y1="520" x2="1272" y2="520" />
                </g>
              </>
            )}

            {config.frameStyle === "heavy_metal" && (
              <>
                <rect x="12" y="12" width="1256" height="696" fill="none" stroke="#3f3f46" strokeWidth="12" />
                <rect x="22" y="22" width="1236" height="676" fill="none" stroke="#e4e4e7" strokeWidth="3" />
                <g fill="#27272a" stroke="#e4e4e7" strokeWidth="2">
                  <polygon points="12,12 80,12 55,55 12,80" />
                  <polygon points="1268,12 1200,12 1225,55 1268,80" />
                  <polygon points="12,708 80,708 55,665 12,640" />
                  <polygon points="1268,708 1200,708 1225,665 1268,640" />
                </g>
                <g fill="#f43f5e">
                  <circle cx="30" cy="30" r="5" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="1250" cy="30" r="5" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="30" cy="690" r="5" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="1250" cy="690" r="5" stroke="#ffffff" strokeWidth="1.5" />
                </g>
                <polygon points="640,6 644,18 656,18 646,25 650,37 640,30 630,37 634,25 624,18 636,18" fill="#eab308" />
                <polygon points="640,714 644,702 656,702 646,695 650,683 640,690 630,683 634,695 624,702 636,702" fill="#eab308" />
              </>
            )}

            {config.frameStyle === "manga_halftone" && (
              <>
                <rect x="14" y="14" width="1252" height="692" fill="none" stroke="#000000" strokeWidth="14" />
                <rect x="24" y="24" width="1232" height="672" fill="none" stroke="#ffffff" strokeWidth="4" />
                <g fill="#000000">
                  <polygon points="14,14 110,14 14,110" />
                  <polygon points="1266,14 1170,14 1266,110" />
                  <polygon points="14,706 110,706 14,610" />
                  <polygon points="1266,706 1170,706 1266,610" />
                </g>
                <g fill="#ffffff">
                  <polygon points="28,28 75,28 28,75" />
                  <polygon points="1252,28 1205,28 1252,75" />
                  <polygon points="28,692 75,692 28,645" />
                  <polygon points="1252,692 1205,692 1252,645" />
                </g>
                <g fill="#000000" opacity="0.85">
                  <circle cx="50" cy="50" r="4" />
                  <circle cx="1230" cy="50" r="4" />
                  <circle cx="50" cy="670" r="4" />
                  <circle cx="1230" cy="670" r="4" />
                </g>
              </>
            )}

            {config.frameStyle === "eldritch_portal" && (
              <>
                <rect x="16" y="16" width="1248" height="688" fill="none" stroke="#a855f7" strokeWidth="4" rx="12" filter="url(#glow)" />
                <rect x="26" y="26" width="1228" height="668" fill="none" stroke="#f43f5e" strokeWidth="2" rx="8" />
                <g stroke="#a855f7" strokeWidth="2" fill="none" filter="url(#glow)">
                  <circle cx="45" cy="45" r="24" />
                  <circle cx="1235" cy="45" r="24" />
                  <circle cx="45" cy="675" r="24" />
                  <circle cx="1235" cy="675" r="24" />
                </g>
                <g fill="#fef08a" fontSize="10" fontFamily="serif" fontWeight="bold" textAnchor="middle">
                  <text x="45" y="49">✦</text>
                  <text x="1235" y="49">✦</text>
                  <text x="45" y="679">✦</text>
                  <text x="1235" y="679">✦</text>
                </g>
                <line x1="69" y1="45" x2="1211" y2="45" stroke="#a855f7" strokeWidth="1" strokeDasharray="8 8" opacity="0.7" />
                <line x1="69" y1="675" x2="1211" y2="675" stroke="#a855f7" strokeWidth="1" strokeDasharray="8 8" opacity="0.7" />
              </>
            )}

            {/* Logo Watermark Header */}
            {config.showLogo && (
              <g transform="translate(60, 65)">
                <rect x="0" y="0" width="300" height="40" rx="6" fill="#0f172a" opacity="0.9" stroke="#334155" strokeWidth="2" />
                <text x="150" y="25" fill="#f8fafc" fontSize="14" fontWeight="800" textAnchor="middle">
                  {currentBadge.slice(0, 24)}
                </text>
              </g>
            )}

            {/* Episode Badge Group */}
            {config.showEpisodeBadge && (
              <g
                transform={`translate(${config.badgeX ?? 1080}, ${config.badgeY ?? 65}) scale(${
                  config.badgeScale ?? 1.0
                })`}
                onMouseDown={(e) => handleMouseDownOnElement("badge", e)}
                className="cursor-move"
              >
                {/* Visual selection outline when selected */}
                {selectedElement === "badge" && (
                  <rect
                    x="-10"
                    y="-10"
                    width="160"
                    height="70"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    rx="10"
                  />
                )}

                {config.badgeStyle === "banner" ? (
                  <path d="M 0 0 L 150 0 L 135 50 L 0 50 Z" fill={config.badgeColor || config.themeColor} filter="url(#shadow)" />
                ) : config.badgeStyle === "shield" ? (
                  <path d="M 0 0 L 140 0 L 140 35 L 70 55 L 0 35 Z" fill={config.badgeColor || config.themeColor} filter="url(#shadow)" />
                ) : config.badgeStyle === "box" ? (
                  <rect x="0" y="0" width="140" height="50" rx="2" fill={config.badgeColor || config.themeColor} filter="url(#shadow)" />
                ) : config.badgeStyle === "hexagon" ? (
                  <path d="M 18 0 L 122 0 L 140 25 L 122 50 L 18 50 L 0 25 Z" fill={config.badgeColor || config.themeColor} filter="url(#shadow)" />
                ) : config.badgeStyle === "ribbon" ? (
                  <path d="M 0 0 L 140 0 L 124 25 L 140 50 L 0 50 L 16 25 Z" fill={config.badgeColor || config.themeColor} filter="url(#shadow)" />
                ) : config.badgeStyle === "diamond" ? (
                  <path d="M 70 -6 L 152 25 L 70 56 L -12 25 Z" fill={config.badgeColor || config.themeColor} filter="url(#shadow)" />
                ) : config.badgeStyle === "starburst" ? (
                  <polygon points="70,-10 88,2 110,-5 112,18 135,18 126,40 142,55 118,60 110,80 88,72 70,82 52,72 30,80 22,60 -2,55 14,40 5,18 28,18 30,-5 52,2" fill={config.badgeColor || config.themeColor} filter="url(#shadow)" />
                ) : config.badgeStyle === "circle" ? (
                  <circle cx="70" cy="25" r="34" fill={config.badgeColor || config.themeColor} filter="url(#shadow)" />
                ) : config.badgeStyle === "tag" ? (
                  <path d="M 14 0 L 126 0 L 140 14 L 140 36 L 126 50 L 14 50 L 0 36 L 0 14 Z" fill={config.badgeColor || config.themeColor} filter="url(#shadow)" />
                ) : (
                  <rect x="0" y="0" width="140" height="50" rx="25" fill={config.badgeColor || config.themeColor} filter="url(#shadow)" />
                )}

                <text x="70" y="34" fill={config.badgeTextColor || "#020617"} fontSize="22" fontWeight="900" textAnchor="middle">
                  EP {episode.partNumber < 10 ? `0${episode.partNumber}` : episode.partNumber}
                </text>
              </g>
            )}

            {/* Hero Character Graphic / Watermark */}
            {!config.customImage && (
              <g
                transform={`translate(${config.charX ?? 900}, ${config.charY ?? 380}) scale(${
                  config.charScale ?? 1.0
                })`}
                onMouseDown={(e) => handleMouseDownOnElement("char", e)}
                className="cursor-move"
              >
                {selectedElement === "char" && (
                  <circle r="190" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 6" />
                )}
                <circle r="180" fill={config.themeColor} opacity="0.15" />
                <circle r="150" fill="none" stroke={config.themeColor} strokeWidth="3" opacity="0.4" />
                {(() => {
                  const heroAvatar = getHeroAvatarUrl(episode.heroAvatars, config.featuredCharacter);
                  if (heroAvatar) {
                    return (
                      <image
                        href={heroAvatar}
                        xlinkHref={heroAvatar}
                        x="-140"
                        y="-140"
                        width="280"
                        height="280"
                        clipPath="url(#heroCircleClip)"
                        preserveAspectRatio="xMidYMid slice"
                      />
                    );
                  }
                  return (
                    <text x="0" y="10" fill="#f8fafc" fontSize="46" fontWeight="900" textAnchor="middle" filter="url(#shadow)">
                      {config.featuredCharacter.toUpperCase()}
                    </text>
                  );
                })()}
                <text x="0" y="125" fill="#f8fafc" fontSize="16" fontWeight="800" textAnchor="middle" filter="url(#shadow)">
                  {config.featuredCharacter.toUpperCase()}
                </text>
              </g>
            )}

            {/* Main Title Group */}
            <g
              transform={`translate(${config.titleX ?? 70}, ${config.titleY ?? 480}) rotate(${
                config.titleRotation ?? 0
              })`}
              onMouseDown={(e) => handleMouseDownOnElement("title", e)}
              className="cursor-move"
              filter="url(#shadow)"
            >
              {selectedElement === "title" && (
                <rect
                  x="-15"
                  y={-(config.titleFontSize ?? 64)}
                  width={(config.overlayText.length * (config.titleFontSize ?? 64) * 0.6) + 30}
                  height={(config.titleFontSize ?? 64) + 20}
                  fill="none"
                  stroke="#eab308"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  rx="6"
                />
              )}
              <text
                x="0"
                y="0"
                fill={config.titleColor || "#ffffff"}
                fontSize={config.titleFontSize ?? 64}
                fontWeight="900"
                fontFamily={getFontFamilyCss(config.titleFontFamily)}
                letterSpacing="1"
                stroke={config.titleStrokeWidth ? config.titleStrokeColor || "#000000" : "none"}
                strokeWidth={config.titleStrokeWidth ?? 0}
                style={{ paintOrder: "stroke fill", strokeLinejoin: "round", textTransform: "uppercase" }}
              >
                {config.overlayText}
              </text>
            </g>

            {/* Subtitle / Location Tag Group */}
            {config.subText && (
              <g
                transform={`translate(${config.subX ?? 70}, ${config.subY ?? 545}) rotate(${
                  config.subRotation ?? 0
                })`}
                onMouseDown={(e) => handleMouseDownOnElement("sub", e)}
                className="cursor-move"
                filter="url(#shadow)"
              >
                {selectedElement === "sub" && (
                  <rect
                    x="-10"
                    y={-(config.subFontSize ?? 28)}
                    width={(config.subText.length * (config.subFontSize ?? 28) * 0.55) + 20}
                    height={(config.subFontSize ?? 28) + 15}
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    rx="4"
                  />
                )}
                <text
                  x="0"
                  y="0"
                  fill={config.subColor || config.themeColor}
                  fontSize={config.subFontSize ?? 28}
                  fontWeight="800"
                  fontFamily={getFontFamilyCss(config.subFontFamily || config.titleFontFamily)}
                  stroke={config.subStrokeWidth ? config.subStrokeColor || "#000000" : "none"}
                  strokeWidth={config.subStrokeWidth ?? 0}
                  style={{ paintOrder: "stroke fill", strokeLinejoin: "round" }}
                >
                  {config.subText}
                </text>
              </g>
            )}

            {/* Duration Badge Bottom Right */}
            {config.showDuration && (
              <g transform="translate(1080, 630)">
                <rect x="0" y="0" width="140" height="36" rx="6" fill="#000000" opacity="0.85" />
                <text x="70" y="24" fill="#f8fafc" fontSize="14" fontWeight="800" textAnchor="middle">
                  ⏱️ {episode.estDurationMinutes} MINS
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Editor Controls Navigation Tabs */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 space-y-5">
        {/* Tab Headers */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab("layout")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === "layout"
                ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
                : "bg-slate-950 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Layout Presets</span>
          </button>

          <button
            onClick={() => setActiveTab("text")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === "text"
                ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
                : "bg-slate-950 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Text & Typography Studio</span>
          </button>

          <button
            onClick={() => setActiveTab("badge")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === "badge"
                ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
                : "bg-slate-950 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Episode Badge</span>
          </button>

          <button
            onClick={() => setActiveTab("hero")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === "hero" || activeTab === "theme"
                ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
                : "bg-slate-950 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <Palette className="w-3.5 h-3.5 text-slate-950" />
            <span>Hero, Frame & Theme</span>
          </button>

          <button
            onClick={() => setActiveTab("art")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === "art"
                ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
                : "bg-slate-950 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Background Artwork</span>
          </button>
        </div>

        {/* Tab 1: Layout Presets */}
        {activeTab === "layout" && (
          <div className="space-y-4">
            <div className="text-xs text-slate-300">
              Select a pre-aligned layout position to instant-snap titles, subtext, badge, and character graphics into optimized High-CTR positions:
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <button
                onClick={() => applyLayoutPreset("immersive")}
                className="p-3 bg-slate-950 hover:bg-amber-500/10 border border-amber-500/40 hover:border-amber-400 rounded-xl text-left space-y-1 transition group cursor-pointer ring-1 ring-amber-500/20"
              >
                <div className="text-xs font-black text-amber-300 group-hover:text-amber-200 flex items-center gap-1">
                  <span>✨ Immersive Cinematic</span>
                </div>
                <p className="text-[10px] text-slate-400">Epic widescreen title, Gold RPG frame & centered hero shield</p>
              </button>

              <button
                onClick={() => applyLayoutPreset("boss_fight")}
                className="p-3 bg-slate-950 hover:bg-red-500/10 border border-red-500/30 hover:border-red-400 rounded-xl text-left space-y-1 transition group cursor-pointer"
              >
                <div className="text-xs font-extrabold text-red-400 group-hover:text-red-300 flex items-center gap-1">
                  <span>🔥 Boss Encounter</span>
                </div>
                <p className="text-[10px] text-slate-400">High impact crimson title & fiery boss flame overlay</p>
              </button>

              <button
                onClick={() => applyLayoutPreset("lore_book")}
                className="p-3 bg-slate-950 hover:bg-purple-500/10 border border-slate-800 hover:border-purple-400 rounded-xl text-left space-y-1 transition group cursor-pointer"
              >
                <div className="text-xs font-bold text-purple-300 group-hover:text-purple-200 flex items-center gap-1">
                  <span>📜 Lore & Storybook</span>
                </div>
                <p className="text-[10px] text-slate-400">Serif fantasy header, Gold filigree & story Ribbon badge</p>
              </button>

              <button
                onClick={() => applyLayoutPreset("minimal_clean")}
                className="p-3 bg-slate-950 hover:bg-sky-500/10 border border-slate-800 hover:border-sky-400 rounded-xl text-left space-y-1 transition group cursor-pointer"
              >
                <div className="text-xs font-bold text-sky-400 group-hover:text-sky-300 flex items-center gap-1">
                  <span>💎 Minimal Widescreen</span>
                </div>
                <p className="text-[10px] text-slate-400">Bottom clean text line with soft minimal corner ticks</p>
              </button>

              <button
                onClick={() => applyLayoutPreset("bottom_left")}
                className="p-3 bg-slate-950 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500 rounded-xl text-left space-y-1 transition group cursor-pointer"
              >
                <div className="text-xs font-bold text-amber-400 group-hover:text-amber-300">
                  Bottom-Left Classic
                </div>
                <p className="text-[10px] text-slate-400">Traditional walkthrough stack at bottom left</p>
              </button>

              <button
                onClick={() => applyLayoutPreset("center_punch")}
                className="p-3 bg-slate-950 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500 rounded-xl text-left space-y-1 transition group cursor-pointer"
              >
                <div className="text-xs font-bold text-amber-400 group-hover:text-amber-300">
                  Center Stage Mega
                </div>
                <p className="text-[10px] text-slate-400">Centered punchy title with slight tilt</p>
              </button>

              <button
                onClick={() => applyLayoutPreset("top_left")}
                className="p-3 bg-slate-950 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500 rounded-xl text-left space-y-1 transition group cursor-pointer"
              >
                <div className="text-xs font-bold text-amber-400 group-hover:text-amber-300">
                  Top-Left Header
                </div>
                <p className="text-[10px] text-slate-400">High-visibility title aligned at top left</p>
              </button>

              <button
                onClick={() => applyLayoutPreset("diagonal")}
                className="p-3 bg-slate-950 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500 rounded-xl text-left space-y-1 transition group cursor-pointer"
              >
                <div className="text-xs font-bold text-amber-400 group-hover:text-amber-300">
                  Diagonal Dynamic
                </div>
                <p className="text-[10px] text-slate-400">Tilted dynamic text with large hero circle</p>
              </button>

              <button
                onClick={() => applyLayoutPreset("split")}
                className="p-3 bg-slate-950 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500 rounded-xl text-left space-y-1 transition group cursor-pointer"
              >
                <div className="text-xs font-bold text-amber-400 group-hover:text-amber-300">
                  Split Screen Focus
                </div>
                <p className="text-[10px] text-slate-400">Left text column, right hero graphic</p>
              </button>
            </div>
          </div>
        )}

        {/* Consolidated Text & Typography Studio Tab */}
        {activeTab === "text" && (
          <div className="space-y-5">
            {/* Sub-Navigation Switcher inside Text Studio */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTextSubTab("title")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    activeTextSubTab === "title"
                      ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
                      : "bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                  <span>Main Title</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTextSubTab("sub")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    activeTextSubTab === "sub"
                      ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
                      : "bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Baseline className="w-3.5 h-3.5" />
                  <span>SubText Tag</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTextSubTab("presets")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    activeTextSubTab === "presets"
                      ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
                      : "bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                  <span>1-Tap Typography Presets</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTextSubTab("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeTextSubTab === "all"
                      ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20"
                      : "bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <span>Show All Controls</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-400 font-mono hidden md:block pr-1">
                Drag text directly on SVG canvas to reposition
              </div>
            </div>

            {/* 1-Tap High-CTR Typography Presets Block */}
            {(activeTextSubTab === "presets" || activeTextSubTab === "all") && (
              <div className="bg-slate-950/80 p-4 rounded-xl border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                      High-CTR Typography Presets (Main Title & SubText Coordinated)
                    </h4>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">Instant Apply</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    {
                      id: "impact_action",
                      title: "💥 High-CTR Action Punch",
                      desc: "Yellow Impact Heavy Title + Black Outline + White SubText",
                      titleFont: "impact",
                      subFont: "bebas",
                      titleColor: "#facc15",
                      subColor: "#ffffff",
                      strokeColor: "#000000",
                      strokeWidth: 6,
                    },
                    {
                      id: "rpg_gold",
                      title: "👑 Cinematic RPG Gold",
                      desc: "Cinzel Gold Title + Dark Brown Stroke + Playfair SubText",
                      titleFont: "cinematic",
                      subFont: "serif",
                      titleColor: "#fef08a",
                      subColor: "#eab308",
                      strokeColor: "#451a03",
                      strokeWidth: 4,
                    },
                    {
                      id: "cyber_neon",
                      title: "⚡ Cyberpunk Sci-Fi Neon",
                      desc: "Cyan Orbitron Header + Neon Magenta SubText Tag",
                      titleFont: "futuristic",
                      subFont: "futuristic",
                      titleColor: "#06b6d4",
                      subColor: "#ec4899",
                      strokeColor: "#000000",
                      strokeWidth: 4,
                    },
                    {
                      id: "arcade_comic",
                      title: "🕹️ Comic Arcade Action",
                      desc: "Red Bangers Title + Yellow SubText + Heavy Black Outline",
                      titleFont: "comic",
                      subFont: "display",
                      titleColor: "#ef4444",
                      subColor: "#facc15",
                      strokeColor: "#000000",
                      strokeWidth: 6,
                    },
                    {
                      id: "lore_storybook",
                      title: "📜 Lore & Storybook Elegance",
                      desc: "Playfair Display Pure White Title + Gold SubText Tag",
                      titleFont: "serif",
                      subFont: "cinematic",
                      titleColor: "#ffffff",
                      subColor: "#fef08a",
                      strokeColor: "#020617",
                      strokeWidth: 3,
                    },
                    {
                      id: "street_brush",
                      title: "🎨 Street Brush Graffiti",
                      desc: "Permanent Marker Cyan Header + White Bebas Tag",
                      titleFont: "brush",
                      subFont: "bebas",
                      titleColor: "#38bdf8",
                      subColor: "#ffffff",
                      strokeColor: "#000000",
                      strokeWidth: 5,
                    },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        handleMultipleChanges({
                          titleFontFamily: preset.titleFont,
                          subFontFamily: preset.subFont,
                          titleColor: preset.titleColor,
                          subColor: preset.subColor,
                          titleStrokeColor: preset.strokeColor,
                          subStrokeColor: preset.strokeColor,
                          titleStrokeWidth: preset.strokeWidth,
                          subStrokeWidth: Math.max(2, preset.strokeWidth - 2),
                        });
                      }}
                      className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 rounded-xl text-left space-y-1.5 transition cursor-pointer group"
                    >
                      <div className="text-xs font-black text-amber-300 group-hover:text-amber-200">
                        {preset.title}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-snug">{preset.desc}</p>
                      <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>
                          FONTS: {preset.titleFont.toUpperCase()} / {preset.subFont.toUpperCase()}
                        </span>
                        <span className="text-amber-400 font-bold group-hover:underline">1-Tap Apply</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Main Title Section */}
            {(activeTextSubTab === "title" || activeTextSubTab === "all") && (
              <div className="bg-slate-950/60 p-4 rounded-xl border border-amber-500/20 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
                    <Type className="w-4 h-4 text-amber-400" />
                    <span>Main Title Settings</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">PRIMARY HEADLINE</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Main Title Text (ALL CAPS)
                    </label>
                    <input
                      type="text"
                      value={config.overlayText}
                      onChange={(e) => handleTextChange("overlayText", e.target.value.toUpperCase())}
                      placeholder="e.g. SUPLEX A TRAIN!"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-400 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 flex justify-between items-center">
                      <span>Font Family & Typography Style</span>
                      <span className="text-[10px] text-amber-400 font-mono font-semibold">11 Fonts</span>
                    </label>
                    <select
                      value={config.titleFontFamily || "sans"}
                      onChange={(e) => handleTextChange("titleFontFamily", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-amber-400 font-medium cursor-pointer"
                    >
                      <option value="sans">Plus Jakarta Sans — Modern Clean Display</option>
                      <option value="bebas">Bebas Neue — Tall Billboard Headlines</option>
                      <option value="impact">Impact Heavy — Classic Gaming Punch</option>
                      <option value="anton">Anton — Ultra-Bold Heavy Banner</option>
                      <option value="cinematic">Cinzel — Epic RPG & Fantasy Intro</option>
                      <option value="serif">Playfair Display — Lore & Storybook Elegance</option>
                      <option value="futuristic">Orbitron — Sci-Fi / Cyberpunk Tech</option>
                      <option value="comic">Bangers — Arcade & Comic Action</option>
                      <option value="brush">Permanent Marker — Street Graffiti Brush</option>
                      <option value="display">Fredoka — Rounded Playful Gaming</option>
                      <option value="mono">Monospace — Pixel / Retro Terminal</option>
                    </select>
                  </div>
                </div>

                {/* Quick Font Chips for Title */}
                <div>
                  <div className="text-[11px] font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-amber-400" />
                    <span>Quick Title Font Preset Chips:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: "bebas", label: "BEBAS", font: "'Bebas Neue', sans-serif" },
                      { id: "impact", label: "IMPACT", font: "Impact, sans-serif" },
                      { id: "cinematic", label: "CINZEL", font: "'Cinzel', serif" },
                      { id: "futuristic", label: "ORBITRON", font: "'Orbitron', sans-serif" },
                      { id: "anton", label: "ANTON", font: "'Anton', sans-serif" },
                      { id: "comic", label: "BANGERS", font: "'Bangers', cursive" },
                      { id: "brush", label: "MARKER", font: "'Permanent Marker', cursive" },
                      { id: "serif", label: "PLAYFAIR", font: "'Playfair Display', serif" },
                      { id: "sans", label: "JAKARTA", font: "'Plus Jakarta Sans', sans-serif" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => handleTextChange("titleFontFamily", f.id)}
                        style={{ fontFamily: f.font }}
                        className={`px-2.5 py-1 rounded text-xs transition cursor-pointer border ${
                          (config.titleFontFamily || "sans") === f.id
                            ? "bg-amber-500/20 text-amber-300 border-amber-400 font-extrabold ring-1 ring-amber-400/40"
                            : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sliders Grid for Title */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1 font-mono">
                      <span>Title X Position</span>
                      <span className="text-amber-400 font-bold">{config.titleX ?? 70}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1200"
                      value={config.titleX ?? 70}
                      onChange={(e) => handleTextChange("titleX", Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1 font-mono">
                      <span>Title Y Position</span>
                      <span className="text-amber-400 font-bold">{config.titleY ?? 480}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="700"
                      value={config.titleY ?? 480}
                      onChange={(e) => handleTextChange("titleY", Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1 font-mono">
                      <span>Font Size</span>
                      <span className="text-amber-400 font-bold">{config.titleFontSize ?? 64}pt</span>
                    </div>
                    <input
                      type="range"
                      min="24"
                      max="120"
                      value={config.titleFontSize ?? 64}
                      onChange={(e) => handleTextChange("titleFontSize", Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1 font-mono">
                      <span>Rotation Tilt</span>
                      <span className="text-amber-400 font-bold">{config.titleRotation ?? 0}°</span>
                    </div>
                    <input
                      type="range"
                      min="-25"
                      max="25"
                      value={config.titleRotation ?? 0}
                      onChange={(e) => handleTextChange("titleRotation", Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Title Colors & Stroke */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Text Fill Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.titleColor || "#ffffff"}
                        onChange={(e) => handleTextChange("titleColor", e.target.value)}
                        className="w-8 h-8 rounded bg-transparent border border-slate-700 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.titleColor || "#ffffff"}
                        onChange={(e) => handleTextChange("titleColor", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Stroke / Outline Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.titleStrokeColor || "#000000"}
                        onChange={(e) => handleTextChange("titleStrokeColor", e.target.value)}
                        className="w-8 h-8 rounded bg-transparent border border-slate-700 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.titleStrokeColor || "#000000"}
                        onChange={(e) => handleTextChange("titleStrokeColor", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1 font-mono">
                      <span>Stroke Thickness</span>
                      <span className="text-amber-400 font-bold">{config.titleStrokeWidth ?? 4}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="12"
                      value={config.titleStrokeWidth ?? 4}
                      onChange={(e) => handleTextChange("titleStrokeWidth", Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer mt-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SubText Tag Section */}
            {(activeTextSubTab === "sub" || activeTextSubTab === "all") && (
              <div className="bg-slate-950/60 p-4 rounded-xl border border-pink-500/30 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <h3 className="text-xs font-black text-pink-300 uppercase tracking-wider flex items-center gap-2">
                    <Baseline className="w-4 h-4 text-pink-400" />
                    <span>SubText Tag & Location Sub-Banner</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleTextChange("subFontFamily", config.titleFontFamily || "sans")}
                      className="text-[10px] text-pink-400 hover:text-pink-300 hover:underline font-mono cursor-pointer"
                      title="Match Main Title Font"
                    >
                      ⚡ Match Title Font ({config.titleFontFamily || "sans"})
                    </button>
                    <span className="text-[10px] text-slate-400 font-mono">SECONDARY TAG</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      SubText Tag / Secondary Text
                    </label>
                    <input
                      type="text"
                      value={config.subText || ""}
                      onChange={(e) => handleTextChange("subText", e.target.value)}
                      placeholder="e.g. EPISODE 04 • PHANTOM TRAIN"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-pink-400 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 flex justify-between items-center">
                      <span>SubText Font Family</span>
                      <span className="text-[10px] text-pink-400 font-mono font-semibold">11 Fonts</span>
                    </label>
                    <select
                      value={config.subFontFamily || config.titleFontFamily || "sans"}
                      onChange={(e) => handleTextChange("subFontFamily", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-pink-400 font-medium cursor-pointer"
                    >
                      <option value="sans">Plus Jakarta Sans — Modern Clean Display</option>
                      <option value="bebas">Bebas Neue — Tall Billboard Headlines</option>
                      <option value="impact">Impact Heavy — Classic Gaming Punch</option>
                      <option value="anton">Anton — Ultra-Bold Heavy Banner</option>
                      <option value="cinematic">Cinzel — Epic RPG & Fantasy Intro</option>
                      <option value="serif">Playfair Display — Lore & Storybook Elegance</option>
                      <option value="futuristic">Orbitron — Sci-Fi / Cyberpunk Tech</option>
                      <option value="comic">Bangers — Arcade & Comic Action</option>
                      <option value="brush">Permanent Marker — Street Graffiti Brush</option>
                      <option value="display">Fredoka — Rounded Playful Gaming</option>
                      <option value="mono">Monospace — Pixel / Retro Terminal</option>
                    </select>
                  </div>
                </div>

                {/* Quick Font Chips for SubText */}
                <div>
                  <div className="text-[11px] font-medium text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Baseline className="w-3.5 h-3.5 text-pink-400" />
                    <span>Quick SubText Font Chips:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: "bebas", label: "BEBAS", font: "'Bebas Neue', sans-serif" },
                      { id: "impact", label: "IMPACT", font: "Impact, sans-serif" },
                      { id: "cinematic", label: "CINZEL", font: "'Cinzel', serif" },
                      { id: "futuristic", label: "ORBITRON", font: "'Orbitron', sans-serif" },
                      { id: "anton", label: "ANTON", font: "'Anton', sans-serif" },
                      { id: "comic", label: "BANGERS", font: "'Bangers', cursive" },
                      { id: "brush", label: "MARKER", font: "'Permanent Marker', cursive" },
                      { id: "serif", label: "PLAYFAIR", font: "'Playfair Display', serif" },
                      { id: "sans", label: "JAKARTA", font: "'Plus Jakarta Sans', sans-serif" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => handleTextChange("subFontFamily", f.id)}
                        style={{ fontFamily: f.font }}
                        className={`px-2.5 py-1 rounded text-xs transition cursor-pointer border ${
                          (config.subFontFamily || config.titleFontFamily || "sans") === f.id
                            ? "bg-amber-500/20 text-amber-300 border-amber-400 font-extrabold ring-1 ring-amber-400/40"
                            : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sliders Grid for SubText */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1 font-mono">
                      <span>SubText Size</span>
                      <span className="text-pink-400 font-bold">{config.subFontSize ?? 28}pt</span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="80"
                      value={config.subFontSize ?? 28}
                      onChange={(e) => handleTextChange("subFontSize", Number(e.target.value))}
                      className="w-full accent-pink-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1 font-mono">
                      <span>SubText X</span>
                      <span className="text-pink-400 font-bold">{config.subX ?? 70}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1200"
                      value={config.subX ?? 70}
                      onChange={(e) => handleTextChange("subX", Number(e.target.value))}
                      className="w-full accent-pink-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1 font-mono">
                      <span>SubText Y</span>
                      <span className="text-pink-400 font-bold">{config.subY ?? 545}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="700"
                      value={config.subY ?? 545}
                      onChange={(e) => handleTextChange("subY", Number(e.target.value))}
                      className="w-full accent-pink-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1 font-mono">
                      <span>Rotation Tilt</span>
                      <span className="text-pink-400 font-bold">{config.subRotation ?? 0}°</span>
                    </div>
                    <input
                      type="range"
                      min="-25"
                      max="25"
                      value={config.subRotation ?? 0}
                      onChange={(e) => handleTextChange("subRotation", Number(e.target.value))}
                      className="w-full accent-pink-400 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Colors & Outline for SubText */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      SubText Fill Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.subColor || config.themeColor || "#eab308"}
                        onChange={(e) => handleTextChange("subColor", e.target.value)}
                        className="w-8 h-8 rounded bg-transparent border border-slate-700 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.subColor || config.themeColor || "#eab308"}
                        onChange={(e) => handleTextChange("subColor", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Stroke / Outline Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.subStrokeColor || "#000000"}
                        onChange={(e) => handleTextChange("subStrokeColor", e.target.value)}
                        className="w-8 h-8 rounded bg-transparent border border-slate-700 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.subStrokeColor || "#000000"}
                        onChange={(e) => handleTextChange("subStrokeColor", e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1 font-mono">
                      <span>Stroke Thickness</span>
                      <span className="text-pink-400 font-bold">{config.subStrokeWidth ?? 0}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="12"
                      value={config.subStrokeWidth ?? 0}
                      onChange={(e) => handleTextChange("subStrokeWidth", Number(e.target.value))}
                      className="w-full accent-pink-400 cursor-pointer mt-2"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}



        {/* Tab 4: Badge Customization */}
        {activeTab === "badge" && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-xs text-slate-300">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showEpisodeBadge}
                  onChange={(e) => handleTextChange("showEpisodeBadge", e.target.checked)}
                  className="accent-sky-400"
                />
                <span className="font-bold">Show Episode Badge</span>
              </label>
            </div>

            {/* Badge Color Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Badge Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.badgeColor || config.themeColor || "#eab308"}
                    onChange={(e) => handleTextChange("badgeColor", e.target.value)}
                    className="w-8 h-8 rounded bg-transparent border border-slate-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.badgeColor || config.themeColor || "#eab308"}
                    onChange={(e) => handleTextChange("badgeColor", e.target.value)}
                    className="w-24 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 font-mono"
                  />
                  <div className="flex gap-1">
                    {["#eab308", "#38bdf8", "#ef4444", "#10b981", "#a855f7", "#ec4899", "#ffffff", "#0f172a"].map((color) => (
                      <button
                        key={color}
                        onClick={() => handleTextChange("badgeColor", color)}
                        style={{ backgroundColor: color }}
                        className="w-5 h-5 rounded-full border border-slate-800 hover:scale-110 transition cursor-pointer"
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Badge Text Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.badgeTextColor || "#020617"}
                    onChange={(e) => handleTextChange("badgeTextColor", e.target.value)}
                    className="w-8 h-8 rounded bg-transparent border border-slate-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.badgeTextColor || "#020617"}
                    onChange={(e) => handleTextChange("badgeTextColor", e.target.value)}
                    className="w-24 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 font-mono"
                  />
                  <div className="flex gap-1.5">
                    {[
                      { color: "#020617", label: "Dark" },
                      { color: "#ffffff", label: "White" },
                      { color: "#eab308", label: "Gold" },
                      { color: "#38bdf8", label: "Sky" },
                      { color: "#ef4444", label: "Red" },
                    ].map((tc) => (
                      <button
                        key={tc.color}
                        onClick={() => handleTextChange("badgeTextColor", tc.color)}
                        style={{ backgroundColor: tc.color }}
                        className="w-5 h-5 rounded-full border border-slate-700 hover:scale-110 transition cursor-pointer"
                        title={tc.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Dropdown Selector for Badge Shape Style */}
            <div className="relative" ref={badgeDropdownRef}>
              <label className="block text-xs font-medium text-slate-400 mb-1 flex justify-between items-center">
                <span>Badge Shape Style</span>
                <span className="text-[10px] text-sky-400 font-mono">
                  Current: {BADGE_STYLES.find((s) => s.id === (config.badgeStyle || "pill"))?.label}
                </span>
              </label>

              {/* Dropdown Trigger Button */}
              <button
                type="button"
                onClick={() => setIsBadgeDropdownOpen(!isBadgeDropdownOpen)}
                className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-left transition cursor-pointer shadow-inner group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1 bg-slate-900 rounded-lg border border-slate-800/80 flex items-center justify-center">
                    {renderBadgeMiniPreview(
                      config.badgeStyle || "pill",
                      config.badgeColor || config.themeColor || "#eab308",
                      config.badgeTextColor || "#020617"
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-100 group-hover:text-sky-300 flex items-center gap-2">
                      <span>
                        {BADGE_STYLES.find((s) => s.id === (config.badgeStyle || "pill"))?.label || "Rounded Pill"}
                      </span>
                      <span className="text-[10px] bg-sky-500/10 text-sky-400 px-1.5 py-0.5 rounded border border-sky-500/20 font-mono">
                        {BADGE_STYLES.find((s) => s.id === (config.badgeStyle || "pill"))?.desc}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Click to open shape selector dropdown
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    isBadgeDropdownOpen ? "transform rotate-180 text-sky-400" : ""
                  }`}
                />
              </button>

              {/* Dropdown Window Popover */}
              {isBadgeDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-slate-950/95 backdrop-blur-xl border border-sky-500/40 rounded-xl p-3 shadow-2xl z-50 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150 ring-1 ring-sky-500/20">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 px-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Select Badge Shape Style ({BADGE_STYLES.length} Shapes)</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">Live Vector Preview</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                    {BADGE_STYLES.map((st) => {
                      const isSelected = (config.badgeStyle || "pill") === st.id;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => {
                            handleTextChange("badgeStyle", st.id);
                            setIsBadgeDropdownOpen(false);
                          }}
                          className={`p-2.5 rounded-lg border text-left transition cursor-pointer flex items-center justify-between gap-2 ${
                            isSelected
                              ? "bg-sky-500/20 text-sky-200 border-sky-400 shadow-lg shadow-sky-950/50 ring-1 ring-sky-400/40"
                              : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800/80 hover:border-slate-700 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="p-1 bg-slate-950 rounded border border-slate-800 flex-shrink-0">
                              {renderBadgeMiniPreview(
                                st.id,
                                config.badgeColor || config.themeColor || "#eab308",
                                config.badgeTextColor || "#020617"
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold truncate flex items-center gap-1.5">
                                <span>{st.label}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono truncate">{st.desc}</div>
                            </div>
                          </div>

                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center flex-shrink-0">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1 font-mono">
                  <span>Badge X Position</span>
                  <span className="text-sky-400 font-bold">{config.badgeX ?? 1080}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1200"
                  value={config.badgeX ?? 1080}
                  onChange={(e) => handleTextChange("badgeX", Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1 font-mono">
                  <span>Badge Y Position</span>
                  <span className="text-sky-400 font-bold">{config.badgeY ?? 65}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="700"
                  value={config.badgeY ?? 65}
                  onChange={(e) => handleTextChange("badgeY", Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1 font-mono">
                  <span>Badge Scale</span>
                  <span className="text-sky-400 font-bold">
                    {((config.badgeScale ?? 1.0) * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.05"
                  value={config.badgeScale ?? 1.0}
                  onChange={(e) => handleTextChange("badgeScale", Number(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Hero Character, Frame Style & Accent Theme */}
        {(activeTab === "hero" || activeTab === "theme") && (
          <div className="space-y-6">
            {/* Sub-Section 1: Accent Theme & Color Palette Studio */}
            <div className="bg-[#09090b] p-4 rounded-xl border border-amber-500/30 shadow-lg space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-extrabold text-amber-300 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-amber-400" />
                    <span>Thumbnail Accent Theme Color</span>
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Controls background lighting, frame borders, title glows, and default badge accents.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleTextChange("subColor", config.themeColor);
                    handleTextChange("badgeColor", config.themeColor);
                  }}
                  className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
                  title="Apply theme color to both subtitle text and badge background"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sync SubText & Badge to Accent Theme</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.themeColor || "#eab308"}
                    onChange={(e) => handleTextChange("themeColor", e.target.value)}
                    className="w-9 h-9 rounded-lg bg-transparent border border-slate-700 cursor-pointer"
                  />
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">HEX COLOR</span>
                    <input
                      type="text"
                      value={config.themeColor || "#eab308"}
                      onChange={(e) => handleTextChange("themeColor", e.target.value)}
                      className="w-24 bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-xs text-slate-100 font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Quick Swatches */}
                <div className="flex-1 flex flex-wrap items-center gap-2 pl-3 border-l border-slate-800">
                  <span className="text-[11px] text-slate-400 font-medium mr-1">Quick Swatches:</span>
                  {[
                    { hex: "#eab308", name: "Gold Legend" },
                    { hex: "#ef4444", name: "Eikon Crimson" },
                    { hex: "#38bdf8", name: "Shiva Sapphire" },
                    { hex: "#6366f1", name: "Bahamut Indigo" },
                    { hex: "#8b5cf6", name: "Odin Violet" },
                    { hex: "#10b981", name: "Emerald Toxicity" },
                    { hex: "#ec4899", name: "Neon Rose" },
                    { hex: "#06b6d4", name: "Cyber Cyan" },
                    { hex: "#f97316", name: "Blaze Orange" },
                    { hex: "#f8fafc", name: "Platinum Diamond" },
                  ].map((sw) => (
                    <button
                      key={sw.hex}
                      type="button"
                      onClick={() => handleTextChange("themeColor", sw.hex)}
                      className={`w-7 h-7 rounded-lg border transition-transform cursor-pointer flex items-center justify-center ${
                        config.themeColor === sw.hex
                          ? "scale-110 border-white ring-2 ring-amber-400/50 shadow-md"
                          : "border-slate-800 hover:scale-105"
                      }`}
                      style={{ backgroundColor: sw.hex }}
                      title={sw.name}
                    >
                      {config.themeColor === sw.hex && (
                        <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* High-CTR Theme Presets */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  1-Tap Accent Theme & Frame Presets:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {[
                    {
                      id: "immersive_cinematic",
                      title: "Immersive Gold RPG",
                      subText: "GOLD FILIGREE & AMBER GLOW",
                      color: "#eab308",
                      frameStyle: "gold_rpg",
                      badgeText: "STORY MODE",
                      previewClass: "from-amber-950 via-zinc-900 to-yellow-950 border-amber-500/50",
                    },
                    {
                      id: "fire_eikon",
                      title: "Eikon Flame Crimson",
                      subText: "FIRE EMBERS & HIGH-CONTRAST",
                      color: "#ef4444",
                      frameStyle: "boss_flame",
                      badgeText: "100% GUIDE",
                      previewClass: "from-red-950 via-zinc-900 to-amber-950 border-red-500/50",
                    },
                    {
                      id: "shiva_frost",
                      title: "Shiva Glacial Sapphire",
                      subText: "ICE CRYSTAL FROST & NEON",
                      color: "#38bdf8",
                      frameStyle: "neon",
                      badgeText: "4K 60FPS",
                      previewClass: "from-sky-950 via-zinc-900 to-blue-950 border-sky-500/50",
                    },
                    {
                      id: "bahamut_light",
                      title: "Bahamut Celestial Indigo",
                      subText: "CELESTIAL RAY TRACING",
                      color: "#6366f1",
                      frameStyle: "gold_rpg",
                      badgeText: "NO DAMAGE",
                      previewClass: "from-indigo-950 via-zinc-900 to-purple-950 border-indigo-500/50",
                    },
                    {
                      id: "odin_darkness",
                      title: "Odin Dark Zantetsuken",
                      subText: "DEEP VOID SHADOWS & NEON",
                      color: "#8b5cf6",
                      frameStyle: "cyber_glitch",
                      badgeText: "NO COMMENTARY",
                      previewClass: "from-purple-950 via-zinc-900 to-zinc-950 border-purple-500/50",
                    },
                    {
                      id: "cyber_hud",
                      title: "Cyberpunk Cyan Tech",
                      subText: "SCI-FI HUD & MATRIX GLOW",
                      color: "#06b6d4",
                      frameStyle: "cyber_circuit",
                      badgeText: "PLATINUM",
                      previewClass: "from-cyan-950 via-zinc-900 to-teal-950 border-cyan-500/50",
                    },
                  ].map((preset) => {
                    const isActive = config.themeColor === preset.color && config.frameStyle === preset.frameStyle;
                    return (
                      <div
                        key={preset.id}
                        className={`p-3 rounded-xl border bg-gradient-to-br ${preset.previewClass} space-y-2 relative group hover:scale-[1.01] transition duration-150`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono uppercase font-black text-amber-300 bg-black/70 px-2 py-0.5 rounded border border-amber-500/30">
                              {preset.badgeText}
                            </span>
                            <h4 className="text-xs font-black text-white mt-1">{preset.title}</h4>
                            <p className="text-[10px] text-zinc-300 font-mono opacity-90">{preset.subText}</p>
                          </div>

                          <div
                            className="w-4 h-4 rounded-full border border-white/50 shadow-md flex-shrink-0"
                            style={{ backgroundColor: preset.color }}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = {
                              ...config,
                              themeColor: preset.color,
                              frameStyle: preset.frameStyle as any,
                              subColor: preset.color,
                              badgeColor: preset.color,
                            };
                            setConfig(updated);
                            onUpdateConfig(updated);
                          }}
                          className={`w-full py-1 px-2 font-bold text-[11px] rounded-lg border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                            isActive
                              ? "bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md shadow-amber-950/50"
                              : "bg-black/60 hover:bg-black text-white border-white/20"
                          }`}
                        >
                          <Check className={`w-3.5 h-3.5 ${isActive ? "text-slate-950 stroke-[3]" : "text-emerald-400"}`} />
                          <span>{isActive ? "Applied" : "Apply Accent Theme"}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sub-Section 2: Frame Border Style Overlay */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-purple-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <h3 className="text-xs font-black text-purple-300 uppercase tracking-wider flex items-center gap-2">
                  <Layout className="w-4 h-4 text-purple-400" />
                  <span>Frame Border Overlay (20 Custom Frame Styles)</span>
                </h3>
                <span className="text-[10px] text-purple-400 font-mono font-semibold">20 Vector Frames</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Select Frame Border Style
                </label>
                <select
                  value={config.frameStyle || "none"}
                  onChange={(e) => handleTextChange("frameStyle", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-purple-400 font-bold cursor-pointer"
                >
                  <option value="none">No Frame (Full Canvas Clean)</option>
                  <option value="snes">SNES Retro (Dual Classic Outline & Rivets)</option>
                  <option value="neon">Neon Glow (Cyberpunk Neon Border)</option>
                  <option value="minimal">Minimalist (Crisp Inset Corner Crosshairs)</option>
                  <option value="gold_rpg">Gold RPG (Metallic Filigree & Diamonds)</option>
                  <option value="cyber_glitch">Cyber HUD (Sci-Fi Ticks & Corner Brackets)</option>
                  <option value="anime_speed">Anime Speed (Corner Action Speed Lines)</option>
                  <option value="vintage_crt">CRT Monitor (Old-School TV Bezel & Power LED)</option>
                  <option value="boss_flame">Boss Flame (Fiery Ember Glow Nodes)</option>
                  <option value="double_line">Double Line (Clean Dual Stroke & Corner Blocks)</option>
                  <option value="gradient_glow">Gradient Glow (Vibrant Neon Glow Circles)</option>
                  <option value="tech_corner">Tech Corner (HUD Metrics & Crosshair Insets)</option>
                  <option value="comic_action">Comic Action (Heavy Ink Inset & Yellow Accent)</option>
                  <option value="royal_crest">Royal Crest (Gold Crest Filigree & Ruby Nodes)</option>
                  <option value="arcadium">Arcadium (Arcade Neon Rose & Cyan Frame)</option>
                  <option value="polaroid_card">Polaroid Card (Classic Thick Border Frame)</option>
                  <option value="cyber_circuit">⚡ Cyber Circuit (Circuit Traces & Emerald IC Nodes)</option>
                  <option value="retro_vhs">⚡ Retro VHS (Analog Scanlines & Stereoscopic Offset)</option>
                  <option value="heavy_metal">⚡ Heavy Metal (Spiked Corner Plates & Steel Rivets)</option>
                  <option value="manga_halftone">⚡ Manga Halftone (Ink Burst Brackets & Action Halftone)</option>
                  <option value="eldritch_portal">⚡ Eldritch Portal (Arcane Rune Circles & Glow Celestial)</option>
                </select>
              </div>

              {/* Quick Frame Chips Grid */}
              <div>
                <span className="text-[11px] font-medium text-slate-400 mb-2 block">
                  Quick Frame Chips (Click to Apply):
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {[
                    { id: "none", label: "🚫 None" },
                    { id: "snes", label: "🕹️ SNES" },
                    { id: "neon", label: "⚡ Neon" },
                    { id: "minimal", label: "📐 Minimal" },
                    { id: "gold_rpg", label: "👑 Gold RPG" },
                    { id: "cyber_glitch", label: "💻 Cyber Glitch" },
                    { id: "anime_speed", label: "🔥 Anime Speed" },
                    { id: "vintage_crt", label: "📺 Vintage CRT" },
                    { id: "boss_flame", label: "🔥 Boss Flame" },
                    { id: "double_line", label: "═ Double Line" },
                    { id: "gradient_glow", label: "✨ Gradient Glow" },
                    { id: "tech_corner", label: "🤖 Tech Corner" },
                    { id: "comic_action", label: "💥 Comic Action" },
                    { id: "royal_crest", label: "🏰 Royal Crest" },
                    { id: "arcadium", label: "👾 Arcadium" },
                    { id: "polaroid_card", label: "📸 Polaroid" },
                    { id: "cyber_circuit", label: "⚡ Cyber Circuit" },
                    { id: "retro_vhs", label: "📼 Retro VHS" },
                    { id: "heavy_metal", label: "🎸 Heavy Metal" },
                    { id: "manga_halftone", label: "✒️ Manga Halftone" },
                    { id: "eldritch_portal", label: "🔮 Eldritch Portal" },
                  ].map((frame) => {
                    const isSelected = (config.frameStyle || "none") === frame.id;
                    return (
                      <button
                        key={frame.id}
                        type="button"
                        onClick={() => handleTextChange("frameStyle", frame.id)}
                        className={`px-2.5 py-1 rounded text-xs transition cursor-pointer border font-bold ${
                          isSelected
                            ? "bg-amber-500/20 text-amber-300 border-amber-400 ring-1 ring-amber-400/40"
                            : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
                        }`}
                      >
                        {frame.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sub-Section 3: Featured Hero Graphic & Positioning */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-400" />
                  <span>Featured Hero Graphic & Position</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">WATERMARK OVERLAY</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Featured Character Watermark
                </label>
                <select
                  value={config.featuredCharacter}
                  onChange={(e) => handleTextChange("featuredCharacter", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none"
                >
                  {(() => {
                    const gameChars = getGameCharacterList(currentGameTitle, episode);
                    if (
                      config.featuredCharacter &&
                      !gameChars.some(
                        (c) => c.toLowerCase() === config.featuredCharacter.toLowerCase()
                      )
                    ) {
                      gameChars.unshift(config.featuredCharacter);
                    }
                    return gameChars.map((char) => (
                      <option key={char} value={char}>
                        {getCharacterBadgeIcon(char)}
                      </option>
                    ));
                  })()}
                </select>
              </div>

              {/* Hero Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1 font-mono">
                    <span>Hero Graphic X</span>
                    <span className="text-purple-400 font-bold">{config.charX ?? 900}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1200"
                    value={config.charX ?? 900}
                    onChange={(e) => handleTextChange("charX", Number(e.target.value))}
                    className="w-full accent-purple-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1 font-mono">
                    <span>Hero Graphic Y</span>
                    <span className="text-purple-400 font-bold">{config.charY ?? 380}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="700"
                    value={config.charY ?? 380}
                    onChange={(e) => handleTextChange("charY", Number(e.target.value))}
                    className="w-full accent-purple-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1 font-mono">
                    <span>Hero Circle Scale</span>
                    <span className="text-purple-400 font-bold">
                      {((config.charScale ?? 1.0) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.2"
                    step="0.05"
                    value={config.charScale ?? 1.0}
                    onChange={(e) => handleTextChange("charScale", Number(e.target.value))}
                    className="w-full accent-purple-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Background Artwork & Custom Upload */}
        {activeTab === "art" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#09090b] p-4 rounded-xl border border-blue-500/30 shadow-lg">
              <div>
                <h3 className="text-xs font-extrabold text-blue-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Auto-AI Background for Episode {episode.partNumber}</span>
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Generates cinematic 16:9 gaming artwork for <strong className="text-zinc-200">Episode {episode.partNumber}: {episode.shortTitle || episode.title}</strong>
                </p>
              </div>

              <button
                onClick={autoGenerateEpisodeBackground}
                disabled={loadingAi}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-900/40 transition-all disabled:opacity-50 cursor-pointer shrink-0"
              >
                {loadingAi ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
                ) : (
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                )}
                <span>{loadingAi ? "Generating..." : "Generate AI Episode Background"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
              {/* Dark Overlay Opacity Slider */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1 font-mono">
                  <span>Background Darkening Overlay</span>
                  <span className="text-emerald-400 font-bold">
                    {((config.overlayOpacity ?? 0.35) * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.85"
                  step="0.05"
                  value={config.overlayOpacity ?? 0.35}
                  onChange={(e) => handleTextChange("overlayOpacity", Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              {/* Upload Custom Image */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-400">Upload Custom Image File</label>
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 px-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>Upload Local Image</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


      </div>

      {/* Export & Download Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#09090b] p-4 rounded-xl border border-white/10">
        <div className="flex items-center gap-2">
          <button
            onClick={generateAiThumbnail}
            disabled={loadingAi}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs rounded-lg transition-all shadow-md shadow-blue-900/30 disabled:opacity-50 cursor-pointer"
          >
            {loadingAi ? (
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
            ) : (
              <Sparkles className="w-4 h-4 text-cyan-300" />
            )}
            <span>{loadingAi ? "Generating AI Artwork..." : "Generate AI Thumbnail Art"}</span>
          </button>
          {aiError && (
            <span className="text-xs text-blue-300 flex items-center gap-1 bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20">
              <AlertCircle className="w-3.5 h-3.5 text-blue-400" /> {aiError}
            </span>
          )}
        </div>

        <button
          onClick={downloadSvgAsPng}
          disabled={exportingPng}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-400 hover:bg-blue-300 text-zinc-950 font-bold text-xs rounded-lg transition-colors shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
        >
          {exportingPng ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{exportingPng ? "Preparing 1280x720 PNG..." : "Download 1280x720 PNG"}</span>
        </button>
      </div>
    </div>
  );
};
