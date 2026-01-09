"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Lock } from "lucide-react";
import getSupabaseClient from "../../api/SupabaseClient";
import type { Song } from "../../types/song";
import { PlayerContext } from "../../layouts/FrontendLayout";
import toast, { Toaster } from "react-hot-toast";
import Header from "./Header";
import LeftSidebar from "./LeftSidebar";
import SongCard from "./SongCard";
import NowPlayingSidebar from "./NowPlayingSidebar";
import AddToPlaylistModal from "./AddToPlaylistModal";
import Pagination from "./Pagination";

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

type Filter = { type: "artist"; value: string } | { type: "album"; value: string } | null;
type Playlist = { id: number; name: string; description?: string | null };
type LikedRow = { song_id: number };

export default function AllSongs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<"title_asc" | "title_desc" | "artist_asc" | "artist_desc">("title_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<Filter>(null);
  const [pickerForSong, setPickerForSong] = useState<Song | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [allowAutoplay, setAllowAutoplay] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setAllowAutoplay(!mq.matches);
    handler();
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getUser();
      return data.user;
    },
  });

  const handleLogout = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    if (typeof window !== "undefined") window.location.reload();
  };

  const songsPerPage = 10;

  const getAllSongs = async () => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from("songs").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data as Song[];
  };

  const { data: songs, isPending, isError, error } = useQuery({ queryKey: ["allSongs"], queryFn: getAllSongs });

  const { data: playlists, isLoading: playlistsLoading } = useQuery({
    queryKey: ["myPlaylists", authUser?.id],
    enabled: !!authUser?.id,
    queryFn: async () => {
      const supabase = getSupabaseClient();
      const { data, error: qErr } = await supabase
        .from("playlists")
        .select("id,name,description")
        .eq("user_id", authUser!.id)
        .order("created_at", { ascending: false });
      if (qErr) throw qErr;
      return (data ?? []) as Playlist[];
    },
  });

  const { data: likedRows, isLoading: likedLoading } = useQuery({
    queryKey: ["likedSongIds", authUser?.id],
    enabled: !!authUser?.id,
    queryFn: async () => {
      const supabase = getSupabaseClient();
      const { data, error: qErr } = await supabase.from("liked_songs").select("song_id").eq("user_id", authUser!.id);
      if (qErr) throw qErr;
      return (data ?? []) as LikedRow[];
    },
  });

  const likedSet = useMemo(() => new Set((likedRows ?? []).map((r) => r.song_id)), [likedRows]);

  const queryClient = useQueryClient();

  const createPlaylist = useMutation({
    mutationFn: async (name: string) => {
      if (!authUser) throw new Error("Please log in to create a playlist.");
      const supabase = getSupabaseClient();
      const { data, error: mErr } = await supabase
        .from("playlists")
        .insert({ user_id: authUser.id, name: name.trim(), description: null, is_public: false })
        .select("id,name")
        .single();
      if (mErr) throw mErr;
      return data as Playlist;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myPlaylists", authUser?.id] });
      toast.success("Playlist created.");
    },
    onError: (e: unknown) => {
      const msg = e instanceof Error ? e.message : "Couldn't create playlist";
      toast.error(msg);
    },
  });

  const addToPlaylist = useMutation({
    mutationFn: async ({ playlist_id, song_id }: { playlist_id: number; song_id: number }) => {
      const supabase = getSupabaseClient();
      const { error: mErr } = await supabase.from("playlist_songs").insert({ playlist_id, song_id });
      if (mErr) {
        const lower = String(mErr.message).toLowerCase();
        if (lower.includes("duplicate")) throw new Error("This song is already in that playlist.");
        throw mErr;
      }
    },
    onSuccess: () => {
      toast.success("Added to playlist");
      setPickerForSong(null);
    },
    onError: (e: unknown) => {
      const msg = e instanceof Error ? e.message : "Couldn't add to playlist";
      toast.error(msg);
    },
  });

  const toggleLike = useMutation({
    mutationFn: async (song: Song) => {
      if (!authUser) throw new Error("Please log in to like songs.");
      const isLiked = likedSet.has(song.id as unknown as number);
      const supabase = getSupabaseClient();
      if (isLiked) {
        const { error: mErr } = await supabase.from("liked_songs").delete().match({ user_id: authUser.id, song_id: song.id });
        if (mErr) throw mErr;
        return { liked: false as const, id: song.id as unknown as number };
      } else {
        const { error: mErr } = await supabase.from("liked_songs").insert({ user_id: authUser.id, song_id: song.id });
        if (mErr) {
          const lower = String(mErr.message).toLowerCase();
          if (lower.includes("duplicate")) return { liked: true as const, id: song.id as unknown as number };
          throw mErr;
        }
        return { liked: true as const, id: song.id as unknown as number };
      }
    },
    onMutate: async (song: Song) => {
      await queryClient.cancelQueries({ queryKey: ["likedSongIds", authUser?.id] });
      const prev = queryClient.getQueryData<LikedRow[]>(["likedSongIds", authUser?.id]) || [];
      const isAlready = prev.some((r) => r.song_id === (song.id as unknown as number));
      const next = isAlready ? prev.filter((r) => r.song_id !== (song.id as unknown as number)) : [...prev, { song_id: song.id as unknown as number }];
      queryClient.setQueryData(["likedSongIds", authUser?.id], next);
      return { prev };
    },
    onError: (_e: unknown, _song: Song, ctx?: { prev?: LikedRow[] }) => {
      if (ctx?.prev) queryClient.setQueryData(["likedSongIds", authUser?.id], ctx.prev);
      toast.error("Couldn't update like");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["likedSongIds", authUser?.id] });
    },
    onSuccess: (res: { liked: boolean; id: number }) => {
      toast.success(res.liked ? "Added to Liked Songs" : "Removed from Liked Songs");
    },
  });

  const player = useContext(PlayerContext);

  const filteredAndSortedSongs = useMemo(() => {
    if (!songs) return [];
    const q = searchQuery.trim().toLowerCase();
    const filtered = songs.filter((s) => {
      const matchesSearch = q.length ? s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q) : true;
      const matchesFilter = activeFilter ? (activeFilter.type === "artist" ? s.artist === activeFilter.value : s.album === activeFilter.value) : true;
      return matchesSearch && matchesFilter;
    });
    const sorted = filtered.sort((a, b) => {
      if (sortOption === "title_asc") return a.title.localeCompare(b.title);
      if (sortOption === "title_desc") return b.title.localeCompare(a.title);
      if (sortOption === "artist_asc") return a.artist.localeCompare(b.artist);
      if (sortOption === "artist_desc") return b.artist.localeCompare(a.artist);
      return 0;
    });
    return sorted;
  }, [songs, searchQuery, sortOption, activeFilter]);

  const totalPages = Math.ceil(filteredAndSortedSongs.length / songsPerPage);
  const startIndex = (currentPage - 1) * songsPerPage;
  const currentSongs = filteredAndSortedSongs.slice(startIndex, startIndex + songsPerPage);

  const artists = useMemo(() => (songs ? uniq(songs.map((s) => s.artist)) : []), [songs]);
  const albums = useMemo(() => (songs ? uniq(songs.map((s) => s.album).filter(Boolean) as string[]) : []), [songs]);

  const playSong = (song: Song) => {
    if (!player) return;
    player.playNow(song, filteredAndSortedSongs);
    try {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch { }
  };

  const openPicker = (song: Song) => {
    if (!authUser) {
      toast("Please log in to use playlists", {
        icon: <Lock className="w-4 h-4" />
      });
      return;
    }
    setPickerForSong(song);
  };

  const handleToggleLike = (song: Song) => {
    if (authUser) {
      toggleLike.mutate(song);
    } else {
      toast("Please log in to like songs", {
        icon: <Lock className="w-4 h-4" />
      });
    }
  };

  const handleCreateAndAdd = async () => {
    const name = newPlaylistName.trim();
    if (!name) {
      toast.error("Give your playlist a name");
      return;
    }
    try {
      const p = await createPlaylist.mutateAsync(name);
      if (pickerForSong) {
        await addToPlaylist.mutateAsync({ playlist_id: p.id, song_id: pickerForSong.id as unknown as number });
      }
      setNewPlaylistName("");
    } catch { }
  };

  const getVideoUrl = (s: Song | null): string | null => {
    if (!s) return null;
    const rec = s as unknown as Record<string, unknown>;
    const v = rec["video_url"];
    return typeof v === "string" && v.length > 0 ? v : null;
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 p-4 lg:p-6">
        <div className="h-10 w-56 bg-zinc-900/50 rounded-lg mb-6 animate-pulse" />
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_380px]">
          <div className="h-[70vh] bg-zinc-900/30 rounded-2xl animate-pulse backdrop-blur-xl" />
          <div className="h-[70vh] bg-zinc-900/30 rounded-2xl animate-pulse backdrop-blur-xl" />
          <div className="h-[70vh] bg-zinc-900/30 rounded-2xl animate-pulse backdrop-blur-xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-900 p-6 grid place-items-center">
        <div className="text-center space-y-4 p-8 rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-white text-2xl font-bold">Something went wrong</h2>
          <p className="text-zinc-400">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  const isPlayingSomething = Boolean(player?.currentMusic);
  const previewSong = player?.currentMusic ?? null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-black text-white">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "rgba(24, 24, 27, 0.95)",
            color: "#fff",
            border: "1px solid rgba(39, 39, 42, 0.5)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)"
          },
          duration: 3000,
        }}
      />

      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setCurrentPage={setCurrentPage}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        mobileSearchOpen={mobileSearchOpen}
        setMobileSearchOpen={setMobileSearchOpen}
        authUser={authUser ?? null}
        handleLogout={handleLogout}
      />

      <div className="mx-auto max-w-[1920px] p-4 lg:p-8 pt-6">
        {activeFilter && (
          <div className="mb-6">
            <button
              onClick={() => {
                setActiveFilter(null);
                setCurrentPage(1);
              }}
              className="inline-flex items-center gap-2 text-sm px-4 h-9 rounded-lg bg-zinc-900/50 backdrop-blur-xl border border-cyan-500/30 hover:bg-zinc-800/50 hover:border-cyan-500/50 transition-colors duration-200 group"
            >
              <span className="text-zinc-400">{activeFilter.type === "artist" ? "Artist" : "Album"}:</span>
              <span className="font-medium text-cyan-400">{activeFilter.value}</span>
              <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors">✕</span>
            </button>
          </div>
        )}

        <div className={`grid gap-6 ${isPlayingSomething
          ? "grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_400px]"
          : "grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]"
          }`}>
          <LeftSidebar
            sortOption={sortOption}
            setSortOption={setSortOption}
            albums={albums}
            artists={artists}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            setCurrentPage={setCurrentPage}
          />

          <main className="min-w-0">
            <section className="mb-10">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-100 to-zinc-400 bg-clip-text text-transparent">
                  Recently played
                </h2>
              </div>
              <div className="flex overflow-x-auto pb-3 gap-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent hover:scrollbar-thumb-zinc-700 [&>*]:shrink-0">
                {filteredAndSortedSongs.slice(0, 10).map((song) => {
                  const isLiked = !!authUser && likedSet.has(song.id as unknown as number);
                  return (
                    <div key={`recent-${song.id}`}>
                      <SongCard
                        song={song}
                        isLiked={isLiked}
                        onPlay={playSong}
                        onAddToPlaylist={openPicker}
                        onToggleLike={handleToggleLike}
                        likedLoading={likedLoading}
                        toggleLikePending={toggleLike.isPending}
                        variant="recent"
                      />
                    </div>
                  );
                })}
                {filteredAndSortedSongs.length === 0 && (
                  <div className="text-zinc-500 py-8 px-4">No songs found.</div>
                )}
              </div>
            </section>

            <section className="pb-32">
              <h3 className="text-xl font-bold mb-5 bg-gradient-to-r from-white via-cyan-100 to-zinc-400 bg-clip-text text-transparent">
                All songs
              </h3>
              <div className={`grid gap-5 items-stretch ${isPlayingSomething
                ? "grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3"
                : "grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5"
                }`}>
                {currentSongs.map((song) => {
                  const isLiked = !!authUser && likedSet.has(song.id as unknown as number);
                  return (
                    <div key={song.id}>
                      <SongCard
                        song={song}
                        isLiked={isLiked}
                        onPlay={playSong}
                        onAddToPlaylist={openPicker}
                        onToggleLike={handleToggleLike}
                        likedLoading={likedLoading}
                        toggleLikePending={toggleLike.isPending}
                      />
                    </div>
                  );
                })}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
            </section>
          </main>

          {isPlayingSomething && (
            <NowPlayingSidebar
              isPlayingSomething={isPlayingSomething}
              previewSong={previewSong}
              allowAutoplay={allowAutoplay}
              playSong={playSong}
              getVideoUrl={getVideoUrl}
            />
          )}
        </div>
      </div>

      <AddToPlaylistModal
        pickerForSong={pickerForSong}
        setPickerForSong={setPickerForSong}
        authUser={authUser ?? null}
        playlists={playlists}
        playlistsLoading={playlistsLoading}
        newPlaylistName={newPlaylistName}
        setNewPlaylistName={setNewPlaylistName}
        onAddToPlaylist={(playlistId, songId) => addToPlaylist.mutate({ playlist_id: playlistId, song_id: songId })}
        handleCreateAndAdd={handleCreateAndAdd}
        createPlaylistPending={createPlaylist.isPending}
        addToPlaylistPending={addToPlaylist.isPending}
      />

      <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar {
          height: 8px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgb(39, 39, 42);
          border-radius: 4px;
        }

        .scrollbar-thin:hover::-webkit-scrollbar-thumb {
          background: rgb(63, 63, 70);
        }

        @media (max-width: 480px) {
          .xs\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
}