import { Bell, ShieldCheck, FileText, CheckCircle, Package, XCircle, AlertTriangle, UserCheck, Flag, Handshake, ArrowLeftRight, Scale } from "lucide-react";
import { cn } from "@/src/lib/utils";

// ============================================================
// Notification type → visual mapping
// ============================================================
// These match the EXACT enum values from the backend
// notificationModel.js type field.
// ============================================================

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; bg: string; label: string }> = {
  // Borrow workflow
  borrow_request:        { icon: <Package className="size-5 text-[#7e0038]" />,       bg: "bg-[#7e0038]/10", label: "Borrow" },
  request_approved:      { icon: <CheckCircle className="size-5 text-[#10664c]" />,   bg: "bg-[#10664c]/10", label: "Approved" },
  request_rejected:      { icon: <XCircle className="size-5 text-[#b91c1c]" />,       bg: "bg-red-50",       label: "Rejected" },
  request_cancelled:     { icon: <ArrowLeftRight className="size-5 text-[#6b7280]" />, bg: "bg-gray-100",     label: "Cancelled" },
  item_returned:         { icon: <Handshake className="size-5 text-[#10664c]" />,     bg: "bg-[#10664c]/10", label: "Returned" },
  agreement_generated:   { icon: <FileText className="size-5 text-[#7e0038]" />,      bg: "bg-[#7e0038]/10", label: "Agreement" },
  // Verification
  verification_approved: { icon: <ShieldCheck className="size-5 text-[#10664c]" />,   bg: "bg-[#10664c]/10", label: "Verified" },
  verification_rejected: { icon: <XCircle className="size-5 text-[#b91c1c]" />,       bg: "bg-red-50",       label: "Verification" },
  // Item moderation
  item_removed:          { icon: <AlertTriangle className="size-5 text-[#b91c1c]" />, bg: "bg-red-50",       label: "Moderation" },
  item_restored:         { icon: <CheckCircle className="size-5 text-[#10664c]" />,   bg: "bg-[#10664c]/10", label: "Restored" },
  // Account
  user_suspended:        { icon: <AlertTriangle className="size-5 text-[#b91c1c]" />, bg: "bg-red-50",       label: "Suspended" },
  account_reactivated:   { icon: <UserCheck className="size-5 text-[#10664c]" />,     bg: "bg-[#10664c]/10", label: "Reactivated" },
  // Reports
  report_resolved:       { icon: <Flag className="size-5 text-[#10664c]" />,          bg: "bg-[#10664c]/10", label: "Report" },
  // Partner
  partner_approved:      { icon: <CheckCircle className="size-5 text-[#10664c]" />,   bg: "bg-[#10664c]/10", label: "Partner" },
  partner_rejected:      { icon: <XCircle className="size-5 text-[#b91c1c]" />,       bg: "bg-red-50",       label: "Partner" },
  // Appeals
  appeal_approved:       { icon: <UserCheck className="size-5 text-[#10664c]" />,     bg: "bg-[#10664c]/10", label: "Appeal" },
  appeal_rejected:       { icon: <XCircle className="size-5 text-[#b91c1c]" />,       bg: "bg-red-50",       label: "Appeal" },
  // Admin-facing
  new_report:            { icon: <Flag className="size-5 text-[#f59e0b]" />,          bg: "bg-amber-50",     label: "Report" },
  new_verification:      { icon: <ShieldCheck className="size-5 text-[#3b82f6]" />,   bg: "bg-blue-50",      label: "Verification" },
  new_partner_application: { icon: <Scale className="size-5 text-[#7e0038]" />,       bg: "bg-[#7e0038]/10", label: "Application" },
  new_appeal:            { icon: <AlertTriangle className="size-5 text-[#f59e0b]" />, bg: "bg-amber-50",     label: "Appeal" },
  new_complaint:         { icon: <AlertTriangle className="size-5 text-[#f59e0b]" />, bg: "bg-amber-50",     label: "Complaint" },
  // Owner Complaints
  complaint_resolved:    { icon: <CheckCircle className="size-5 text-[#10664c]" />,   bg: "bg-[#10664c]/10", label: "Resolved" },
  complaint_rejected:    { icon: <XCircle className="size-5 text-[#b91c1c]" />,       bg: "bg-red-50",       label: "Rejected" },
};

const DEFAULT_CONFIG = { icon: <Bell className="size-5 text-gray-500" />, bg: "bg-gray-100", label: "Notification" };

// ============================================================
// Relative time formatting
// ============================================================
function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ============================================================
// Component
// ============================================================
interface Props {
  notification: any;
  onMarkRead?: (id: string) => void;
}

export function NotificationCard({ notification, onMarkRead }: Props) {
  const config = TYPE_CONFIG[notification.type] || DEFAULT_CONFIG;
  const id = notification._id || notification.id;

  return (
    <div className={cn(
      "p-4 rounded-2xl border flex gap-4 transition-all duration-200 cursor-pointer",
      notification.isRead ? "bg-white border-[#e5e5e5]" : "bg-[#fcf3ec]/50 border-[#7e0038]/15"
    )}>
      <div className={cn("size-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5", config.bg)}>
        {config.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h4 className={cn("text-sm truncate", notification.isRead ? "font-semibold text-[#333333]" : "font-bold text-[#241d1b]")}>
            {notification.title}
          </h4>
          <span className="text-[10px] font-bold text-[#999999] whitespace-nowrap mt-0.5">
            {timeAgo(notification.createdAt)}
          </span>
        </div>
        <p className="text-xs font-medium text-[#666666] mb-2 leading-relaxed line-clamp-2">
          {notification.message}
        </p>
        {!notification.isRead && onMarkRead && (
          <button type="button"
            onClick={(e) => { e.stopPropagation(); onMarkRead(id); }}
            className="text-xs font-bold text-[#7e0038] hover:text-[#5c002a] transition-colors"
          >
            Mark as read
          </button>
        )}
      </div>
      {!notification.isRead && (
        <div className="size-2.5 bg-[#7e0038] rounded-full flex-shrink-0 mt-2" />
      )}
    </div>
  );
}

// Re-export for backward compatibility
export type NotificationProps = any;
