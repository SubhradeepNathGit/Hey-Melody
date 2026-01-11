"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Playlist = {
  id: number;
  name: string;
  description: string | null;
  cover_image_url: string | null;
};

type AddToPlaylistModalProps = {
  isOpen: boolean;
  songTitle: string;
  songArtist: string;
  playlists: Playlist[];
  onClose: () => void;
  onAddToPlaylist: (playlistId: number) => void;
  onCreateAndAdd: (name: string) => void;
};

const DEFAULT_PLAYLIST_NAME = "Playlist001";

export default function AddToPlaylistModal({
  isOpen,
  songTitle,
  songArtist,
  playlists,
  onClose,
  onAddToPlaylist,
  onCreateAndAdd,
}: AddToPlaylistModalProps) {
  const [newPlaylistName, setNewPlaylistName] = useState(
    DEFAULT_PLAYLIST_NAME
  );
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Reset default name + auto-select on open
  useEffect(() => {
    if (isOpen) {
      setNewPlaylistName(DEFAULT_PLAYLIST_NAME);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select(); // 👈 allows single backspace to clear all
      }, 0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreateNew = async () => {
    const trimmed = newPlaylistName.trim();
    if (!trimmed) return;

    // Check for duplicate name
    const exists = playlists.some(
      (p) => p.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      alert("A playlist with this name already exists!");
      return;
    }

    setIsCreating(true);
    await onCreateAndAdd(trimmed);
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-zinc-800/50">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-zinc-800/50 flex items-center justify-center hover:bg-zinc-700/50 transition-colors"
          >
            <X className="h-4 w-4 text-zinc-400" />
          </button>

          <h2 className="text-xl font-bold text-white mb-1">
            Add to playlist
          </h2>
          <p className="text-sm text-zinc-400">
            {songTitle} — {songArtist}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Create New Section */}
          <div className="p-6 pt-4">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              Create new playlist
            </h3>

            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newPlaylistName.trim()) {
                    handleCreateNew();
                  }
                }}
                placeholder="Playlist name"
                className="flex-1 h-12 rounded-xl bg-zinc-800/60 border border-zinc-700/50 px-4 text-lg text-white placeholder:text-zinc-500 outline-none focus:border-cyan-500/50 focus:bg-zinc-800/80 transition-all"
              />

              <button
                type="button"
                onClick={handleCreateNew}
                disabled={!newPlaylistName.trim() || isCreating}
                className="h-12 px-6 rounded-xl bg-cyan-600/70 text-white font-semibold hover:bg-cyan-600/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {isCreating ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
