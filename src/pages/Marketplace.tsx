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
        if (err.response?.status === 429) {
          setError("Too many requests. Please wait a moment and try again.");
        } else {
          setError(err.response?.data?.error || "Could not load items. Please check your connection.");
        }
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
    <div className="pb-12 pt-8 font-sans bg-[#ffffff] min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Hero Section */}
      <MarketplaceHero />

      {/* Main Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-10 relative">
        
        {/* --- MOBILE FILTER OVERLAY --- */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 bg-[#241d1b]/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
        )}

        {/* --- SIDEBAR FILTERS --- */}
        <div className={`fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm bg-[#ffffff] p-6 border-r border-[#e5e5e5] transform transition-transform duration-300 lg:sticky lg:top-28 lg:transform-none lg:w-72 lg:border-none lg:bg-transparent lg:p-0 shrink-0 flex flex-col h-full lg:h-[calc(100vh-120px)] overflow-y-auto ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
           <div className="flex items-center justify-between lg:hidden mb-8">
             <h2 className="text-[16px] font-semibold flex items-center gap-2 text-[#241d1b]"><SlidersHorizontal className="w-5 h-5"/> Mobile Filters</h2>
             <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-[#fcf3ec] rounded-full text-[#333333] hover:bg-[#e5e5e5] hover:text-[#7e0038] transition-colors">
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
           
           <div className="lg:hidden mt-8 sticky bottom-0 bg-[#ffffff] pt-4 border-t border-[#e5e5e5]">
              <button onClick={() => setIsMobileFilterOpen(false)} className="w-full bg-[#7e0038] text-[#ffffff] font-semibold py-4 rounded-xl active:scale-95 transition-transform">
                 Show {totalItems} Results
              </button>
           </div>
        </div>

        {/* --- MAIN CONTENT (GRID) --- */}
        <div className="flex-1 min-w-0">
           
           {/* Top Control Bar */}
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-[#e5e5e5] pb-6">
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
                <span className="text-sm font-semibold text-[#333333]">
                   {isLoading ? "Loading..." : `${totalItems} items found`}
                </span>
                <select 
                  value={sortOrder}
                  onChange={(e) => { setSortOrder(e.target.value); setCurrentPage(1); }}
                  className="bg-[#ffffff] border border-[#e5e5e5] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#241d1b] outline-none focus:border-[#7e0038] cursor-pointer hover:bg-[#fcf3ec] transition-colors"
                >
                  {SORTS.map(sort => (
                    <option key={sort.value} value={sort.value}>{sort.label}</option>
                  ))}
                </select>
              </div>
           </div>

           {/* Results Grid */}
           {error ? (
             <div className="bg-[#fcf3ec] border border-[#7e0038]/30 rounded-2xl p-12 text-center text-[#7e0038] font-semibold min-h-[400px] flex flex-col items-center justify-center">
                <p className="text-lg mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[#7e0038] text-[#ffffff] rounded-xl font-semibold hover:bg-[#241d1b] transition-colors">Refresh Page</button>
             </div>
           ) : isLoading ? (
             <MarketplaceSkeleton />
           ) : items.length > 0 ? (
             <>
               <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-6 lg:gap-8">
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
