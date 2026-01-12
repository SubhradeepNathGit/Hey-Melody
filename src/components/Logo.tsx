import React from "react";

export default function Logo() {
  return (
    <div
      className="
        grid place-items-center
        rounded-xl
        bg-gradient-to-br from-cyan-400 to-cyan-600
        
        w-8 h-8        /* mobile */
        sm:w-9 sm:h-9  /* small tablets */
        md:w-10 md:h-10 /* tablets */
        lg:w-10 lg:h-10 /* desktop */
        
      "
    >
      <svg
        viewBox="0 0 24 24"
        className="w-3/4 h-3/4"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="icon3dWhite" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="100%" stopColor="white" stopOpacity="0.8" />
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
