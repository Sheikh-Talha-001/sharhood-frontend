export function LenderAgreement() {
  return (
    <div className="pt-32 pb-24 bg-[#FDF8F2] min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-black text-brand-black mb-4 tracking-tight">Lender Agreement</h1>
        <p className="text-gray-500 font-medium mb-12">Last Updated: October 2026</p>
        
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 prose prose-lg text-gray-600 font-medium">
          <p>
            This Lender Agreement outlines the responsibilities of users who list items for rent on Lendly.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Item Condition</h2>
          <p>
            You agree to list items accurately and ensure they are in safe, working condition before handing them over to a borrower.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Digital Contracts</h2>
          <p>
            By approving a borrow request, you enter into a digital agreement with the borrower. You must fulfill your obligation to provide the item at the agreed time and place.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Dispute Resolution</h2>
          <p>
            In the event of damage or loss, you must file a complaint through the platform within 24 hours of the expected return date, providing photo evidence. You agree to abide by the moderation team's ruling.
          </p>
          
          <p className="text-sm mt-12 pt-6 border-t border-gray-200">
            Note: This is a placeholder agreement document for a university project.
          </p>
        </div>
      </div>
    </div>
  );
}
