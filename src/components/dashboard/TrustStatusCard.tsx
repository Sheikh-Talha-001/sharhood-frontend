import { Shield, Store, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  verificationStatus?: string;
  partnerStatus?: string;
}

export function TrustStatusCard({ verificationStatus, partnerStatus }: Props) {
  
  const getStatusDisplay = (status?: string) => {
    switch(status) {
      case "verified":
      case "approved":
        return { text: "Verified", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", border: "border-green-100" };
      case "pending":
        return { text: "Reviewing", icon: Clock, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" };
      case "rejected":
        return { text: "Action Needed", icon: AlertCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" };
      default:
        return { text: "Unverified", icon: AlertCircle, color: "text-gray-500", bg: "bg-gray-100", border: "border-gray-200" };
    }
  };

  const idStatus = getStatusDisplay(verificationStatus);
  const partStatus = getStatusDisplay(partnerStatus);

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-full flex flex-col justify-between min-h-[220px]">
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Account Trust Status</h3>
        
        <div className="space-y-4">
          <Link to="/dashboard/verification" className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer group">
            <div className="flex items-center gap-3">
               <div className="size-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                  <Shield className="size-5" />
               </div>
               <div>
                  <h4 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">Identity Status</h4>
                  <p className="text-xs font-medium text-gray-500">Required to borrow</p>
               </div>
            </div>
            <div className={`px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${idStatus.bg} ${idStatus.border}`}>
               <idStatus.icon className={`size-3.5 ${idStatus.color}`} />
               <span className={`text-[10px] font-bold uppercase tracking-wider ${idStatus.color}`}>{idStatus.text}</span>
            </div>
          </Link>

          <Link to="/dashboard/partner" className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer group">
            <div className="flex items-center gap-3">
               <div className="size-10 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center shrink-0">
                  <Store className="size-5" />
               </div>
               <div>
                  <h4 className="font-bold text-gray-900 text-sm group-hover:text-purple-600 transition-colors">Partner Status</h4>
                  <p className="text-xs font-medium text-gray-500">Required to list items</p>
               </div>
            </div>
            <div className={`px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${partStatus.bg} ${partStatus.border}`}>
               <partStatus.icon className={`size-3.5 ${partStatus.color}`} />
               <span className={`text-[10px] font-bold uppercase tracking-wider ${partStatus.color}`}>{partStatus.text}</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
