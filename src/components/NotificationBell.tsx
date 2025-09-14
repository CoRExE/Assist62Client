import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAppStore } from '../store';
import { Notification } from '../types/api';

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const user = useAppStore((state) => state.user);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const response = await api.get<Notification[]>(`/user/${user.id}/notifications`);
        setNotifications(response.data);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute

    return () => clearInterval(interval);
  }, [user]);

  const markAsRead = async (notificationId: number) => {
    try {
      await api.post(`/notifications/${notificationId}/read`);
      setNotifications(notifications.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={() => setIsOpen(!isOpen)}>
        🔔 {unreadCount > 0 && `(${unreadCount})`}
      </button>
      {isOpen && (
        <div style={{ position: 'absolute', top: '100%', right: 0, border: '1px solid #ccc', background: '#fff', width: '300px' }}>
          {notifications.length === 0 ? (
            <p>No new notifications</p>
          ) : (
            <ul>
              {notifications.map((n) => (
                <li key={n.id} style={{ borderBottom: '1px solid #eee', padding: '10px' }}>
                  <p>{n.message}</p>
                  <small>{new Date(n.creationDate).toLocaleString()}</small>
                  {!n.isRead && <button onClick={() => markAsRead(n.id)}>Mark as read</button>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
