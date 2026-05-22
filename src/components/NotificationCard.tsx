import { Bell, ShieldCheck, FileText, CheckCircle, Package } from "lucide-react";
import { cn } from "@/src/lib/utils";

export interface NotificationProps {
  id: string;
  type: "verification" | "borrow" | "agreement" | "system" | "partner";
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

interface Props {
  notification: NotificationProps;
  onMarkRead?: (id: string) => void;
}

export function NotificationCard({ notification, onMarkRead }: Props) {
  const getIcon = () => {
    switch (notification.type) {
      case "verification": return <ShieldCheck className="w-5 h-5 text-blue-500" />;
      case "borrow": return <Package className="w-5 h-5 text-brand-yellow" />;
      case "agreement": return <FileText className="w-5 h-5 text-purple-500" />;
      case "partner": return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case "verification": return "bg-blue-50";
      case "borrow": return "bg-brand-yellow/20";
      case "agreement": return "bg-purple-50";
      case "partner": return "bg-green-50";
      default: return "bg-gray-50";
    }
  };

  return (
    <div className={cn("p-4 rounded-2xl border flex gap-4 transition-all duration-200", 
      notification.isRead ? "bg-white border-gray-100" : "bg-blue-50/30 border-blue-100"
    )}>
      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5", getBgColor())}>
        {getIcon()}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h4 className="font-bold text-sm text-gray-900">{notification.title}</h4>
          <span className="text-xs font-semibold text-gray-400 whitespace-nowrap">{notification.time}</span>
        </div>
        <p className="text-sm font-medium text-gray-600 mb-2 leading-relaxed">{notification.description}</p>
        {!notification.isRead && onMarkRead && (
          <button 
            onClick={() => onMarkRead(notification.id)}
            className="text-xs font-bold text-brand-black hover:text-brand-orange transition-colors"
          >
            Mark as read
          </button>
        )}
      </div>
      {!notification.isRead && (
        <div className="w-2.5 h-2.5 bg-brand-orange rounded-full flex-shrink-0 mt-2" />
      )}
    </div>
  );
}
