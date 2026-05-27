import { useState } from "react";
import { Link } from "react-router-dom";
import api from "@/src/services/api";
import { Scale, Loader2, AlertTriangle, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export function AppealSuspension() {
  const [email, setEmail] = useState("");
  const [appealMessage, setAppealMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || appealMessage.trim().length < 20) {
      toast.error("Please provide your email and an appeal message (min 20 characters).");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post("/auth/appeal-suspension", { email, appealMessage });
      setIsSuccess(true);
      toast.success("Appeal submitted successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to submit appeal");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6">
      
      {/* Header Logo */}
      <div className="absolute top-8 left-8 flex items-center gap-3">
        <div className="w-8 h-8 bg-brand-black rounded-lg flex items-center justify-center">
          <span className="text-brand-yellow font-black text-lg leading-none">S</span>
        </div>
        <span className="font-bold text-xl tracking-tight text-brand-black">ShareHood</span>
      </div>

      <div className="max-w-xl w-full bg-white rounded-4xl p-8 md:p-12 shadow-2xl border border-gray-100 relative overflow-hidden">
        
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500" />

        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-50 mb-8 ring-8 ring-red-50/50">
          <Scale className="h-10 w-10 text-red-600" />
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-3">Account Suspended</h1>
          <p className="text-gray-500 font-medium leading-relaxed">
            Your account has been suspended by a moderator for a violation of our community guidelines. You are currently restricted from borrowing, lending, and messaging.
          </p>
        </div>

        {isSuccess ? (
          <div className="bg-green-50 rounded-2xl p-8 text-center border border-green-100 animate-in zoom-in-95 duration-500">
            <h2 className="text-xl font-bold text-green-900 mb-2">Appeal Submitted</h2>
            <p className="text-green-700 font-medium mb-6">
              Our moderation team will review your appeal and notify you of their decision. Please allow up to 48 hours for a response.
            </p>
            <Link 
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-700 border border-green-200 px-6 py-3 rounded-xl font-bold hover:bg-green-100 transition-colors shadow-sm"
            >
              Return to Homepage <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-start gap-3">
               <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
               <p className="text-sm font-medium text-orange-800 leading-relaxed">
                 You may submit an appeal to have your account reinstated. Please provide a detailed explanation of your situation.
               </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Account Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-black transition-all font-medium" 
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Appeal Message
              </label>
              <textarea 
                value={appealMessage}
                onChange={(e) => setAppealMessage(e.target.value)}
                placeholder="Please explain why your account should be reinstated (min. 20 characters)."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-black transition-all font-medium h-32 resize-none"
                required
                minLength={20}
              />
              <p className="text-xs text-gray-500 font-medium mt-2 flex justify-end">
                {appealMessage.length}/2000
              </p>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isSubmitting || appealMessage.length < 20}
                className="w-full bg-brand-black text-white rounded-xl py-4 font-bold hover:bg-gray-900 transition-all shadow-sm disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
                ) : (
                  "Submit Appeal"
                )}
              </button>
            </div>
            
            <div className="text-center">
              <button 
                type="button"
                onClick={() => {
                  // Small hack to logout explicitly if they hit cancel
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }}
                className="text-sm font-bold text-gray-500 hover:text-brand-black transition-colors"
              >
                Sign out and return to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
