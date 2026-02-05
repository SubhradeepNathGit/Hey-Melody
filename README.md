# 🎧 HeyMelody: The Future of Music Streaming

**HeyMelody** is a cutting-edge, high-fidelity music streaming platform engineered for performance, aesthetics, and a flawless user experience. Built with the **Next.js 16 Apex Stack**, it delivers lightning-fast transitions, real-time synchronization, and a premium audio engine.

---

## 🚀 The Tech Stack (State-of-the-Art)

HeyMelody leverages the latest advancements in the web ecosystem to ensure a "buttery smooth" experience:

*   **⚡ Framework**: [Next.js 16](https://nextjs.org/) (App Router) using the **Turbopack** engine for instant HMR and optimized builds.
*   **⚛️ UI Engine**: [React 19](https://react.dev/) utilizing Server Components (RSC) and Suspense for enhanced performance.
*   **🛡️ Backend & Security**: [Supabase](https://supabase.com/) for real-time Postgres DB, high-security Auth, and Edge Functions.
*   **💎 Styling**: [Tailwind CSS 4](https://tailwindcss.com/) — Next-gen utility-first CSS with modern variables and optimized runtime.
*   **🔄 State Management**: [TanStack Query v5](https://tanstack.com/query/latest) for robust server-state synchronization and caching.
*   **🎭 Animations**: [Framer Motion](https://www.framer.com/motion/) for fluid, hardware-accelerated micro-interactions.
*   **🔊 Audio Pipeline**: Custom HTML5 Audio implementation with advanced race-condition handling and promise-based control.

---

## ✨ Feature Spectrum

### 🔐 Next-Gen Authentication
*   **Social Integration**: One-tap **Google Login** via Supabase OAuth 2.0.
*   **Secure Sessions**: Implementation of JWT-based persistent sessions with Middleware protection.
*   **Modern Auth UI**: Glassmorphic login/signup flows with real-time validation and reactive feedback.

### 🎼 Elite Audio Engine
*   **Seamless Switching**: Specialized logic to handle rapid track skipping without playback breakage (Race-condition protection).
*   **Global Synchronization**: Shared `PlayerContext` ensures play/pause states are synced instantly across Song Cards, Sidebars, and the Main Player.
*   **Smart Shuffle**: Proprietary randomization algorithm that ensures a fresh listening experience without immediate track repetition.
*   **Persistent Controls**: Volume, repeat, and mute settings persist across browser sessions.

### 🖼️ Premium UI/UX
*   **Glassmorphism Design**: High-end translucent layers, backdrop filters, and subtle border glows.
*   **Responsive Marquee**: Dynamic song title scrolling for long titles using Intersection Observers.
*   **Interactive Queue**: Real-time queue management with smooth entry/exit animations.
*   **Visualizers**: Immersive cover art rendering with priority loading for zero-CLV (Cumulative Layout Shift).

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

## 🏗️ Technical Architecture

### Audio Lifecycle Optimization
To prevent memory leaks and playback lag, HeyMelody implements a **Single-Instance Audio Strategy**. Unlike traditional players that recreate DOM nodes per song, we reuse a single prioritized `<audio>` element, swapping sources and handling playback promises through a custom-built React Hook cancellation pattern.

### Edge-Guard Middleware
Next.js Middleware validates Supabase sessions at the Edge, ensuring zero-latency protection of private routes and streaming resources by intercepting requests before they reach the server.

### Real-time Pulse
Using TanStack Query, the application maintains a "Pulse" state that syncs data across multiple tabs and components, ensuring that if you like a song in one section, the heart icon updates everywhere without a refresh.

---

## ⚖️ Legal & Copyright

**© 2025 - 2026 Subhradeep Nath. All Rights Reserved.**

**Developer**: Subhradeep Nath
**Project Name**: HeyMelody Music Streaming Platform

*Unauthorized copying of this project's source code, via any medium, is strictly prohibited. The code is provided for demonstration purposes and remains the intellectual property of the author.*

---

*Engineered with precision. Crafted for sound. Developed by **Subhradeep Nath**.*
