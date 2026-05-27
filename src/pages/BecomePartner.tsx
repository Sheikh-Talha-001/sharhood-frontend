import React, { useState, useEffect } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { partnerService, PartnerApplicationData } from "@/src/services/partnerService";
import { useNavigate } from "react-router-dom";
import { 
  Store, CheckCircle, Smartphone, 
  MapPin, Wrench, Tv, Camera, 
  Bike, Tent, Briefcase, Zap, 
  ShieldCheck, Gem, Users, ArrowRight 
} from "lucide-react";
import { Navbar } from "@/src/components/Navbar";
import { Footer } from "@/src/components/Footer";
import toast from "react-hot-toast";

export function BecomePartner() {
  const { user, checkAuthStatus } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PartnerApplicationData>({
    fullName: user?.name || "",
    phoneNumber: "",
    businessName: "",
    categoriesInterestedIn: [],
    experienceDescription: "",
    reasonForJoining: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Update form if user auth loads late
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.name
      }));
    }
  }, [user]);

  const handleCategoryToggle = (cat: string) => {
    setFormData(prev => ({
      ...prev,
      categoriesInterestedIn: prev.categoriesInterestedIn.includes(cat) 
        ? prev.categoriesInterestedIn.filter(c => c !== cat)
        : [...prev.categoriesInterestedIn, cat]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      toast.error("Please log in or register to submit an application.");
      navigate("/register");
      return;
    }

    if (user.verificationStatus !== "verified") {
      setError("You must complete identity verification in your dashboard before applying.");
      return;
    }

    if (formData.categoriesInterestedIn.length === 0) {
      setError("Please select at least one category of interest.");
      return;
    }

    setIsSubmitting(true);
    try {
      await partnerService.apply(formData);
      setSuccess(true);
      await checkAuthStatus();
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate("/dashboard/partner");
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FDF8F2] font-sans selection:bg-brand-yellow selection:text-black">
      <Navbar />

      <main className="pt-32 pb-24">
        {/* HERO SECTION */}
        <section className="max-w-5xl mx-auto px-6 text-center pt-12 pb-20">
          <h1 className="text-5xl md:text-7xl font-black text-brand-black mb-6 tracking-tight">
            Become a partner
          </h1>
          <p className="text-xl md:text-2xl font-medium text-gray-700 mb-10 max-w-2xl mx-auto">
            The secure marketplace to rent out your items and earn money safely.
          </p>
          <button 
            onClick={scrollToForm}
            className="bg-brand-yellow text-brand-black font-black px-10 py-4 rounded-full text-lg hover:scale-105 hover:shadow-xl hover:shadow-brand-yellow/20 transition-all active:scale-95"
          >
            Apply now
          </button>
        </section>

        {/* STATISTICS SECTION */}
        <section className="max-w-6xl mx-auto px-6 mb-24">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center">
            <StatItem label="+60,000 users" />
            <StatItem label="+120 partners" />
            <StatItem label="+25,000 items listed" />
            <StatItem label="Only 15% commission" />
          </div>
        </section>

        {/* BENEFITS SECTION */}
        <section className="max-w-5xl mx-auto px-6 mb-32">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-16">What's in it for you?</h2>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 relative">
             <BenefitCard 
               icon={<Store className="w-8 h-8" />} 
               title="More people in your store, extra income from your inventory, and cross-selling potential." 
             />
             <BenefitCard 
               icon={<Gem className="w-8 h-8" />} 
               title="Monetize your inventory to the max." 
             />
             <BenefitCard 
               icon={<Users className="w-8 h-8" />} 
               title="Have a positive impact on your planet and community by contributing to circular economy." 
             />
             <BenefitCard 
               icon={<Zap className="w-8 h-8" />} 
               title="Make extra income, your profile is visible to over 60,000 users in the app." 
             />
          </div>
        </section>

        {/* WHO CAN BECOME A PARTNER */}
        <section className="max-w-6xl mx-auto px-6 mb-32">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-16">Who can become a partner?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <CategoryCard 
              title="Retail Shops"
              subtitle="Maximize your inventory"
              items={["Grocery stores", "Sports shops", "Hardware stores", "Bike repair", "Camera vendors"]}
            />
            <CategoryCard 
              title="Rental Businesses"
              subtitle="Grow your clientele"
              items={["Event equipment rental", "Party accessories", "Specialized equipment", "Sports equipment", "Van rentals"]}
            />
            <CategoryCard 
              title="Entrepreneurs"
              subtitle="Monetize your own items safely with ShareHood"
              items={["Handymen (renting power tools)", "Gardeners (renting lawnmowers)", "Gamers/VR sets"]}
            />
            <CategoryCard 
              title="Local Institutions"
              subtitle="Connect with your community"
              items={["Libraries/Townhalls", "Makerspaces"]}
            />
          </div>
        </section>

        {/* PLATFORM CATEGORIES SHOWCASE */}
        <section className="max-w-5xl mx-auto px-6 mb-32 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-6">ShareHood is the app where you can rent anything</h2>
          <p className="text-gray-600 font-medium mb-12">From tools to electronics, discover the top categories in our app</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
            <ShowcaseBadge icon={<Wrench className="w-4 h-4 text-orange-500" />} label="DIY" />
            <ShowcaseBadge icon={<Tv className="w-4 h-4 text-purple-500" />} label="Parties" />
            <ShowcaseBadge icon={<Bike className="w-4 h-4 text-blue-500" />} label="Sport" />
            <ShowcaseBadge icon={<Tent className="w-4 h-4 text-green-500" />} label="Camping" />
            <ShowcaseBadge icon={<Camera className="w-4 h-4 text-yellow-500" />} label="Audiovisual" />
            <ShowcaseBadge icon={<Briefcase className="w-4 h-4 text-gray-500" />} label="Events" />
            <ShowcaseBadge icon={<MapPin className="w-4 h-4 text-red-500" />} label="Mobility" />
            <ShowcaseBadge icon={<Smartphone className="w-4 h-4 text-teal-500" />} label="Electronics" />
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="max-w-5xl mx-auto px-6 mb-32 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-12">How does it work?</h2>
          <div className="bg-gray-200/50 rounded-3xl p-12 md:p-24 relative overflow-hidden border border-gray-300/50 shadow-inner">
             <div className="flex flex-col md:flex-row justify-between items-center relative z-10 gap-8">
               <div className="text-center">
                 <div className="w-12 h-12 bg-brand-yellow rounded-full flex items-center justify-center font-black text-xl mx-auto mb-4 shadow-lg">1</div>
                 <h3 className="font-bold text-lg">Apply as partner</h3>
               </div>
               <div className="hidden md:block flex-1 h-1 border-t-2 border-dashed border-gray-400"></div>
               <div className="text-center">
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-black text-xl mx-auto mb-4 shadow-lg">2</div>
                 <h3 className="font-bold text-lg">Admin review</h3>
               </div>
               <div className="hidden md:block flex-1 h-1 border-t-2 border-dashed border-gray-400"></div>
               <div className="text-center">
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-black text-xl mx-auto mb-4 shadow-lg">3</div>
                 <h3 className="font-bold text-lg">Verification</h3>
               </div>
               <div className="hidden md:block flex-1 h-1 border-t-2 border-dashed border-gray-400"></div>
               <div className="text-center">
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-black text-xl mx-auto mb-4 shadow-lg">4</div>
                 <h3 className="font-bold text-lg">Start listing</h3>
               </div>
             </div>
          </div>
        </section>

        {/* APPLICATION FORM */}
        <section id="apply-form" className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-12">Ready to join ShareHood?</h2>
          
          <div className="bg-white rounded-3xl shadow-xl shadow-brand-yellow/5 border-2 border-brand-yellow p-8 md:p-12">
            <div className="mb-8">
              <h3 className="text-brand-yellow font-black text-lg mb-2 uppercase tracking-wide">Register your business</h3>
              <h4 className="text-2xl font-bold text-gray-900">Start renting out your equipment securely</h4>
            </div>

            {success ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                   <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
                <p className="text-gray-500 font-medium">Redirecting you to your dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl font-bold text-sm border border-red-100 flex gap-2 items-center">
                    <ShieldCheck className="w-5 h-5 shrink-0" /> {error}
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Business/Store Name</label>
                    <input 
                      type="text" 
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                    <input 
                      type="tel" 
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">City / Location *</label>
                  <input 
                    type="text" 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Categories you want to rent out *</label>
                  <div className="flex flex-wrap gap-2">
                    {["Tools", "Electronics", "Camping", "Party", "Gardening", "Sports", "Cameras"].map(cat => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => handleCategoryToggle(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                          formData.categoriesInterestedIn.includes(cat) 
                            ? "bg-brand-black text-white border-brand-black shadow-md" 
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Relevant experience or inventory description *</label>
                  <textarea 
                    name="experienceDescription"
                    value={formData.experienceDescription}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all h-24 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Why do you want to join ShareHood? *</label>
                  <textarea 
                    name="reasonForJoining"
                    value={formData.reasonForJoining}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-yellow transition-all h-24 resize-none"
                    required
                  />
                </div>
                
                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-brand-yellow text-brand-black font-black px-10 py-4 rounded-full hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                    {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// Subcomponents
function StatItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-brand-yellow shrink-0" />
      <span className="font-bold text-lg md:text-xl text-gray-800">{label}</span>
    </div>
  );
}

function BenefitCard({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center gap-6 hover:shadow-md transition-shadow relative z-10">
      <div className="w-16 h-16 bg-[#FFF9F2] rounded-full flex items-center justify-center text-brand-black border border-brand-yellow/30">
        {icon}
      </div>
      <p className="font-bold text-lg text-gray-800 leading-tight">{title}</p>
    </div>
  );
}

function CategoryCard({ title, subtitle, items }: { title: string, subtitle: string, items: string[] }) {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/40">
      <h3 className="font-black text-xl text-brand-black mb-1">{title}</h3>
      <p className="text-sm font-medium text-gray-500 mb-6">{subtitle}</p>
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-yellow mt-2 shrink-0" />
            <span className="text-sm font-medium text-gray-700">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ShowcaseBadge({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
      {icon}
      <span className="font-bold text-sm">{label}</span>
    </div>
  );
}
