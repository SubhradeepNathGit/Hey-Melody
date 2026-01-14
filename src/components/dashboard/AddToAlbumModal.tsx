"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

type Album = { id: string; name: string; description?: string | null; cover_image_url?: string | null; artist?: string | null };

type AddToAlbumModalProps = {
    isOpen: boolean;
    songTitle: string;
    songArtist: string;
    albums: Album[];
    onClose: () => void;
    onAddToAlbum: (albumId: string | null, albumName: string) => void;
    onCreateAlbum?: (name: string) => Promise<Album>;
};

export default function AddToAlbumModal({
    isOpen,
    songTitle,
    songArtist,
    albums,
    onClose,
    onAddToAlbum,
    onCreateAlbum,
}: AddToAlbumModalProps) {
    const [newAlbumName, setNewAlbumName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Focus input on open
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleCreateNew = async () => {
        const rawName = newAlbumName.trim();
        if (!rawName) return;
        const trimmed = rawName.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());

        // Check for duplicate name (case-insensitive)
        const exists = albums.some(
            (a) => a.name.toLowerCase() === trimmed.toLowerCase()
        );
        if (exists) {
            toast.error("An album with this name already exists! Please select it from the list.");
            return;
        }

        setIsCreating(true);
        // Call onAddToAlbum with null albumId to indicate creation
        onAddToAlbum(null, trimmed);
        setIsCreating(false);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-transparent backdrop-blur-none sm:backdrop-blur-md"

                onClick={onClose}
            />

            {/* Modal - Full screen on mobile, centered card on tablet/desktop */}
            <div className="relative w-full sm:max-w-md md:max-w-lg bg-zinc-900/70 backdrop-blur-md border-0 sm:border border-zinc-700/50 rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] sm:max-h-[85vh] md:max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="relative p-4 sm:p-6 pb-3 sm:pb-4 border-b border-zinc-800/50">
                    {/* Mobile handle indicator */}
                    <div className="sm:hidden w-12 h-1 bg-zinc-700/50 rounded-full mx-auto mb-4" />

                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-4 sm:top-4 right-4 h-9 w-9 sm:h-8 sm:w-8 rounded-full bg-zinc-800/50 flex items-center justify-center hover:bg-zinc-700/50 active:bg-zinc-700/70 transition-colors touch-manipulation"
                    >
                        <X className="h-5 w-5 sm:h-4 sm:w-4 text-zinc-400" />
                    </button>

                    <h2 className="text-lg sm:text-xl font-bold text-white mb-1 pr-10">
                        Add to Album
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-400 truncate pr-10">
                        {songTitle} — {songArtist}
                    </p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 pt-3 sm:pt-4 space-y-5 sm:space-y-6">

                    {/* Existing Albums List */}
                    {albums.length > 0 && (
                        <div>
                            <h3 className="text-xs sm:text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2.5 sm:mb-3 px-1">
                                Select Existing Album
                            </h3>
                            <ul className="space-y-2">
                                {albums.map(album => (
                                    <li key={album.id}>
                                        <button
                                            onClick={() => onAddToAlbum(album.id, album.name)}
                                            className="w-full text-left px-2 sm:px-3 py-3.5 sm:py-3 rounded-xl sm:rounded-xl hover:bg-cyan-700/20 active:bg-zinc-800/90 hover:border-cyan-500/30 active:scale-[0.98] text-zinc-200 hover:text-white transition-all flex items-center justify-between group touch-manipulation"
                                        >
                                            <span className="truncate text-lg sm:text-lg">{album.name}</span>
                                            <span className="opacity-0 group-hover:opacity-100 text-cyan-400 text-xs sm:text-sm font-medium transition-opacity ml-2 flex-shrink-0">Add</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}


                    {/* Create New Section */}
                    <div>
                        <h3 className="text-xs sm:text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2.5 sm:mb-3 px-1">
                            {albums.length > 0 ? "Or Create New Album" : "Create New Album"}
                        </h3>

                        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                            <input
                                ref={inputRef}
                                type="text"
                                value={newAlbumName}
                                onChange={(e) => setNewAlbumName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && newAlbumName.trim()) {
                                        handleCreateNew();
                                    }
                                }}
                                placeholder="Album name"
                                className="
    w-full
    min-h-[56px] sm:min-h-[60px] lg:min-h-[34px]
    px-4
    py-3
    text-lg sm:text-lg
    leading-tight
    rounded-xl
    bg-zinc-800/60
    border border-zinc-700/50
    text-white
    placeholder:text-zinc-500
    outline-none
    appearance-none
    focus:border-cyan-500/50
    focus:bg-zinc-800/80
    focus:ring-2 focus:ring-cyan-500/10
    transition-all
    touch-manipulation
  "
                            />

                            <button
                                type="button"
                                onClick={handleCreateNew}
                                disabled={!newAlbumName.trim() || isCreating}
                                className="h-14 sm:h-14 w-full sm:w-auto px-6 rounded-xl bg-cyan-600 text-white text-lg font-semibold hover:bg-cyan-700 active:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] touch-manipulation flex items-center justify-center"
                            >
                                {isCreating ? (
                                    <div className="h-5 w-5 sm:h-4 sm:w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    "Create"
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Safe area for mobile devices */}
                <div className="sm:hidden h-safe-area-inset-bottom bg-zinc-900/95" />
            </div>
        </div>
    );
}