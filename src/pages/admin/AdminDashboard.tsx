import { Users, Shield, Store, AlertTriangle, Package, Activity, Ban } from "lucide-react";
import { adminService } from "@/src/services/adminService";
import { useState, useEffect } from "react";
import { AdminStatsCard } from "@/src/components/admin/AdminStatsCard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

// Realistic mockup data for the charts since backend doesn't provide timeseries
const activityData = [
  { name: 'Mon', verifications: 12, users: 45, items: 32 },
  { name: 'Tue', verifications: 19, users: 52, items: 40 },
  { name: 'Wed', verifications: 15, users: 48, items: 35 },
  { name: 'Thu', verifications: 22, users: 61, items: 50 },
  { name: 'Fri', verifications: 28, users: 70, items: 65 },
  { name: 'Sat', verifications: 35, users: 95, items: 85 },
  { name: 'Sun', verifications: 30, users: 82, items: 70 },
];

const reportsData = [
  { name: 'Jan', resolved: 40, pending: 24, dismissed: 24 },
  { name: 'Feb', resolved: 30, pending: 13, dismissed: 22 },
  { name: 'Mar', resolved: 20, pending: 48, dismissed: 22 },
  { name: 'Apr', resolved: 27, pending: 39, dismissed: 20 },
  { name: 'May', resolved: 18, pending: 28, dismissed: 21 },
  { name: 'Jun', resolved: 23, pending: 38, dismissed: 25 },
];

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

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
         <div className="h-10 bg-gray-200 rounded w-1/4"></div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-32 bg-gray-200 rounded-3xl"></div>)}
         </div>
      </div>
    );
  }
  if (error) return <div className="py-20 text-center text-red-500 font-bold bg-red-50 rounded-3xl border border-red-100">{error}</div>;

  return (
    <div className="space-y-8 pb-12">
       <div>
         <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">Platform Overview</h1>
         <p className="text-gray-500 font-medium">Real-time metrics and moderation queue status.</p>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminStatsCard 
             title="Total Users" 
             value={data?.users?.total || 0} 
             icon={Users} 
             path="/admin/users" 
             colorClass="bg-blue-50 text-blue-500" 
             trend="+12% this week"
          />
          <AdminStatsCard 
             title="Verified Users" 
             value={data?.users?.verified || 0} 
             icon={Shield} 
             path="/admin/users?verified=true" 
             colorClass="bg-green-50 text-green-500" 
          />
          <AdminStatsCard 
             title="Active Items" 
             value={data?.items?.total || 0} 
             icon={Package} 
             path="/admin/items" 
             colorClass="bg-gray-100 text-gray-800" 
          />
          <AdminStatsCard 
             title="Active Borrows" 
             value={data?.activeBorrowRequests || 0} 
             icon={Activity} 
             path="/admin" 
             colorClass="bg-purple-50 text-purple-500" 
          />
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <AdminStatsCard 
             title="Pending Verifications" 
             value={data?.pendingVerifications || 0} 
             icon={Shield} 
             path="/admin/verifications" 
             colorClass="bg-brand-yellow text-brand-black" 
          />
          <AdminStatsCard 
             title="Pending Reports" 
             value={data?.pendingReports || 0} 
             icon={AlertTriangle} 
             path="/admin/reports" 
             colorClass="bg-red-50 text-red-500" 
          />
          <AdminStatsCard 
             title="Suspended Users" 
             value={data?.users?.suspended || 0} 
             icon={Ban} 
             path="/admin/users?suspended=true" 
             colorClass="bg-gray-900 text-white" 
          />
       </div>
       
       {/* Charts Section */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
          
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
             <div className="flex items-center justify-between mb-8">
               <h2 className="text-xl font-bold text-gray-900">User Growth & Activity</h2>
               <select className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 outline-none">
                 <option>Last 7 Days</option>
               </select>
             </div>
             <div className="h-72 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorItems" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                   <Tooltip 
                     contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                     labelStyle={{ fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}
                   />
                   <Area type="monotone" dataKey="users" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                   <Area type="monotone" dataKey="items" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorItems)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
             <div className="flex items-center justify-between mb-8">
               <h2 className="text-xl font-bold text-gray-900">Moderation Overview</h2>
               <select className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 outline-none">
                 <option>Last 6 Months</option>
               </select>
             </div>
             <div className="h-72 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={reportsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                   <Tooltip 
                     cursor={{fill: '#F9FAFB'}}
                     contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                   />
                   <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }} />
                   <Bar dataKey="pending" name="Pending" stackId="a" fill="#F59E0B" radius={[0, 0, 4, 4]} />
                   <Bar dataKey="resolved" name="Resolved" stackId="a" fill="#10B981" />
                   <Bar dataKey="dismissed" name="Dismissed" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>

       </div>
    </div>
  );
}
