import { useState, useEffect, useRef } from "react";
import { Bell, Check, X } from "lucide-react";
import { getSocket } from "@/src/lib/socket";
import api from "@/src/services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch initial notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications');
        const notifs = response.data.data || [];
        setNotifications(notifs);
        setUnreadCount(notifs.filter((n: any) => !n.isRead).length);
      } catch (err) {
        console.error("Failed to fetch notifications");
      }
    };
    fetchNotifications();
  }, []);

  // Listen for real-time socket notifications
  // The socket may not be connected yet when this component mounts,
  // so we poll briefly until it's available, then attach the listener.
  useEffect(() => {
    let cleanup: (() => void) | null = null;
    let attempts = 0;
    const MAX_ATTEMPTS = 20; // try for up to 10 seconds (20 × 500ms)

    const tryAttach = () => {
      const socket = getSocket();
      if (socket) {
        const handleNewNotification = (notification: any) => {
          setNotifications(prev => [notification, ...prev]);
          setUnreadCount(prev => prev + 1);
          toast.success(notification.title || "New Notification", { icon: '🔔' });
        };

        socket.on("new_notification", handleNewNotification);
        cleanup = () => socket.off("new_notification", handleNewNotification);
        return true; // attached successfully
      }
      return false;
    };

    // Try immediately first
    if (!tryAttach()) {
      // Socket not ready yet — poll until it is
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
    
    // Navigate based on type
    if (notification.type === 'new_request' || notification.type === 'request_approved') {
      navigate('/dashboard/agreements');
    } else if (notification.type === 'verification_approved' || notification.type === 'verification_rejected') {
      navigate('/dashboard/verification');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-bold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs font-bold text-brand-black hover:text-gray-500 transition-colors flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 font-medium">
                No notifications yet.
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((notification) => (
                  <div 
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <p className={`text-sm ${!notification.isRead ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                            {notification.title}
                          </p>
                          <span className="text-[10px] text-gray-400 font-bold ml-2 whitespace-nowrap">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className={`text-xs ${!notification.isRead ? 'text-gray-600' : 'text-gray-500'}`}>
                          {notification.message}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="flex flex-col justify-center">
                          <div className="w-2 h-2 rounded-full bg-brand-yellow"></div>
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
