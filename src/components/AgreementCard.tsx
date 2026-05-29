import { useState } from "react";
import { FileText, Download, Calendar, Loader2 } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { format } from "date-fns";
import { agreementService } from "@/src/services/agreementService";
import { ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

export function AgreementCard({ agreement, isLender = false, onComplaintClick }: { agreement: any, isLender?: boolean, onComplaintClick?: (agreement: any) => void }) {
  const [isDownloading, setIsDownloading] = useState(false);

  // Map backend model to UI
  const item = agreement.item || {};
  const itemTitle = item.title || "Unknown Item";
  const itemImage = item.images?.[0] || item.image || "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&q=80";
  
  const borrowerName = agreement.borrower?.name || "Unknown Borrower";
  const lenderName = agreement.owner?.name || "Unknown Lender";
  
  const otherParty = isLender ? borrowerName : lenderName;
  const roleText = isLender ? "Lending to" : "Borrowing from";

  const startDate = agreement.borrowDate ? format(new Date(agreement.borrowDate), "MMM d, yyyy") : "TBD";
  const endDate = agreement.expectedReturnDate ? format(new Date(agreement.expectedReturnDate), "MMM d, yyyy") : "TBD";
  const price = agreement.totalPrice ? `$${agreement.totalPrice}` : "Free";
  const status = agreement.agreementStatus || agreement.status || "pending";

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const blob = await agreementService.generatePDF(agreement._id || agreement.id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${agreement.agreementNumber || "Agreement"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download agreement");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleView = async () => {
    setIsDownloading(true);
    try {
      const blob = await agreementService.generatePDF(agreement._id || agreement.id);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      window.open(url, "_blank");
      // Note: we can't revoke the URL immediately if we open it in a new tab,
      // the browser needs time to load it. Alternatively, users can just download it.
    } catch (error) {
      console.error("View failed:", error);
      toast.error("Failed to view agreement");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-4">
           <div className="size-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
             <img src={itemImage} alt={itemTitle} className="size-full object-cover" />
           </div>
           <div>
             <h4 className="font-bold text-gray-900 line-clamp-1">{itemTitle}</h4>
             <p className="text-sm font-medium text-gray-500 mt-0.5">{roleText} <span className="text-brand-black font-bold">{otherParty}</span></p>
           </div>
        </div>
        <StatusBadge status={status} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-5">
         <div className="bg-gray-50 p-3 rounded-2xl flex items-center gap-3">
           <Calendar className="size-5 text-gray-400" />
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
         <button type="button" 
           onClick={handleView}
           disabled={isDownloading}
           className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold text-sm py-2.5 rounded-full hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
         >
            <FileText className="size-4" />
            View Details
         </button>
         {(status === "active" || status === "completed") && (
           <button type="button" 
             onClick={handleDownload}
             disabled={isDownloading}
             className="flex-1 bg-brand-black text-white font-bold text-sm py-2.5 rounded-full hover:bg-brand-yellow hover:text-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:bg-brand-black disabled:hover:text-white"
           >
              {isDownloading ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
              {isDownloading ? "Downloading..." : "Download PDF"}
           </button>
         )}
      </div>
      {isLender && (status === "active" || status === "completed") && onComplaintClick && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={() => onComplaintClick(agreement)}
            className="text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-full transition-colors flex items-center gap-1.5"
          >
            <ShieldAlert className="size-3.5" /> Request Platform Help
          </button>
        </div>
      )}
    </div>
  );
}
