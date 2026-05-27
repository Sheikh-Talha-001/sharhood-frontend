import { useEffect } from "react";
import { X, CheckCircle, XCircle } from "lucide-react";

interface Props {
  verification: any;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  isProcessing: boolean;
}

export function VerificationModal({ verification, onClose, onApprove, onReject, isProcessing }: Props) {
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!verification) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Identity Verification</h2>
            <p className="text-sm font-medium text-gray-500 mt-1">
              Reviewing application for: <span className="text-brand-black font-bold">{verification.user?.name}</span>
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 bg-gray-100 text-gray-600 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-8">
          
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8">
            <p className="text-sm text-blue-800 font-medium">
              <strong className="font-bold">Security Notice:</strong> You are viewing sensitive PII (Personally Identifiable Information). 
              These documents are only loaded securely for this session and will not be permanently stored in your dashboard state once this popup is closed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* ID Front Image */}
             <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  1. ID Front
                </h3>
                <div className="bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 aspect-[4/3] relative">
                  {verification.idFrontImage ? (
                    <img
                      src={verification.idFrontImage}
                      alt="ID Front"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24'%3E%3Ctext y='18' font-size='18'%3E🪪%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-medium">
                      No image uploaded
                    </div>
                  )}
                </div>
             </div>

             {/* Selfie with ID */}
             <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  2. Selfie with ID
                </h3>
                <div className="bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 aspect-[4/3] relative">
                  {verification.selfieWithId ? (
                    <img
                      src={verification.selfieWithId}
                      alt="Selfie with ID"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24'%3E%3Ctext y='18' font-size='18'%3E🤳%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-medium">
                      No selfie uploaded
                    </div>
                  )}
                </div>
             </div>
          </div>

          {/* ID Back Image (if available) */}
          {verification.idBackImage && (
            <div className="mt-8">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                3. ID Back
              </h3>
              <div className="bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 max-h-64 relative">
                <img
                  src={verification.idBackImage}
                  alt="ID Back"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
          
          {/* Metadata */}
          <div className="mt-8 border-t border-gray-100 pt-8 grid grid-cols-2 gap-4">
            <div>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">User Email</p>
               <p className="font-medium text-gray-900">{verification.user?.email}</p>
            </div>
            <div>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Submitted At</p>
               <p className="font-medium text-gray-900">{new Date(verification.createdAt).toLocaleString()}</p>
            </div>
            {verification.nationalIdNumber && (
              <div className="col-span-2">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">National ID / CNIC Number</p>
                 <p className="font-mono font-bold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg inline-block">
                   {verification.nationalIdNumber}
                 </p>
              </div>
            )}
            {verification.rejectionReason && (
              <div className="col-span-2">
                 <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Previous Rejection Reason</p>
                 <p className="font-medium text-red-700 bg-red-50 px-3 py-2 rounded-lg">{verification.rejectionReason}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-4 shrink-0">
          <button 
            onClick={onClose}
            disabled={isProcessing}
            className="px-6 py-3 rounded-full font-bold text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          
          <button 
            onClick={onReject}
            disabled={isProcessing}
            className="px-6 py-3 rounded-full font-bold bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <XCircle className="w-5 h-5" />
            Reject Application
          </button>

          <button 
            onClick={onApprove}
            disabled={isProcessing}
            className="px-8 py-3 rounded-full font-bold bg-green-500 text-white hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30 flex items-center gap-2 disabled:opacity-50"
          >
            <CheckCircle className="w-5 h-5" />
            Approve & Verify
          </button>
        </div>
      </div>
    </div>
  );
}
