export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8 h-full min-h-[200px]">
      <div className="size-8 relative animate-spin">
         <div className="size-full border-4 border-brand-yellow border-t-transparent rounded-full" />
      </div>
    </div>
  );
}
