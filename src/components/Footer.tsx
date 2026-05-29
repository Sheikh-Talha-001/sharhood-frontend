import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-[#241d1b] text-[#fcf3ec] pt-24 px-6 md:px-12 mt-24 rounded-t-[2.5rem] md:rounded-t-[3rem] overflow-hidden relative pb-0">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Section - Large Call to Action */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-[#fcf3ec]/10 pb-16 mb-16 gap-10">
           <div className="max-w-2xl">
             <h2 className="text-4xl md:text-5xl lg:text-7xl font-semibold tracking-tight leading-[1.1] mb-6 text-[#ffffff]">
                Borrow safely from verified neighbors.
             </h2>
             <p className="text-xl text-[#fcf3ec]/70 font-medium leading-relaxed">
                Join our community-powered platform today.
             </p>
           </div>
           <Link to="/become-partner" className="group flex items-center gap-3 bg-[#7e0038] text-[#ffffff] px-8 py-5 rounded-full font-semibold text-lg hover:bg-[#5c002a] transition-all shrink-0 border border-[#7e0038]">
              Become a Partner
              <ArrowUpRight className="size-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
           </Link>
        </div>

        {/* Middle Section - Links Grid Only (Brand removed) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 mb-20 w-full">
            <FooterColumn title="Platform" links={[
              { name: "Marketplace", href: "/marketplace" },
              { name: "How it Works", href: "/#how-it-works" },
              { name: "Lending Guide", href: "/lending-guide" },
            ]} />
            <FooterColumn title="Company" links={[
              { name: "About Us", href: "/about" },
              { name: "Blog", href: "/blog" },
              { name: "FAQ", href: "/faq" }
            ]} />
            <FooterColumn title="Community" links={[
              { name: "Community Rules", href: "/community-rules" },
              { name: "Trust & Safety", href: "/trust-safety" },
              { name: "Insurance", href: "/insurance" },
              { name: "Verification", href: "/verification-info" }
            ]} />
            <FooterColumn title="Legal" links={[
              { name: "Privacy Policy", href: "/privacy" },
              { name: "Terms of Service", href: "/terms" },
              { name: "Cookie Policy", href: "/cookies" },
              { name: "Lender Agreement", href: "/lender-agreement" }
            ]} />
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between pb-4 gap-8">
           <div className="flex flex-col md:flex-row items-center gap-6">
             <p className="text-[#fcf3ec]/50 font-medium text-sm">
               © 2026 Lendly Inc. All rights reserved.
             </p>
             <div className="hidden md:block size-1.5 rounded-full bg-[#fcf3ec]/20" />
             <div className="flex gap-6 text-sm font-semibold text-[#fcf3ec]/50">
                <Link to="/privacy" className="hover:text-[#ffffff] transition-colors">Privacy</Link>
                <Link to="/terms" className="hover:text-[#ffffff] transition-colors">Terms</Link>
             </div>
           </div>
           
           <div className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-[#fcf3ec]/70">
              <a href="#" className="hover:text-[#ffffff] transition-colors flex items-center gap-0.5 group">
                 Twitter <ArrowUpRight className="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <a href="#" className="hover:text-[#ffffff] transition-colors flex items-center gap-0.5 group">
                 Instagram <ArrowUpRight className="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <a href="#" className="hover:text-[#ffffff] transition-colors flex items-center gap-0.5 group">
                 LinkedIn <ArrowUpRight className="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
           </div>
        </div>
      </div>

      {/* Massive Background Text at the bottom */}
      <div className="w-full text-center leading-none mt-8 overflow-hidden pointer-events-none select-none flex justify-center">
         <span className="text-[23vw] sm:text-[21vw] md:text-[19vw] lg:text-[18vw] font-black text-[#fcf3ec]/3 tracking-tighter block mb-[-3vw] w-full text-center leading-none">
           Lendly
         </span>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { name: string; href: string }[] }) {
  return (
    <div className="flex flex-col gap-6">
      <h4 className="font-semibold text-xs text-[#fcf3ec]/40 uppercase tracking-[0.15em]">{title}</h4>
      <div className="flex flex-col gap-4">
        {links.map((link) => (
          <Link 
            key={link.name} 
            to={link.href} 
            className="font-medium text-[#fcf3ec]/80 hover:text-[#ffffff] transition-colors inline-block w-fit"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
