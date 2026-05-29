import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, Check, ExternalLink } from "lucide-react";
import { getSocket } from "@/src/lib/socket";
import api from "@/src/services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// ============================================================
// Notification type → route mapping
// ============================================================
// Maps backend notification types to the correct frontend page
// so clicking a notification navigates the user to the right place.
// ============================================================
const getNotificationRoute = (notification: any): string => {
  switch (notification.type) {
    // Borrow workflow → incoming/my requests
    case "borrow_request":
      return "/dashboard/incoming-requests";
    case "request_approved":
    case "request_rejected":
    case "request_cancelled":
      return "/dashboard/my-requests";
    case "item_returned":
      return "/dashboard/agreements";
    case "agreement_generated":
      return "/dashboard/agreements";
    // Verification
    case "verification_approved":
    case "verification_rejected":
      return "/dashboard/verification";
    // Items
    case "item_removed":
    case "item_restored":
      return "/dashboard/my-items";
    // Account/suspension
    case "user_suspended":
    case "account_reactivated":
    case "appeal_approved":
    case "appeal_rejected":
      return "/dashboard";
    // Partner
    case "partner_approved":
    case "partner_rejected":
      return "/dashboard/partner";
    // Reports
    case "report_resolved":
      return "/dashboard";
    // Admin-facing
    case "new_report":
      return "/admin/reports";
    case "new_verification":
      return "/admin/verifications";
    case "new_partner_application":
      return "/admin/partners";
    case "new_appeal":
      return "/admin/appeals";
    default:
      return "/dashboard";
  }
};

// Relative time formatting
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

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await api.get('/notifications');
      const notifs = response.data.data || [];
      setNotifications(notifs);
      setUnreadCount(notifs.filter((n: any) => !n.isRead).length);
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Listen for real-time socket events
  useEffect(() => {
    let cleanup: (() => void) | null = null;
    let attempts = 0;
    const MAX_ATTEMPTS = 20;

    const tryAttach = () => {
      const socket = getSocket();
      if (socket) {
        // New notification arrives
        const handleNewNotification = (notification: any) => {
          setNotifications(prev => [notification, ...prev]);
          // Don't manually increment — the unread_count_update event will handle it
          toast(notification.title || "New Notification", {
            icon: '🔔',
            style: {
              background: '#241d1b',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '14px',
              borderRadius: '12px',
            },
          });
        };

        // Real-time unread count update (emitted by backend after every notify())
        const handleUnreadCount = (data: { unreadCount: number }) => {
          setUnreadCount(data.unreadCount);
        };

        socket.on("new_notification", handleNewNotification);
        socket.on("unread_count_update", handleUnreadCount);

        cleanup = () => {
          socket.off("new_notification", handleNewNotification);
          socket.off("unread_count_update", handleUnreadCount);
        };
        return true;
      }
      return false;
    };

    if (!tryAttach()) {
      const interval = setInterval(() => {
        attempts++;
        if (tryAttach() || attempts >= MAX_ATTEMPTS) {
          clearInterval(interval);
        }
      }, 500);

      return () => {
        clearInterval(interval);
        cleanup?.();
      };
    }

    return () => cleanup?.();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all as read");
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      handleMarkAsRead({ stopPropagation: () => {} } as any, notification._id);
    }
    setIsOpen(false);
    navigate(getNotificationRoute(notification));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#333333] hover:bg-[#fcf3ec] rounded-full transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#7e0038] text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-[#e5e5e5] overflow-hidden z-50"
          style={{ animation: 'fadeInDown 0.2s ease-out' }}
        >
          {/* Header */}
          <div className="p-4 border-b border-[#e5e5e5] flex items-center justify-between bg-[#faf7f5]">
            <h3 className="font-bold text-[#241d1b] text-sm">Notifications</h3>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-[11px] font-bold text-[#7e0038] hover:text-[#5c002a] transition-colors flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
              <button
                onClick={() => { setIsOpen(false); navigate('/dashboard'); }}
                className="text-[11px] font-bold text-[#666666] hover:text-[#241d1b] transition-colors flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" /> View all
              </button>
            </div>
          </div>
          
          {/* Notification list */}
          <div className="max-h-[420px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-10 text-center">
                <Bell className="w-8 h-8 text-[#cccccc] mx-auto mb-3" />
                <p className="text-sm font-semibold text-[#999999]">No notifications yet</p>
                <p className="text-xs text-[#bbbbbb] mt-1">You'll be notified about important updates here.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#f0f0f0]">
                {notifications.slice(0, 20).map((notification) => (
                  <div 
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-3.5 hover:bg-[#faf7f5] cursor-pointer transition-colors ${!notification.isRead ? 'bg-[#fcf3ec]/40' : ''}`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <p className={`text-[13px] truncate ${!notification.isRead ? 'font-bold text-[#241d1b]' : 'font-semibold text-[#555555]'}`}>
                            {notification.title}
                          </p>
                          <span className="text-[10px] text-[#999999] font-bold ml-2 whitespace-nowrap">
                            {timeAgo(notification.createdAt)}
                          </span>
                        </div>
                        <p className={`text-[11px] line-clamp-2 leading-relaxed ${!notification.isRead ? 'text-[#555555]' : 'text-[#888888]'}`}>
                          {notification.message}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="flex flex-col justify-center">
                          <div className="w-2 h-2 rounded-full bg-[#7e0038]"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
