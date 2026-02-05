"use client";

import Image from "next/image";
import { useContext, useEffect, useRef, useState, useCallback } from "react";
import {
  IoMdPause,
  IoMdPlay,
  IoMdSkipBackward,
  IoMdSkipForward,
  IoMdShuffle,
  IoMdVolumeHigh,
  IoMdVolumeOff,
  IoMdVolumeLow,
} from "react-icons/io";
import { LuRepeat, LuRepeat1 } from "react-icons/lu";
import { MdOutlineQueueMusic } from "react-icons/md";
import { PlayerContext } from "../../layouts/FrontendLayout";
import Queue from "./Queue";

function formatTime(t: number) {
  if (!Number.isFinite(t) || t <= 0) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function MusicPlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("MusicPlayer must be used inside PlayerContext.Provider");

  const { currentMusic, playNext, playPrev, isQueueModalOpen, setQueueModalOpen, isPlaying, setIsPlaying, setAudioElement, isShuffle, toggleShuffle } = ctx;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeatSong, setRepeatSong] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);

  const [volume, setVolume] = useState(50);
  const [previousVolume, setPreviousVolume] = useState(50);
  const [mounted, setMounted] = useState(false);

  // Marquee refs and state
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [shouldMarquee, setShouldMarquee] = useState(false);
  const [marqueeDuration, setMarqueeDuration] = useState("10s");

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    const v = Number(localStorage.getItem("bh_volume"));
    const initialVol = Number.isFinite(v) ? Math.min(Math.max(v, 0), 100) : 50;
    setVolume(initialVol);
    setPreviousVolume(initialVol);
  }, [currentMusic?.id]);

  const currentTrackId = currentMusic?.id ?? "none";
  const audioSrc: string | undefined = currentMusic?.audio_url || undefined;
  const cover = currentMusic?.cover_image_url || (currentMusic as any)?.cover || "/favicon.png";
  const title = currentMusic?.title ?? "";
  const artist = currentMusic?.artist ?? "";

  // Register audio element with context
  useEffect(() => {
    if (audioRef.current && setAudioElement) {
      setAudioElement(audioRef.current);
    }
  }, [setAudioElement, currentTrackId]); // Re-register when track changes

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTime = () => {
      if (!isSeeking) setCurrentTime(audio.currentTime || 0);
    };
    const onMeta = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const onDur = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const onEnded = () => {
      if (!audio.loop) playNext();
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("durationchange", onDur);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("durationchange", onDur);
      audio.removeEventListener("ended", onEnded);
    };
  }, [playNext, isSeeking]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
    if (typeof window !== "undefined") {
      localStorage.setItem("bh_volume", String(volume));
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.loop = repeatSong;
  }, [repeatSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let isActive = true; // flag to track if this effect is still active

    const playAudio = async () => {
      try {
        if (audioSrc) {
          // If the source changed, we might need to load it
          if (audio.src !== audioSrc) {
            audio.src = audioSrc;
            audio.load();
          }

          if (isActive) {
            await audio.play();
            if (isActive) setIsPlaying(true);
          }
        } else {
          audio.pause();
          if (isActive) {
            setIsPlaying(false);
            setDuration(0);
          }
        }
      } catch (error: any) {
        // If the play request was interrupted by a new request properly, 
        // browsers throw an AbortError. We should ignore this.
        if (isActive && error.name !== 'AbortError') {
          console.error("Playback error:", error);
          setIsPlaying(false);
        }
      }
    };

    playAudio();

    return () => {
      isActive = false;
    };
  }, [currentTrackId, audioSrc]);

  // Check if title needs marquee
  useEffect(() => {
    const checkMarquee = () => {
      if (containerRef.current && titleRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const textWidth = titleRef.current.scrollWidth;

        if (textWidth > containerWidth) {
          setShouldMarquee(true);
          const duration = Math.max(5, textWidth / 40);
          setMarqueeDuration(`${duration}s`);
        } else {
          setShouldMarquee(false);
        }
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      checkMarquee();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Immediate check
    checkMarquee();

    // Fallback for PC load speed / font settling
    const timer = setTimeout(checkMarquee, 100);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timer);
    };
  }, [title, currentTrackId]);

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => { });
    else a.pause();
  }, []);

  const onSeek = useCallback((val: number) => {
    const a = audioRef.current;
    if (!a || !Number.isFinite(val)) return;
    a.currentTime = val;
    setCurrentTime(val);
  }, []);

  const onVolume = useCallback((val: number) => {
    if (!Number.isFinite(val)) return;
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val / 100;
    if (val > 0) setPreviousVolume(val);
  }, []);

  const toggleMute = useCallback(() => {
    if (volume === 0) onVolume(previousVolume || 50);
    else {
      setPreviousVolume(volume);
      onVolume(0);
    }
  }, [volume, previousVolume, onVolume]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing =
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
        target.isContentEditable;
      if (typing) return;

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
        return;
      }

      if (e.code === "ArrowLeft") {
        e.preventDefault();
        const a = audioRef.current;
        if (!a) return;
        a.currentTime = Math.max(0, a.currentTime - 5);
        setCurrentTime(a.currentTime);
        return;
      }

      if (e.code === "ArrowRight") {
        e.preventDefault();
        const a = audioRef.current;
        if (!a) return;
        a.currentTime = Math.min(a.duration, a.currentTime + 5);
        setCurrentTime(a.currentTime);
        return;
      }

      if (e.code === "ArrowUp") {
        e.preventDefault();
        onVolume(Math.min(100, volume + 5));
        return;
      }

      if (e.code === "ArrowDown") {
        e.preventDefault();
        onVolume(Math.max(0, volume - 5));
        return;
      }

      if (e.key.toLowerCase() === "m") {
        e.preventDefault();
        toggleMute();
        return;
      }

      if (e.key.toLowerCase() === "q") {
        e.preventDefault();
        setQueueModalOpen(!isQueueModalOpen);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [volume, isQueueModalOpen, togglePlay, toggleMute, onVolume, setQueueModalOpen]);

  const isVisible = Boolean(currentMusic && audioSrc);
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const safeCurrent = Math.min(currentTime, safeDuration);
  const progressPercent = safeDuration > 0 ? (safeCurrent / safeDuration) * 100 : 0;

  const VolumeIcon =
    volume === 0 ? IoMdVolumeOff : volume < 50 ? IoMdVolumeLow : IoMdVolumeHigh;

  if (!mounted) return null;

  return (
    <>
      <Queue />
      <div
        className={`fixed bottom-0 left-0 w-full z-50
  pb-[calc(env(safe-area-inset-bottom)+0.1rem)]
  bg-black/70 backdrop-blur-xl
  transition-all duration-300
  rounded-3xl lg:rounded-none
  ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none"}`}

      >
        <audio
          ref={audioRef}
          src={audioSrc}
          preload="metadata"
          controls={false}
          crossOrigin="anonymous"
        />

        <div className="max-w-full mx-auto px-2 sm:px-4 py-3 lg:py-5 flex flex-col gap-2">
          {/* Main Controls Row: 3 Sections */}
          <div className="grid grid-cols-[1fr_auto_1fr] sm:grid-cols-3 items-center gap-2 sm:gap-4 md:gap-6">

            {/* Section 1: Track Info (Left) */}
            <div className="flex items-center gap-2 sm:gap-3 mr-6 ml-4 min-w-0">
              <div className="relative shrink-0 overflow-hidden rounded-md shadow-lg h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 ring-1 ring-white/10">
                <Image
                  src={cover || "/favicon.png"}
                  alt={title || "Now playing"}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="min-w-0 flex-1 flex flex-col justify-center">
                <div ref={containerRef} className="overflow-hidden relative h-4 sm:h-6">
                  <div
                    key={currentTrackId}
                    className={`flex whitespace-nowrap w-fit ${shouldMarquee ? "animate-marquee" : ""}`}
                    style={{ animationDuration: marqueeDuration }}
                  >
                    <div ref={titleRef} className="flex whitespace-nowrap">
                      <span className="font-semibold text-[11px] sm:text-base text-white pr-10">
                        {title || "\u00A0"}
                      </span>
                      {shouldMarquee && (
                        <span className="font-semibold text-[11px] sm:text-base text-white pr-10">
                          {title}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-zinc-500 text-[9px] sm:text-sm truncate">
                  {artist || "\u00A0"}
                </p>
              </div>
            </div>

            {/* Section 2: Playback Controls (Center) */}
            <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-8">
              <button
                onClick={playPrev}
                className="text-lg sm:text-3xl text-zinc-400 hover:text-white transition-all hover:scale-110 active:scale-95"
                title="Previous"
              >
                <IoMdSkipBackward />
              </button>

              <button
                onClick={togglePlay}
                className="bg-cyan-600 text-white text-lg sm:text-2xl w-12 h-12 sm:w-16 sm:h-16 md:w-14 md:h-14 rounded-full flex items-center justify-center hover:scale-110 active:scale-90 transition-all duration-200"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <IoMdPause /> : <IoMdPlay className="translate-x-[2px]" />}
              </button>

              <button
                onClick={playNext}
                className="text-lg sm:text-3xl text-zinc-400 hover:text-white transition-all hover:scale-110 active:scale-95"
                title="Next"
              >
                <IoMdSkipForward />
              </button>
            </div>

            {/* Section 3: Right Controls (Settings) */}
            <div className="flex items-center justify-end gap-2 mr-5 sm:gap-4">
              <button
                onClick={toggleShuffle}
                className={`text-base sm:text-xl transition-all hover:scale-110 ${isShuffle ? "text-cyan-400" : "text-zinc-400 hover:text-white"}`}
                title="Shuffle"
              >
                <IoMdShuffle />
              </button>

              <button
                onClick={() => setRepeatSong(!repeatSong)}
                className={`text-base sm:text-xl transition-all hover:scale-110 ${repeatSong ? "text-cyan-400" : "text-zinc-400 hover:text-white"}`}
                title="Repeat"
              >
                {repeatSong ? <LuRepeat1 /> : <LuRepeat />}
              </button>

              <button
                onClick={() => setQueueModalOpen(!isQueueModalOpen)}
                className={`text-base sm:text-xl transition-all hover:scale-110 ${isQueueModalOpen ? "text-cyan-400" : "text-zinc-400 hover:text-white"}`}
                title="Queue (Q)"
              >
                <MdOutlineQueueMusic />
              </button>

              <button
                onClick={toggleMute}
                className="text-zinc-400 hover:text-white text-base sm:text-xl transition-all hover:scale-110"
                title="Volume"
              >
                <VolumeIcon />
              </button>

              {/* Desktop Volume Slider */}
              <div className="hidden md:block w-20 lg:w-24 group/vol">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={(e) => onVolume(Number(e.target.value))}
                  onInput={(e) => onVolume(Number((e.target as HTMLInputElement).value))}
                  className="w-full h-1 rounded-full cursor-pointer appearance-none bg-white/10"
                  style={{
                    background: `linear-gradient(to right, rgb(6 182 212) ${volume}%, rgba(255,255,255,0.1) ${volume}%)`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Progress Bar Section  */}
          <div className="w-full flex items-center gap-2 sm:gap-3 px-5 sm:px-10 lg:px-95 mt-1">
            <span className="text-[10px] text-zinc-500 w-8 text-right tabular-nums opacity-60">
              {formatTime(safeCurrent)}
            </span>

            <div className="relative flex-1 h-3 flex items-center group cursor-pointer">
              <input
                type="range"
                min={0}
                max={safeDuration}
                step={0.1}
                value={safeCurrent}
                onChange={(e) => onSeek(Number(e.target.value))}
                onInput={(e) => onSeek(Number((e.target as HTMLInputElement).value))}
                onMouseDown={() => setIsSeeking(true)}
                onMouseUp={() => setIsSeeking(false)}
                className="w-full h-1 sm:h-1.5 rounded-full appearance-none bg-white/5 group-hover:bg-white/10 transition-colors"
                style={{
                  background: `linear-gradient(to right, hsla(189, 95%, 43%, 0.66) ${progressPercent}%, rgba(255,255,255,0.05) ${progressPercent}%)`,
                }}
              />
              {/* Custom thumb/marker if needed, currently using appearance-none */}
            </div>

            <span className="text-[10px] text-zinc-500 w-8 tabular-nums opacity-60">
              {formatTime(safeDuration)}
            </span>
          </div>
        </div>
      </div>


      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        @-webkit-keyframes marquee {
          0% { -webkit-transform: translateX(0); }
          100% { -webkit-transform: translateX(-50%); }
        }
        
        .animate-marquee {
          animation: marquee linear infinite;
          -webkit-animation: marquee linear infinite;
          will-change: transform;
        }
      `}</style>
    </>
  );
}
