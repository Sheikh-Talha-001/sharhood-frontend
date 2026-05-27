import { FileText, Download, Calendar } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { format } from "date-fns";

export function AgreementCard({ agreement, isLender = false }: { agreement: any, isLender?: boolean }) {
  // Map backend model to UI
  const item = agreement.item || {};
  const itemTitle = item.title || "Unknown Item";
  const itemImage = item.images?.[0] || item.image || "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&q=80";
  
  const borrowerName = agreement.borrower?.name || "Unknown Borrower";
  const lenderName = agreement.owner?.name || "Unknown Lender";
  
  const otherParty = isLender ? borrowerName : lenderName;
  const roleText = isLender ? "Lending to" : "Borrowing from";

  const startDate = agreement.startDate ? format(new Date(agreement.startDate), "MMM d, yyyy") : "TBD";
  const endDate = agreement.endDate ? format(new Date(agreement.endDate), "MMM d, yyyy") : "TBD";
  const price = agreement.totalPrice ? `$${agreement.totalPrice}` : "Free";

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
             <img src={itemImage} alt={itemTitle} className="w-full h-full object-cover" />
           </div>
           <div>
             <h4 className="font-bold text-gray-900 line-clamp-1">{itemTitle}</h4>
             <p className="text-sm font-medium text-gray-500 mt-0.5">{roleText} <span className="text-brand-black font-bold">{otherParty}</span></p>
           </div>
        </div>
        <StatusBadge status={agreement.status || "pending"} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-5">
         <div className="bg-gray-50 p-3 rounded-2xl flex items-center gap-3">
           <Calendar className="w-5 h-5 text-gray-400" />
           <div>
             <p className="text-xs font-bold text-gray-500 uppercase">Duration</p>
             <p className="text-sm font-semibold text-gray-900">{startDate} - {endDate}</p>
           </div>
         </div>
         <div className="bg-gray-50 p-3 rounded-2xl flex flex-col justify-center">
             <p className="text-xs font-bold text-gray-500 uppercase">Total Amount</p>
             <p className="text-sm font-bold text-gray-900">{price}</p>
         </div>
      </div>
      
      <div className="flex items-center gap-3">
         <button className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold text-sm py-2.5 rounded-full hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" />
            View Details
         </button>
         {(agreement.status === "approved" || agreement.status === "active") && (
           <button className="flex-1 bg-brand-black text-white font-bold text-sm py-2.5 rounded-full hover:bg-brand-yellow hover:text-black transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Download PDF
           </button>
         )}
      </div>
    </div>
  );
}
