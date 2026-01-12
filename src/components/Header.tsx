"use client";

import Link from "next/link";
import Image from "next/image";
import { GoSearch } from "react-icons/go";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import Logo from "./Logo";
import { useEffect, useRef } from "react";

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
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen || mobileSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen, mobileSearchOpen]);

  // Calculate dynamic heights for smooth animations
  useEffect(() => {
    if (mobileSearchRef.current) {
      const height = mobileSearchOpen ? mobileSearchRef.current.scrollHeight : 0;
      mobileSearchRef.current.style.maxHeight = `${height}px`;
    }
  }, [mobileSearchOpen, searchQuery]);

  useEffect(() => {
    if (mobileMenuRef.current) {
      const height = mobileMenuOpen ? mobileMenuRef.current.scrollHeight : 0;
      mobileMenuRef.current.style.maxHeight = `${height}px`;
    }
  }, [mobileMenuOpen, authUser]);

  const getUserInitial = () => {
    const name = authUser?.user_metadata?.display_name || authUser?.email || "U";
    return name.toString().trim().charAt(0).toUpperCase();
  };

  const getUserDisplayName = () => {
    return authUser?.user_metadata?.display_name ||
      authUser?.user_metadata?.full_name ||
      authUser?.email;
  };

  return (
    <header className="sticky top-0 z-[100] bg-black/40 backdrop-blur-xl">
      <div className="mx-auto max-w-[1920px] px-3 sm:px-4 md:px-6 lg:px-8">
        <nav className="py-2.5 sm:py-3 md:py-3.5">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 w-full">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 shrink-0 group"
              onClick={() => {
                setMobileMenuOpen(false);
                setMobileSearchOpen(false);
              }}
            >
              <div className="h-9 w-9 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-xl grid place-items-center transition-transform duration-200 group-hover:scale-105">
                <Logo />
              </div>
              <span className="font-bold tracking-tight text-lg sm:text-lg md:text-xl lg:text-2xl whitespace-nowrap">
                <span className="text-white">Hey </span>
                <span className="bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-transparent">
                  Melody
                </span>
              </span>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex lg:ml-6 flex-1 justify-center max-w-xl lg:max-w-4xl">
              <div className="relative w-full">
                <input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search for songs, artists, albums..."
                  aria-label="Search songs or artists"
                  className="w-full rounded-xl px-4 h-10 md:h-11 bg-zinc-900/80 border border-zinc-800 placeholder:text-zinc-500 text-white text-sm md:text-base text-center focus:outline-none focus:border-cyan-500/50 focus:bg-zinc-900 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="ml-auto flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Mobile Search Toggle */}
              <button
                className="md:hidden h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-zinc-900/80 border border-zinc-800 grid place-items-center hover:bg-zinc-800 hover:border-cyan-500/30 active:scale-95 transition-all duration-200"
                aria-label="Toggle search"
                onClick={() => {
                  setMobileSearchOpen(!mobileSearchOpen);
                  if (!mobileSearchOpen) setMobileMenuOpen(false);
                }}
              >
                <GoSearch className="text-sm sm:text-base md:text-lg text-zinc-300" />
              </button>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center gap-2 lg:gap-3">
                {!authUser ? (
                  <Link
                    href="/login"
                    className="px-5 lg:px-7 h-10 lg:h-11 rounded-xl font-bold text-sm lg:text-base bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-cyan-700 hover:border-cyan-600 active:scale-95 transition-all duration-200 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-700/30 flex items-center justify-center whitespace-nowrap"
                  >
                    Get Started
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 lg:gap-5">
                    <Link
                      href="/user-dashboard"
                      className="flex items-center gap-2 lg:gap-2.5 group"
                      title="Open your dashboard"
                    >
                      {authUser.user_metadata?.avatar_url ? (
                        <img
                          src={authUser.user_metadata.avatar_url}
                          alt={getUserDisplayName() || "User"}
                          className="h-8 w-8 lg:h-9 lg:w-9 rounded-full object-cover transition-all duration-200 ring-2 ring-transparent group-hover:ring-cyan-500/50"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-8 w-8 lg:h-9 lg:w-9 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 text-white grid place-items-center text-sm font-bold shadow-md group-hover:shadow-cyan-500/30 transition-all duration-200">
                          {getUserInitial()}
                        </div>
                      )}
                      <span className="text-sm lg:text-base font-medium max-w-[100px] lg:max-w-[140px] truncate group-hover:text-cyan-400 transition-colors duration-200">
                        {getUserDisplayName()}
                      </span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 lg:px-5 h-10 lg:h-10 rounded-xl text-sm lg:text-base font-medium bg-zinc-900/80 border border-zinc-800 hover:bg-zinc-800 hover:border-cyan-500/30 active:scale-95 transition-all duration-200 whitespace-nowrap"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden h-8 w-8 sm:h-9 sm:w-9 rounded-lg sm:rounded-xl bg-zinc-900/80 border border-zinc-800 grid place-items-center hover:bg-zinc-800 hover:border-cyan-500/30 active:scale-95 transition-all duration-200"
                aria-label="Toggle menu"
                onClick={() => {
                  setMobileMenuOpen(!mobileMenuOpen);
                  if (!mobileMenuOpen) setMobileSearchOpen(false);
                }}
              >
                {mobileMenuOpen ? (
                  <RxCross2 className="text-base sm:text-lg text-zinc-300" />
                ) : (
                  <RxHamburgerMenu className="text-base sm:text-lg text-zinc-300" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div
            ref={mobileSearchRef}
            className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
            style={{
              maxHeight: mobileSearchOpen ? '80px' : '0',
              marginTop: mobileSearchOpen ? '10px' : '0',
              opacity: mobileSearchOpen ? 1 : 0,
            }}
          >
            <div className="relative">
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search songs or artists"
                aria-label="Search songs or artists"
                className="w-full rounded-xl px-3.5 sm:px-4 h-10 sm:h-11 bg-zinc-900/80 border border-zinc-800 placeholder:text-zinc-500 text-white text-sm sm:text-base text-center focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
                autoFocus={mobileSearchOpen}
              />
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            ref={mobileMenuRef}
            className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
            style={{
              maxHeight: mobileMenuOpen ? '300px' : '0',
              marginTop: mobileMenuOpen ? '12px' : '0',
              opacity: mobileMenuOpen ? 1 : 0,
            }}
          >
            <div className="grid gap-2">
              {!authUser ? (
                <Link
                  href="/login"
                  className="w-full text-center px-4 h-11 rounded-xl font-bold text-sm bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-cyan-700 hover:border-cyan-600 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-cyan-500/10 hover:shadow-cyan-700/30 flex items-center justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              ) : (
                <>
                  <Link
                    href="/user-dashboard"
                    className="flex items-center gap-3 px-4 h-11 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:bg-zinc-800 active:scale-[0.98] transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                    title="Open your dashboard"
                  >
                    {authUser.user_metadata?.avatar_url ? (
                      <Image
                        src={authUser.user_metadata.avatar_url}
                        alt={getUserDisplayName() || "User"}
                        width={28}
                        height={28}
                        className="h-7 w-7 rounded-full object-cover border border-cyan-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 text-white grid place-items-center text-xs font-bold shadow-lg shadow-cyan-500/20">
                        {getUserInitial()}
                      </div>
                    )}
                    <span className="text-sm truncate font-medium text-white">
                      {getUserDisplayName()}
                    </span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 h-11 rounded-xl text-sm font-medium bg-zinc-900/80 border border-zinc-800 text-white hover:bg-zinc-800 active:scale-[0.98] transition-all duration-200"
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