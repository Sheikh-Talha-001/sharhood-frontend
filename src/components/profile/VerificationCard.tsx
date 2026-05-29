import { CheckCircle2, Shield, User, Smartphone, Link as LinkIcon, ShieldCheck } from "lucide-react";
import { User as UserType } from "@/src/context/AuthContext";

interface Props {
  user: UserType | null;
}

export function VerificationCard({ user }: Props) {
  const isVerified = user?.verificationStatus === "verified";
  
  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-full flex flex-col">
      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6">Verification Status</h3>
      
      <div className="space-y-6 flex-1">
        
        {/* Identity */}
        <div className="flex items-start gap-4">
          <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${isVerified ? 'bg-green-50 text-green-500' : 'bg-gray-100 text-gray-400'}`}>
             <User className="size-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
               <span className={`font-bold text-sm ${isVerified ? 'text-gray-900' : 'text-gray-500'}`}>Identity Verified</span>
               {isVerified && <CheckCircle2 className="size-5 text-green-500" />}
            </div>
            <p className="text-xs font-medium text-gray-400">{isVerified ? 'Government ID (CNIC)' : 'Not verified'}</p>
          </div>
        </div>

        {/* Student/Work ID */}
        <div className="flex items-start gap-4">
          <div className="size-10 rounded-xl flex items-center justify-center shrink-0 bg-green-50 text-green-500">
             <Shield className="size-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
               <span className="font-bold text-sm text-gray-900">Student ID</span>
               <CheckCircle2 className="size-5 text-green-500" />
            </div>
            <p className="text-xs font-medium text-gray-400">SF University Faculty</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-4">
          <div className="size-10 rounded-xl flex items-center justify-center shrink-0 bg-green-50 text-green-500">
             <Smartphone className="size-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
               <span className="font-bold text-sm text-gray-900">Phone Number</span>
               <CheckCircle2 className="size-5 text-green-500" />
            </div>
            <p className="text-xs font-medium text-gray-400">+1 (555) •••• 89</p>
          </div>
        </div>

        {/* LinkedIn */}
        <div className="flex items-start gap-4 opacity-50">
          <div className="size-10 rounded-xl flex items-center justify-center shrink-0 bg-gray-100 text-gray-400">
             <LinkIcon className="size-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
               <span className="font-bold text-sm text-gray-900">LinkedIn Profile</span>
               <span className="text-[10px] font-bold text-green-500 uppercase tracking-wide cursor-pointer hover:underline">Connect</span>
            </div>
            <p className="text-xs font-medium text-gray-400">Not connected</p>
          </div>
        </div>

      </div>

      <div className="mt-8 pt-6 border-t border-gray-100">
         <div className="flex gap-3 items-start">
            <ShieldCheck className="size-5 text-green-500 shrink-0 mt-0.5" />
            <div>
               <h4 className="text-xs font-bold text-gray-900 mb-1">Trust Guarantee</h4>
               <p className="text-[11px] font-medium text-gray-500 leading-relaxed">
                 Lendly guarantees the authenticity of all verified documents. We use bank-grade encryption to protect your neighborhood data.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
