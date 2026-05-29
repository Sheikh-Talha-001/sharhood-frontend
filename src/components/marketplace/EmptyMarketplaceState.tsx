import { PackageOpen } from "lucide-react";

interface Props {
  title?: string;
  description?: string;
  onClearFilters?: () => void;
}

export function EmptyMarketplaceState({ title = "No items found", description = "Try adjusting your search or filters to discover more items in your neighborhood.", onClearFilters }: Props) {
  return (
    <div className="bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 p-12 flex flex-col items-center justify-center text-center col-span-full min-h-[400px]">
      <div className="size-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
         <PackageOpen className="size-10 text-gray-300" />
      </div>
      <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">{title}</h3>
      <p className="text-gray-500 font-medium mb-8 max-w-md text-lg">
        {description}
      </p>
      {onClearFilters && (
        <button type="button" 
          onClick={onClearFilters}
          className="px-8 py-4 rounded-full bg-brand-black text-white font-bold hover:bg-brand-yellow hover:text-brand-black transition-colors shadow-lg"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}
