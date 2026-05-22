import { Link } from "react-router-dom";
import { ArrowRight, Shield, Bell, Store } from "lucide-react";
import { useState, useEffect } from "react";
import { DashboardCard } from "@/src/components/DashboardCard";
import { VerificationBadge } from "@/src/components/VerificationBadge";
import { NotificationCard } from "@/src/components/NotificationCard";
import { ItemCard } from "@/src/components/ItemCard";
import { useAuth } from "@/src/context/AuthContext";
import { dashboardService } from "@/src/services/dashboardService";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";

export function Dashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await dashboardService.getUserSummary();
        setDashboardData(response.data);
      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Could not load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-center py-20 text-red-500 font-bold">{error}</div>;

  return (
    <div className="space-y-6">
       <div>
         <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋</h1>
         <p className="text-gray-500 font-medium mt-1">Here's what's happening in your neighborhood today.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard title="Identity Status" icon={<Shield className="w-5 h-5" />}>
            <div className="flex flex-col items-start gap-4">
               <VerificationBadge status={user?.isVerified ? "verified" : "unverified"} type="identity" />
               <p className="text-sm font-medium text-gray-600 leading-relaxed">
                 {user?.isVerified 
                   ? "Your identity is verified. You can now borrow items and apply to become a partner."
                   : "Verify your identity to start borrowing items from your neighbors."}
               </p>
               <Link to="/dashboard/verification" className="text-sm font-bold text-brand-black hover:text-brand-yellow transition-colors underline underline-offset-4">Manage Verification</Link>
            </div>
          </DashboardCard>

          <DashboardCard title="Partner Status" icon={<Store className="w-5 h-5" />}>
             <div className="flex flex-col items-start gap-4">
               <VerificationBadge status={user?.isPartner ? "verified" : "unverified"} type="partner" />
               <p className="text-sm font-medium text-gray-600 leading-relaxed">
                 {user?.isPartner
                   ? "You are an approved partner. Manage your listings and earnings."
                   : "Become a partner to list your items and earn money from your neighbors."}
               </p>
               <Link to="/dashboard/partner" className="text-sm font-bold text-brand-black hover:text-brand-yellow transition-colors underline underline-offset-4 flex items-center gap-1 group">
                 {user?.isPartner ? "Manage Items" : "Apply Now"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
          </DashboardCard>

          <DashboardCard 
            title="Recent Notifications" 
            icon={<Bell className="w-5 h-5" />}
            action={
              <Link to="/dashboard/notifications" className="text-xs font-bold text-brand-black bg-gray-50 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">
                View All
              </Link>
            }
          >
             <div className="space-y-4">
               {dashboardData?.notifications?.length > 0 ? (
                 dashboardData.notifications.slice(0, 3).map((n: any) => (
                   <NotificationCard key={n._id || n.id} notification={n} />
                 ))
               ) : (
                 <p className="text-sm text-gray-500 font-medium">No new notifications.</p>
               )}
             </div>
          </DashboardCard>
       </div>

       <h2 className="text-2xl font-bold tracking-tight text-gray-900 mt-8 mb-6">Trending Nearby</h2>
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardData?.trendingItems?.length > 0 ? (
            dashboardData.trendingItems.slice(0, 3).map((item: any) => (
              <ItemCard key={item._id || item.id} item={item} />
            ))
          ) : (
            <div className="col-span-full md:col-span-2 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center text-center">
              <p className="text-sm font-medium text-gray-500">No items available right now.</p>
            </div>
          )}
          <div className="bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-6 text-center min-h-[300px] hover:bg-gray-100 transition-colors group cursor-pointer">
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
               <ArrowRight className="w-6 h-6 text-gray-400" />
             </div>
             <h3 className="font-bold text-gray-900 mb-1">Browse More</h3>
             <p className="text-sm font-medium text-gray-500">Discover 1,000+ items in your area</p>
             <Link to="/dashboard/marketplace" className="absolute inset-0" />
          </div>
       </div>
    </div>
  );
}
