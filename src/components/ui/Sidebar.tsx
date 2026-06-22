"use client";

import React from "react";
import { UserProfile } from "@/lib/storage";

interface NavGroupItem {
  page: string;
  label: string;
  icon: string;
  badgeKey?: "notifications" | "messages";
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile | null;
  unreadNotifs: number;
  unreadMsgs: number;
  onLogout: (e: React.MouseEvent) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  user,
  unreadNotifs,
  unreadMsgs,
  onLogout,
  isOpen,
  onClose,
}: SidebarProps) {
  const groups = [
    {
      label: "Main",
      items: [
        { page: "dashboard", label: "Dashboard", icon: "fa-th-large" },
        { page: "book-ride", label: "Book Ride", icon: "fa-route" },
        { page: "map", label: "Live Map", icon: "fa-map-marked-alt" },
        { page: "history", label: "Ride History", icon: "fa-history" },
        { page: "scheduled", label: "Scheduled Trips", icon: "fa-calendar-alt" },
      ] as NavGroupItem[],
    },
    {
      label: "Finance",
      items: [
        { page: "wallet", label: "Wallet", icon: "fa-wallet" },
        { page: "payments", label: "Payments", icon: "fa-credit-card" },
        { page: "rewards", label: "Rewards", icon: "fa-trophy" },
        { page: "promotions", label: "Promotions", icon: "fa-percentage" },
      ] as NavGroupItem[],
    },
    {
      label: "Social",
      items: [
        { page: "notifications", label: "Notifications", icon: "fa-bell", badgeKey: "notifications" },
        { page: "messages", label: "Messages", icon: "fa-comments", badgeKey: "messages" },
        { page: "favorites", label: "Favorites", icon: "fa-heart" },
        { page: "saved-places", label: "Saved Places", icon: "fa-bookmark" },
      ] as NavGroupItem[],
    },
    {
      label: "Account",
      items: [
        { page: "profile", label: "Profile", icon: "fa-user-circle" },
        { page: "settings", label: "Settings", icon: "fa-cog" },
        { page: "help", label: "Help Center", icon: "fa-question-circle" },
      ] as NavGroupItem[],
    },
  ];

  return (
    <>
      {/* Mobile Sidebar overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[1100] md:hidden animate-fade-in"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-[260px] bg-slate-900 border-r border-white/5 flex flex-col justify-between z-[1200] transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-white/5 shrink-0">
            <div className="flex items-center gap-3 text-xl font-black text-white tracking-widest">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-main via-gold-main to-red-main flex items-center justify-center text-base shadow-lg shadow-blue-light/10">
                <i className="fas fa-taxi text-white"></i>
              </div>
              <span>CAB</span>
            </div>
            <button
              onClick={onClose}
              className="md:hidden text-slate-400 hover:text-white p-1 text-lg"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6 flex flex-col gap-6" aria-label="Main Navigation">
            {groups.map((group, gIdx) => (
              <div key={gIdx} className="flex flex-col gap-1.5">
                <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {group.label}
                </span>
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item, iIdx) => {
                    const isActive = activeTab === item.page;
                    let badgeCount = 0;
                    if (item.badgeKey === "notifications") badgeCount = unreadNotifs;
                    if (item.badgeKey === "messages") badgeCount = unreadMsgs;

                    return (
                      <a
                        key={iIdx}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveTab(item.page);
                          onClose(); // Auto close on mobile click
                        }}
                        className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all group ${
                          isActive
                            ? "bg-blue-light/10 border border-blue-light/20 text-blue-light shadow-sm"
                            : "border border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <i
                            className={`fas ${item.icon} text-base transition-colors ${
                              isActive ? "text-blue-light" : "text-slate-500 group-hover:text-slate-300"
                            }`}
                          ></i>
                          <span>{item.label}</span>
                        </div>
                        {badgeCount > 0 && (
                          <span className="w-5 h-5 rounded-full bg-red-main text-[10px] font-extrabold text-white flex items-center justify-center animate-pulse">
                            {badgeCount}
                          </span>
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Logout button at bottom of nav */}
            <a
              href="#"
              onClick={onLogout}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold border border-transparent text-red-light/75 hover:bg-red-main/10 hover:text-red-light transition-all"
            >
              <i className="fas fa-sign-out-alt text-base"></i>
              <span>Logout</span>
            </a>
          </nav>
        </div>

        {/* User Mini Panel */}
        {user && (
          <div className="border-t border-white/5 p-4 bg-slate-950/30 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-slate-800 text-xs font-black text-slate-200 flex items-center justify-center border border-white/5 shadow-inner">
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white truncate leading-normal">{user.name}</h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <i className="fas fa-star text-[10px] text-gold-light"></i>
                <span className="text-[10px] text-slate-400 font-bold">{user.rating || "4.9"} Rider</span>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
