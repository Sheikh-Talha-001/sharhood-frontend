import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button type="button" 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="size-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
      >
        <ChevronLeft className="size-5" />
      </button>
      
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }).map((_, i) => {
          const page = i + 1;
          const isActive = page === currentPage;
          return (
            <button type="button"
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                "size-10 rounded-full text-sm font-bold transition-colors",
                isActive ? "bg-brand-black text-white" : "text-gray-600 hover:bg-gray-50"
              )}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button type="button" 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="size-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}
