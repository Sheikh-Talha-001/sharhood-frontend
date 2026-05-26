import { Check, X } from "lucide-react";

interface Props {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  
  conditions: string[];
  selectedCondition: string;
  onSelectCondition: (condition: string) => void;

  verifiedOnly: boolean;
  onToggleVerified: () => void;

  onClearAll: () => void;
  isMobileDrawer?: boolean;
}

export function MarketplaceFilters({
  categories,
  selectedCategory,
  onSelectCategory,
  conditions,
  selectedCondition,
  onSelectCondition,
  verifiedOnly,
  onToggleVerified,
  onClearAll,
  isMobileDrawer = false
}: Props) {

  const hasActiveFilters = selectedCategory || selectedCondition || verifiedOnly;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
         <h2 className="text-xl font-black text-gray-900 tracking-tight">Filters</h2>
         {hasActiveFilters && (
           <button 
             onClick={onClearAll}
             className="text-sm font-bold text-gray-400 hover:text-brand-black transition-colors flex items-center gap-1"
           >
             <X className="w-3.5 h-3.5" /> Clear All
           </button>
         )}
      </div>

      <div className="space-y-10 flex-1 overflow-y-auto pr-2">
        {/* Verification Filter */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Trust & Safety</h3>
          <label className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-100 transition-all group">
             <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors border ${verifiedOnly ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300 group-hover:border-gray-400'}`}>
                {verifiedOnly && <Check className="w-4 h-4 text-white" />}
             </div>
             <div>
                <span className="block text-sm font-bold text-gray-900 leading-none mb-1">Verified Neighbors Only</span>
                <span className="text-xs font-medium text-gray-500">Hide unverified lenders</span>
             </div>
             {/* Hidden checkbox for accessibility */}
             <input type="checkbox" checked={verifiedOnly} onChange={onToggleVerified} className="hidden" />
          </label>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Categories</h3>
          <div className="space-y-1">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => onSelectCategory(category === selectedCategory ? "" : category)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  selectedCategory === category 
                    ? "bg-brand-black text-white shadow-md" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Conditions */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Item Condition</h3>
          <div className="flex flex-wrap gap-2">
            {conditions.map(condition => (
              <button
                key={condition}
                onClick={() => onSelectCondition(condition === selectedCondition ? "" : condition)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                  selectedCondition === condition 
                    ? "bg-brand-yellow border-brand-yellow text-brand-black shadow-sm" 
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {condition.charAt(0).toUpperCase() + condition.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
