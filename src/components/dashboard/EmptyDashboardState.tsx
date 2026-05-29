import { PackageOpen } from "lucide-react";
import { Link } from "react-router-dom";

export function EmptyDashboardState() {
  return (
    <div className="bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 p-8 md:p-12 flex flex-col items-center justify-center text-center">
      <div className="size-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
         <PackageOpen className="size-8 text-gray-300" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">Nothing here yet</h3>
      <p className="text-gray-500 font-medium mb-6 max-w-sm">
        Your recent activity will appear here once you start borrowing or lending items in your neighborhood.
      </p>
      <Link to="/dashboard/marketplace" className="px-6 py-3 rounded-full bg-brand-black text-white font-bold text-sm hover:bg-brand-yellow hover:text-brand-black transition-colors">
        Explore Items
      </Link>
    </div>
  );
}
