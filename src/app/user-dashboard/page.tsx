"use client";

import { useEffect, useMemo, useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Disc, Plus, Heart, Music2, Upload, Eye, Trash2, Play } from "lucide-react";
import getSupabaseClient from "../../../api/SupabaseClient";
import { PlayerContext } from "../../../layouts/FrontendLayout";
import toast from "react-hot-toast";
import type { Song } from "../../../types/song";

// Import Components
import Header from "../../components/Header";
import ProfileSection from "../../components/dashboard/ProfileSection";
import UploadSongForm from "../../components/dashboard/UploadSongForm";
import PlaylistGrid from "../../components/dashboard/PlaylistGrid";
import PlaylistModal from "../../components/dashboard/PlaylistModal";
import AddToPlaylistModal from "../../components/dashboard/AddToPlaylistModal";
import Footer from "../../components/Footer";
import DeleteConfirmModal from "../../components/dashboard/DeleteConfirmModal";

// Types
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

type Bucket = "songs" | "covers";

// Helper for uniq
function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export default function UserDashboard() {
  const queryClient = useQueryClient();

  // Use the same auth query as AllSongs for consistency
  const { data: authUser, isLoading: authLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getUser();
      return data.user;
    },
  });

  const me = useMemo(() => {
    if (!authUser) return null;
    return {
      id: authUser.id,
      email: authUser.email ?? null,
      display_name: authUser.user_metadata?.display_name || authUser.user_metadata?.full_name || null,
      avatar_url: authUser.user_metadata?.avatar_url || null,
    };
  }, [authUser]);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !authUser) {
      window.location.href = "/login";
    }
  }, [authUser, authLoading]);

  const [busy, setBusy] = useState(false);
  const [openPlaylistId, setOpenPlaylistId] = useState<number | null>(null);
  const [openPlaylistSongs, setOpenPlaylistSongs] = useState<PlaylistSongRow[] | null>(null);
  const [deleteAlbumDialog, setDeleteAlbumDialog] = useState<{ id: string; name: string; } | null>(null);
  const [virtualPlaylist, setVirtualPlaylist] = useState<{ playlist: any; songs: PlaylistSongRow[] } | null>(null);

  // --- Fetch Playlists ---
  const { data: playlists = [], isLoading: playlistsLoading } = useQuery({
    queryKey: ["user-playlists", me?.id],
    enabled: !!me?.id,
    placeholderData: (prev) => prev,
    queryFn: async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("playlists")
        .select("id,user_id,name,description,is_public,created_at,cover_image_url, playlist_songs ( song_id )")
        .eq("user_id", me!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Playlist[];
    },
  });

  // --- Fetch Liked Songs ---
  const { data: likedSongs = [] } = useQuery({
    queryKey: ["user-liked-songs", me?.id],
    enabled: !!me?.id,
    placeholderData: (prev) => prev,
    queryFn: async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("liked_songs")
        .select("created_at, song:songs(*)")
        .eq("user_id", me!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as any[])?.map((row) => ({
        song: row.song as Song,
        added_at: row.created_at,
        position: null
      })) as PlaylistSongRow[];
    },
  });

  // --- Fetch Albums ---
  const { data: albums = [] } = useQuery({
    queryKey: ["user-albums-full", me?.id],
    enabled: !!me?.id,
    placeholderData: (prev) => prev,
    queryFn: async () => {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from("albums")
        .select(`
          id, 
          user_id, 
          name, 
          description, 
          cover_image_url, 
          artist, 
          album_songs(
            song_id,
            songs(cover_image_url, audio_url, title, artist, id)
          )
        `)
        .eq("user_id", me!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  // Derive Album List with songs
  const albumList = useMemo(() => {
    return albums.map(album => {
      const songs = (album.album_songs || []).map((as: any) => as.songs).filter(Boolean);
      const firstSongCover = songs[0]?.cover_image_url;

      return {
        id: album.id,
        name: album.name,
        cover: album.cover_image_url || firstSongCover,
        artist: album.artist || songs[0]?.artist || "Unknown",
        songCount: album.album_songs?.length || 0,
        songs: songs
      };
    });
  }, [albums]);


  // Add to Playlist Modal State
  const [addToPlaylistModal, setAddToPlaylistModal] = useState<{
    isOpen: boolean;
    song: Song | null;
  }>({ isOpen: false, song: null });

  const [searchQuery, setSearchQuery] = useState("");
  const [_currentPage, setCurrentPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const player = useContext(PlayerContext);

  // --- History Management for Modals ---
  // Close modals on browser "Back" button
  useEffect(() => {
    const handlePopState = () => {
      // If any modal is open, close it and prevent navigation
      if (openPlaylistId || virtualPlaylist || addToPlaylistModal.isOpen || deleteAlbumDialog) {
        setOpenPlaylistId(null);
        setVirtualPlaylist(null);
        setAddToPlaylistModal({ isOpen: false, song: null });
        setDeleteAlbumDialog(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [openPlaylistId, virtualPlaylist, addToPlaylistModal.isOpen, deleteAlbumDialog]);

  // Push state when any modal opens
  useEffect(() => {
    if (openPlaylistId || virtualPlaylist || addToPlaylistModal.isOpen || deleteAlbumDialog) {
      window.history.pushState({ modal: true }, "");
    }
  }, [openPlaylistId, virtualPlaylist, addToPlaylistModal.isOpen, deleteAlbumDialog]);

  const displayName = useMemo(() => {
    if (!me) return "You";
    return me.display_name?.trim() || me.email?.split("@")[0] || "You";
  }, [me]);

  async function uploadTo(bucket: Bucket, file: File, prefix?: string) {
    const supabase = getSupabaseClient();
    const ext = file.name.split(".").pop() || "bin";
    const path = `${prefix ?? ""}/${crypto.randomUUID()}.${ext}`;
    await supabase.storage.from(bucket).upload(path, file);
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }

  async function handleAddSong(data: {
    title: string;
    artist: string;
    audioFile: File;
    coverFile: File;
  }) {
    setBusy(true);
    try {
      const audio_url = await uploadTo("songs", data.audioFile);
      const cover_image_url = await uploadTo("covers", data.coverFile, "songs");
      await getSupabaseClient().from("songs").insert({
        title: data.title,
        artist: data.artist,
        audio_url,
        cover_image_url,
      });
      // Invalidate both lists
      queryClient.invalidateQueries({ queryKey: ["allSongs"] });
    } finally {
      setBusy(false);
    }
  }

  const createPlaylistMutation = useMutation({
    mutationFn: async ({ name, description }: { name: string; description?: string }) => {
      if (!me) throw new Error("Not logged in");
      const { data, error } = await getSupabaseClient()
        .from("playlists")
        .insert({
          user_id: me.id,
          name: name.trim(),
          description: description?.trim() || null,
          cover_image_url: null,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-playlists", me?.id] });
      toast.success("Playlist created");
    },
    onError: (e: any) => {
      toast.error(e.message || "Failed to create playlist");
    }
  });

  async function handleCreatePlaylist(name: string, description?: string) {
    if (!me) return;
    try {
      const data = await createPlaylistMutation.mutateAsync({ name, description });
      return data?.id;
    } catch {
      return null;
    }
  }

  // Opening actual playlists
  async function openPlaylist(playlistId: number) {
    setOpenPlaylistId(playlistId);
    setOpenPlaylistSongs(null);
    setVirtualPlaylist(null); // Close virtual if open
    const { data } = await getSupabaseClient()
      .from("playlist_songs")
      .select("added_at, position, song:songs(*)")
      .eq("playlist_id", playlistId)
      .order("position", { ascending: true });

    setOpenPlaylistSongs(
      (data ?? []).map((r: any) => ({
        added_at: r.added_at,
        position: r.position,
        song: Array.isArray(r.song) ? r.song[0] : r.song,
      }))
    );
  }

  // Open Liked Songs Modal
  function openLikedSongsModal() {
    setOpenPlaylistId(null);
    setVirtualPlaylist({
      playlist: {
        id: -1,
        name: "Liked Songs",
        description: "Songs you have liked",
        cover_image_url: null, // Will be dynamic based on current song
      },
      songs: likedSongs
    });
  }

  // Open Album Modal
  async function openAlbumModal(albumId: string) {
    const album = albums.find(a => a.id === albumId);
    if (!album) return;

    // Fetch songs in this album
    const { data } = await getSupabaseClient()
      .from("album_songs")
      .select("added_at, position, song:songs(*)")
      .eq("album_id", albumId)
      .order("position", { ascending: true });

    setOpenPlaylistId(null);
    setVirtualPlaylist({
      playlist: {
        id: albumId,
        name: album.name,
        description: `Album by ${album.artist || 'Unknown'}`,
        cover_image_url: album.cover_image_url,
      },
      songs: (data ?? []).map((r: any) => ({
        added_at: r.added_at,
        position: r.position,
        song: Array.isArray(r.song) ? r.song[0] : r.song,
      }))
    });
  }


  async function removeSongFromPlaylist(playlistId: number, songId: number) {
    const supabase = getSupabaseClient();

    // 1. Check if the song being removed is the one currently playing
    const isPlayingDeleted = player?.currentMusic?.id === songId;

    // 2. Delete the song
    await supabase
      .from("playlist_songs")
      .delete()
      .match({ playlist_id: playlistId, song_id: songId });

    // 3. Fetch updated list to play next song if needed
    const { data } = await supabase
      .from("playlist_songs")
      .select("added_at, position, song:songs(*)")
      .eq("playlist_id", playlistId)
      .order("position", { ascending: true });

    const updatedSongs = (data ?? []).map((r: any) => ({
      added_at: r.added_at,
      position: r.position,
      song: Array.isArray(r.song) ? r.song[0] : r.song,
    }));

    setOpenPlaylistSongs(updatedSongs);

    // 4. Update the playlist's cover_image_url in the database to match the new first song (sync like albums/liked songs)
    const nextCover = updatedSongs.length
      ? updatedSongs[0].song.cover_image_url || (updatedSongs[0].song as any).cover
      : null;

    await supabase
      .from("playlists")
      .update({ cover_image_url: nextCover })
      .eq("id", playlistId);

    queryClient.invalidateQueries({ queryKey: ["user-playlists", me?.id] });

    // 5. If the deleted song was playing, start playing the new first song from updated list
    if (isPlayingDeleted && updatedSongs.length > 0) {
      player?.playNow(updatedSongs[0].song, updatedSongs.map(s => s.song));
    }
  }

  async function unlikeSong(songId: number) {
    if (!me) return;
    const supabase = getSupabaseClient();
    const isPlayingDeleted = player?.currentMusic?.id === songId;

    await supabase.from("liked_songs").delete().match({ user_id: me.id, song_id: songId });
    queryClient.invalidateQueries({ queryKey: ["user-liked-songs", me.id] });
    queryClient.invalidateQueries({ queryKey: ["user-liked-song-ids", me.id] });

    let updatedLiked: PlaylistSongRow[] = [];
    setVirtualPlaylist(prev => {
      if (!prev) return null;
      updatedLiked = prev.songs.filter(s => s.song.id !== (songId as unknown as number));
      const nextCover = updatedLiked.length > 0
        ? updatedLiked[0].song.cover_image_url || (updatedLiked[0].song as any).cover
        : null;

      return {
        ...prev,
        playlist: { ...prev.playlist, cover_image_url: nextCover },
        songs: updatedLiked
      }
    });

    if (isPlayingDeleted && updatedLiked.length > 0) {
      player?.playNow(updatedLiked[0].song, updatedLiked.map(s => s.song));
    }

    toast.success("Removed from Liked Songs");
  }

  async function removeSongFromAlbum(songId: number) {
    if (!virtualPlaylist || typeof virtualPlaylist.playlist.id !== 'string') return;
    const albumId = virtualPlaylist.playlist.id;
    const supabase = getSupabaseClient();
    const isPlayingDeleted = player?.currentMusic?.id === songId;

    // 1. Delete the song from album_songs
    await supabase
      .from("album_songs")
      .delete()
      .match({ album_id: albumId, song_id: songId });

    // 2. Fetch remaining songs for this album to find the next cover
    const { data: remainingSongs } = await supabase
      .from("album_songs")
      .select("added_at, position, song:songs(*)")
      .eq("album_id", albumId)
      .order("position", { ascending: true });

    const updatedAlbumSongs = (remainingSongs ?? []).map((r: any) => ({
      added_at: r.added_at,
      position: r.position,
      song: Array.isArray(r.song) ? r.song[0] : r.song,
    }));

    // 3. Determine the new cover image
    const nextCover = updatedAlbumSongs.length
      ? updatedAlbumSongs[0].song.cover_image_url || (updatedAlbumSongs[0].song as any).cover
      : null;

    // 4. Update the album's cover_image_url in the database
    await supabase
      .from("albums")
      .update({ cover_image_url: nextCover })
      .eq("id", albumId);

    // 5. Invalidate and update UI
    queryClient.invalidateQueries({ queryKey: ["user-albums", me?.id] });
    queryClient.invalidateQueries({ queryKey: ["user-albums-full", me?.id] });

    setVirtualPlaylist(prev => {
      if (!prev) return null;
      return {
        ...prev,
        playlist: { ...prev.playlist, cover_image_url: nextCover },
        songs: updatedAlbumSongs
      }
    });

    if (isPlayingDeleted && updatedAlbumSongs.length > 0) {
      player?.playNow(updatedAlbumSongs[0].song, updatedAlbumSongs.map(s => s.song));
    }

    toast.success("Removed from album");
  }

  async function deletePlaylist(playlistId: number) {
    const supabase = getSupabaseClient();
    await supabase.from("playlists").delete().eq("id", playlistId);

    // Fix: Using the correct query key from the fetch query (line 84)
    queryClient.invalidateQueries({ queryKey: ["user-playlists", me?.id] });

    if (openPlaylistId === playlistId) {
      setOpenPlaylistId(null);
      setOpenPlaylistSongs(null);
    }
  }

  function openDeleteAlbumModal(albumId: string, albumName: string) {
    setDeleteAlbumDialog({ id: albumId, name: albumName });
  }

  async function handleConfirmDeleteAlbum() {
    if (!deleteAlbumDialog) return;
    const { id, name } = deleteAlbumDialog;

    await getSupabaseClient().from("albums").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["user-albums", me?.id] });
    queryClient.invalidateQueries({ queryKey: ["user-albums-full", me?.id] });

    // Close modal if it's open for this album
    if (virtualPlaylist && virtualPlaylist.playlist.id === id) {
      setVirtualPlaylist(null);
    }

    setDeleteAlbumDialog(null);
    toast.success(`Album "${name}" deleted`);
  }

  async function deleteAlbum(albumId: string) {
    const album = albumList.find(a => a.id === albumId);
    if (!album) return;
    openDeleteAlbumModal(albumId, album.name);
  }

  function playFromModal(song: Song) {
    if (!player) return;
    const list = openPlaylistSongs ?? virtualPlaylist?.songs ?? [];
    const queue = list.map((r) => r.song);
    player.playNow(song, queue);
  }

  async function handleLogout() {
    await getSupabaseClient().auth.signOut();
    window.location.href = "/";
  }

  function openAddToPlaylistModal(song: Song) {
    setAddToPlaylistModal({ isOpen: true, song });
  }

  function closeAddToPlaylistModal() {
    setAddToPlaylistModal({ isOpen: false, song: null });
  }

  async function handleAddToPlaylist(playlistId: number) {
    if (!addToPlaylistModal.song) return;
    const p = playlists.find(pl => pl.id === playlistId);
    const songCover = addToPlaylistModal.song.cover_image_url || (addToPlaylistModal.song as any).cover;

    const { error } = await getSupabaseClient().from("playlist_songs").insert({
      playlist_id: playlistId,
      song_id: addToPlaylistModal.song.id,
    });

    if (error) {
      toast.error("Could not add to playlist");
    } else {
      // Sync cover if not set
      if (p && !p.cover_image_url && songCover) {
        await getSupabaseClient()
          .from("playlists")
          .update({ cover_image_url: songCover })
          .eq("id", playlistId);
      }

      toast.success("Added to playlist");
      queryClient.invalidateQueries({ queryKey: ["user-playlists", me?.id] });
      closeAddToPlaylistModal();
    }
  }

  async function handleCreateAndAddToPlaylist(name: string) {
    if (!addToPlaylistModal.song) return;
    const songCover = addToPlaylistModal.song.cover_image_url || (addToPlaylistModal.song as any).cover;

    const playlistId = await handleCreatePlaylist(name);
    if (playlistId) {
      // Add song
      await getSupabaseClient().from("playlist_songs").insert({
        playlist_id: playlistId,
        song_id: addToPlaylistModal.song.id,
      });

      // Set cover
      if (songCover) {
        await getSupabaseClient()
          .from("playlists")
          .update({ cover_image_url: songCover })
          .eq("id", playlistId);
      }
    }
    closeAddToPlaylistModal();
  }

  if (authLoading || playlistsLoading) {
    return (
      <main className="min-h-screen grid place-items-center bg-black text-white">
        <div className="h-12 w-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  const currentPlaylist =
    openPlaylistId !== null
      ? playlists.find((p) => p.id === openPlaylistId) ?? null
      : null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setCurrentPage={setCurrentPage}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        mobileSearchOpen={mobileSearchOpen}
        setMobileSearchOpen={setMobileSearchOpen}
        authUser={{
          email: me?.email,
          user_metadata: {
            display_name: me?.display_name,
            avatar_url: me?.avatar_url,
          },
        }}
        handleLogout={handleLogout}
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 w-full">
        <ProfileSection
          displayName={displayName}
          email={me?.email ?? null}
          avatarUrl={me?.avatar_url ?? null}
        />

        {/* --- Playlists Section --- */}
        <section id="playlists" className="scroll-mt-24 mb-10 lg:mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl mt-2 lg:mt-8 font-bold text-white">Your Playlists</h2>
            <button
              type="button"
              onClick={() => openAddToPlaylistModal({ id: 0, title: "Sample Song", artist: "Artist" } as Song)}
              className="flex mt-2 lg:mt-8 items-center justify-center gap-2 h-11 px-5 rounded-xl hover:scale-105 bg-white/5 text-white font-bold transition-all active:scale-95 w-full sm:w-auto border border-white/10 hover:border-cyan-500/50"
            >
              <Plus className="h-5 w-5 text-cyan-400" />
              <span>Create Playlist</span>
            </button>
          </div>
          <PlaylistGrid
            playlists={playlists}
            onOpen={openPlaylist}
            onDelete={deletePlaylist}
          />
        </section>

        {/* --- Liked Songs Section --- */}
        <section id="liked" className="scroll-mt-24 mb-10 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent flex items-center gap-3">
            <Heart className="w-8 h-8 text-cyan-500 fill-cyan-500/20 stroke-[2.5]" /> Liked Songs
          </h2>
          {likedSongs.length === 0 ? (
            <p className="text-zinc-500">No liked songs yet.</p>
          ) : (
            <div
              onClick={openLikedSongsModal}
              className="group relative h-50 w-42 lg:h-64 lg:w-60 rounded-2xl overflow-hidden cursor-pointer bg-gradient-to-br from-cyan-900/20 to-zinc-900/20 border border-white/5 hover:border-cyan-500/50 transition-all shadow-xl shadow-black/40"
            >
              {likedSongs[0]?.song?.cover_image_url || (likedSongs[0]?.song as any)?.cover ? (
                <img src={likedSongs[0].song.cover_image_url || (likedSongs[0].song as any).cover} alt="Liked" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-40" />
              ) : (
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                  <Heart className="w-16 h-16 text-zinc-800" />
                </div>
              )}

              {/* Hover Overlay with Icons */}
              <div
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm z-10"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openLikedSongsModal();
                    if (likedSongs.length > 0) {
                      playFromModal(likedSongs[0].song);
                    }
                  }}
                  className="h-12 w-12 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 hover:border-cyan-400 flex items-center justify-center transition-all hover:scale-110 shadow-lg shadow-cyan-500/10"
                  title="Play Liked Songs"
                >
                  <Play className="w-5 h-5 text-cyan-400 fill-cyan-400/20 ml-0.5" />
                </button>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 z-[5]">
                <div className="flex flex-col">
                  <div className="h-1 w-8 bg-cyan-500 rounded-full mb-3 opacity-0 group-hover:opacity-100 transition-all group-hover:w-12" />
                  <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors tracking-tight">Liked Songs</h3>
                  <p className="text-zinc-400 font-medium text-sm">{likedSongs.length} songs</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* --- Albums Section --- */}
        <section id="albums" className="scroll-mt-24">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">Albums</h2>
          {albumList.length === 0 ? (
            <p className="text-zinc-500">No albums found in your library.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {albumList.map((album) => (
                <div
                  key={album.id}
                  className="relative group cursor-pointer"
                  onClick={() => openAlbumModal(album.id)}
                >
                  <div className="aspect-square relative overflow-hidden rounded-2xl mb-4 bg-zinc-900 shadow-xl border border-white/5 group-hover:border-cyan-500/50 transition-colors">
                    {album.cover ? (
                      <img src={album.cover} alt={album.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-cyan-900/40 to-cyan-600/50 flex items-center justify-center">
                        <Disc className="w-12 h-12 text-cyan-500/30" strokeWidth={3} />
                      </div>
                    )}

                    {/* Hover Overlay with Icons */}
                    <div
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openAlbumModal(album.id);
                          if (album.songs && album.songs.length > 0) {
                            playFromModal(album.songs[0]);
                          }
                        }}
                        className="h-12 w-12 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 hover:border-cyan-400 flex items-center justify-center transition-all hover:scale-110"
                        title="Play Album"
                      >
                        <Play className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAlbum(album.id);
                        }}
                        className="h-12 w-12 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 hover:border-cyan-400 flex items-center justify-center transition-all hover:scale-110"
                        title="Delete Album"
                      >
                        <Trash2 className="w-5 h-5 text-cyan-400" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-bold text-white truncate px-1 group-hover:text-cyan-400 transition-colors">{album.name}</h3>
                  <p className="text-sm text-zinc-400 truncate px-1">{album.artist} • {album.songCount} songs</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* --- Upload Form --- */}
        <section id="upload" className="pt-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">Upload Music</h2>
          <UploadSongForm onSubmit={handleAddSong} busy={busy} />
        </section>

      </main>

      <Footer />

      {/* Playlist Modal (Real Playlists) */}
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

      {/* Virtual Playlist Modal (Liked / Albums) */}
      {virtualPlaylist && (
        <PlaylistModal
          playlist={virtualPlaylist.playlist}
          songs={virtualPlaylist.songs}
          onClose={() => setVirtualPlaylist(null)}
          onPlay={playFromModal}
          onRemove={
            virtualPlaylist.playlist.id === -1
              ? unlikeSong
              : typeof virtualPlaylist.playlist.id === "string"
                ? removeSongFromAlbum
                : undefined
          }
        />
      )}

      {addToPlaylistModal.isOpen && addToPlaylistModal.song && (
        <AddToPlaylistModal
          isOpen={addToPlaylistModal.isOpen}
          songTitle={addToPlaylistModal.song.title}
          songArtist={addToPlaylistModal.song.artist}
          playlists={playlists}
          onClose={closeAddToPlaylistModal}
          onAddToPlaylist={handleAddToPlaylist}
          onCreateAndAdd={handleCreateAndAddToPlaylist}
        />
      )}

      <DeleteConfirmModal
        isOpen={!!deleteAlbumDialog}
        title="Delete Album?"
        itemName={deleteAlbumDialog?.name || ""}
        onConfirm={handleConfirmDeleteAlbum}
        onCancel={() => setDeleteAlbumDialog(null)}
      />
    </div>
  );
}