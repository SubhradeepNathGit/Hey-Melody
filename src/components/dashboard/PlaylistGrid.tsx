"use client";

import { Music2, Play, Trash2, X, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import DeleteConfirmModal from "./DeleteConfirmModal";

type Playlist = {
  id: number;
  user_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  cover_image_url: string | null;
  playlist_songs?: { song_id: string }[];
};

type PlaylistGridProps = {
  playlists: Playlist[];
  onOpen: (id: number, playOnOpen?: boolean) => void;
  onDelete: (id: number) => void;
};

type Toast = {
  id: number;
  message: string;
  type: "success" | "error" | "info";
};

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="flex items-center gap-3 min-w-[280px] max-w-md bg-zinc-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-4 shadow-2xl shadow-cyan-500/10 animate-in slide-in-from-right duration-300">
      <div className="h-10 w-10 rounded-full bg-cyan-500/10 flex items-center justify-center ring-1 ring-cyan-500/20 flex-shrink-0">
        <CheckCircle2 className="h-5 w-5 text-cyan-400" />
      </div>
      <p className="flex-1 text-sm font-medium text-white">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="h-6 w-6 rounded-full bg-zinc-800/50 hover:bg-zinc-700/50 flex items-center justify-center transition-colors flex-shrink-0"
      >
        <X className="h-3 w-3 text-zinc-400" />
      </button>
    </div>
  );
}

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: number) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-[calc(100vw-2rem)]">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}



export default function PlaylistGrid({
  playlists,
  onOpen,
  onDelete,
}: PlaylistGridProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Clear URL parameters to prevent banner messages
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      router.replace(pathname, { scroll: false });
    }
  }, [router, pathname]);

  const [deleteDialog, setDeleteDialog] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type: "success" }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleConfirmDelete = () => {
    if (!deleteDialog) return;
    onDelete(deleteDialog.id);
    showToast(`${deleteDialog.name} Playlist has been deleted`);
    setDeleteDialog(null);
  };

  if (playlists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
        <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br from-cyan-900/40 to-cyan-600/50 flex items-center justify-center mb-4 sm:mb-6">
          <Music2 className="h-10 w-10 sm:h-12 sm:w-12 text-cyan-500/50" strokeWidth={2} />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 text-center">No playlists yet</h3>
        <p className="text-sm sm:text-base text-zinc-400 text-center max-w-sm">
          Create your first playlist to organize your favorite songs
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {playlists.map((playlist) => {
          const count = playlist.playlist_songs?.length ?? 0;

          return (
            <div
              key={playlist.id}
              onClick={() => {
                const isMobile = window.innerWidth < 640;
                onOpen(playlist.id, isMobile);
              }}
              className="group rounded-2xl bg-zinc-950 p-3 sm:p-4 cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-3 sm:mb-4">
                {(playlist.cover_image_url || (playlist as any).cover) ? (
                  <img
                    src={playlist.cover_image_url || (playlist as any).cover || ""}
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cyan-900/40 to-cyan-600/50 flex items-center justify-center">
                    <Music2
                      className="h-16 w-16 sm:h-20 sm:w-20 text-cyan-500/30"
                      strokeWidth={3}
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen(playlist.id, true);
                  }}
                  className="absolute bottom-2 right-2 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/10 backdrop-blur-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all hover:bg-white/20 hover:scale-110"
                >
                  <Play className="h-4 w-4 sm:h-5 sm:w-5 text-white ml-0.5" fill="currentColor" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteDialog({
                      id: playlist.id,
                      name: playlist.name,
                    });
                  }}
                  className="absolute top-2 sm:top-3 left-2 sm:left-3 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/40"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-white/70" />
                </button>
              </div>

              <h3 className="font-bold text-white truncate text-sm sm:text-base">
                {playlist.name}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 truncate">
                {playlist.description ||
                  `${count} song${count !== 1 ? "s" : ""}`}
              </p>
            </div>
          );
        })}
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteDialog}
        title="Delete Playlist?"
        itemName={deleteDialog?.name || ""}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialog(null)}
      />

      <ToastContainer
        toasts={toasts}
        onRemove={(id) =>
          setToasts((prev) => prev.filter((t) => t.id !== id))
        }
      />
    </>
  );
}