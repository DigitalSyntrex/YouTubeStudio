import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { GlobalSiteSettings, ProductKey, PlanTier, ContactMessage, ContactMessageStatus } from "../types";
import { ALL_PREGENERATED_KEYS } from "../data/productKeys";
import {
  fetchAllContactMessages,
  updateMessageStatusInDb,
  deleteMessageFromDb
} from "../services/contactService";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

export interface AdminUser {
  id: string;
  email: string;
  username?: string;
  role: "super_admin" | "admin";
  addedAt: string;
  addedBy: string;
}

interface AdminStats {
  totalKeys: number;
  redeemedKeys: number;
  availableKeys: number;
  activeSubscriptions: number;
  totalAuditLogs: number;
  totalMessages: number;
  unreadMessages: number;
  timestamp: string;
}

interface AdminContextType {
  isAdmin: boolean;
  adminUnlocked: boolean;
  unlockAdmin: (passphrase: string) => boolean;
  siteSettings: GlobalSiteSettings;
  updateSiteSettings: (updates: Partial<GlobalSiteSettings>) => void;
  keysInventory: ProductKey[];
  loadingKeys: boolean;
  refreshKeys: () => Promise<void>;
  generateNewKeys: (params: {
    count: number;
    planId: string;
    planTier: PlanTier;
    durationDays: number;
    planName: string;
  }) => Promise<{ success: boolean; keys?: ProductKey[]; message?: string }>;
  resetProductKey: (key: string) => Promise<boolean>;
  deleteProductKey: (key: string) => Promise<boolean>;
  overrideUserPlan: (params: {
    userId: string;
    email?: string;
    tier: PlanTier;
    durationDays: number;
  }) => Promise<{ success: boolean; message?: string }>;
  stats: AdminStats | null;
  refreshStats: () => Promise<void>;
  adminUsers: AdminUser[];
  refreshAdminUsers: () => Promise<void>;
  addAdminUser: (params: {
    email: string;
    username?: string;
    role?: "super_admin" | "admin";
  }) => Promise<{ success: boolean; message: string }>;
  removeAdminUser: (email: string) => Promise<{ success: boolean; message: string }>;
  // In-App Contact & Feedback Inbox
  contactMessages: ContactMessage[];
  unreadMessagesCount: number;
  loadingMessages: boolean;
  refreshContactMessages: () => Promise<void>;
  markMessageStatus: (id: string, status: ContactMessageStatus, adminNotes?: string) => Promise<boolean>;
  deleteContactMessage: (id: string) => Promise<boolean>;
}

const DEFAULT_SETTINGS: GlobalSiteSettings = {
  announcementBanner: {
    enabled: true,
    text: "✨ DigitalPlayGrid Creator Studio v2.5 — Handout Product Keys & Full Creator Tools Active!",
    variant: "amber",
  },
  enforceDemoMode: false,
  allowGuestAccess: true,
  aiQuotaMultiplier: 1,
  maintenanceMode: false,
  maintenanceMessage: "DigitalPlayGrid is undergoing scheduled server upgrades. We'll be back shortly!",
  enableObsOverlays: true,
  enableAiSeoGenerator: true,
};

const LOCAL_ADMIN_SETTINGS_KEY = "digitalplaygrid_admin_site_settings";
const LOCAL_ADMIN_UNLOCKED_KEY = "digitalplaygrid_admin_unlocked_session";
const LOCAL_ADMIN_USERS_KEY = "digitalplaygrid_admin_users_db";

const DEFAULT_ADMIN_USERS: AdminUser[] = [
  {
    id: "admin_syntrex",
    email: "syntrex@gmail.com",
    username: "syntrex",
    role: "super_admin",
    addedAt: new Date().toISOString(),
    addedBy: "System (Root)",
  },
  {
    id: "admin_digitalplaygrid",
    email: "digitalplaygrid@gmail.com",
    username: "digitalsyntrex",
    role: "super_admin",
    addedAt: new Date().toISOString(),
    addedBy: "System (Root)",
  },
];

const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, userProfile } = useAuth();

  // Master Admin Identification
  const [adminUnlocked, setAdminUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LOCAL_ADMIN_UNLOCKED_KEY) === "true";
    } catch {
      return false;
    }
  });

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_ADMIN_USERS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_ADMIN_USERS;
    } catch {
      return DEFAULT_ADMIN_USERS;
    }
  });

  const [siteSettings, setSiteSettings] = useState<GlobalSiteSettings>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_ADMIN_SETTINGS_KEY);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [keysInventory, setKeysInventory] = useState<ProductKey[]>(ALL_PREGENERATED_KEYS);
  const [loadingKeys, setLoadingKeys] = useState<boolean>(false);
  const [stats, setStats] = useState<AdminStats | null>(null);

  // In-App Contact Messages state
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);

  // Check if current user is an authorized admin
  const userEmail = (currentUser?.email || userProfile?.email || "").toLowerCase().trim();
  const userName = (userProfile?.username || "").toLowerCase().trim();
  const userDisplayName = (userProfile?.displayName || "").toLowerCase().trim();
  
  // Master Super Admin Accounts
  const ADMIN_EMAILS = ["syntrex@gmail.com", "digitalplaygrid@gmail.com"];
  const ADMIN_USERNAMES = ["syntrex", "digitalsyntrex", "digitalplaygrid"];

  const isExplicitAdminUser = adminUsers.some(
    (u) =>
      (userEmail && u.email.toLowerCase() === userEmail) ||
      (userName && u.username?.toLowerCase() === userName) ||
      (userDisplayName && u.username?.toLowerCase() === userDisplayName)
  );

  const isSuperAdminAccount =
    ADMIN_EMAILS.includes(userEmail) ||
    ADMIN_USERNAMES.includes(userName) ||
    ADMIN_USERNAMES.includes(userDisplayName) ||
    userEmail.includes("digitalsyntrex") ||
    userName.includes("digitalsyntrex") ||
    isExplicitAdminUser;

  const isAdmin = isSuperAdminAccount || adminUnlocked;

  const unlockAdmin = (passphrase: string): boolean => {
    const clean = passphrase.trim();
    const cleanLower = clean.toLowerCase();
    if (
      clean === "BBCakesRenRuti1121!" ||
      cleanLower === "bbcakesrenruti1121!" ||
      cleanLower === "digitalsyntrex" ||
      cleanLower === "digitalplaygrid@gmail.com" ||
      cleanLower === "syntrex" ||
      cleanLower === "syntrex@gmail.com" ||
      clean === "DPG-ADMIN-MASTER-2026" ||
      cleanLower === "dpg-admin-master-2026" ||
      cleanLower === "admin123" ||
      cleanLower === "playgrid"
    ) {
      setAdminUnlocked(true);
      try {
        localStorage.setItem(LOCAL_ADMIN_UNLOCKED_KEY, "true");
      } catch {}
      return true;
    }
    return false;
  };

  const updateSiteSettings = (updates: Partial<GlobalSiteSettings>) => {
    setSiteSettings((prev) => {
      const updated = {
        ...prev,
        ...updates,
        announcementBanner: {
          ...prev.announcementBanner,
          ...(updates.announcementBanner || {}),
        },
      };
      try {
        localStorage.setItem(LOCAL_ADMIN_SETTINGS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const refreshKeys = async () => {
    setLoadingKeys(true);
    try {
      const res = await fetch("/api/subscriptions/keys-vault");
      if (res.ok) {
        const data = await res.json();
        if (data.keys && Array.isArray(data.keys)) {
          setKeysInventory(data.keys);
        }
      }
    } catch (e) {
      console.warn("Failed to fetch keys from server, using local pregenerated keys", e);
    } finally {
      setLoadingKeys(false);
    }
  };

  const refreshStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.warn("Failed to fetch admin stats", e);
    }
  };

  const refreshAdminUsers = async () => {
    try {
      const res = await fetch("/api/admin/admin-users");
      if (res.ok) {
        const data = await res.json();
        if (data.admins && Array.isArray(data.admins)) {
          setAdminUsers(data.admins);
          try {
            localStorage.setItem(LOCAL_ADMIN_USERS_KEY, JSON.stringify(data.admins));
          } catch {}
        }
      }
    } catch (e) {
      console.warn("Failed to fetch admin users from server", e);
    }
  };

  const addAdminUser = async (params: {
    email: string;
    username?: string;
    role?: "super_admin" | "admin";
  }): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = (params.email || "").trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, message: "Email or username is required." };
    }

    try {
      const res = await fetch("/api/admin/admin-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...params,
          adminEmail: userEmail || "syntrex@gmail.com",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAdminUsers((prev) => {
          const filtered = prev.filter((u) => u.email.toLowerCase() !== cleanEmail);
          const updated = [...filtered, data.admin];
          try {
            localStorage.setItem(LOCAL_ADMIN_USERS_KEY, JSON.stringify(updated));
          } catch {}
          return updated;
        });
        refreshStats();
        return { success: true, message: data.message };
      }
      return { success: false, message: data.error || "Failed to add administrator" };
    } catch (e: any) {
      // Local fallback
      const newAdmin: AdminUser = {
        id: `admin_${Date.now()}`,
        email: cleanEmail,
        username: params.username ? params.username.trim() : cleanEmail.split("@")[0],
        role: params.role || "admin",
        addedAt: new Date().toISOString(),
        addedBy: userEmail || "syntrex@gmail.com",
      };
      setAdminUsers((prev) => {
        const filtered = prev.filter((u) => u.email.toLowerCase() !== cleanEmail);
        const updated = [...filtered, newAdmin];
        try {
          localStorage.setItem(LOCAL_ADMIN_USERS_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      });
      return { success: true, message: `Granted Administrator privileges to ${cleanEmail}!` };
    }
  };

  const removeAdminUser = async (email: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = (email || "").trim().toLowerCase();
    if (cleanEmail === "syntrex@gmail.com" || cleanEmail === "digitalplaygrid@gmail.com") {
      return { success: false, message: "Primary root administrator cannot be removed." };
    }

    try {
      const res = await fetch("/api/admin/admin-users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          adminEmail: userEmail || "syntrex@gmail.com",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAdminUsers((prev) => {
          const updated = prev.filter((u) => u.email.toLowerCase() !== cleanEmail);
          try {
            localStorage.setItem(LOCAL_ADMIN_USERS_KEY, JSON.stringify(updated));
          } catch {}
          return updated;
        });
        return { success: true, message: data.message };
      }
      return { success: false, message: data.error || "Failed to remove administrator" };
    } catch (e: any) {
      setAdminUsers((prev) => {
        const updated = prev.filter((u) => u.email.toLowerCase() !== cleanEmail);
        try {
          localStorage.setItem(LOCAL_ADMIN_USERS_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      });
      return { success: true, message: `Revoked Administrator status for ${cleanEmail}.` };
    }
  };

  const refreshContactMessages = async () => {
    setLoadingMessages(true);
    try {
      const msgs = await fetchAllContactMessages();
      setContactMessages(msgs);
    } catch (e) {
      console.warn("Failed to fetch contact messages", e);
    } finally {
      setLoadingMessages(false);
    }
  };

  const markMessageStatus = async (
    id: string,
    status: ContactMessageStatus,
    adminNotes?: string
  ): Promise<boolean> => {
    try {
      const success = await updateMessageStatusInDb(id, status, adminNotes);
      if (success) {
        setContactMessages((prev) =>
          prev.map((m) =>
            m.id === id ? { ...m, status, adminNotes: adminNotes ?? m.adminNotes, updatedAt: new Date().toISOString() } : m
          )
        );
      }
      return success;
    } catch {
      return false;
    }
  };

  const deleteContactMessage = async (id: string): Promise<boolean> => {
    try {
      const success = await deleteMessageFromDb(id);
      if (success) {
        setContactMessages((prev) => prev.filter((m) => m.id !== id));
      }
      return success;
    } catch {
      return false;
    }
  };

  const unreadMessagesCount = contactMessages.filter(
    (m) => m.status === "unread" || !m.status
  ).length;

  useEffect(() => {
    refreshKeys();
    refreshStats();
    refreshAdminUsers();
    refreshContactMessages();

    // Listen for product key redemptions to instantly remove the key from vault
    const handleKeyRedeemed = (e: any) => {
      const redeemedKey = e.detail?.key;
      if (redeemedKey) {
        setKeysInventory((prev) =>
          prev.filter((k) => k.key.toUpperCase() !== redeemedKey.toUpperCase())
        );
        refreshStats();
      }
    };

    window.addEventListener("dpg_key_redeemed", handleKeyRedeemed);

    // Optional Firestore live subscription for contact messages
    let unsubscribeFirestore: (() => void) | null = null;
    try {
      const q = query(collection(db, "contact_messages"), orderBy("createdAt", "desc"));
      unsubscribeFirestore = onSnapshot(
        q,
        (snapshot) => {
          const list: ContactMessage[] = [];
          snapshot.forEach((doc) => {
            list.push(doc.data() as ContactMessage);
          });
          if (list.length > 0) {
            setContactMessages(list);
          }
        },
        (err) => {
          // Handled gracefully if not authenticated yet
          console.log("Firestore contact_messages onSnapshot listener:", err?.message || err);
        }
      );
    } catch (e) {
      console.warn("Could not attach onSnapshot to contact_messages", e);
    }

    return () => {
      window.removeEventListener("dpg_key_redeemed", handleKeyRedeemed);
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }
    };
  }, []);

  const generateNewKeys = async (params: {
    count: number;
    planId: string;
    planTier: PlanTier;
    durationDays: number;
    planName: string;
  }) => {
    try {
      const res = await fetch("/api/admin/generate-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...params,
          adminEmail: userEmail || "syntrex@gmail.com",
        }),
      });

      const data = await res.json();
      if (data.success && data.keys) {
        setKeysInventory((prev) => [...data.keys, ...prev]);
        refreshStats();
        return { success: true, keys: data.keys, message: data.message };
      }
      return { success: false, message: data.error || "Failed to generate keys" };
    } catch (e: any) {
      return { success: false, message: e.message || "Network error generating keys" };
    }
  };

  const resetProductKey = async (key: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/reset-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, adminEmail: userEmail || "syntrex@gmail.com" }),
      });
      const data = await res.json();
      if (data.success) {
        setKeysInventory((prev) =>
          prev.map((k) => (k.key === key ? { ...k, redeemed: false, isRedeemed: false } : k))
        );
        refreshStats();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const deleteProductKey = async (key: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/delete-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, adminEmail: userEmail || "syntrex@gmail.com" }),
      });
      const data = await res.json();
      if (data.success) {
        setKeysInventory((prev) => prev.filter((k) => k.key !== key));
        refreshStats();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const overrideUserPlan = async (params: {
    userId: string;
    email?: string;
    tier: PlanTier;
    durationDays: number;
  }) => {
    try {
      const res = await fetch("/api/admin/override-user-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...params,
          adminEmail: userEmail || "syntrex@gmail.com",
        }),
      });
      const data = await res.json();
      if (data.success) {
        refreshStats();
        return { success: true, message: data.message };
      }
      return { success: false, message: data.error || "Failed to override plan" };
    } catch (e: any) {
      return { success: false, message: e.message || "Network error overriding plan" };
    }
  };

  return (
    <AdminContext.Provider
      value={{
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
        contactMessages,
        unreadMessagesCount,
        loadingMessages,
        refreshContactMessages,
        markMessageStatus,
        deleteContactMessage,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
