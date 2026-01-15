// components/PlaylistModal.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { X, Trash2, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useContext, useRef } from "react";
import type { Song } from "../../../types/song";
import { PlayerContext } from "../../../layouts/FrontendLayout";

type Playlist = {
  id: number | string;
  name: string;
  description: string | null;
  cover_image_url: string | null;
};

type PlaylistSongRow = {
  song: Song;
  added_at: string;
  position: number | null;
};

type PlaylistModalProps = {
  playlist: Playlist | null;
  songs: PlaylistSongRow[] | null;
  onClose: () => void;
  onPlay: (song: Song) => void;
  onRemove?: (songId: number) => void;
};

type Toast = {
  id: number;
  message: string;
};

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 min-w-[280px] sm:min-w-[320px] max-w-md bg-zinc-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-3 sm:p-4 shadow-2xl shadow-cyan-500/10 animate-in slide-in-from-right duration-300 mx-4 sm:mx-0">
      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-cyan-500/10 flex items-center justify-center ring-1 ring-cyan-500/20 flex-shrink-0">
        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
      </div>
      <p className="flex-1 text-xs sm:text-sm font-medium text-white">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="h-6 w-6 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 flex items-center justify-center transition-colors flex-shrink-0"
      >
        <X className="h-3 w-3 text-zinc-400" />
      </button>
    </div>
  );
}

export default function PlaylistModal({ playlist, songs, onClose, onPlay, onRemove }: PlaylistModalProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const ctx = useContext(PlayerContext);
  const currentMusic = ctx?.currentMusic;
  const playingSongId = currentMusic?.id ?? null;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const songRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (playlist) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [playlist]);

  // Auto-play first song when modal opens
  useEffect(() => {
    if (songs && songs.length > 0 && !currentMusic) {
      const firstSong = songs[0].song;
      onPlay(firstSong);
    }
  }, [songs, currentMusic, onPlay]);

  // Auto-scroll to currently playing song
  useEffect(() => {
    if (playingSongId && songRefs.current.has(playingSongId) && scrollContainerRef.current) {
      const songElement = songRefs.current.get(playingSongId);
      if (songElement) {
        const container = scrollContainerRef.current;
        const containerRect = container.getBoundingClientRect();
        const songRect = songElement.getBoundingClientRect();

        // Calculate if the song is out of view
        const isAboveView = songRect.top < containerRect.top;
        const isBelowView = songRect.bottom > containerRect.bottom;

        if (isAboveView || isBelowView) {
          // Smooth scroll to center the song in the container
          const scrollTop = songElement.offsetTop - container.offsetTop - (container.clientHeight / 2) + (songElement.clientHeight / 2);
          container.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [playingSongId]);

  const showToast = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleRemove = (songId: number, songTitle: string) => {
    if (onRemove) {
      onRemove(songId);
      showToast(`"${songTitle}" removed from playlist`);
    }
  };

  const handleSongClick = (song: Song) => {
    onPlay(song);
  };

  if (!playlist) return null;

  return (
    <>
      <motion.div
        key="playlist-modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 lg:p-6"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

        {/* Modal - Fixed dimensions */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{
            duration: 0.2,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="relative w-full h-[600px] sm:w-[700px] sm:h-[550px] lg:w-[890px] rounded-t-3xl sm:rounded-2xl bg-gradient-to-b from-zinc-900/95 to-black/95 backdrop-blur-xl overflow-hidden shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Cover - Fixed height */}
          <div className="relative h-[280px] sm:h-[260px] lg:h-65 w-full overflow-hidden flex-shrink-0">
            {(() => {
              // 1. Prioritize currently playing song's cover
              let coverUrl = null;

              if (currentMusic && songs && songs.some(s => s.song.id === currentMusic.id)) {
                // If a song is currently playing and it's in this playlist/album/liked songs
                coverUrl = currentMusic.cover_image_url || (currentMusic as any).cover;
              }

              // 2. Fall back to explicitly set playlist cover
              if (!coverUrl) {
                coverUrl = playlist.cover_image_url || (playlist as any).cover;
              }

              // 3. If no cover and songs exist, use first song's cover
              if (!coverUrl && songs && songs.length > 0) {
                const firstSong = songs[0].song;
                coverUrl = firstSong.cover_image_url || (firstSong as any).cover;
              }

              return coverUrl ? (
                <Image
                  key={`cover-${currentMusic?.id || playlist.id}`}
                  src={coverUrl}
                  alt={playlist.name}
                  fill
                  className="object-cover object-top sm:object-center transition-all duration-500"
                  priority
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-cyan-600/40 via-cyan-950/50 to-black/10">
                  <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_50%_120%,rgba(6,182,212,0.3),transparent_50%)]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-20 h-20 text-cyan-500/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                </div>
              );
            })()}


            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />

            {/* Playlist Info */}
            <div className="absolute bottom-3 sm:bottom-4 left-4 sm:left-6 right-16 sm:right-20">
              <p className="text-[10px] sm:text-xs font-bold text-white/70 uppercase tracking-widest mb-1 ml-1 sm:mb-2">
                Playlist
              </p>
              <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2 text-white drop-shadow-2xl line-clamp-2">
                {playlist.name}
              </h2>
              {playlist.description && (
                <p className="text-xs sm:text-sm text-white/80 mb-2 ml-1 sm:mb-2 line-clamp-2">
                  {playlist.description}
                </p>
              )}
              <p className="text-xs sm:text-sm text-white/60 ml-1 mt-3 font-medium">
                {songs?.length ?? 0} song{songs?.length === 1 ? "" : "s"}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Close modal"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </button>
          </div>

          {/* Songs List - Fixed height with scrolling */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 pb-32 sm:pb-4 custom-scrollbar"
          >
            {!songs && (
              <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                <div className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-3 sm:mb-4" />
                <p className="text-zinc-400 text-xs sm:text-sm">Loading songs...</p>
              </div>
            )}

            {songs?.length === 0 && (
              <div className="text-center py-16 sm:py-20 px-4">
                <div className="inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-cyan-500/10 mb-4 sm:mb-6 ring-1 ring-cyan-500/20">
                  <svg className="h-8 w-8 sm:h-10 sm:w-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">No songs yet</h3>
                <p className="text-zinc-400 text-xs sm:text-sm">Add songs to this playlist to get started</p>
              </div>
            )}

            {songs && songs.length > 0 && (
              <div className="space-y-0.5 py-3 sm:py-4">
                {songs.map(({ song }, index) => (
                  <motion.div
                    key={`song-${song.id}-${index}`}
                    ref={(el) => {
                      if (el) {
                        songRefs.current.set(song.id, el);
                      } else {
                        songRefs.current.delete(song.id);
                      }
                    }}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: Math.min(index * 0.03, 0.3),
                      ease: "easeOut"
                    }}
                    onClick={() => handleSongClick(song)}
                    className={`group flex items-center gap-2 sm:gap-3 md:gap-4 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 rounded-md transition-colors duration-200 cursor-pointer ${playingSongId === song.id
                      ? 'bg-cyan-500/10 hover:bg-cyan-500/15'
                      : 'hover:bg-white/5'
                      }`}
                  >
                    {/* Song Number */}
                    <div className="w-5 sm:w-6 text-right flex-shrink-0">
                      <span className={`text-xs sm:text-sm font-medium transition-colors ${playingSongId === song.id
                        ? 'text-cyan-400'
                        : 'text-zinc-400 group-hover:text-white'
                        }`}>
                        {index + 1}
                      </span>
                    </div>

                    {/* Cover Image */}
                    <div className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0 rounded overflow-hidden">
                      <Image
                        src={song.cover_image_url || (song as any).cover || "/favicon.ico"}
                        alt={song.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 36px, (max-width: 768px) 40px, 48px"
                      />
                    </div>

                    {/* Song Info */}
                    <div className="min-w-0 flex-1">
                      <p className={`font-medium truncate text-xs sm:text-sm transition-colors ${playingSongId === song.id
                        ? 'text-cyan-400'
                        : 'text-white group-hover:text-cyan-400'
                        }`}>
                        {song.title}
                      </p>
                      <p className={`text-[11px] sm:text-xs truncate transition-colors ${playingSongId === song.id
                        ? 'text-cyan-400/70'
                        : 'text-zinc-400 group-hover:text-zinc-300'
                        }`}>
                        {song.artist}
                      </p>
                    </div>

                    {/* Delete Button */}
                    {onRemove && (
                      <div className="flex-shrink-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(song.id, song.title);
                          }}
                          className="h-7 w-7 sm:h-8 sm:w-8 rounded-full hover:bg-red-500/20 flex items-center justify-center transition-all duration-200 active:scale-95"
                          aria-label="Remove from playlist"
                        >
                          <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-zinc-400 hover:text-red-400" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Toast Container */}
      <div className="fixed top-4 right-0 sm:right-4 z-[100] flex flex-col gap-2 sm:gap-3 w-full sm:w-auto">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
          />
        ))}
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        @media (min-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 10px;
          }
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 5px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
          border: 2px solid transparent;
          background-clip: padding-box;
        }
      `}</style>
    </>
  );
}