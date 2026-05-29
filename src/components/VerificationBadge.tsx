import { CheckCircle, Shield, LucideIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface Props {
  status: "verified" | "pending" | "unverified" | "rejected";
  type?: "identity" | "partner";
}

export function VerificationBadge({ status, type = "identity" }: Props) {
  const isIdentity = type === "identity";
  const Icon: LucideIcon = isIdentity ? Shield : CheckCircle;
  
  const styles = {
    verified: "bg-green-50 text-green-700 border-green-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    unverified: "bg-gray-50 text-gray-600 border-gray-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };

  const labels = {
    verified: isIdentity ? "ID Verified" : "Verified Partner",
    pending: "Verification Pending",
    unverified: "Not Verified",
    rejected: "Verification Failed",
  };

  return (
    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border", styles[status])}>
      <Icon className="size-3.5" />
      {labels[status]}
    </div>
  );
}
