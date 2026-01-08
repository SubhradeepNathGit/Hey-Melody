"use client";

import { useState, useRef, DragEvent } from "react";
import { Music, Upload, Image, Check, X } from "lucide-react";

type UploadSongFormProps = {
  onSubmit: (data: {
    title: string;
    artist: string;
    audioFile: File;
    coverFile: File;
  }) => Promise<void>;
  busy: boolean;
};

export default function UploadSongForm({ onSubmit, busy }: UploadSongFormProps) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState({ audio: false, cover: false });

  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent, type: "audio" | "cover") => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive((prev) => ({ ...prev, [type]: true }));
    } else if (e.type === "dragleave") {
      setDragActive((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleDrop = (e: DragEvent, type: "audio" | "cover") => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive((prev) => ({ ...prev, [type]: false }));

    const files = e.dataTransfer.files;
    if (!files?.[0]) return;

    if (type === "audio" && files[0].type.startsWith("audio/")) {
      setAudioFile(files[0]);
    }
    if (type === "cover" && files[0].type.startsWith("image/")) {
      setCoverFile(files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!audioFile || !coverFile || busy) return;

    await onSubmit({ title, artist, audioFile, coverFile });

    setTitle("");
    setArtist("");
    setAudioFile(null);
    setCoverFile(null);
  };

  return (
    <div className="w-full">
      <div
        className="
          relative
          w-full
          rounded-3xl
          bg-gradient-to-br from-zinc-900/40 via-zinc-900/30 to-black/40
          backdrop-blur-xl
          p-6
          sm:p-8
          space-y-6
          border border-white/10
        "
      >
        {/* Header */}
        <div className="flex items-center gap-4 ">
          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 grid place-items-center">
            <Music className="h-6 w-6 sm:h-7 sm:w-7 text-black" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight ">
              Upload Your Track
            </h2>
            <p className="text-sm text-zinc-500 mt-0.5">
              Add music to your library
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
              Song Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter song title"
              required
              className="
                w-full
                h-11
                sm:h-12
                rounded-xl
                bg-black/40
                border border-white/10
                px-4
                text-sm
                sm:text-base
                text-white
                placeholder:text-zinc-600
                outline-none
                focus:border-cyan-500/50
                focus:bg-black/60
                transition-all
                duration-200
              "
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
              Artist Name
            </label>
            <input
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="Enter artist name"
              required
              className="
                w-full
                h-11
                sm:h-12
                rounded-xl
                bg-black/40
                border border-white/10
                px-4
                text-sm
                sm:text-base
                text-white
                placeholder:text-zinc-600
                outline-none
                focus:border-cyan-500/50
                focus:bg-black/60
                transition-all
                duration-200
              "
            />
          </div>
        </div>

        {/* Upload Areas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {/* Audio File */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
              Audio File
            </label>
            <div
              onDragEnter={(e) => handleDrag(e, "audio")}
              onDragLeave={(e) => handleDrag(e, "audio")}
              onDragOver={(e) => handleDrag(e, "audio")}
              onDrop={(e) => handleDrop(e, "audio")}
              onClick={() => audioInputRef.current?.click()}
              className={`
                relative
                h-36
                sm:h-40
                rounded-2xl
                border-2 border-dashed
                cursor-pointer
                transition-all
                duration-200
                overflow-hidden
                ${
                  dragActive.audio
                    ? "border-cyan-500 bg-cyan-500/10"
                    : audioFile
                    ? "border-white/20 bg-black/30"
                    : "border-white/10 bg-black/20 hover:border-white/20 hover:bg-black/30"
                }
              `}
            >
              <input
                ref={audioInputRef}
                type="file"
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                className="hidden"
                required
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-4">
                {audioFile ? (
                  <>
                    <div className="h-12 w-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 grid place-items-center">
                      <Check className="h-6 w-6 text-cyan-400" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">Audio file selected</p>
                      <p className="text-sm text-zinc-300 truncate w-full mt-1 font-medium">
                        {audioFile.name}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 grid place-items-center">
                      <Upload className="h-6 w-6 text-zinc-500" strokeWidth={2} />
                    </div>
                    <p className="text-xs text-zinc-500">
                      Drag & drop or click
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
              Cover Image
            </label>
            <div
              onDragEnter={(e) => handleDrag(e, "cover")}
              onDragLeave={(e) => handleDrag(e, "cover")}
              onDragOver={(e) => handleDrag(e, "cover")}
              onDrop={(e) => handleDrop(e, "cover")}
              onClick={() => coverInputRef.current?.click()}
              className={`
                relative
                h-36
                sm:h-40
                rounded-2xl
                border-2 border-dashed
                cursor-pointer
                transition-all
                duration-200
                overflow-hidden
                ${
                  dragActive.cover
                    ? "border-cyan-500 bg-cyan-500/10"
                    : coverFile
                    ? "border-white/20 bg-black/30"
                    : "border-white/10 bg-black/20 hover:border-white/20 hover:bg-black/30"
                }
              `}
            >
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                className="hidden"
                required
              />

              {coverFile ? (
                <>
                  <img
                    src={URL.createObjectURL(coverFile)}
                    alt="Cover preview"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-xs text-white/80 truncate font-medium">
                      {coverFile.name}
                    </p>
                  </div>
                  <div className="absolute top-3 right-3 h-8 w-8 rounded-lg bg-cyan-500 grid place-items-center">
                    <Check className="h-4 w-4 text-black" strokeWidth={3} />
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-4">
                  <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 grid place-items-center">
                    <Image className="h-6 w-6 text-zinc-500" strokeWidth={2} />
                  </div>
                  <p className="text-xs text-zinc-500">
                    Drag & drop or click
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={busy || !title || !artist || !audioFile || !coverFile}
          className="
            w-full
            h-12
            sm:h-13
            rounded-xl
            font-bold
            text-sm
            sm:text-base
            text-black
            bg-gradient-to-r from-cyan-500 to-cyan-600
            hover:from-cyan-400 hover:to-cyan-500
            disabled:opacity-40 disabled:cursor-not-allowed
            active:scale-[0.98]
            transition-all
            duration-200
            flex
            items-center
            justify-center
            gap-2
          "
        >
          {busy ? (
            <>
              <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            "Upload Song"
          )}
        </button>
      </div>
    </div>
  );
}