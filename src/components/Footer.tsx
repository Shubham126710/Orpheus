import React from 'react';
import { Mail, Smartphone, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-950 text-white border-t border-white/10 px-6 md:px-16 pt-16 pb-36 relative z-30 font-geist">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        
        {/* Brand & Project Info */}
        <div className="flex flex-col max-w-md">
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#FAFF00] flex items-center justify-center p-1.5 shadow-[0_0_20px_rgba(250,255,0,0.4)]">
              <Image 
                src="/logo-trimmed.png" 
                alt="Orpheus Logo" 
                width={22} 
                height={22} 
                className="object-contain" 
              />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl tracking-[0.25em] font-black uppercase text-white leading-none">Orpheus</h2>
              <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/40 mt-1">Next-Gen Audio Client</span>
            </div>
          </div>

          <p className="text-sm text-white/60 mb-6 leading-relaxed">
            A premium, high-performance music streaming experience designed for pure sonic focus. Bridging modern liquid interfaces with nostalgic analog warmth.
          </p>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] font-bold uppercase tracking-wider text-white/70">Next.js 16</span>
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] font-bold uppercase tracking-wider text-white/70">Tailwind CSS</span>
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] font-bold uppercase tracking-wider text-white/70">Web Audio API</span>
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] font-bold uppercase tracking-wider text-[#FAFF00]">Lossless DSP</span>
          </div>
        </div>

        {/* Contact Info & Socials */}
        <div className="flex flex-col md:items-end w-full md:w-auto">
          <h3 className="text-xs font-bold tracking-[0.25em] uppercase text-[#FAFF00] mb-6">Connect with the Creator</h3>
          
          <div className="flex flex-col gap-4 w-full md:items-end">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FAFF00] text-black font-black flex items-center justify-center text-xs">
                SU
              </div>
              <span className="font-bold text-base text-white">Shubham Upadhyay</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3.5 mt-2">
              <Link 
                href="https://github.com/Shubham126710" 
                target="_blank" 
                className="flex items-center gap-2.5 text-xs font-medium text-white/60 hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                <span>github.com/Shubham126710</span>
                <ArrowUpRight size={13} className="text-white/40" />
              </Link>
              
              <Link 
                href="https://www.linkedin.com/in/upadhyay-shubham/" 
                target="_blank" 
                className="flex items-center gap-2.5 text-xs font-medium text-white/60 hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                <span>linkedin.com/in/upadhyay-shubham</span>
                <ArrowUpRight size={13} className="text-white/40" />
              </Link>
              
              <Link 
                href="https://instagram.com/iamshubham_15" 
                target="_blank" 
                className="flex items-center gap-2.5 text-xs font-medium text-white/60 hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                <span>@iamshubham_15</span>
                <ArrowUpRight size={13} className="text-white/40" />
              </Link>

              <div className="flex items-center gap-2.5 text-xs text-white/60">
                <Mail size={15} className="text-[#FAFF00]" />
                <span>shubham360upadhyay@gmail.com</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-white/60">
                <Smartphone size={15} className="text-[#FAFF00]" />
                <span>+91 8897773251</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      
      <div className="max-w-7xl mx-auto w-full h-px bg-white/10 my-10" />
      
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-white/40">
        <p>© 2026 Orpheus Music Streaming. All rights reserved.</p>
        <p>Crafted with pure aesthetic obsession for lossless sound.</p>
      </div>
    </footer>
  );
}
