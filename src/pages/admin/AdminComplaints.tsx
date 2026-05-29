import { useState, useEffect } from "react";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { complaintService } from "@/src/services/complaintService";
import { AlertTriangle, ShieldCheck, X } from "lucide-react";
import toast from "react-hot-toast";

export function AdminComplaints() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [resolutionMessage, setResolutionMessage] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await complaintService.getAllComplaints();
      setComplaints(response.data || []);
    } catch (err) {
      toast.error("Failed to load complaints");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (action: "resolve" | "reject") => {
    if (!resolutionMessage.trim()) {
      toast.error(`Please provide a reason for the ${action}`);
      return;
    }

    try {
      if (action === "resolve") {
        await complaintService.resolveComplaint(selectedComplaint._id, resolutionMessage);
        toast.success("Complaint resolved successfully");
      } else {
        await complaintService.rejectComplaint(selectedComplaint._id, resolutionMessage);
        toast.success("Complaint rejected");
      }
      setSelectedComplaint(null);
      setResolutionMessage("");
      fetchComplaints();
    } catch (err: any) {
      toast.error(err.response?.data?.error || `Failed to ${action} complaint`);
    }
  };

  if (isLoading) {
    return <div className="py-20"><LoadingSpinner /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Owner</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Borrower</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Item</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {complaints.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">
                    No complaints found.
                  </td>
                </tr>
              ) : (
                complaints.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg ${
                        c.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                        c.status === 'under_review' ? 'bg-blue-50 text-blue-600' :
                        c.status === 'resolved' ? 'bg-green-50 text-green-600' :
                        'bg-red-50 text-red-600'
                      }`}>
                        {c.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-gray-900">{c.owner?.name}</td>
                    <td className="p-4 text-gray-600">{c.borrower?.name}</td>
                    <td className="p-4">
                      <span className="truncate max-w-[150px] inline-block text-gray-900 font-medium">
                        {c.item?.title}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 font-medium">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedComplaint(c)}
                        className="text-sm font-bold text-red-600 hover:text-red-700 hover:underline"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complaint Review Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-black/60 backdrop-blur-sm" onClick={() => setSelectedComplaint(null)} />
          
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Review Complaint</h2>
              <button 
                onClick={() => setSelectedComplaint(null)}
                className="size-10 rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 flex items-center justify-center"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Owner (Reporter)</span>
                  <span className="font-semibold text-gray-900">{selectedComplaint.owner?.name}</span>
                  <p className="text-sm text-gray-500">{selectedComplaint.owner?.email}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Borrower</span>
                  <span className="font-semibold text-gray-900">{selectedComplaint.borrower?.name}</span>
                  <p className="text-sm text-gray-500">{selectedComplaint.borrower?.email}</p>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Issue Description</span>
                <div className="bg-red-50 text-red-900 p-4 rounded-2xl text-sm font-medium">
                  {selectedComplaint.message}
                </div>
              </div>

              {selectedComplaint.proofImage && (
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Uploaded Proof</span>
                  <a href={selectedComplaint.proofImage} target="_blank" rel="noreferrer" className="block w-full max-w-xs rounded-xl overflow-hidden border-2 border-gray-100 hover:border-brand-yellow transition-colors">
                    <img src={selectedComplaint.proofImage} alt="Proof" className="w-full h-auto" />
                  </a>
                </div>
              )}

              {(selectedComplaint.status === "pending" || selectedComplaint.status === "under_review") ? (
                <div className="pt-6 border-t border-gray-100">
                  <label className="block text-sm font-bold text-gray-900 mb-2">Admin Resolution / Notes</label>
                  <textarea
                    value={resolutionMessage}
                    onChange={(e) => setResolutionMessage(e.target.value)}
                    className="w-full bg-gray-50 border-0 rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-brand-yellow min-h-[100px]"
                    placeholder="Explain your decision..."
                  />
                  
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleAction("reject")}
                      className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-3 rounded-full font-bold transition-colors"
                    >
                      Reject Complaint
                    </button>
                    <button
                      onClick={() => handleAction("resolve")}
                      className="flex-1 bg-red-600 text-white hover:bg-red-700 px-6 py-3 rounded-full font-bold flex justify-center items-center gap-2 transition-colors"
                    >
                      <ShieldCheck className="size-5" /> Mark Resolved
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-6 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Admin Resolution</span>
                  <div className="bg-gray-50 p-4 rounded-2xl text-sm font-medium text-gray-700">
                    {selectedComplaint.adminResolution || "No resolution message provided."}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    );
}
