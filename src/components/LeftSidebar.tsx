"use client";

import Link from "next/link";
import { Library, Music, Heart } from "lucide-react";
import CustomDropdown from "./CustomDropdown";

type Filter = { type: "artist"; value: string } | { type: "album"; value: string } | null;

type LeftSidebarProps = {
  sortOption: "title_asc" | "title_desc" | "artist_asc" | "artist_desc";
  setSortOption: (option: "title_asc" | "title_desc" | "artist_asc" | "artist_desc") => void;
  albums: string[];
  artists: string[];
  activeFilter: Filter;
  setActiveFilter: (filter: Filter) => void;
  setCurrentPage: (page: number) => void;
};

const SORT_OPTIONS = [
  { value: "title_asc", label: "Title A → Z" },
  { value: "title_desc", label: "Title Z → A" },
  { value: "artist_asc", label: "Artist A → Z" },
  { value: "artist_desc", label: "Artist Z → A" },
];

export default function LeftSidebar({
  sortOption,
  setSortOption,
  albums,
  artists,
  activeFilter,
  setActiveFilter,
  setCurrentPage,
}: LeftSidebarProps) {
  return (
    <>
      {/* =========================
          MOBILE / TABLET CONTROLS
      ========================== */}
      <div className="lg:hidden mb-4 sm:mb-6">
        <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-4 shadow-lg">
          <CustomDropdown
            label="Filter songs by"
            options={SORT_OPTIONS}
            value={sortOption}
            onChange={(val) => setSortOption(val as any)}
          />
        </div>
      </div>

      {/* =========================
          DESKTOP SIDEBAR
      ========================== */}
      <aside className="hidden lg:block pb-28">
        <div className="sticky top-24 space-y-4">
          {/* Library */}
          <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-zinc-200 mb-4 flex items-center gap-2">
              <Library className="w-5 h-5 text-cyan-400" />
              Your Library
            </h3>

            <CustomDropdown
              label="Filter songs by"
              options={SORT_OPTIONS}
              value={sortOption}
              onChange={(val) => setSortOption(val as any)}
              className="mt-3"
            />
          </div>

          {/* Playlists */}
          <div className="max-h-45 bg-zinc-900/80 border border-white/10 rounded-2xl p-5 shadow-2xl">
            <p className="text-zinc-400 text-xs uppercase tracking-wider font-semibold mb-3">
              Playlists
            </p>

            <ul className="space-y-1">
              <li>
                <Link
                  href="/user-dashboard"
                  className="flex items-center gap-3 text-sm text-zinc-300 rounded-xl px-3 py-2.5 hover:bg-white/10 transition-all"
                >
                  <div className="h-9 w-9 rounded-lg bg-white/10 grid place-items-center">
                    <Music className="w-5 h-5 text-zinc-300" />
                  </div>
                  <span className="font-medium">My Playlists</span>
                </Link>
              </li>

              <li>
                <Link
                  href="/user-dashboard#liked"
                  className="flex items-center gap-3 text-sm text-zinc-300 rounded-xl px-3 py-2.5 hover:bg-white/10 transition-all"
                >
                  <div className="h-9 w-9 rounded-lg bg-cyan-500/20 grid place-items-center">
                    <Heart className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="font-medium">Liked Songs</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Artists */}
          <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-5 shadow-2xl">
            <p className="text-zinc-400 text-xs uppercase tracking-wider font-semibold mb-3">
              Artists
            </p>

            <ul className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 space-y-1 pr-2">
              {artists.map((ar, idx) => (
                <li key={`${ar}-${idx}`}>
                  <button
                    onClick={() => {
                      setActiveFilter({ type: "artist", value: ar });
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left text-sm truncate rounded-xl px-3 py-2 transition-all ${activeFilter?.type === "artist" && activeFilter.value === ar
                      ? "bg-cyan-500/20 text-cyan-300"
                      : "text-zinc-400 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    {ar}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}
