import React from "react";
import { Sparkles, Clock, Crown, ArrowRight, ShieldAlert, Zap } from "lucide-react";
import { useSubscription } from "../context/SubscriptionContext";

export const DemoBanner: React.FC = () => {
  const { entitlement, openUpgradeModal } = useSubscription();

  // If user has a permanent lifetime or annual subscription, we don't need a persistent top banner
  if (entitlement.hasActiveSubscription && entitlement.planTier !== "trial") {
    return null;
  }

  // 72-Hour Trial Banner
  if (entitlement.hasActiveSubscription && entitlement.isTrial) {
    return (
      <div className="w-full bg-gradient-to-r from-cyan-950 via-zinc-900 to-indigo-950 border-b border-cyan-500/30 px-4 py-2 flex items-center justify-between text-xs transition-all shadow-sm">
        <div className="flex items-center gap-2.5 text-cyan-200">
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 flex items-center gap-1">
            <Clock className="w-3 h-3 animate-pulse" /> 72-HOUR TRIAL ACTIVE
          </span>
          <span className="hidden sm:inline">
            Your 3-day full studio pass is active:{" "}
            <strong className="text-cyan-100">{entitlement.timeRemainingFormatted}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openUpgradeModal("Annual Upgrade Discount")}
            className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-bold text-xs shadow-sm flex items-center gap-1 transition-all"
          >
            <Crown className="w-3.5 h-3.5" /> Upgrade to Annual (Save 17%)
          </button>
        </div>
      </div>
    );
  }

  // Demo Mode Banner
  return (
    <div className="w-full bg-gradient-to-r from-amber-950/80 via-zinc-950 to-amber-950/80 border-b border-amber-500/30 px-3 sm:px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs transition-all shadow-sm">
      <div className="flex items-center gap-2.5 text-amber-200">
        <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5" /> READ-ONLY DEMO MODE
        </span>
        <span className="text-zinc-300">
          You are currently previewing DigitalPlayGrid. Upgrade or activate a trial to create and save custom playthroughs.
        </span>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        <button
          onClick={() => openUpgradeModal("72-Hour Studio Trial")}
          className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-bold text-xs flex items-center gap-1.5 transition-all"
        >
          <Zap className="w-3.5 h-3.5 text-cyan-400" /> 72-Hour Pass ($1.99)
        </button>
        <button
          onClick={() => openUpgradeModal("DigitalPlayGrid Studio Pass")}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-extrabold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" /> Unlock Full Access
        </button>
      </div>
    </div>
  );
};
