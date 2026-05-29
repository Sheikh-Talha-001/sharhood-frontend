import { ShieldCheck, UserCheck, Scale, AlertOctagon } from "lucide-react";

export function TrustAndSafety() {
  return (
    <div className="pt-32 pb-24 bg-[#FDF8F2] min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-brand-black mb-6 tracking-tight">Trust & Safety</h1>
          <p className="text-xl font-medium text-gray-600">Your security is the foundation of our platform.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
             <div className="size-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
               <UserCheck className="size-6" />
             </div>
             <h3 className="text-xl font-bold text-brand-black mb-3">Identity Verification</h3>
             <p className="text-gray-600 font-medium">
               We offer a robust verification system. Users can submit government ID to receive a "Verified" badge. We highly recommend only lending to verified users.
             </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
             <div className="size-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-6">
               <Scale className="size-6" />
             </div>
             <h3 className="text-xl font-bold text-brand-black mb-3">Digital Agreements</h3>
             <p className="text-gray-600 font-medium">
               Every rental is backed by a generated digital agreement. This acts as a formal record of the rental period and terms, protecting both parties.
             </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
             <div className="size-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6">
               <AlertOctagon className="size-6" />
             </div>
             <h3 className="text-xl font-bold text-brand-black mb-3">Moderation System</h3>
             <p className="text-gray-600 font-medium">
               Our active admin team reviews reports and complaints. Users who fail to return items or break rules face immediate platform suspension.
             </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
             <div className="size-12 bg-brand-yellow/20 text-brand-black rounded-2xl flex items-center justify-center mb-6">
               <ShieldCheck className="size-6" />
             </div>
             <h3 className="text-xl font-bold text-brand-black mb-3">Secure Platform</h3>
             <p className="text-gray-600 font-medium">
               All data is encrypted. We do not store sensitive payment information directly on our servers, ensuring your financial safety.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
