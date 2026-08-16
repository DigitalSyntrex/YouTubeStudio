import React, { useState, useEffect } from "react";
import {
  Gift,
  Download,
  Check,
  Search,
  Clock,
  Calendar,
  Crown,
  Copy,
  ArrowDown,
  Shield,
  KeyRound,
  Sparkles,
  Layers,
  Mail,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { ALL_PREGENERATED_KEYS } from "../data/productKeys";
import { ProductKey } from "../types";

interface ProductKeyVaultCenterProps {
  onSelectKey?: (key: string) => void;
  onOpenAdminPortal?: () => void;
  title?: string;
  subtitle?: string;
  defaultColumns?: 3 | 4 | 5;
}

export const ProductKeyVaultCenter: React.FC<ProductKeyVaultCenterProps> = ({
  onSelectKey,
  onOpenAdminPortal,
  title = "Product Key Vault & Handout Center",
  subtitle = "Pre-generated master inventory for distributing passes to testers, VIPs, and community creators.",
  defaultColumns = 5,
}) => {
  const { keysInventory, isAdmin } = useAdmin();
  const [vaultFilter, setVaultFilter] = useState<"all" | "trial" | "monthly" | "annual">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [gridColumns, setGridColumns] = useState<3 | 4 | 5>(defaultColumns);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [emailedKey, setEmailedKey] = useState<string | null>(null);
  const [exportedSuccess, setExportedSuccess] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(10);

  // Master keys list combining pregenerated and runtime generated keys, EXCLUDING redeemed keys
  const rawKeys = keysInventory && keysInventory.length > 0 ? keysInventory : ALL_PREGENERATED_KEYS;
  const allAvailableKeys = rawKeys.filter((k) => !k.isRedeemed && !k.redeemed);

  const trialCount = allAvailableKeys.filter(
    (k) => k.planId === "trial-72h" || k.tier === "trial" || k.planTier === "trial"
  ).length;
  const monthlyCount = allAvailableKeys.filter(
    (k) => k.planId === "monthly-30d" || k.tier === "monthly" || k.planTier === "monthly"
  ).length;
  const annualCount = allAvailableKeys.filter(
    (k) => k.planId === "annual-1y" || k.tier === "annual" || k.planTier === "annual"
  ).length;

  const filteredKeys = allAvailableKeys.filter((item) => {
    const matchesFilter =
      vaultFilter === "all" ||
      (vaultFilter === "trial" && (item.planId === "trial-72h" || item.tier === "trial" || item.planTier === "trial")) ||
      (vaultFilter === "monthly" && (item.planId === "monthly-30d" || item.tier === "monthly" || item.planTier === "monthly")) ||
      (vaultFilter === "annual" && (item.planId === "annual-1y" || item.tier === "annual" || item.planTier === "annual"));

    const matchesSearch =
      searchQuery === "" ||
      item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.planName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Limit displayed keys to 10 initially with show more option
  const displayedKeys = filteredKeys.slice(0, visibleCount);

  // Reset pagination if filter changes
  useEffect(() => {
    setVisibleCount(10);
  }, [vaultFilter, searchQuery]);

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleEmailKey = (item: ProductKey) => {
    const subject = `Your DigitalPlayGrid Creator Studio Pass (${item.planName})`;
    const body = `Hi Creator,\n\nHere is your DigitalPlayGrid Creator Studio Product Key:\n\nProduct Key: ${item.key}\nPass Tier: ${item.planName}\nDuration: ${item.durationDays} Days\n\nHow to Redeem:\n1. Visit ${window.location.origin}\n2. Click "Redeem Pass" / "Have a key?"\n3. Enter your product key: ${item.key}\n\nStart organizing, designing, and publishing your YouTube Playthrough episodes with AI!\n\nBest regards,\nDigitalPlayGrid Studio Team`;
    
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    setEmailedKey(item.key);
    setTimeout(() => setEmailedKey(null), 2500);
  };

  const handleExportKeysList = (type: "all" | "trial" | "monthly" | "annual") => {
    let keysToExport = allAvailableKeys;
    let exportTitle = "DigitalPlayGrid All Product Keys";

    if (type === "trial") {
      keysToExport = allAvailableKeys.filter((k) => k.planId === "trial-72h" || k.tier === "trial" || k.planTier === "trial");
      exportTitle = `DigitalPlayGrid ${trialCount}x 72-Hour Trial Keys`;
    } else if (type === "monthly") {
      keysToExport = allAvailableKeys.filter((k) => k.planId === "monthly-30d" || k.tier === "monthly" || k.planTier === "monthly");
      exportTitle = `DigitalPlayGrid ${monthlyCount}x One-Month Subscription Keys`;
    } else if (type === "annual") {
      keysToExport = allAvailableKeys.filter((k) => k.planId === "annual-1y" || k.tier === "annual" || k.planTier === "annual");
      exportTitle = `DigitalPlayGrid ${annualCount}x One-Year Subscription Keys`;
    }

    const textContent =
      `${exportTitle}\nFormat: DPGXXXXXXYYXXXXXX\nTotal Count: ${keysToExport.length}\nDate: ${new Date().toISOString().split("T")[0]}\n\n` +
      keysToExport
        .map(
          (k, idx) =>
            `${String(idx + 1).padStart(2, "0")}. ${k.key}  [${k.planName}]  (${k.durationDays} Days)`
        )
        .join("\n");

    navigator.clipboard.writeText(textContent);
    setExportedSuccess(true);
    setTimeout(() => setExportedSuccess(false), 3000);
  };

  const getGridColClass = () => {
    switch (gridColumns) {
      case 3:
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5";
      case 4:
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1.5";
      case 5:
      default:
        return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-1.5";
    }
  };

  return (
    <div className="p-3 sm:p-3.5 bg-gradient-to-b from-[#0a0f1e] via-[#070b16] to-[#0d1322] border border-amber-500/30 rounded-2xl space-y-2.5 shadow-xl relative overflow-hidden">
      {/* Subtle decorative glow */}
      <div className="absolute top-0 right-0 w-64 h-24 bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Vault Header & Batch Export Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 pb-2 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner shrink-0">
            <Gift className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                {title}
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
                {allAvailableKeys.length} Available
              </span>
              {isAdmin && onOpenAdminPortal && (
                <button
                  type="button"
                  onClick={() => onOpenAdminPortal()}
                  className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/40 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Shield className="w-2.5 h-2.5 text-purple-400" />
                  <span>Admin Portal</span>
                </button>
              )}
            </div>
            <p className="text-[10px] text-zinc-400 mt-0.5">
              {subtitle} Format: <code className="font-mono text-amber-300 font-bold">DPGXXXXXXYYXXXXXX</code>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start lg:self-auto shrink-0 flex-wrap">
          {/* Grid Column Selector (3 / 4 / 5 Columns) */}
          <div className="hidden sm:flex items-center bg-[#04060c] border border-white/10 rounded-lg p-0.5 text-xs text-zinc-400">
            <span className="px-1.5 text-[9px] text-zinc-500 font-semibold">Columns:</span>
            <button
              type="button"
              onClick={() => setGridColumns(3)}
              className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-all cursor-pointer ${
                gridColumns === 3 ? "bg-amber-500 text-zinc-950 shadow-sm" : "hover:text-white"
              }`}
              title="3 Columns Grid"
            >
              3 Col
            </button>
            <button
              type="button"
              onClick={() => setGridColumns(4)}
              className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-all cursor-pointer ${
                gridColumns === 4 ? "bg-amber-500 text-zinc-950 shadow-sm" : "hover:text-white"
              }`}
              title="4 Columns Grid"
            >
              4 Col
            </button>
            <button
              type="button"
              onClick={() => setGridColumns(5)}
              className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-all cursor-pointer ${
                gridColumns === 5 ? "bg-amber-500 text-zinc-950 shadow-sm" : "hover:text-white"
              }`}
              title="5 Columns Grid (Compact)"
            >
              5 Col
            </button>
          </div>

          {/* Copy / Export Button */}
          <button
            type="button"
            onClick={() => handleExportKeysList(vaultFilter)}
            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
          >
            {exportedSuccess ? (
              <>
                <Check className="w-3 h-3 text-emerald-300" />
                <span>Copied All ({filteredKeys.length})</span>
              </>
            ) : (
              <>
                <Download className="w-3 h-3" />
                <span>Export ({filteredKeys.length})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Pills & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-1.5 relative z-10">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => setVaultFilter("all")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              vaultFilter === "all"
                ? "bg-amber-500 text-zinc-950 shadow-sm shadow-amber-500/20"
                : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
            }`}
          >
            All ({allAvailableKeys.length})
          </button>
          <button
            type="button"
            onClick={() => setVaultFilter("trial")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
              vaultFilter === "trial"
                ? "bg-amber-500 text-zinc-950 shadow-sm shadow-amber-500/20"
                : "bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20"
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>72h Trial ({trialCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setVaultFilter("monthly")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
              vaultFilter === "monthly"
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20"
                : "bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20"
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>1-Mo Sub ({monthlyCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setVaultFilter("annual")}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
              vaultFilter === "annual"
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
                : "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20"
            }`}
          >
            <Crown className="w-3 h-3" />
            <span>1-Yr Sub ({annualCount})</span>
          </button>
        </div>

        <div className="relative min-w-[200px]">
          <Search className="w-3 h-3 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search key or tier..."
            className="w-full pl-7 pr-2.5 py-1 bg-[#050811] border border-white/10 rounded-lg text-white text-[11px] placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
      </div>

      {/* Compact Grid of Keys (10 shown initially with Show More) */}
      <div className="max-h-[380px] overflow-y-auto pr-1 rounded-xl p-2 bg-[#04060d]/80 border border-white/5 shadow-inner relative z-10 custom-scrollbar">
        {filteredKeys.length === 0 ? (
          <div className="text-center py-6 text-zinc-500 text-xs">
            No active product keys found matching your criteria.
          </div>
        ) : (
          <div className={getGridColClass()}>
            {displayedKeys.map((item, index) => {
              const isCopied = copiedKey === item.key;
              const isEmailed = emailedKey === item.key;
              const isTrial = item.planId === "trial-72h" || item.tier === "trial" || item.planTier === "trial";
              const isMonthly = item.planId === "monthly-30d" || item.tier === "monthly" || item.planTier === "monthly";

              return (
                <div
                  key={item.key}
                  className={`p-1.5 rounded-lg border transition-all flex flex-col justify-between gap-1 relative group ${
                    isTrial
                      ? "bg-[#090e1a] hover:bg-[#0e1628] border-amber-500/20 hover:border-amber-500/40"
                      : isMonthly
                      ? "bg-[#090c1e] hover:bg-[#0f1430] border-indigo-500/20 hover:border-indigo-500/40"
                      : "bg-[#071317] hover:bg-[#0c1f24] border-emerald-500/20 hover:border-emerald-500/40"
                  }`}
                >
                  {/* Top Row: Key Index & Tier Badge */}
                  <div className="flex items-center justify-between gap-1 leading-none">
                    <span className="text-[8.5px] font-mono text-zinc-500">
                      #{index + 1}
                    </span>
                    <span
                      className={`px-1 py-0.5 rounded text-[7.5px] font-black uppercase tracking-wider leading-none ${
                        isTrial
                          ? "bg-amber-500/20 text-amber-300"
                          : isMonthly
                          ? "bg-indigo-500/20 text-indigo-300"
                          : "bg-emerald-500/20 text-emerald-300"
                      }`}
                    >
                      {isTrial ? "72h Trial" : isMonthly ? "1-Mo Sub" : "1-Yr Sub"}
                    </span>
                  </div>

                  {/* Key Code */}
                  <div className="font-mono text-[9.5px] font-black text-zinc-100 tracking-tight select-all break-all text-center py-0.5 px-0.5 bg-black/50 rounded border border-white/5 leading-tight">
                    {item.key}
                  </div>

                  {/* Actions: Use, Reduced Copy, and Email */}
                  <div className="flex items-center gap-0.5 pt-0.5">
                    {onSelectKey && (
                      <button
                        type="button"
                        onClick={() => onSelectKey(item.key)}
                        className="flex-1 py-0.5 px-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 text-[8.5px] font-bold border border-amber-500/30 flex items-center justify-center gap-0.5 transition-colors cursor-pointer"
                        title="Insert key into redemption window"
                      >
                        <ArrowDown className="w-2.5 h-2.5 shrink-0" />
                        <span>Use</span>
                      </button>
                    )}

                    {/* Reduced Size Copy Button */}
                    <button
                      type="button"
                      onClick={() => handleCopyKey(item.key)}
                      className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white border border-white/10 transition-colors flex items-center justify-center gap-0.5 text-[8.5px] cursor-pointer shrink-0"
                      title="Copy Key Code"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-2.5 h-2.5 text-emerald-400" />
                          <span className="text-[8px] text-emerald-400 font-bold">Done</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-2.5 h-2.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {/* Email Key Button */}
                    <button
                      type="button"
                      onClick={() => handleEmailKey(item)}
                      className="px-1.5 py-0.5 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 hover:text-blue-200 border border-blue-500/30 transition-colors flex items-center justify-center gap-0.5 text-[8.5px] cursor-pointer shrink-0"
                      title="Send / Open Key in Email"
                    >
                      {isEmailed ? (
                        <>
                          <Check className="w-2.5 h-2.5 text-blue-300" />
                          <span className="text-[8px] text-blue-300 font-bold">Sent</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-2.5 h-2.5" />
                          <span>Email</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination & Show More Footer (10 items per batch) */}
      {filteredKeys.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 px-0.5 text-[11px] text-zinc-400 relative z-10">
          <div className="text-[10px] sm:text-[11px] text-zinc-400">
            Showing <strong className="text-white font-mono">{displayedKeys.length}</strong> of{" "}
            <strong className="text-white font-mono">{filteredKeys.length}</strong> available keys
          </div>

          <div className="flex items-center gap-1.5">
            {visibleCount < filteredKeys.length && (
              <>
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => Math.min(prev + 10, filteredKeys.length))}
                  className="px-2.5 py-0.5 rounded-md bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 font-bold border border-amber-500/30 text-[10px] flex items-center gap-1 cursor-pointer transition-all"
                >
                  <ChevronDown className="w-3 h-3" />
                  <span>Show 10 More</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVisibleCount(filteredKeys.length)}
                  className="px-2.5 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-zinc-300 font-bold border border-white/10 text-[10px] cursor-pointer transition-all"
                >
                  <span>Show All ({filteredKeys.length})</span>
                </button>
              </>
            )}

            {visibleCount > 10 && (
              <button
                type="button"
                onClick={() => setVisibleCount(10)}
                className="px-2.5 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white font-medium text-[10px] flex items-center gap-1 cursor-pointer transition-all"
              >
                <ChevronUp className="w-3 h-3" />
                <span>Collapse to 10</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

