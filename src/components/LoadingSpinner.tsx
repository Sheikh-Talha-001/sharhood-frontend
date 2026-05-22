export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8 h-full min-h-[200px]">
      <div className="w-8 h-8 relative animate-spin">
         <div className="w-full h-full border-4 border-brand-yellow border-t-transparent rounded-full" />
      </div>
    </div>
  );
}
