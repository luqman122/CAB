"use client";

import React from "react";

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const items = [
    { page: "dashboard", label: "Home", icon: "fa-th-large" },
    { page: "book-ride", label: "Book", icon: "fa-taxi" },
    { page: "map", label: "Map", icon: "fa-map-marked-alt" },
    { page: "wallet", label: "Wallet", icon: "fa-wallet" },
    { page: "profile", label: "Profile", icon: "fa-user-circle" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[64px] bg-slate-900/90 backdrop-blur-md border-t border-white/5 z-[800] flex justify-around items-center px-2 md:hidden shadow-lg">
      {items.map((item, idx) => {
        const isActive = activeTab === item.page;
        return (
          <a
            key={idx}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab(item.page);
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-bold transition-all min-w-[56px] ${
              isActive ? "text-blue-light" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <i className={`fas ${item.icon} text-lg`}></i>
            <span>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
