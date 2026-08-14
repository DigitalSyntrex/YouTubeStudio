import React, { useState } from "react";
import { X, Sparkles, Copy, Check, Image, Wand2, RefreshCw, Sliders } from "lucide-react";
import { Episode } from "../types";

interface AiPromptCrafterModalProps {
  isOpen: boolean;
  onClose: () => void;
  episodes: Episode[];
  selectedEpisode?: Episode | null;
}

export const AiPromptCrafterModal: React.FC<AiPromptCrafterModalProps> = ({
  isOpen,
  onClose,
  episodes,
  selectedEpisode,
}) => {
  if (!isOpen) return null;

  const currentEp = selectedEpisode || episodes[0];

  const [character, setCharacter] = useState<string>("Clive Rosfield in Dark Knight Armor");
  const [pose, setPose] = useState<string>("Summoning fiery Eikon Ifrit flame aura, sword drawn");
  const [environment, setEnvironment] = useState<string>("Burning ruins of Phoenix Gate sanctuary under storm clouds");
  const [artStyle, setArtStyle] = useState<string>("Hyper-detailed JRPG key art, Unreal Engine 5 render");
  const [lighting, setLighting] = useState<string>("Cinematic volumetric flame glow, ray-traced rim lighting");
  const [framing, setFraming] = useState<string>("Dynamic low-angle action shot, 8k resolution");
  const [aspectRatio, setAspectRatio] = useState<string>("--ar 16:9 --v 6.0 --style raw");

  const [copied, setCopied] = useState<boolean>(false);

  const rawPrompt = `${character}, ${pose}, ${environment}, ${lighting}, ${framing}, ${artStyle} ${aspectRatio}`;

  const presetPrompts = [
    {
      title: "Ifrit vs Phoenix Battle",
      prompt: "Epic Eikon battle, Dark Eikon Ifrit surrounded by lava vs fiery Phoenix in night sky, volcanic explosion, hyper-detailed dark fantasy JRPG artwork, cinematic volumetric lighting, ray tracing --ar 16:9 --v 6.0"
    },
    {
      title: "Clive Rosfield Limit Break",
      prompt: "Clive Rosfield unleashing fiery Limit Break aura, glowing red eyes, wielding Invictus sword, burning embers floating in dark air, 8k Unreal Engine 5 render, dramatic close-up action --ar 16:9 --v 6.0"
    },
    {
      title: "Eikon Bahamut Megaflare",
      prompt: "Dragon King Eikon Bahamut soaring in night stratosphere, glowing blue celestial wings, casting radiant Megaflare beam over crystal city, hyper-epic high-fantasy digital painting --ar 16:9 --v 6.0"
    },
    {
      title: "Jill Warrick & Shiva",
      prompt: "Jill Warrick surrounded by icy frost aura, summoning Eikon Shiva ice crystal needles, snowy blizzard peak, elegant dark JRPG character portrait, dramatic rim light --ar 16:9 --v 6.0"
    }
  ];

  const handleCopy = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#121215] border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-[#18181c]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
              <Wand2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                AI Thumbnail Prompt Crafter
                <span className="text-xs bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/30 font-medium">
                  Midjourney v6 & DALL-E 3
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Craft prompt formulas for YouTube 1280x720 gaming thumbnail artwork.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-zinc-200">
          {/* Prompt Parameters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#18181c] p-5 rounded-xl border border-zinc-800">
            <div>
              <label className="text-xs font-bold text-zinc-300 mb-1 block">Character / Subject:</label>
              <input
                type="text"
                value={character}
                onChange={(e) => setCharacter(e.target.value)}
                className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 mb-1 block">Action / Pose:</label>
              <input
                type="text"
                value={pose}
                onChange={(e) => setPose(e.target.value)}
                className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 mb-1 block">Environment / Background:</label>
              <input
                type="text"
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 mb-1 block">Lighting & Particle FX:</label>
              <input
                type="text"
                value={lighting}
                onChange={(e) => setLighting(e.target.value)}
                className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 mb-1 block">Art Style / Engine:</label>
              <select
                value={artStyle}
                onChange={(e) => setArtStyle(e.target.value)}
                className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Hyper-detailed JRPG key art, Unreal Engine 5 render">Unreal Engine 5 JRPG Key Art</option>
                <option value="Anime movie screenshot, Studio Ghibli, Makoto Shinkai style">Stylized Anime Key Art</option>
                <option value="Photorealistic cinematic dark fantasy film still, 35mm lens">Photorealistic Dark Fantasy Film</option>
                <option value="3D Octane render, neon glowing cybernetic effects">3D Octane Render Cyber Neon</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-300 mb-1 block">Camera Framing & Parameters:</label>
              <input
                type="text"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full bg-black/50 border border-zinc-700 rounded-lg p-2.5 text-xs font-mono text-purple-400 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Prompt Output Card */}
          <div className="bg-black/60 p-4 rounded-xl border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Generated Midjourney / DALL-E Prompt:
              </span>
              <button
                onClick={() => handleCopy(rawPrompt)}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 shadow-lg shadow-purple-900/30 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied Prompt!" : "Copy Prompt String"}
              </button>
            </div>
            <textarea
              readOnly
              value={rawPrompt}
              rows={3}
              className="w-full bg-black/40 border border-zinc-800 rounded-lg p-3 text-xs font-mono text-zinc-200 focus:outline-none select-all"
            />
          </div>

          {/* Quick Presets */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
              High-CTR Thumbnail Art Presets:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {presetPrompts.map((preset, idx) => (
                <div key={idx} className="bg-[#18181c] p-3.5 rounded-xl border border-zinc-800 space-y-2 hover:border-purple-500/40 transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{preset.title}</span>
                    <button
                      onClick={() => handleCopy(preset.prompt)}
                      className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-mono line-clamp-2">
                    {preset.prompt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
