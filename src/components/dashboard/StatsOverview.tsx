import { Package, ArrowRightLeft, FileText, Bell } from "lucide-react";

interface Props {
  stats: {
    totalListings: number;
    borrowRequestsMade: number;
    borrowRequestsReceived: number;
    activeAgreements: number;
    unreadNotifications: number;
  } | null;
}

export function StatsOverview({ stats }: Props) {
  const loading = !stats;

  const cards = [
    { label: "Active Listings", value: stats?.totalListings || 0, icon: Package, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "My Borrows", value: stats?.borrowRequestsMade || 0, icon: ArrowRightLeft, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Active Agreements", value: stats?.activeAgreements || 0, icon: FileText, color: "text-green-500", bg: "bg-green-50" },
    { label: "Unread Alerts", value: stats?.unreadNotifications || 0, icon: Bell, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
           <div className={`size-12 rounded-2xl flex items-center justify-center mb-4 ${card.bg} ${card.color}`}>
             <card.icon className="size-6" />
           </div>
           <div>
             <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{card.label}</span>
             {loading ? (
                <div className="h-8 bg-gray-100 rounded w-16 animate-pulse mt-1"></div>
             ) : (
                <span className="text-3xl font-black text-gray-900 leading-none">{card.value}</span>
             )}
           </div>
        </div>
      ))}
    </div>
  );
}
