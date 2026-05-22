import { useState, useEffect } from "react";
import { Shield, UploadCloud, CheckCircle } from "lucide-react";
import { verificationService } from "@/src/services/verificationService";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { useAuth } from "@/src/context/AuthContext";

export function Verification() {
  const { user, checkAuthStatus } = useAuth();
  const [status, setStatus] = useState<"pending" | "approved" | "unsubmitted" | "rejected">("unsubmitted");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await verificationService.getStatus();
        if (response.data) {
          setStatus(response.data.status); // 'pending', 'approved', or 'rejected'
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setStatus("unsubmitted");
        } else {
          setError("Failed to fetch verification status");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a document image.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('idDocument', file);
      
      await verificationService.submit(formData);
      setStatus("pending");
      await checkAuthStatus(); // Refresh user context just in case
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to submit verification");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="py-20"><LoadingSpinner /></div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
           <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Identity Verification</h1>
        <p className="text-gray-500 font-medium mt-2 max-w-xl mx-auto">To maintain a secure and trustworthy community, we require all users to verify their identity before borrowing or lending items.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
         {/* Steps Header for unsubmitted */}
         {status === "unsubmitted" && (
           <div className="flex border-b border-gray-100 bg-gray-50">
              <div className="flex-1 p-4 text-center border-r border-gray-100">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold ${step === 1 ? 'bg-brand-black text-white' : 'bg-green-100 text-green-600'}`}>1</div>
                 <span className="text-sm font-bold text-gray-900">Basic Info</span>
              </div>
              <div className="flex-1 p-4 text-center border-r border-gray-100">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold ${step === 2 ? 'bg-brand-black text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                 <span className={`text-sm font-bold ${step === 2 ? 'text-gray-900' : 'text-gray-500'}`}>Document Upload</span>
              </div>
           </div>
         )}

         <div className="p-8 md:p-12">
            {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl font-bold text-sm text-center">{error}</div>}

            {status === "unsubmitted" && step === 1 && (
              <div className="space-y-6">
                 <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Legal First Name</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all font-medium" />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Legal Last Name</label>
                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all font-medium" />
                 </div>
                 <div className="pt-4">
                    <button onClick={() => setStep(2)} className="w-full bg-brand-black text-white font-bold py-4 rounded-full hover:bg-brand-yellow hover:text-brand-black transition-all">Next Step: Document Upload</button>
                 </div>
              </div>
            )}

            {status === "unsubmitted" && step === 2 && (
              <div className="space-y-6">
                 <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50">
                    <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 font-bold mb-2">Upload ID Document (Driver's License or Passport)</p>
                    <p className="text-gray-500 text-sm mb-6">JPG, PNG up to 5MB</p>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-yellow file:text-brand-black hover:file:bg-brand-black hover:file:text-white" />
                 </div>
                 <div className="pt-4 flex gap-4">
                    <button onClick={() => setStep(1)} className="px-6 py-4 rounded-full bg-gray-100 font-bold hover:bg-gray-200 transition-colors">Back</button>
                    <button onClick={handleSubmit} className="flex-1 bg-brand-black text-white font-bold py-4 rounded-full hover:bg-brand-yellow hover:text-brand-black transition-all">Submit Verification</button>
                 </div>
              </div>
            )}

            {status === "pending" && (
              <div className="text-center py-8">
                 <div className="w-20 h-20 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-10 h-10" />
                 </div>
                 <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Pending</h2>
                 <p className="text-gray-500 font-medium">An admin is reviewing your document. This usually takes 1-2 business days.</p>
              </div>
            )}

            {status === "approved" && (
              <div className="text-center py-8">
                 <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10" />
                 </div>
                 <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Complete</h2>
                 <p className="text-gray-500 font-medium">Thank you! Your identity has been verified.</p>
              </div>
            )}

            {status === "rejected" && (
              <div className="text-center py-8">
                 <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-10 h-10" />
                 </div>
                 <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Rejected</h2>
                 <p className="text-gray-500 font-medium mb-6">Unfortunately, your document was not accepted. Please try again with a clearer image.</p>
                 <button onClick={() => {setStatus("unsubmitted"); setStep(1);}} className="bg-brand-black text-white px-8 py-3 rounded-full font-bold hover:bg-brand-yellow hover:text-black">Try Again</button>
              </div>
            )}
         </div>
      </div>
      
      <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider mt-8 flex items-center justify-center gap-2">
        <Shield className="w-4 h-4" /> Your data is encrypted and stored securely.
      </p>
    </div>
  );
}
