"use client";

import { motion } from "framer-motion";
import { Play, Disc3, Sparkles, Headphones } from "lucide-react";

interface LandingPageProps {
  onJoinClick: () => void;
}

export default function LandingPage({ onJoinClick }: LandingPageProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring" as const, stiffness: 100, damping: 20 }
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-black text-white relative overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-900/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      
      {/* Header */}
      <header className="w-full flex justify-between items-center px-8 md:px-16 py-8 relative z-10">
        <h1 className="text-xl md:text-2xl tracking-[0.3em] font-geist font-black uppercase text-white">
          Orpheus
        </h1>
        <button 
          onClick={onJoinClick}
          className="text-sm font-bold tracking-widest uppercase border border-white/20 px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-500"
        >
          Sign In
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center relative z-10 w-full max-w-7xl mx-auto">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center max-w-4xl"
        >
          <motion.div variants={itemVariants} className="mb-6 flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
            <Sparkles size={16} className="text-yellow-400" />
            <span className="text-xs font-bold tracking-widest uppercase text-white/80">The Next Era of Audio</span>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants}
            className="text-5xl md:text-8xl font-instrument font-medium tracking-tight leading-[1.1] mb-8"
          >
            Experience music, <br/>
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">
              cinematically.
            </span>
          </motion.h2>

          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-white/50 font-geist max-w-2xl mb-12 leading-relaxed"
          >
            A premium, high-performance streaming client bridging the gap between modern liquid interfaces and nostalgic analog aesthetics.
          </motion.p>

          <motion.button 
            variants={itemVariants}
            onClick={onJoinClick}
            className="group relative flex items-center justify-center gap-4 bg-white text-black px-10 py-5 rounded-full overflow-hidden hover:scale-105 transition-transform duration-500 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 text-sm font-black tracking-[0.2em] uppercase">Start Listening</span>
            <div className="relative z-10 w-8 h-8 rounded-full bg-black flex items-center justify-center">
              <Play size={14} fill="currentColor" className="text-white ml-0.5" />
            </div>
          </motion.button>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-32 pb-20"
        >
          {[
            { icon: <Disc3 size={24} />, title: "Curated for You", desc: "Our algorithm adapts to your unique sonic palette in real-time." },
            { icon: <Headphones size={24} />, title: "Focus Mode", desc: "Immersive, distraction-free environment for deep work." },
            { icon: <Sparkles size={24} />, title: "Analog Aesthetic", desc: "Real-time color extraction and film-grain textures." }
          ].map((feat, i) => (
            <div key={i} className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-500">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-6 text-white">
                {feat.icon}
              </div>
              <h3 className="text-lg font-bold font-geist tracking-wide mb-3">{feat.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
