import { useState, useEffect } from "react";
import { Store, CheckCircle, Shield } from "lucide-react";
import { partnerService } from "@/src/services/partnerService";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { useAuth } from "@/src/context/AuthContext";

const CATEGORIES = ["Tools", "Electronics", "Camping", "Party", "Gardening", "Sports"];

export function PartnerApplication() {
  const { user, checkAuthStatus } = useAuth();
  const [status, setStatus] = useState<"pending" | "approved" | "unsubmitted" | "rejected">("unsubmitted");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [experienceDescription, setExperienceDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await partnerService.getApplication();
        if (response.data) {
          setStatus(response.data.status);
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setStatus("unsubmitted");
        } else {
          setError("Failed to fetch application status");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleCategoryToggle = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!experienceDescription || selectedCategories.length === 0) {
      setError("Please provide a description and select at least one category.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await partnerService.apply({
        experienceDescription,
        categoriesInterestedIn: selectedCategories,
        email: "",
        fullName: "",
        phoneNumber: "",
        reasonForJoining: "",
        city: ""
      });
      setStatus("pending");
      await checkAuthStatus();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="py-20"><LoadingSpinner /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
         <div className="w-12 h-12 bg-brand-yellow rounded-2xl flex items-center justify-center">
            <Store className="w-6 h-6 text-brand-black" />
         </div>
         <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Partner Program</h1>
            <p className="text-gray-500 font-medium mt-1">Apply to list your items and earn.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="md:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
               {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl font-bold text-sm text-center">{error}</div>}

               {status === "unsubmitted" && (
                 <>
                   <h2 className="text-xl font-bold text-gray-900 mb-6">Application Details</h2>
                   <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Primary Categories</label>
                         <div className="grid grid-cols-2 gap-3">
                            {CATEGORIES.map(cat => (
                              <label key={cat} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                 <input 
                                   type="checkbox" 
                                   checked={selectedCategories.includes(cat)}
                                   onChange={() => handleCategoryToggle(cat)}
                                   className="w-4 h-4 text-brand-black focus:ring-brand-yellow rounded border-gray-300" 
                                 />
                                 <span className="text-sm font-medium text-gray-700">{cat}</span>
                              </label>
                            ))}
                         </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">Tell us about what you want to share</label>
                        <textarea 
                          value={experienceDescription}
                          onChange={(e) => setExperienceDescription(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all font-medium h-32 resize-none"
                          placeholder="I have a collection of high-end power tools..."
                        />
                      </div>
                      <button type="submit" disabled={isSubmitting} className="bg-brand-black text-white font-bold py-4 px-8 rounded-full hover:bg-brand-yellow hover:text-brand-black transition-all w-full disabled:opacity-50">
                         {isSubmitting ? 'Submitting...' : 'Submit Application'}
                      </button>
                   </form>
                 </>
               )}

               {status === "pending" && (
                 <div className="text-center py-12">
                   <div className="w-20 h-20 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Store className="w-10 h-10" />
                   </div>
                   <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Under Review</h2>
                   <p className="text-gray-500 font-medium">Our team is reviewing your application. We will notify you once a decision is made.</p>
                 </div>
               )}

               {status === "approved" && (
                 <div className="text-center py-12">
                   <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10" />
                   </div>
                   <h2 className="text-2xl font-bold text-gray-900 mb-2">You are a Partner!</h2>
                   <p className="text-gray-500 font-medium">Congratulations! You can now start listing items on the marketplace.</p>
                 </div>
               )}

               {status === "rejected" && (
                 <div className="text-center py-12">
                   <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Shield className="w-10 h-10" />
                   </div>
                   <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Rejected</h2>
                   <p className="text-gray-500 font-medium mb-6">Unfortunately, your application was not approved at this time.</p>
                   <button onClick={() => setStatus("unsubmitted")} className="bg-brand-black text-white px-8 py-3 rounded-full font-bold hover:bg-brand-yellow hover:text-black">Try Again</button>
                 </div>
               )}

            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
               <h3 className="font-bold text-gray-900 mb-4">Why become a partner?</h3>
               <ul className="space-y-3">
                 <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow mt-2 shrink-0" />
                    <p className="text-sm font-medium text-gray-600">Earn extra income from items you already own.</p>
                 </li>
                 <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow mt-2 shrink-0" />
                    <p className="text-sm font-medium text-gray-600">Help your local community access what they need.</p>
                 </li>
                 <li className="flex gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow mt-2 shrink-0" />
                    <p className="text-sm font-medium text-gray-600">$1,000 protection guarantee on all approved rentals.</p>
                 </li>
               </ul>
            </div>
            
            <div className="bg-brand-yellow/10 rounded-3xl p-6 border border-brand-yellow/20">
               <h3 className="font-bold text-brand-black mb-2">Requirements</h3>
               <p className="text-sm font-medium text-gray-700 leading-relaxed mb-4">
                 All partners must complete ID verification and maintain a high response rate. Applications are typically reviewed within 48 hours.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
