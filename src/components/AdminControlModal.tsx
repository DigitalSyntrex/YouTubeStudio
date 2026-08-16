import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  KeyRound,
  Users,
  UserPlus,
  UserCheck,
  BadgeCheck,
  Settings2,
  Activity,
  Plus,
  RefreshCw,
  Trash2,
  RotateCcw,
  Copy,
  Check,
  Download,
  Search,
  Filter,
  Sparkles,
  AlertTriangle,
  Crown,
  Clock,
  Calendar,
  Layers,
  Radio,
  Sliders,
  CheckCircle2,
  X,
  Megaphone,
  Lock,
  Unlock,
  Eye,
  Server,
  Gift
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { useAuth } from "../context/AuthContext";
import { useSubscription } from "../context/SubscriptionContext";
import { PlanTier, ProductKey } from "../types";
import { ProductKeyVaultCenter } from "./ProductKeyVaultCenter";

interface AdminControlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTab = "vault" | "users" | "site_controls" | "audit_logs";

export const AdminControlModal: React.FC<AdminControlModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    isAdmin,
    adminUnlocked,
    unlockAdmin,
    siteSettings,
    updateSiteSettings,
    keysInventory,
    loadingKeys,
    refreshKeys,
    generateNewKeys,
    resetProductKey,
    deleteProductKey,
    overrideUserPlan,
    stats,
    refreshStats,
    adminUsers,
    refreshAdminUsers,
    addAdminUser,
    removeAdminUser,
  } = useAdmin();

  const { currentUser, userProfile } = useAuth();
  const { auditLogs } = useSubscription();

  const [activeTab, setActiveTab] = useState<AdminTab>("vault");

  // Passphrase unlock state (if not already authenticated as syntrex@gmail.com)
  const [passphraseInput, setPassphraseInput] = useState<string>("");
  const [passphraseError, setPassphraseError] = useState<string | null>(null);

  // Key Generator State
  const [genCount, setGenCount] = useState<number>(10);
  const [genTier, setGenTier] = useState<PlanTier>("trial");
  const [genDays, setGenDays] = useState<number>(3);
  const [genPlanName, setGenPlanName] = useState<string>("72-Hour Studio Pass");
  const [generating, setGenerating] = useState<boolean>(false);
  const [genSuccessMessage, setGenSuccessMessage] = useState<string | null>(null);

  // Keys Table Filtering
  const [keyFilterTier, setKeyFilterTier] = useState<string>("all");
  const [keyFilterStatus, setKeyFilterStatus] = useState<"all" | "available" | "redeemed">("all");
  const [keySearch, setKeySearch] = useState<string>("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // User Override State
  const [overrideUserId, setOverrideUserId] = useState<string>("");
  const [overrideEmail, setOverrideEmail] = useState<string>("");
  const [overrideTier, setOverrideTier] = useState<PlanTier>("monthly");
  const [overrideDays, setOverrideDays] = useState<number>(30);
  const [overrideLoading, setOverrideLoading] = useState<boolean>(false);
  const [overrideResult, setOverrideResult] = useState<string | null>(null);
  const [overrideAlsoAdmin, setOverrideAlsoAdmin] = useState<boolean>(false);

  // Admin Role Delegation State
  const [newAdminEmail, setNewAdminEmail] = useState<string>("");
  const [newAdminUsername, setNewAdminUsername] = useState<string>("");
  const [newAdminRole, setNewAdminRole] = useState<"admin" | "super_admin">("admin");
  const [adminActionLoading, setAdminActionLoading] = useState<boolean>(false);
  const [adminActionMessage, setAdminActionMessage] = useState<{ text: string; success: boolean } | null>(null);

  // Site Settings Form State
  const [bannerEnabled, setBannerEnabled] = useState<boolean>(siteSettings.announcementBanner.enabled);
  const [bannerText, setBannerText] = useState<string>(siteSettings.announcementBanner.text);
  const [bannerVariant, setBannerVariant] = useState<"amber" | "emerald" | "blue" | "rose" | "purple">(
    siteSettings.announcementBanner.variant
  );
  const [enforceDemo, setEnforceDemo] = useState<boolean>(siteSettings.enforceDemoMode);
  const [allowGuest, setAllowGuest] = useState<boolean>(siteSettings.allowGuestAccess);
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(siteSettings.maintenanceMode);
  const [maintenanceMsg, setMaintenanceMsg] = useState<string>(siteSettings.maintenanceMessage || "");
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState<boolean>(false);

  // Audit Logs Search
  const [auditSearch, setAuditSearch] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      refreshKeys();
      refreshStats();
      setBannerEnabled(siteSettings.announcementBanner.enabled);
      setBannerText(siteSettings.announcementBanner.text);
      setBannerVariant(siteSettings.announcementBanner.variant);
      setEnforceDemo(siteSettings.enforceDemoMode);
      setAllowGuest(siteSettings.allowGuestAccess);
      setMaintenanceMode(siteSettings.maintenanceMode);
      setMaintenanceMsg(siteSettings.maintenanceMessage || "");
    }
  }, [isOpen, siteSettings]);

  // Sync days & plan name when tier changes in generator
  const handleTierSelect = (tier: PlanTier) => {
    setGenTier(tier);
    if (tier === "trial") {
      setGenDays(3);
      setGenPlanName("72-Hour Studio Pass");
    } else if (tier === "monthly") {
      setGenDays(30);
      setGenPlanName("Creator Monthly Pass");
    } else if (tier === "annual") {
      setGenDays(365);
      setGenPlanName("Studio Pro Annual Pass");
    } else if (tier === "lifetime") {
      setGenDays(36500);
      setGenPlanName("Legendary Lifetime Founder");
    }
  };

  const handleGenerateKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setGenSuccessMessage(null);

    const planId =
      genTier === "trial"
        ? "trial-72h"
        : genTier === "monthly"
        ? "monthly-30d"
        : genTier === "annual"
        ? "annual-1y"
        : "lifetime";

    const res = await generateNewKeys({
      count: genCount,
      planId,
      planTier: genTier,
      durationDays: genDays,
      planName: genPlanName,
    });

    setGenerating(false);
    if (res.success) {
      setGenSuccessMessage(`Generated ${res.keys?.length || genCount} new ${genPlanName} keys!`);
      setTimeout(() => setGenSuccessMessage(null), 4000);
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveSiteSettings = () => {
    updateSiteSettings({
      announcementBanner: {
        enabled: bannerEnabled,
        text: bannerText,
        variant: bannerVariant,
      },
      enforceDemoMode: enforceDemo,
      allowGuestAccess: allowGuest,
      maintenanceMode: maintenanceMode,
      maintenanceMessage: maintenanceMsg,
    });
    setSavedSettingsSuccess(true);
    setTimeout(() => setSavedSettingsSuccess(false), 3000);
  };

  const handleOverrideUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideUserId && !overrideEmail) return;
    setOverrideLoading(true);
    setOverrideResult(null);

    const res = await overrideUserPlan({
      userId: overrideUserId || overrideEmail,
      email: overrideEmail,
      tier: overrideTier,
      durationDays: overrideDays,
    });

    if (overrideAlsoAdmin && overrideEmail) {
      await addAdminUser({
        email: overrideEmail,
        username: overrideUserId,
        role: "admin",
      });
    }

    setOverrideLoading(false);
    if (res.success) {
      setOverrideResult(`Subscription successfully updated to ${overrideTier.toUpperCase()} (${overrideDays}d)${overrideAlsoAdmin ? " & Administrator privileges granted" : ""}!`);
      setTimeout(() => setOverrideResult(null), 4000);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;
    setAdminActionLoading(true);
    setAdminActionMessage(null);

    const res = await addAdminUser({
      email: newAdminEmail.trim(),
      username: newAdminUsername.trim() || undefined,
      role: newAdminRole,
    });

    setAdminActionLoading(false);
    setAdminActionMessage({
      text: res.message,
      success: res.success,
    });

    if (res.success) {
      setNewAdminEmail("");
      setNewAdminUsername("");
      setTimeout(() => setAdminActionMessage(null), 4000);
    }
  };

  const handleRemoveAdmin = async (email: string) => {
    if (!window.confirm(`Are you sure you want to revoke Administrator status from ${email}?`)) {
      return;
    }
    const res = await removeAdminUser(email);
    setAdminActionMessage({
      text: res.message,
      success: res.success,
    });
    setTimeout(() => setAdminActionMessage(null), 4000);
  };

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = unlockAdmin(passphraseInput);
    if (success) {
      setPassphraseError(null);
    } else {
      setPassphraseError("Invalid admin passcode. Access denied.");
    }
  };

  if (!isOpen) return null;

  // Filtered keys
  const filteredKeys = keysInventory.filter((k) => {
    const matchesTier =
      keyFilterTier === "all" ||
      (keyFilterTier === "trial" && (k.planId === "trial-72h" || k.planTier === "trial" || k.tier === "trial")) ||
      (keyFilterTier === "monthly" && (k.planId === "monthly-30d" || k.planTier === "monthly" || k.tier === "monthly")) ||
      (keyFilterTier === "annual" && (k.planId === "annual-1y" || k.planTier === "annual" || k.tier === "annual")) ||
      (keyFilterTier === "lifetime" && (k.planId === "lifetime" || k.planTier === "lifetime" || k.tier === "lifetime"));

    const isRedeemed = Boolean(k.isRedeemed || k.redeemed);
    const matchesStatus =
      keyFilterStatus === "all" ||
      (keyFilterStatus === "available" && !isRedeemed) ||
      (keyFilterStatus === "redeemed" && isRedeemed);

    const matchesSearch =
      keySearch === "" ||
      k.key.toLowerCase().includes(keySearch.toLowerCase()) ||
      k.planName.toLowerCase().includes(keySearch.toLowerCase()) ||
      (k.redeemedByUserEmail && k.redeemedByUserEmail.toLowerCase().includes(keySearch.toLowerCase()));

    return matchesTier && matchesStatus && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#080c18] border border-amber-500/40 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Top Glowing Ambient Aura */}
        <div className="absolute top-0 right-1/4 w-96 h-32 bg-amber-500/15 blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-96 h-32 bg-purple-500/10 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0a0f1f]/80 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-600/30 to-purple-600/30 border border-amber-500/50 flex items-center justify-center text-amber-300 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-white tracking-wide flex items-center gap-1.5">
                  DigitalPlayGrid Admin Control Center
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-widest">
                  Master Authority
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Logged in as:{" "}
                <span className="text-amber-300 font-mono font-bold">
                  {currentUser?.email || userProfile?.email || "syntrex@gmail.com"}
                </span>{" "}
                • Super Admin Active
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                refreshKeys();
                refreshStats();
              }}
              disabled={loadingKeys}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Refresh System Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingKeys ? "animate-spin text-amber-400" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white border border-white/10 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real-time System Metrics Bar */}
        <div className="px-5 py-2.5 bg-[#060914] border-b border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block font-bold">Total Keys</span>
              <span className="font-bold text-white font-mono">{keysInventory.length} Keys</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block font-bold">Available / Unused</span>
              <span className="font-bold text-emerald-300 font-mono">
                {keysInventory.filter((k) => !k.isRedeemed && !k.redeemed).length}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block font-bold">Redeemed Keys</span>
              <span className="font-bold text-indigo-300 font-mono">
                {keysInventory.filter((k) => k.isRedeemed || k.redeemed).length}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            <div>
              <span className="text-[10px] text-zinc-500 uppercase block font-bold">System Status</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Operational
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation with Glowing Blue Gradient Highlight */}
        <div className="px-4 pt-3 pb-2 bg-gradient-to-r from-blue-950/90 via-[#0b1736] to-indigo-950/90 border-b-2 border-blue-500/50 shadow-xl shadow-blue-600/20 ring-1 ring-blue-400/20 flex items-center gap-2 overflow-x-auto custom-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("vault")}
            className={`px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "vault"
                ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white shadow-md shadow-blue-600/40 border border-blue-400/50"
                : "text-blue-200/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <Gift className="w-4 h-4 text-amber-300" />
            <span>Product Key Vault & Handouts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "users"
                ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white shadow-md shadow-blue-600/40 border border-blue-400/50"
                : "text-blue-200/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <Users className="w-4 h-4 text-indigo-300" />
            <span>User Subscriptions & Entitlements</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("site_controls")}
            className={`px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "site_controls"
                ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white shadow-md shadow-blue-600/40 border border-blue-400/50"
                : "text-blue-200/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <Settings2 className="w-4 h-4 text-rose-300" />
            <span>Website & Studio Controls</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("audit_logs")}
            className={`px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === "audit_logs"
                ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white shadow-md shadow-blue-600/40 border border-blue-400/50"
                : "text-blue-200/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-300" />
            <span>Security Audit Trail</span>
          </button>
        </div>

        {/* Modal Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#070b16]">
          {/* TAB 1: PRODUCT KEY VAULT, GENERATOR & MASTER DATABASE */}
          {activeTab === "vault" && (
            <div className="space-y-6">
              {/* Section 1: Product Key Vault & Direct Handout Grid */}
              <ProductKeyVaultCenter
                defaultColumns={5}
                title="Product Key Vault & Handout Center"
                subtitle="Master inventory of pre-generated DPG keys. Copy, filter by tier, export, or handout passes directly to creators."
              />

              {/* Section 2: Batch Key Generator Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0c1222] via-[#090e1b] to-[#12192e] border border-amber-500/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      <Plus className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Generate New Product Keys</h3>
                      <p className="text-[11px] text-zinc-400">
                        Create batches of keys formatted as <code className="font-mono text-amber-300">DPGXXXXXXYYXXXXXX</code> and add directly to the active database.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleGenerateKeys} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                  {/* Tier Selection */}
                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 block mb-1">Plan Tier</label>
                    <select
                      value={genTier}
                      onChange={(e) => handleTierSelect(e.target.value as PlanTier)}
                      className="w-full px-3 py-2 bg-[#050811] border border-white/15 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                    >
                      <option value="trial">72-Hour Trial (3 Days)</option>
                      <option value="monthly">Creator Monthly (30 Days)</option>
                      <option value="annual">Studio Pro Annual (365 Days)</option>
                      <option value="lifetime">Lifetime Founder (Permanent)</option>
                    </select>
                  </div>

                  {/* Duration in Days */}
                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 block mb-1">Duration (Days)</label>
                    <input
                      type="number"
                      min="1"
                      max="36500"
                      value={genDays}
                      onChange={(e) => setGenDays(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#050811] border border-white/15 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 block mb-1">Quantity</label>
                    <select
                      value={genCount}
                      onChange={(e) => setGenCount(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-[#050811] border border-white/15 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                    >
                      <option value={1}>1 Key</option>
                      <option value={5}>5 Keys</option>
                      <option value={10}>10 Keys</option>
                      <option value={20}>20 Keys</option>
                      <option value={50}>50 Keys</option>
                    </select>
                  </div>

                  {/* Plan Name */}
                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 block mb-1">Display Label</label>
                    <input
                      type="text"
                      value={genPlanName}
                      onChange={(e) => setGenPlanName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#050811] border border-white/15 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Generate Button */}
                  <button
                    type="submit"
                    disabled={generating}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 text-xs font-black shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {generating ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate Keys</span>
                      </>
                    )}
                  </button>
                </form>

                {genSuccessMessage && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{genSuccessMessage}</span>
                  </div>
                )}
              </div>

              {/* Master Inventory Table & Filter Bar */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#090d1a] border border-white/10 space-y-4 shadow-xl">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Master Product Keys Inventory</span>
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-zinc-300 text-[10px] font-mono">
                        {filteredKeys.length} matching
                      </span>
                    </h3>
                  </div>

                  {/* Filter controls */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Filter by Tier */}
                    <select
                      value={keyFilterTier}
                      onChange={(e) => setKeyFilterTier(e.target.value)}
                      className="px-2.5 py-1.5 bg-[#050811] border border-white/15 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option value="all">All Tiers</option>
                      <option value="trial">72h Trial</option>
                      <option value="monthly">1-Month Sub</option>
                      <option value="annual">1-Year Sub</option>
                      <option value="lifetime">Lifetime</option>
                    </select>

                    {/* Filter by Status */}
                    <select
                      value={keyFilterStatus}
                      onChange={(e) => setKeyFilterStatus(e.target.value as any)}
                      className="px-2.5 py-1.5 bg-[#050811] border border-white/15 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
                    >
                      <option value="all">All Status</option>
                      <option value="available">Available (Unused)</option>
                      <option value="redeemed">Redeemed</option>
                    </select>

                    {/* Search */}
                    <div className="relative min-w-[180px]">
                      <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={keySearch}
                        onChange={(e) => setKeySearch(e.target.value)}
                        placeholder="Search key or user..."
                        className="w-full pl-8 pr-3 py-1.5 bg-[#050811] border border-white/15 rounded-lg text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Table list */}
                <div className="max-h-[380px] overflow-y-auto rounded-xl border border-white/10 bg-[#050811]">
                  <table className="w-full text-left text-xs text-zinc-300">
                    <thead className="bg-[#0b1020] text-[11px] uppercase tracking-wider text-zinc-400 border-b border-white/10 sticky top-0 z-10">
                      <tr>
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Key Code</th>
                        <th className="py-2.5 px-3">Plan Tier</th>
                        <th className="py-2.5 px-3">Duration</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Redeemed By</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredKeys.map((item, idx) => {
                        const isRedeemed = Boolean(item.isRedeemed || item.redeemed);
                        const isCopied = copiedKey === item.key;

                        return (
                          <tr key={item.key} className="hover:bg-white/5 transition-colors">
                            <td className="py-2.5 px-3 font-mono text-[10px] text-zinc-500">{idx + 1}</td>
                            <td className="py-2.5 px-3 font-mono font-bold text-amber-300 select-all">
                              {item.key}
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-white">{item.planName}</td>
                            <td className="py-2.5 px-3">{item.durationDays} Days</td>
                            <td className="py-2.5 px-3">
                              {isRedeemed ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">
                                  Redeemed
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                  Available
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-zinc-400 font-mono text-[11px]">
                              {item.redeemedByUserEmail || item.redeemedByEmail || (isRedeemed ? "Active Creator" : "—")}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleCopyKey(item.key)}
                                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                                  title="Copy Key"
                                >
                                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>

                                {isRedeemed && (
                                  <button
                                    type="button"
                                    onClick={() => resetProductKey(item.key)}
                                    className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-indigo-200 transition-colors cursor-pointer"
                                    title="Reset to Unused"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => deleteProductKey(item.key)}
                                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                                  title="Delete Key from System"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USER SUBSCRIPTIONS & ENTITLEMENTS & ADMINISTRATOR ROLES */}
          {activeTab === "users" && (
            <div className="space-y-6">
              {/* Card 1: Administrator Role Delegation */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0e1629] via-[#091122] to-[#0d1730] border border-blue-500/40 space-y-4 shadow-xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-500/20 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/40 text-blue-400 flex items-center justify-center shadow-inner shrink-0">
                      <Crown className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <span>Grant Administrator Access & Roles</span>
                        <span className="px-2 py-0.2 rounded text-[9px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/40 uppercase tracking-wider">
                          Role Delegation
                        </span>
                      </h3>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Promote any creator account to Studio Administrator or Super Admin with immediate portal access.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleAddAdmin} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-zinc-300 block mb-1">User Email <span className="text-blue-400">*</span></label>
                      <input
                        type="email"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        placeholder="e.g. newadmin@gmail.com"
                        required
                        className="w-full px-3 py-2 bg-[#050811] border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-blue-400"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-zinc-300 block mb-1">Username / Nickname</label>
                      <input
                        type="text"
                        value={newAdminUsername}
                        onChange={(e) => setNewAdminUsername(e.target.value)}
                        placeholder="e.g. LeadEditor"
                        className="w-full px-3 py-2 bg-[#050811] border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-blue-400"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-zinc-300 block mb-1">Administrator Role</label>
                      <select
                        value={newAdminRole}
                        onChange={(e) => setNewAdminRole(e.target.value as any)}
                        className="w-full px-3 py-2 bg-[#050811] border border-white/15 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-blue-400"
                      >
                        <option value="admin">Studio Administrator (Full Management)</option>
                        <option value="super_admin">Super Admin (Master Root Access)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={adminActionLoading || !newAdminEmail.trim()}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-900/30 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-40"
                    >
                      {adminActionLoading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Promoting User...</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>👑 Make User Administrator</span>
                        </>
                      )}
                    </button>

                    {adminActionMessage && (
                      <span
                        className={`text-xs font-semibold flex items-center gap-1.5 ${
                          adminActionMessage.success ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {adminActionMessage.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                        )}
                        {adminActionMessage.text}
                      </span>
                    )}
                  </div>
                </form>

                {/* Active Administrators Directory Table */}
                <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span>Active Studio Administrators Directory</span>
                    </h4>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {adminUsers.length} Authorized Admins
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#050811]">
                    <table className="w-full text-left text-xs text-zinc-300">
                      <thead className="bg-[#0b1020] text-[10px] uppercase tracking-wider text-zinc-400 border-b border-white/10">
                        <tr>
                          <th className="py-2 px-3">Administrator</th>
                          <th className="py-2 px-3">Role Tier</th>
                          <th className="py-2 px-3">Designated By</th>
                          <th className="py-2 px-3">Status</th>
                          <th className="py-2 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                        {adminUsers.map((admin) => {
                          const isRoot = admin.email === "syntrex@gmail.com" || admin.email === "digitalplaygrid@gmail.com";
                          return (
                            <tr key={admin.id || admin.email} className="hover:bg-white/5 transition-colors">
                              <td className="py-2 px-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 flex items-center justify-center text-[10px] font-sans font-black">
                                    {admin.username ? admin.username.charAt(0).toUpperCase() : "A"}
                                  </div>
                                  <div>
                                    <div className="font-sans font-bold text-white text-xs">{admin.email}</div>
                                    {admin.username && (
                                      <div className="text-[10px] text-zinc-400">@{admin.username}</div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="py-2 px-3">
                                <span
                                  className={`px-2 py-0.5 rounded text-[9px] font-sans font-black uppercase tracking-wider ${
                                    admin.role === "super_admin"
                                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                      : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                                  }`}
                                >
                                  {admin.role === "super_admin" ? "👑 Super Admin" : "🛡️ Administrator"}
                                </span>
                              </td>
                              <td className="py-2 px-3 font-sans text-zinc-400 text-[11px]">
                                {admin.addedBy}
                              </td>
                              <td className="py-2 px-3">
                                <span className="inline-flex items-center gap-1 text-emerald-400 text-[10px] font-sans font-bold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                  Active
                                </span>
                              </td>
                              <td className="py-2 px-3 text-right">
                                {isRoot ? (
                                  <span className="text-[10px] text-zinc-500 font-sans italic">
                                    Root Super Admin
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveAdmin(admin.email)}
                                    className="px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 text-[10px] font-sans font-bold transition-colors cursor-pointer"
                                  >
                                    Revoke Admin
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Card 2: Manual User Subscription Override */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0c1222] border border-amber-500/30 space-y-4 shadow-xl">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-400" />
                    <span>Manual User Subscription & Entitlement Override</span>
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Manually grant or modify pass entitlements for any registered creator or team member.
                  </p>
                </div>

                <form onSubmit={handleOverrideUser} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-zinc-300 block mb-1">Target User ID / Name</label>
                      <input
                        type="text"
                        value={overrideUserId}
                        onChange={(e) => setOverrideUserId(e.target.value)}
                        placeholder="e.g. user_syntrex or UID"
                        className="w-full px-3 py-2 bg-[#050811] border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-zinc-300 block mb-1">Creator Email</label>
                      <input
                        type="email"
                        value={overrideEmail}
                        onChange={(e) => setOverrideEmail(e.target.value)}
                        placeholder="e.g. creator@gmail.com"
                        className="w-full px-3 py-2 bg-[#050811] border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-zinc-300 block mb-1">Plan Tier</label>
                      <select
                        value={overrideTier}
                        onChange={(e) => setOverrideTier(e.target.value as PlanTier)}
                        className="w-full px-3 py-2 bg-[#050811] border border-white/15 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                      >
                        <option value="trial">72-Hour Trial</option>
                        <option value="monthly">Creator Monthly Pass</option>
                        <option value="annual">Studio Pro Annual Pass</option>
                        <option value="lifetime">Legendary Lifetime Founder</option>
                        <option value="demo">Reset to Free Demo (Read-Only)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-zinc-300 block mb-1">Duration (Days)</label>
                      <input
                        type="number"
                        min="1"
                        max="36500"
                        value={overrideDays}
                        onChange={(e) => setOverrideDays(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-[#050811] border border-white/15 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Also make admin toggle */}
                  <div className="flex items-center gap-2 pt-1">
                    <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={overrideAlsoAdmin}
                        onChange={(e) => setOverrideAlsoAdmin(e.target.checked)}
                        className="w-4 h-4 rounded border-white/20 bg-black/40 text-blue-500 focus:ring-blue-400"
                      />
                      <span className="flex items-center gap-1.5 text-zinc-200 font-semibold">
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        <span>Also grant Administrator privileges to this user</span>
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={overrideLoading || (!overrideUserId && !overrideEmail)}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer transition-all disabled:opacity-40"
                    >
                      {overrideLoading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Applying Override...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Apply Subscription Override</span>
                        </>
                      )}
                    </button>

                    {overrideResult && (
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        {overrideResult}
                      </span>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: WEBSITE & STUDIO CONTROLS */}
          {activeTab === "site_controls" && (
            <div className="space-y-6">
              {/* Announcement Banner Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#090d1a] border border-white/10 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white">Global Website Announcement Banner</h3>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-zinc-300 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={bannerEnabled}
                      onChange={(e) => setBannerEnabled(e.target.checked)}
                      className="w-4 h-4 text-amber-500 rounded bg-[#050811] border-white/20 focus:ring-amber-400 cursor-pointer"
                    />
                    <span>Show Banner</span>
                  </label>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 block mb-1">Announcement Text</label>
                    <input
                      type="text"
                      value={bannerText}
                      onChange={(e) => setBannerText(e.target.value)}
                      placeholder="e.g. 🎉 DigitalPlayGrid Studio v2.5 is live! Product Key Vault Active."
                      className="w-full px-3.5 py-2 bg-[#050811] border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-zinc-300 block mb-1">Banner Accent Color</label>
                    <div className="flex items-center gap-2">
                      {(["amber", "emerald", "blue", "rose", "purple"] as const).map((variant) => (
                        <button
                          key={variant}
                          type="button"
                          onClick={() => setBannerVariant(variant)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                            bannerVariant === variant
                              ? "bg-white text-black shadow-md font-black"
                              : "bg-white/5 text-zinc-400 hover:text-white"
                          }`}
                        >
                          {variant}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Security & Access Controls */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#090d1a] border border-white/10 space-y-4 shadow-xl">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>Global Access & Studio Feature Locks</span>
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Enforce Demonstration Mode</span>
                      <span className="text-[11px] text-zinc-400">Strictly lock editing for non-subscribers</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={enforceDemo}
                      onChange={(e) => setEnforceDemo(e.target.checked)}
                      className="w-4 h-4 text-amber-500 rounded bg-[#050811] border-white/20 cursor-pointer"
                    />
                  </div>

                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Allow Guest Access</span>
                      <span className="text-[11px] text-zinc-400">Allow visitors to preview studio without sign-in</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={allowGuest}
                      onChange={(e) => setAllowGuest(e.target.checked)}
                      className="w-4 h-4 text-amber-500 rounded bg-[#050811] border-white/20 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleSaveSiteSettings}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Website Settings</span>
                  </button>

                  {savedSettingsSuccess && (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="w-4 h-4" /> Settings updated globally!
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY AUDIT TRAIL */}
          {activeTab === "audit_logs" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Real-time Security Audit Log Stream</span>
                </h3>

                <div className="relative min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    placeholder="Search logs..."
                    className="w-full pl-8 pr-3 py-1.5 bg-[#050811] border border-white/15 rounded-lg text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="max-h-[420px] overflow-y-auto rounded-xl border border-white/10 bg-[#050811] p-2 space-y-1.5 font-mono text-[11px]">
                {auditLogs.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500">No audit events recorded yet.</div>
                ) : (
                  auditLogs
                    .filter(
                      (l) =>
                        auditSearch === "" ||
                        l.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
                        (l.userEmail && l.userEmail.toLowerCase().includes(auditSearch.toLowerCase()))
                    )
                    .map((log) => (
                      <div
                        key={log.id}
                        className="p-2 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                              log.status === "success" || log.status === "allowed"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {log.status}
                          </span>
                          <span className="text-white font-semibold">{log.action}</span>
                          <span className="text-zinc-500">({log.userEmail || log.userId})</span>
                        </div>
                        <span className="text-[10px] text-zinc-500 shrink-0">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
