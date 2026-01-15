"use client";

import { useState, useRef, DragEvent } from "react";
import { Music2, Upload, Image, Check, KeyRound, Users } from "lucide-react";

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
    <div className="w-full min-h-screen flex items-center justify-center px-1 sm:px-1 lg:px-2 py-8 sm:py-12">
      <div className="w-full max-w-7xl">
      {/* Beta Badge & Header */}
      <div className="text-center mb-6 sm:mb-8 lg:mb-10 space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-2 px-3 sm:px-3 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-cyan-500/20 via-cyan-400/20 to-cyan-600/20 border border-cyan-400/30 backdrop-blur-sm">
          < KeyRound  className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" />
          <span className="text-xs sm:text-sm font-semibold text-cyan-300 tracking-wide">BETA ACCESS</span>
        </div>
        
        <h1 className="text-2xl sm:text-4xl lg:text-4xl font-bold text-white tracking-tight px-4">
          Upload Your Music
        </h1>
        
        <p className="text-sm sm:text-base lg:text-lg text-zinc-400 max-w-4xl mx-auto leading-relaxed px-4">
          You're part of our exclusive beta! Share & Listen your tracks on  <span className="text-cyan-400 font-medium">Hey Melody</span>
        </p>
      </div>

      {/* Main Upload Card */}
      <div className="relative rounded-2xl overflow-hidden">
        {/* Gradient Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-cyan-400/10 to-cyan-600/20 blur-lg" />
        
        <div className="relative bg-gradient-to-br from-zinc-950/60 to-black backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-2xl p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8">
          
          {/* Icon & Info Section */}
          <div className="flex sm:flex-row items-start mt-1 sm:items-center gap-4 sm:gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl sm:rounded-2xl opacity-50" />
              <div className="relative h-12 w-12 sm:h-12 sm:w-12 lg:h-16 lg:w-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 grid place-items-center">
                <Music2 className="h-7 w-7 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-white" strokeWidth={3} />
              </div>
            </div>
            
            <div className="flex-1 space-y-1 sm:space-y-2">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                Contribute Your Track
              </h2>
              <div className="flex items-center gap-2 text-zinc-400">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <p className="text-xs sm:text-sm">Join our growing community of creators</p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-5 sm:space-y-6">
            {/* Text Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div className="space-y-2 sm:space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  <div className="h-1 w-1 rounded-full bg-cyan-400" />
                  Song Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your song title"
                  required
                  className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-black/50 border border-white/10 px-4 sm:px-5 text-sm sm:text-base text-white placeholder:text-zinc-600 outline-none focus:border-cyan-500/50 focus:bg-black/70 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                />
              </div>

              <div className="space-y-2 sm:space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  <div className="h-1 w-1 rounded-full bg-cyan-400" />
                  Artist Name
                </label>
                <input
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="Enter your artist name"
                  required
                  className="w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-black/50 border border-white/10 px-4 sm:px-5 text-sm sm:text-base text-white placeholder:text-zinc-600 outline-none focus:border-cyan-500/50 focus:bg-black/70 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                />
              </div>
            </div>

            {/* File Upload Areas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 pt-2">
              {/* Audio Upload */}
              <div className="space-y-2 sm:space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  <div className="h-1 w-1 rounded-full bg-cyan-400" />
                  Audio File
                </label>
                <div
                  onDragEnter={(e) => handleDrag(e, "audio")}
                  onDragLeave={(e) => handleDrag(e, "audio")}
                  onDragOver={(e) => handleDrag(e, "audio")}
                  onDrop={(e) => handleDrop(e, "audio")}
                  onClick={() => audioInputRef.current?.click()}
                  className={`relative h-40 sm:h-48 rounded-xl sm:rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden group ${
                    dragActive.audio
                      ? "border-cyan-400 bg-cyan-500/10 scale-[1.02]"
                      : audioFile
                      ? "border-cyan-500/50 bg-cyan-500/5"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 "
                  }`}
                >
                  <input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                    className="hidden"
                    required
                  />

                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 sm:gap-4 p-4 sm:p-6 text-center">
                    {audioFile ? (
                      <>
                        <div className="relative">
                          <div className="absolute inset-0 bg-cyan-500/30 rounded-xl sm:rounded-2xl blur-xl" />
                          <div className="relative h-12 w-12 sm:h-16 sm:w-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 grid place-items-center">
                            <Check className="h-6 w-6 sm:h-8 sm:w-8 text-white" strokeWidth={3} />
                          </div>
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                          <p className="text-xs sm:text-sm font-semibold text-cyan-400">Audio Ready</p>
                          <p className="text-xs text-zinc-400 truncate max-w-full px-2 sm:px-4">
                            {audioFile.name}
                          </p>
                          <p className="text-xs text-zinc-600">
                            {(audioFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 grid place-items-center group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 transition-all duration-300">
                          <Upload className="h-6 w-6 sm:h-7 sm:w-7 text-zinc-500 group-hover:text-cyan-400 transition-colors" strokeWidth={2} />
                        </div>
                        <div className="space-y-0.5 sm:space-y-1">
                          <p className="text-xs sm:text-sm font-medium text-zinc-300">Drop your audio file</p>
                          <p className="text-xs text-zinc-500">or click to browse</p>
                        </div>
                        <p className="text-xs text-zinc-600">MP3, WAV, FLAC supported</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Cover Upload */}
              <div className="space-y-2 sm:space-y-3">
                <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  <div className="h-1 w-1 rounded-full bg-cyan-400" />
                  Cover Image
                </label>
                <div
                  onDragEnter={(e) => handleDrag(e, "cover")}
                  onDragLeave={(e) => handleDrag(e, "cover")}
                  onDragOver={(e) => handleDrag(e, "cover")}
                  onDrop={(e) => handleDrop(e, "cover")}
                  onClick={() => coverInputRef.current?.click()}
                  className={`relative h-40 sm:h-48 rounded-xl sm:rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden group ${
                    dragActive.cover
                      ? "border-cyan-400 bg-cyan-500/10 scale-[1.02]"
                      : coverFile
                      ? "border-cyan-500/50 bg-cyan-500/5"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                  }`}
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                      <div className="absolute inset-0 flex items-end p-3 sm:p-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white/90 truncate">
                            {coverFile.name}
                          </p>
                          <p className="text-xs text-white/60 mt-0.5">
                            {(coverFile.size / 1024).toFixed(0)} KB
                          </p>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-cyan-500  grid place-items-center">
                        <Check className="h-4 w-4 sm:h-5 sm:w-5 text-white" strokeWidth={3} />
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 sm:gap-4 p-4 sm:p-6 text-center">
                      <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 grid place-items-center group-hover:border-cyan-500/30 group-hover:bg-cyan-500/10 transition-all duration-300">
                        <Image className="h-6 w-6 sm:h-7 sm:w-7 text-zinc-500 group-hover:text-cyan-400 transition-colors" strokeWidth={2} />
                      </div>
                      <div className="space-y-0.5 sm:space-y-1">
                        <p className="text-xs sm:text-sm font-medium text-zinc-300">Drop your cover art</p>
                        <p className="text-xs text-zinc-500">or click to browse</p>
                      </div>
                      <p className="text-xs text-zinc-600">JPG, PNG, WEBP supported</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 sm:pt-4">
            <button
              onClick={handleSubmit}
              disabled={busy || !title || !artist || !audioFile || !coverFile}
              className="relative w-full h-14 sm:h-16 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base text-white overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 active:scale-[0.98] transition-transform duration-200 group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-600 group-hover:from-cyan-400 group-hover:via-cyan-300 group-hover:to-cyan-500 group-disabled:from-cyan-500 group-disabled:via-cyan-400 group-disabled:to-cyan-600 transition-all duration-300" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 group-disabled:opacity-0 bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 blur-xl transition-opacity duration-300" />
              
              <span className="relative flex items-center justify-center gap-2 sm:gap-3">
                {busy ? (
                  <>
                    <div className="h-4 w-4 sm:h-5 sm:w-5 border-2 sm:border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Uploading to Community...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Share with Community</span>
                  </>
                )}
              </span>
            </button>
            
            <p className="text-center text-xs sm:text-sm text-zinc-500 mt-3 sm:mt-4 px-2">
              By uploading, you agree to share your music with the Hey Melody community
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Info */}
      <div className="mt-6 sm:mt-8 text-center px-4">
        <p className="text-xs sm:text-sm text-zinc-600">
          Thanks for being an early supporter! Your feedback helps us improve.
        </p>
      </div>
      </div>
    </div>
  );
}