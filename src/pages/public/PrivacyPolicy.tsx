export function PrivacyPolicy() {
  return (
    <div className="pt-32 pb-24 bg-[#FDF8F2] min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-black text-brand-black mb-4 tracking-tight">Privacy Policy</h1>
        <p className="text-gray-500 font-medium mb-12">Last Updated: October 2026</p>
        
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 prose prose-lg text-gray-600 font-medium">
          <p>
            At Lendly, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as your name, email address, phone number, and location. We also collect verification data (like government IDs) through our secure third-party partners.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
          <p>
            Your information is used to facilitate secure rentals, verify identities, communicate updates, and enforce our Terms of Service. We do not sell your personal data to advertisers.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your data. Payment information is processed by secure providers and is never stored directly on our servers.
          </p>
          
          <p className="text-sm mt-12 pt-6 border-t border-gray-200">
            Note: This is a placeholder privacy policy for a university project. No actual legal entity exists under the name Lendly Inc.
          </p>
        </div>
      </div>
    </div>
  );
}
