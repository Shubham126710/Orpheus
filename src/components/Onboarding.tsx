"use client";

import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import AuthSectionOne from "@/components/ui/auth-section-1";
import { StepWelcome } from "./onboarding/StepWelcome";
import { StepGenres } from "./onboarding/StepGenres";
import { StepArtists } from "./onboarding/StepArtists";
import { StepPersonalize } from "./onboarding/StepPersonalize";
import { ONBOARDING_GENRES } from "./onboarding/genresData";

interface OnboardingProps {
  onClose: () => void;
  initialStep?: "auth" | "welcome" | "genres";
}

type OnboardingStep = "auth" | "welcome" | "genres" | "artists" | "personalize";

export default function Onboarding({ onClose, initialStep = "auth" }: OnboardingProps) {
  const { loginAsGuest, updateProfileData } = useAuth();

  const [step, setStep] = useState<OnboardingStep>(initialStep);
  const [isGuestMode, setIsGuestMode] = useState(false);

  // User credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Taste vectors
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);

  // Handle flow from AuthSectionOne
  const handleAuthProceed = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isGuest?: boolean;
  }) => {
    setEmail(data.email);
    setPassword(data.password);
    const fullName = `${data.firstName}${data.lastName ? " " + data.lastName : ""}`.trim();
    setName(fullName || data.firstName || "Listener");

    if (data.isGuest) {
      setIsGuestMode(true);
    }

    // Direct Login without first name:
    if (!data.firstName && !data.isGuest) {
      if (!auth) {
        // Fallback to guest mode
        loginAsGuest({
          displayName: "Listener",
          email: data.email,
        });
        onClose();
        return;
      }
      setSubmitting(true);
      try {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        onClose();
      } catch (err: any) {
        console.warn("Direct login error, falling back to guest session:", err);
        loginAsGuest({
          displayName: "Listener",
          email: data.email,
        });
        onClose();
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // Advance to Welcome Introduction step
    setStep("welcome");
  };

  // Toggle Genre selection
  const handleToggleGenre = (genreId: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
    );
  };

  // Reset genres
  const handleResetGenres = () => {
    setSelectedGenres([]);
  };

  // Toggle Artist selection
  const handleToggleArtist = (artistName: string) => {
    setSelectedArtists((prev) =>
      prev.includes(artistName) ? prev.filter((name) => name !== artistName) : [...prev, artistName]
    );
  };

  // Finish onboarding & persist selections
  const handleFinish = async () => {
    // Map genre IDs to formatted titles (e.g. 'electronic' -> 'Electronic')
    const genreTitles = selectedGenres.map((id) => {
      const g = ONBOARDING_GENRES.find((item) => item.id === id);
      if (!g) return id.charAt(0).toUpperCase() + id.slice(1);
      // Capitalize proper title case
      return g.name.charAt(0) + g.name.slice(1).toLowerCase();
    });

    const allPrefs = [...genreTitles, ...selectedArtists];

    // 1. Guest / Test Mode handling
    if (isGuestMode || !auth || !db) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      loginAsGuest({
        displayName: name || "Test Listener",
        email: email || "guest@orpheus.audio",
        preferences: allPrefs.length > 0 ? allPrefs : ["Rock", "Electronic", "Daft Punk"],
      });
      onClose();
      return;
    }

    // 2. Real Firebase user creation & profile persistence
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: name });

      const userRef = doc(db, "users", userCred.user.uid);
      await setDoc(
        userRef,
        {
          preferences: allPrefs,
          email: userCred.user.email,
          displayName: name,
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );

      await updateProfileData({
        displayName: name,
        preferences: allPrefs,
      });

      await new Promise((resolve) => setTimeout(resolve, 1500));
      onClose();
    } catch (err: any) {
      console.warn("Firebase registration fallback during onboarding:", err);
      // Fallback to guest mode so tester is never blocked
      await new Promise((resolve) => setTimeout(resolve, 1200));
      loginAsGuest({
        displayName: name || "Test Listener",
        email: email || "guest@orpheus.audio",
        preferences: allPrefs.length > 0 ? allPrefs : ["Rock", "Electronic", "Daft Punk"],
      });
      onClose();
    }
  };

  // If on auth step, render AuthSectionOne
  if (step === "auth") {
    return (
      <AuthSectionOne
        onProceedToPreferences={handleAuthProceed}
        onClose={onClose}
      />
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="onboarding-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] text-white overflow-hidden"
      >
        {/* Pure smooth #050505 dark backdrop, grain removed per design requirements */}

        {/* Top-Right Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Onboarding"
          className="fixed top-5 right-5 sm:top-7 sm:right-7 z-50 p-2.5 sm:p-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/60 hover:text-white transition-all shadow-xl cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* STEP CONTENT CONTAINER */}
        <div className="relative w-full h-full max-h-screen flex flex-col justify-between">
          {step === "welcome" && (
            <StepWelcome
              userName={name}
              onStart={() => setStep("genres")}
            />
          )}

          {step === "genres" && (
            <StepGenres
              selectedGenres={selectedGenres}
              onToggleGenre={handleToggleGenre}
              onReset={handleResetGenres}
              onNext={() => setStep("artists")}
            />
          )}

          {step === "artists" && (
            <StepArtists
              selectedGenres={selectedGenres}
              selectedArtists={selectedArtists}
              onToggleArtist={handleToggleArtist}
              onBack={() => setStep("genres")}
              onNext={() => setStep("personalize")}
            />
          )}

          {step === "personalize" && (
            <StepPersonalize
              selectedGenres={selectedGenres}
              selectedArtists={selectedArtists}
              onBack={() => setStep("artists")}
              onFinish={handleFinish}
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
