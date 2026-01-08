"use client";

import { useState } from "react";
import { Save } from "lucide-react";

type CreatePlaylistFormProps = {
  onSubmit: (data: {
    name: string;
    description: string;
  }) => Promise<void>;
  busy: boolean;
};

export default function CreatePlaylistForm({ onSubmit, busy }: CreatePlaylistFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!name || busy) return;

    await onSubmit({ name, description });

    setName("");
    setDescription("");
  };

  return (
    <div className="w-full rounded-3xl bg-gradient-to-br from-zinc-900/40 via-zinc-900/30 to-black/40 backdrop-blur-xl p-6 sm:p-8 space-y-6 border border-white/10 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 grid place-items-center shadow-lg shadow-cyan-500/30">
          <Save className="h-5 w-5 text-black" strokeWidth={2} />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Create Playlist
        </h2>
      </div>

      {/* Playlist Name */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
          Playlist Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Awesome Playlist"
          required
          className="w-full h-12 rounded-xl bg-black/40 border border-white/10 px-4 text-base text-white placeholder:text-zinc-600 outline-none focus:border-cyan-500/50 focus:bg-black/60 transition-all duration-200"
        />
      </div>

      {/* Description */}
      <div className="space-y-2 flex-1 flex flex-col">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
          Description (Optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your playlist..."
          rows={6}
          className="w-full flex-1 rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-base text-white placeholder:text-zinc-600 outline-none focus:border-cyan-500/50 focus:bg-black/60 transition-all duration-200 resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={busy || !name}
        className="w-full h-12 rounded-xl font-bold text-base text-black bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 mt-auto"
      >
        {busy ? (
          <>
            <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            <span>Creating...</span>
          </>
        ) : (
          "Create Playlist"
        )}
      </button>
    </div>
  );
}