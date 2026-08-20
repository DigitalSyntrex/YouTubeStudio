import React, { useState, useEffect } from "react";
import { resolveAvatarUrl, DEFAULT_CREATOR_AVATARS } from "../data/defaultAvatars";
import {
  Gamepad2,
  Swords,
  Shield,
  Bot,
  Zap,
  Flame,
  Trophy,
  Skull,
  Car,
  Compass,
  Crown,
  Sparkles,
  Layers,
  Crosshair,
  Heart,
  Eye,
  Server,
  TreePine,
  Activity
} from "lucide-react";

interface RobustAvatarImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  presetId?: string;
  fallbackId?: string;
}

// Icon mapping based on preset ID
const PRESET_ICONS: Record<string, React.ElementType> = {
  cyber: Zap,
  action: Flame,
  brawler: Swords,
  fighting: Swords,
  scispace: Compass,
  rpg: Crown,
  soulslike: Skull,
  fps: Crosshair,
  dungcrawl: Layers,
  deckbuilder: Layers,
  openworld: Compass,
  platformer: Sparkles,
  puzzle: Activity,
  racing: Car,
  horror: Skull,
  survival: TreePine,
  level: Trophy,
  joystick: Gamepad2,
  robot: Bot,
  mecha: Bot,
  retro: Gamepad2,
  sword: Swords,
  shield: Shield,
  glove: Swords,
  car: Car,
  cell: Activity,
  server: Server,
  shard: Sparkles,
  heart: Heart,
  eye: Eye,
  crown: Crown,
  dragon: Flame,
  blitz: Zap,
  tree: TreePine,
  trophy: Trophy,
  compass: Compass,
};

export const RobustAvatarImg: React.FC<RobustAvatarImgProps> = ({
  src,
  presetId,
  fallbackId = "cyber",
  alt,
  className = "",
  onError,
  ...props
}) => {
  const [failStage, setFailStage] = useState<number>(0);

  useEffect(() => {
    setFailStage(0);
  }, [src]);

  // Extract preset ID
  let extractedId = (presetId || "").toLowerCase();
  if (!extractedId && src) {
    const match = src.match(/([a-zA-Z0-9_-]+)(?:-[a-zA-Z0-9_-]+)?\.(?:png|jpg|jpeg|webp|svg)/i) || src.match(/([a-zA-Z0-9_-]+)$/i);
    if (match && match[1]) {
      extractedId = match[1].split("-")[0].toLowerCase();
    }
  }
  const cleanPresetId = (extractedId || fallbackId || "cyber").toLowerCase().replace(/[^a-z0-9_-]/g, "");

  // Find preset info for color and icon
  const presetInfo = DEFAULT_CREATOR_AVATARS.find((p) => p.id.toLowerCase() === cleanPresetId);
  const accentColor = presetInfo?.color || "#3b82f6";
  const FallbackIcon = PRESET_ICONS[cleanPresetId] || Gamepad2;

  // Determine current attempt src based on failure stages
  let currentSrc = resolveAvatarUrl(src);
  if (failStage === 1) {
    currentSrc = `/api/avatars/${cleanPresetId}.png`;
  } else if (failStage === 2) {
    currentSrc = `/${cleanPresetId}.png`;
  }

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setFailStage((prev) => prev + 1);
    if (onError) {
      onError(e);
    }
  };

  if (failStage >= 3) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center text-white relative overflow-hidden select-none ${className}`}
        style={{
          background: `linear-gradient(135deg, ${accentColor}33 0%, #0c101d 100%)`,
          border: `1px solid ${accentColor}44`
        }}
      >
        <FallbackIcon className="w-1/2 h-1/2" style={{ color: accentColor }} />
        <span className="text-[8px] font-black uppercase tracking-wider mt-0.5 opacity-90 truncate max-w-[90%]" style={{ color: accentColor }}>
          {presetInfo?.name || cleanPresetId}
        </span>
      </div>
    );
  }

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt || presetInfo?.name || "Creator Avatar"}
      className={className}
      onError={handleError}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
    />
  );
};

