import React, { useState, useRef } from "react";
import {
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowDown,
  Shield,
  Clock,
  Crown,
  Calendar,
  Lock,
  ExternalLink
} from "lucide-react";
import { useSubscription } from "../context/SubscriptionContext";
import { useAdmin } from "../context/AdminContext";
import { isValidProductKeyFormat } from "../data/productKeys";
import { ProductKey } from "../types";
import { ProductKeyVaultCenter } from "./ProductKeyVaultCenter";

interface ProductKeyRedeemSectionProps {
  onSuccess?: () => void;
  compact?: boolean;
  onOpenAdminPortal?: () => void;
  showVault?: boolean;
}

export const ProductKeyRedeemSection: React.FC<ProductKeyRedeemSectionProps> = ({
  onSuccess,
  compact = false,
  onOpenAdminPortal,
  showVault = false,
}) => {
  const { redeemProductKey, entitlement } = useSubscription();
  const { isAdmin } = useAdmin();

  // Input & Redemption Form State
  const [inputKey, setInputKey] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{
    message: string;
    keyInfo?: ProductKey;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Handle format validation
  const cleanKey = inputKey.trim().toUpperCase();
  const isValidFormat = isValidProductKeyFormat(cleanKey);

  const handleRedeem = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!cleanKey) {
      setErrorMessage("Please enter your DigitalPlayGrid product key.");
      return;
    }

    if (!isValidFormat) {
      setErrorMessage("Invalid key format. Product keys must be in the format DPGXXXXXXYYXXXXXX (e.g. DPG456852DS754563).");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessResult(null);

    const result = await redeemProductKey(cleanKey);
    setLoading(false);

    if (result.success) {
      setSuccessResult({
        message: result.message || "Product key redeemed successfully!",
        keyInfo: result.keyInfo,
      });
      setInputKey("");
      if (onSuccess) onSuccess();
    } else {
      setErrorMessage(result.error || "Failed to redeem product key. Please check the code and try again.");
    }
  };

  const handleUseKeyInInput = (key: string) => {
    setInputKey(key);
    setErrorMessage(null);
    setSuccessResult(null);
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. PRODUCT KEY VAULT & HANDOUT CENTER (ADMIN ONLY, WHEN REQUESTED) */}
      {showVault && isAdmin && (
        <ProductKeyVaultCenter
          onSelectKey={handleUseKeyInInput}
          onOpenAdminPortal={onOpenAdminPortal}
          defaultColumns={5}
        />
      )}

      {/* 2. "HAVE A KEY?" REDEMPTION WINDOW (SHOWN TO ALL CREATORS) */}
      <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-br from-[#0c101c] via-[#090d18] to-[#121624] border border-amber-500/40 shadow-xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-24 bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                  Have a key?
                </h3>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                  Redeem Pass
                </span>
              </div>
              <p className="text-[10px] text-zinc-400">
                Enter your 17-character product key to instantly unlock full studio access and creator entitlements.
              </p>
            </div>
          </div>
        </div>

        {/* Input Field & Submission Container */}
        <div className="mt-2.5 space-y-2 relative z-10">
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-300 mb-1">
              <label htmlFor="product-key-input" className="flex items-center gap-1.5">
                <span>Enter Product Key Code</span>
                <span className="text-[10px] text-zinc-500 font-normal">
                  (Format: DPG + 6 digits + 2 letters + 6 digits)
                </span>
              </label>
              <span
                className={`text-[9px] font-mono ${
                  cleanKey.length === 17
                    ? isValidFormat
                      ? "text-emerald-400 font-bold"
                      : "text-red-400 font-bold"
                    : "text-zinc-500"
                }`}
              >
                {cleanKey.length}/17 characters
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5">
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  id="product-key-input"
                  type="text"
                  value={inputKey}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && isValidFormat && !loading) {
                      e.preventDefault();
                      handleRedeem();
                    }
                  }}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                    if (val.length <= 17) {
                      setInputKey(val);
                      setErrorMessage(null);
                    }
                  }}
                  placeholder="e.g. DPG456852DS754563"
                  className={`w-full pl-3 pr-8 py-1.5 bg-[#06080e] border rounded-lg text-white font-mono text-xs uppercase tracking-wider placeholder-zinc-600 focus:outline-none transition-all ${
                    isValidFormat
                      ? "border-emerald-500/50 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20"
                      : cleanKey.length === 17
                      ? "border-red-500/50 focus:border-red-400"
                      : "border-white/15 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20"
                  }`}
                />
                {cleanKey.length > 0 && (
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    {isValidFormat ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : cleanKey.length === 17 ? (
                      <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                    ) : null}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleRedeem()}
                disabled={loading || !isValidFormat}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                {loading ? (
                  <>
                    <div className="w-3 h-3 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" />
                    <span>Redeem Pass</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-2.5 bg-red-950/40 border border-red-500/40 rounded-lg text-red-300 text-xs flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{errorMessage}</p>
                <p className="text-[10px] text-red-300/80 mt-0.5">
                  Ensure the key has not already been used. You can click "Use" on any active code in the Vault above.
                </p>
              </div>
            </div>
          )}

          {/* Success Notice */}
          {successResult && (
            <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/50 rounded-lg text-emerald-200 text-xs flex items-start gap-2 shadow-md animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <div className="font-black text-white text-xs flex items-center gap-1.5">
                  <span>{successResult.message}</span>
                  <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded text-[9px] font-bold border border-emerald-500/40 uppercase">
                    Unlocked
                  </span>
                </div>
                <p className="text-[10px] text-emerald-300/90">
                  Your account has been upgraded with{" "}
                  <strong>{successResult.keyInfo?.planName || "Full Studio Pass"}</strong> (
                  {successResult.keyInfo?.durationDays} days). All episode creation, AI generation, and batch export tools are now active.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
