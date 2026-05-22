import { DashboardCard } from "@/src/components/DashboardCard";
import { Users, Shield, Store, AlertTriangle, Package, Activity, Ban } from "lucide-react";
import { adminService } from "@/src/services/adminService";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { useState, useEffect } from "react";

export function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await adminService.getSummary();
        setData(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load admin summary.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const stats = data ? [
    { label: "Total Users", value: data.totalUsers || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Verified Users", value: data.verifiedUsers || 0, icon: Shield, color: "text-green-500", bg: "bg-green-50" },
    { label: "Pending Verifications", value: data.pendingVerifications || 0, icon: Activity, color: "text-brand-orange", bg: "bg-orange-50" },
    { label: "Pending Partner Apps", value: data.pendingPartnerApps || 0, icon: Store, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Active Items", value: data.totalItems || 0, icon: Package, color: "text-brand-black", bg: "bg-gray-100" },
    { label: "Pending Reports", value: data.pendingReports || 0, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" },
    { label: "Suspended Users", value: data.suspendedUsers || 0, icon: Ban, color: "text-gray-500", bg: "bg-gray-100" },
  ] : [];

  if (isLoading) return <div className="py-20"><LoadingSpinner /></div>;
  if (error) return <div className="py-20 text-center text-red-500 font-bold">{error}</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
       <div>
         <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Dashboard</h1>
         <p className="text-gray-500 font-medium mt-1">Platform overview and moderation metrics.</p>
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         {stats.map((s, i) => (
           <DashboardCard key={i} title={s.label}>
              <div className="flex items-center justify-between mt-2">
                <span className="text-4xl font-black text-brand-black">{s.value}</span>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${s.bg}`}>
                  <s.icon className={`w-6 h-6 ${s.color}`} />
                </div>
              </div>
           </DashboardCard>
         ))}
       </div>
       
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <DashboardCard title="Recent Activity">
            <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
               <Activity className="w-8 h-8 text-gray-300 mb-2" />
               <p className="text-gray-400 font-medium">Activity Chart Placeholder</p>
            </div>
         </DashboardCard>
         <DashboardCard title="Reports Overview">
            <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
               <AlertTriangle className="w-8 h-8 text-gray-300 mb-2" />
               <p className="text-gray-400 font-medium">Reports Chart Placeholder</p>
            </div>
         </DashboardCard>
       </div>
    </div>
  );
}
