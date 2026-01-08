// components/PlaylistModal.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { Song } from "../../../types/song";

type Playlist = {
  id: number;
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
  onRemove: (songId: number) => void;
};

export default function PlaylistModal({ playlist, songs, onClose, onPlay, onRemove }: PlaylistModalProps) {
  if (!playlist) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

      {/* Modal */}
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative w-full md:max-w-4xl max-h-[90vh] rounded-t-3xl md:rounded-3xl border border-white/10 bg-zinc-900/98 backdrop-blur-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Cover */}
        <div className="relative h-48 sm:h-64 w-full overflow-hidden border-b border-white/10">
          {playlist.cover_image_url ? (
            <Image
              src={playlist.cover_image_url}
              alt={playlist.name}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-purple-500/30 via-zinc-900 to-black">
              <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(45deg,rgba(168,85,247,0.4)_1px,transparent_1px),linear-gradient(-45deg,rgba(168,85,247,0.4)_1px,transparent_1px)] [background-size:24px_24px]" />
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent" />

          {/* Playlist Info */}
          <div className="absolute bottom-6 left-6 right-20">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Playlist
            </p>
            <h2 className="text-3xl sm:text-4xl font-black mb-2 line-clamp-2">
              {playlist.name}
            </h2>
            {playlist.description && (
              <p className="text-sm text-zinc-400 line-clamp-1">
                {playlist.description}
              </p>
            )}
            <p className="text-sm text-zinc-500 mt-2">
              {songs?.length ?? 0} song{songs?.length === 1 ? "" : "s"}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all hover:scale-110"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Songs List */}
        <div className="max-h-[calc(90vh-16rem)] md:max-h-[calc(90vh-20rem)] overflow-y-auto p-6 space-y-2">
          {!songs && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-12 w-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-zinc-400">Loading songs...</p>
            </div>
          )}

          {songs?.length === 0 && (
            <div className="text-center py-20 px-4">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-purple-500/10 mb-6 ring-1 ring-purple-500/30">
                <svg className="h-10 w-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No songs yet</h3>
              <p className="text-zinc-400">Add songs to this playlist to get started</p>
            </div>
          )}

          {songs?.map(({ song }, index) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="group flex items-center gap-4 rounded-xl border border-white/5 bg-black/20 hover:bg-white/5 p-3 sm:p-4 transition-all"
            >
              {/* Index */}
              <div className="w-8 text-center">
                <span className="text-zinc-500 text-sm group-hover:hidden">
                  {index + 1}
                </span>
                <button
                  onClick={() => onPlay(song)}
                  className="hidden group-hover:flex items-center justify-center h-8 w-8 rounded-lg bg-purple-500 hover:bg-purple-400 transition-all hover:scale-110"
                >
                  <svg className="h-4 w-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>

              {/* Cover */}
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 overflow-hidden rounded-lg bg-zinc-800 shrink-0 shadow-lg">
                <Image
                  src={song.cover_image_url}
                  alt={song.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate text-white group-hover:text-purple-400 transition-colors">
                  {song.title}
                </p>
                <p className="text-sm text-zinc-500 truncate">
                  {song.artist}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onPlay(song)}
                  className="h-9 px-4 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 text-sm font-medium transition-all hidden sm:block"
                >
                  Play
                </button>
                <button
                  onClick={() => onRemove(song.id)}
                  className="h-9 px-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-medium transition-all"
                  title="Remove from playlist"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}