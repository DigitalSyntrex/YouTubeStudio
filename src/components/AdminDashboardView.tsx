import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  KeyRound,
  Users,
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
  Gamepad2,
  Home,
  Gift,
  ArrowRight,
  UserCheck,
  UserPlus,
  Mail,
  Inbox,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { useAuth } from "../context/AuthContext";
import { useSubscription } from "../context/SubscriptionContext";
import { PlanTier, ProductKey } from "../types";
import { ProductKeyVaultCenter } from "./ProductKeyVaultCenter";
import { AdminInboxTab } from "./AdminInboxTab";

interface AdminDashboardViewProps {
  onNavigateToHub?: () => void;
  onNavigateToPlanner?: () => void;
  onOpenNewSeriesModal?: () => void;
}

type AdminTab = "vault" | "users" | "inbox" | "site_controls" | "audit_logs";

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onNavigateToHub,
  onNavigateToPlanner,
  onOpenNewSeriesModal,
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
    adminUsers,
    refreshAdminUsers,
    addAdminUser,
    removeAdminUser,
    unreadMessagesCount,
  } = useAdmin();

  const { currentUser, userProfile } = useAuth();
  const { auditLogs } = useSubscription();

  const [activeTab, setActiveTab] = useState<AdminTab>("vault");
  const [adminPassphrase, setAdminPassphrase] = useState("");
  const [unlockError, setUnlockError] = useState(false);

  // Key Generation State
  const [genCount, setGenCount] = useState<number>(10);
  const [genTier, setGenTier] = useState<PlanTier>("trial");
  const [genPlanId, setGenPlanId] = useState<string>("trial-72h");
  const [genPlanName, setGenPlanName] = useState<string>("72-Hour Free Trial Pass");
  const [genDurationDays, setGenDurationDays] = useState<number>(3);
  const [generating, setGenerating] = useState(false);
  const [genSuccessMessage, setGenSuccessMessage] = useState<string | null>(null);
  const [generatedBatch, setGeneratedBatch] = useState<ProductKey[]>([]);

  // Key DB Filters
  const [dbSearch, setDbSearch] = useState("");
  const [dbFilterStatus, setDbFilterStatus] = useState<"all" | "unused" | "redeemed">("all");
  const [dbFilterTier, setDbFilterTier] = useState<"all" | PlanTier>("all");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // User Override State
  const [overrideUserId, setOverrideUserId] = useState("");
  const [overrideEmail, setOverrideEmail] = useState("");
  const [overrideTier, setOverrideTier] = useState<PlanTier>("monthly");
  const [overrideDays, setOverrideDays] = useState<number>(30);
  const [overrideLoading, setOverrideLoading] = useState(false);
  const [overrideMessage, setOverrideMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [overrideAlsoAdmin, setOverrideAlsoAdmin] = useState<boolean>(false);

  // Admin Role Delegation State
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminUsername, setNewAdminUsername] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<"admin" | "super_admin">("admin");
  const [adminActionLoading, setAdminActionLoading] = useState(false);
  const [adminActionMessage, setAdminActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Site Settings Local Form
  const [announcementText, setAnnouncementText] = useState(siteSettings.announcementBanner.text);
  const [announcementEnabled, setAnnouncementEnabled] = useState(siteSettings.announcementBanner.enabled);
  const [announcementVariant, setAnnouncementVariant] = useState(siteSettings.announcementBanner.variant);
  const [enforceDemo, setEnforceDemo] = useState(siteSettings.enforceDemoMode);
  const [allowGuest, setAllowGuest] = useState(siteSettings.allowGuestAccess);
  const [aiMultiplier, setAiMultiplier] = useState(siteSettings.aiQuotaMultiplier);
  const [maintMode, setMaintMode] = useState(siteSettings.maintenanceMode);
  const [maintMsg, setMaintMsg] = useState(siteSettings.maintenanceMessage);
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false);

  // Handle tier selection in Generator
  const handleTierChange = (tier: PlanTier) => {
    setGenTier(tier);
    if (tier === "trial") {
      setGenPlanId("trial-72h");
      setGenPlanName("72-Hour Free Trial Pass");
      setGenDurationDays(3);
    } else if (tier === "monthly") {
      setGenPlanId("monthly-30d");
      setGenPlanName("Creator Pro Monthly Access");
      setGenDurationDays(30);
    } else if (tier === "annual") {
      setGenPlanId("annual-1y");
      setGenPlanName("Studio Master Annual Pass");
      setGenDurationDays(365);
    } else if (tier === "lifetime") {
      setGenPlanId("lifetime-vip");
      setGenPlanName("Lifetime Studio VIP Founder");
      setGenDurationDays(36500);
    }
  };

  const handleRunGenerator = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setGenSuccessMessage(null);
    setGeneratedBatch([]);

    const result = await generateNewKeys({
      count: genCount,
      planId: genPlanId,
      planTier: genTier,
      durationDays: genDurationDays,
      planName: genPlanName,
    });

    setGenerating(false);
    if (result.success && result.keys) {
      setGenSuccessMessage(result.message || `Successfully generated ${result.keys.length} new keys!`);
      setGeneratedBatch(result.keys);
      refreshKeys();
    }
  };

  const handleCopySingleKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleResetKey = async (key: string) => {
    await resetProductKey(key);
  };

  const handleDeleteKey = async (key: string) => {
    await deleteProductKey(key);
  };

  const handleExecuteUserOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideUserId && !overrideEmail) {
      setOverrideMessage({ type: "error", text: "Please enter a User ID or Email address." });
      return;
    }

    setOverrideLoading(true);
    setOverrideMessage(null);

    const result = await overrideUserPlan({
      userId: overrideUserId.trim() || overrideEmail.trim(),
      email: overrideEmail.trim(),
      tier: overrideTier,
      durationDays: overrideDays,
    });

    if (overrideAlsoAdmin && overrideEmail.trim()) {
      await addAdminUser({
        email: overrideEmail.trim(),
        username: overrideUserId.trim() || undefined,
        role: "admin",
      });
    }

    setOverrideLoading(false);
    if (result.success) {
      setOverrideMessage({
        type: "success",
        text: `${result.message || "User subscription updated successfully!"}${overrideAlsoAdmin ? " and granted Administrator privileges!" : ""}`,
      });
      setOverrideUserId("");
      setOverrideEmail("");
    } else {
      setOverrideMessage({ type: "error", text: result.message || "Failed to update user subscription." });
    }
  };

  const handleAddAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;
    setAdminActionLoading(true);
    setAdminActionMessage(null);

    const result = await addAdminUser({
      email: newAdminEmail.trim(),
      username: newAdminUsername.trim() || undefined,
      role: newAdminRole,
    });

    setAdminActionLoading(false);
    setAdminActionMessage({
      type: result.success ? "success" : "error",
      text: result.message,
    });

    if (result.success) {
      setNewAdminEmail("");
      setNewAdminUsername("");
      setTimeout(() => setAdminActionMessage(null), 4000);
    }
  };

  const handleRevokeAdmin = async (email: string) => {
    if (!window.confirm(`Are you sure you want to revoke Administrator status from ${email}?`)) {
      return;
    }
    const result = await removeAdminUser(email);
    setAdminActionMessage({
      type: result.success ? "success" : "error",
      text: result.message,
    });
    setTimeout(() => setAdminActionMessage(null), 4000);
  };

  const handleSaveSiteSettings = () => {
    updateSiteSettings({
      announcementBanner: {
        enabled: announcementEnabled,
        text: announcementText,
        variant: announcementVariant,
      },
      enforceDemoMode: enforceDemo,
      allowGuestAccess: allowGuest,
      aiQuotaMultiplier: aiMultiplier,
      maintenanceMode: maintMode,
      maintenanceMessage: maintMsg,
    });
    setSettingsSavedSuccess(true);
    setTimeout(() => setSettingsSavedSuccess(false), 3000);
  };

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = unlockAdmin(adminPassphrase);
    if (!success) {
      setUnlockError(true);
      setTimeout(() => setUnlockError(false), 3000);
    }
  };

  // Filtered keys for Database Tab
  const filteredDbKeys = keysInventory.filter((k) => {
    const matchesSearch =
      dbSearch === "" ||
      k.key.toLowerCase().includes(dbSearch.toLowerCase()) ||
      k.planName.toLowerCase().includes(dbSearch.toLowerCase()) ||
      (k.redeemedBy && k.redeemedBy.toLowerCase().includes(dbSearch.toLowerCase()));

    const matchesStatus =
      dbFilterStatus === "all" ||
      (dbFilterStatus === "unused" && !k.isRedeemed && !k.redeemed) ||
      (dbFilterStatus === "redeemed" && (k.isRedeemed || k.redeemed));

    const matchesTier = dbFilterTier === "all" || k.tier === dbFilterTier || k.planTier === dbFilterTier;

    return matchesSearch && matchesStatus && matchesTier;
  });

  // Strict Protection Check: Non-admins cannot see this page
  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-xl">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white">Access Denied: Admin Clearance Required</h2>
        <p className="text-sm text-zinc-400 max-w-md mx-auto">
          The Master Admin Center is restricted to authorized studio administrators.
        </p>
        <button
          onClick={onNavigateToHub}
          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return to Studio Landing Hub</span>
        </button>
      </div>
    );
  }

  // Security Passcode Challenge (if not yet unlocked during session)
  if (!adminUnlocked) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16">
        <div className="bg-gradient-to-b from-[#0e1424] via-[#090d19] to-[#050811] border border-purple-500/40 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 border border-purple-400 flex items-center justify-center text-white mx-auto shadow-lg shadow-purple-900/50">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-white">Master Admin Authorization</h2>
            <p className="text-xs text-zinc-400">
              Logged in as <span className="text-purple-300 font-mono font-bold">{currentUser?.email || "syntrex@gmail.com"}</span>. Enter the master studio security passphrase to access full admin controls.
            </p>
          </div>

          <form onSubmit={handleUnlockSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                Admin Master Passphrase
              </label>
              <input
                type="password"
                value={adminPassphrase}
                onChange={(e) => setAdminPassphrase(e.target.value)}
                placeholder="Enter passphrase (e.g. syntrex or admin2026)..."
                className="w-full px-4 py-2.5 bg-[#05070e] border border-purple-500/30 rounded-xl text-white text-sm focus:outline-none focus:border-purple-400 transition-colors"
                autoFocus
              />
              {unlockError && (
                <p className="text-xs text-rose-400 mt-1 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Incorrect passphrase. Access logged.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Authorize & Open Master Admin Center</span>
            </button>
          </form>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-zinc-500">
            <span>Security Origin: Syntrex Master Root</span>
            <span>Cloud Sync: Active</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-6 space-y-6">
      {/* Top Admin Hero Header */}
      <div className="bg-gradient-to-r from-[#110e24] via-[#090d1a] to-[#0c1626] border border-purple-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Glow lights */}
        <div className="absolute top-0 right-0 w-96 h-40 bg-purple-600/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-32 bg-indigo-600/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="px-2.5 py-1 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>MASTER ADMIN CENTER</span>
              </div>
              <span className="text-xs text-zinc-400 font-mono">
                Operator: <strong className="text-purple-300">{currentUser?.email || "syntrex@gmail.com"}</strong>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Root Clearance Granted
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Product Key Vault & Creator Studio Management Portal
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl">
              Distribute handout keys to creators, generate new product batches, manage subscription entitlements, broadcast announcement banners, and configure studio platform settings.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {onNavigateToPlanner && (
              <button
                type="button"
                onClick={onNavigateToPlanner}
                className="px-3.5 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 hover:text-white border border-blue-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4 text-blue-400" />
                <span>Playthrough Planner</span>
              </button>
            )}
            {onNavigateToHub && (
              <button
                type="button"
                onClick={onNavigateToHub}
                className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Home className="w-4 h-4 text-zinc-400" />
                <span>Studio Landing Hub</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => refreshKeys()}
              className="p-2 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 rounded-xl transition-all cursor-pointer"
              title="Refresh Keys Inventory"
            >
              <RefreshCw className={`w-4 h-4 ${loadingKeys ? "animate-spin text-purple-400" : ""}`} />
            </button>
          </div>
        </div>

        {/* Live Admin Metric Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 mt-5 pt-4 border-t border-white/10 relative z-10">
          <div className="p-3 bg-[#050811]/90 rounded-2xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">Total Keys</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-amber-300">{keysInventory.length}</span>
              <span className="text-[10px] text-zinc-500">keys</span>
            </div>
          </div>

          <div className="p-3 bg-[#050811]/90 rounded-2xl border border-amber-500/20">
            <span className="text-[10px] uppercase font-bold text-amber-400/80 block">72h Trial</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-amber-300">
                {keysInventory.filter((k) => k.planId === "trial-72h" || k.tier === "trial").length}
              </span>
              <span className="text-[10px] text-zinc-500">passes</span>
            </div>
          </div>

          <div className="p-3 bg-[#050811]/90 rounded-2xl border border-indigo-500/20">
            <span className="text-[10px] uppercase font-bold text-indigo-400/80 block">1-Month Sub</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-indigo-300">
                {keysInventory.filter((k) => k.planId === "monthly-30d" || k.tier === "monthly").length}
              </span>
              <span className="text-[10px] text-zinc-500">keys</span>
            </div>
          </div>

          <div className="p-3 bg-[#050811]/90 rounded-2xl border border-emerald-500/20">
            <span className="text-[10px] uppercase font-bold text-emerald-400/80 block">1-Year Sub</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-emerald-300">
                {keysInventory.filter((k) => k.planId === "annual-1y" || k.tier === "annual").length}
              </span>
              <span className="text-[10px] text-zinc-500">keys</span>
            </div>
          </div>

          <div className="p-3 bg-[#050811]/90 rounded-2xl border border-purple-500/20">
            <span className="text-[10px] uppercase font-bold text-purple-400/80 block">Available / Active</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-purple-300">
                {keysInventory.filter((k) => !k.isRedeemed && !k.redeemed).length}
              </span>
              <span className="text-[10px] text-zinc-500">unclaimed</span>
            </div>
          </div>

          <div className="p-3 bg-[#050811]/90 rounded-2xl border border-cyan-500/20">
            <span className="text-[10px] uppercase font-bold text-cyan-400/80 block">Banner Status</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span
                className={`w-2 h-2 rounded-full ${
                  siteSettings.announcementBanner.enabled ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"
                }`}
              />
              <span className="text-xs font-bold text-zinc-300">
                {siteSettings.announcementBanner.enabled ? "Broadcasting" : "Disabled"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Admin Navigation Tabs with Glowing Blue Gradient Highlight */}
      <div className="p-1.5 sm:p-2 rounded-2xl bg-gradient-to-r from-blue-950/90 via-[#0b1736] to-indigo-950/90 border-2 border-blue-500/50 shadow-2xl shadow-blue-600/20 ring-1 ring-blue-400/30 backdrop-blur-md flex items-center gap-2 overflow-x-auto custom-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab("vault")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "vault"
              ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white shadow-lg shadow-blue-600/40 border border-blue-400/50"
              : "bg-white/5 text-blue-200/70 hover:text-white hover:bg-white/10"
          }`}
        >
          <Gift className="w-4 h-4 text-amber-300" />
          <span>Product Key Vault & Handouts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "users"
              ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white shadow-lg shadow-blue-600/40 border border-blue-400/50"
              : "bg-white/5 text-blue-200/70 hover:text-white hover:bg-white/10"
          }`}
        >
          <Users className="w-4 h-4 text-indigo-300" />
          <span>User Subscriptions & Entitlements</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("inbox")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "inbox"
              ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white shadow-lg shadow-blue-600/40 border border-blue-400/50"
              : "bg-white/5 text-blue-200/70 hover:text-white hover:bg-white/10"
          }`}
        >
          <Mail className="w-4 h-4 text-cyan-300" />
          <span>Messages & Inbox</span>
          {unreadMessagesCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-cyan-400 text-zinc-950">
              {unreadMessagesCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("site_controls")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "site_controls"
              ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white shadow-lg shadow-blue-600/40 border border-blue-400/50"
              : "bg-white/5 text-blue-200/70 hover:text-white hover:bg-white/10"
          }`}
        >
          <Settings2 className="w-4 h-4 text-rose-300" />
          <span>Website & Studio Controls</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("audit_logs")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === "audit_logs"
              ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white shadow-lg shadow-blue-600/40 border border-blue-400/50"
              : "bg-white/5 text-blue-200/70 hover:text-white hover:bg-white/10"
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-300" />
          <span>Security Audit Trail</span>
        </button>
      </div>

      {/* Tab 1: Product Key Vault & Handouts (Includes Vault, Key Generator & Database) */}
      {activeTab === "vault" && (
        <div className="space-y-6">
          {/* Section 1: Pre-Generated Product Key Vault & Direct Handout Grid */}
          <ProductKeyVaultCenter
            defaultColumns={5}
            title="Product Key Vault & Handout Center"
            subtitle="Master inventory of pre-generated DPG keys. Copy, filter by tier, export, or handout passes directly to creators."
          />

          {/* Section 2: Batch Key Generator */}
          <div className="p-5 sm:p-6 bg-gradient-to-br from-[#0c101d] to-[#070b16] border border-purple-500/30 rounded-3xl space-y-6 shadow-xl">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Generate New Product Keys Batch</h3>
                <p className="text-xs text-zinc-400">
                  Generate authenticated 17-character product keys (<code className="font-mono text-purple-300 font-bold">DPGXXXXXXYYXXXXXX</code>) for community campaigns and giveaways.
                </p>
              </div>
            </div>

            <form onSubmit={handleRunGenerator} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Batch Count */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">Batch Quantity</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[1, 5, 10, 20, 50].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGenCount(num)}
                        className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          genCount === num
                            ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                            : "bg-white/5 text-zinc-400 hover:text-white"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Plan Tier Selection */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">Subscription Tier</label>
                  <select
                    value={genTier}
                    onChange={(e) => handleTierChange(e.target.value as PlanTier)}
                    className="w-full px-3 py-2 bg-[#050811] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-purple-400"
                  >
                    <option value="trial">72-Hour Trial (3 Days)</option>
                    <option value="monthly">Monthly Subscription (30 Days)</option>
                    <option value="annual">Annual Subscription (365 Days)</option>
                    <option value="lifetime">Lifetime VIP Access (Unlimited)</option>
                  </select>
                </div>

                {/* Duration Days */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="36500"
                    value={genDurationDays}
                    onChange={(e) => setGenDurationDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#050811] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-purple-400 font-mono"
                  />
                </div>

                {/* Plan Name / Label */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">Plan Display Name</label>
                  <input
                    type="text"
                    value={genPlanName}
                    onChange={(e) => setGenPlanName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#050811] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={generating}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Generating Batch...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Generate & Save {genCount} Product Keys to Database</span>
                  </>
                )}
              </button>
            </form>

            {genSuccessMessage && (
              <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl text-emerald-200 text-xs font-bold flex items-center justify-between gap-3">
                <span>{genSuccessMessage}</span>
                <button
                  onClick={() => {
                    const text = generatedBatch.map((k) => k.key).join("\n");
                    navigator.clipboard.writeText(text);
                  }}
                  className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 rounded-lg text-xs font-bold border border-emerald-400/40 cursor-pointer"
                >
                  Copy Batch ({generatedBatch.length})
                </button>
              </div>
            )}
          </div>

          {/* Section 3: Keys Inventory Database Table */}
          <div className="p-5 sm:p-6 bg-gradient-to-br from-[#0c101d] to-[#070b16] border border-blue-500/30 rounded-3xl space-y-4 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-black text-white">Keys Inventory Database</h3>
                <p className="text-xs text-zinc-400">
                  Manage, reset, or delete product keys stored in the database.
                </p>
              </div>

              {/* DB Filters & Search */}
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  value={dbFilterStatus}
                  onChange={(e) => setDbFilterStatus(e.target.value as "all" | "unused" | "redeemed")}
                  className="px-2.5 py-1.5 bg-[#050811] border border-white/10 rounded-xl text-white text-xs focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="unused">Unused (Available)</option>
                  <option value="redeemed">Redeemed</option>
                </select>

                <select
                  value={dbFilterTier}
                  onChange={(e) => setDbFilterTier(e.target.value as "all" | PlanTier)}
                  className="px-2.5 py-1.5 bg-[#050811] border border-white/10 rounded-xl text-white text-xs focus:outline-none"
                >
                  <option value="all">All Tiers</option>
                  <option value="trial">Trial</option>
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                  <option value="lifetime">Lifetime</option>
                </select>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={dbSearch}
                    onChange={(e) => setDbSearch(e.target.value)}
                    placeholder="Search keys..."
                    className="pl-7 pr-3 py-1.5 bg-[#050811] border border-white/10 rounded-xl text-white text-xs focus:outline-none w-44"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="max-h-[480px] overflow-y-auto rounded-2xl border border-white/10 bg-[#04060d] custom-scrollbar">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="bg-[#090e1e] text-zinc-400 font-bold uppercase text-[10px] tracking-wider border-b border-white/10 sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Product Key</th>
                    <th className="py-2.5 px-3">Tier / Plan</th>
                    <th className="py-2.5 px-3">Duration</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Redeemed By</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {filteredDbKeys.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-zinc-500">
                        No product keys match the current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredDbKeys.map((item, idx) => {
                      const isRedeemed = item.isRedeemed || item.redeemed;
                      const isCopied = copiedKey === item.key;

                      return (
                        <tr key={item.key} className="hover:bg-white/5 transition-colors">
                          <td className="py-2 px-3 text-zinc-500">{idx + 1}</td>
                          <td className="py-2 px-3 font-bold text-white tracking-wider select-all">
                            {item.key}
                          </td>
                          <td className="py-2 px-3 font-sans">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                item.tier === "trial"
                                  ? "bg-amber-500/20 text-amber-300"
                                  : item.tier === "monthly"
                                  ? "bg-indigo-500/20 text-indigo-300"
                                  : "bg-emerald-500/20 text-emerald-300"
                              }`}
                            >
                              {item.planName || item.tier}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-zinc-400">{item.durationDays} days</td>
                          <td className="py-2 px-3 font-sans">
                            {isRedeemed ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                Redeemed
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                Available
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-zinc-400 font-sans truncate max-w-[150px]">
                            {item.redeemedBy || "—"}
                          </td>
                          <td className="py-2 px-3 text-right">
                            <div className="flex items-center justify-end gap-1 font-sans">
                              <button
                                type="button"
                                onClick={() => handleCopySingleKey(item.key)}
                                className="p-1 rounded bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white"
                                title="Copy Key"
                              >
                                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                              {isRedeemed && (
                                <button
                                  type="button"
                                  onClick={() => handleResetKey(item.key)}
                                  className="p-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300"
                                  title="Reset Key to Unredeemed"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteKey(item.key)}
                                className="p-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300"
                                title="Delete Key"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: User Plan Overrides & Administrator Roles */}
      {activeTab === "users" && (
        <div className="space-y-6">
          {/* Card 1: Administrator Role Delegation */}
          <div className="p-5 sm:p-6 bg-gradient-to-br from-[#0c162d] via-[#081022] to-[#0d1c3a] border border-blue-500/40 rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-blue-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/40 text-blue-300 flex items-center justify-center shadow-inner">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <span>Designate & Grant Administrator Access</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/40 uppercase tracking-wider">
                      Role Delegation
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Grant administrative rights to team members or creators for full studio management.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleAddAdminUser} className="space-y-4 max-w-3xl">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">User Email <span className="text-blue-400">*</span></label>
                  <input
                    type="email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="creator@example.com"
                    required
                    className="w-full px-3.5 py-2.5 bg-[#050811] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">Username / Nickname</label>
                  <input
                    type="text"
                    value={newAdminUsername}
                    onChange={(e) => setNewAdminUsername(e.target.value)}
                    placeholder="e.g. LeadEditor"
                    className="w-full px-3.5 py-2.5 bg-[#050811] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-blue-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">Administrator Level</label>
                  <select
                    value={newAdminRole}
                    onChange={(e) => setNewAdminRole(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#050811] border border-white/10 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-blue-400"
                  >
                    <option value="admin">Studio Administrator (Full Management)</option>
                    <option value="super_admin">Super Admin (Master Root Access)</option>
                  </select>
                </div>
              </div>

              {adminActionMessage && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    adminActionMessage.type === "success"
                      ? "bg-emerald-950/80 text-emerald-200 border border-emerald-500/40"
                      : "bg-rose-950/80 text-rose-200 border border-rose-500/40"
                  }`}
                >
                  {adminActionMessage.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span>{adminActionMessage.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={adminActionLoading || !newAdminEmail.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {adminActionLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Promoting User...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>👑 Make User Administrator</span>
                  </>
                )}
              </button>
            </form>

            {/* Active Administrators Directory */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-zinc-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>Authorized Studio Administrators Directory</span>
                </h4>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {adminUsers.length} Active Admins
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#050811]">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="bg-[#0b1020] text-[10px] uppercase tracking-wider text-zinc-400 border-b border-white/10">
                    <tr>
                      <th className="py-2.5 px-4">Administrator</th>
                      <th className="py-2.5 px-4">Role Tier</th>
                      <th className="py-2.5 px-4">Added By</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                    {adminUsers.map((admin) => {
                      const isRoot = admin.email === "syntrex@gmail.com" || admin.email === "digitalplaygrid@gmail.com";
                      return (
                        <tr key={admin.id || admin.email} className="hover:bg-white/5 transition-colors">
                          <td className="py-2.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 flex items-center justify-center text-xs font-sans font-black">
                                {admin.username ? admin.username.charAt(0).toUpperCase() : "A"}
                              </div>
                              <div>
                                <div className="font-sans font-bold text-white text-xs">{admin.email}</div>
                                {admin.username && (
                                  <div className="text-[10px] text-zinc-400 font-mono">@{admin.username}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-md text-[10px] font-sans font-black uppercase tracking-wider ${
                                admin.role === "super_admin"
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                  : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              }`}
                            >
                              {admin.role === "super_admin" ? "👑 Super Admin" : "🛡️ Administrator"}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 font-sans text-zinc-400 text-xs">
                            {admin.addedBy}
                          </td>
                          <td className="py-2.5 px-4">
                            <span className="inline-flex items-center gap-1.5 text-emerald-400 text-[11px] font-sans font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Active
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            {isRoot ? (
                              <span className="text-[10px] text-zinc-500 font-sans italic">
                                Root Super Admin
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleRevokeAdmin(admin.email)}
                                className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-rose-500/30 text-xs font-sans font-bold transition-colors cursor-pointer"
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
          <div className="p-5 sm:p-6 bg-gradient-to-br from-[#0c101d] to-[#070b16] border border-indigo-500/30 rounded-3xl space-y-6 shadow-xl">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Manual User Subscription Override</h3>
                <p className="text-xs text-zinc-400">
                  Grant or extend creator entitlements directly to any creator by User ID or Email.
                </p>
              </div>
            </div>

            <form onSubmit={handleExecuteUserOverride} className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">User Email</label>
                  <input
                    type="email"
                    value={overrideEmail}
                    onChange={(e) => setOverrideEmail(e.target.value)}
                    placeholder="creator@example.com"
                    className="w-full px-3.5 py-2.5 bg-[#050811] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">Or User ID / Name</label>
                  <input
                    type="text"
                    value={overrideUserId}
                    onChange={(e) => setOverrideUserId(e.target.value)}
                    placeholder="UID or unique ID"
                    className="w-full px-3.5 py-2.5 bg-[#050811] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">Override Plan Tier</label>
                  <select
                    value={overrideTier}
                    onChange={(e) => setOverrideTier(e.target.value as PlanTier)}
                    className="w-full px-3.5 py-2.5 bg-[#050811] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
                  >
                    <option value="trial">72-Hour Trial</option>
                    <option value="monthly">Monthly Subscription</option>
                    <option value="annual">Annual Subscription</option>
                    <option value="lifetime">Lifetime Founder Pass</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="36500"
                    value={overrideDays}
                    onChange={(e) => setOverrideDays(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#050811] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400 font-mono"
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

              {overrideMessage && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold ${
                    overrideMessage.type === "success"
                      ? "bg-emerald-950/80 text-emerald-200 border border-emerald-500/40"
                      : "bg-rose-950/80 text-rose-200 border border-rose-500/40"
                  }`}
                >
                  {overrideMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={overrideLoading}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {overrideLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Applying Override...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-amber-300" />
                    <span>Apply Subscription Override & Activate Entitlements</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab: In-App Contact & Feedback Inbox */}
      {activeTab === "inbox" && <AdminInboxTab />}

      {/* Tab 5: Global Site Controls & Announcements */}
      {activeTab === "site_controls" && (
        <div className="p-5 sm:p-6 bg-gradient-to-br from-[#0c101d] to-[#070b16] border border-rose-500/30 rounded-3xl space-y-6 shadow-xl">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-300 flex items-center justify-center">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Global Studio Announcements & Controls</h3>
              <p className="text-xs text-zinc-400">
                Configure live announcement banners and emergency studio flags.
              </p>
            </div>
          </div>

          <div className="space-y-5 max-w-3xl">
            {/* Announcement Banner */}
            <div className="p-4 bg-[#050811] rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Global Announcement Banner</span>
                <input
                  type="checkbox"
                  checked={announcementEnabled}
                  onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Banner Announcement Text</label>
                <input
                  type="text"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="w-full px-3 py-2 bg-[#04060d] border border-white/10 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">Color Theme Accent</label>
                <div className="flex gap-2">
                  {(["amber", "emerald", "blue", "rose", "purple"] as const).map((variant) => (
                    <button
                      key={variant}
                      type="button"
                      onClick={() => setAnnouncementVariant(variant)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                        announcementVariant === variant
                          ? "bg-white text-zinc-950 shadow-md font-black"
                          : "bg-white/5 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Platform Flags */}
            <div className="p-4 bg-[#050811] rounded-2xl border border-white/10 space-y-3">
              <span className="text-xs font-bold text-white block">Platform Controls</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowGuest}
                    onChange={(e) => setAllowGuest(e.target.checked)}
                    className="w-4 h-4 accent-indigo-500"
                  />
                  <span>Allow Guest Anonymous Creator Access</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enforceDemo}
                    onChange={(e) => setEnforceDemo(e.target.checked)}
                    className="w-4 h-4 accent-indigo-500"
                  />
                  <span>Enforce Demonstration Mode Lock</span>
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveSiteSettings}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Save Global Site Settings
              </button>
              {settingsSavedSuccess && (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Settings saved & live!
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Security Audit Logs */}
      {activeTab === "audit_logs" && (
        <div className="p-5 sm:p-6 bg-gradient-to-br from-[#0c101d] to-[#070b16] border border-emerald-500/30 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-base font-black text-white">Security & Redemption Audit Trail</h3>
              <p className="text-xs text-zinc-400">
                Live stream of product key redemptions, plan overrides, and security events.
              </p>
            </div>
          </div>

          <div className="max-h-[440px] overflow-y-auto space-y-2 font-mono text-xs custom-scrollbar">
            {auditLogs.length === 0 ? (
              <div className="py-8 text-center text-zinc-500">No audit logs recorded in this session.</div>
            ) : (
              auditLogs.map((log, idx) => (
                <div
                  key={log.id || idx}
                  className="p-2.5 bg-[#04060d] rounded-xl border border-white/5 flex items-center justify-between gap-3 text-zinc-300"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="font-bold text-purple-300">[{log.eventType}]</span>
                    <span className="font-sans text-xs">{log.description}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 shrink-0">{log.userId || "System"}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
