import { useState, useEffect } from "react";
import { SearchBar } from "@/src/components/SearchBar";
import { FilterSidebar } from "@/src/components/FilterSidebar";
import { ItemCard } from "@/src/components/ItemCard";
import { Pagination } from "@/src/components/Pagination";
import { itemService } from "@/src/services/itemService";
import { LoadingSkeleton } from "@/src/components/LoadingSkeleton";
import { EmptyState } from "@/src/components/EmptyState";
import { X, SlidersHorizontal } from "lucide-react";

const CATEGORIES = [
  { label: "Tools", value: "tools", count: 142 },
  { label: "Camping", value: "camping", count: 56 },
  { label: "Electronics", value: "electronics", count: 89 },
  { label: "Party Supplies", value: "party", count: 34 },
  { label: "Gardening", value: "gardening", count: 71 },
];

const CONDITIONS = [
  { label: "New", value: "new" },
  { label: "Excellent", value: "excellent" },
  { label: "Good", value: "good" },
  { label: "Fair", value: "fair" },
];

export function Marketplace() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Basic debounce for search query
    const timeoutId = setTimeout(() => {
      fetchItems();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [selectedCategories, selectedConditions, currentPage, searchQuery]);

  const fetchItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await itemService.getAll({ 
        category: selectedCategories.join(','), 
        condition: selectedConditions.join(','),
        search: searchQuery, // Ensure backend handles this if possible, or filter locally if needed
        page: currentPage 
      });
      
      // If backend doesn't support search yet, we can filter locally for demo purposes:
      let fetchedItems = response.data || [];
      if (searchQuery && !response.pagination) {
        fetchedItems = fetchedItems.filter((i: any) => i.title.toLowerCase().includes(searchQuery.toLowerCase()));
      }
      
      setItems(fetchedItems);
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages || 1);
      }
    } catch (err: any) {
      console.error("Failed to fetch items:", err);
      setError("Failed to load marketplace items. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategories(prev => prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]);
    setCurrentPage(1);
  };

  const handleConditionChange = (value: string) => {
    setSelectedConditions(prev => prev.includes(value) ? prev.filter(c => c !== value) : [...prev, value]);
    setCurrentPage(1);
  };
  
  const clearCategories = () => setSelectedCategories([]);
  const clearConditions = () => setSelectedConditions([]);

  const FiltersContent = () => (
    <>
       <FilterSidebar 
         title="Categories"
         options={CATEGORIES}
         selected={selectedCategories}
         onChange={handleCategoryChange}
         onClear={clearCategories}
       />
       <FilterSidebar 
         title="Condition"
         options={CONDITIONS}
         selected={selectedConditions}
         onChange={handleConditionChange}
         onClear={clearConditions}
       />
    </>
  );

  return (
    <div className="flex flex-col md:flex-row gap-8 relative">
      
      {/* Mobile Filter Drawer Overlay */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
      )}

      {/* Mobile & Desktop Sidebar Filters */}
      <div className={`fixed inset-y-0 left-0 z-50 w-4/5 max-w-sm bg-white p-6 shadow-2xl transform transition-transform duration-300 md:relative md:transform-none md:w-64 md:shadow-none md:bg-transparent md:p-0 shrink-0 space-y-6 overflow-y-auto md:overflow-visible ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
         <div className="flex items-center justify-between md:hidden mb-6">
           <h2 className="text-xl font-bold flex items-center gap-2"><SlidersHorizontal className="w-5 h-5"/> Filters</h2>
           <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-gray-50 rounded-full text-gray-500">
             <X className="w-5 h-5" />
           </button>
         </div>
         <FiltersContent />
         
         <div className="md:hidden mt-8">
            <button onClick={() => setIsMobileFilterOpen(false)} className="w-full bg-brand-black text-white font-bold py-4 rounded-xl">
               Apply Filters
            </button>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-3xl font-black tracking-tight text-gray-900">Browse Neighborhood</h1>
            <div className="w-full sm:w-auto sm:min-w-[320px]">
              <SearchBar 
                placeholder="Search tools, gear, etc..." 
                onSearch={setSearchQuery} 
                onFilterClick={() => setIsMobileFilterOpen(true)}
                isLoading={isLoading && !!searchQuery}
                value={searchQuery}
              />
            </div>
         </div>

         <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <p className="text-gray-500 font-medium">
               {isLoading ? "Searching..." : `Showing ${items.length} items directly around you.`}
            </p>
            <select className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
               <option>Sort by: Nearest</option>
               <option>Price: Low to High</option>
               <option>Price: High to Low</option>
               <option>Newest Arrivals</option>
            </select>
         </div>

         {error ? (
           <EmptyState 
             type="error"
             title="Something went wrong"
             description={error}
             action={<button onClick={fetchItems} className="mt-4 bg-gray-900 text-white px-6 py-2 rounded-full font-bold">Try Again</button>}
           />
         ) : isLoading && !searchQuery ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
             <LoadingSkeleton type="card" count={6} />
           </div>
         ) : items.length > 0 ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
             {items.map((item) => (
               <ItemCard key={item._id || item.id} item={item} />
             ))}
           </div>
         ) : (
           <EmptyState 
             type={searchQuery ? "search" : "items"}
             title={searchQuery ? "No results found" : "No items found"}
             description={searchQuery ? `We couldn't find anything matching "${searchQuery}". Try adjusting your search.` : "Try adjusting your filters to see more results."}
             action={(selectedCategories.length > 0 || selectedConditions.length > 0 || searchQuery) ? (
               <button onClick={() => { clearCategories(); clearConditions(); setSearchQuery(""); }} className="mt-4 bg-brand-yellow text-brand-black px-6 py-2 rounded-full font-bold">Clear All Filters</button>
             ) : undefined}
           />
         )}

         {!isLoading && !error && items.length > 0 && (
           <div className="mt-12 flex justify-center">
             <Pagination 
               currentPage={currentPage}
               totalPages={totalPages}
               onPageChange={setCurrentPage}
             />
           </div>
         )}
      </div>
    </div>
  );
}
