import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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
import { auth, db } from "../firebase";

export interface UserProfile {
  uid: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string;
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
}

interface AuthContextType {
  currentUser: StudioUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, displayName?: string) => Promise<void>;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<StudioUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper to load accounts list from local backup
  const getLocalAccounts = (): Record<string, { password: string; profile: UserProfile }> => {
    try {
      const raw = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
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
        setUserProfile(data);
        return data;
      }
    } catch (err) {
      console.warn("Firestore fetch error, checking local store", err);
    }

    // Check local fallback
    try {
      const savedSession = localStorage.getItem(LOCAL_SESSION_KEY);
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed?.uid === uid) {
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
            return;
          }
        }
      } catch (err) {
        console.warn("Error reading local session:", err);
      }

      // 2. Check Firebase auth listener
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          const userObj: StudioUser = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
          };
          setCurrentUser(userObj);
          let prof = await fetchProfile(fbUser.uid);
          if (!prof) {
            const initialProf: UserProfile = {
              uid: fbUser.uid,
              username: fbUser.displayName || fbUser.email?.split("@")[0] || "Creator",
              displayName: fbUser.displayName || "Studio Creator",
              email: fbUser.email || "",
              avatarUrl: fbUser.photoURL || "",
              theme: "midnight",
              defaultEpisodeDuration: 90,
              channelName: "Gaming Playthroughs",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            try {
              await setDoc(doc(db, "users", fbUser.uid), initialProf, { merge: true });
            } catch (e) {}
            setUserProfile(initialProf);
            localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(initialProf));
          }
        } else if (!activeUser) {
          setCurrentUser(null);
          setUserProfile(null);
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
      avatarUrl: "",
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
    };

    setCurrentUser(userObj);
    setUserProfile(newProfile);
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {}
    localStorage.removeItem(LOCAL_SESSION_KEY);
    setCurrentUser(null);
    setUserProfile(null);
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
      console.error("Failed to update user profile in Firestore:", err);
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
        login,
        register,
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
