"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import type { Song } from "../../types/song";

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
        hidden lg:block
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
    p-4 lg:p-4
   
    lg:max-w-sm
    mx-auto

    min-h-[420px]
    sm:min-h-[460px]
    lg:min-h-[546px]

     -mt-20 sm:-mt-0 lg:mt-0 mb-40 sm:mb-0 lg:mb-0
  "
      >


        {/* Header */}
        <h3 className="text-md font-semibold text-zinc-300 mb-4 mt-1 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />

          Now Playing

          <div className="flex items-center gap-1">
                  <span className="w-0.5 h-3 bg-cyan-400 rounded-full animate-playing-1" />
                  <span className="w-0.5 h-5 bg-cyan-400 rounded-full animate-playing-2" />
                  <span className="w-0.5 h-4 bg-cyan-400 rounded-full animate-playing-3" />
                </div>
        </h3>


        {isPlayingSomething && previewSong ? (
          <div className="space-y-4">
            {/* Artwork / Video */}
            <div className="relative group">
              <div
                className="
                  aspect-square
                  w-full
                  h-full
                  overflow-hidden
                  rounded-xl
                  bg-black/40
                 
                "
              >
                {(() => {
                  const videoUrl = getVideoUrl(previewSong);
                  const coverUrl = previewSong.cover_image_url || (previewSong as any).cover || "/favicon.ico";
                  return videoUrl && videoUrl.length > 5 ? (
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
                      src={coverUrl}
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
            <div className="space-y-1 mt-7 px-1">
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