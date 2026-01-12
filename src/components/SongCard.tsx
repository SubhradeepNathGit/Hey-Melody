"use client";

import Image from "next/image";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import type { Song } from "../../types/song";

type SongCardProps = {
  song: Song;
  isLiked: boolean;
  onPlay: (song: Song) => void;
  onAddToPlaylist: (song: Song) => void;
  onAddToAlbum: (song: Song) => void;
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
  onAddToAlbum,
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
          w-[70vw] 
          sm:w-[180px]
          md:w-[220px]
          lg:w-[260px]
          bg-zinc-950 border border-zinc-900
          rounded-xl sm:rounded-2xl 
          p-2.5 sm:p-3 
          text-left
          hover:bg-zinc-900 hover:border-cyan-500/20
          transition-all cursor-pointer
          outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50
          shadow-xl
        "
      >
        {/* Play Button - Hidden on mobile, visible on larger screens */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlay(song);
          }}
          className="
            hidden md:grid
            w-12 h-12 
            lg:w-14 lg:h-14 
            rounded-full place-items-center
            absolute 
            bottom-20 sm:bottom-22 md:bottom-24 
            right-3 sm:right-4
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
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00e5ff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_8px_rgba(0,229,255,0.7)] lg:w-[27px] lg:h-[27px]"
          >
            <polygon points="7,5 19,12 7,19" />
          </svg>
        </button>

        {/* Action Buttons Container */}
        <div className="absolute right-2 sm:right-3 top-2 sm:top-3 flex flex-col gap-1.5 sm:gap-2 z-10 transition-all">
          {/* Add to Playlist */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToPlaylist(song);
            }}
            className="
                h-7 w-7 
                sm:h-8 sm:w-8 
                rounded-md sm:rounded-lg 
                grid place-items-center
                bg-zinc-900/80 border border-zinc-800
                hover:bg-zinc-800 hover:border-cyan-500/30
                backdrop-blur-sm text-zinc-400 hover:text-white
            "
            aria-label="Add to Playlist"
            title="Add to Playlist"
          >
            <span className="text-xl sm:text-2xl leading-none font-semibold">+</span>
          </button>

          {/* Add to Album */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToAlbum(song);
            }}
            className="
                h-7 w-7 
                sm:h-8 sm:w-8 
                -mt-0.5 sm:-mt-1 
                rounded-md sm:rounded-lg 
                grid place-items-center
                bg-zinc-900/80 border border-zinc-800
                hover:bg-zinc-800 hover:border-cyan-500/30
                backdrop-blur-sm text-zinc-400 hover:text-white
            "
            aria-label="Add to Album"
            title="Add to Album"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="2" /></svg>
          </button>
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(song);
          }}
          disabled={likedLoading || toggleLikePending}
          className="
            absolute top-2 left-2 
            sm:top-3 sm:left-3
            h-8 w-8 
            sm:h-9 sm:w-9 
            rounded-md sm:rounded-lg
            grid place-items-center
            z-10 transition-all
          "
          aria-label={isLiked ? "Unlike" : "Like"}
          title={isLiked ? "Unlike" : "Like"}
        >
          {isLiked ? (
            <IoMdHeart className="text-cyan-400 text-xl sm:text-2xl" />
          ) : (
            <IoMdHeartEmpty className="text-zinc-400 text-xl sm:text-2xl" />
          )}
        </button>

        {/* Album Art */}
        <div className="relative aspect-square w-full overflow-hidden rounded-lg sm:rounded-xl pointer-events-none shadow-lg">
          <Image
            src={song.cover_image_url || (song as any).cover || "/favicon.ico"}
            alt={`${song.title} cover`}
            fill
            sizes="(max-width: 640px) 70vw, (max-width: 768px) 180px, (max-width: 1024px) 220px, 260px"
            className="object-cover"
          />
        </div>

        {/* Song Info */}
        <p className="mt-3 sm:mt-4 text-xs sm:text-sm font-semibold line-clamp-1">{song.title}</p>
        <p className="text-[11px] sm:text-xs text-zinc-400 line-clamp-1 mt-0.5 sm:mt-1">{song.artist}</p>
      </div>
    );
  }

  /* ============================
     GRID CARD
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
        group relative bg-zinc-950 
        border border-zinc-900 
        p-2.5 sm:p-3 
        rounded-xl sm:rounded-2xl
        hover:bg-zinc-900 hover:border-cyan-500/20
        transition-all flex flex-col text-left
        h-full cursor-pointer outline-none
        focus-visible:ring-2 focus-visible:ring-cyan-500/50
        shadow-xl
      "
    >
      {/* Play Button - Hidden on mobile, visible on larger screens */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPlay(song);
        }}
        className="
          hidden md:grid
          w-9 h-9 
          lg:w-10 lg:h-10 
          rounded-full place-items-center
          absolute 
          bottom-20 sm:bottom-22 md:bottom-24 
          right-2
          opacity-0 group-hover:opacity-100
          translate-y-2 group-hover:translate-y-0
          transition-all duration-300
          backdrop-blur-sm bg-white/20
          border border-cyan-500 z-10
        "
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00e5ff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-[0_0_8px_rgba(0,229,255,0.7)] lg:w-5 lg:h-5"
        >
          <polygon points="7,5 19,12 7,19" />
        </svg>
      </button>

      {/* Action Buttons Container */}
      <div className="absolute right-2 sm:right-3 top-2 sm:top-3 flex flex-col gap-1.5 sm:gap-2 z-10 transition-all">
        {/* Add to Playlist */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToPlaylist(song);
          }}
          className="
                h-7 w-7 
                sm:h-8 sm:w-8 
                rounded-md sm:rounded-lg 
                grid place-items-center
                bg-zinc-900/80 border border-zinc-800
                hover:bg-zinc-800 hover:border-cyan-500/30
                backdrop-blur-sm text-zinc-400 hover:text-white
            "
          aria-label="Add to Playlist"
          title="Add to Playlist"
        >
          <span className="text-xl sm:text-2xl leading-none">+</span>
        </button>

        {/* Add to Album */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToAlbum(song);
          }}
          className="
                h-7 w-7 
                sm:h-8 sm:w-8 
                rounded-md sm:rounded-lg 
                grid place-items-center
                bg-zinc-900/80 border border-zinc-800
                hover:bg-zinc-800 hover:border-cyan-500/30
                backdrop-blur-sm text-zinc-400 hover:text-white
            "
          aria-label="Add to Album"
          title="Add to Album"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="2" /></svg>
        </button>
      </div>

      {/* Like Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleLike(song);
        }}
        disabled={likedLoading || toggleLikePending}
        className="
          absolute left-2.5 top-2.5 
          sm:left-2 sm:top-3
          h-8 w-8 
          sm:h-10 sm:w-10 
          rounded-md sm:rounded-lg 
          grid place-items-center transition-all
        "
      >
        {isLiked ? (
          <IoMdHeart className="text-cyan-400 text-lg sm:text-xl" />
        ) : (
          <IoMdHeartEmpty className="text-zinc-400 text-lg sm:text-xl" />
        )}
      </button>

      {/* Album Art */}
      <div className="aspect-square w-full overflow-hidden rounded-lg sm:rounded-xl pointer-events-none shadow-lg">
        <Image
          src={song.cover_image_url || (song as any).cover || "/favicon.ico"}
          alt={`${song.title} cover`}
          width={500}
          height={500}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Song Info */}
      <div className="mt-3 sm:mt-4 space-y-0.5 sm:space-y-1">
        <p className="font-semibold text-xs sm:text-sm line-clamp-1">{song.title}</p>
        <p className="text-xs sm:text-sm text-zinc-400 line-clamp-1">By {song.artist}</p>
      </div>
    </div>
  );
}