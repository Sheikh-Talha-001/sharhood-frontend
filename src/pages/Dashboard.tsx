import { useState, useEffect } from "react";
import { Search, PenTool, ClipboardList, Settings } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";

import { dashboardService } from "@/src/services/dashboardService";
import { notificationService } from "@/src/services/notificationService";
import { borrowRequestService } from "@/src/services/borrowRequestService";
import { itemService } from "@/src/services/itemService";

import { DashboardHero } from "@/src/components/dashboard/DashboardHero";
import { StatsOverview } from "@/src/components/dashboard/StatsOverview";
import { TrustStatusCard } from "@/src/components/dashboard/TrustStatusCard";
import { QuickActionCard } from "@/src/components/dashboard/QuickActionCard";
import { RecentActivity } from "@/src/components/dashboard/RecentActivity";
import { EmptyDashboardState } from "@/src/components/dashboard/EmptyDashboardState";
import { DashboardSkeleton } from "@/src/components/dashboard/DashboardSkeleton";
import { NotificationCard } from "@/src/components/NotificationCard";
import { ItemCard } from "@/src/components/ItemCard";

export function Dashboard() {
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [trendingItems, setTrendingItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Execute all API requests in parallel for maximum performance
        const [summaryRes, notifRes, requestsRes, itemsRes] = await Promise.allSettled([
          dashboardService.getUserSummary(),
          notificationService.getAll(),
          borrowRequestService.getMyRequests(),
          itemService.getAll({ limit: 4 }) // Fetch recent 4 items
        ]);

        if (summaryRes.status === "fulfilled") setStats(summaryRes.value.data.stats);
        if (notifRes.status === "fulfilled") setNotifications(notifRes.value.data.slice(0, 3));
        if (requestsRes.status === "fulfilled") setRecentRequests(requestsRes.value.data.slice(0, 5));
        if (itemsRes.status === "fulfilled") setTrendingItems(itemsRes.value.data.slice(0, 4));

      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Could not load dashboard data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) return <DashboardSkeleton />;
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-3xl p-8 text-center text-red-600 font-bold">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Hero Section */}
      <DashboardHero user={user} />

      {/* 2. Overview Section */}
      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
           <StatsOverview stats={stats} />
        </div>
        <div className="lg:col-span-2 mb-8 lg:mb-0">
           <TrustStatusCard 
             verificationStatus={user?.verificationStatus} 
             partnerStatus={user?.partnerStatus} 
           />
        </div>
      </div>

      {/* 3. Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickActionCard 
          title="Browse Items" 
          description="Find tools and gear nearby" 
          icon={Search} 
          path="/dashboard/marketplace" 
          colorClass="bg-blue-50 text-blue-500"
        />
        <QuickActionCard 
          title="Post an Item" 
          description="Earn by lending your gear" 
          icon={PenTool} 
          path="/dashboard/partner" 
          colorClass="bg-green-50 text-green-500"
        />
        <QuickActionCard 
          title="My Agreements" 
          description="Manage active rentals" 
          icon={ClipboardList} 
          path="/dashboard/agreements" 
          colorClass="bg-purple-50 text-purple-500"
        />
        <QuickActionCard 
          title="Profile Settings" 
          description="Update your details" 
          icon={Settings} 
          path="/dashboard/profile" 
          colorClass="bg-orange-50 text-orange-500"
        />
      </div>

      {/* 4. Feed & Notifications Layer */}
      <div className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2">
            {recentRequests.length > 0 ? (
               <RecentActivity requests={recentRequests} />
            ) : (
               <EmptyDashboardState />
            )}
         </div>
         
         <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
            <h3 className="text-lg font-black text-gray-900 mb-6">Recent Alerts</h3>
            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.map((notif: any) => (
                  <NotificationCard key={notif._id || notif.id} notification={notif} />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm font-medium text-gray-500">You're all caught up!</p>
                </div>
              )}
            </div>
         </div>
      </div>

      {/* 5. Trending Items */}
      <div className="pt-4">
         <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-900">Trending Nearby</h2>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingItems.length > 0 ? (
              trendingItems.map((item: any) => (
                <ItemCard key={item._id || item.id} item={item} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                 <p className="text-sm font-medium text-gray-500">No items available right now.</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
