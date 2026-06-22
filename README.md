<div align="center">

# 🎧 HeyMelody: The Future of Music Streaming

**HeyMelody** is a cutting-edge, high-fidelity music streaming platform engineered for performance, aesthetics, and a flawless user experience. Built with the **Next.js 16 Apex Stack**, it delivers lightning-fast transitions, real-time synchronization, and a premium audio engine.

</div>

---

## 📸 Interface

Experience our beautifully designed, glassmorphic UI tailored for the ultimate listening experience.

<p align="center">
  <img src="./public/Banner1.jpg" width="100%" alt="HeyMelody Main Banner">
</p>
<p align="center">
  <img src="./public/Banner 2.jpg" width="50%" alt="HeyMelody Interface 2">
  <img src="./public/Banner3.jpg" width="50%" alt="HeyMelody Interface 3">
</p>
<p align="center">
  <img src="./public/Banner4.jpg" width="50%" alt="HeyMelody Interface 4">
  <img src="./public/Banner5.jpg" width="50%" alt="HeyMelody Interface 5">
</p>
<p align="center">
  <img src="./public/Banner6.jpg" width="50%" alt="HeyMelody Interface 6">
  <img src="./public/Banner7.jpg" width="50%" alt="HeyMelody Interface 7">
</p>

---

## 📖 User's Guide & Full Workflow

Welcome to HeyMelody! Here is the complete journey of a user interacting with the platform:

### 1. Onboarding & Authentication
*   **Arrival**: Users are greeted by a sleek, dynamic landing page built with Framer Motion animations.
*   **Secure Login**: The user clicks "Login" and is authenticated via **Google OAuth** powered by Supabase. No complex passwords needed—just a seamless one-tap entry.
*   **Edge Protection**: If an unauthenticated user tries to access private routes, Next.js Middleware instantly redirects them at the Edge, ensuring zero-latency security.

### 2. Music Discovery & Navigation
*   **Home Dashboard**: Once authenticated, the user lands on their personalized dashboard showcasing trending tracks, new releases, and curated playlists.
*   **Lightning Fast Browsing**: Thanks to Next.js 16 Server Components and Turbopack, navigating between "Home", "Library", and "Search" is instantaneous, feeling like a native application.
*   **Responsive Marquee**: If a song title is too long for its card, an Intersection Observer triggers a smooth marquee scrolling effect, ensuring all details are readable without clutter.

### 3. The Playback Experience
*   **One-Click Play**: Clicking on any track instantly triggers the custom **Audio Engine**.
*   **Persistent Player**: As the user navigates across different pages, the music **never stops**. The audio player persists across route changes.
*   **Global Sync**: If a user hits "Play" on a song card, the global `PlayerContext` ensures the main bottom player and any sidebars instantly reflect the "Playing" state.

### 4. Interactive Controls & Library Management
*   **Queue Management**: Users can dynamically view their current queue.
*   **Smart Shuffle & Repeat**: Toggle the custom shuffle algorithm that guarantees a fresh sequence without immediate repeats, and utilize looping functionalities.
*   **Real-Time Liking**: Users can click the "Heart" icon on a track. Using TanStack Query, this interaction instantly mutates the database and updates the UI. If the user has multiple tabs open, the heart fills up across all tabs simultaneously.
*   **Persistent Volume**: If a user lowers their volume or mutes the player, the platform remembers these preferences on their next visit.

---

## ✨ Detailed Functionalities & Engineering 

### 🎼 Elite Audio Engine (Under the Hood)
*   **Single-Instance Audio Strategy**: Unlike traditional React players that unmount/remount DOM nodes (causing audio drops), HeyMelody uses a single, globally prioritized `<audio>` element. It seamlessly swaps sources and handles HTML5 Audio Promise rejections gracefully.
*   **Race-Condition Protection**: When a user aggressively skips tracks backward and forward, the system manages the asynchronous play/pause requests perfectly to prevent overlapping audio or browser console errors.

### 🔐 Next-Gen Authentication
*   **Social Integration**: One-tap Google Login via Supabase OAuth 2.0.
*   **Secure Sessions**: JWT-based persistent sessions with highly secured cookie management.
*   **Glassmorphic Auth UI**: Login/signup flows are deeply styled with translucent layers and backdrop-filters to maintain the premium aesthetic.

### 🔄 Real-time State & Data Synchronization
*   **TanStack Query v5**: Handles robust server-state caching. It acts as the application's "Pulse", syncing data (like user preferences and liked songs) across multiple UI components without manual prop-drilling.
*   **Instant Updates**: Optimistic UI updates mean the UI reacts *before* the server responds, ensuring a snappy, zero-lag feeling.

### 💎 Premium UI/UX & Styling
*   **Tailwind CSS 4**: Next-gen utility-first CSS provides a highly responsive, grid-based layout for various screen sizes (Mobile, Tablet, Desktop).
*   **Framer Motion**: Hardware-accelerated micro-interactions, page transitions, and fluid hover states.
*   **Zero-CLS Visualizers**: Cover arts load efficiently with structural priority, preventing Cumulative Layout Shift and ensuring the page structure remains solid as assets fetch.

---

## 🚀 The Tech Stack (State-of-the-Art)

HeyMelody leverages the latest advancements in the web ecosystem:

*   **⚡ Framework**: [Next.js 16](https://nextjs.org/) (App Router) using the **Turbopack** engine.
*   **⚛️ UI Engine**: [React 19](https://react.dev/) utilizing Server Components (RSC) and Suspense.
*   **🛡️ Backend & Security**: [Supabase](https://supabase.com/) for Postgres DB and high-security Auth.
*   **💎 Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
*   **🔄 State Management**: [TanStack Query v5](https://tanstack.com/query/latest)
*   **🎭 Animations**: [Framer Motion](https://www.framer.com/motion/)

---

## 🛠️ Developer Setup

### Global Prerequisites
- **Node.js**: `v20.x` or higher
- **Package Manager**: `npm` or `pnpm`

### Environment Configuration
Create a `.env` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Installation & Launch
```bash
# Clone the repository
git clone https://github.com/SubhradeepNathGit/Hey-Melody.git

# Install dependencies
npm install

# Start the Turbopack dev server
npm run dev
```

---

## ⚖️ Legal & Copyright

**© 2025 - 2026 Subhradeep Nath. All Rights Reserved.**

**Developer**: Subhradeep Nath  
**Project Name**: HeyMelody Music Streaming Platform

*Unauthorized copying of this project's source code, via any medium, is strictly prohibited. The code is provided for demonstration purposes and remains the intellectual property of the author.*

---

*Engineered with precision. Crafted for sound. Designed & Developed by **Subhradeep Nath**.*
