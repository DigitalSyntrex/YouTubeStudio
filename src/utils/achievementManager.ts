import { Achievement, AchievementUnlockToastData } from "../types";
import { INITIAL_ACHIEVEMENTS } from "../data/achievementsData";

const STORAGE_KEY = "playthrough_studio_achievements_v1";

// Web Audio API Retro Unlock Sound Synthesizer
export function playAchievementUnlockSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Play a cheerful 4-note ascending chord (G4 -> C5 -> E5 -> G5)
    const notes = [392.00, 523.25, 659.25, 783.99]; 
    const times = [0, 0.08, 0.16, 0.24];
    
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + times[idx]);
      
      gain.gain.setValueAtTime(0.25, ctx.currentTime + times[idx]);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + times[idx] + 0.35);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + times[idx]);
      osc.stop(ctx.currentTime + times[idx] + 0.36);
    });
  } catch (err) {
    console.warn("Web Audio API not supported or blocked by user gesture:", err);
  }
}

// Load achievements from localStorage or initialize with defaults
export function loadAchievements(): Achievement[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ACHIEVEMENTS));
      return INITIAL_ACHIEVEMENTS;
    }
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ACHIEVEMENTS));
      return INITIAL_ACHIEVEMENTS;
    }
    
    // Merge new achievements if initial list has been expanded
    const merged = INITIAL_ACHIEVEMENTS.map((initial) => {
      const existing = parsed.find((p) => p && p.id === initial.id);
      return existing ? { ...initial, ...existing } : initial;
    });
    
    return merged;
  } catch (e) {
    console.error("Failed to load achievements from localStorage", e);
    return INITIAL_ACHIEVEMENTS;
  }
}

// Save achievements state
export function saveAchievements(achievements: Achievement[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
  } catch (e) {
    console.error("Failed to save achievements to localStorage", e);
  }
}

// Total Gamerscore calculation
export function calculateGamerscore(achievements: Achievement[]): {
  unlockedScore: number;
  totalScore: number;
  unlockedCount: number;
  totalCount: number;
  percentage: number;
} {
  let unlockedScore = 0;
  let totalScore = 0;
  let unlockedCount = 0;

  achievements.forEach((ach) => {
    totalScore += ach.points;
    if (ach.unlocked) {
      unlockedScore += ach.points;
      unlockedCount++;
    }
  });

  const totalCount = achievements.length;
  const percentage = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return { unlockedScore, totalScore, unlockedCount, totalCount, percentage };
}

// Trigger progress or unlock for an achievement ID
export function triggerAchievement(
  achievementId: string,
  increment: number = 1,
  onUnlockCallback?: (data: AchievementUnlockToastData) => void
): Achievement[] {
  const current = loadAchievements();
  let updated = false;
  let unlockedToast: AchievementUnlockToastData | null = null;

  const nextList = current.map((ach) => {
    if (ach.id !== achievementId || ach.unlocked) return ach;

    const newProgress = Math.min(ach.maxProgress, ach.progress + increment);
    const isNowUnlocked = newProgress >= ach.maxProgress;

    if (newProgress !== ach.progress || isNowUnlocked) {
      updated = true;
      const updatedAch: Achievement = {
        ...ach,
        progress: newProgress,
        unlocked: isNowUnlocked,
        unlockedAt: isNowUnlocked ? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ach.unlockedAt,
      };

      if (isNowUnlocked) {
        unlockedToast = {
          achievement: updatedAch,
          timestamp: Date.now(),
        };
      }

      return updatedAch;
    }

    return ach;
  });

  if (updated) {
    saveAchievements(nextList);
  }

  if (unlockedToast) {
    playAchievementUnlockSound();
    
    // Broadcast custom window event so UI can display live toast popup
    const event = new CustomEvent("achievement_unlocked", { detail: unlockedToast });
    window.dispatchEvent(event);

    if (onUnlockCallback) {
      onUnlockCallback(unlockedToast);
    }
  }

  return nextList;
}
