import React from "react";

export type GrooveLoaderProps = {
  variant?: "full" | "inline";
  message?: string;
  progress?: number; 
};

export default function GrooveLoader({
  variant = "full",
  message = "Loading Hey Melody",
  progress,
}: GrooveLoaderProps) {
  if (variant === "inline") return <InlineLoader message={message} />;
  return <FullLoader message={message} progress={progress} />;
}

function FullLoader({
  message,
  progress,
}: {
  message: string;
  progress?: number;
}) {
  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-[#030a06]">
      {/* Background lights */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 50%, #22d3ee 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-40 -right-24 h-[520px] w-[520px] rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, #06b6d4 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Glass card */}
      <div className="relative w-[min(92vw,520px)] rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-[0_8px_60px_rgba(6,182,212,0.25)]">
        {/* Rotating ring */}
        <div className="mx-auto grid place-items-center">
          <div className="relative h-28 w-28">
            <div className="absolute inset-0 rounded-full ring-1 ring-white/15" />
            <div
              className="absolute inset-0 animate-spin-slow rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(6,182,212,0) 0%, rgba(6,182,212,0.15) 30%, rgba(6,182,212,0.6) 60%, rgba(6,182,212,0) 70%)",
                WebkitMask:
                  "radial-gradient(circle, #000 62%, transparent 63%, transparent 71%, #000 72%)",
                mask:
                  "radial-gradient(circle, #000 62%, transparent 63%, transparent 71%, #000 72%)",
              }}
            />
            <div className="absolute inset-[22%] rounded-full bg-gradient-to-b from-cyan-400/90 to-cyan-600/90 shadow-[0_0_40px_rgba(6,182,212,0.65)]" />
            {/* Pulsing ring */}
            <div className="absolute inset-0 animate-pulse-ring rounded-full" />
          </div>
        </div>

        {/* Equalizer */}
        <div className="mt-6 flex items-end justify-center gap-1.5">
          {[...Array(7)].map((_, i) => (
            <span
              key={i}
              className="h-8 w-1.5 origin-bottom rounded-full bg-cyan-300/80 shadow-[0_4px_18px_rgba(34,211,238,0.45)]"
              style={{
                animation: `equalize 900ms ease-in-out ${i * 0.08}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Message */}
        <p className="mt-6 text-center text-sm font-medium tracking-wide text-cyan-100/90">
          {message}
        </p>

        {/* Progress bar (optional) */}
        {typeof progress === "number" && (
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-300 shadow-[0_0_16px_rgba(6,182,212,0.6)]"
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            />
          </div>
        )}

        {/* Tiny tips / brand */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/50">
          <span className="inline-block h-1.5 w-1.5 animate-ping rounded-full bg-cyan-400/80" />
          <span>Hey Melody is tuning your vibe</span>
        </div>
      </div>

      <StyleBlock />
    </div>
  );
}

function InlineLoader({ message }: { message?: string }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
      <div className="relative h-5 w-5">
        <span className="absolute inset-0 animate-spin-fast rounded-full border-2 border-cyan-400/70 border-t-transparent" />
        <span className="absolute inset-[22%] rounded-full bg-cyan-400/90" />
      </div>
      {message && <span className="text-xs text-cyan-100/90">{message}</span>}
      <div className="ml-1 flex items-end gap-0.5">
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            className="h-3 w-0.5 origin-bottom rounded-full bg-cyan-300/90"
            style={{
              animation: `equalize 900ms ease-in-out ${i * 0.07}s infinite`,
            }}
          />
        ))}
      </div>
      <StyleBlock />
    </div>
  );
}

function StyleBlock() {
  return (
    <style>{`
      @keyframes equalize { 0%, 100% { transform: scaleY(0.25) } 50% { transform: scaleY(1) } }
      @keyframes pulseRing {
        0% { box-shadow: 0 0 0 0 rgba(6,182,212,0.20); }
        70% { box-shadow: 0 0 0 18px rgba(6,182,212,0.00); }
        100% { box-shadow: 0 0 0 0 rgba(6,182,212,0.00); }
      }
      .animate-pulse-ring { animation: pulseRing 1.8s ease-out infinite; }
      .animate-spin-slow { animation: spin 2.6s linear infinite; }
      .animate-spin-fast { animation: spin 0.9s linear infinite; }
      @keyframes spin { to { transform: rotate(360deg); } }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .animate-pulse-ring,
        .animate-spin-slow,
        .animate-spin-fast,
        [style*="equalize"] {
          animation: none !important;
        }
      }
    `}</style>
  );
}
