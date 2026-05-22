import { PackageSearch, SearchX, AlertCircle, BellOff } from "lucide-react";
import React from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  type?: "items" | "search" | "error" | "notifications" | "custom";
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, type = "items", icon, action }: EmptyStateProps) {
  
  const getIcon = () => {
    if (icon) return icon;
    switch (type) {
      case "search":
        return <SearchX className="w-10 h-10" />;
      case "error":
        return <AlertCircle className="w-10 h-10 text-red-400" />;
      case "notifications":
        return <BellOff className="w-10 h-10" />;
      case "items":
      default:
        return <PackageSearch className="w-10 h-10" />;
    }
  };

  return (
    <div className="bg-white rounded-4xl border border-gray-100 p-12 text-center flex flex-col items-center justify-center min-h-[300px] shadow-sm">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${type === 'error' ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400'}`}>
           {getIcon()}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-500 font-medium max-w-sm mb-6 leading-relaxed">{description}</p>
        {action && (
          <div className="mt-2">
            {action}
          </div>
        )}
    </div>
  );
}
