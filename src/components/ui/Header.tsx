"use client";

import React, { useState, useEffect } from "react";
import { UserProfile } from "@/lib/storage";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile | null;
  unreadNotifs: number;
  unreadMsgs: number;
  onHamburgerClick: () => void;
  onLogout: (e: React.MouseEvent) => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  user,
  unreadNotifs,
  unreadMsgs,
  onHamburgerClick,
  onLogout,
}: HeaderProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case "dashboard":
        return "Dashboard";
      case "book-ride":
        return "Book Ride";
      case "map":
        return "Live Map";
      case "history":
        return "Ride History";
      case "scheduled":
        return "Scheduled Trips";
      case "wallet":
        return "Wallet";
      case "payments":
        return "Payments";
      case "rewards":
        return "Rewards";
      case "promotions":
        return "Promotions";
      case "notifications":
        return "Notifications";
      case "messages":
        return "Messages";
      case "favorites":
        return "Favorites";
      case "saved-places":
        return "Saved Places";
      case "profile":
        return "Profile";
      case "settings":
        return "Settings";
      case "help":
        return "Help Center";
      default:
        return "CAB Taxi";
    }
  };

  return (
    <header className="fixed top-0 left-0 md:left-[260px] right-0 h-[70px] bg-slate-900/80 backdrop-blur-md border-b border-white/5 z-50 flex items-center justify-between px-6 shadow-md">
      {/* Left Area: Toggle sidebar & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={onHamburgerClick}
          className="md:hidden text-slate-300 hover:text-white p-2 text-xl cursor-pointer"
        >
          <i className="fas fa-bars"></i>
        </button>

        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
            CAB Portal
          </span>
          <h2 className="text-lg font-extrabold text-white mt-1 leading-none">
            {getPageTitle(activeTab)}
          </h2>
        </div>
      </div>

      {/* Middle Area: Weather & Clock (Desktop) */}
      <div className="hidden lg:flex items-center gap-6 text-xs text-slate-400 font-semibold bg-slate-950/20 px-4 py-2 rounded-xl border border-white/5">
        <div className="flex items-center gap-2">
          <i className="fas fa-cloud-sun text-gold-light text-sm"></i>
          <span>Mogadishu 31°C</span>
        </div>
        <div className="w-[1px] h-3 bg-white/10" />
        <div className="flex items-center gap-2">
          <i className="far fa-clock text-blue-light text-sm"></i>
          <span>{currentTime}</span>
        </div>
      </div>

      {/* Right Area: Search, Notifs, Messages, Profile Dropdown */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Search database..."
            className="w-48 xl:w-60 py-2 pl-9 pr-4 text-xs font-semibold text-white bg-slate-950/40 border border-white/5 rounded-xl focus:border-blue-light focus:outline-none transition-all"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const q = (e.target as HTMLInputElement).value.trim();
                if (q) alert(`Searching database mock for: "${q}"`);
              }
            }}
          />
          <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
        </div>

        {/* Messages */}
        <button
          onClick={() => setActiveTab("messages")}
          className="relative w-9 h-9 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
        >
          <i className="fas fa-comments text-base"></i>
          {unreadMsgs > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-main text-[9px] font-black text-white flex items-center justify-center animate-pulse">
              {unreadMsgs}
            </span>
          )}
        </button>

        {/* Notifications */}
        <button
          onClick={() => setActiveTab("notifications")}
          className="relative w-9 h-9 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
        >
          <i className="fas fa-bell text-base"></i>
          {unreadNotifs > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-main text-[9px] font-black text-white flex items-center justify-center animate-pulse">
              {unreadNotifs}
            </span>
          )}
        </button>

        {/* Divider */}
        <div className="w-[1px] h-5 bg-white/10 hidden sm:block" />

        {/* User Trigger */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-800/50 transition-all cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-main to-red-main text-white text-xs font-black flex items-center justify-center border border-white/10 shadow-sm shrink-0">
                {user.avatar}
              </div>
              <span className="text-xs font-bold text-slate-300 hidden sm:inline">
                {user.name.split(" ")[0]}
              </span>
              <i className="fas fa-chevron-down text-[10px] text-slate-500 hidden sm:inline transition-transform duration-200"></i>
            </button>

            {profileDropdownOpen && (
              <>
                <div
                  onClick={() => setProfileDropdownOpen(false)}
                  className="fixed inset-0 z-40"
                />
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/5 rounded-2xl shadow-2xl p-2 z-50 animate-fade-in flex flex-col gap-0.5">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("profile");
                      setProfileDropdownOpen(false);
                    }}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors"
                  >
                    <i className="fas fa-user-circle text-slate-500 text-sm"></i>
                    <span>My Profile</span>
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("settings");
                      setProfileDropdownOpen(false);
                    }}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors"
                  >
                    <i className="fas fa-cog text-slate-500 text-sm"></i>
                    <span>Settings</span>
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("help");
                      setProfileDropdownOpen(false);
                    }}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors"
                  >
                    <i className="fas fa-question-circle text-slate-500 text-sm"></i>
                    <span>Help Center</span>
                  </a>
                  <div className="h-[1px] bg-white/5 my-1" />
                  <a
                    href="#"
                    onClick={(e) => {
                      setProfileDropdownOpen(false);
                      onLogout(e);
                    }}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-light/75 hover:bg-red-main/5 hover:text-red-light transition-colors"
                  >
                    <i className="fas fa-sign-out-alt text-sm"></i>
                    <span>Log Out</span>
                  </a>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
