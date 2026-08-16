import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { SubscriptionPlan, UserSubscription, UserEntitlement, PlanTier, PaymentRecord, AuditLogEntry, ProductKey } from "../types";
import { useAuth } from "./AuthContext";

interface SubscriptionContextType {
  plans: SubscriptionPlan[];
  entitlement: UserEntitlement;
  activeSubscription: UserSubscription | null;
  loading: boolean;
  isUpgradeModalOpen: boolean;
  upgradeModalFeature: string | null;
  openUpgradeModal: (featureHint?: string) => void;
  closeUpgradeModal: () => void;
  checkout: (planId: string, paymentDetails?: any) => Promise<{ success: boolean; error?: string }>;
  redeemProductKey: (key: string) => Promise<{ success: boolean; error?: string; message?: string; keyInfo?: ProductKey }>;
  cancelAutoRenew: (subscriptionId: string) => Promise<boolean>;
  refreshSubscription: () => Promise<void>;
  requireEntitlement: (feature: keyof UserEntitlement, featureDisplayName?: string) => boolean;
  auditLogs: AuditLogEntry[];
  recordClientAudit: (action: string, resource: string, status: "allowed" | "denied" | "success" | "error", details?: any) => Promise<void>;
}

const DEFAULT_DEMO_ENTITLEMENT: UserEntitlement = {
  userId: "anonymous_demo",
  planTier: "free_demo",
  hasActiveSubscription: false,
  isTrial: false,
  isTrialExpired: false,
  canCreateSeries: false,
  canEditSeries: false,
  canExportBatch: false,
  canGenerateAi: true,
  canUseObsOverlay: true,
  canCloudBackup: false,
  maxSeriesCount: 1,
  aiMonthlyQuota: 3,
  aiUsedThisMonth: 0,
  expiresAt: null,
  timeRemainingFormatted: "Demo Mode (Read-Only)",
  updatedAt: new Date().toISOString(),
};

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, userProfile } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [entitlement, setEntitlement] = useState<UserEntitlement>(DEFAULT_DEMO_ENTITLEMENT);
  const [activeSubscription, setActiveSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [upgradeModalFeature, setUpgradeModalFeature] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  const userId = currentUser?.uid || userProfile?.uid || "anonymous_demo";
  const userEmail = currentUser?.email || userProfile?.email || "";

  // Fetch plans from backend API
  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/plans");
      if (res.ok) {
        const data = await res.json();
        if (data.plans) setPlans(data.plans);
      }
    } catch (e) {
      console.warn("Could not fetch subscription plans:", e);
    }
  };

  // Fetch current user entitlement from backend API
  const fetchEntitlement = useCallback(async () => {
    try {
      const query = new URLSearchParams({
        userId,
        email: userEmail,
      });
      const res = await fetch(`/api/subscriptions/current?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${userId}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.entitlement) {
          setEntitlement(data.entitlement);
        }
      }
    } catch (e) {
      console.warn("Could not fetch active entitlement:", e);
    } finally {
      setLoading(false);
    }
  }, [userId, userEmail]);

  // Fetch audit logs
  const fetchAuditLogs = async () => {
    try {
      const res = await fetch(`/api/audit-logs?userId=${encodeURIComponent(userId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.logs) setAuditLogs(data.logs);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchPlans();
    fetchEntitlement();
  }, [fetchEntitlement]);

  // Real-time trial countdown timer ticker
  useEffect(() => {
    if (!entitlement.expiresAt || entitlement.planTier === "lifetime") return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(entitlement.expiresAt!).getTime();
      const diffSec = Math.max(0, Math.floor((expiry - now) / 1000));

      if (diffSec <= 0) {
        setEntitlement((prev) => ({
          ...prev,
          hasActiveSubscription: false,
          planTier: "free_demo",
          isTrialExpired: true,
          timeRemainingSeconds: 0,
          timeRemainingFormatted: "Expired",
        }));
      } else {
        const days = Math.floor(diffSec / 86400);
        const hours = Math.floor((diffSec % 86400) / 3600);
        const minutes = Math.floor((diffSec % 3600) / 60);
        const formatted = days > 0 ? `${days}d ${hours}h left` : hours > 0 ? `${hours}h ${minutes}m left` : `${minutes}m left`;

        setEntitlement((prev) => ({
          ...prev,
          timeRemainingSeconds: diffSec,
          timeRemainingFormatted: formatted,
        }));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [entitlement.expiresAt, entitlement.planTier]);

  const openUpgradeModal = (featureHint?: string) => {
    setUpgradeModalFeature(featureHint || null);
    setIsUpgradeModalOpen(true);
  };

  const closeUpgradeModal = () => {
    setIsUpgradeModalOpen(false);
    setUpgradeModalFeature(null);
  };

  // Guard action entitlement on frontend with instant visual feedback
  const requireEntitlement = (feature: keyof UserEntitlement, featureDisplayName?: string): boolean => {
    if (entitlement.hasActiveSubscription && entitlement[feature]) {
      return true;
    }

    // Blocked: Record audit and open modal
    recordClientAudit(
      "action_blocked_demo_mode",
      String(feature),
      "denied",
      { requiredFeature: feature, featureDisplayName }
    );

    openUpgradeModal(featureDisplayName || String(feature));
    return false;
  };

  // Record audit log via backend API
  const recordClientAudit = async (
    action: string,
    resource: string,
    status: "allowed" | "denied" | "success" | "error",
    details?: any
  ) => {
    try {
      await fetch("/api/audit-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          userEmail,
          action,
          resource,
          status,
          details,
        }),
      });
    } catch (e) {}
  };

  // Checkout process
  const checkout = async (
    planId: string,
    paymentDetails?: any
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/subscriptions/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          userId,
          userEmail: userEmail || `${userId}@creator.playthrough.app`,
          userName: userProfile?.displayName || userProfile?.username || "Creator",
          paymentMethod: paymentDetails?.paymentMethod || "card",
          paymentDetails,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data.message || data.error || "Checkout failed. Please try again.",
        };
      }

      if (data.entitlement) {
        setEntitlement(data.entitlement);
      }
      if (data.subscription) {
        setActiveSubscription(data.subscription);
      }

      closeUpgradeModal();
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Network error while processing checkout.",
      };
    }
  };

  // Redeem Product Key
  const redeemProductKey = async (
    key: string
  ): Promise<{ success: boolean; error?: string; message?: string; keyInfo?: ProductKey }> => {
    try {
      const cleanKey = (key || "").trim().toUpperCase();
      const res = await fetch("/api/subscriptions/redeem-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: cleanKey,
          userId,
          userEmail: userEmail || `${userId}@creator.playthrough.app`,
          userName: userProfile?.displayName || userProfile?.username || "Creator",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data.message || data.error || "Key redemption failed. Please verify the code and try again.",
        };
      }

      if (data.entitlement) {
        setEntitlement(data.entitlement);
      }
      if (data.subscription) {
        setActiveSubscription(data.subscription);
      }

      // Notify application of redeemed key so it is instantly removed from Product Key Vault
      try {
        window.dispatchEvent(
          new CustomEvent("dpg_key_redeemed", {
            detail: { key: cleanKey, userId, email: userEmail },
          })
        );
        // Also record locally redeemed keys list
        const storedRedeemed = JSON.parse(localStorage.getItem("dpg_redeemed_keys") || "[]");
        if (!storedRedeemed.includes(cleanKey)) {
          storedRedeemed.push(cleanKey);
          localStorage.setItem("dpg_redeemed_keys", JSON.stringify(storedRedeemed));
        }
      } catch (e) {}

      await fetchAuditLogs();
      return {
        success: true,
        message: data.message || "Product key redeemed successfully!",
        keyInfo: data.keyInfo,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Network error while redeeming product key.",
      };
    }
  };

  // Cancel Auto-renew
  const cancelAutoRenew = async (subscriptionId: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/subscriptions/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, subscriptionId }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchEntitlement();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        plans,
        entitlement,
        activeSubscription,
        loading,
        isUpgradeModalOpen,
        upgradeModalFeature,
        openUpgradeModal,
        closeUpgradeModal,
        checkout,
        redeemProductKey,
        cancelAutoRenew,
        refreshSubscription: fetchEntitlement,
        requireEntitlement,
        auditLogs,
        recordClientAudit,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};
