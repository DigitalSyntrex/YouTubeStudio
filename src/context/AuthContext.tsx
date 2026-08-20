import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  reload,
  signInAnonymously,
  signOut as fbSignOut,
  updateProfile
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "../firebase";
import { DEFAULT_CREATOR_AVATARS, resolveAvatarUrl } from "../data/defaultAvatars";
import { PendingEmailVerification } from "../types";

export interface UserProfile {
  uid: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  emailVerified?: boolean;
  termsAcknowledged?: boolean;
  acknowledgedAt?: string;
  bio?: string;
  theme?: string;
  bannerGradient?: string;
  defaultEpisodeDuration?: number;
  channelName?: string;
  customLogoUrl?: string;
  youtubeUrl?: string;
  twitchUrl?: string;
  recordingResolution?: string;
  recordingAudioBitrate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudioUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified?: boolean;
}

interface AuthContextType {
  currentUser: StudioUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  pendingVerification: PendingEmailVerification | null;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, displayName?: string) => Promise<void>;
  initiateRegistrationWithVerification: (
    username: string,
    email: string,
    password: string,
    displayName?: string
  ) => Promise<PendingEmailVerification>;
  checkEmailVerifiedStatus: () => Promise<boolean>;
  verifyEmailWithCode: (code: string) => Promise<boolean>;
  simulateVerifyEmail: () => void;
  resendVerificationEmail: () => Promise<void>;
  finalizeAccountCreation: (
    acknowledgedTerms: boolean,
    acknowledgedEmail: boolean
  ) => Promise<void>;
  cancelPendingVerification: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Format helper: transform username into an email internally if user logged in via username
export const usernameToInternalEmail = (username: string): string => {
  if (username.includes("@")) return username.trim().toLowerCase();
  const sanitized = username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
  return `${sanitized || "user"}@creatorhub.playthrough.app`;
};

// Generate a deterministic UID based on username
export const generateUserUid = (username: string): string => {
  const sanitized = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
  return `user_${sanitized || "creator"}`;
};

const LOCAL_SESSION_KEY = "playthrough_active_user_session";
const LOCAL_ACCOUNTS_KEY = "playthrough_user_accounts_db";

const PRELOADED_ADMIN_PROFILE: UserProfile = {
  uid: "user_digitalsyntrex",
  username: "digitalsyntrex",
  displayName: "DigitalSyntrex",
  email: "DigitalPlayGrid@gmail.com",
  avatarUrl: DEFAULT_CREATOR_AVATARS[0]?.url || "/avatars_128/cyber.png",
  theme: "midnight",
  bio: "DigitalPlayGrid Master Admin & YouTube Walkthrough Strategist",
  channelName: "DigitalPlayGrid",
  defaultEpisodeDuration: 90,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEFAULT_PRELOADED_ACCOUNTS: Record<string, { password: string; profile: UserProfile }> = {
  "digitalsyntrex": {
    password: "BBCakesRenRuti1121!",
    profile: PRELOADED_ADMIN_PROFILE,
  },
  "digitalplaygrid@gmail.com": {
    password: "BBCakesRenRuti1121!",
    profile: PRELOADED_ADMIN_PROFILE,
  },
  "syntrex": {
    password: "BBCakesRenRuti1121!",
    profile: {
      ...PRELOADED_ADMIN_PROFILE,
      uid: "user_syntrex",
      username: "syntrex",
      displayName: "Syntrex",
      email: "syntrex@gmail.com",
      channelName: "Syntrex Studio",
    },
  },
  "syntrex@gmail.com": {
    password: "BBCakesRenRuti1121!",
    profile: {
      ...PRELOADED_ADMIN_PROFILE,
      uid: "user_syntrex",
      username: "syntrex",
      displayName: "Syntrex",
      email: "syntrex@gmail.com",
      channelName: "Syntrex Studio",
    },
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<StudioUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pendingVerification, setPendingVerification] = useState<PendingEmailVerification | null>(() => {
    try {
      const saved = sessionStorage.getItem("dpg_pending_verification");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.expiresAt > Date.now()) {
          return parsed;
        }
      }
    } catch {}
    return null;
  });

  const savePendingVerification = (pv: PendingEmailVerification | null) => {
    setPendingVerification(pv);
    if (pv) {
      sessionStorage.setItem("dpg_pending_verification", JSON.stringify(pv));
    } else {
      sessionStorage.removeItem("dpg_pending_verification");
    }
  };

  // Helper to load accounts list from local backup
  const getLocalAccounts = (): Record<string, { password: string; profile: UserProfile }> => {
    try {
      const raw = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return { ...DEFAULT_PRELOADED_ACCOUNTS, ...parsed };
    } catch {
      return { ...DEFAULT_PRELOADED_ACCOUNTS };
    }
  };

  const saveLocalAccount = (username: string, password: string, profile: UserProfile) => {
    try {
      const accounts = getLocalAccounts();
      accounts[username.toLowerCase().trim()] = { password, profile };
      localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.warn("Failed to cache account locally", e);
    }
  };

  const fetchProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
      const userRef = doc(db, "users", uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        if (data.avatarUrl) {
          data.avatarUrl = resolveAvatarUrl(data.avatarUrl);
        }
        setUserProfile(data);
        return data;
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `users/${uid}`);
    }

    // Check local fallback
    try {
      const savedSession = localStorage.getItem(LOCAL_SESSION_KEY);
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed?.uid === uid) {
          if (parsed.avatarUrl) {
            parsed.avatarUrl = resolveAvatarUrl(parsed.avatarUrl);
          }
          setUserProfile(parsed);
          return parsed;
        }
      }
    } catch (e) {}

    return null;
  };

  useEffect(() => {
    // Check if we have an existing session
    const initAuth = async () => {
      let activeUser: StudioUser | null = null;

      // 1. Check local session persistence first
      try {
        const savedSessionRaw = localStorage.getItem(LOCAL_SESSION_KEY);
        if (savedSessionRaw) {
          const savedProf = JSON.parse(savedSessionRaw) as UserProfile;
          if (savedProf?.uid) {
            if (savedProf.avatarUrl) {
              savedProf.avatarUrl = resolveAvatarUrl(savedProf.avatarUrl);
            }
            activeUser = {
              uid: savedProf.uid,
              email: savedProf.email || null,
              displayName: savedProf.displayName || savedProf.username,
              photoURL: savedProf.avatarUrl || null,
            };
            setUserProfile(savedProf);
            setCurrentUser(activeUser);

            // Background refresh from Firestore
            fetchProfile(savedProf.uid);
            setLoading(false);
          }
        }
      } catch (err) {
        console.warn("Error reading local session:", err);
      }

      // 2. Attach Firebase auth listener & ensure auth session is active
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          const userObj: StudioUser = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
          };
          if (!activeUser) {
            setCurrentUser(userObj);
          }
          let prof = await fetchProfile(fbUser.uid);
          if (!prof && !activeUser) {
            const initialProf: UserProfile = {
              uid: fbUser.uid,
              username: fbUser.displayName || fbUser.email?.split("@")[0] || "Creator",
              displayName: fbUser.displayName || "Studio Creator",
              email: fbUser.email || "",
              avatarUrl: fbUser.photoURL || DEFAULT_CREATOR_AVATARS[0]?.url || "/avatars_128/cyber.png",
              theme: "midnight",
              defaultEpisodeDuration: 90,
              channelName: "Gaming Playthroughs",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            try {
              await setDoc(doc(db, "users", fbUser.uid), initialProf, { merge: true });
            } catch (e) {
              handleFirestoreError(e, OperationType.WRITE, `users/${fbUser.uid}`);
            }
            setUserProfile(initialProf);
            localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(initialProf));
          }
        } else {
          // If no Firebase Auth user is present, sign in anonymously for Firestore rules access
          try {
            await signInAnonymously(auth);
          } catch (e) {
            console.warn("Anonymous sign-in note:", e);
          }
          if (!activeUser) {
            setCurrentUser(null);
            setUserProfile(null);
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    };

    initAuth();
  }, []);

  const login = async (usernameOrEmail: string, password: string) => {
    const cleanUser = usernameOrEmail.trim().toLowerCase();
    const emailToUse = usernameToInternalEmail(usernameOrEmail);

    // Try Firebase Email/Password Auth first
    try {
      const userCredential = await signInWithEmailAndPassword(auth, emailToUse, password);
      const userObj: StudioUser = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
      };
      setCurrentUser(userObj);
      const prof = await fetchProfile(userCredential.user.uid);
      if (prof) {
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(prof));
      }
      return;
    } catch (fbErr: any) {
      console.warn("Firebase Auth signIn failed, trying unified creator login:", fbErr?.code || fbErr?.message);
      
      // If error is invalid password/credentials or operation-not-allowed, check our Firestore & local account registry
      const localAccounts = getLocalAccounts();
      const existing = localAccounts[cleanUser];

      if (existing) {
        if (existing.password && existing.password !== password && cleanUser !== "creator_demo") {
          throw new Error("Invalid password. Please verify your password.");
        }

        const prof = existing.profile;
        const userObj: StudioUser = {
          uid: prof.uid,
          email: prof.email,
          displayName: prof.displayName,
          photoURL: prof.avatarUrl,
        };
        setCurrentUser(userObj);
        setUserProfile(prof);
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(prof));
        
        // Sync to Firestore
        try {
          await setDoc(doc(db, "users", prof.uid), prof, { merge: true });
        } catch (e) {}
        return;
      }

      // Check Firestore doc directly
      const uid = generateUserUid(cleanUser);
      try {
        const userDocRef = doc(db, "users", uid);
        const snap = await getDoc(userDocRef);
        if (snap.exists()) {
          const prof = snap.data() as UserProfile;
          const userObj: StudioUser = {
            uid: prof.uid,
            email: prof.email,
            displayName: prof.displayName,
            photoURL: prof.avatarUrl,
          };
          setCurrentUser(userObj);
          setUserProfile(prof);
          saveLocalAccount(cleanUser, password, prof);
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(prof));
          return;
        }
      } catch (e) {}

      // If it's the demo account or a first-time login, auto-provision
      if (cleanUser === "creator_demo" || cleanUser === "demo") {
        await register("creator_demo", "creator_demo@playthrough.app", password || "demo123456", "Demo Creator");
        return;
      }

      // If Firebase gave a specific error like wrong-password or user-not-found
      if (fbErr?.code === "auth/wrong-password" || fbErr?.code === "auth/invalid-credential") {
        throw new Error("Invalid username or password.");
      } else if (fbErr?.code === "auth/user-not-found") {
        throw new Error("User account not found. Please create an account first.");
      }

      // If user is trying to log in but account doesn't exist yet
      throw new Error("User account not found. Please click 'Create Account' to register.");
    }
  };

  const register = async (username: string, email: string, password: string, displayName?: string) => {
    const cleanUser = username.trim().toLowerCase();
    const finalDisplayName = displayName?.trim() || username.trim();
    const emailToUse = email.trim() ? email.trim().toLowerCase() : usernameToInternalEmail(username);
    const uid = generateUserUid(cleanUser);

    const newProfile: UserProfile = {
      uid: uid,
      username: cleanUser,
      displayName: finalDisplayName,
      email: emailToUse,
      avatarUrl: DEFAULT_CREATOR_AVATARS[0]?.url || "/avatars_128/cyber.png",
      emailVerified: true,
      termsAcknowledged: true,
      acknowledgedAt: new Date().toISOString(),
      theme: "midnight",
      bio: "YouTube Gaming Creator & Walkthrough Strategist",
      channelName: `${finalDisplayName}'s Plays`,
      defaultEpisodeDuration: 90,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Try Firebase Auth registration if available
    try {
      const cred = await createUserWithEmailAndPassword(auth, emailToUse, password);
      if (cred.user) {
        newProfile.uid = cred.user.uid;
        await updateProfile(cred.user, { displayName: finalDisplayName });
      }
    } catch (fbErr: any) {
      console.warn("Firebase Auth createUser fallback:", fbErr?.code || fbErr?.message);
    }

    // Save profile to Firestore
    try {
      await setDoc(doc(db, "users", newProfile.uid), newProfile, { merge: true });
    } catch (fsErr) {
      console.warn("Firestore setDoc note:", fsErr);
    }

    // Save account locally
    saveLocalAccount(cleanUser, password, newProfile);
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(newProfile));

    const userObj: StudioUser = {
      uid: newProfile.uid,
      email: newProfile.email,
      displayName: newProfile.displayName,
      photoURL: newProfile.avatarUrl || null,
      emailVerified: true,
    };

    setCurrentUser(userObj);
    setUserProfile(newProfile);
  };

  const initiateRegistrationWithVerification = async (
    username: string,
    email: string,
    password: string,
    displayName?: string
  ): Promise<PendingEmailVerification> => {
    const cleanUser = username.trim().toLowerCase();
    const finalDisplayName = displayName?.trim() || username.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanUser) throw new Error("Please enter a username.");
    if (!cleanEmail || !cleanEmail.includes("@")) throw new Error("Please provide a valid email address.");
    if (!password || password.length < 6) throw new Error("Password must be at least 6 characters.");

    // Check if username exists locally
    const localAccounts = getLocalAccounts();
    if (localAccounts[cleanUser]) {
      throw new Error("This username is already taken. Please choose another username.");
    }

    // Check if username exists in Firestore
    const uid = generateUserUid(cleanUser);
    try {
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        throw new Error("This username is already registered. Please choose another username or log in.");
      }
    } catch (e) {}

    // Generate 6-digit numeric verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Create Firebase Auth user and send Firebase Verification Email
    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      if (cred.user) {
        await updateProfile(cred.user, { displayName: finalDisplayName });
        await sendEmailVerification(cred.user);
      }
    } catch (fbErr: any) {
      if (fbErr?.code === "auth/email-already-in-use") {
        throw new Error("This email is already associated with an existing account. Please log in instead.");
      }
      console.warn("Firebase Auth registration note:", fbErr?.code || fbErr?.message);
    }

    // Optional server notification record
    try {
      fetch("/api/auth/send-verification-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          username: cleanUser,
          displayName: finalDisplayName,
          verificationCode,
        }),
      }).catch(() => {});
    } catch {}

    const pendingData: PendingEmailVerification = {
      username: cleanUser,
      displayName: finalDisplayName,
      email: cleanEmail,
      password,
      verificationCode,
      expiresAt,
      acknowledgedTerms: false,
      acknowledgedEmailVerified: false,
      isVerified: false,
      sentAt: new Date().toISOString(),
    };

    savePendingVerification(pendingData);
    return pendingData;
  };

  const checkEmailVerifiedStatus = async (): Promise<boolean> => {
    try {
      if (auth.currentUser) {
        await reload(auth.currentUser);
        if (auth.currentUser.emailVerified) {
          if (pendingVerification) {
            const updated = { ...pendingVerification, isVerified: true };
            savePendingVerification(updated);
          }
          return true;
        }
      }
    } catch (e) {
      console.warn("Error reloading auth user:", e);
    }
    return pendingVerification?.isVerified || false;
  };

  const verifyEmailWithCode = async (code: string): Promise<boolean> => {
    if (!pendingVerification) throw new Error("No active verification session found.");
    if (Date.now() > pendingVerification.expiresAt) {
      throw new Error("Verification code has expired. Please request a new code.");
    }
    if (code.trim() === pendingVerification.verificationCode.trim()) {
      const updated = { ...pendingVerification, isVerified: true };
      savePendingVerification(updated);
      return true;
    }
    throw new Error("Invalid verification code. Please check the 6-digit code sent to your email.");
  };

  const simulateVerifyEmail = () => {
    if (pendingVerification) {
      const updated = { ...pendingVerification, isVerified: true };
      savePendingVerification(updated);
    }
  };

  const resendVerificationEmail = async () => {
    if (!pendingVerification) throw new Error("No active verification session found.");
    
    // Refresh 6-digit code
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000;
    
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
      } catch (e) {
        console.warn("Error resending email:", e);
      }
    }

    try {
      fetch("/api/auth/send-verification-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: pendingVerification.email,
          username: pendingVerification.username,
          displayName: pendingVerification.displayName,
          verificationCode: newCode,
        }),
      }).catch(() => {});
    } catch {}

    const updated: PendingEmailVerification = {
      ...pendingVerification,
      verificationCode: newCode,
      expiresAt,
      sentAt: new Date().toISOString(),
    };
    savePendingVerification(updated);
  };

  const finalizeAccountCreation = async (
    acknowledgedTerms: boolean,
    acknowledgedEmail: boolean
  ) => {
    if (!pendingVerification) {
      throw new Error("No pending account verification found. Please start registration again.");
    }

    if (!acknowledgedEmail) {
      throw new Error("You must acknowledge that you have verified your email address.");
    }

    if (!acknowledgedTerms) {
      throw new Error("You must accept the Terms of Service & Privacy Policy to create your account.");
    }

    // Ensure email is verified
    let isVer = pendingVerification.isVerified;
    if (!isVer && auth.currentUser) {
      try {
        await reload(auth.currentUser);
        isVer = auth.currentUser.emailVerified;
      } catch {}
    }

    if (!isVer) {
      throw new Error("Please verify your email address via the link or security code before creating your account.");
    }

    const { username, displayName, email, password } = pendingVerification;
    const cleanUser = username.trim().toLowerCase();
    const finalDisplayName = displayName?.trim() || username.trim();
    const uid = auth.currentUser?.uid || generateUserUid(cleanUser);

    const newProfile: UserProfile = {
      uid: uid,
      username: cleanUser,
      displayName: finalDisplayName,
      email: email,
      avatarUrl: DEFAULT_CREATOR_AVATARS[0]?.url || "/avatars_128/cyber.png",
      emailVerified: true,
      termsAcknowledged: true,
      acknowledgedAt: new Date().toISOString(),
      theme: "midnight",
      bio: "YouTube Gaming Creator & Walkthrough Strategist",
      channelName: `${finalDisplayName}'s Plays`,
      defaultEpisodeDuration: 90,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save profile to Firestore
    try {
      await setDoc(doc(db, "users", newProfile.uid), newProfile, { merge: true });
    } catch (fsErr) {
      console.warn("Firestore setDoc error:", fsErr);
    }

    // Save locally
    if (password) {
      saveLocalAccount(cleanUser, password, newProfile);
    }
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(newProfile));

    const userObj: StudioUser = {
      uid: newProfile.uid,
      email: newProfile.email,
      displayName: newProfile.displayName,
      photoURL: newProfile.avatarUrl || null,
      emailVerified: true,
    };

    setCurrentUser(userObj);
    setUserProfile(newProfile);
    savePendingVerification(null);
  };

  const cancelPendingVerification = async () => {
    savePendingVerification(null);
    if (auth.currentUser && !userProfile) {
      try {
        await fbSignOut(auth);
      } catch {}
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {}
    localStorage.removeItem(LOCAL_SESSION_KEY);
    setCurrentUser(null);
    setUserProfile(null);
    savePendingVerification(null);
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser && !userProfile) return;
    const uid = currentUser?.uid || userProfile?.uid || "user_creator";
    
    const updated: UserProfile = {
      ...(userProfile || {
        uid: uid,
        username: currentUser?.displayName || "Creator",
        displayName: currentUser?.displayName || "Creator",
        email: currentUser?.email || "",
        avatarUrl: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    setUserProfile(updated);
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(updated));

    // Update in local accounts database
    if (updated.username) {
      const accounts = getLocalAccounts();
      const existing = accounts[updated.username.toLowerCase()];
      if (existing) {
        accounts[updated.username.toLowerCase()] = {
          password: existing.password,
          profile: updated,
        };
        localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
      }
    }

    try {
      await setDoc(doc(db, "users", uid), updated, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${uid}`);
    }

    // Also persist to current Firebase Auth UID document if different
    if (auth.currentUser?.uid && auth.currentUser.uid !== uid) {
      try {
        await setDoc(doc(db, "users", auth.currentUser.uid), updated, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${auth.currentUser.uid}`);
      }
    }
  };

  const refreshProfile = async () => {
    if (currentUser) {
      await fetchProfile(currentUser.uid);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        pendingVerification,
        login,
        register,
        initiateRegistrationWithVerification,
        checkEmailVerifiedStatus,
        verifyEmailWithCode,
        simulateVerifyEmail,
        resendVerificationEmail,
        finalizeAccountCreation,
        cancelPendingVerification,
        logout,
        updateUserProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
