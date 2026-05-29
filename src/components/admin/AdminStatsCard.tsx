import { ShieldCheck, ShieldAlert, Users, Package, AlertTriangle, FileText, Activity } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  title: string;
  value: string | number;
  icon: any;
  path: string;
  trend?: string;
  colorClass?: string;
}

export function AdminStatsCard({ title, value, icon: Icon, path, trend, colorClass = "bg-brand-black text-white" }: Props) {
  return (
    <Link to={path} className="block group">
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
          <div className={`size-12 rounded-xl flex items-center justify-center ${colorClass}`}>
            <Icon className="size-6" />
          </div>
          {trend && (
             <div className="bg-gray-50 text-gray-500 text-xs font-bold px-2 py-1 rounded-md">
                {trend}
             </div>
          )}
        </div>
        <h3 className="text-gray-500 font-bold text-sm mb-1 uppercase tracking-wider">{title}</h3>
        <p className="text-3xl font-black text-gray-900 tracking-tight group-hover:text-brand-yellow transition-colors">{value}</p>
      </div>
    </Link>
  );
}
