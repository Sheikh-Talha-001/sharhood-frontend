import { DashboardCard } from "@/src/components/DashboardCard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, LineChart, Line } from 'recharts';
import { Activity as ActivityIcon, Users, Shield, Package } from "lucide-react";

import { useState, useEffect } from "react";
import { adminService } from "@/src/services/adminService";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";

export function ActivityFeed() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await adminService.getSummary();
        setData(response.data);
      } catch (err) {
        console.error("Failed to load activity data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <div className="py-20"><LoadingSpinner /></div>;

  const weeklyTraffic = data?.timeseries?.activityData || [];
  const moderationTrends = data?.timeseries?.reportsData || [];

  const signupsCount = weeklyTraffic.reduce((acc: number, curr: any) => acc + (curr.signups || 0), 0);
  const listingsCount = weeklyTraffic.reduce((acc: number, curr: any) => acc + (curr.listings || 0), 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
       <div>
         <h1 className="text-3xl font-black tracking-tight text-gray-900">Analytics & Trends</h1>
         <p className="text-gray-500 font-medium mt-1">Deep dive into platform health and user behavior.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="size-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
              <Users className="size-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Signups (7d)</p>
              <p className="text-2xl font-black text-gray-900">+{signupsCount}</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="size-12 bg-green-50 text-green-500 rounded-xl flex items-center justify-center">
              <Package className="size-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">New Listings (7d)</p>
              <p className="text-2xl font-black text-gray-900">+{listingsCount}</p>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="size-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
              <Shield className="size-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Users</p>
              <p className="text-2xl font-black text-gray-900">{data?.users?.total || 0}</p>
            </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
             <div className="mb-8">
               <h2 className="text-xl font-bold text-gray-900">Acquisition Trends</h2>
               <p className="text-sm text-gray-500">Signups vs Listings added over the last 7 days.</p>
             </div>
             <div className="h-80 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={weeklyTraffic} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorListings" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                   <Tooltip 
                     contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                   />
                   <Legend wrapperStyle={{ paddingTop: '20px' }} />
                   <Area type="monotone" dataKey="signups" name="New Signups" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorSignups)" />
                   <Area type="monotone" dataKey="listings" name="New Listings" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorListings)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
             <div className="mb-8">
               <h2 className="text-xl font-bold text-gray-900">Moderation Load</h2>
               <p className="text-sm text-gray-500">Reports and suspensions.</p>
             </div>
             <div className="h-80 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={moderationTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                   <Tooltip 
                     contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                   />
                   <Legend wrapperStyle={{ paddingTop: '20px' }} />
                   <Line type="monotone" dataKey="reports" name="Reports Filed" stroke="#EF4444" strokeWidth={3} dot={{r: 4}} />
                 </LineChart>
               </ResponsiveContainer>
             </div>
          </div>
       </div>
    </div>
  );
}
