import { useState, useRef } from "react";
import { X, Upload, FileImage, ShieldAlert, Loader2 } from "lucide-react";
import { complaintService } from "@/src/services/complaintService";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  agreementId: string;
  itemTitle: string;
}

export function ComplaintModal({ isOpen, onClose, agreementId, itemTitle }: Props) {
  const [message, setMessage] = useState("");
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPG, PNG, etc)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setProofImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please describe the issue");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("agreementId", agreementId);
      formData.append("message", message);
      if (proofImage) {
        formData.append("proofImage", proofImage);
      }

      await complaintService.submitComplaint(formData);
      toast.success("Complaint submitted successfully. An admin will review it.");
      onClose();
      setMessage("");
      setProofImage(null);
      setPreview(null);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to submit complaint");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-brand-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3 text-red-600">
            <div className="size-10 bg-red-50 rounded-full flex items-center justify-center">
              <ShieldAlert className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">Request Platform Help</h2>
              <p className="text-sm font-medium text-gray-500">For: {itemTitle}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="size-10 rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors flex items-center justify-center"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                What went wrong? <span className="text-red-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explain the issue (e.g., item not returned, item damaged, borrower unresponsive)"
                className="w-full bg-gray-50 border-0 rounded-2xl p-4 text-gray-900 focus:ring-2 focus:ring-brand-yellow focus:bg-white transition-all min-h-[120px]"
                maxLength={2000}
                required
              />
              <div className="text-right mt-1 text-xs text-gray-400 font-medium">
                {message.length}/2000
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Upload Proof (Optional)
              </label>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />

              {preview ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-gray-100 group">
                  <img src={preview} alt="Proof preview" className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold text-sm"
                    >
                      Change Image
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-brand-yellow hover:bg-brand-yellow/5 transition-colors flex flex-col items-center gap-3"
                >
                  <div className="size-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                    <Upload className="size-6" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Upload screenshot or photo</p>
                    <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3.5 rounded-full font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="flex-1 px-6 py-3.5 rounded-full font-bold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-5 animate-spin" /> Submitting...
                </>
              ) : (
                "Submit Complaint"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
