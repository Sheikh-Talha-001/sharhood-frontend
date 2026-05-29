import { CheckCircle2, ShieldCheck, UploadCloud } from "lucide-react";

export function VerificationInfo() {
  return (
    <div className="pt-32 pb-24 bg-[#FDF8F2] min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-brand-black mb-6 tracking-tight">Identity Verification</h1>
          <p className="text-xl font-medium text-gray-600">Building a neighborhood you can trust.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-12">
           <h2 className="text-2xl font-black text-brand-black mb-6">Why get verified?</h2>
           <p className="text-gray-600 font-medium mb-8 leading-relaxed">
             Verification is the cornerstone of Lendly's safety architecture. By verifying your identity, you prove to your neighbors that you are a real person living in the community.
           </p>
           
           <div className="grid md:grid-cols-2 gap-6">
             <div className="flex items-start gap-3">
                <CheckCircle2 className="size-6 text-green-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900">Higher Acceptance Rates</h4>
                  <p className="text-sm text-gray-500 mt-1">Lenders are 80% more likely to approve requests from verified borrowers.</p>
                </div>
             </div>
             <div className="flex items-start gap-3">
                <CheckCircle2 className="size-6 text-green-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900">Partner Eligibility</h4>
                  <p className="text-sm text-gray-500 mt-1">You must be verified to apply for our Partner Program and list unlimited items.</p>
                </div>
             </div>
           </div>
        </div>

        <div className="bg-[#241d1b] rounded-3xl p-8 md:p-12 text-white">
           <h2 className="text-2xl font-black mb-8 text-center">How the process works</h2>
           <div className="grid md:grid-cols-3 gap-8 text-center">
             <div>
                <div className="size-16 bg-[#7e0038] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <UploadCloud className="size-8 text-white" />
                </div>
                <h4 className="font-bold text-lg mb-2">1. Upload ID</h4>
                <p className="text-sm text-gray-400">Submit a photo of your government-issued ID via the dashboard.</p>
             </div>
             <div>
                <div className="size-16 bg-[#7e0038] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="size-8 text-white" />
                </div>
                <h4 className="font-bold text-lg mb-2">2. Admin Review</h4>
                <p className="text-sm text-gray-400">Our team securely reviews the document against your profile details.</p>
             </div>
             <div>
                <div className="size-16 bg-brand-yellow text-brand-black rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="size-8" />
                </div>
                <h4 className="font-bold text-lg mb-2">3. Get the Badge</h4>
                <p className="text-sm text-gray-400">Once approved, the Verified badge appears on your public profile.</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
