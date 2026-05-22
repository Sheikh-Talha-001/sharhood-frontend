import { DashboardCard } from "@/src/components/DashboardCard";
import { Shield, AlertTriangle, Ban, CheckCircle } from "lucide-react";

export function ActivityFeed() {
  const MOCK_ACTIVITY = [
    { id: "1", action: "Approved Verification", target: "Michael Ross", admin: "System Auto", time: "2 hours ago", icon: Shield, color: "text-blue-500", bg: "bg-blue-50" },
    { id: "2", action: "Resolved Report", target: "Broken Drill Listing", admin: "Admin Jane", time: "5 hours ago", icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
    { id: "3", action: "Suspended User", target: "John Doe", admin: "Admin Mark", time: "1 day ago", icon: Ban, color: "text-red-500", bg: "bg-red-50" },
    { id: "4", action: "Flagged Item", target: "Gas Generator", admin: "System Auto", time: "1 day ago", icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div>
         <h1 className="text-3xl font-bold tracking-tight text-gray-900">Admin Activity Feed</h1>
         <p className="text-gray-500 font-medium mt-1">Global log of all moderation and administrative actions.</p>
       </div>

       <DashboardCard title="Recent Actions">
         <div className="space-y-4">
            {MOCK_ACTIVITY.map((activity, index) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${activity.bg}`}>
                  <activity.icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                     <p className="font-bold text-gray-900">{activity.action}</p>
                     <span className="text-xs font-bold text-gray-400">{activity.time}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mt-0.5">Target: <span className="font-bold text-gray-800">{activity.target}</span></p>
                  <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-wide">Action by {activity.admin}</p>
                </div>
              </div>
            ))}
         </div>
       </DashboardCard>
    </div>
  );
}
