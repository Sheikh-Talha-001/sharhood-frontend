import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onFilterClick?: () => void;
  isLoading?: boolean;
  value?: string;
}

export function SearchBar({ placeholder = "Search...", onSearch, onFilterClick, isLoading, value = "" }: Props) {
  const [query, setQuery] = useState(value);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch?.("");
  };

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="relative flex-1 flex items-center">
        <Search className="size-5 text-gray-400 absolute left-4" />
        <input 
          type="text" 
          value={query}
          placeholder={placeholder}
          onChange={handleChange}
          className="w-full bg-white border border-gray-200 rounded-full py-3.5 pl-12 pr-12 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all shadow-sm"
        />
        <div className="absolute right-4 flex items-center gap-2">
          {isLoading && <Loader2 className="size-4 text-gray-400 animate-spin" />}
          {query && !isLoading && (
            <button type="button" onClick={handleClear} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>
      {onFilterClick && (
        <button type="button" 
          onClick={onFilterClick}
          className="md:hidden bg-white border border-gray-200 p-3.5 rounded-full text-gray-600 hover:bg-gray-50 transition-colors shadow-sm shrink-0"
        >
          <SlidersHorizontal className="size-5" />
        </button>
      )}
    </div>
  );
}
