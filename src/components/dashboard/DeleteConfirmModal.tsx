"use client";

import { Trash2, X } from "lucide-react";

type DeleteConfirmModalProps = {
    isOpen: boolean;
    title: string;
    itemName: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function DeleteConfirmModal({
    isOpen,
    title,
    itemName,
    onConfirm,
    onCancel,
}: DeleteConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onCancel}
            />

            {/* Modal content */}
            <div className="relative w-full max-w-md bg-zinc-900/90 backdrop-blur-xl border border-zinc-700/50 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                <button
                    type="button"
                    onClick={onCancel}
                    className="absolute top-4 right-4 h-8 w-8 rounded-full bg-zinc-800/50 flex items-center justify-center hover:bg-zinc-700/50 transition-colors group"
                >
                    <X className="h-4 w-4 text-zinc-400 group-hover:text-white transition-colors" />
                </button>

                <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-cyan-500/10 flex items-center justify-center ring-1 ring-cyan-500/20">
                        <Trash2 className="h-8 w-8 text-cyan-400" />
                    </div>
                </div>

                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                        {title}
                    </h3>
                    <p className="text-sm text-zinc-400">
                        Are you sure you want to delete <span className="font-semibold text-white">"{itemName}"</span>?<br />
                        This action cannot be undone.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 h-11 rounded-full bg-zinc-800/50 text-white hover:bg-zinc-700/50 transition-colors font-medium active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 h-11 rounded-full bg-cyan-600/70 text-white hover:bg-cyan-600/90 transition-colors font-medium active:scale-95"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
