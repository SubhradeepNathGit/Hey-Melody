"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
        const trimmed = newAlbumName.trim();
        if (!trimmed) return;

        // Check for duplicate name (case-insensitive)
        const exists = albums.some(
            (a) => a.name.toLowerCase() === trimmed.toLowerCase()
        );
        if (exists) {
            alert("An album with this name already exists! Please select it from the list.");
            return;
        }

        setIsCreating(true);
        // Call onAddToAlbum with null albumId to indicate creation
        onAddToAlbum(null, trimmed);
        setIsCreating(false);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/80 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-2xl max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="p-6 pb-4 border-b border-zinc-800/50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-4 right-4 h-8 w-8 rounded-full bg-zinc-800/50 flex items-center justify-center hover:bg-zinc-700/50 transition-colors"
                    >
                        <X className="h-4 w-4 text-zinc-400" />
                    </button>

                    <h2 className="text-xl font-bold text-white mb-1">
                        Add to Album
                    </h2>
                    <p className="text-sm text-zinc-400">
                        {songTitle} — {songArtist}
                    </p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-6">

                    {/* Existing Albums List */}
                    {albums.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                                Select Existing Album
                            </h3>
                            <ul className="space-y-2">
                                {albums.map(album => (
                                    <li key={album.id}>
                                        <button
                                            onClick={() => onAddToAlbum(album.id, album.name)}
                                            className="w-full text-left px-4 py-3 rounded-xl bg-zinc-800/40 hover:bg-zinc-800/80 border border-zinc-700/30 hover:border-cyan-500/30 text-zinc-200 hover:text-white transition-all flex items-center justify-between group"
                                        >
                                            <span className="truncate">{album.name}</span>
                                            <span className="opacity-0 group-hover:opacity-100 text-cyan-400 text-sm font-medium transition-opacity">Add</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}


                    {/* Create New Section */}
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                            {albums.length > 0 ? "Or Create New Album" : "Create New Album"}
                        </h3>

                        <div className="flex gap-3">
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
                                className="flex-1 h-12 rounded-xl bg-zinc-800/60 border border-zinc-700/50 px-4 text-lg text-white placeholder:text-zinc-500 outline-none focus:border-cyan-500/50 focus:bg-zinc-800/80 transition-all"
                            />

                            <button
                                type="button"
                                onClick={handleCreateNew}
                                disabled={!newAlbumName.trim() || isCreating}
                                className="h-12 px-6 rounded-xl bg-cyan-600/70 text-white font-semibold hover:bg-cyan-600/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                {isCreating ? (
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    "Create"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
