import React, { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getNotifications, markAllNotificationsRead, markNotificationRead } from "../services/resources";
import { useSocket } from "../context/SocketContext.jsx";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef(null);
  const { socket } = useSocket();
  const navigate = useNavigate();

  const load = () => {
    getNotifications().then(({ notifications, unreadCount }) => {
      setNotifications(notifications);
      setUnreadCount(unreadCount);
    });
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handler = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((c) => c + 1);
    };
    socket.on("notification:new", handler);
    return () => socket.off("notification:new", handler);
  }, [socket]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleOpenNotification = async (n) => {
    if (!n.isRead) {
      await markNotificationRead(n._id);
      setUnreadCount((c) => Math.max(0, c - 1));
      setNotifications((prev) => prev.map((x) => (x._id === n._id ? { ...x, isRead: true } : x)));
    }
    if (n.relatedBoard) navigate(`/boards/${n.relatedBoard}`);
    else if (n.relatedNote && n.relatedWorkspace) navigate(`/workspaces/${n.relatedWorkspace}?tab=notes`);
    else if (n.relatedWorkspace) navigate(`/workspaces/${n.relatedWorkspace}`);
    setOpen(false);
  };

  const handleMarkAll = async () => {
    await markAllNotificationsRead();
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-lg hover:bg-slate-faint dark:hover:bg-white/10 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-coral text-white text-[10px] font-semibold min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-surface dark:bg-surface-dark rounded-xl shadow-pop border border-slate-faint dark:border-white/10 z-40 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-faint dark:border-white/10">
            <span className="font-semibold text-sm">Notifications</span>
            {unreadCount > 0 && (
              <button onClick={handleMarkAll} className="text-xs text-sync hover:underline">
                Mark all read
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate">No notifications yet</div>
          ) : (
            notifications.map((n) => (
              <button
                key={n._id}
                onClick={() => handleOpenNotification(n)}
                className={`w-full text-left px-4 py-3 border-b border-slate-faint dark:border-white/10 hover:bg-paper dark:hover:bg-white/5 transition-colors flex gap-2 ${
                  !n.isRead ? "bg-sync/5" : ""
                }`}
              >
                {!n.isRead && <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-sync flex-shrink-0" />}
                <div className="flex-1">
                  <p className="text-sm">{n.message}</p>
                  <p className="text-xs text-slate mt-0.5">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
