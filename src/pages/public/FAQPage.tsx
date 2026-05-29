import { FAQ } from "@/src/components/FAQ";

export function FAQPage() {
  return (
    <div className="pt-32 pb-24 bg-[#FDF8F2] min-h-screen">
      <div className="max-w-4xl mx-auto px-6 text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black text-brand-black mb-6 tracking-tight">Frequently Asked Questions</h1>
        <p className="text-xl font-medium text-gray-600">Everything you need to know about borrowing, lending, and trust on Lendly.</p>
      </div>
      
      {/* We reuse the existing FAQ component but we wrap it in a page layout */}
      <FAQ />
    </div>
  );
}
