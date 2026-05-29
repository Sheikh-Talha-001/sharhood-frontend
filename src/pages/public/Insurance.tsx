export function Insurance() {
  return (
    <div className="pt-32 pb-24 bg-[#FDF8F2] min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-black text-brand-black mb-12 tracking-tight">Protection & Damage Policy</h1>
        
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 prose prose-lg prose-headings:font-black prose-headings:text-brand-black text-gray-600 font-medium">
          <p>
            At Lendly, we want you to share with confidence. While we do not act as an external insurance provider, we have robust internal mechanisms to protect our lenders.
          </p>

          <h2>Agreement Protection</h2>
          <p>
            Every time a request is approved, a binding Digital Agreement is created. By accepting the item, the borrower explicitly agrees to be financially responsible for the replacement or repair cost if the item is damaged or not returned.
          </p>

          <h2>Damage Handling Workflow</h2>
          <p>
            If your item is returned damaged, follow these steps:
          </p>
          <ul>
            <li><strong>Do not accept the return</strong> in the app.</li>
            <li>Click <strong>"File a Complaint"</strong> on the agreement page.</li>
            <li>Upload timestamped photos showing the damage compared to the pre-rental condition.</li>
          </ul>

          <h2>Complaint Resolution</h2>
          <p>
            Our moderation team will review the evidence. If the borrower is found responsible, we will mediate the dispute. The borrower will be required to compensate you directly. Failure to cooperate with a moderation ruling results in a permanent ban and potential legal escalation using the digital agreement.
          </p>

          <p className="text-sm mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
            <strong>Disclaimer:</strong> Lendly provides a platform for secure lending and dispute mediation but does not issue insurance policies. For extremely high-value items, we recommend lenders review their personal property or renter's insurance policies.
          </p>
        </div>
      </div>
    </div>
  );
}
