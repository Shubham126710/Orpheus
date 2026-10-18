"use client";

import { GrainGradient } from "@paper-design/shaders-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { Disc3, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface AuthSectionOneProps {
  onSuccess?: (user: any) => void;
  onProceedToPreferences?: (data: { firstName: string; lastName: string; email: string; password: string }) => void;
  onClose?: () => void;
  initialMode?: "signup" | "login";
}

export default function AuthSectionOne({
  onProceedToPreferences,
  onClose,
  initialMode = "signup"
}: AuthSectionOneProps) {
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!isLogin && !firstName) {
      setError("Please provide your first name.");
      return;
    }

    if (onProceedToPreferences) {
      onProceedToPreferences({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password
      });
    }
  };

  return (
    <section className="min-h-screen bg-black p-3 sm:p-6 text-white antialiased font-geist flex items-center justify-center relative z-[100] w-full">
      
      {/* Close button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="fixed top-6 right-6 z-50 p-3 rounded-full bg-zinc-900/80 border border-white/10 text-white/60 hover:text-white hover:border-[#FAFF00]/50 transition-all shadow-xl"
        >
          <X size={20} />
        </button>
      )}

      <div className="grid w-full max-w-6xl min-h-[calc(100vh-3rem)] gap-6 lg:grid-cols-[1fr_1.05fr] my-auto">
        
        {/* Left Column: Form */}
        <div className="flex items-center rounded-3xl border border-white/10 bg-zinc-950 px-6 py-10 sm:px-10 lg:px-14 lg:py-16 shadow-2xl relative">
          <div className="mx-auto w-full max-w-[480px]">
            
            {/* Header / Brand */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-[#FAFF00] flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(250,255,0,0.4)]">
                <Image src="/logo-trimmed.png" alt="Orpheus Logo" width={24} height={24} className="object-contain" />
              </div>
              <span className="text-xl font-black uppercase tracking-[0.25em] text-white">
                Orpheus
              </span>
            </div>

            <div>
              <h1 className="text-3xl font-medium tracking-tight sm:text-4xl lg:text-[42px] font-instrument leading-tight">
                {isLogin ? "Welcome back." : "Create your account."}
              </h1>
              <p className="mt-2 text-sm md:text-base text-white/50 leading-relaxed font-geist">
                {isLogin 
                  ? "Sign in to resume your library and curated frequencies." 
                  : "Experience music cinematically with bespoke daily mixes."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {!isLogin && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <FieldBox
                    label="FIRST NAME"
                    value={firstName}
                    placeholder="Miles"
                    onChange={(val) => setFirstName(val)}
                  />
                  <FieldBox
                    label="LAST NAME"
                    value={lastName}
                    placeholder="Davis"
                    onChange={(val) => setLastName(val)}
                  />
                </div>
              )}

              <FieldBox
                label="EMAIL ADDRESS"
                value={email}
                type="email"
                placeholder="miles@orpheus.audio"
                onChange={(val) => setEmail(val)}
              />

              <FieldBox
                label="PASSWORD"
                value={password}
                type="password"
                placeholder="••••••••••••"
                onChange={(val) => setPassword(val)}
              />

              {error && (
                <p className="text-xs font-bold text-red-400 uppercase tracking-wider">{error}</p>
              )}

              {!isLogin && (
                <div className="space-y-3 pt-2 text-xs leading-relaxed text-white/40">
                  <CheckboxLine>
                    I agree to the <span className="text-white/80 underline underline-offset-2">Terms of Service</span> and <span className="text-white/80 underline underline-offset-2">Privacy Policy</span>.
                  </CheckboxLine>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 flex h-14 w-full items-center justify-center rounded-full bg-[#FAFF00] text-black font-black text-xs md:text-sm tracking-[0.2em] uppercase transition-all hover:bg-white hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_25px_rgba(250,255,0,0.3)]"
              >
                {submitting ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? "Sign In" : "Continue to Curation")}
              </button>
            </form>

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
              >
                {isLogin 
                  ? "Don't have an account? Create one" 
                  : "Already have an account? Sign In"}
              </button>
            </div>

          </div>
        </div>

        {/* Right Column: Visual Shader Showcase */}
        <div className="relative flex min-h-[500px] overflow-hidden rounded-3xl bg-zinc-950 border border-white/10 p-8 text-white sm:p-12 lg:min-h-0 flex-col justify-between shadow-2xl">
          
          {/* Paper Design Grain Shader */}
          <GrainGradient
            speed={0.8}
            scale={1.2}
            rotation={45}
            offsetX={0}
            offsetY={0}
            softness={0.6}
            intensity={0.6}
            noise={0.3}
            shape="corners"
            frame={2854.5}
            colors={["#FAFF00", "#FFE600", "#FC7819", "#000000"]}
            colorBack="#00000000"
            className="absolute inset-0 bg-black opacity-40 mix-blend-screen"
          />

          <div className="relative z-10 flex h-full w-full flex-col justify-between">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md w-fit">
              <Disc3 size={15} className="text-[#FAFF00] animate-spin-slow" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                33⅓ RPM Hi-Fi Pipeline
              </span>
            </div>

            {/* Middle Quote */}
            <div className="my-auto py-12">
              <h2 className="text-4xl sm:text-6xl lg:text-[56px] font-instrument font-normal tracking-tight text-white leading-[1.05]">
                Listen with <br />
                <span className="italic text-[#FAFF00]">intention.</span>
              </h2>
              <p className="mt-4 text-sm sm:text-base text-white/70 max-w-md leading-relaxed">
                Hardware-accelerated Web Audio architecture, real-time analog visualizers, and seamless zero-latency caching.
              </p>
            </div>

            {/* Bottom Status Box */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#FAFF00] uppercase tracking-widest block">Sound Architecture</span>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Lossless Stereo Streaming</span>
              </div>
              <div className="text-[10px] font-black text-black bg-[#FAFF00] px-3 py-1 rounded-full uppercase tracking-widest">
                Zero Ads
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

function FieldBox({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  onChange: (val: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5 rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-sm focus-within:border-[#FAFF00]/50 transition-colors">
      <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-white font-medium outline-none placeholder:text-white/20 text-sm"
        required
      />
    </label>
  );
}

function CheckboxLine({ children }: { children: ReactNode }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <input
        type="checkbox"
        defaultChecked
        required
        className="size-4 appearance-none rounded-md border border-white/20 bg-white/5 checked:border-[#FAFF00] checked:bg-[#FAFF00] transition-colors cursor-pointer"
      />
      <span>{children}</span>
    </label>
  );
}
