"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import type { Song } from "../types/song";

type NowPlayingSidebarProps = {
  isPlayingSomething: boolean;
  previewSong: Song | null;
  allowAutoplay: boolean;
  playSong: (song: Song) => void;
  getVideoUrl: (song: Song | null) => string | null;
};

export default function NowPlayingSidebar({
  isPlayingSomething,
  previewSong,
  allowAutoplay,
  playSong,
  getVideoUrl,
}: NowPlayingSidebarProps) {
  return (
    <aside
      className={`
        transition-all duration-300
        lg:sticky lg:top-20
        
        lg:h-[calc(100vh-7rem)]
        lg:overflow-y-auto
        ${isPlayingSomething ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
    >
    <div
  className="
    backdrop-blur-xl bg-white/5
    border border-white/10
    rounded-2xl
    p-4 sm:p-5
    shadow-2xl
    lg:max-w-sm
    mx-auto

    min-h-[420px]
    sm:min-h-[460px]
    lg:min-h-[520px]
  "
>

      
        {/* Header */}
        <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          Now Playing
        </h3>

        {isPlayingSomething && previewSong ? (
          <div className="space-y-4">
            {/* Artwork / Video */}
            <div className="relative group">
              <div
                className="
                  aspect-square
                  w-full
                  overflow-hidden
                  rounded-xl
                  bg-black/40
                  shadow-2xl
                "
              >
                {(() => {
                  const videoUrl = getVideoUrl(previewSong);
                  return videoUrl ? (
                    <video
                      src={videoUrl}
                      className="h-full w-full object-cover"
                      muted
                      autoPlay={allowAutoplay}
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <Image
                      src={previewSong.cover_image_url}
                      alt={`${previewSong.title} cover`}
                      width={800}
                      height={1000}
                      className="h-full w-full object-cover"
                      priority={false}
                    />
                  );
                })()}
              </div>

              {/* Play Button */}
              <button
                onClick={() => playSong(previewSong)}
                className="
                  absolute bottom-3 right-3
                  h-14 w-14
                  rounded-full
                  grid place-items-center
                  backdrop-blur-md
                  bg-cyan-500
                  text-white
                 
                  hover:scale-110 
                  active:scale-95
                  transition-all duration-200
                  opacity-0 group-hover:opacity-100
                  sm:opacity-100
                "
                aria-label="Play"
              >
                <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
              </button>
            </div>

            {/* Song Info */}
            <div className="space-y-1 px-1">
              <h4 className="text-base sm:text-lg font-semibold leading-tight line-clamp-2 text-white">
                {previewSong.title}
              </h4>
              <p className="text-sm text-zinc-400 line-clamp-1">
                {previewSong.artist}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-zinc-500">
            Start playing a song to see details here.
          </p>
        )}
      </div>
    </aside>
  );
}