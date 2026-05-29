import { ShieldCheck, Users, Leaf, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function AboutUs() {
  return (
    <div className="pt-32 pb-24 bg-[#FDF8F2] min-h-screen">
      <div className="max-w-4xl mx-auto px-6 text-center mb-24">
        <h1 className="text-4xl md:text-6xl font-black text-brand-black mb-6 tracking-tight">Our Mission</h1>
        <p className="text-xl md:text-2xl font-medium text-gray-600 leading-relaxed">
          To build a resilient, sustainable, and connected community by making it safe and easy to share the things we own.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-12 mb-32">
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-gray-100">
           <div className="size-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="size-8" />
           </div>
           <h3 className="text-2xl font-bold text-brand-black mb-4">Community First</h3>
           <p className="text-gray-600 font-medium leading-relaxed">
             We believe in the power of local neighborhoods. Borrowing from a neighbor is more than a transaction—it's a connection.
           </p>
        </div>
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-gray-100">
           <div className="size-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Leaf className="size-8" />
           </div>
           <h3 className="text-2xl font-bold text-brand-black mb-4">Sustainability</h3>
           <p className="text-gray-600 font-medium leading-relaxed">
             Why buy a drill you'll use once? Sharing resources reduces waste, lowers emissions, and promotes a circular economy.
           </p>
        </div>
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-gray-100">
           <div className="size-16 bg-brand-yellow/20 text-brand-black rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="size-8" />
           </div>
           <h3 className="text-2xl font-bold text-brand-black mb-4">Trust & Safety</h3>
           <p className="text-gray-600 font-medium leading-relaxed">
             Identity verification, secure payments, and formal agreements mean you can share with complete peace of mind.
           </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-black text-brand-black mb-8">Ready to join the movement?</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="bg-brand-black text-white px-8 py-4 rounded-full font-bold hover:bg-brand-yellow hover:text-black transition-colors w-full sm:w-auto">
             Create an Account
          </Link>
          <Link to="/marketplace" className="bg-white text-brand-black border border-gray-200 px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition-colors w-full sm:w-auto flex items-center justify-center gap-2">
             Browse Items <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
