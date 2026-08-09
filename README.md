<div align="center">
  <img src="public/logo.png" alt="Orpheus Logo" width="150" />
  <p align="center">
    <br/>
    <strong>A premium, high-performance cinematic music streaming experience.</strong>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Zustand-764ABC?style=for-the-badge&logo=react&logoColor=white" alt="Zustand" />
    <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  </p>

  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a>
  </p>
</div>

---

## 📖 Overview

**Orpheus** is a state-of-the-art music streaming client designed to bridge the gap between premium modern interfaces and nostalgic, analog aesthetics. It provides a sleek, high-performance, and deeply immersive interface for discovering new tracks, organizing your library, and experiencing music without distractions.

Built with aesthetic excellence at its core, Orpheus leverages fluid Framer Motion micro-animations, complex organic fluid backgrounds, and dynamic color-extraction engines to ensure that every song feels alive. The platform redefines web playback with a bespoke Focus Mode, a robust client-side library, and a provider-agnostic audio architecture seamlessly integrating the YouTube Data API.

## ✨ Features

- **Premium Cinematic UI/UX**: A dark-mode first interface featuring smooth Framer Motion micro-animations, minimal typography (Geist & Cormorant Garamond), and responsive glassmorphism designed to awe users across all devices.
- **Cinematic Focus Mode**: A bespoke, deeply immersive timer interface featuring a high-performance organic liquid color engine that flows, breathes, and seamlessly transitions between custom Focus and Break palettes without heavy WebGL.
- **Retro Analog "Now Playing"**: A visually striking playback screen that extracts dominant colors from the current album art and blends them with a custom CSS film-grain noise texture to create a nostalgic, photographic atmosphere.
- **Dynamic Loading Screen**: A sophisticated, geometric audio-pulse splash screen that establishes the premium music application identity before you even interact with it.
- **Provider-Agnostic Playback Architecture**: A deeply engineered `PlaybackProvider` abstraction that elegantly wraps the official YouTube IFrame API (complying perfectly with TOS) while remaining ready to accept direct audio sources (like SoundCloud or native MP3s) with full Media Session support.
- **Intelligent Search & Curation**: A lightning-fast search tab and a dynamic homepage featuring curated playlist cards, trending grids, and interactive visual feedback.
- **Robust Client-Side Library**: A lightning-fast local store managing your recently played history, favorite tracks, and custom playlists, utilizing `Zustand` for seamless cross-component state synchronization.

## 📸 Gallery

<details>
<summary><b>Click to view UI Screenshots</b></summary>
<br/>

![1. Loading Screen](public/Screenshots/1.%20loading.png)
*1. The elegant, minimal geometric audio pulse that welcomes users to Orpheus.*

![2. Home Hub](public/Screenshots/2.%20home.png)
*2. The vibrant, curated homepage highlighting the latest playlists and mixes.*

![3. Now Playing (Retro Analog)](public/Screenshots/3.%20now-playing.png)
*3. The nostalgic, film-grain atmosphere driven by real-time album artwork color extraction.*

![4. Focus Mode (Liquid Animation)](public/Screenshots/4.%20focus-mode.png)
*4. The immersive, breathing liquid background designed for prolonged, distraction-free productivity.*

![5. Library & Playlists](public/Screenshots/5.%20library.png)
*5. A sleek interface for managing liked tracks, recents, and custom collections.*

</details>

## 🛠 Tech Stack

This project is built using modern web technologies tailored for speed, aesthetic fidelity, and reliability.

- **Framework**: [Next.js 15 (Turbopack)](https://nextjs.org/)
- **Frontend**: [React 18](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with advanced fluid color engines and glassmorphism.
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) with persistent storage.
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio Providers**: YouTube IFrame API / HTML5 Audio

### Project Structure

```bash
├── public/             # Static assets, logos, and images
├── src/
│   ├── app/            # Next.js App Router (Pages, API Routes, Layouts)
│   ├── components/     # Reusable React UI Components (Player, Visualizer, etc.)
│   ├── lib/            # Utilities and PlaybackProvider abstractions
│   ├── store/          # Zustand global state (Player, Library, Theme)
│   └── hooks/          # Custom React hooks (Color Extraction, etc.)
└── README.md           # You are here
```

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shubham126710/Orpheus.git
   cd Orpheus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   NEXT_PUBLIC_YOUTUBE_API_KEY="your_youtube_api_key_here"
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to launch Orpheus.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
  <sub>Built with ❤️ by Shubham Upadhyay</sub>
</div>
