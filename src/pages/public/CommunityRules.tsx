export function CommunityRules() {
  return (
    <div className="pt-32 pb-24 bg-[#FDF8F2] min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-black text-brand-black mb-12 tracking-tight">Community Rules</h1>
        
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 prose prose-lg prose-headings:font-black prose-headings:text-brand-black text-gray-600 font-medium">
          <p>
            Lendly is built on trust, respect, and community. To ensure a safe environment for everyone, all users must adhere to the following rules.
          </p>

          <h2>1. Treat Items with Respect</h2>
          <p>
            When you borrow an item, treat it better than your own. Return it in the exact condition you received it, clean, and on time. If accidental damage occurs, be honest and report it immediately through the platform.
          </p>

          <h2>2. Transparent Communication</h2>
          <p>
            Respond to messages promptly and politely. Do not use abusive, threatening, or discriminatory language. Keep all communication related to rentals within the Lendly app to ensure there is a record in case of disputes.
          </p>

          <h2>3. Prohibited Items</h2>
          <p>
            You may not list weapons, illegal substances, perishable goods, living creatures, or hazardous materials. Lendly reserves the right to remove any listing deemed inappropriate or unsafe.
          </p>

          <h2>4. Reporting and Moderation</h2>
          <p>
            If you encounter a user violating these rules, please use the "Report User" feature. Our moderation team reviews all reports. Violations may result in temporary suspension or permanent bans from the platform.
          </p>
        </div>
      </div>
    </div>
  );
}
