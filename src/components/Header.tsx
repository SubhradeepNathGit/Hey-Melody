"use client";

import Link from "next/link";
import Image from "next/image";
import { GoSearch } from "react-icons/go";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import Logo from "./Logo";
import { User } from "@supabase/supabase-js";

type HeaderProps = {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  setCurrentPage: (p: number) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  mobileSearchOpen: boolean;
  setMobileSearchOpen: (open: boolean) => void;
  authUser: {
    email?: string | null;
    user_metadata?: {
      display_name?: string | null;
      avatar_url?: string | null;
      full_name?: string | null;
    } | null;
  } | null;
  handleLogout: () => void;
};

export default function Header({
  searchQuery,
  setSearchQuery,
  setCurrentPage,
  mobileMenuOpen,
  setMobileMenuOpen,
  mobileSearchOpen,
  setMobileSearchOpen,
  authUser,
  handleLogout,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/50 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8">
        <nav className="py-4">
          <div className="flex items-center gap-4 sm:gap-6 w-full">
            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 grid place-items-center shadow-lg shadow-cyan-500/20">
                <Logo />
              </div>
              <span className="font-bold tracking-tight text-lg sm:text-xl block">
                <span className="text-white">Hey </span>
                <span className="bg-gradient-to-r from-cyan-200 to-cyan-500 bg-clip-text text-transparent">
                  Melody
                </span>
              </span>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 justify-center">
              <div className="relative group w-full max-w-xl">
                <GoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-cyan-400 transition-colors text-lg pointer-events-none" />
                <input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search for songs, artists, albums..."
                  aria-label="Search songs or artists"
                  className="w-full rounded-xl pl-12 pr-4 h-11 bg-zinc-900 border border-zinc-800 placeholder:text-zinc-500 text-white focus:outline-none focus:border-cyan-500/50 focus:bg-zinc-900 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="ml-auto flex items-center gap-2">
              {/* Mobile Search Toggle */}
              <button
                className="md:hidden h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 grid place-items-center hover:bg-zinc-800 hover:border-cyan-500/30 transition-all"
                aria-label="Toggle search"
                onClick={() => {
                  setMobileSearchOpen(!mobileSearchOpen);
                  if (!mobileSearchOpen) setMobileMenuOpen(false);
                }}
              >
                <GoSearch className="text-lg" />
              </button>

              <div className="hidden md:flex items-center gap-4">
                {!authUser ? (
                  <>
                    <Link
                      href="/signup"
                      className="px-5 h-10 rounded-xl text-sm font-medium bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-cyan-500/30 transition-all flex items-center"
                    >
                      Sign up
                    </Link>
                    <Link
                      href="/login"
                      className="px-5 h-10 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-cyan-600 text-black hover:from-cyan-400 hover:to-cyan-500 transition-all shadow-lg shadow-cyan-500/20 flex items-center"
                    >
                      Log in
                    </Link>
                  </>
                ) : (
                  <div className="flex items-center gap-6">
                    <Link
                      href="/user-dashboard"
                      className="flex items-center gap-3 group"
                      title="Open your dashboard"
                    >
                      {authUser.user_metadata?.avatar_url ? (
                        <img
                          src={authUser.user_metadata.avatar_url}
                          alt={authUser.user_metadata?.display_name || authUser.email || "User"}
                          className="h-8 w-8 rounded-full object-cover border-2 border-transparent group-hover:border-cyan-400 transition-all shadow-md"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 text-white grid place-items-center text-sm font-bold shadow-md group-hover:shadow-cyan-500/30 transition-all">
                          {(authUser.user_metadata?.display_name || authUser.email || "U")
                            .toString()
                            .trim()
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}
                      <span className="text-sm font-medium max-w-[150px] truncate group-hover:text-cyan-400 transition-colors">
                        {authUser.user_metadata?.display_name || authUser.user_metadata?.full_name || authUser.email}
                      </span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 h-10 rounded-xl text-sm font-medium bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-cyan-500/30 transition-all"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 grid place-items-center hover:bg-zinc-800 hover:border-cyan-500/30 transition-all"
                aria-label="Toggle menu"
                onClick={() => {
                  setMobileMenuOpen(!mobileMenuOpen);
                  if (!mobileMenuOpen) setMobileSearchOpen(false);
                }}
              >
                {mobileMenuOpen ? <RxCross2 /> : <RxHamburgerMenu />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ${mobileSearchOpen ? "max-h-24 mt-4" : "max-h-0"
              }`}
          >
            <div className="relative group">
              <GoSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-cyan-400 transition-colors text-lg pointer-events-none" />
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search songs or artists"
                aria-label="Search songs or artists"
                className="w-full rounded-xl pl-12 pr-4 h-11 bg-zinc-900 border border-zinc-800 placeholder:text-zinc-500 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? "max-h-48 mt-4" : "max-h-0"
              }`}
          >
            <div className="grid gap-2">
              {!authUser ? (
                <>
                  <Link
                    href="/signup"
                    className="w-full text-center px-4 h-11 rounded-xl text-sm font-medium bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-all flex items-center justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                  <Link
                    href="/login"
                    className="w-full text-center px-4 h-11 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-400 hover:to-cyan-500 transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/user-dashboard"
                    className="flex items-center gap-3 px-4 h-11 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                    title="Open your dashboard"
                  >
                    {authUser.user_metadata?.avatar_url ? (
                      <Image
                        src={authUser.user_metadata.avatar_url}
                        alt={authUser.user_metadata?.display_name || authUser.email || "User"}
                        width={28}
                        height={28}
                        className="h-7 w-7 rounded-lg object-cover border-2 border-cyan-500/30 shadow-lg shadow-cyan-500/20"
                      />
                    ) : (
                      <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 text-black grid place-items-center text-xs font-bold shadow-lg shadow-cyan-500/20">
                        {(authUser.user_metadata?.display_name || authUser.email || "U")
                          .toString()
                          .trim()
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm truncate font-medium">
                      {authUser.user_metadata?.display_name || authUser.user_metadata?.full_name || authUser.email}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 h-11 rounded-xl text-sm font-medium bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-all"
                  >
                    Log out
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}