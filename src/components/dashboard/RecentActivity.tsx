import { Link } from "react-router-dom";
import { ArrowRightLeft, Clock, CheckCircle2, XCircle } from "lucide-react";

interface Props {
  requests: any[];
}

export function RecentActivity({ requests }: Props) {
  if (!requests || requests.length === 0) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case "approved": return "bg-green-100 text-green-700 border-green-200";
      case "rejected": return "bg-red-100 text-red-700 border-red-200";
      case "returned": return "bg-blue-100 text-blue-700 border-blue-200";
      case "cancelled": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-orange-100 text-orange-700 border-orange-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case "approved":
      case "returned": return <CheckCircle2 className="size-4" />;
      case "rejected":
      case "cancelled": return <XCircle className="size-4" />;
      default: return <Clock className="size-4" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
         <h3 className="text-lg font-black text-gray-900">Recent Borrow Requests</h3>
         <Link to="/dashboard/agreements" className="text-xs font-bold text-brand-black uppercase tracking-wider hover:text-brand-yellow transition-colors">
           View All
         </Link>
      </div>
      <div className="divide-y divide-gray-100">
        {requests.map((req) => (
          <div key={req._id} className="p-6 md:p-8 flex items-center gap-6 hover:bg-gray-50/50 transition-colors">
            <div className="size-12 rounded-2xl bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden">
               {req.item?.images?.[0] ? (
                 <img src={req.item.images[0]} alt={req.item.title} className="size-full object-cover" />
               ) : (
                 <ArrowRightLeft className="size-5 text-gray-400" />
               )}
            </div>
            <div className="flex-1">
               <div className="flex items-center gap-3 mb-1">
                 <h4 className="font-bold text-gray-900 text-base">{req.item?.title || "Unknown Item"}</h4>
                 <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(req.status)}`}>
                    {getStatusIcon(req.status)}
                    {req.status}
                 </div>
               </div>
               <p className="text-sm font-medium text-gray-500">
                 Requested {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "Recently"}
               </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
