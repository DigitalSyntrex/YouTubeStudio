import { SubscriptionPlan, UserSubscription, UserEntitlement, TrialUsageRecord, PaymentRecord, AuditLogEntry, PlanTier, ProductKey } from "../types";
import { ALL_PREGENERATED_KEYS, isValidProductKeyFormat } from "../data/productKeys";

// Master Subscription Plans Definition
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "trial-72h",
    name: "72-Hour Studio Pass",
    badgeLabel: "3-Day Trial",
    tagline: "Instant 72-hour full studio pass to test and build real playthrough series.",
    tier: "trial",
    priceUsd: 1.99,
    regularPriceUsd: 4.99,
    billingInterval: "72_hours",
    durationDays: 3,
    isRenewable: false,
    isOneTime: true,
    active: true,
    features: [
      "Full Playthrough Planner & Episode Breakdown Engine",
      "AI Gemini SEO Package & Episode Optimizer",
      "AI Thumbnail Studio & 1280x720 Exporter",
      "OBS Browser Source Transparent Live Overlays",
      "Batch Exporting (YouTube Studio CSV, Markdown, JSON)",
      "Cloud Sync & Multi-Series Management",
      "One-time activation pass (non-recurring)",
    ],
  },
  {
    id: "monthly-30d",
    name: "Creator Monthly Pass",
    badgeLabel: "Standard",
    tagline: "Full ongoing studio access for active YouTube gaming creators.",
    tier: "monthly",
    priceUsd: 9.99,
    regularPriceUsd: 14.99,
    billingInterval: "30_days",
    durationDays: 30,
    isRenewable: true,
    isOneTime: false,
    active: true,
    features: [
      "Unlimited Playthrough Series & Episode Breakdowns",
      "Unlimited AI SEO Descriptions, Tags & Chapter Generators",
      "High-CTR 1280x720 Thumbnail Builder & PNG Export",
      "OBS Live Transparent Overlay HUDs & Hotkey Sync",
      "All Batch Export Formats (YouTube Studio, CSV, MD)",
      "Continuous Cloud Backup & Multi-Device Sync",
      "Standard Creator Support",
    ],
  },
  {
    id: "annual-1y",
    name: "Studio Pro Annual Pass",
    badgeLabel: "Save 17% • Most Popular",
    tagline: "Best value for dedicated creators. Equivalent to $8.33 / month.",
    tier: "annual",
    priceUsd: 99.99,
    regularPriceUsd: 119.88,
    billingInterval: "1_year",
    durationDays: 365,
    isRenewable: true,
    isOneTime: false,
    active: true,
    popular: true,
    features: [
      "Everything in Creator Monthly Pass",
      "17% Annual Savings ($8.33 / month effective rate)",
      "Priority High-Speed AI Processing Queue",
      "Pro Creator Badge on Thumbnail Overlays",
      "Custom OBS HUD Themes & Extended Layouts",
      "Early Access to All New Playthrough Features",
      "Priority 24/7 Creator Support",
    ],
  },
  {
    id: "lifetime",
    name: "Legendary Lifetime Founder",
    badgeLabel: "Founder Special",
    tagline: "Pay once, own DigitalPlayGrid forever. Zero recurring subscription fees.",
    tier: "lifetime",
    priceUsd: 149.99,
    regularPriceUsd: 299.99,
    billingInterval: "lifetime",
    durationDays: 36500,
    isRenewable: false,
    isOneTime: true,
    active: true,
    features: [
      "Permanent Lifetime Access — Zero Subscriptions Ever",
      "All Future Updates, Tools, and Integrations Included",
      "Exclusive Gold Founder Badge & Profile Styling",
      "Maximum Quota Tier for Gemini AI Models",
      "VIP Discord & Direct Developer Feedback Channel",
      "Dedicated Onboarding & Playthrough Setup Assistance",
    ],
  },
];

// In-Memory Storage Databases
const subscriptionsDb = new Map<string, UserSubscription>();
const trialUsageDb = new Map<string, TrialUsageRecord>();
const paymentsDb = new Map<string, PaymentRecord>();
const auditLogsDb: AuditLogEntry[] = [];
const userSeriesDb = new Map<string, any[]>(); // userId -> series list
const aiUsageDb = new Map<string, number>(); // userId -> usage count
const productKeysDb = new Map<string, ProductKey>();

// Initialize product keys db with pregenerated keys
ALL_PREGENERATED_KEYS.forEach((pk) => {
  productKeysDb.set(pk.key.toUpperCase(), { ...pk });
});

// Format time remaining helper
export function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return "Expired";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h left`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m left`;
  }
  return `${minutes}m left`;
}

// Compute active user entitlement based on database state
export function computeUserEntitlement(userId: string, email?: string): UserEntitlement {
  const cleanId = (userId || "").trim();
  const cleanEmail = (email || "").trim().toLowerCase();

  // Find all active subscriptions for this user
  const userSubs = Array.from(subscriptionsDb.values()).filter(
    (s) => s.userId === cleanId && (s.status === "active" || s.status === "trialing")
  );

  // Check if any sub is active by date
  const now = new Date();
  let activeSub: UserSubscription | null = null;

  for (const sub of userSubs) {
    const end = new Date(sub.endDate);
    if (end.getTime() > now.getTime()) {
      activeSub = sub;
      break;
    } else {
      // Mark as expired
      sub.status = "expired";
      sub.updatedAt = now.toISOString();
      subscriptionsDb.set(sub.id, sub);
    }
  }

  // Check if trial was previously used
  const hasUsedTrial = Array.from(trialUsageDb.values()).some(
    (t) => t.userId === cleanId || (cleanEmail && t.email.toLowerCase() === cleanEmail)
  );

  const aiUsed = aiUsageDb.get(cleanId) || 0;

  // Master Admin Accounts get permanent Lifetime VIP Entitlement automatically
  const isMasterAdminAccount =
    cleanEmail === "digitalplaygrid@gmail.com" ||
    cleanEmail === "syntrex@gmail.com" ||
    cleanId === "user_digitalsyntrex" ||
    cleanId === "user_syntrex" ||
    cleanId.includes("digitalsyntrex") ||
    cleanId.includes("syntrex");

  if (isMasterAdminAccount && !activeSub) {
    return {
      userId: cleanId,
      planTier: "lifetime",
      hasActiveSubscription: true,
      isTrial: false,
      isTrialExpired: false,
      canCreateSeries: true,
      canEditSeries: true,
      canExportBatch: true,
      canGenerateAi: true,
      canUseObsOverlay: true,
      canCloudBackup: true,
      maxSeriesCount: 1000,
      aiMonthlyQuota: 5000,
      aiUsedThisMonth: aiUsed,
      expiresAt: null,
      timeRemainingFormatted: "Lifetime Master Admin",
      updatedAt: now.toISOString(),
    };
  }

  if (activeSub) {
    const expiresDate = new Date(activeSub.endDate);
    const diffMs = expiresDate.getTime() - now.getTime();
    const remainingSec = Math.max(0, Math.floor(diffMs / 1000));
    const isLifetime = activeSub.tier === "lifetime";

    return {
      userId: cleanId,
      planTier: activeSub.tier,
      hasActiveSubscription: true,
      isTrial: activeSub.tier === "trial",
      isTrialExpired: false,
      canCreateSeries: true,
      canEditSeries: true,
      canExportBatch: true,
      canGenerateAi: true,
      canUseObsOverlay: true,
      canCloudBackup: true,
      maxSeriesCount: isLifetime ? 1000 : activeSub.tier === "annual" ? 100 : 25,
      aiMonthlyQuota: isLifetime ? 1000 : activeSub.tier === "annual" ? 500 : 200,
      aiUsedThisMonth: aiUsed,
      expiresAt: isLifetime ? null : activeSub.endDate,
      timeRemainingSeconds: isLifetime ? undefined : remainingSec,
      timeRemainingFormatted: isLifetime ? "Lifetime Active" : formatTimeRemaining(remainingSec),
      updatedAt: now.toISOString(),
    };
  }

  // Demo / Unsubscribed Mode
  return {
    userId: cleanId || "anonymous_demo",
    planTier: "free_demo",
    hasActiveSubscription: false,
    isTrial: false,
    isTrialExpired: hasUsedTrial,
    canCreateSeries: false,
    canEditSeries: false,
    canExportBatch: false,
    canGenerateAi: true, // Demo quota limited to 3
    canUseObsOverlay: true, // Read-only demo preview with watermark
    canCloudBackup: false,
    maxSeriesCount: 1, // Demo sample series only
    aiMonthlyQuota: 3,
    aiUsedThisMonth: aiUsed,
    expiresAt: null,
    timeRemainingFormatted: "Demo Mode (Read-Only)",
    updatedAt: now.toISOString(),
  };
}

// Process Subscription Checkout
export interface CheckoutRequest {
  planId: string;
  userId: string;
  userEmail: string;
  userName?: string;
  cardNumber?: string;
  cardExp?: string;
  cardCvc?: string;
  paymentMethod?: string;
}

export function processSubscriptionCheckout(req: CheckoutRequest): {
  success: boolean;
  subscription?: UserSubscription;
  entitlement?: UserEntitlement;
  error?: string;
  code?: string;
} {
  const { planId, userId, userEmail, paymentMethod } = req;
  const cleanId = (userId || "").trim();
  const cleanEmail = (userEmail || "").trim().toLowerCase();

  if (!cleanId) {
    return { success: false, error: "User ID is required for checkout.", code: "INVALID_USER" };
  }

  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
  if (!plan) {
    return { success: false, error: "Selected subscription plan not found.", code: "PLAN_NOT_FOUND" };
  }

  const now = new Date();

  // 1. Anti-Abuse Check for 72-Hour Trial
  if (plan.tier === "trial") {
    const existingTrial = Array.from(trialUsageDb.values()).find(
      (t) => t.userId === cleanId || (cleanEmail && t.email.toLowerCase() === cleanEmail)
    );

    if (existingTrial) {
      recordAuditLog({
        userId: cleanId,
        userEmail: cleanEmail,
        action: "trial_claim_rejected",
        resource: "/api/subscriptions/checkout",
        status: "denied",
        details: { reason: "Trial already claimed", originalClaimDate: existingTrial.claimedAt },
      });

      return {
        success: false,
        error: "You have already claimed the 72-Hour Studio Trial. Please select the Monthly, Annual, or Lifetime plan to continue.",
        code: "TRIAL_ALREADY_USED",
      };
    }
  }

  // 2. Calculate Expiration Date
  const endDate = new Date(now);
  if (plan.durationDays >= 36500) {
    endDate.setFullYear(endDate.getFullYear() + 100);
  } else if (plan.tier === "trial") {
    endDate.setHours(endDate.getHours() + 72);
  } else {
    endDate.setDate(endDate.getDate() + plan.durationDays);
  }

  // 3. Create Subscription Record
  const subId = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  const newSubscription: UserSubscription = {
    id: subId,
    userId: cleanId,
    planId: plan.id,
    tier: plan.tier,
    status: plan.tier === "trial" ? "trialing" : "active",
    startDate: now.toISOString(),
    endDate: endDate.toISOString(),
    autoRenew: plan.isRenewable,
    amountPaid: plan.priceUsd,
    paymentMethod: paymentMethod || "card_stripe_simulated",
    transactionId: transactionId,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  subscriptionsDb.set(subId, newSubscription);

  // 4. Record Trial Usage if trial plan
  if (plan.tier === "trial") {
    const trialRecord: TrialUsageRecord = {
      id: `trial_${cleanId}`,
      userId: cleanId,
      email: cleanEmail,
      claimedAt: now.toISOString(),
      expiresAt: endDate.toISOString(),
      transactionId: transactionId,
    };
    trialUsageDb.set(trialRecord.id, trialRecord);
  }

  // 5. Create Payment Receipt Record
  const paymentRecord: PaymentRecord = {
    id: transactionId,
    userId: cleanId,
    planId: plan.id,
    planName: plan.name,
    amount: plan.priceUsd,
    currency: "USD",
    status: "succeeded",
    provider: "DigitalPlayGrid Pay / Stripe Verified",
    createdAt: now.toISOString(),
  };
  paymentsDb.set(transactionId, paymentRecord);

  // 6. Record Audit Log
  recordAuditLog({
    userId: cleanId,
    userEmail: cleanEmail,
    action: "subscription_activated",
    resource: "/api/subscriptions/checkout",
    status: "success",
    details: {
      planId: plan.id,
      tier: plan.tier,
      amount: plan.priceUsd,
      subId: subId,
      transactionId: transactionId,
      expiresAt: endDate.toISOString(),
    },
  });

  // 7. Compute updated entitlement
  const entitlement = computeUserEntitlement(cleanId, cleanEmail);

  return {
    success: true,
    subscription: newSubscription,
    entitlement,
  };
}

// Cancel Subscription (Disables auto-renewal)
export function cancelUserSubscription(userId: string, subscriptionId: string): {
  success: boolean;
  subscription?: UserSubscription;
  error?: string;
} {
  const cleanId = (userId || "").trim();
  const sub = subscriptionsDb.get(subscriptionId);

  if (!sub || sub.userId !== cleanId) {
    return { success: false, error: "Subscription record not found." };
  }

  sub.autoRenew = false;
  sub.updatedAt = new Date().toISOString();
  subscriptionsDb.set(subscriptionId, sub);

  recordAuditLog({
    userId: cleanId,
    action: "subscription_auto_renew_disabled",
    resource: "/api/subscriptions/cancel",
    status: "success",
    details: { subscriptionId, expiresAt: sub.endDate },
  });

  return { success: true, subscription: sub };
}

// Record Audit Log Entry
export function recordAuditLog(entry: Omit<AuditLogEntry, "id" | "timestamp">): AuditLogEntry {
  const fullEntry: AuditLogEntry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };

  auditLogsDb.unshift(fullEntry);
  if (auditLogsDb.length > 2000) {
    auditLogsDb.pop();
  }

  return fullEntry;
}

export function getAuditLogs(userId?: string): AuditLogEntry[] {
  if (userId) {
    return auditLogsDb.filter((l) => l.userId === userId);
  }
  return auditLogsDb.slice(0, 100);
}

// Series Database Helpers
export function getUserSeriesList(userId: string): any[] {
  return userSeriesDb.get(userId) || [];
}

export function saveUserSeriesList(userId: string, seriesList: any[]): void {
  userSeriesDb.set(userId, seriesList);
}

export function incrementAiUsage(userId: string): number {
  const current = aiUsageDb.get(userId) || 0;
  const updated = current + 1;
  aiUsageDb.set(userId, updated);
  return updated;
}

// ----------------------------------------------------
// Product Key Redemption & Management Functions
// ----------------------------------------------------

export interface RedeemKeyRequest {
  key: string;
  userId: string;
  userEmail: string;
  userName?: string;
}

export function getProductKeyInfo(rawKey: string): {
  isValidFormat: boolean;
  exists: boolean;
  isRedeemed: boolean;
  keyInfo?: ProductKey;
  error?: string;
} {
  const cleanKey = (rawKey || "").trim().toUpperCase();
  const isValidFormat = isValidProductKeyFormat(cleanKey);

  if (!isValidFormat) {
    return {
      isValidFormat: false,
      exists: false,
      isRedeemed: false,
      error: "Invalid key format. Product keys must be in the format DPGXXXXXXYYXXXXXX (e.g. DPG456852DS754563).",
    };
  }

  const keyRecord = productKeysDb.get(cleanKey);
  if (!keyRecord) {
    return {
      isValidFormat: true,
      exists: false,
      isRedeemed: false,
      error: "Product key was not found in the DigitalPlayGrid security vault.",
    };
  }

  return {
    isValidFormat: true,
    exists: true,
    isRedeemed: keyRecord.isRedeemed,
    keyInfo: keyRecord,
  };
}

export function redeemProductKey(req: RedeemKeyRequest): {
  success: boolean;
  subscription?: UserSubscription;
  entitlement?: UserEntitlement;
  keyInfo?: ProductKey;
  error?: string;
  code?: string;
} {
  const { key, userId, userEmail, userName } = req;
  const cleanId = (userId || "").trim();
  const cleanEmail = (userEmail || "").trim().toLowerCase();
  const cleanKey = (key || "").trim().toUpperCase();

  if (!cleanId) {
    return { success: false, error: "User ID is required to redeem key.", code: "INVALID_USER" };
  }

  if (!isValidProductKeyFormat(cleanKey)) {
    return {
      success: false,
      error: "Invalid key format. Keys must be in the format DPGXXXXXXYYXXXXXX (e.g. DPG456852DS754563).",
      code: "INVALID_FORMAT",
    };
  }

  const keyRecord = productKeysDb.get(cleanKey);
  if (!keyRecord) {
    recordAuditLog({
      userId: cleanId,
      userEmail: cleanEmail,
      action: "product_key_invalid_attempt",
      resource: "/api/subscriptions/redeem-key",
      status: "denied",
      details: { attemptedKey: cleanKey },
    });

    return {
      success: false,
      error: "The provided product key does not exist or has expired.",
      code: "KEY_NOT_FOUND",
    };
  }

  if (keyRecord.isRedeemed) {
    recordAuditLog({
      userId: cleanId,
      userEmail: cleanEmail,
      action: "product_key_already_redeemed_attempt",
      resource: "/api/subscriptions/redeem-key",
      status: "denied",
      details: {
        key: cleanKey,
        originallyRedeemedBy: keyRecord.redeemedByUserEmail || keyRecord.redeemedByUserId,
        originallyRedeemedAt: keyRecord.redeemedAt,
      },
    });

    return {
      success: false,
      error: `This product key has already been redeemed on ${
        keyRecord.redeemedAt ? new Date(keyRecord.redeemedAt).toLocaleDateString() : "an earlier date"
      }.`,
      code: "KEY_ALREADY_REDEEMED",
    };
  }

  const now = new Date();

  // Find matching subscription plan
  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === keyRecord.planId) || {
    id: keyRecord.planId,
    name: keyRecord.planName,
    tier: keyRecord.tier,
    priceUsd: 0,
    regularPriceUsd: 0,
    billingInterval: keyRecord.tier === "trial" ? "72_hours" : keyRecord.tier === "monthly" ? "30_days" : "1_year",
    durationDays: keyRecord.durationDays,
    isRenewable: false,
    isOneTime: true,
    active: true,
    features: [],
  };

  // Calculate Expiration Date
  const endDate = new Date(now);
  if (keyRecord.tier === "trial") {
    endDate.setHours(endDate.getHours() + 72);
  } else {
    endDate.setDate(endDate.getDate() + keyRecord.durationDays);
  }

  // Mark key as redeemed
  keyRecord.isRedeemed = true;
  keyRecord.redeemed = true;
  keyRecord.redeemedByUserId = cleanId;
  keyRecord.redeemedByUserEmail = cleanEmail || `${cleanId}@creator.app`;
  keyRecord.redeemedBy = cleanEmail || cleanId;
  keyRecord.redeemedAt = now.toISOString();
  productKeysDb.set(cleanKey, keyRecord);

  // Create active subscription
  const subId = `sub_key_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const transactionId = `tx_key_${cleanKey}`;

  const newSubscription: UserSubscription = {
    id: subId,
    userId: cleanId,
    planId: plan.id,
    tier: plan.tier,
    status: plan.tier === "trial" ? "trialing" : "active",
    startDate: now.toISOString(),
    endDate: endDate.toISOString(),
    autoRenew: false,
    amountPaid: 0,
    paymentMethod: `Product Key (${cleanKey})`,
    transactionId: transactionId,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  subscriptionsDb.set(subId, newSubscription);

  // If trial key, track usage
  if (plan.tier === "trial") {
    const trialRecord: TrialUsageRecord = {
      id: `trial_${cleanId}`,
      userId: cleanId,
      email: cleanEmail,
      claimedAt: now.toISOString(),
      expiresAt: endDate.toISOString(),
      transactionId: transactionId,
    };
    trialUsageDb.set(trialRecord.id, trialRecord);
  }

  // Create Payment Record (Key Redemption Receipt)
  const paymentRecord: PaymentRecord = {
    id: transactionId,
    userId: cleanId,
    planId: plan.id,
    planName: `${plan.name} (Key Redemption)`,
    amount: 0,
    currency: "USD",
    status: "succeeded",
    provider: `Product Key: ${cleanKey}`,
    createdAt: now.toISOString(),
  };
  paymentsDb.set(transactionId, paymentRecord);

  // Record Audit Log
  recordAuditLog({
    userId: cleanId,
    userEmail: cleanEmail,
    action: "product_key_redeemed_successfully",
    resource: "/api/subscriptions/redeem-key",
    status: "success",
    details: {
      key: cleanKey,
      planId: plan.id,
      tier: plan.tier,
      planName: keyRecord.planName,
      subId: subId,
      expiresAt: endDate.toISOString(),
    },
  });

  const entitlement = computeUserEntitlement(cleanId, cleanEmail);

  return {
    success: true,
    subscription: newSubscription,
    entitlement,
    keyInfo: keyRecord,
  };
}

export function getAllProductKeys(): ProductKey[] {
  return Array.from(productKeysDb.values());
}

// Generate a random product key strictly matching DPGXXXXXXYYXXXXXX format
export function generateRandomProductKeyCode(): string {
  const digits1 = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join("");
  const letters = Array.from({ length: 2 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join("");
  const digits2 = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join("");
  return `DPG${digits1}${letters}${digits2}`;
}

// Admin: Generate new batch of product keys
export function adminGenerateKeys(options: {
  count: number;
  planId: string;
  planTier: PlanTier;
  durationDays: number;
  planName: string;
  adminEmail?: string;
}): ProductKey[] {
  const generated: ProductKey[] = [];
  const count = Math.min(Math.max(1, options.count || 1), 100);

  for (let i = 0; i < count; i++) {
    let newKey = generateRandomProductKeyCode();
    // Ensure uniqueness
    while (productKeysDb.has(newKey)) {
      newKey = generateRandomProductKeyCode();
    }

    const keyObj: ProductKey = {
      key: newKey,
      planId: options.planId,
      planTier: options.planTier,
      planName: options.planName,
      durationDays: options.durationDays,
      createdAt: new Date().toISOString(),
      redeemed: false,
    };

    productKeysDb.set(newKey, keyObj);
    generated.push(keyObj);
  }

  recordAuditLog({
    userId: options.adminEmail || "admin",
    userEmail: options.adminEmail,
    action: "admin_generated_product_keys",
    resource: "/api/admin/generate-keys",
    status: "success",
    details: {
      count: generated.length,
      planTier: options.planTier,
      planName: options.planName,
      durationDays: options.durationDays,
    },
  });

  return generated;
}

// Admin: Reset key to unredeemed status
export function adminResetKey(key: string, adminEmail?: string): boolean {
  const cleanKey = (key || "").trim().toUpperCase();
  const existing = productKeysDb.get(cleanKey);
  if (!existing) return false;

  existing.redeemed = false;
  existing.redeemedAt = undefined;
  existing.redeemedBy = undefined;
  existing.redeemedByEmail = undefined;
  productKeysDb.set(cleanKey, existing);

  recordAuditLog({
    userId: adminEmail || "admin",
    userEmail: adminEmail,
    action: "admin_reset_product_key",
    resource: "/api/admin/reset-key",
    status: "success",
    details: { key: cleanKey },
  });

  return true;
}

// Admin: Delete key
export function adminDeleteKey(key: string, adminEmail?: string): boolean {
  const cleanKey = (key || "").trim().toUpperCase();
  if (!productKeysDb.has(cleanKey)) return false;

  productKeysDb.delete(cleanKey);

  recordAuditLog({
    userId: adminEmail || "admin",
    userEmail: adminEmail,
    action: "admin_deleted_product_key",
    resource: "/api/admin/delete-key",
    status: "success",
    details: { key: cleanKey },
  });

  return true;
}

// Admin: Manually grant/override subscription for any user
export function adminOverrideUserPlan(options: {
  userId: string;
  email?: string;
  tier: PlanTier;
  durationDays: number;
  adminEmail?: string;
}): UserEntitlement {
  const cleanId = (options.userId || "").trim();
  const cleanEmail = (options.email || "").trim().toLowerCase();
  const now = new Date();
  const endDate = new Date(now.getTime() + options.durationDays * 24 * 60 * 60 * 1000);

  const subId = `sub_admin_${cleanId}_${Date.now()}`;
  const overrideSub: UserSubscription = {
    id: subId,
    userId: cleanId,
    userEmail: cleanEmail,
    planId: `admin-${options.tier}`,
    tier: options.tier,
    status: "active",
    startDate: now.toISOString(),
    endDate: endDate.toISOString(),
    autoRenew: false,
    amountPaid: 0,
    paymentMethod: "admin_override",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  subscriptionsDb.set(subId, overrideSub);

  recordAuditLog({
    userId: options.adminEmail || "admin",
    userEmail: options.adminEmail,
    action: "admin_overrode_user_subscription",
    resource: "/api/admin/override-user-plan",
    status: "success",
    details: {
      targetUserId: cleanId,
      targetEmail: cleanEmail,
      tier: options.tier,
      durationDays: options.durationDays,
      expiresAt: endDate.toISOString(),
    },
  });

  return computeUserEntitlement(cleanId, cleanEmail);
}

// Admin: Get overall system statistics
export function adminGetStats() {
  const allKeys = Array.from(productKeysDb.values());
  const redeemedCount = allKeys.filter((k) => k.redeemed).length;
  const activeSubs = Array.from(subscriptionsDb.values()).filter((s) => s.status === "active" || s.status === "trialing").length;

  return {
    totalKeys: allKeys.length,
    redeemedKeys: redeemedCount,
    availableKeys: allKeys.length - redeemedCount,
    activeSubscriptions: activeSubs,
    totalAuditLogs: auditLogsDb.length,
    timestamp: new Date().toISOString(),
  };
}

export interface AdminUserRecord {
  id: string;
  email: string;
  username?: string;
  role: "super_admin" | "admin";
  addedAt: string;
  addedBy: string;
}

const adminUsersDb = new Map<string, AdminUserRecord>([
  [
    "syntrex@gmail.com",
    {
      id: "admin_syntrex",
      email: "syntrex@gmail.com",
      username: "syntrex",
      role: "super_admin",
      addedAt: new Date().toISOString(),
      addedBy: "System (Root)",
    },
  ],
  [
    "digitalplaygrid@gmail.com",
    {
      id: "admin_digitalplaygrid",
      email: "digitalplaygrid@gmail.com",
      username: "digitalsyntrex",
      role: "super_admin",
      addedAt: new Date().toISOString(),
      addedBy: "System (Root)",
    },
  ],
]);

export function getAdminUsersList(): AdminUserRecord[] {
  return Array.from(adminUsersDb.values());
}

export function addAdminUser(params: {
  email: string;
  username?: string;
  role?: "super_admin" | "admin";
  adminEmail?: string;
}): { success: boolean; admin?: AdminUserRecord; message: string } {
  const cleanEmail = (params.email || "").trim().toLowerCase();
  if (!cleanEmail) {
    return { success: false, message: "Email or username is required." };
  }

  const existing = adminUsersDb.get(cleanEmail);
  if (existing) {
    existing.role = params.role || "admin";
    if (params.username) existing.username = params.username.trim();
    adminUsersDb.set(cleanEmail, existing);
    return { success: true, admin: existing, message: `Updated administrator role for ${cleanEmail}.` };
  }

  const record: AdminUserRecord = {
    id: `admin_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    email: cleanEmail,
    username: params.username ? params.username.trim() : cleanEmail.split("@")[0],
    role: params.role || "admin",
    addedAt: new Date().toISOString(),
    addedBy: params.adminEmail || "syntrex@gmail.com",
  };

  adminUsersDb.set(cleanEmail, record);

  recordAuditLog({
    userId: params.adminEmail || "admin",
    userEmail: params.adminEmail,
    action: "admin_user_added",
    resource: "/api/admin/admin-users",
    status: "success",
    details: {
      targetEmail: cleanEmail,
      role: record.role,
      addedBy: params.adminEmail,
    },
  });

  return { success: true, admin: record, message: `Successfully granted Administrator privileges to ${cleanEmail}!` };
}

export function removeAdminUser(params: {
  email: string;
  adminEmail?: string;
}): { success: boolean; message: string } {
  const cleanEmail = (params.email || "").trim().toLowerCase();
  if (cleanEmail === "syntrex@gmail.com" || cleanEmail === "digitalplaygrid@gmail.com") {
    return { success: false, message: "Root Super Administrator accounts cannot be removed." };
  }

  if (!adminUsersDb.has(cleanEmail)) {
    return { success: false, message: "Administrator record not found." };
  }

  adminUsersDb.delete(cleanEmail);

  recordAuditLog({
    userId: params.adminEmail || "admin",
    userEmail: params.adminEmail,
    action: "admin_user_removed",
    resource: "/api/admin/admin-users",
    status: "success",
    details: {
      targetEmail: cleanEmail,
      removedBy: params.adminEmail,
    },
  });

  return { success: true, message: `Revoked Administrator privileges from ${cleanEmail}.` };
}

// In-Memory Contact Messages Database
export interface ContactMessageRecord {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  topic: "feedback" | "feature" | "bug" | "help" | "general";
  userId?: string;
  userEmail?: string;
  status: "unread" | "read" | "in_progress" | "resolved" | "archived";
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

const contactMessagesDb = new Map<string, ContactMessageRecord>();

// Seed sample welcome support message
const INITIAL_MESSAGE: ContactMessageRecord = {
  id: "msg_welcome_seed",
  name: "DigitalPlayGrid Creator Bot",
  email: "system@digitalplaygrid.com",
  subject: "Welcome to your Direct Admin Inbox!",
  message: "Hi syntrex! All user feedback, bug reports, and contact form submissions sent from your website will appear right here in real time. You can review them, mark them as in-progress or resolved, copy sender emails, or reply directly.",
  topic: "general",
  status: "unread",
  adminNotes: "System initial welcome note",
  createdAt: new Date(Date.now() - 3600000).toISOString(),
  updatedAt: new Date(Date.now() - 3600000).toISOString(),
};
contactMessagesDb.set(INITIAL_MESSAGE.id, INITIAL_MESSAGE);

export function saveContactMessage(params: {
  name: string;
  email: string;
  subject: string;
  message: string;
  topic?: "feedback" | "feature" | "bug" | "help" | "general";
  userId?: string;
  userEmail?: string;
}): { success: boolean; message: ContactMessageRecord } {
  const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();
  const record: ContactMessageRecord = {
    id,
    name: params.name || "Anonymous Creator",
    email: params.email,
    subject: params.subject || "Message from DPG User",
    message: params.message,
    topic: params.topic || "general",
    userId: params.userId,
    userEmail: params.userEmail,
    status: "unread",
    createdAt: now,
    updatedAt: now,
  };

  contactMessagesDb.set(id, record);

  recordAuditLog({
    userId: params.userId || "visitor",
    userEmail: params.email,
    action: "contact_message_submitted",
    resource: "/api/contact/submit",
    status: "success",
    details: {
      messageId: id,
      subject: record.subject,
      topic: record.topic,
    },
  });

  return { success: true, message: record };
}

export function getAllContactMessages(): ContactMessageRecord[] {
  return Array.from(contactMessagesDb.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function updateContactMessage(params: {
  id: string;
  status?: "unread" | "read" | "in_progress" | "resolved" | "archived";
  adminNotes?: string;
}): { success: boolean; message?: ContactMessageRecord; error?: string } {
  const existing = contactMessagesDb.get(params.id);
  if (!existing) {
    return { success: false, error: "Message not found" };
  }

  if (params.status) existing.status = params.status;
  if (params.adminNotes !== undefined) existing.adminNotes = params.adminNotes;
  existing.updatedAt = new Date().toISOString();

  contactMessagesDb.set(params.id, existing);
  return { success: true, message: existing };
}

export function deleteContactMessage(id: string): { success: boolean } {
  const deleted = contactMessagesDb.delete(id);
  return { success: deleted };
}


