import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AgreementCard, AgreementProps } from "@/src/components/AgreementCard";
import { SearchBar } from "@/src/components/SearchBar";
import { agreementService } from "@/src/services/agreementService";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { useAuth } from "@/src/context/AuthContext";

export function Agreements() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"borrowing" | "lending">("borrowing");
  const [agreements, setAgreements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgreements = async () => {
      setIsLoading(true);
      try {
        const response = await agreementService.getAll();
        setAgreements(response.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load agreements");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAgreements();
  }, []);

  const filteredAgreements = agreements.filter(a => 
    activeTab === "borrowing" 
      ? (a.borrower?._id === user?._id || a.borrower === user?._id)
      : (a.owner?._id === user?._id || a.owner === user?._id)
  ); 


  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Rental Agreements</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your active and past rental contracts.</p>
        </div>
        <div className="w-full sm:w-72">
          <SearchBar placeholder="Search agreements..." />
        </div>
      </div>

      <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-full w-max">
        <button 
          onClick={() => setActiveTab("borrowing")}
          className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === "borrowing" ? "bg-white text-brand-black shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
        >
          Borrows
        </button>
        <button 
          onClick={() => setActiveTab("lending")}
          className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === "lending" ? "bg-white text-brand-black shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
        >
          Lends
        </button>
      </div>

      {isLoading ? (
        <div className="py-20"><LoadingSpinner /></div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center font-bold">{error}</div>
      ) : filteredAgreements.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {filteredAgreements.map(agreement => (
             <AgreementCard 
               key={agreement._id || agreement.id} 
               agreement={agreement} 
               isLender={activeTab === "lending"} 
             />
           ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
           </div>
           <h3 className="text-xl font-bold text-brand-black mb-2">No agreements found</h3>
           <p className="text-gray-500 font-medium max-w-sm mb-6">You don't have any {activeTab} agreements at the moment.</p>
            {activeTab === "borrowing" && (
             <Link to="/dashboard/marketplace" className="bg-brand-black text-white px-6 py-3 rounded-full font-bold hover:bg-brand-yellow hover:text-brand-black transition-colors">
               Browse Items
             </Link>
            )}
        </div>
      )}
    </div>
  );
}
