import React, { useState } from "react";
import { X, Gamepad2, Sparkles, Clock, Check, User, Target } from "lucide-react";
import { PLAYTHROUGH_TYPES, PlaythroughSeries } from "../types";
import { generateFullPlaythroughSeries } from "../utils/playthroughGenerator";
import { getProtagonistForGame } from "../utils/gameProtagonists";
import { safeSetLocalStorage } from "../utils/storageUtils";

interface NewSeriesModalProps {
  onClose: () => void;
  onAddSeries: (series: PlaythroughSeries) => void;
}

const PRESET_GENRES = [
  "Action / RPG",
  "Action Adventure",
  "Survival Horror",
  "Soulsborne / Soulslike",
  "JRPG / Turn-Based RPG",
  "Open World RPG",
  "First-Person Shooter (FPS)",
  "Action FPS",
  "Platformer / Metroidvania",
  "Strategy / Tactical",
  "Simulation / Management",
  "Fighting / Beat 'em Up",
  "Hack & Slash / Action",
  "MMORPG / Online RPG",
  "Racing / Sports",
  "Puzzle / Story Rich",
  "Stealth / Tactical",
  "Indie / Rogue-like",
  "Custom Genre..."
];

export const NewSeriesModal: React.FC<NewSeriesModalProps> = ({ onClose, onAddSeries }) => {
  const [mode, setMode] = useState<"auto_90_120" | "quick_single">("auto_90_120");

  const [gameTitle, setGameTitle] = useState("");
  const [subtitle, setSubtitle] = useState("100% Walkthrough & Let's Play Series");
  const [badgeText, setBadgeText] = useState("");
  const [isUserBadgeEdited, setIsUserBadgeEdited] = useState(false);
  const [genre, setGenre] = useState("Action / RPG");
  const [isCustomGenre, setIsCustomGenre] = useState(false);
  const [accentColor, setAccentColor] = useState("#38bdf8");

  // Playthrough Type State
  const [playthroughType, setPlaythroughType] = useState<string>("100% Walkthrough");
  const [customType, setCustomType] = useState<string>("");

  // 90-120 Min Generator Specific State
  const [playtimeHours, setPlaytimeHours] = useState<number>(20);
  const [targetEpisodeMins, setTargetEpisodeMins] = useState<number>(105); // 90 to 120 mins
  const [overrideEpisodeCount, setOverrideEpisodeCount] = useState<string>("");
  const [playthroughStyle, setPlaythroughStyle] = useState<
    "100% Completion & Collectibles" | "Story Walkthrough & Bosses" | "Ongoing Playthrough" | "Speedrun & Secrets"
  >("100% Completion & Collectibles");

  // Calculate episode count
  const calculatedCount = Math.max(1, Math.ceil((playtimeHours * 60) / targetEpisodeMins));
  const finalEpisodeCount = overrideEpisodeCount && parseInt(overrideEpisodeCount, 10) > 0
    ? parseInt(overrideEpisodeCount, 10)
    : calculatedCount;

  const quickGamePresets = [
    { title: "Silent Hill 2 Remake", genre: "Survival Horror", color: "#a855f7" },
    { title: "Elden Ring: Shadow of Erdtree", genre: "Soulsborne", color: "#f59e0b" },
    { title: "Black Myth: Wukong", genre: "Action RPG", color: "#ef4444" },
    { title: "Final Fantasy VII Rebirth", genre: "JRPG", color: "#10b981" },
    { title: "Metroid Prime 4: Beyond", genre: "Action FPS", color: "#38bdf8" },
    { title: "Dragon's Dogma 2", genre: "Open World RPG", color: "#ec4899" },
  ];

  const handleSelectPreset = (preset: { title: string; genre: string; color: string }) => {
    setGameTitle(preset.title);
    setBadgeText(preset.title.toUpperCase());
    setGenre(preset.genre);
    setIsCustomGenre(false);
    setAccentColor(preset.color);
  };

  const getEffectivePlaythroughType = (): string => {
    if (playthroughType === "Other") {
      return customType.trim() || "Custom Playthrough";
    }
    return playthroughType;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameTitle.trim()) return;

    const finalPlaythroughType = getEffectivePlaythroughType();

    if (mode === "auto_90_120") {
      const { series, bosses, loot } = generateFullPlaythroughSeries({
        gameTitle: gameTitle.trim(),
        subtitle: subtitle.trim() || `${finalPlaythroughType} Series`,
        badgeText: badgeText.trim().toUpperCase() || gameTitle.trim().toUpperCase(),
        genre: genre,
        accentColor: accentColor,
        totalPlaytimeHours: playtimeHours,
        targetEpisodeMinutes: targetEpisodeMins,
        numEpisodes: finalEpisodeCount,
        playthroughType: finalPlaythroughType,
        playthroughStyle: playthroughStyle,
      });

      // Save generated bosses & loot directly to local storage for BossLootCatalogModal
      safeSetLocalStorage(`yt_bosses_${series.id}`, bosses);
      safeSetLocalStorage(`yt_loot_${series.id}`, loot);

      onAddSeries(series);
    } else {
      // Quick single episode mode
      const newSeries: PlaythroughSeries = {
        id: `series-${Date.now()}`,
        gameTitle: gameTitle.trim(),
        subtitle: subtitle.trim() || `${finalPlaythroughType} Series`,
        badgeText: badgeText.trim().toUpperCase() || gameTitle.trim().toUpperCase(),
        accentColor,
        genre,
        playthroughType: finalPlaythroughType,
        episodes: [
          {
            id: Date.now(),
            partNumber: 1,
            world: "Episode 1",
            title: `${gameTitle.trim()} #01 - THE ADVENTURE BEGINS! | ${finalPlaythroughType}`,
            shortTitle: "Episode 1 Beginnings",
            altTitles: [`Playing ${gameTitle.trim()} - ${finalPlaythroughType} Ep 1`],
            estDurationMinutes: 105,
            startPoint: "Game Opening & Tutorial",
            endPoint: "First Boss & Main Quest Unlocked",
            keyEvents: ["Character Creation & Opening Cutscene", "First Area Exploration & Side Quests", "First Boss Fight & Main Quest Unlocked"],
            keyItemsAndEspers: ["Starter Sword", "Health Potion"],
            partyMembers: ["Main Hero"],
            status: "not_started",
            description: `Welcome to Episode 1 of our ${gameTitle.trim()} ${finalPlaythroughType} (90-120 Min Longform Walkthrough)!\n\nTIMESTAMPS:\n00:00 - Introduction & Character Creation\n22:15 - First Area Exploration & Side Quests\n48:30 - Midgame Dungeon & Encounters\n1:15:00 - First Major Boss Battle\n1:35:00 - Main Quest Unlocked & Outro\n\n#LetsPlay #${gameTitle.replace(/\s+/g, "")} #${finalPlaythroughType.replace(/\s+/g, "")}`,
            chapters: [
              { timestamp: "00:00", title: "Introduction & Opening" },
              { timestamp: "22:15", title: "First Area Exploration & Side Quests" },
              { timestamp: "48:30", title: "Dungeon & Key Encounters" },
              { timestamp: "1:15:00", title: "First Major Boss Fight" },
              { timestamp: "1:35:00", title: "Main Quest Unlocked & Conclusion" }
            ],
            tags: [gameTitle.trim(), finalPlaythroughType, "Lets Play", "Walkthrough", "Gaming"],
            thumbnailConfig: {
              backgroundPreset: "vector",
              featuredCharacter: "Hero",
              overlayText: "THE JOURNEY BEGINS!",
              subText: `EPISODE 01 • ${finalPlaythroughType.toUpperCase()}`,
              themeColor: accentColor
            },
            bossStrategies: ["Keep healing potions equipped!"],
            equipmentNotes: "Explore the starter town thoroughly."
          }
        ]
      };
      onAddSeries(newSeries);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#121212] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="p-5 bg-[#09090b] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                <span>Playthrough Series Generator</span>
                <span className="text-[10px] font-mono bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded uppercase">
                  90-120 Min Format
                </span>
              </h2>
              <p className="text-xs text-zinc-400">Generate a full longform playthrough schedule with timestamps, descriptions & loot</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white bg-[#18181b] hover:bg-[#27272a] rounded-lg transition-colors border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="p-3 bg-[#0a0a0a] border-b border-white/10 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode("auto_90_120")}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
              mode === "auto_90_120"
                ? "bg-blue-500/10 text-blue-300 border-blue-500/40 shadow-sm"
                : "bg-[#121212] text-zinc-400 border-white/5 hover:text-zinc-200"
            }`}
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Full 90-120 Min Series Generator</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("quick_single")}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
              mode === "quick_single"
                ? "bg-amber-500/10 text-amber-300 border-amber-500/40 shadow-sm"
                : "bg-[#121212] text-zinc-400 border-white/5 hover:text-zinc-200"
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-amber-400" />
            <span>Single Episode Starter</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-2">Quick Game Title Presets:</label>
            <div className="flex flex-wrap gap-1.5">
              {quickGamePresets.map((preset) => (
                <button
                  type="button"
                  key={preset.title}
                  onClick={() => handleSelectPreset(preset)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    gameTitle === preset.title
                      ? "bg-blue-500/20 text-blue-200 border-blue-400/50 font-semibold"
                      : "bg-[#18181b] text-zinc-400 border-white/10 hover:border-white/20 hover:text-zinc-200"
                  }`}
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>

          {/* Game Title & Genre Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Game Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Silent Hill 2 Remake, Elden Ring, Metroid Prime 4"
                value={gameTitle}
                onChange={(e) => {
                  const val = e.target.value;
                  setGameTitle(val);
                  if (!isUserBadgeEdited) {
                    setBadgeText(val.toUpperCase());
                  }
                }}
                className="w-full bg-[#09090b] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-400"
              />
              {gameTitle.trim() && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-purple-300 font-medium bg-purple-950/30 border border-purple-500/20 px-2.5 py-1 rounded-md">
                  <User className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                  <span>Auto Character: <strong className="text-purple-200">{getProtagonistForGame(gameTitle)}</strong></span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Genre / Category</label>
              <select
                value={PRESET_GENRES.includes(genre) && !isCustomGenre ? genre : "Custom Genre..."}
                onChange={(e) => {
                  if (e.target.value !== "Custom Genre...") {
                    setGenre(e.target.value);
                    setIsCustomGenre(false);
                  } else {
                    setIsCustomGenre(true);
                  }
                }}
                className="w-full bg-[#09090b] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-400"
              >
                {PRESET_GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              {(isCustomGenre || (!PRESET_GENRES.includes(genre) && genre !== "")) && (
                <input
                  type="text"
                  placeholder="Type custom genre name..."
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-[#09090b] border border-white/10 rounded-lg px-3.5 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-blue-400 mt-2"
                />
              )}
            </div>
          </div>

          {/* Playthrough Type Selection */}
          <div className="bg-[#09090b] p-3.5 rounded-xl border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-blue-400" />
                <span>Playthrough Type / Format *</span>
              </label>
              <span className="text-[11px] font-mono text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                Active: {getEffectivePlaythroughType()}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PLAYTHROUGH_TYPES.map((typeOption) => (
                <button
                  type="button"
                  key={typeOption}
                  onClick={() => setPlaythroughType(typeOption)}
                  className={`py-2 px-2.5 rounded-lg text-xs font-semibold text-center transition-all border ${
                    playthroughType === typeOption
                      ? "bg-blue-500/20 text-blue-200 border-blue-400 shadow-sm font-bold"
                      : "bg-[#18181b] text-zinc-400 border-white/10 hover:text-zinc-200"
                  }`}
                >
                  {typeOption}
                </button>
              ))}
            </div>
            {playthroughType === "Other" && (
              <div className="mt-2">
                <input
                  type="text"
                  required
                  placeholder="Enter custom playthrough type (e.g. Nuzlocke Challenge, No Damage Walkthrough, Level 1 Only)"
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  className="w-full bg-[#18181b] border border-blue-400/50 rounded-lg px-3.5 py-2 text-xs font-medium text-blue-200 focus:outline-none placeholder:text-zinc-500"
                />
              </div>
            )}
          </div>

          {/* 90-120 Min Specific Controls */}
          {mode === "auto_90_120" && (
            <div className="p-4 bg-[#09090b] border border-blue-500/20 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  90 - 120 Minute Longform Episode Calculator
                </span>
                <span className="text-[11px] text-zinc-400 font-mono">
                  {playtimeHours} Hours ÷ {targetEpisodeMins} Mins = <strong className="text-blue-300">{finalEpisodeCount} Episodes</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Total Playtime Hours */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Est. Total Game Playtime</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="300"
                      value={playtimeHours}
                      onChange={(e) => setPlaytimeHours(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      className="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-1.5 text-sm font-bold text-zinc-100 focus:outline-none focus:border-blue-400"
                    />
                    <span className="text-xs text-zinc-400 font-semibold">Hours</span>
                  </div>
                </div>

                {/* Target Episode Duration */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Target Video Format</label>
                  <select
                    value={targetEpisodeMins}
                    onChange={(e) => setTargetEpisodeMins(parseInt(e.target.value, 10))}
                    className="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-zinc-100 focus:outline-none focus:border-blue-400"
                  >
                    <option value={90}>90 Minutes / Ep</option>
                    <option value={105}>105 Minutes / Ep (Average)</option>
                    <option value={120}>120 Minutes (2 Hours) / Ep</option>
                  </select>
                </div>

                {/* Number of Episodes Needed (Override) */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Episodes Needed (Override)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder={`Calculated: ${calculatedCount}`}
                    value={overrideEpisodeCount}
                    onChange={(e) => setOverrideEpisodeCount(e.target.value)}
                    className="w-full bg-[#18181b] border border-white/10 rounded-lg px-3 py-1.5 text-sm font-bold text-blue-300 placeholder-zinc-500 focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              {/* Quick Playtime Buttons */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-500 font-medium">Quick Playtimes:</span>
                {[10, 15, 25, 40, 60, 100].map((hrs) => (
                  <button
                    type="button"
                    key={hrs}
                    onClick={() => {
                      setPlaytimeHours(hrs);
                      setOverrideEpisodeCount("");
                    }}
                    className={`px-2 py-0.5 rounded border text-[11px] font-mono transition-colors ${
                      playtimeHours === hrs && !overrideEpisodeCount
                        ? "bg-blue-500 text-zinc-950 border-blue-400 font-bold"
                        : "bg-[#18181b] text-zinc-400 border-white/10 hover:text-white"
                    }`}
                  >
                    {hrs}h
                  </button>
                ))}
              </div>

              {/* Playthrough Focus Style */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Playthrough Focus & Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "100% Completion & Collectibles",
                    "Story Walkthrough & Bosses",
                    "Ongoing Playthrough",
                    "Speedrun & Secrets",
                  ].map((style) => (
                    <button
                      type="button"
                      key={style}
                      onClick={() => setPlaythroughStyle(style as any)}
                      className={`py-1.5 px-2.5 rounded-lg text-xs text-left font-medium transition-all border ${
                        playthroughStyle === style
                          ? "bg-blue-500/20 text-blue-200 border-blue-400/50 font-bold"
                          : "bg-[#18181b] text-zinc-400 border-white/10 hover:text-zinc-200"
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary Box */}
              <div className="bg-blue-950/20 border border-blue-500/30 rounded-lg p-3 text-xs text-blue-200/90 space-y-1">
                <div className="font-bold text-blue-300 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-blue-400" />
                  <span>Series Generation Ready:</span>
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-300">
                  Will generate <strong>{finalEpisodeCount} episodes</strong> (~{targetEpisodeMins} mins each) covering{" "}
                  <strong>{playtimeHours} hours</strong> of {gameTitle || "game"} content. Includes longform chapter timestamps,
                  YouTube SEO descriptions, episode start/end points, and populates the <strong>100% Boss & Loot Catalog</strong>!
                </p>
              </div>
            </div>
          )}

          {/* Subtitle & Branding */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Series Subtitle</label>
              <input
                type="text"
                placeholder="e.g. 100% Walkthrough & Let's Play Series"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full bg-[#09090b] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Thumbnail Badge Text</label>
              <input
                type="text"
                placeholder="e.g. SILENT HILL 2"
                value={badgeText}
                onChange={(e) => {
                  setIsUserBadgeEdited(true);
                  setBadgeText(e.target.value);
                }}
                className="w-full bg-[#09090b] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-400 uppercase font-mono"
              />
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2">Series Accent Theme Color</label>
            <div className="flex items-center gap-2">
              {["#38bdf8", "#f59e0b", "#eab308", "#10b981", "#a855f7", "#ef4444", "#ec4899", "#6366f1"].map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setAccentColor(color)}
                  className={`w-8 h-8 rounded-xl border-2 transition-transform ${
                    accentColor === color ? "scale-110 border-white ring-2 ring-blue-400" : "border-transparent opacity-80"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
            <span className="text-xs text-zinc-500">
              {mode === "auto_90_120" ? `${finalEpisodeCount} Episodes • 90-120 Min Format` : "1 Starter Episode"}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-[#18181b] hover:bg-[#27272a] text-zinc-300 rounded-lg text-xs font-semibold border border-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-zinc-950 rounded-lg text-xs font-bold transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{mode === "auto_90_120" ? `Generate ${finalEpisodeCount}-Episode Playthrough` : "Create Single Episode Series"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

