"use client";

import { X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

type CreateAlbumModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (albumName: string) => void;
    existingAlbums: string[];
};

export default function CreateAlbumModal({
    isOpen,
    onClose,
    onCreate,
    existingAlbums
}: CreateAlbumModalProps) {
    const [albumName, setAlbumName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setAlbumName("");
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleCreate = async () => {
        const rawName = albumName.trim();
        if (!rawName) return;
        const trimmed = rawName.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());

        // Check for duplicate
        const exists = existingAlbums.some(
            (a) => a.toLowerCase() === trimmed.toLowerCase()
        );
        if (exists) {
            toast.error("An album with this name already exists!");
            return;
        }

        setIsCreating(true);
        await onCreate(trimmed);
        setIsCreating(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/80 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-zinc-900/95 backdrop-blur-xl border border-zinc-700/50 rounded-2xl shadow-2xl">
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
                        Create Album
                    </h2>
                    <p className="text-sm text-zinc-400">
                        Enter a name for your new album
                    </p>
                </div>

                {/* Content */}
                <div className="p-6 pt-4">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2 block">
                                Album Name
                            </label>
                            <input
                                ref={inputRef}
                                type="text"
                                value={albumName}
                                onChange={(e) => setAlbumName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && albumName.trim()) {
                                        handleCreate();
                                    }
                                }}
                                placeholder="e.g., Summer Vibes"
                                className="w-full h-12 rounded-xl bg-zinc-800/60 border border-zinc-700/50 px-4 text-lg text-white placeholder:text-zinc-500 outline-none focus:border-cyan-500/50 focus:bg-zinc-800/80 transition-all"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleCreate}
                            disabled={!albumName.trim() || isCreating}
                            className="w-full h-12 rounded-xl bg-cyan-600/70 text-white font-semibold hover:bg-cyan-600/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            {isCreating ? (
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                            ) : (
                                "Create Album"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
