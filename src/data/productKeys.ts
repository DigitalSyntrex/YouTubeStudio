import { ProductKey } from "../types";

// Helper function to validate key format: DPG + 6 digits + 2 letters + 6 digits
export function isValidProductKeyFormat(key: string): boolean {
  if (!key) return false;
  const clean = key.trim().toUpperCase();
  return /^DPG\d{6}[A-Z]{2}\d{6}$/.test(clean);
}

// Pre-generated 50 Seventy-Two Hour Trial Keys (72-Hour Studio Pass)
export const TRIAL_72H_KEYS: ProductKey[] = [
  { key: "DPG456852DS754563", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG789112DD123258", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG159750FG983456", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG284910AK739102", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG593821BL482019", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG920147CM391827", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG381920DN481029", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG740192EP592810", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG184029FR391048", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG639201GT582910", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG492018HY740192", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG839102JX492018", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG294810KZ391028", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG750192LQ482019", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG194820MV739104", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG683019NW482910", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG392018PX740192", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG849201QZ391048", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG502918RA482019", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG918273SB592810", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG283910TC683920", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG749201UD740192", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG391048VE839102", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG820193WF920148", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG491028XG194820", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG602918YH283910", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG184920ZJ392018", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG739102KL482910", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG294019MN592810", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG850192PQ683920", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG402918RS740192", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG918203TU839102", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG382910VW920148", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG740182XY194820", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG194830ZA283910", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG682910BC392018", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG391028DE482910", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG849102FG592810", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG502819HJ683920", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG918374KL740192", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG283019MN839102", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG749102PQ920148", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG391820RS194820", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG820391TU283910", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG491820VW392018", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG602819XY482910", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG184930ZA592810", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG739201BC683920", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG294820DE740192", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG850291FG839102", planId: "trial-72h", tier: "trial", planName: "72-Hour Studio Pass", durationDays: 3, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
];

// Pre-generated 20 One-Month Subscription Keys (Creator Monthly Pass - 30 Days)
export const MONTHLY_30D_KEYS: ProductKey[] = [
  { key: "DPG983412MN562914", planId: "monthly-30d", tier: "monthly", planName: "Creator Monthly Pass", durationDays: 30, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG274819KL391048", planId: "monthly-30d", tier: "monthly", planName: "Creator Monthly Pass", durationDays: 30, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG619284PQ740192", planId: "monthly-30d", tier: "monthly", planName: "Creator Monthly Pass", durationDays: 30, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG382019RS839102", planId: "monthly-30d", tier: "monthly", planName: "Creator Monthly Pass", durationDays: 30, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG740192TV920148", planId: "monthly-30d", tier: "monthly", planName: "Creator Monthly Pass", durationDays: 30, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG194820WX194820", planId: "monthly-30d", tier: "monthly", planName: "Creator Monthly Pass", durationDays: 30, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG682910YZ283910", planId: "monthly-30d", tier: "monthly", planName: "Creator Monthly Pass", durationDays: 30, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG391048AB392018", planId: "monthly-30d", tier: "monthly", planName: "Creator Monthly Pass", durationDays: 30, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG849201CD482910", planId: "monthly-30d", tier: "monthly", planName: "Creator Monthly Pass", durationDays: 30, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG502918EF592810", planId: "monthly-30d", tier: "monthly", planName: "Creator Monthly Pass", durationDays: 30, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG918273GH683920", planId: "monthly-30d", tier: "monthly", planName: "Creator Monthly Pass", durationDays: 30, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG283910JK740192", planId: "monthly-30d", tier: "monthly", planName: "Creator Monthly Pass", durationDays: 30, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG749201LM839102", planId: "monthly-30d", tier: "monthly", planName: "Creator Monthly Pass", durationDays: 30, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG391028NP920148", planId: "monthly-30d", tier: "monthly", planName: "Creator Monthly Pass", durationDays: 30, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG820193QR194820", planId: "monthly-30d", tier: "monthly", planName: "Creator Monthly Pass", durationDays: 30, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG491028ST283910", planId: "monthly-30d", tier: "monthly", planName: "Creator Monthly Pass", durationDays: 30, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG602918UV392018", planId: "monthly-30d", tier: "monthly", planName: "Creator Monthly Pass", durationDays: 30, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG184920WX482910", planId: "monthly-30d", tier: "monthly", planName: "Creator Monthly Pass", durationDays: 30, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG739102YZ592810", planId: "monthly-30d", tier: "monthly", planName: "Creator Monthly Pass", durationDays: 30, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG294019AC683920", planId: "monthly-30d", tier: "monthly", planName: "Creator Monthly Pass", durationDays: 30, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
];

// Pre-generated 5 One-Year Subscription Keys (Studio Pro Annual Pass - 365 Days)
export const ANNUAL_1Y_KEYS: ProductKey[] = [
  { key: "DPG882914PR491029", planId: "annual-1y", tier: "annual", planName: "Studio Pro Annual Pass", durationDays: 365, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG519284TX683920", planId: "annual-1y", tier: "annual", planName: "Studio Pro Annual Pass", durationDays: 365, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG391048VY740192", planId: "annual-1y", tier: "annual", planName: "Studio Pro Annual Pass", durationDays: 365, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG740192ZQ839102", planId: "annual-1y", tier: "annual", planName: "Studio Pro Annual Pass", durationDays: 365, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
  { key: "DPG920148KW194820", planId: "annual-1y", tier: "annual", planName: "Studio Pro Annual Pass", durationDays: 365, isRedeemed: false, createdAt: "2026-08-16T00:00:00.000Z" },
];

// Combined Master Keys Array
export const ALL_PREGENERATED_KEYS: ProductKey[] = [
  ...TRIAL_72H_KEYS,
  ...MONTHLY_30D_KEYS,
  ...ANNUAL_1Y_KEYS,
];
