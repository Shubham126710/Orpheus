import React from 'react';
import { Code2, Camera, Briefcase, Mail, Smartphone, Music } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#FFE600] text-black mt-20 rounded-t-[3rem] md:rounded-t-[4rem] px-6 md:px-12 pt-16 pb-32 shadow-[0_-20px_50px_rgba(255,230,0,0.2)]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        
        {/* Brand & Project Info */}
        <div className="flex flex-col max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-[#FFE600] rotate-3 hover:rotate-12 transition-transform">
              <Music size={24} strokeWidth={2.5} />
            </div>
            <h2 className="font-geist font-black text-3xl tracking-tighter uppercase">Orpheus</h2>
          </div>
          <p className="font-geist text-sm md:text-base font-bold text-black/70 mb-4 leading-relaxed uppercase tracking-widest">
            A Next-Generation Music Streaming Experience built with extreme aesthetics, dynamic theming, and an uncompromising focus on UI/UX.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-black/10 rounded-full font-geist text-xs font-bold uppercase tracking-widest">Next.js 16</span>
            <span className="px-3 py-1 bg-black/10 rounded-full font-geist text-xs font-bold uppercase tracking-widest">Tailwind CSS</span>
            <span className="px-3 py-1 bg-black/10 rounded-full font-geist text-xs font-bold uppercase tracking-widest">Zustand</span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col md:items-end w-full md:w-auto">
          <h3 className="font-geist font-black text-xl tracking-widest uppercase mb-6">Connect with the Creator</h3>
          
          <div className="flex flex-col gap-4 w-full md:items-end">
            <div className="flex items-center gap-3 hover:text-black/60 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-black text-[#FFE600] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="font-geist font-black">SU</span>
              </div>
              <span className="font-geist font-bold text-lg uppercase tracking-widest">Shubham Upadhyay</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4 mt-2">
              <Link href="https://github.com/Shubham126710" target="_blank" className="flex items-center gap-3 font-geist font-bold text-sm tracking-widest uppercase hover:opacity-70 transition-opacity">
                <Code2 size={18} />
                <span>Shubham126710</span>
              </Link>
              
              <Link href="https://www.linkedin.com/in/upadhyay-shubham/" target="_blank" className="flex items-center gap-3 font-geist font-bold text-sm tracking-widest uppercase hover:opacity-70 transition-opacity">
                <Briefcase size={18} />
                <span>LinkedIn</span>
              </Link>
              
              <Link href="https://instagram.com/iamshubham_15" target="_blank" className="flex items-center gap-3 font-geist font-bold text-sm tracking-widest uppercase hover:opacity-70 transition-opacity">
                <Camera size={18} />
                <span>@iamshubham_15</span>
              </Link>

              <div className="flex items-center gap-3 font-geist font-bold text-sm tracking-widest uppercase opacity-80">
                <Mail size={18} />
                <span>shubham360upadhyay@gmail.com</span>
              </div>

              <div className="flex items-center gap-3 font-geist font-bold text-sm tracking-widest uppercase opacity-80">
                <Smartphone size={18} />
                <span>8897773251</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      
      <div className="max-w-7xl mx-auto w-full h-px bg-black/10 my-8"></div>
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-geist font-bold uppercase tracking-[0.2em] opacity-60 text-center md:text-left">
        <p>© 2026 Orpheus Music Streaming.</p>
        <p>Built with passion for flawless UI/UX.</p>
      </div>
    </footer>
  );
}
