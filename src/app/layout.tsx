import type { Metadata } from "next";
import { Geist, Inter, Cormorant_Garamond, Instrument_Serif } from "next/font/google";
import "./globals.css";
import BackgroundRenderer from "@/components/BackgroundRenderer";
import AudioEngine from "@/components/AudioEngine";
import FullScreenPlayer from "@/components/Player/FullScreenPlayer";
import ClientBottomNavWrapper from "@/components/ClientBottomNavWrapper";
import MiniPlayer from "@/components/Player/MiniPlayer";
import ContextMenu from "@/components/ContextMenu";
import Footer from "@/components/Footer";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orpheus | Music Streaming Client",
  description: "A premium, nostalgic, and cinematic music streaming experience.",
  manifest: "/manifest.json",
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Orpheus"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${inter.variable} ${cormorant.variable} ${instrument.variable} antialiased dark`}
    >
      <body suppressHydrationWarning className="bg-black text-white min-h-screen overflow-x-hidden selection:bg-accent/30 flex flex-col relative">
        <AudioEngine />
        <BackgroundRenderer />
        <ContextMenu />
        
        {/* Main Content Area */}
        <main className="flex-1 w-full">
          {children}
          <Footer />
        </main>
        
        {/* Navigation & Overlays */}
        <FullScreenPlayer />
        <div className="fixed bottom-0 left-0 w-full z-40 px-4 md:px-8 pb-4 md:pb-8">
          <ClientBottomNavWrapper />
        </div>
        <MiniPlayer />
      </body>
    </html>
  );
}
