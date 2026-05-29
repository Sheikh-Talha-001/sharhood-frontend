import { useState, useEffect } from "react";
import { complaintService } from "@/src/services/complaintService";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { ShieldAlert, MessageSquare, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

export function Complaints() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await complaintService.getMyComplaints();
      setComplaints(response.data || []);
    } catch (err: any) {
      toast.error("Failed to load your complaints");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="py-20"><LoadingSpinner /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">Platform Help & Complaints</h1>
        <p className="text-gray-500 font-medium mt-1">Track issues escalated to Lendly admins.</p>
      </div>

      {complaints.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
          <div className="size-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="size-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No complaints filed</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            You can request platform help from the Agreements or Incoming Requests page if you encounter issues with a borrower.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="bg-white rounded-3xl border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex gap-4 items-center">
                  <div className="size-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={complaint.item?.image || complaint.item?.images?.[0]} alt="" className="size-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">
                      {complaint.item?.title || "Unknown Item"}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 mt-0.5">
                      Borrower: <span className="font-bold text-brand-black">{complaint.borrower?.name}</span>
                    </p>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  complaint.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                  complaint.status === 'under_review' ? 'bg-blue-50 text-blue-600' :
                  complaint.status === 'resolved' ? 'bg-green-50 text-green-600' :
                  'bg-red-50 text-red-600'
                }`}>
                  {complaint.status.replace("_", " ")}
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 mb-4 relative">
                <MessageSquare className="size-4 text-gray-400 absolute top-5 left-5" />
                <p className="pl-8 text-sm font-medium text-gray-700 italic">"{complaint.message}"</p>
              </div>

              {complaint.proofImage && (
                <div className="mb-4">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Attached Proof</span>
                  <a href={complaint.proofImage} target="_blank" rel="noreferrer" className="inline-block rounded-xl overflow-hidden border border-gray-200 hover:border-brand-yellow transition-colors">
                    <img src={complaint.proofImage} alt="Proof" className="h-20 w-auto object-cover" />
                  </a>
                </div>
              )}

              {complaint.adminResolution && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2 text-brand-black">
                    <ShieldAlert className="size-4" />
                    <h4 className="text-sm font-bold uppercase tracking-wider">Admin Resolution</h4>
                  </div>
                  <p className="text-sm text-gray-600 font-medium bg-brand-yellow/10 p-4 rounded-xl">
                    {complaint.adminResolution}
                  </p>
                </div>
              )}
              
              <div className="text-xs text-gray-400 font-medium text-right mt-4">
                Submitted on {new Date(complaint.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
