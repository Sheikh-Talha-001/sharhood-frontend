import { ShieldCheck, CheckCircle2, Award } from "lucide-react";

interface TrustBadgeProps {
  type: "verified" | "partner" | "id-checked" | "super-lender";
  className?: string;
  showText?: boolean;
}

export function TrustBadge({ type, className = "", showText = true }: TrustBadgeProps) {
  switch (type) {
    case "verified":
      return (
        <div className={`flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200/50 ${className}`}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          {showText && "Verified ID"}
        </div>
      );
    case "id-checked":
      return (
        <div className={`flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/50 ${className}`}>
          <ShieldCheck className="w-3.5 h-3.5" />
          {showText && "Identity Checked"}
        </div>
      );
    case "partner":
      return (
        <div className={`flex items-center gap-1.5 text-xs font-bold text-brand-black bg-brand-yellow/30 px-2.5 py-1 rounded-full border border-brand-yellow ${className}`}>
          <Award className="w-3.5 h-3.5" />
          {showText && "Partner"}
        </div>
      );
    case "super-lender":
      return (
        <div className={`flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200/50 ${className}`}>
          <Award className="w-3.5 h-3.5 text-purple-600" />
          {showText && "Super Lender"}
        </div>
      );
    default:
      return null;
  }
}
