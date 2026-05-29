export function TermsOfService() {
  return (
    <div className="pt-32 pb-24 bg-[#FDF8F2] min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-black text-brand-black mb-4 tracking-tight">Terms of Service</h1>
        <p className="text-gray-500 font-medium mb-12">Last Updated: October 2026</p>
        
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 prose prose-lg text-gray-600 font-medium">
          <p>
            Welcome to Lendly. By accessing or using our platform, you agree to be bound by these Terms of Service.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Account Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials. You must be at least 18 years old to use the platform or list items for rent.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Lending and Borrowing</h2>
          <p>
            Lendly facilitates peer-to-peer rentals. We are not a party to the rental agreement itself, which is strictly between the lender and the borrower. By approving a request, you agree to the generated digital agreement.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Prohibited Conduct</h2>
          <p>
            Users may not list illegal items, harass other users, or attempt to bypass the platform's payment systems. Violations will result in immediate termination of your account.
          </p>
          
          <p className="text-sm mt-12 pt-6 border-t border-gray-200">
            Note: This is a placeholder terms of service document for a university project.
          </p>
        </div>
      </div>
    </div>
  );
}
