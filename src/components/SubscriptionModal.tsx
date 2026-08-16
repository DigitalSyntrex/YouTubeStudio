import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  Zap,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Lock,
  Clock,
  Crown,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  FileSpreadsheet,
  Tv,
  Layers,
  HelpCircle,
  Calendar,
  KeyRound,
} from "lucide-react";
import { useSubscription } from "../context/SubscriptionContext";
import { useAuth } from "../context/AuthContext";
import { SubscriptionPlan } from "../types";
import { ProductKeyRedeemSection } from "./ProductKeyRedeemSection";

export const SubscriptionModal: React.FC = () => {
  const {
    plans,
    entitlement,
    activeSubscription,
    isUpgradeModalOpen,
    upgradeModalFeature,
    closeUpgradeModal,
    checkout,
    cancelAutoRenew,
  } = useSubscription();

  const { currentUser, userProfile } = useAuth();

  const [selectedPlanId, setSelectedPlanId] = useState<string>("annual-1y");
  const [activeTab, setActiveTab] = useState<"pricing" | "key" | "manage" | "comparison">("pricing");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [cardNumber, setCardNumber] = useState<string>("4242 •••• •••• 4242");
  const [cardExp, setCardExp] = useState<string>("12/28");
  const [cardCvc, setCardCvc] = useState<string>("888");
  const [cardHolder, setCardHolder] = useState<string>(
    userProfile?.displayName || userProfile?.username || "YouTube Gaming Creator"
  );

  if (!isUpgradeModalOpen) return null;

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  const handleCheckout = async (plan: SubscriptionPlan) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await checkout(plan.id, {
      cardNumber,
      cardExp,
      cardCvc,
      cardHolder,
      paymentMethod: "card_stripe_simulated",
    });

    setIsProcessing(false);

    if (!res.success) {
      setErrorMessage(res.error || "Payment processing failed. Please try again.");
    } else {
      setSuccessMessage(`Success! ${plan.name} has been activated.`);
      setTimeout(() => {
        closeUpgradeModal();
      }, 1500);
    }
  };

  const handleCancelAutoRenew = async () => {
    if (!activeSubscription) return;
    setIsProcessing(true);
    const success = await cancelAutoRenew(activeSubscription.id);
    setIsProcessing(false);
    if (success) {
      setSuccessMessage("Auto-renewal has been successfully turned off.");
    } else {
      setErrorMessage("Could not cancel auto-renewal. Please contact support.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl my-auto bg-zinc-950 border border-zinc-800/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-zinc-900 via-zinc-900/80 to-zinc-950 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-indigo-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  DigitalPlayGrid Studio Access & Plans
                </h2>
                {entitlement.hasActiveSubscription && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {entitlement.planTier.toUpperCase()} ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400">
                Unlock full editing capabilities, unlimited series, live OBS overlays, and AI SEO tools.
              </p>
            </div>
          </div>

          <button
            onClick={closeUpgradeModal}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Context Banner (if triggered by a specific action) */}
        {upgradeModalFeature && (
          <div className="px-6 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Subscription Required:</strong> The action you attempted (
                <span className="underline font-semibold">{upgradeModalFeature}</span>) requires an active
                Studio Pass.
              </span>
            </div>
            <span className="text-amber-400 font-semibold uppercase tracking-wider text-[10px]">
              Demo Mode Guard
            </span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-zinc-800/80 px-6 bg-zinc-900/40">
          <button
            onClick={() => setActiveTab("pricing")}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "pricing"
                ? "border-amber-500 text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Select Pass & Plans
          </button>
          <button
            onClick={() => setActiveTab("key")}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "key"
                ? "border-amber-500 text-amber-300 font-bold"
                : "border-transparent text-amber-400/80 hover:text-amber-300"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" /> Have a key?
          </button>
          <button
            onClick={() => setActiveTab("comparison")}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "comparison"
                ? "border-amber-500 text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Feature Matrix
          </button>
          {entitlement.hasActiveSubscription && (
            <button
              onClick={() => setActiveTab("manage")}
              className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "manage"
                  ? "border-amber-500 text-white"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Manage Subscription
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Notifications */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: PRICING PLANS */}
          {activeTab === "pricing" && (
            <div className="space-y-6">
              {/* Plan Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {plans.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  const isTrial = plan.tier === "trial";
                  const isLifetime = plan.tier === "lifetime";
                  const isAnnual = plan.tier === "annual";
                  const isCurrent = entitlement.planTier === plan.tier && entitlement.hasActiveSubscription;

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`relative flex flex-col justify-between p-5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-zinc-900/90 border-amber-500/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40"
                          : "bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/60"
                      }`}
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-3 min-h-[22px]">
                        {plan.badgeLabel ? (
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                              isAnnual
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                : isLifetime
                                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                                : isTrial
                                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                                : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                            }`}
                          >
                            {plan.badgeLabel}
                          </span>
                        ) : (
                          <span />
                        )}

                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            ACTIVE
                          </span>
                        )}
                      </div>

                      {/* Title & Price */}
                      <div>
                        <h3 className="text-base font-bold text-white mb-1">{plan.name}</h3>
                        <p className="text-xs text-zinc-400 mb-4 line-clamp-2 min-h-[32px]">
                          {plan.tagline}
                        </p>

                        <div className="mb-4 pb-4 border-b border-zinc-800/80">
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-extrabold text-white">
                              ${plan.priceUsd}
                            </span>
                            <span className="text-xs text-zinc-400 font-normal">
                              {plan.billingInterval === "72_hours"
                                ? "/ 72 hours"
                                : plan.billingInterval === "30_days"
                                ? "/ month"
                                : plan.billingInterval === "1_year"
                                ? "/ year"
                                : "one-time"}
                            </span>
                          </div>
                          {plan.regularPriceUsd && plan.regularPriceUsd > plan.priceUsd && (
                            <span className="text-[11px] text-zinc-500 line-through block mt-0.5">
                              Regular ${plan.regularPriceUsd}
                            </span>
                          )}
                        </div>

                        {/* Feature Bullet Points */}
                        <ul className="space-y-2 mb-6">
                          {plan.features.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                              <CheckCircle2
                                className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                                  isAnnual
                                    ? "text-amber-400"
                                    : isLifetime
                                    ? "text-purple-400"
                                    : "text-emerald-400"
                                }`}
                              />
                              <span className="leading-snug">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Select Action Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlanId(plan.id);
                        }}
                        className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? isAnnual
                              ? "bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold shadow-md shadow-amber-500/20"
                              : isLifetime
                              ? "bg-purple-600 hover:bg-purple-500 text-white font-extrabold"
                              : isTrial
                              ? "bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-extrabold"
                              : "bg-zinc-100 hover:bg-white text-zinc-950"
                            : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                        }`}
                      >
                        {isCurrent ? "Current Active Plan" : isSelected ? "Selected Plan" : "Choose Plan"}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Checkout Section for Selected Plan */}
              {selectedPlan && (
                <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 mt-6">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-lg">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          READY TO ACTIVATE
                        </span>
                        <h4 className="text-lg font-bold text-white">{selectedPlan.name}</h4>
                      </div>
                      <p className="text-xs text-zinc-400">
                        {selectedPlan.tier === "trial"
                          ? "Activate your 72-hour trial for $1.99. No automatic renewals. Anti-abuse verification enabled."
                          : selectedPlan.tier === "lifetime"
                          ? "One single payment of $149.99 gives you permanent lifetime access to DigitalPlayGrid."
                          : `Total due today: $${selectedPlan.priceUsd}. Instant activation with full YouTube creator suite.`}
                      </p>
                      <div className="flex items-center gap-4 text-[11px] text-zinc-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Lock className="w-3 h-3 text-emerald-400" /> 256-Bit SSL Encrypted
                        </span>
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" /> Instant Entitlement Delivery
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-emerald-400" /> Zero Wait Time
                        </span>
                      </div>
                    </div>

                    <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="text-right px-4 py-2 bg-zinc-950/70 border border-zinc-800 rounded-lg hidden sm:block">
                        <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                          Total Amount
                        </span>
                        <span className="text-xl font-black text-white">${selectedPlan.priceUsd}</span>
                      </div>

                      <button
                        onClick={() => handleCheckout(selectedPlan)}
                        disabled={isProcessing}
                        className="py-3 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-zinc-950 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" /> Verifying & Activating...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4" /> Activate {selectedPlan.name} ($
                            {selectedPlan.priceUsd})
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FEATURE MATRIX / COMPARISON */}
          {activeTab === "comparison" && (
            <div className="space-y-4">
              <div className="border border-zinc-800/80 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-300 font-semibold">
                      <th className="p-3.5">Capability / Feature</th>
                      <th className="p-3.5 text-center text-zinc-400">Free Demo</th>
                      <th className="p-3.5 text-center text-cyan-300">72-Hour Trial ($1.99)</th>
                      <th className="p-3.5 text-center text-zinc-200">Monthly ($9.99)</th>
                      <th className="p-3.5 text-center text-amber-300">Annual & Lifetime</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    <tr>
                      <td className="p-3 font-medium">Playthrough Series Creation</td>
                      <td className="p-3 text-center text-zinc-500">Read-Only Sample</td>
                      <td className="p-3 text-center text-emerald-400 font-bold">Unlimited (3 Days)</td>
                      <td className="p-3 text-center text-emerald-400 font-bold">Unlimited</td>
                      <td className="p-3 text-center text-emerald-400 font-bold">Unlimited</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Episode Breakdown & Editing</td>
                      <td className="p-3 text-center text-zinc-500">Preview Only</td>
                      <td className="p-3 text-center text-emerald-400 font-bold">Full Editing</td>
                      <td className="p-3 text-center text-emerald-400 font-bold">Full Editing</td>
                      <td className="p-3 text-center text-emerald-400 font-bold">Full Editing</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">AI YouTube SEO & Description Engine</td>
                      <td className="p-3 text-center text-zinc-400">3 Trial Gens</td>
                      <td className="p-3 text-center text-emerald-400 font-bold">Full Access</td>
                      <td className="p-3 text-center text-emerald-400 font-bold">Unlimited</td>
                      <td className="p-3 text-center text-amber-400 font-bold">Priority High Speed</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">1280x720 Thumbnail Builder & PNG Export</td>
                      <td className="p-3 text-center text-zinc-400">Watermarked</td>
                      <td className="p-3 text-center text-emerald-400 font-bold">Full Clean Export</td>
                      <td className="p-3 text-center text-emerald-400 font-bold">Full Clean Export</td>
                      <td className="p-3 text-center text-emerald-400 font-bold">Pro Badge Overlays</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Transparent OBS Live Browser HUDs</td>
                      <td className="p-3 text-center text-zinc-400">Demo Overlay</td>
                      <td className="p-3 text-center text-emerald-400 font-bold">Full Live HUDs</td>
                      <td className="p-3 text-center text-emerald-400 font-bold">Full Live HUDs</td>
                      <td className="p-3 text-center text-amber-400 font-bold">Exclusive HUD Skins</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Batch Exporting (CSV, Markdown, JSON)</td>
                      <td className="p-3 text-center text-zinc-500">Locked</td>
                      <td className="p-3 text-center text-emerald-400 font-bold">Enabled</td>
                      <td className="p-3 text-center text-emerald-400 font-bold">Enabled</td>
                      <td className="p-3 text-center text-emerald-400 font-bold">Enabled</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Cloud Database Sync & Multi-Device Backup</td>
                      <td className="p-3 text-center text-zinc-500">Local Only</td>
                      <td className="p-3 text-center text-emerald-400 font-bold">Cloud Sync</td>
                      <td className="p-3 text-center text-emerald-400 font-bold">Cloud Sync</td>
                      <td className="p-3 text-center text-emerald-400 font-bold">Instant Sync</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: MANAGE SUBSCRIPTION */}
          {activeTab === "manage" && entitlement.hasActiveSubscription && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" /> Active Plan Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80">
                    <span className="text-zinc-400 block mb-1">Current Tier</span>
                    <span className="text-sm font-bold text-white uppercase">
                      {entitlement.planTier}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80">
                    <span className="text-zinc-400 block mb-1">Access Status</span>
                    <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Full Access Active
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80">
                    <span className="text-zinc-400 block mb-1">Time Remaining</span>
                    <span className="text-sm font-bold text-amber-300">
                      {entitlement.timeRemainingFormatted || "Unlimited"}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80">
                    <span className="text-zinc-400 block mb-1">Expires On</span>
                    <span className="text-sm font-semibold text-zinc-300">
                      {entitlement.expiresAt
                        ? new Date(entitlement.expiresAt).toLocaleDateString()
                        : "Lifetime (Never)"}
                    </span>
                  </div>
                </div>

                {activeSubscription?.autoRenew && (
                  <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-300 font-semibold">Automatic Renewal</p>
                      <p className="text-[11px] text-zinc-500">
                        Your subscription will automatically renew at the end of the billing period.
                      </p>
                    </div>
                    <button
                      onClick={handleCancelAutoRenew}
                      disabled={isProcessing}
                      className="px-3 py-1.5 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      Turn Off Auto-Renew
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: PRODUCT KEY REDEMPTION */}
          {activeTab === "key" && (
            <div className="space-y-4">
              <ProductKeyRedeemSection
                onSuccess={() => {
                  setSuccessMessage("Product key activated! Your studio pass is now live.");
                }}
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <div className="flex items-center gap-4">
            <span>© 2026 DigitalPlayGrid Studio</span>
            <span>•</span>
            <span>30-Day Money Back Guarantee</span>
          </div>
          <button
            onClick={closeUpgradeModal}
            className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
