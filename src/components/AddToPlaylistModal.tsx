"use client";

import { RxCross2 } from "react-icons/rx";
import type { Song } from "../../types/song";
import { User } from "@supabase/supabase-js";

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
  if (!pickerForSong) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-end md:place-items-center p-0 md:p-4" role="dialog" aria-modal="true">
      <button
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        aria-label="Close"
        onClick={() => setPickerForSong(null)}
      />
      <div className="relative w-full md:max-w-lg h-[85vh] md:h-auto max-h-[85vh] md:max-h-[90vh] rounded-t-3xl md:rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 md:p-7 flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-6">
          <div className="min-w-0">
            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Add to playlist
            </h3>
            <p className="text-sm text-zinc-400 mt-2 line-clamp-1">
              {pickerForSong.title} — {pickerForSong.artist}
            </p>
          </div>
          <button
            onClick={() => setPickerForSong(null)}
            className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-cyan-500/30 text-sm grid place-items-center transition-all"
            aria-label="Close"
          >
            <RxCross2 className="text-lg" />
          </button>
        </div>

        {!authUser ? (
          <div className="mt-5">
            <p className="text-zinc-300">Please log in to use playlists.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm text-zinc-400 font-medium mb-3">Your playlists</p>
              <div className="overflow-y-auto max-h-64 space-y-2 pr-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                {playlistsLoading ? (
                  <p className="text-zinc-400 text-sm">Loading…</p>
                ) : playlists && playlists.length > 0 ? (
                  playlists.map((pl) => (
                    <button
                      key={pl.id}
                      onClick={() => onAddToPlaylist(pl.id, pickerForSong.id as unknown as number)}
                      className="w-full text-left px-4 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 hover:border-cyan-500/30 border border-zinc-800 transition-all font-medium"
                    >
                      {pl.name}
                    </button>
                  ))
                ) : (
                  <p className="text-zinc-500 text-sm">No playlists yet.</p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-800">
              <p className="text-sm text-zinc-400 font-medium mb-3">Create new playlist</p>
              <div className="flex items-center gap-3">
                <input
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Playlist name"
                  className="flex-1 h-11 rounded-xl bg-zinc-900 border border-zinc-800 px-4 outline-none placeholder:text-zinc-500 focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
                <button
                  onClick={handleCreateAndAdd}
                  disabled={createPlaylistPending || addToPlaylistPending}
                  className="h-11 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 text-black font-bold hover:from-cyan-400 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/20"
                >
                  {createPlaylistPending ? "Creating…" : "Create"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}