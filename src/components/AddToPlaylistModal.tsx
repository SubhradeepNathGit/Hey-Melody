"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Song } from "../../types/song";

type Playlist = {
  id: number;
  name: string;
  description?: string | null;
};

type AddToPlaylistModalProps = {
  pickerForSong: Song | null;
  setPickerForSong: (song: Song | null) => void;
  authUser: {
    email?: string | null;
    user_metadata?: {
      display_name?: string | null;
      avatar_url?: string | null;
      full_name?: string | null;
    } | null;
  } | null;
  playlists: Playlist[] | undefined;
  playlistsLoading: boolean;
  newPlaylistName: string;
  setNewPlaylistName: (name: string) => void;
  onAddToPlaylist: (playlistId: number, songId: number) => void;
  handleCreateAndAdd: () => void;
  createPlaylistPending: boolean;
  addToPlaylistPending: boolean;
};

export default function AddToPlaylistModal({
  pickerForSong,
  setPickerForSong,
  authUser,
  playlists,
  playlistsLoading,
  newPlaylistName,
  setNewPlaylistName,
  onAddToPlaylist,
  handleCreateAndAdd,
  createPlaylistPending,
  addToPlaylistPending,
}: AddToPlaylistModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pickerForSong) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [pickerForSong]);

  // Focus input on open if authenticated
  useEffect(() => {
    if (pickerForSong && authUser) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [pickerForSong, authUser]);

  if (!pickerForSong) return null;

  return (
    <div className="fixed inset-0 z-[60] flex mt-2 lg:mt-20 items-end sm:items-center justify-center sm:p-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-transparent backdrop-blur-none sm:backdrop-blur-md"
        onClick={() => setPickerForSong(null)}
      />

      {/* Modal - Fixed Height */}
      <div className="relative w-full sm:max-w-md md:max-w-lg bg-zinc-900/70 backdrop-blur-xl border-0 sm:border border-zinc-700/50 rounded-t-3xl sm:rounded-2xl shadow-2xl h-[90vh] sm:h-[85vh] md:h-[600px] flex flex-col">
        {/* Header */}
        <div className="relative p-4 sm:p-6 pb-3 sm:pb-4 border-b border-zinc-800/50 flex-shrink-0">
          {/* Mobile handle indicator */}
          <div className="sm:hidden w-12 h-1 bg-zinc-700/50 rounded-full mx-auto mb-4" />

          <button
            type="button"
            onClick={() => setPickerForSong(null)}
            className="absolute top-4 sm:top-4 right-4 h-9 w-9 sm:h-8 sm:w-8 rounded-full bg-zinc-800/50 flex items-center justify-center hover:bg-zinc-700/50 active:bg-zinc-700/70 transition-colors touch-manipulation"
          >
            <X className="h-5 w-5 sm:h-4 sm:w-4 text-zinc-400" />
          </button>

          <h2 className="text-lg sm:text-xl font-bold text-white mb-1 pr-10">
            Add to Playlist
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 truncate pr-10">
            {pickerForSong.title} — {pickerForSong.artist}
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 pt-3 sm:pt-4 space-y-5 sm:space-y-6">
          {!authUser ? (
            <div className="py-4 text-center">
              <p className="text-zinc-400">Please log in to use playlists.</p>
            </div>
          ) : (
            <>
              {/* Existing Playlists Section */}
              {playlists && playlists.length > 0 && (
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2.5 sm:mb-3 px-1">
                    Your Playlists
                  </h3>
                  <div className="space-y-2">
                    {playlists.map((pl) => (
                      <button
                        key={pl.id}
                        onClick={() => onAddToPlaylist(pl.id, pickerForSong.id)}
                        className="w-full text-left px-4 py-3.5 sm:py-3 rounded-xl hover:bg-cyan-700/20 active:bg-zinc-800/90 hover:border-cyan-500/30 active:scale-[0.98] text-zinc-200 hover:text-white transition-all flex items-center justify-between group touch-manipulation"
                      >
                        <span className="truncate text-sm sm:text-base">{pl.name}</span>
                        <span className="opacity-0 group-hover:opacity-100 text-cyan-400 text-xs sm:text-sm font-medium transition-opacity ml-2 flex-shrink-0">Add</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer - Create New Playlist */}
        {authUser && (
          <div className="flex-shrink-0 p-4 sm:p-6 pt-3 sm:pt-4 border-t border-zinc-800/50 bg-zinc-900/50">
            <h3 className="text-xs sm:text-sm lg:text-sm  font-semibold text-zinc-400 uppercase tracking-wider mb-2.5 sm:mb-3 px-1">
              {playlists && playlists.length > 0 ? "Or Create New Playlist" : "Create New Playlist"}
            </h3>

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mt-3">
              <input
                ref={inputRef}
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newPlaylistName.trim()) {
                    handleCreateAndAdd();
                  }
                }}
                placeholder="Playlist name"
                className="
                  w-full
                  min-h-[56px] sm:min-h-[56px] 
                  px-4
                  py-3
                  text-lg sm:text-lg lg:text-lg
                  leading-tight
                  rounded-xl
                  bg-zinc-800/60
                  border border-zinc-700/50
                  text-white
                  placeholder:text-zinc-500
                  outline-none
                  appearance-none
                  focus:border-cyan-500/50
                  focus:bg-zinc-800/80
                  focus:ring-2 focus:ring-cyan-500/10
                  transition-all
                  touch-manipulation
                "
              />
              <button
                onClick={handleCreateAndAdd}
                disabled={createPlaylistPending || addToPlaylistPending || !newPlaylistName.trim()}
                className="h-14 w-full sm:w-auto px-8 rounded-xl bg-cyan-600 text-white text-lg font-bold hover:bg-cyan-600/90 active:bg-cyan-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98] touch-manipulation flex items-center justify-center shadow-lg shadow-cyan-500/10"
              >
                {createPlaylistPending ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Safe area for mobile devices */}
        <div className="sm:hidden h-safe-area-inset-bottom bg-zinc-900/95 flex-shrink-0" />
      </div>
    </div>
  );
}