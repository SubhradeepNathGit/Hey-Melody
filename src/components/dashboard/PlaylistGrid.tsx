"use client";

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
  onOpen: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function PlaylistGrid({ playlists, onOpen, onDelete }: PlaylistGridProps) {
  if (playlists.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 md:py-20 px-4 rounded-2xl sm:rounded-3xl border border-white/10 bg-zinc-900/30 backdrop-blur-xl">
        <div className="inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-cyan-500/10 mb-4 sm:mb-6 ring-1 ring-cyan-500/30">
          <svg className="h-8 w-8 sm:h-10 sm:w-10 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">No playlists yet</h3>
        <p className="text-sm sm:text-base text-zinc-400 max-w-md mx-auto">
          Create your first playlist to organize your favorite tracks
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
      {playlists.map((playlist) => {
        const count = playlist.playlist_songs?.length ?? 0;
        
        return (
          <div
            key={playlist.id}
            className="group relative rounded-xl sm:rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl overflow-hidden hover:bg-zinc-800/50 transition-all duration-300 hover:border-cyan-500/30 shadow-lg hover:shadow-cyan-500/10"
          >
            {/* Cover Image */}
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-zinc-800 to-black">
              {playlist.cover_image_url ? (
                <img
                  src={playlist.cover_image_url}
                  alt={playlist.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-zinc-900">
                  <div 
                    className="absolute inset-0 opacity-20" 
                    style={{
                      backgroundImage: 'linear-gradient(45deg, rgba(6,182,212,0.4) 1px, transparent 1px), linear-gradient(-45deg, rgba(6,182,212,0.4) 1px, transparent 1px)',
                      backgroundSize: '20px 20px'
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-cyan-400/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                </div>
              )}
              
              {/* Overlay with Play Button */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4">
                  <button
                    onClick={() => onOpen(playlist.id)}
                    className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-cyan-500 hover:bg-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/50 hover:scale-110 transition-all active:scale-95"
                  >
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2">
              <h3 className="font-bold text-sm sm:text-base truncate group-hover:text-cyan-400 transition-colors">
                {playlist.name}
              </h3>
              
              <p className="text-xs sm:text-sm text-zinc-500 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
                {playlist.description || "No description"}
              </p>

              <div className="flex items-center justify-between pt-1 sm:pt-2">
                <span className="text-xs text-zinc-500 flex items-center gap-1">
                  <svg className="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  {count} song{count === 1 ? "" : "s"}
                </span>
                
                <button
                  onClick={() => onDelete(playlist.id)}
                  className="opacity-0 group-hover:opacity-100 h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 flex items-center justify-center transition-all active:scale-95"
                  title="Delete playlist"
                >
                  <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}