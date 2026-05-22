import { Instagram, Twitter, Linkedin, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="pt-32 pb-12 px-6 bg-brand-bg">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-24">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
             <div className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 bg-brand-black rounded-lg flex items-center justify-center">
                  <span className="text-brand-lime font-black text-xl">S</span>
                </div>
                <span className="font-bold text-2xl tracking-tight text-brand-black">SharHood</span>
             </div>
             <p className="text-gray-500 font-medium leading-relaxed mb-8">
                Building a more sustainable and connected future, one neighborhood at a time.
             </p>
             <div className="flex gap-4">
                <SocialIcon icon={Twitter} />
                <SocialIcon icon={Instagram} />
                <SocialIcon icon={Linkedin} />
                <SocialIcon icon={Facebook} />
             </div>
          </div>

          <FooterColumn 
             title="Product" 
             links={["Explore", "How it Works", "Lending Guide", "App Download"]} 
          />
          <FooterColumn 
             title="Company" 
             links={["About Us", "Careers", "Press", "Contact"]} 
          />
          <FooterColumn 
             title="Trust & Safety" 
             links={["Community Rules", "Insurance", "Verification", "Safety Tips"]} 
          />
          <FooterColumn 
             title="Legal" 
             links={["Privacy Policy", "Terms of Service", "Cookie Policy", "Lender Agreement"]} 
          />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t-2 border-brand-black/5 gap-6 text-center md:text-left">
           <div>
              <p className="text-gray-400 font-medium text-sm">© 2026 SharHood Inc. All rights reserved.</p>
           </div>
           
           <div className="flex items-center gap-2">
              <span className="text-sm font-bold uppercase tracking-widest text-brand-black/40">Made with</span>
              <div className="w-8 h-8 bg-brand-pink rounded-full flex items-center justify-center animate-pulse">
                 <span className="text-xs">🧡</span>
              </div>
              <span className="text-sm font-bold uppercase tracking-widest text-brand-black/40">In Your Hood</span>
           </div>

           <div className="flex gap-8 text-sm font-black uppercase tracking-tighter">
              <a href="#" className="hover:text-brand-orange transition-colors">English</a>
              <a href="#" className="hover:text-brand-orange transition-colors">USD ($)</a>
           </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="flex flex-col gap-6">
      <h4 className="font-black text-xs uppercase tracking-[0.2em] text-brand-black/40">{title}</h4>
      <div className="flex flex-col gap-4">
        {links.map((link) => (
          <a key={link} href="#" className="font-bold text-gray-700 hover:text-brand-orange transition-colors">
            {link}
          </a>
        ))}
      </div>
    </div>
  );
}

function SocialIcon({ icon: Icon }: { icon: any }) {
  return (
    <a href="#" className="w-10 h-10 bg-white border-2 border-brand-black/5 rounded-full flex items-center justify-center hover:bg-brand-black hover:text-white transition-all transform hover:scale-110">
      <Icon className="w-5 h-5" />
    </a>
  );
}
