export function MarketplaceSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="bg-white rounded-3xl border border-gray-100 overflow-hidden h-full flex flex-col">
          <div className="aspect-4/3 bg-gray-200 w-full"></div>
          <div className="p-6 flex flex-col flex-1">
            <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-100 rounded-md w-1/2 mb-6"></div>
            
            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center gap-3">
               <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
               <div className="space-y-2 flex-1">
                 <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
                 <div className="h-3 bg-gray-100 rounded-md w-1/3"></div>
               </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
