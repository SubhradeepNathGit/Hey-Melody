"use client";

import Image from "next/image";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import type { Song } from "../types/song";

type SongCardProps = {
  song: Song;
  isLiked: boolean;
  onPlay: (song: Song) => void;
  onAddToPlaylist: (song: Song) => void;
  onToggleLike: (song: Song) => void;
  likedLoading: boolean;
  toggleLikePending: boolean;
  variant?: "recent" | "grid";
};

export default function SongCard({
  song,
  isLiked,
  onPlay,
  onAddToPlaylist,
  onToggleLike,
  likedLoading,
  toggleLikePending,
  variant = "grid",
}: SongCardProps) {
  const handleCardKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onPlay(song);
    }
  };

  /* ============================
     RECENTLY PLAYED CARD
  ============================ */
  if (variant === "recent") {
    return (
      <div
        onClick={() => onPlay(song)}
        onKeyDown={handleCardKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`Play ${song.title}`}
        className="
          snap-start shrink-0 group relative
          w-[78vw]
          sm:w-[200px]
          lg:w-[260px]
          bg-zinc-950 border border-zinc-900
          rounded-2xl p-3 text-left
          hover:bg-zinc-900 hover:border-cyan-500/20
          transition-all cursor-pointer
          outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50
          shadow-xl
        "
      >
        {/* Play Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlay(song);
          }}
          className="
            hidden sm:grid
            w-12 h-12 rounded-full place-items-center
            absolute bottom-24 right-4
            opacity-0 group-hover:opacity-100
            translate-y-2 group-hover:translate-y-0
            transition-all duration-300
            backdrop-blur-sm
            bg-white/20
            border border-cyan-500
            z-10
          "
          aria-label={`Play ${song.title}`}
          title="Play"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00e5ff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]"
          >
            <polygon points="7,5 19,12 7,19" />
          </svg>
        </button>

        {/* Add to Playlist */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToPlaylist(song);
          }}
          className="
            absolute right-3 top-3
            h-8 px-3 rounded-lg text-xs font-medium
            bg-zinc-900/80 border border-zinc-800
            hover:bg-zinc-800 hover:border-cyan-500/30
            backdrop-blur-sm z-10 transition-all
          "
        >
          + Playlist
        </button>

        {/* Like Button */}
        <button
  onClick={(e) => {
    e.stopPropagation();
    onToggleLike(song);
  }}
  disabled={likedLoading || toggleLikePending}
  className="
    absolute top-3 left-3
    h-9 w-9 rounded-lg
    grid place-items-center
    bg-zinc-900/80 border border-zinc-800
    hover:bg-zinc-800 hover:border-cyan-500/30
    backdrop-blur-sm z-10 transition-all
  "
  aria-label={isLiked ? "Unlike" : "Like"}
  title={isLiked ? "Unlike" : "Like"}
>
  {isLiked ? (
    <IoMdHeart className="text-cyan-400 text-lg" />
  ) : (
    <IoMdHeartEmpty className="text-zinc-400 text-lg" />
  )}
</button>

        {/* Album Art */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl pointer-events-none shadow-lg">
          <Image
            src={song.cover_image_url}
            alt={`${song.title} cover`}
            fill
            sizes="(max-width: 640px) 78vw, (max-width: 1024px) 260px, 320px"
            className="object-cover"
          />
        </div>

        {/* Song Info */}
        <p className="mt-4 text-sm font-semibold line-clamp-1">{song.title}</p>
        <p className="text-xs text-zinc-400 line-clamp-1 mt-1">{song.artist}</p>
      </div>
    );
  }

  /* ============================
     GRID CARD (UNCHANGED)
  ============================ */
  return (
    <div
      onClick={() => onPlay(song)}
      onKeyDown={handleCardKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Play ${song.title}`}
      title={`Play ${song.title}`}
      className="
        group relative bg-zinc-950 w-50
        border border-zinc-900 p-3 rounded-2xl
        hover:bg-zinc-900 hover:border-cyan-500/20
        transition-all flex flex-col text-left
        h-full cursor-pointer outline-none
        focus-visible:ring-2 focus-visible:ring-cyan-500/50
        shadow-xl
      "
    >
      {/* Play Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPlay(song);
        }}
        className="
          hidden sm:grid
          w-10 h-10 rounded-full place-items-center
          absolute bottom-24 right-2
          opacity-0 group-hover:opacity-100
          translate-y-2 group-hover:translate-y-0
          transition-all duration-300
          backdrop-blur-sm bg-white/20
          border border-cyan-500 z-10
        "
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00e5ff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]"
        >
          <polygon points="7,5 19,12 7,19" />
        </svg>
      </button>

      {/* Add to Playlist */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddToPlaylist(song);
        }}
        className="
          absolute right-3 top-3
          h-8 px-3 rounded-lg text-xs font-medium
          bg-zinc-900/80 border border-zinc-800
          hover:bg-zinc-800 hover:border-cyan-500/30
          backdrop-blur-sm transition-all
        "
      >
        + Playlist
      </button>

      {/* Like Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleLike(song);
        }}
        disabled={likedLoading || toggleLikePending}
        className="
          absolute left-3 top-3
          h-9 w-9 rounded-lg grid place-items-center
          bg-zinc-900/80 border border-zinc-800
          hover:bg-zinc-800 hover:border-cyan-500/30
          backdrop-blur-sm transition-all
        "
      >
        {isLiked ? (
          <IoMdHeart className="text-cyan-400 text-lg" />
        ) : (
          <IoMdHeartEmpty className="text-zinc-400 text-lg" />
        )}
      </button>

      {/* Album Art */}
      <div className="aspect-square w-full overflow-hidden rounded-xl pointer-events-none shadow-lg">
        <Image
          src={song.cover_image_url}
          alt={`${song.title} cover`}
          width={500}
          height={500}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Song Info */}
      <div className="mt-4 space-y-1">
        <p className="font-semibold text-sm line-clamp-1">{song.title}</p>
        <p className="text-sm text-zinc-400 line-clamp-1">By {song.artist}</p>
      </div>
    </div>
  );
}
