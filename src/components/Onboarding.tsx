"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Check } from "lucide-react";

interface OnboardingProps {
  onClose: () => void;
}

const GENRES = ["Pop", "Hip-Hop", "R&B", "Electronic", "Rock", "Indie", "Alternative", "Classical", "Jazz", "Metal", "Country", "Dance"];
const ARTISTS = ["The Weeknd", "Taylor Swift", "Kendrick Lamar", "Daft Punk", "Arctic Monkeys", "Frank Ocean", "Lana Del Rey", "Drake", "Tame Impala", "Radiohead", "Beyoncé", "Kanye West"];

export default function Onboarding({ onClose }: OnboardingProps) {
  const [step, setStep] = useState(0); // 0: Login/Signup Choice, 1: Signup form, 2: Welcome, 3: Genres, 4: Artists, 5: Curating
  const [isLogin, setIsLogin] = useState(true);
  
  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  // Preferences State
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return setError("Firebase not configured.");
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onClose();
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const handleSignupStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) return setError("Please fill all fields.");
    setError("");
    setStep(2); // Go to Welcome
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
      
      // using setDoc with merge:true prevents race conditions with AuthContext
      await setDoc(userRef, {
        preferences: prefs,
        email: userCred.user.email,
        displayName: name,
        createdAt: new Date().toISOString(),
      }, { merge: true });

      // Simulate a small loading delay for the cool animation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Done
      onClose();
    } catch (err: any) {
      setError(err.message);
      setStep(4); // Go back if error
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
    // Generate random floating animation values
    const randomY = Math.random() * 20 - 10;
    const randomX = Math.random() * 20 - 10;
    const duration = 3 + Math.random() * 2;

    return (
      <motion.button
        type="button"
        animate={{ y: [0, randomY, 0], x: [0, randomX, 0] }}
        transition={{ repeat: Infinity, duration: duration, ease: "easeInOut" }}
        onClick={onClick}
        className={`relative w-24 h-24 md:w-28 md:h-28 rounded-full flex flex-col items-center justify-center p-2 text-center transition-all duration-300 ${
          isSelected 
            ? `${color} shadow-[0_0_30px_rgba(255,255,255,0.4)] scale-110 z-10 text-white font-black` 
            : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 font-bold scale-100'
        }`}
      >
        <span className="text-[10px] md:text-xs tracking-wider uppercase leading-tight z-10">{item}</span>
        {isSelected && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 rounded-full border-4 border-white/30" />
        )}
      </motion.button>
    );
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl"
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-8 right-8 z-50 text-white/50 hover:text-white transition-colors p-2 bg-white/5 rounded-full">
          <X size={24} />
        </button>

        <div className="w-full max-w-2xl px-6 relative h-full flex flex-col justify-center items-center">
          
          {step === 0 && (
            <motion.div 
              key="step0"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0, position: 'absolute' }}
              className="bg-zinc-900/40 p-8 md:p-12 rounded-[2rem] border border-white/10 w-full max-w-md text-center"
            >
              <h2 className="text-3xl font-geist font-black mb-2 uppercase tracking-widest">
                {isLogin ? "Welcome Back" : "Join Orpheus"}
              </h2>
              <p className="text-white/50 text-sm mb-8 font-geist">
                {isLogin ? "Login to access your library." : "Tell us a bit about yourself."}
              </p>

              <form onSubmit={isLogin ? handleLogin : handleSignupStart} className="flex flex-col gap-4">
                {!isLogin && (
                  <input 
                    type="text" 
                    placeholder="MY NAME IS" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="bg-black/50 border border-white/10 rounded-full px-6 py-4 text-white text-sm font-bold tracking-widest uppercase placeholder-white/30 focus:outline-none focus:border-white/50 transition-colors text-center"
                    required
                  />
                )}
                <input 
                  type="email" 
                  placeholder="EMAIL ADDRESS" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/50 border border-white/10 rounded-full px-6 py-4 text-white text-sm font-bold tracking-widest uppercase placeholder-white/30 focus:outline-none focus:border-white/50 transition-colors text-center"
                  required
                />
                <input 
                  type="password" 
                  placeholder="PASSWORD" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/50 border border-white/10 rounded-full px-6 py-4 text-white text-sm font-bold tracking-widest uppercase placeholder-white/30 focus:outline-none focus:border-white/50 transition-colors text-center"
                  required
                />
                
                {error && <p className="text-red-400 text-xs font-bold mt-2">{error}</p>}

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="mt-6 bg-white text-black font-black uppercase tracking-[0.2em] py-4 rounded-full hover:scale-105 transition-transform flex justify-center items-center"
                >
                  {submitting ? <Loader2 className="animate-spin" /> : (isLogin ? "Sign In" : "Next")}
                </button>
              </form>

              <div className="mt-8">
                <button 
                  onClick={() => { setIsLogin(!isLogin); setError(""); }}
                  className="text-white/50 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  {isLogin ? "Need an account? Sign Up" : "Already have an account? Sign In"}
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0, position: 'absolute' }}
              className="text-center w-full"
            >
              <h2 className="text-5xl md:text-7xl font-instrument font-medium mb-6">
                Hi, {name.split(' ')[0]}
              </h2>
              <p className="text-xl md:text-2xl font-geist font-bold tracking-widest uppercase text-white/80 max-w-lg mx-auto leading-relaxed mb-12">
                Tell us what music you're into and we'll find stuff that's right for you.
              </p>
              <button 
                onClick={() => setStep(3)}
                className="bg-white text-black px-12 py-5 rounded-full font-black tracking-[0.2em] uppercase hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)]"
              >
                Start
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0, position: 'absolute' }}
              className="w-full flex flex-col items-center h-full max-h-screen py-20"
            >
              <div className="text-center mb-12 z-20">
                <h2 className="text-3xl md:text-5xl font-geist font-black tracking-widest uppercase mb-4">
                  Tap On The Genres You Like
                </h2>
                <p className="text-white/50 font-bold uppercase tracking-wider text-sm">
                  Select at least 3 to continue
                </p>
              </div>

              <div className="flex-1 w-full relative flex items-center justify-center max-w-3xl">
                <div className="flex flex-wrap justify-center gap-2 md:gap-4 p-4">
                  {GENRES.map((genre, i) => (
                    <Bubble 
                      key={genre} 
                      item={genre} 
                      isSelected={selectedGenres.includes(genre)} 
                      onClick={() => toggleSelection(genre, selectedGenres, setSelectedGenres)}
                      color="bg-[#E91E63]" // Pink/Magenta like the reference image
                    />
                  ))}
                </div>
              </div>

              <div className="mt-8 z-20">
                <button 
                  onClick={() => setStep(4)}
                  disabled={selectedGenres.length < 3}
                  className={`px-12 py-5 rounded-full font-black tracking-[0.2em] uppercase transition-all duration-300 ${
                    selectedGenres.length >= 3 
                      ? 'bg-white text-black hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)]' 
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0, position: 'absolute' }}
              className="w-full flex flex-col items-center h-full max-h-screen py-20"
            >
              <div className="text-center mb-12 z-20">
                <h2 className="text-3xl md:text-5xl font-geist font-black tracking-widest uppercase mb-4">
                  Tap On 3 Artists You Like
                </h2>
                <p className="text-white/50 font-bold uppercase tracking-wider text-sm">
                  Almost done
                </p>
              </div>

              <div className="flex-1 w-full relative flex items-center justify-center max-w-4xl">
                <div className="flex flex-wrap justify-center gap-2 md:gap-4 p-4">
                  {ARTISTS.map((artist, i) => (
                    <Bubble 
                      key={artist} 
                      item={artist} 
                      isSelected={selectedArtists.includes(artist)} 
                      onClick={() => toggleSelection(artist, selectedArtists, setSelectedArtists)}
                      color="bg-black border border-[#E91E63] text-[#E91E63]" // Dark bubbles with red/pink outline/text
                    />
                  ))}
                </div>
              </div>

              {error && <p className="text-red-400 text-xs font-bold mt-4 absolute bottom-32">{error}</p>}

              <div className="mt-8 z-20">
                <button 
                  onClick={finishOnboarding}
                  disabled={selectedArtists.length < 3 || submitting}
                  className={`px-12 py-5 rounded-full font-black tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-2 ${
                    selectedArtists.length >= 3 
                      ? 'bg-white text-black hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)]' 
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  {submitting ? <Loader2 className="animate-spin" /> : "Finish"}
                </button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div 
              key="step5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center flex flex-col items-center justify-center"
            >
              <div className="relative w-40 h-40 mb-12 flex items-center justify-center">
                {/* Simulated Audio Loading Rings */}
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full border border-white/20"
                />
                <motion.div 
                  animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.5 }}
                  className="absolute inset-0 rounded-full border border-[#E91E63]/40"
                />
                <motion.div 
                  animate={{ scale: [1, 2.5, 1], opacity: [0.1, 0, 0.1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 1 }}
                  className="absolute inset-0 rounded-full border border-white/10"
                />
                
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-black z-10">
                  <Check size={32} strokeWidth={3} />
                </div>
              </div>
              <h2 className="text-2xl font-geist font-black tracking-widest uppercase text-white/80">
                Curating Music Based <br/> On What You Like
              </h2>
            </motion.div>
          )}
          
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
