"use client";

import React, { createContext, useMemo, useState, useCallback } from "react";
import type { Song } from "../types/song";            // use one canonical import path
import MusicPlayer from "@/components/MusicPlayer";   // global player only
import { useEffect } from "react";
import getSupabaseClient from "../api/SupabaseClient";

export type PlayerContextType = {
  currentMusic: Song | null;
  queue: Song[];
  isQueueModalOpen: boolean;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  setQueueModalOpen: (open: boolean) => void;
  playNext: () => void;
  playPrev: () => void;
  playNow: (song: Song, queue?: Song[]) => void;
  togglePlayPause: () => void;
  setAudioElement?: (element: HTMLAudioElement | null) => void;
};

export const PlayerContext = createContext<PlayerContextType | null>(null);

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  const [currentMusic, setCurrentMusic] = useState<Song | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [isQueueModalOpen, setQueueModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Sync session to cookie for middleware
  useEffect(() => {
    const supabase = getSupabaseClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // Set a cookie that the middleware can read
        document.cookie = `sb-acgbmvotllgzbwonvhnb-auth-token=${session.access_token}; path=/; max-age=${3600 * 24 * 7}; SameSite=Lax`;
      } else {
        // Clear the cookie
        document.cookie = `sb-acgbmvotllgzbwonvhnb-auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const indexInQueue = useMemo(() => {
    return currentMusic ? queue.findIndex((s) => s.id === currentMusic.id) : -1;
  }, [currentMusic, queue]);

  const playNext = useCallback(() => {
    if (queue.length === 0) return;
    if (indexInQueue >= 0 && indexInQueue < queue.length - 1) {
      setCurrentMusic(queue[indexInQueue + 1]);
    } else {
      // Loop back to start
      setCurrentMusic(queue[0]);
    }
  }, [queue, indexInQueue]);

  const playPrev = useCallback(() => {
    if (queue.length === 0) return;
    if (indexInQueue > 0) {
      setCurrentMusic(queue[indexInQueue - 1]);
    } else {
      // Loop back to end
      setCurrentMusic(queue[queue.length - 1]);
    }
  }, [queue, indexInQueue]);

  const playNow = useCallback((song: Song, q?: Song[]) => {
    if (q?.length) {
      const exists = q.some((s) => s.id === song.id);
      setQueue(exists ? q : [song, ...q]);
    } else {
      setQueue((prev) => (prev.length ? prev : [song]));
    }
    setCurrentMusic(song);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (audioElement) {
      if (audioElement.paused) {
        audioElement.play().catch(() => { });
      } else {
        audioElement.pause();
      }
    }
  }, [audioElement]);

  const value = useMemo(
    () => ({
      currentMusic,
      queue,
      isQueueModalOpen,
      isPlaying,
      setIsPlaying,
      setQueueModalOpen,
      playNext,
      playPrev,
      playNow,
      togglePlayPause,
      setAudioElement,
    }),
    [currentMusic, queue, isQueueModalOpen, isPlaying, playNext, playPrev, playNow, togglePlayPause]
  );

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <MusicPlayer />
    </PlayerContext.Provider>
  );
}
