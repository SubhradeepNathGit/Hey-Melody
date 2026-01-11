"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, Heart } from "lucide-react";

export default function Footer() {
    return (
          <footer className="mt-20 mb-25 bg-black/50 backdrop-blur-xl">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-0 text-center">
            <p className="text-sm text-zinc-500 mb-2">
              © {new Date().getFullYear()} Hey Melody -All Rights Reserved
            </p>
            <p className="text-sm text-zinc-600">
              Designed & Developed by{" "}
              <a
                href="https://github.com/SubhradeepNathGit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Subhradeep Nath
              </a>
            </p>
          </div>
        </footer>
    );
}
