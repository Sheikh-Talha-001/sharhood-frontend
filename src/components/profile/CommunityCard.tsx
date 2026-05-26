export function CommunityCard() {
  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6">Primary Neighborhood</h3>
      
      <div className="relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 aspect-video md:aspect-[4/3] flex items-center justify-center">
        {/* Decorative Map Placeholder representing San Francisco map from the image */}
        <img 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop" 
          alt="Map" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity"
        />
        
        {/* Overlay map pin box */}
        <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-xl shadow-md border border-gray-100 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
          <span className="text-xs font-bold text-gray-900">Mission District, SF</span>
        </div>
      </div>
    </div>
  );
}
