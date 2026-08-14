import { VideoStats } from "../types";

export interface PerformanceBadge {
  id: string;
  label: string;
  iconType: "trophy" | "flame" | "star" | "heart" | "zap" | "trending" | "message" | "award";
  colorClass: string;
  description: string;
}

export const getEpisodePerformanceBadges = (stats?: VideoStats): PerformanceBadge[] => {
  if (!stats) return [];
  const badges: PerformanceBadge[] = [];

  const { views, likes, comments } = stats;

  // 1. Views Milestones
  if (views >= 10000) {
    badges.push({
      id: "views-10k",
      label: "10K+ Views",
      iconType: "trophy",
      colorClass: "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-amber-950/50",
      description: "Massive channel milestone: Over 10,000 views on YouTube!",
    });
  } else if (views >= 5000) {
    badges.push({
      id: "views-5k",
      label: "5K+ Views",
      iconType: "flame",
      colorClass: "bg-red-500/20 text-red-400 border-red-500/50 shadow-red-950/40",
      description: "Hot episode: Reached over 5,000 views!",
    });
  } else if (views >= 3000) {
    badges.push({
      id: "top-performer",
      label: "Top Performer",
      iconType: "award",
      colorClass: "bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-amber-950/50",
      description: "Outstanding channel performance with 3,000+ views!",
    });
  } else if (views >= 1000) {
    badges.push({
      id: "views-1k",
      label: "1K Views",
      iconType: "flame",
      colorClass: "bg-orange-500/20 text-orange-400 border-orange-500/40",
      description: "Milestone unlocked: Passed 1,000 total views!",
    });
  } else if (views >= 500) {
    badges.push({
      id: "views-500",
      label: "500+ Views",
      iconType: "trending",
      colorClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
      description: "Growing audience: Reached over 500 views!",
    });
  }

  // 2. High Engagement / Approval Rate
  const likeRate = views > 0 ? likes / views : 0;
  if (likes >= 200) {
    badges.push({
      id: "viral-likes",
      label: "200+ Likes",
      iconType: "heart",
      colorClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50",
      description: "High audience appreciation with over 200 likes!",
    });
  } else if (likeRate >= 0.06 && likes >= 30) {
    badges.push({
      id: "high-approval",
      label: "High Approval 💖",
      iconType: "heart",
      colorClass: "bg-rose-500/20 text-rose-300 border-rose-500/50",
      description: "Exceptional like-to-view ratio (>6% audience approval)!",
    });
  } else if (likes >= 100) {
    badges.push({
      id: "likes-100",
      label: "100+ Likes",
      iconType: "star",
      colorClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
      description: "Passed 100 total likes!",
    });
  }

  // 3. High Comment / Community Engagement
  if (comments >= 50) {
    badges.push({
      id: "community-hub",
      label: "Discussion Hub",
      iconType: "message",
      colorClass: "bg-purple-500/20 text-purple-300 border-purple-500/50",
      description: "Extremely active comment section with 50+ discussions!",
    });
  } else if (comments >= 20) {
    badges.push({
      id: "active-chat",
      label: "Active Chat 💬",
      iconType: "message",
      colorClass: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
      description: "Highly engaged viewers leaving over 20 comments!",
    });
  }

  // 4. All-Rounder / Fan Favorite
  if (views >= 2000 && likes >= 120 && comments >= 25) {
    badges.push({
      id: "fan-favorite",
      label: "Fan Favorite ⭐",
      iconType: "star",
      colorClass: "bg-gradient-to-r from-amber-500/25 to-red-500/25 text-amber-200 border-amber-400/50 shadow-md",
      description: "Top Tier: High views, likes, and active comment section!",
    });
  }

  return badges;
};
