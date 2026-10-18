"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Check } from "lucide-react";
import AuthSectionOne from "@/components/ui/auth-section-1";

interface OnboardingProps {
  onClose: () => void;
}

const GENRES = ["Pop", "Hip-Hop", "R&B", "Electronic", "Rock", "Indie", "Alternative", "Classical", "Jazz", "Metal", "Country", "Dance"];
const ARTISTS = ["The Weeknd", "Taylor Swift", "Kendrick Lamar", "Daft Punk", "Arctic Monkeys", "Frank Ocean", "Lana Del Rey", "Drake", "Tame Impala", "Radiohead", "Beyoncé", "Kanye West"];

export default function Onboarding({ onClose }: OnboardingProps) {
  // 0: AuthSectionOne, 2: Welcome, 3: Genres, 4: Artists, 5: Curating
  const [step, setStep] = useState(0);
  
  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  // Preferences State
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Handle flow from AuthSectionOne
  const handleAuthProceed = async (data: { firstName: string; lastName: string; email: string; password: string }) => {
    setEmail(data.email);
    setPassword(data.password);
    const fullName = `${data.firstName}${data.lastName ? " " + data.lastName : ""}`.trim();
    setName(fullName || data.firstName);

    // If logging in directly (e.g. user submitted email & password without first name):
    if (!data.firstName) {
      if (!auth) return setError("Firebase not configured.");
      setSubmitting(true);
      try {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        onClose();
      } catch (err: any) {
        setError(err.message);
        setSubmitting(false);
      }
      return;
    }

    // Go to welcome step for sign up
    setStep(2);
  };

  const finishOnboarding = async () => {
    if (!auth || !db) return setError("Firebase not configured.");
    setStep(5); // Show curating loading screen
    
    try {
      // 1. Create User
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: name });
      
      // 2. Set the Firestore document with the selected preferences
      const prefs = [...selectedGenres, ...selectedArtists];
      const userRef = doc(db, "users", userCred.user.uid);
      
      await setDoc(userRef, {
        preferences: prefs,
        email: userCred.user.email,
        displayName: name,
        createdAt: new Date().toISOString(),
      }, { merge: true });

      // Simulated pause for aesthetic loading animation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Done
      onClose();
    } catch (err: any) {
      setError(err.message);
      setStep(4);
    }
  };

  const toggleSelection = (item: string, list: string[], setList: (l: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const Bubble = ({ item, isSelected, onClick, color }: { item: string, isSelected: boolean, onClick: () => void, color: string }) => {
    const randomY = Math.random() * 16 - 8;
    const randomX = Math.random() * 16 - 8;
    const duration = 3.5 + Math.random() * 2;

    return (
      <motion.button
        type="button"
        animate={{ y: [0, randomY, 0], x: [0, randomX, 0] }}
        transition={{ repeat: Infinity, duration: duration, ease: "easeInOut" }}
        onClick={onClick}
        className={`relative w-24 h-24 md:w-28 md:h-28 rounded-full flex flex-col items-center justify-center p-2 text-center transition-all duration-300 ${
          isSelected 
            ? `${color} shadow-[0_0_25px_rgba(250,255,0,0.4)] scale-110 z-10 text-black font-black` 
            : 'bg-white/[0.04] border border-white/10 hover:bg-white/10 text-white/70 font-bold scale-100'
        }`}
      >
        <span className="text-[10px] md:text-xs tracking-wider uppercase leading-tight z-10">{item}</span>
        {isSelected && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 rounded-full border-2 border-black/30" />
        )}
      </motion.button>
    );
  };

  // If in step 0, render the new AuthSectionOne full screen
  if (step === 0) {
    return (
      <AuthSectionOne
        onProceedToPreferences={handleAuthProceed}
        onClose={onClose}
      />
    );
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl"
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-8 right-8 z-50 text-white/50 hover:text-white transition-colors p-3 bg-white/5 border border-white/10 rounded-full">
          <X size={20} />
        </button>

        <div className="w-full max-w-2xl px-6 relative h-full flex flex-col justify-center items-center">

          {/* STEP 2: WELCOME */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0, position: 'absolute' }}
              className="text-center w-full"
            >
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#FAFF00] block mb-4">
                Taste Vector Calibration
              </span>
              <h2 className="text-5xl md:text-7xl font-instrument font-normal mb-6 text-white">
                Hi, {name.split(' ')[0]}
              </h2>
              <p className="text-lg md:text-xl font-geist font-normal text-white/60 max-w-lg mx-auto leading-relaxed mb-12">
                Tell us what musical frequencies you resonate with, and Orpheus will assemble your daily curation.
              </p>
              <button 
                onClick={() => setStep(3)}
                className="bg-[#FAFF00] text-black px-12 py-5 rounded-full font-black text-xs md:text-sm tracking-[0.2em] uppercase hover:bg-white hover:scale-105 transition-all shadow-[0_0_35px_rgba(250,255,0,0.3)]"
              >
                Begin Calibration
              </button>
            </motion.div>
          )}

          {/* STEP 3: GENRES */}
          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.05, opacity: 0, position: 'absolute' }}
              className="w-full flex flex-col items-center h-full max-h-screen py-16"
            >
              <div className="text-center mb-10 z-20">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#FAFF00] block mb-2">
                  Step 01 / 02
                </span>
                <h2 className="text-3xl md:text-5xl font-instrument font-normal tracking-tight text-white mb-3">
                  Tap the genres you love
                </h2>
                <p className="text-white/50 font-bold uppercase tracking-wider text-xs">
                  Select at least 3 genres to continue ({selectedGenres.length}/3)
                </p>
              </div>

              <div className="flex-1 w-full relative flex items-center justify-center max-w-3xl">
                <div className="flex flex-wrap justify-center gap-3 md:gap-4 p-4">
                  {GENRES.map((genre) => (
                    <Bubble 
                      key={genre} 
                      item={genre} 
                      isSelected={selectedGenres.includes(genre)} 
                      onClick={() => toggleSelection(genre, selectedGenres, setSelectedGenres)}
                      color="bg-[#FAFF00]" 
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 z-20">
                <button 
                  onClick={() => setStep(4)}
                  disabled={selectedGenres.length < 3}
                  className={`px-12 py-4 rounded-full font-black text-xs md:text-sm tracking-[0.2em] uppercase transition-all duration-300 ${
                    selectedGenres.length >= 3 
                      ? 'bg-[#FAFF00] text-black hover:bg-white hover:scale-105 shadow-[0_0_30px_rgba(250,255,0,0.3)]' 
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: ARTISTS */}
          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.05, opacity: 0, position: 'absolute' }}
              className="w-full flex flex-col items-center h-full max-h-screen py-16"
            >
              <div className="text-center mb-10 z-20">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#FAFF00] block mb-2">
                  Step 02 / 02
                </span>
                <h2 className="text-3xl md:text-5xl font-instrument font-normal tracking-tight text-white mb-3">
                  Tap 3 artists you respect
                </h2>
                <p className="text-white/50 font-bold uppercase tracking-wider text-xs">
                  We'll anchor your radio stations around them ({selectedArtists.length}/3)
                </p>
              </div>

              <div className="flex-1 w-full relative flex items-center justify-center max-w-4xl">
                <div className="flex flex-wrap justify-center gap-3 md:gap-4 p-4">
                  {ARTISTS.map((artist) => (
                    <Bubble 
                      key={artist} 
                      item={artist} 
                      isSelected={selectedArtists.includes(artist)} 
                      onClick={() => toggleSelection(artist, selectedArtists, setSelectedArtists)}
                      color="bg-[#FAFF00]"
                    />
                  ))}
                </div>
              </div>

              {error && <p className="text-red-400 text-xs font-bold mt-4 absolute bottom-28">{error}</p>}

              <div className="mt-6 z-20">
                <button 
                  onClick={finishOnboarding}
                  disabled={selectedArtists.length < 3 || submitting}
                  className={`px-12 py-4 rounded-full font-black text-xs md:text-sm tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-2 ${
                    selectedArtists.length >= 3 
                      ? 'bg-[#FAFF00] text-black hover:bg-white hover:scale-105 shadow-[0_0_30px_rgba(250,255,0,0.3)]' 
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : "Finish & Enter"}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: CURATING LOADING SCREEN */}
          {step === 5 && (
            <motion.div 
              key="step5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center flex flex-col items-center justify-center"
            >
              <div className="relative w-36 h-36 mb-10 flex items-center justify-center">
                <motion.div 
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full border border-white/20"
                />
                <motion.div 
                  animate={{ scale: [1, 1.9, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.4 }}
                  className="absolute inset-0 rounded-full border border-[#FAFF00]/40"
                />
                
                <div className="w-16 h-16 rounded-full bg-[#FAFF00] flex items-center justify-center text-black z-10 shadow-[0_0_30px_rgba(250,255,0,0.5)]">
                  <Check size={28} strokeWidth={3} />
                </div>
              </div>
              <h2 className="text-2xl font-geist font-black tracking-widest uppercase text-white">
                Synthesizing Your Frequencies
              </h2>
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mt-2">
                Provisioning personalized Daily Mixes
              </p>
            </motion.div>
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  );
}
