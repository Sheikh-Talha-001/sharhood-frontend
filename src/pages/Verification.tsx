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
  
  // State for required backend fields
  const [nationalIdNumber, setNationalIdNumber] = useState("");
  const [idFrontImage, setIdFrontImage] = useState<File | null>(null);
  const [idBackImage, setIdBackImage] = useState<File | null>(null);
  const [selfieWithId, setSelfieWithId] = useState<File | null>(null);
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await verificationService.getStatus();
        if (response.data) {
          const apiStatus = response.data.verificationStatus;
          if (apiStatus === "unverified") {
            setStatus("unsubmitted");
          } else if (apiStatus === "verified") {
            setStatus("approved");
          } else {
            setStatus(apiStatus);
          }
        }
      } catch (err: any) {
        if (err.response?.status === 404 || err.response?.status === 400) {
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

  const handleSubmit = async () => {
    if (!nationalIdNumber || !idFrontImage || !selfieWithId) {
      setError("Please fill in all required fields (National ID, Front Image, Selfie).");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('nationalIdNumber', nationalIdNumber);
      formData.append('idFrontImage', idFrontImage);
      if (idBackImage) formData.append('idBackImage', idBackImage);
      formData.append('selfieWithId', selfieWithId);
      
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
                    <label className="block text-sm font-bold text-gray-900 mb-2">National ID / Passport Number</label>
                    <input 
                      type="text" 
                      value={nationalIdNumber}
                      onChange={(e) => setNationalIdNumber(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-all font-medium" 
                    />
                 </div>
                 <div className="pt-4">
                    <button onClick={() => setStep(2)} className="w-full bg-brand-black text-white font-bold py-4 rounded-full hover:bg-brand-yellow hover:text-brand-black transition-all">Next Step: Document Upload</button>
                 </div>
              </div>
            )}

            {status === "unsubmitted" && step === 2 && (
              <div className="space-y-6">
                 <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50">
                    <p className="text-gray-900 font-bold mb-2">Front of ID Document</p>
                    <input type="file" accept="image/*" onChange={(e) => e.target.files && setIdFrontImage(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-yellow file:text-brand-black hover:file:bg-brand-black hover:file:text-white" />
                 </div>
                 <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50">
                    <p className="text-gray-900 font-bold mb-2">Back of ID Document (Optional)</p>
                    <input type="file" accept="image/*" onChange={(e) => e.target.files && setIdBackImage(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-yellow file:text-brand-black hover:file:bg-brand-black hover:file:text-white" />
                 </div>
                 <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center bg-gray-50">
                    <p className="text-gray-900 font-bold mb-2">Selfie holding ID</p>
                    <input type="file" accept="image/*" onChange={(e) => e.target.files && setSelfieWithId(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-yellow file:text-brand-black hover:file:bg-brand-black hover:file:text-white" />
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
