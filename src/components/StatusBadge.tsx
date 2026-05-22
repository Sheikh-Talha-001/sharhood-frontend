import { cn } from "@/src/lib/utils";

interface Props {
  status: "pending" | "approved" | "rejected" | "active";
}

export function StatusBadge({ status }: Props) {
  const styles = {
    pending: "bg-brand-yellow/20 text-yellow-800 border-yellow-200",
    approved: "bg-green-100 text-green-800 border-green-200",
    active: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span className={cn("px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md border inline-block", styles[status])}>
      {status}
    </span>
  );
}
