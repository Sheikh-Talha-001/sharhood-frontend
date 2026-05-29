import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
  actionOnClick?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionLink, actionOnClick }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-3xl border border-gray-100 shadow-sm animate-in fade-in duration-300">
      <div className="size-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <Icon className="size-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
        {description}
      </p>
      
      {(actionLabel && actionLink) && (
        <Link 
          to={actionLink}
          className="bg-brand-black text-white hover:bg-gray-800 px-8 py-3 rounded-full font-bold transition-colors"
        >
          {actionLabel}
        </Link>
      )}

      {(actionLabel && actionOnClick) && (
        <button 
          onClick={actionOnClick}
          className="bg-brand-black text-white hover:bg-gray-800 px-8 py-3 rounded-full font-bold transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
