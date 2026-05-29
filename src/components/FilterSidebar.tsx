import { CheckSquare } from "lucide-react";

interface Props {
  options: { label: string; value: string; count?: number }[];
  selected: string[];
  onChange: (value: string) => void;
  onClear?: () => void;
  title: string;
}

export function FilterSidebar({ options, selected, onChange, onClear, title }: Props) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-gray-900">{title}</h3>
        {selected.length > 0 && onClear && (
          <button type="button" 
            onClick={onClear}
            className="text-xs font-bold text-gray-400 hover:text-brand-black transition-colors"
          >
            Clear
          </button>
        )}
      </div>
      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = selected.includes(option.value);
          return (
            <label key={option.value} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className={`size-5 rounded border flex items-center justify-center transition-colors ${isSelected ? "border-brand-black bg-brand-black text-white shadow-sm" : "border-gray-300 bg-white group-hover:border-gray-400"}`}>
                   {isSelected && <CheckSquare className="size-3.5" />}
                </div>
                <span className={`text-sm font-medium transition-colors ${isSelected ? "text-gray-900" : "text-gray-600 group-hover:text-gray-900"}`}>
                  {option.label}
                </span>
              </div>
              {option.count !== undefined && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md transition-colors ${isSelected ? "bg-brand-black text-brand-yellow" : "text-gray-400 bg-gray-50 group-hover:bg-gray-100"}`}>
                  {option.count}
                </span>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}

