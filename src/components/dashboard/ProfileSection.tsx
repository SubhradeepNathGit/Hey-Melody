// components/ProfileSection.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

type ProfileSectionProps = {
  displayName: string;
  email: string | null;
  avatarUrl?: string | null;
};

export default function ProfileSection({ displayName, email, avatarUrl }: ProfileSectionProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);

  const getInitial = () => {
    return displayName.charAt(0).toUpperCase();
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mb-8"
    >
      {/* Gradient Background */}
      <div className="absolute" />

      <div className="relative mb-0 sm:mb-0 mt-1 sm:mt-2 lg:mt-5">
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:32px_32px]" />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-cyan-800 rounded-full opacity-35 group-hover:opacity-100 blur transition-all duration-300" />
            <div className="relative h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-40 lg:w-40 rounded-full overflow-hidden border-4 border-cyan-400">
              {avatarUrl ? (
                <>
                  {isImageLoading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm">
                      <div className="relative h-8 w-8 sm:h-10 sm:w-10">
                        <div className="absolute inset-0 rounded-full border-4 border-white/10 border-t animate-spin" />
                     
                      </div>
                    </div>
                  )}
                  <Image
                    src={avatarUrl}
                    alt={displayName}
                    fill
                    className={`object-cover transition-opacity duration-300 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoadingComplete={() => setIsImageLoading(false)}
                    unoptimized
                  />
                </>
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-cyan-500/10 to-cyan-800 flex items-center justify-center">
                  <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white/90">
                    {getInitial()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 ml-0 sm:ml-3 lg:ml-3 text-center lg:mt-5 sm:text-left">
            <p className="text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2">
              View Profile
            </p>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 text-white"> Welcome, {displayName} </h1>
            {email && (
              <p className="text-sm sm:text-sm md:text-base text-cyan-400 mb-4">{email}</p>
            )}

          </div>
        </div>
      </div>
    </motion.section>
  );
}