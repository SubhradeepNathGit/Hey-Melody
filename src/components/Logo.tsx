import React from "react";

export default function Logo() {
  return (
    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 grid place-items-center shadow-lg shadow-cyan-500/20">
      <svg
        className="w-6 h-6"
        viewBox="0 0 24 24"
        fill="white"
        style={{
          filter: `
            drop-shadow(0 1px 1px rgba(255,255,255,0.4))
            drop-shadow(0 3px 6px rgba(0,0,0,0.45))
          `,
        }}
      >
        <defs>
          <linearGradient id="icon3dWhite" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="100%" stopColor="white" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        <path
          d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
          fill="url(#icon3dWhite)"
        />
      </svg>
    </div>
  );
}
