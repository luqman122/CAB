"use client";

import React, { useState, useEffect } from "react";
import { storage } from "@/lib/storage";

interface Notification {
  id: string;
  title: string;
  text: string;
  time: string;
  read: boolean;
  type: "ride" | "wallet" | "promo" | "achievement" | "security" | "system";
}

const typeConfig: Record<string, { icon: string; color: string; bg: string }> = {
  ride: { icon: "fa-car", color: "text-blue-light", bg: "bg-blue-light/10" },
  wallet: { icon: "fa-wallet", color: "text-green-400", bg: "bg-green-400/10" },
  promo: { icon: "fa-percentage", color: "text-gold-light", bg: "bg-gold-light/10" },
  achievement: { icon: "fa-trophy", color: "text-purple-400", bg: "bg-purple-400/10" },
  security: { icon: "fa-shield-alt", color: "text-red-light", bg: "bg-red-main/10" },
  system: { icon: "fa-info-circle", color: "text-slate-400", bg: "bg-slate-800" },
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    const raw = storage.getItem("cab_notifications");
    const notifs = raw ? (JSON.parse(raw) as Notification[]) : [];
    if (notifs) {
      setNotifications(notifs);
    }
  }, []);

  const markAllRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    storage.setItem("cab_notifications", JSON.stringify(updated));
  };

  const markRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    storage.setItem("cab_notifications", JSON.stringify(updated));
  };

  const deleteNotif = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    storage.setItem("cab_notifications", JSON.stringify(updated));
  };

  const displayed = filter === "all" ? notifications : notifications.filter((n) => !n.read);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">Notifications</h2>
          <p className="text-xs text-slate-400 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All notifications read"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-light/10 border border-blue-light/20 text-blue-light text-xs font-bold hover:bg-blue-light/20 transition-all"
          >
            <i className="fas fa-check-double text-[11px]"></i>
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-slate-900 rounded-xl w-fit">
        {(["all", "unread"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
              filter === tab
                ? "bg-blue-light/10 border border-blue-light/20 text-blue-light"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {tab}
            {tab === "unread" && unreadCount > 0 && (
              <span className="ml-1.5 w-4 h-4 rounded-full bg-red-main text-[10px] text-white font-bold inline-flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="flex flex-col gap-3">
        {displayed.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center">
              <i className="fas fa-bell-slash text-2xl text-slate-600"></i>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-400">No notifications</h3>
              <p className="text-xs text-slate-600 mt-1">You&apos;re all caught up!</p>
            </div>
          </div>
        ) : (
          displayed.map((notif) => {
            const cfg = typeConfig[notif.type] || typeConfig.system;
            return (
              <div
                key={notif.id}
                onClick={() => markRead(notif.id)}
                className={`relative glass-panel rounded-2xl p-4 flex items-start gap-4 cursor-pointer transition-all hover:border-white/10 group ${
                  !notif.read ? "border-blue-light/15 bg-blue-light/3" : "opacity-80"
                }`}
              >
                {/* Unread indicator */}
                {!notif.read && (
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-light animate-pulse" />
                )}

                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${cfg.bg}`}>
                  <i className={`fas ${cfg.icon} ${cfg.color} text-sm`}></i>
                </div>

                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <h4 className={`text-sm font-bold ${notif.read ? "text-slate-300" : "text-white"}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 shrink-0">{notif.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{notif.text}</p>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotif(notif.id);
                  }}
                  className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg bg-red-main/20 text-red-light flex items-center justify-center text-[10px] hover:bg-red-main/30 transition-all"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
