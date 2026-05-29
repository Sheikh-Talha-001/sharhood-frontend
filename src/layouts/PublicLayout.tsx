import { Outlet } from "react-router-dom";
import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#ffffff] relative font-sans flex flex-col">
      <Navbar />
      <main className="flex-1 pt-28">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
