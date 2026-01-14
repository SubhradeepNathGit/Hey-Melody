"use client";

import React, { useContext, useEffect, useState } from "react";
import { PlayerContext } from "../../layouts/FrontendLayout";
import { Song } from "../../types/song";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { X, ListMusic, Play } from "lucide-react";

export default function Queue() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("player context must be within a provider");
  }

  const { isQueueModalOpen, setQueueModalOpen, currentMusic, queue, playNow } = context;

  const [allowAutoplay, setAllowAutoplay] = useState(true);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setAllowAutoplay(!mq.matches);
    handler();
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  useEffect(() => {
    if (isQueueModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isQueueModalOpen]);

  const startPlayingSong = (song: Song) => {
    playNow(song, queue);
  };

  return (
    <AnimatePresence>
      {isQueueModalOpen && (
        <motion.div
          key="queue-modal"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="
            fixed z-[120]
            w-full sm:w-[400px] 
            h-[calc(100dvh-184px)] sm:h-[600px]
            bg-zinc-950/95 backdrop-blur-2xl
            border-l border-white/10 p-4 sm:p-5 overflow-hidden shadow-2xl
            flex flex-col
            top-16 sm:top-auto
            bottom-0 sm:bottom-28 right-0 sm:right-6
            sm:rounded-2xl sm:border
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3 sm:mb-6 shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <ListMusic className="w-5 h-5 text-cyan-400" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">Queue</h2>
            </div>
            <button
              onClick={() => setQueueModalOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto pr-1 flex-1 space-y-4 sm:space-y-8 custom-scrollbar">
            {/* Now Playing Section */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-cyan-500 font-bold mb-4 pl-1">
                Now Playing
              </p>
              <div className="group relative flex items-center gap-4 p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10 transition-all duration-300">
                <div className="relative w-14 h-14 shrink-0 overflow-hidden rounded-lg shadow-xl ring-1 ring-white/10">
                  {currentMusic?.video_url && currentMusic.video_url.length > 5 ? (
                    <video
                      src={currentMusic.video_url}
                      className="w-full h-full object-cover"
                      muted
                      autoPlay={allowAutoplay}
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : (currentMusic?.cover_image_url || (currentMusic as any)?.cover) ? (
                    <Image
                      src={currentMusic?.cover_image_url || (currentMusic as any)?.cover || ""}
                      alt={currentMusic?.title || ""}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-800 grid place-items-center">
                      <ListMusic className="w-6 h-6 text-zinc-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white truncate">
                    {currentMusic?.title}
                  </p>
                  <p className="text-xs text-zinc-400 truncate mt-1">{currentMusic?.artist}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-0.5 h-3 bg-cyan-400 rounded-full animate-playing-1" />
                  <span className="w-0.5 h-5 bg-cyan-400 rounded-full animate-playing-2" />
                  <span className="w-0.5 h-4 bg-cyan-400 rounded-full animate-playing-3" />
                </div>
              </div>
            </div>

            {/* Queue List Section */}
            <div className="pb-2 sm:pb-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-4 pl-1">
                Up Next
              </p>
              <div className="space-y-1">
                {queue.length === 0 ? (
                  <p className="text-sm text-zinc-600 italic py-8 text-center bg-white/5 rounded-xl">No songs in queue</p>
                ) : (
                  queue.map((song: Song, index) => {
                    const isCurrentSong = currentMusic?.id === song.id;
                    const coverUrl = song.cover_image_url || (song as any).cover;
                    // Ensure unique and stable keys - use song.id if available, otherwise create from properties
                    const uniqueKey = song.id
                      ? `queue-${song.id}-${index}`
                      : `queue-${index}-${song.title || 'untitled'}-${song.artist || 'unknown'}`.replace(/\s+/g, '-');
                    return (
                      <motion.div
                        key={uniqueKey}
                        onClick={() => startPlayingSong(song)}
                        className={`
                          group flex items-center gap-4 p-2.5 rounded-xl cursor-pointer
                          transition-all duration-200
                          ${isCurrentSong
                            ? "bg-white/10 ring-1 ring-white/5"
                            : "hover:bg-white/5"
                          }
                        `}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && startPlayingSong(song)}
                      >
                        <div className="relative w-11 h-11 shrink-0 overflow-hidden rounded-lg bg-zinc-800 ring-1 ring-white/5 transition-transform duration-300 group-hover:scale-105">
                          {song.video_url && song.video_url.length > 5 ? (
                            <video
                              src={song.video_url}
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                              muted
                              autoPlay={allowAutoplay}
                              loop
                              playsInline
                              preload="metadata"
                            />
                          ) : coverUrl ? (
                            <Image
                              src={coverUrl}
                              alt={song.title}
                              fill
                              className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Play className="w-4 h-4 text-zinc-600" />
                            </div>
                          )}
                          <div className={`absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity`}>
                            <Play className="w-4 h-4 text-white fill-current" />
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-semibold truncate ${isCurrentSong ? "text-cyan-400" : "text-zinc-200 group-hover:text-white"}`}>
                            {song.title}
                          </p>
                          <p className="text-[11px] text-zinc-500 truncate mt-0.5 group-hover:text-zinc-400 transition-colors">
                            {song.artist}
                          </p>
                        </div>

                        {isCurrentSong && (
                          <div className="flex items-center gap-1">
                            <span className="w-0.5 h-3 bg-cyan-400 rounded-full animate-playing-1" />
                            <span className="w-0.5 h-5 bg-cyan-400 rounded-full animate-playing-2" />
                            <span className="w-0.5 h-4 bg-cyan-400 rounded-full animate-playing-3" />
                          </div>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        @keyframes playing {
          0%, 100% { height: 0.75rem; }
          50% { height: 0.5rem; }
        }
        
        .animate-playing-1 {
          animation: playing 0.8s ease-in-out infinite;
          animation-delay: 0s;
        }
        
        .animate-playing-2 {
          animation: playing 0.8s ease-in-out infinite;
          animation-delay: 0.2s;
        }
        
        .animate-playing-3 {
          animation: playing 0.8s ease-in-out infinite;
          animation-delay: 0.4s;
        }
      `}</style>
    </AnimatePresence>
  );
}
