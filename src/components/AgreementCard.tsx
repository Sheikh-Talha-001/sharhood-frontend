import { FileText, Download, Calendar } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

export interface AgreementProps {
  id: string;
  itemTitle: string;
  itemImage: string;
  lenderName: string;
  borrowerName: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected" | "active";
  price: string;
}

interface Props {
  agreement: AgreementProps;
  isLender?: boolean;
}

export function AgreementCard({ agreement, isLender = false }: Props) {
  const otherParty = isLender ? agreement.borrowerName : agreement.lenderName;
  const roleText = isLender ? "Lending to" : "Borrowing from";

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
             <img src={agreement.itemImage} alt={agreement.itemTitle} className="w-full h-full object-cover" />
           </div>
           <div>
             <h4 className="font-bold text-gray-900 line-clamp-1">{agreement.itemTitle}</h4>
             <p className="text-sm font-medium text-gray-500 mt-0.5">{roleText} <span className="text-brand-black font-bold">{otherParty}</span></p>
           </div>
        </div>
        <StatusBadge status={agreement.status} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-5">
         <div className="bg-gray-50 p-3 rounded-2xl flex items-center gap-3">
           <Calendar className="w-5 h-5 text-gray-400" />
           <div>
             <p className="text-xs font-bold text-gray-500 uppercase">Duration</p>
             <p className="text-sm font-semibold text-gray-900">{agreement.startDate} - {agreement.endDate}</p>
           </div>
         </div>
         <div className="bg-gray-50 p-3 rounded-2xl flex flex-col justify-center">
             <p className="text-xs font-bold text-gray-500 uppercase">Total Amount</p>
             <p className="text-sm font-bold text-gray-900">{agreement.price}</p>
         </div>
      </div>
      
      <div className="flex items-center gap-3">
         <button className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold text-sm py-2.5 rounded-full hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" />
            View Details
         </button>
         {agreement.status === "active" && (
           <button className="flex-1 bg-brand-black text-white font-bold text-sm py-2.5 rounded-full hover:bg-brand-yellow hover:text-black transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Download PDF
           </button>
         )}
      </div>
    </div>
  );
}
