import { Shield, BookOpen, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export function LendingGuide() {
  return (
    <div className="pt-32 pb-24 bg-[#FDF8F2] min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-black text-brand-black mb-6 tracking-tight text-center">Safe Lending Guide</h1>
        <p className="text-xl font-medium text-gray-600 mb-16 text-center">Best practices for sharing your items securely on Lendly.</p>

        <div className="space-y-12">
           <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
             <div className="flex items-center gap-4 mb-6">
               <div className="size-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
                  <Shield className="size-6" />
               </div>
               <h2 className="text-2xl font-bold text-brand-black">1. Verify Your Borrowers</h2>
             </div>
             <p className="text-gray-600 font-medium leading-relaxed mb-6">
               Always check a borrower's profile before accepting a request. Look for the "Verified" badge, which indicates that Lendly has confirmed their identity. Read their past reviews from other lenders.
             </p>
             <ul className="space-y-3">
               <li className="flex items-start gap-3"><CheckCircle2 className="size-5 text-green-500 shrink-0 mt-0.5"/> <span className="text-gray-700 font-medium">Accept requests from verified users for maximum protection.</span></li>
               <li className="flex items-start gap-3"><CheckCircle2 className="size-5 text-green-500 shrink-0 mt-0.5"/> <span className="text-gray-700 font-medium">Use the in-app chat to ask questions about how they intend to use the item.</span></li>
             </ul>
           </section>

           <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
             <div className="flex items-center gap-4 mb-6">
               <div className="size-12 bg-brand-yellow/20 text-brand-black rounded-2xl flex items-center justify-center shrink-0">
                  <BookOpen className="size-6" />
               </div>
               <h2 className="text-2xl font-bold text-brand-black">2. Use the Digital Agreement</h2>
             </div>
             <p className="text-gray-600 font-medium leading-relaxed mb-6">
               Lendly automatically generates a binding digital agreement when a request is approved. This document records the item condition, dates, and terms of the rental.
             </p>
             <ul className="space-y-3">
               <li className="flex items-start gap-3"><CheckCircle2 className="size-5 text-green-500 shrink-0 mt-0.5"/> <span className="text-gray-700 font-medium">Take photos of your item immediately before handoff.</span></li>
               <li className="flex items-start gap-3"><CheckCircle2 className="size-5 text-green-500 shrink-0 mt-0.5"/> <span className="text-gray-700 font-medium">Upload these photos in the agreement chat as proof of condition.</span></li>
               <li className="flex items-start gap-3"><CheckCircle2 className="size-5 text-green-500 shrink-0 mt-0.5"/> <span className="text-gray-700 font-medium">Ensure both parties click "Item Handed Over" in the app.</span></li>
             </ul>
           </section>

           <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100">
             <div className="flex items-center gap-4 mb-6">
               <div className="size-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shrink-0">
                  <AlertTriangle className="size-6" />
               </div>
               <h2 className="text-2xl font-bold text-brand-black">3. Handling Issues</h2>
             </div>
             <p className="text-gray-600 font-medium leading-relaxed mb-6">
               If an item is returned damaged or late, you are protected by the Lendly moderation team.
             </p>
             <ul className="space-y-3">
               <li className="flex items-start gap-3"><CheckCircle2 className="size-5 text-green-500 shrink-0 mt-0.5"/> <span className="text-gray-700 font-medium">Do not confirm the return in the app if the item is damaged.</span></li>
               <li className="flex items-start gap-3"><CheckCircle2 className="size-5 text-green-500 shrink-0 mt-0.5"/> <span className="text-gray-700 font-medium">Instead, use the "File a Complaint" button on the active agreement.</span></li>
               <li className="flex items-start gap-3"><CheckCircle2 className="size-5 text-green-500 shrink-0 mt-0.5"/> <span className="text-gray-700 font-medium">Provide photo evidence of the damage. Our team will intervene to resolve the dispute and enforce compensation.</span></li>
             </ul>
           </section>
        </div>

        <div className="mt-16 text-center">
           <Link to="/trust-safety" className="text-brand-black font-bold hover:text-brand-yellow transition-colors text-lg">
             Read more about Trust & Safety &rarr;
           </Link>
        </div>
      </div>
    </div>
  );
}
