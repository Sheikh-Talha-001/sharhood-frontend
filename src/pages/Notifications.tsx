import { useState, useEffect } from "react";
import { NotificationCard, NotificationProps } from "@/src/components/NotificationCard";
import { notificationService } from "@/src/services/notificationService";
import { LoadingSpinner } from "@/src/components/LoadingSpinner";

export function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
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
    };
    fetchNotifications();
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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Notifications</h1>
          <p className="text-gray-500 font-medium mt-1">Stay updated with your activities.</p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="text-sm font-bold text-gray-500 hover:text-brand-black transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="py-20"><LoadingSpinner /></div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center font-bold">{error}</div>
      ) : notifications.length > 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-2">
           {notifications.map((notification, index) => (
             <div key={notification._id || notification.id}>
               <NotificationCard notification={notification} onMarkRead={markAsRead} />
               {index < notifications.length - 1 && <div className="h-px bg-gray-50 my-1 mx-4" />}
             </div>
           ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center text-gray-500 font-medium">
          You have no notifications yet.
        </div>
      )}
    </div>
  );
}
