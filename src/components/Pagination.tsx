"use client";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, setCurrentPage }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-10">
      <button
        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="px-5 h-10 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-medium hover:bg-zinc-900 hover:border-cyan-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Previous
      </button>
      <span className="text-zinc-400 text-sm font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-5 h-10 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-medium hover:bg-zinc-900 hover:border-cyan-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        Next
      </button>
    </div>
  );
}