"use client";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, setCurrentPage }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 sm:gap-4 mt-10">
      <button
        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 sm:px-5 h-10 sm:h-11 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm sm:text-base font-medium hover:bg-zinc-900 hover:border-cyan-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <span className="hidden sm:inline">Previous</span>
        <span className="sm:hidden">Prev</span>
      </button>
      <span className="text-zinc-400 text-xs sm:text-sm font-medium whitespace-nowrap">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 sm:px-5 h-10 sm:h-11 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm sm:text-base font-medium hover:bg-zinc-900 hover:border-cyan-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Next
      </button>
    </div>
  );
}