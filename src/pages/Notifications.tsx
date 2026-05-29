import { useState, useEffect, useCallback } from "react";
import { NotificationCard } from "@/src/components/NotificationCard";
import { notificationService } from "@/src/services/notificationService";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";
import { getSocket } from "@/src/lib/socket";
import { Bell, Check, Filter } from "lucide-react";

type FilterType = "all" | "unread";

export function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await notificationService.getAll();
      setNotifications(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load notifications");
    } finally {
      setIsLoading(false);
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
        const handleNewNotification = (notification: any) => {
          setNotifications(prev => [notification, ...prev]);
        };

        socket.on("new_notification", handleNewNotification);
        cleanup = () => socket.off("new_notification", handleNewNotification);
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

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => (n._id || n.id) === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filteredNotifications = filter === "unread"
    ? notifications.filter(n => !n.isRead)
    : notifications;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#241d1b]">Notifications</h1>
          <p className="text-[#888888] font-medium text-sm mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'You\'re all caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button type="button" 
            onClick={markAllAsRead}
            className="text-sm font-bold text-[#7e0038] hover:text-[#5c002a] transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[#7e0038]/5"
          >
            <Check className="size-4" /> Mark all read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 bg-[#f5f5f5] rounded-xl p-1 w-fit">
        {(["all", "unread"] as FilterType[]).map((f) => (
          <button type="button"
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              filter === f
                ? "bg-white text-[#241d1b] shadow-sm"
                : "text-[#888888] hover:text-[#555555]"
            }`}
          >
            {f === "all" ? "All" : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-20"><LoadingSpinner /></div>
      ) : error ? (
        <div className="bg-red-50 text-[#b91c1c] p-6 rounded-2xl text-center font-bold border border-red-100">{error}</div>
      ) : filteredNotifications.length > 0 ? (
        <div className="space-y-2">
          {filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification._id || notification.id}
              notification={notification}
              onMarkRead={markAsRead}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#e5e5e5] p-12 text-center">
          <Bell className="size-10 text-[#cccccc] mx-auto mb-4" />
          <p className="text-[#999999] font-semibold text-sm">
            {filter === "unread" ? "No unread notifications" : "No notifications yet"}
          </p>
          <p className="text-[#bbbbbb] text-xs mt-2">
            {filter === "unread" ? "You're all caught up!" : "Important updates will appear here."}
          </p>
        </div>
      )}
    </div>
  );
}
