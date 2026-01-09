"use client";

import { useEffect, useMemo, useState, useContext, useCallback } from "react";
import getSupabaseClient from "../../../api/SupabaseClient";
import { motion } from "framer-motion";
import { PlayerContext } from "../../../layouts/FrontendLayout";
import type { Song } from "../../../types/song";

// Import Components
import Header from "../../components/Header";
import ProfileSection from "../../components/dashboard/ProfileSection";
import UploadSongForm from "../../components/dashboard/UploadSongForm";
import CreatePlaylistForm from "../../components/dashboard/CreatePlaylistForm";
import PlaylistGrid from "../../components/dashboard/PlaylistGrid";
import PlaylistModal from "../../components/dashboard/PlaylistModal";

type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  avatar_url?: string | null;
};

type Playlist = {
  id: number;
  user_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  cover_image_url: string | null;
  playlist_songs?: { song_id: string }[];
};

type PlaylistSongRow = {
  song: Song;
  added_at: string;
  position: number | null;
};

type SupabasePlaylistSongResponse = {
  added_at: string;
  position: number | null;
  song: Song | Song[];
};

type Bucket = "songs" | "covers";

export default function UserDashboard() {
  const [me, setMe] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [plBusy, setPlBusy] = useState(false);
  const [openPlaylistId, setOpenPlaylistId] = useState<number | null>(null);
  const [openPlaylistSongs, setOpenPlaylistSongs] = useState<PlaylistSongRow[] | null>(null);

  // Header state
  const [searchQuery, setSearchQuery] = useState("");
  const [_currentPage, setCurrentPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const player = useContext(PlayerContext);

  const loadPlaylists = useCallback(async (uid: string) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("playlists")
      .select("id,user_id,name,description,is_public,created_at,cover_image_url, playlist_songs ( song_id )")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });
    if (error) {
      setMsg(error.message || "Failed to load playlists");
      return;
    }
    setPlaylists((data ?? []) as Playlist[]);
  }, []);

  useEffect(() => {
    (async () => {
      const supabase = getSupabaseClient();
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        setLoading(false);
        return;
      }
      const { id, email, user_metadata } = auth.user;
      const profile: Profile = {
        id,
        email: email ?? null,
        display_name: user_metadata?.display_name || user_metadata?.full_name || null,
        avatar_url: user_metadata?.avatar_url || null,
      };
      setMe(profile);
      await loadPlaylists(id);
      setLoading(false);
    })();
  }, [loadPlaylists]);

  const displayName = useMemo(() => {
    if (!me) return "You";
    if (me.display_name && me.display_name.trim() !== "") {
      return me.display_name;
    }
    return me.email?.split("@")[0] || "You";
  }, [me]);

  async function uploadTo(bucket: Bucket, file: File, prefix?: string) {
    const supabase = getSupabaseClient();
    const ext = (file.name.split(".").pop() || "bin").toLowerCase();
    const id = crypto.randomUUID();
    const path = prefix ? `${prefix}/${id}.${ext}` : `${id}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleAddSong(data: {
    title: string;
    artist: string;
    audioFile: File;
    coverFile: File;
  }) {
    setBusy(true);
    setMsg("");
    try {
      const audio_url = await uploadTo("songs", data.audioFile);
      const cover_image_url = await uploadTo("covers", data.coverFile, "songs");
      const insertPayload = {
        title: data.title,
        artist: data.artist,
        audio_url,
        cover_image_url,
      };
      const supabase = getSupabaseClient();
      const { error } = await supabase.from("songs").insert(insertPayload);
      if (error) throw error;
      setMsg("Song uploaded successfully! ✨");
      setTimeout(() => setMsg(""), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to add song";
      setMsg(message);
    } finally {
      setBusy(false);
    }
  }

  async function handleCreatePlaylist(data: {
    name: string;
    description: string;
    coverFile: File | null;
  }) {
    if (!me?.id) return;
    setPlBusy(true);
    setMsg("");
    try {
      const cover_image_url = data.coverFile
        ? await uploadTo("covers", data.coverFile, `playlists/${me.id}`)
        : null;
      const supabase = getSupabaseClient();
      const { error } = await supabase.from("playlists").insert({
        user_id: me.id,
        name: data.name.trim(),
        description: data.description.trim() || null,
        cover_image_url,
      });
      if (error) throw error;
      await loadPlaylists(me.id);
      setMsg("Playlist created successfully! 🎉");
      setTimeout(() => setMsg(""), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create playlist";
      setMsg(message);
    } finally {
      setPlBusy(false);
    }
  }

  async function openPlaylist(playlistId: number) {
    setOpenPlaylistId(playlistId);
    setOpenPlaylistSongs(null);
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("playlist_songs")
      .select("added_at, position, song:songs(*)")
      .eq("playlist_id", playlistId)
      .order("position", { ascending: true })
      .order("added_at", { ascending: true });
    if (error) {
      setMsg(error.message || "Failed to load playlist songs");
      return;
    }
    const transformedData = (data ?? []).map((row: SupabasePlaylistSongResponse) => ({
      added_at: row.added_at,
      position: row.position,
      song: Array.isArray(row.song) ? row.song[0] : row.song,
    })) as PlaylistSongRow[];
    setOpenPlaylistSongs(transformedData);
  }

  async function removeSongFromPlaylist(playlistId: number, songId: number) {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from("playlist_songs")
      .delete()
      .match({ playlist_id: playlistId, song_id: songId });
    if (error) {
      setMsg(error.message || "Failed to remove");
      return;
    }
    setMsg("Removed from playlist");
    setTimeout(() => setMsg(""), 2000);
    await openPlaylist(playlistId);
    await loadPlaylists(me!.id);
  }

  async function deletePlaylist(playlistId: number) {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from("playlists").delete().eq("id", playlistId);
    if (error) {
      setMsg(error.message || "Failed to delete playlist");
      return;
    }
    setMsg("Playlist deleted");
    setTimeout(() => setMsg(""), 2000);
    if (openPlaylistId === playlistId) {
      setOpenPlaylistId(null);
      setOpenPlaylistSongs(null);
    }
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
  }

  function playFromModal(song: Song) {
    if (!player) return;
    const queue = (openPlaylistSongs?.map((r) => r.song) ?? [song]) as Song[];
    player.playNow(song, queue);
  }

  async function handleLogout() {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center bg-black text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400">Loading Dashboard...</p>
        </div>
      </main>
    );
  }

  if (!me) {
    return (
      <main className="min-h-screen grid place-items-center bg-black text-white p-4 relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(1000px 500px at 10% -10%, rgba(6,182,212,0.15), transparent 60%)",
          }}
        />
        <div className="max-w-md px-4 text-center relative">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/10 ring-1 ring-cyan-500/20">
            <svg className="h-10 w-10 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-3">Authentication Required</h1>
          <p className="text-zinc-400">Please sign in to access your dashboard.</p>
        </div>
      </main>
    );
  }

  const currentPlaylist = openPlaylistId
    ? playlists.find((p) => p.id === openPlaylistId) || null
    : null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setCurrentPage={setCurrentPage}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        mobileSearchOpen={mobileSearchOpen}
        setMobileSearchOpen={setMobileSearchOpen}
        authUser={{ email: me.email, user_metadata: { display_name: me.display_name, avatar_url: me.avatar_url } }}
        handleLogout={handleLogout}
      />

      <main className="relative overflow-hidden pb-32">
        {/* Background Effects */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(1100px 550px at 10% -10%, rgba(6,182,212,0.08), transparent 60%), radial-gradient(900px 520px at 110% 15%, rgba(168,85,247,0.08), transparent 60%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.02] [background-image:linear-gradient(to_right,rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:64px_64px]"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Profile Section */}
          <ProfileSection
            displayName={displayName}
            email={me.email}
            avatarUrl={me.avatar_url}
          />

          {/* Message */}
          {msg && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-xl px-5 py-4 text-sm shadow-lg shadow-cyan-500/10"
            >
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-white font-medium">{msg}</span>
              </div>
            </motion.div>
          )}

          {/* Upload & Create Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-15">
            <UploadSongForm onSubmit={handleAddSong} busy={busy} />
            <CreatePlaylistForm onSubmit={handleCreatePlaylist} busy={plBusy} />
          </div>

          {/* Playlists Section */}
          <section className="space-y-6">
            <div className="flex items-center mt-15 justify-between">
              <h2 className="text-3xl font-bold">Your Playlists</h2>
              <span className="text-sm text-zinc-500">
                {playlists.length} playlist{playlists.length === 1 ? "" : "s"}
              </span>
            </div>
            <PlaylistGrid
              playlists={playlists}
              onOpen={openPlaylist}
              onDelete={deletePlaylist}
            />
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-17 bg-black/50 backdrop-blur-xl">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-0 text-center">
            <p className="text-sm text-zinc-500 mb-2">
              © {new Date().getFullYear()} Hey Melody. All Rights Reserved
            </p>
            <p className="text-sm text-zinc-600">
              Designed & Developed by{" "}
              <a
                href="https://github.com/SubhradeepNathGit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Subhradeep Nath
              </a>
            </p>
          </div>
        </footer>
      </main>

      {/* Playlist Modal */}
      {openPlaylistId !== null && (
        <PlaylistModal
          playlist={currentPlaylist}
          songs={openPlaylistSongs}
          onClose={() => {
            setOpenPlaylistId(null);
            setOpenPlaylistSongs(null);
          }}
          onPlay={playFromModal}
          onRemove={(songId) => removeSongFromPlaylist(openPlaylistId, songId)}
        />
      )}
    </div>
  );
}