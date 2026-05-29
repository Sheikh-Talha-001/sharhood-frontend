import { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface Props {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
}

export function AdminSearchBar({ placeholder = "Search...", onSearch, className = "" }: Props) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="size-4 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        aria-label={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all shadow-sm"
      />
    </div>
  );
}
