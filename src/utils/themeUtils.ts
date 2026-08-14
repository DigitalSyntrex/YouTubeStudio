/**
 * Theme management utility supporting live theme management, persistence,
 * and CSS root variable/class injection.
 */

export type AppThemeId =
  | "midnight"
  | "dark_obsidian"
  | "dark_arcade"
  | "dark_stealth";

export interface ThemeConfig {
  id: AppThemeId;
  name: string;
  description: string;
  previewBg: string;
  previewCard: string;
  previewAccent: string;
  isDark: boolean;
  classes: {
    rootBg: string;
    cardBg: string;
    cardHeaderBg: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    accentGlow: string;
  };
}

export const THEME_CONFIGS: Record<AppThemeId, ThemeConfig> = {
  midnight: {
    id: "midnight",
    name: "Midnight Slate",
    description: "Deep oceanic slate blue canvas with indigo borders and clean cyan details.",
    previewBg: "#070c1e",
    previewCard: "#0d1738",
    previewAccent: "#38bdf8",
    isDark: true,
    classes: {
      rootBg: "bg-[#070c1e]",
      cardBg: "bg-[#0d1738]",
      cardHeaderBg: "bg-[#0a122e]",
      border: "border-blue-500/30",
      textPrimary: "text-slate-100",
      textSecondary: "text-blue-300/80",
      accentGlow: "shadow-blue-500/20",
    },
  },
  dark_obsidian: {
    id: "dark_obsidian",
    name: "Obsidian Charcoal",
    description: "Sleek charcoal dark mode with high contrast red & gold gaming accents.",
    previewBg: "#0f0f12",
    previewCard: "#18181f",
    previewAccent: "#ef4444",
    isDark: true,
    classes: {
      rootBg: "bg-[#0f0f12]",
      cardBg: "bg-[#18181f]",
      cardHeaderBg: "bg-[#121217]",
      border: "border-zinc-800",
      textPrimary: "text-zinc-100",
      textSecondary: "text-zinc-400",
      accentGlow: "shadow-red-500/15",
    },
  },
  dark_arcade: {
    id: "dark_arcade",
    name: "Dark Arcade Cyber",
    description: "Vibrant synthwave aesthetic with deep violet canvas & neon pink highlights.",
    previewBg: "#0a0a14",
    previewCard: "#121224",
    previewAccent: "#d946ef",
    isDark: true,
    classes: {
      rootBg: "bg-[#0a0a14]",
      cardBg: "bg-[#121224]",
      cardHeaderBg: "bg-[#0e0e1c]",
      border: "border-purple-900/40",
      textPrimary: "text-purple-100",
      textSecondary: "text-purple-300/70",
      accentGlow: "shadow-fuchsia-500/20",
    },
  },
  dark_stealth: {
    id: "dark_stealth",
    name: "Stealth OLED Black",
    description: "True OLED black canvas for maximum visual contrast and minimal battery drain.",
    previewBg: "#000000",
    previewCard: "#0d0d0d",
    previewAccent: "#10b981",
    isDark: true,
    classes: {
      rootBg: "bg-black",
      cardBg: "bg-[#0d0d0d]",
      cardHeaderBg: "bg-[#141414]",
      border: "border-zinc-800",
      textPrimary: "text-zinc-100",
      textSecondary: "text-zinc-400",
      accentGlow: "shadow-emerald-500/15",
    },
  },
};

const THEME_STORAGE_KEY = "yt_app_theme";

/**
 * Gets currently saved theme from localStorage, defaulting to "midnight".
 */
export function getSavedTheme(): AppThemeId {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as AppThemeId;
    if (saved && THEME_CONFIGS[saved]) {
      return saved;
    }
  } catch (err) {
    // fallback
  }
  return "midnight";
}

/**
 * Saves theme to localStorage and applies data attribute to document root.
 */
export function saveTheme(themeId: AppThemeId): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
    applyThemeToDocument(themeId);
  } catch (err) {
    console.error("Failed to save theme to localStorage", err);
  }
}

/**
 * Applies data-theme attribute on <html> element for CSS variable cascading.
 */
export function applyThemeToDocument(themeId: AppThemeId = "midnight"): void {
  const root = document.documentElement;
  root.setAttribute("data-theme", themeId);
  root.classList.remove("light");
  root.classList.add("dark");
}

