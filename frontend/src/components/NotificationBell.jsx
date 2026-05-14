import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const { backendUrl } = useAppContext();
    const { authUser } = useAuthContext();
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        if (!authUser) return;
        try {
            const token = localStorage.getItem('ccps-token');
            const res = await fetch(`${backendUrl}/api/notifications`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setNotifications(data.data);
            }
        } catch (error) {
            console.error("Error fetching notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 60 seconds
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, [authUser]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('ccps-token');
            const res = await fetch(`${backendUrl}/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setNotifications(notifications.map(n => n.notification_id === id ? { ...n, is_read: 1 } : n));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleNotificationClick = async (notification) => {
        // Mark as read immediately to update UI without waiting for navigation
        if (!notification.is_read) {
            markAsRead(notification.notification_id);
        }
        
        setIsOpen(false); // Close dropdown
        
        // Navigate to appropriate section based on type
        switch (notification.type) {
            case 'hr_approval':
            case 'approval':
                navigate('/admin/hr-contacts-repository');
                break;
            case 'user_approval':
                navigate('/admin/user-management');
                break;
            case 'follow_up':
                navigate('/caller-call-logs');
                break;
            case 'admin_message':
                navigate(authUser?.role === 'admin' ? '/admin/admin-dashboard' : '/caller-dashboard');
                break;
            case 'system':
                navigate(authUser?.role === 'admin' ? '/admin/admin-dashboard' : '/caller-dashboard');
                break;
            default:
                break;
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('ccps-token');
            const res = await fetch(`${backendUrl}/api/notifications/read-all`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setNotifications(notifications.map(n => ({ ...n, is_read: 1 })));
                toast.success("All notifications marked as read");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="relative p-2 text-white hover:text-gray-200 focus:outline-none transition rounded-full hover:bg-white/10"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex items-center justify-center p-1 text-[10px] text-white bg-red-500 rounded-full min-w-[18px] h-[18px]">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute left-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden text-left z-[100]">
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                            >
                                <Check size={14} /> Mark all as read
                            </button>
                        )}
                    </div>
                    
                    <div className="overflow-y-auto max-h-[350px]">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">
                                <p className="text-sm">No new notifications</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {notifications.map((notification) => (
                                    <li 
                                        key={notification.notification_id} 
                                        className={`px-4 py-3 hover:bg-gray-50 transition cursor-pointer flex gap-3 ${!notification.is_read ? 'bg-emerald-50/30' : ''}`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm tracking-tight ${!notification.is_read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1">
                                                {new Date(notification.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                        {!notification.is_read && (
                                            <div className="flex-shrink-0 flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
