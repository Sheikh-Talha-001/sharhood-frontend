import { useState } from "react";
import { X, Flag, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { reportService } from "@/src/services/reportService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: 'user' | 'item';
  targetId: string;
  targetName: string;
}

const REASONS = [
  "Inappropriate Content",
  "Scam or Fraud",
  "Harassment or Abuse",
  "Spam",
  "Item Not As Described",
  "Other"
];

export function ReportModal({ isOpen, onClose, type, targetId, targetName }: Props) {
  const [reason, setReason] = useState(REASONS[0]);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      return toast.error("Please provide a description");
    }

    setIsSubmitting(true);
    try {
      await reportService.create({
        [type === 'user' ? 'reportedUser' : 'reportedItem']: targetId,
        reason,
        description
      });
      toast.success("Report submitted successfully");
      onClose();
      setDescription("");
      setReason(REASONS[0]);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to submit report");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Report {type === 'user' ? 'User' : 'Item'}</h2>
              <p className="text-sm font-medium text-gray-500">You are reporting <span className="font-bold text-gray-900">{targetName}</span></p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Reason for reporting</label>
              <select 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all font-medium appearance-none"
              >
                {REASONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Provide details
              </label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please explain why you are reporting this. Admins will review this information."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all font-medium h-32 resize-none"
                required
              />
            </div>
            
            <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
              <p className="text-xs text-orange-800 font-medium leading-relaxed">
                <span className="font-bold">Note:</span> False reports may lead to account suspension. Please only submit a report if you believe this {type} violates our community guidelines.
              </p>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 px-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3.5 px-4 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Report"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
