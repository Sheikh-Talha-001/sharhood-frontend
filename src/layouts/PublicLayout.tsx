import { Outlet } from "react-router-dom";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-brand-bg relative text-brand-black">
      <Outlet />
    </div>
  );
}
