"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signOut as firebaseSignOut } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const GUEST_SESSION_KEY = "orpheus_guest_session_v1";

interface AuthContextType {
  user: any | null;
  loading: boolean;
  userProfile: any | null;
  loginAsGuest: (profile?: { displayName?: string; email?: string; preferences?: string[] }) => void;
  logout: () => Promise<void>;
  updateProfileData: (updates: { displayName?: string; preferences?: string[] }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  userProfile: null,
  loginAsGuest: () => {},
  logout: async () => {},
  updateProfileData: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize guest session or listen to Firebase Auth
  useEffect(() => {
    try {
      const savedGuest = localStorage.getItem(GUEST_SESSION_KEY);
      if (savedGuest) {
        const parsed = JSON.parse(savedGuest);
        if (parsed.user && parsed.profile) {
          setUser(parsed.user);
          setUserProfile(parsed.profile);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("Failed to parse guest session", e);
    }

    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const currentGuest = localStorage.getItem(GUEST_SESSION_KEY);
      if (currentGuest && !currentUser) {
        setLoading(false);
        return;
      }

      setUser(currentUser);
      if (currentUser && db) {
        try {
          localStorage.removeItem(GUEST_SESSION_KEY);
        } catch (e) {}

        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          const newProfile = {
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            createdAt: new Date().toISOString(),
            preferences: [],
          };
          await setDoc(userRef, newProfile);
          setUserProfile(newProfile);
        } else {
          setUserProfile(userSnap.data());
        }
      } else if (!currentGuest) {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginAsGuest = (profileData?: { displayName?: string; email?: string; preferences?: string[] }) => {
    const guestUser = {
      uid: "guest_" + Math.random().toString(36).substring(2, 9),
      email: profileData?.email || "guest@orpheus.audio",
      displayName: profileData?.displayName || "Test Listener",
      isAnonymous: true,
      isGuest: true,
    };

    const profile = {
      displayName: profileData?.displayName || "Test Listener",
      email: profileData?.email || "guest@orpheus.audio",
      preferences: profileData?.preferences || ["Daft Punk", "Electronic", "The Weeknd"],
      createdAt: new Date().toISOString(),
      isGuest: true,
    };

    try {
      localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify({ user: guestUser, profile }));
    } catch (e) {}

    setUser(guestUser);
    setUserProfile(profile);
    setLoading(false);
  };

  const logout = async () => {
    try {
      localStorage.removeItem(GUEST_SESSION_KEY);
      localStorage.removeItem("orpheus_home_feed_cache_v2");
    } catch (e) {}

    if (auth && auth.currentUser) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {}
    }

    setUser(null);
    setUserProfile(null);
  };

  const updateProfileData = async (updates: { displayName?: string; preferences?: string[] }) => {
    if (user?.isGuest) {
      const updated = { ...userProfile, ...updates };
      setUserProfile(updated);
      try {
        localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify({ user, profile: updated }));
      } catch (e) {}
      return;
    }

    if (user && db) {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, updates, { merge: true });
      setUserProfile((prev: any) => ({ ...prev, ...updates }));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, userProfile, loginAsGuest, logout, updateProfileData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

