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
    <div className="flex flex-col h-full font-sans">
      <div className="flex items-center justify-between mb-8">
         <h2 className="text-[16px] font-semibold text-[#241d1b] tracking-tight">Filters</h2>
         {hasActiveFilters && (
           <button 
             onClick={onClearAll}
             className="text-sm font-semibold text-[#7e0038] hover:text-[#241d1b] transition-colors flex items-center gap-1"
           >
             <X className="w-3.5 h-3.5" /> Clear All
           </button>
         )}
      </div>

      <div className="space-y-10 flex-1 overflow-y-auto pr-2">
        {/* Verification Filter */}
        <div>
          <h3 className="text-xs font-semibold text-[#333333] uppercase tracking-widest mb-4">Trust & Safety</h3>
          <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#fcf3ec] cursor-pointer border border-[#e5e5e5] hover:border-[#7e0038]/50 transition-all group">
             <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors border ${verifiedOnly ? 'bg-[#10664c] border-[#10664c]' : 'bg-[#ffffff] border-[#e5e5e5] group-hover:border-[#7e0038]'}`}>
                {verifiedOnly && <Check className="w-4 h-4 text-[#ffffff]" />}
             </div>
             <div>
                <span className="block text-sm font-semibold text-[#241d1b] leading-none mb-1">Verified Neighbors Only</span>
                <span className="text-xs font-medium text-[#333333]">Hide unverified lenders</span>
             </div>
             <input type="checkbox" checked={verifiedOnly} onChange={onToggleVerified} className="hidden" />
          </label>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-xs font-semibold text-[#333333] uppercase tracking-widest mb-4">Categories</h3>
          <div className="space-y-1">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => onSelectCategory(category === selectedCategory ? "" : category)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  selectedCategory === category 
                    ? "bg-[#7e0038] text-[#ffffff] shadow-none" 
                    : "text-[#333333] hover:bg-[#fcf3ec] hover:text-[#7e0038]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Conditions */}
        <div>
          <h3 className="text-xs font-semibold text-[#333333] uppercase tracking-widest mb-4">Item Condition</h3>
          <div className="flex flex-wrap gap-2">
            {conditions.map(condition => (
              <button
                key={condition}
                onClick={() => onSelectCondition(condition === selectedCondition ? "" : condition)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                  selectedCondition === condition 
                    ? "bg-[#7e0038] border-[#7e0038] text-[#ffffff] shadow-none" 
                    : "bg-[#ffffff] border-[#e5e5e5] text-[#333333] hover:border-[#7e0038] hover:bg-[#fcf3ec]"
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
