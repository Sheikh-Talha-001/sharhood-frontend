export function MarketplaceSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:gap-8 animate-pulse font-sans">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="bg-[#ffffff] rounded-2xl border border-[#e5e5e5] overflow-hidden h-full flex flex-col shadow-none">
          <div className="aspect-[4/3] bg-[#fcf3ec] w-full border-b border-[#e5e5e5]"></div>
          <div className="p-5 flex flex-col flex-1">
            <div className="h-5 bg-[#e5e5e5] rounded-md w-3/4 mb-3"></div>
            <div className="h-3 bg-[#fcf3ec] rounded-md w-1/2 mb-5"></div>
            
            <div className="mt-auto pt-4 border-t border-[#e5e5e5] flex items-center gap-3">
               <div className="size-10 bg-[#e5e5e5] rounded-full shrink-0"></div>
               <div className="space-y-2 flex-1">
                 <div className="h-3.5 bg-[#e5e5e5] rounded-md w-1/2"></div>
                 <div className="h-2.5 bg-[#fcf3ec] rounded-md w-1/3"></div>
               </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
