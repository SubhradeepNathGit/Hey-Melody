// components/ProfileSection.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type ProfileSectionProps = {
  displayName: string;
  email: string | null;
  avatarUrl?: string | null;
};

export default function ProfileSection({ displayName, email, avatarUrl }: ProfileSectionProps) {
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

      <div className="relative mt-5 mb-10">
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:32px_32px]" />

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-cyan-800 rounded-full opacity-35 group-hover:opacity-100 blur transition-all duration-300" />
            <div className="relative h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-40 lg:w-40 rounded-full overflow-hidden border-4 border-cyan-400">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  fill
                  className="object-cover"
                  unoptimized
                />
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
          <div className="flex-1 ml-0 sm:ml-3 lg:ml-3 text-center mt-2 lg:mt-5 sm:text-left">
            <p className="text-xs sm:text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2">
              View Profile
            </p>
            <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-extrabold mb-2 sm:mb-3 text-white"> Welcome, {displayName} </h1>
            {email && (
              <p className="text-xs sm:text-sm md:text-base text-cyan-400 mb-4">{email}</p>
            )}

          </div>
        </div>
      </div>
    </motion.section>
  );
}