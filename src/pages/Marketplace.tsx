import { useState, useEffect } from "react";
import { SearchBar } from "@/src/components/SearchBar";
import { ItemCard } from "@/src/components/ItemCard";
import { Pagination } from "@/src/components/Pagination";
import { itemService } from "@/src/services/itemService";
import { SlidersHorizontal, X } from "lucide-react";

import { MarketplaceHero } from "@/src/components/marketplace/MarketplaceHero";
import { MarketplaceFilters } from "@/src/components/marketplace/MarketplaceFilters";
import { EmptyMarketplaceState } from "@/src/components/marketplace/EmptyMarketplaceState";
import { MarketplaceSkeleton } from "@/src/components/marketplace/MarketplaceSkeleton";

const CONDITIONS = ["new", "like-new", "good", "fair"];
const SORTS = [
  { value: "newest", label: "Newest Arrivals" },
  { value: "oldest", label: "Oldest First" },
  { value: "mostRequested", label: "Most Requested" },
];

export function Marketplace() {
  // Filter States
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  
  // Data States
  const [items, setItems] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // 1. Fetch Categories dynamically on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await itemService.getCategories();
        setCategories(response.data || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // 2. Fetch Items whenever filters or pagination changes
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Construct standard query parameters exactly as supported by backend
        const params: any = {
          page: currentPage,
          limit: 12, // Grid looks best with 12 items
        };

        if (searchQuery) params.search = searchQuery;
        if (selectedCategory) params.category = selectedCategory;
        if (selectedCondition) params.condition = selectedCondition;
        if (verifiedOnly) params.verifiedOnly = "true";
        if (sortOrder) params.sort = sortOrder;

        const response = await itemService.getAll(params);
        
        setItems(response.data || []);
        if (response.pagination) {
          setTotalPages(response.pagination.totalPages || 1);
          setTotalItems(response.pagination.totalItems || response.data.length);
        } else {
          setTotalItems(response.data.length);
        }
      } catch (err: any) {
        console.error("Failed to fetch marketplace items:", err);
        setError(err.response?.data?.error || "Could not load items.");
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search slightly to avoid spamming the API while typing
    const timeoutId = setTimeout(fetchItems, 300);
    return () => clearTimeout(timeoutId);
  }, [selectedCategory, selectedCondition, searchQuery, verifiedOnly, sortOrder, currentPage]);

  // Handlers
  const handleClearFilters = () => {
    setSelectedCategory("");
    setSelectedCondition("");
    setSearchQuery("");
    setVerifiedOnly(false);
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategory || selectedCondition || searchQuery || verifiedOnly;

  return (
    <div className="pb-12">
      {/* Top Hero Section */}
      <MarketplaceHero />

      {/* Main Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-10 relative">
        
        {/* --- MOBILE FILTER OVERLAY --- */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
        )}

        {/* --- SIDEBAR FILTERS --- */}
        <div className={`fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm bg-white p-6 shadow-2xl transform transition-transform duration-300 lg:relative lg:transform-none lg:w-72 lg:shadow-none lg:bg-transparent lg:p-0 shrink-0 flex flex-col h-full lg:h-auto overflow-y-auto lg:overflow-visible ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
           <div className="flex items-center justify-between lg:hidden mb-8">
             <h2 className="text-xl font-bold flex items-center gap-2"><SlidersHorizontal className="w-5 h-5"/> Mobile Filters</h2>
             <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100 hover:text-brand-black transition-colors">
               <X className="w-5 h-5" />
             </button>
           </div>
           
           <MarketplaceFilters 
             categories={categories}
             selectedCategory={selectedCategory}
             onSelectCategory={(c) => { setSelectedCategory(c); setCurrentPage(1); }}
             conditions={CONDITIONS}
             selectedCondition={selectedCondition}
             onSelectCondition={(c) => { setSelectedCondition(c); setCurrentPage(1); }}
             verifiedOnly={verifiedOnly}
             onToggleVerified={() => { setVerifiedOnly(!verifiedOnly); setCurrentPage(1); }}
             onClearAll={handleClearFilters}
             isMobileDrawer={true}
           />
           
           <div className="lg:hidden mt-8 sticky bottom-0 bg-white pt-4 border-t border-gray-100">
              <button onClick={() => setIsMobileFilterOpen(false)} className="w-full bg-brand-black text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform">
                 Show {totalItems} Results
              </button>
           </div>
        </div>

        {/* --- MAIN CONTENT (GRID) --- */}
        <div className="flex-1 min-w-0">
           
           {/* Top Control Bar */}
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="w-full sm:w-[320px]">
                <SearchBar 
                  placeholder="Search tools, cameras..." 
                  onSearch={(q) => { setSearchQuery(q); setCurrentPage(1); }} 
                  onFilterClick={() => setIsMobileFilterOpen(true)}
                  isLoading={isLoading && !!searchQuery}
                  value={searchQuery}
                />
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                <span className="text-sm font-bold text-gray-400">
                   {isLoading ? "Loading..." : `${totalItems} items found`}
                </span>
                <select 
                  value={sortOrder}
                  onChange={(e) => { setSortOrder(e.target.value); setCurrentPage(1); }}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  {SORTS.map(sort => (
                    <option key={sort.value} value={sort.value}>{sort.label}</option>
                  ))}
                </select>
              </div>
           </div>

           {/* Results Grid */}
           {error ? (
             <div className="bg-red-50 border-2 border-dashed border-red-200 rounded-3xl p-12 text-center text-red-600 font-bold min-h-[400px] flex flex-col items-center justify-center">
                <p className="text-xl mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-600 text-white rounded-full">Refresh Page</button>
             </div>
           ) : isLoading ? (
             <MarketplaceSkeleton />
           ) : items.length > 0 ? (
             <>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                 {items.map((item) => (
                   <ItemCard key={item._id || item.id} item={item} />
                 ))}
               </div>
               
               {/* Pagination */}
               {totalPages > 1 && (
                 <div className="mt-12 flex justify-center">
                   <Pagination 
                     currentPage={currentPage}
                     totalPages={totalPages}
                     onPageChange={setCurrentPage}
                   />
                 </div>
               )}
             </>
           ) : (
             <EmptyMarketplaceState 
               title={hasActiveFilters ? "No exact matches" : "No items available"}
               description={hasActiveFilters ? "Try removing some filters or adjusting your search terms to discover more items." : "There are currently no items available in your neighborhood."}
               onClearFilters={hasActiveFilters ? handleClearFilters : undefined}
             />
           )}

        </div>
      </div>
    </div>
  );
}
