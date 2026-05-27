import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { cn } from "@/src/lib/utils";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/src/context/AuthContext";

export function Navbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  // Scroll locking for mobile menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navScale = useTransform(scrollY, [0, 100], [1, 0.95]);
  const navY = useTransform(scrollY, [0, 100], [0, 10]);

  return (
    <>
      <motion.nav
        style={{
          scale: navScale,
          y: navY,
        }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 md:px-12 pt-6",
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 bg-white/40 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-white/20 z-50">
            <div className="w-8 h-8 bg-brand-black rounded-lg flex items-center justify-center">
              <span className="text-brand-yellow font-black text-lg text-center leading-none">S</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-brand-black">SharHood</span>
          </Link>

          {/* Desktop Links Pill */}
          <div className={cn(
            "hidden lg:flex items-center gap-2 p-1.5 rounded-full transition-all duration-500 border border-white/20",
            isScrolled ? "bg-white shadow-lg" : "bg-white/40 backdrop-blur-md shadow-sm font-normal" 
          )}>
            <NavLink label="Marketplace" to="/marketplace" />
            <NavLink label="How It Works" to="/#how-it-works" />
            <NavLink label="Blog" to="/#" />
            <NavLink label="FAQ" to="/#faq" />
           </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center gap-3 font-medium">
            <Link to="/become-partner" className="bg-white text-brand-black px-6 py-3 rounded-full text-sm font-bold border border-brand-black/5 hover:bg-gray-50 transition-all shadow-sm">
              Become a partner
            </Link>
            {isAuthenticated ? (
              <Link to="/dashboard" className="bg-brand-black text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-brand-yellow hover:text-black hover:shadow-lg hover:shadow-brand-yellow/20 transition-all active:scale-95 shadow-md flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
              </Link>
            ) : (
              <Link to="/register" className="bg-brand-black text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-brand-yellow hover:text-black hover:shadow-lg hover:shadow-brand-yellow/20 transition-all active:scale-95 shadow-md inline-block text-center">
                Register Now
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 bg-white/40 backdrop-blur-md border border-white/20 rounded-xl z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 text-brand-black" /> : <Menu className="w-6 h-6 text-brand-black" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#FFF9F2] pt-32 px-6 pb-6 flex flex-col justify-between"
          >
             <div className="flex flex-col gap-6 text-center text-xl font-bold text-brand-black">
                <Link to="/marketplace" onClick={() => setIsMobileMenuOpen(false)}>Marketplace</Link>
                <Link to="/#how-it-works" onClick={() => setIsMobileMenuOpen(false)}>How It Works</Link>
                <Link to="/become-partner" onClick={() => setIsMobileMenuOpen(false)} className="text-brand-yellow">Become a Partner</Link>
                <Link to="/#faq" onClick={() => setIsMobileMenuOpen(false)}>FAQ</Link>
             </div>
             
             <div className="flex flex-col gap-4 mt-8">
                <Link to="/become-partner" className="w-full bg-white text-brand-black py-4 rounded-full font-bold shadow-sm border border-gray-100 text-center">
                   Apply to Partner Program
                </Link>
                {isAuthenticated ? (
                  <Link to="/dashboard" className="w-full bg-brand-black text-white py-4 rounded-full font-bold shadow-md hover:bg-brand-yellow hover:text-black transition-colors flex items-center justify-center gap-2">
                     <LayoutDashboard className="w-5 h-5" /> Go to Dashboard
                  </Link>
                ) : (
                  <Link to="/register" className="w-full bg-brand-black text-white py-4 rounded-full font-bold shadow-md hover:bg-brand-yellow hover:text-black transition-colors text-center">
                     Register Now
                  </Link>
                )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ label, to, active }: { label: string; to: string; active?: boolean }) {
  return (
    <Link 
      to={to} 
      className={cn(
        "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
        active ? "bg-brand-yellow text-brand-black font-bold" : "text-gray-700 hover:bg-gray-100"
      )}
    >
      {label}
    </Link>
  );
}
