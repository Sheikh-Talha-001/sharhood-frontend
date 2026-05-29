import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AgreementCard } from "@/src/components/AgreementCard";
import { SearchBar } from "@/src/components/SearchBar";
import { agreementService } from "@/src/services/agreementService";
import { PageSkeleton } from "@/src/components/LoadingSkeletons";
import { EmptyState } from "@/src/components/EmptyState";
import { useAuth } from "@/src/context/AuthContext";
import { ComplaintModal } from "@/src/components/ComplaintModal";
import { FileText } from "lucide-react";

export function Agreements() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"borrowing" | "lending">("borrowing");
  const [agreements, setAgreements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Complaint modal state
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [complaintAgreement, setComplaintAgreement] = useState<any>(null);

  useEffect(() => {
    const fetchAgreements = async () => {
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

  const handleOpenComplaint = (agreement: any) => {
    setComplaintAgreement(agreement);
    setIsComplaintModalOpen(true);
  };

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
        <button type="button" 
          onClick={() => setActiveTab("borrowing")}
          className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === "borrowing" ? "bg-white text-brand-black shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
        >
          Borrows
        </button>
        <button type="button" 
          onClick={() => setActiveTab("lending")}
          className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === "lending" ? "bg-white text-brand-black shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
        >
          Lends
        </button>
      </div>

      {isLoading ? (
        <PageSkeleton />
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center font-bold">{error}</div>
      ) : filteredAgreements.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {filteredAgreements.map(agreement => (
             <AgreementCard 
               key={agreement._id || agreement.id} 
               agreement={agreement} 
               isLender={activeTab === "lending"} 
               onComplaintClick={handleOpenComplaint}
             />
           ))}
        </div>
      ) : (
        <EmptyState 
          icon={FileText}
          title="No agreements found"
          description={`You don't have any ${activeTab} agreements at the moment.`}
          actionLabel={activeTab === "borrowing" ? "Browse Items" : undefined}
          actionLink={activeTab === "borrowing" ? "/dashboard/marketplace" : undefined}
        />
      )}

      {complaintAgreement && (
        <ComplaintModal 
          isOpen={isComplaintModalOpen}
          onClose={() => {
            setIsComplaintModalOpen(false);
            setComplaintAgreement(null);
          }}
          agreementId={complaintAgreement._id || complaintAgreement.id}
          itemTitle={complaintAgreement.item?.title || "Unknown Item"}
        />
      )}
    </div>
  );
}
