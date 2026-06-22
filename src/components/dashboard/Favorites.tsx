"use client";

import React, { useState } from "react";
import Toast from "@/components/ui/Toast";

interface FavoritesProps {
  onBookRideWithDestination: (destination: string) => void;
}

export default function Favorites({ onBookRideWithDestination }: FavoritesProps) {
  const [activeTab, setActiveTab] = useState<"drivers" | "destinations" | "vehicles">("drivers");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);

  const handleBookDriver = (driverName: string, destSuggestion: string) => {
    setToast({ msg: `Booking request sent to your favorite driver: ${driverName}`, type: "success" });
    setTimeout(() => {
      onBookRideWithDestination(destSuggestion);
    }, 1500);
  };

  const handleBookDestination = (destination: string) => {
    onBookRideWithDestination(destination);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type === "success" ? "success" : toast.type === "error" ? "error" : "info"}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-white">Favorites</h2>
        <p className="text-xs text-slate-400 mt-1">Manage your most loved drivers, frequent destinations, and preferred ride styles</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-900 rounded-xl w-fit">
        {(["drivers", "destinations", "vehicles"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
              activeTab === tab
                ? "bg-blue-light/10 border border-blue-light/20 text-blue-light"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="glass-panel p-6 rounded-3xl">
        {activeTab === "drivers" && (
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Favorite Drivers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Driver 1 */}
              <div className="bg-slate-950/20 border border-white/5 rounded-2xl p-5 hover:bg-slate-900/40 transition-all flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-light/10 text-blue-light flex items-center justify-center text-base font-black border border-blue-light/20">
                    MH
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Mohamed Hassan</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Toyota Corolla • Silver • ABC-1234</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <i className="fas fa-star text-[10px] text-gold-light"></i>
                      <span className="text-[10px] text-slate-400 font-bold">4.9 ★ (120+ rides)</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleBookDriver("Mohamed Hassan", "Hamar-Weyne District")}
                  className="px-4 py-2 bg-gradient-to-r from-blue-main to-blue-light text-white rounded-xl font-bold text-xs hover:shadow-lg hover:shadow-blue-light/20 active:scale-95 transition-all"
                >
                  Book Now
                </button>
              </div>

              {/* Driver 2 */}
              <div className="bg-slate-950/20 border border-white/5 rounded-2xl p-5 hover:bg-slate-900/40 transition-all flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold-light/10 text-gold-light flex items-center justify-center text-base font-black border border-gold-light/20">
                    AR
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Abdi Rahman</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Hyundai Elantra • White • XYZ-5678</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <i className="fas fa-star text-[10px] text-gold-light"></i>
                      <span className="text-[10px] text-slate-400 font-bold">4.8 ★ (90+ rides)</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleBookDriver("Abdi Rahman", "KM4 Junction, Mogadishu")}
                  className="px-4 py-2 bg-gradient-to-r from-blue-main to-blue-light text-white rounded-xl font-bold text-xs hover:shadow-lg hover:shadow-blue-light/20 active:scale-95 transition-all"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "destinations" && (
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Frequent Destinations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Destination 1 */}
              <div className="bg-slate-950/20 border border-white/5 rounded-2xl p-5 hover:bg-slate-900/40 transition-all flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-red-main/10 text-red-light flex items-center justify-center text-base shrink-0">
                    <i className="fas fa-umbrella-beach"></i>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">Lido Beach</h4>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">Lido Beach road, Mogadishu</p>
                  </div>
                </div>
                <button
                  onClick={() => handleBookDestination("Lido Beach, Mogadishu")}
                  className="px-4 py-2 bg-gradient-to-r from-blue-main to-blue-light text-white rounded-xl font-bold text-xs hover:shadow-lg hover:shadow-blue-light/20 active:scale-95 transition-all shrink-0"
                >
                  Ride Now
                </button>
              </div>

              {/* Destination 2 */}
              <div className="bg-slate-950/20 border border-white/5 rounded-2xl p-5 hover:bg-slate-900/40 transition-all flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-base shrink-0">
                    <i className="fas fa-shopping-bag"></i>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white truncate">Mogadishu Mall</h4>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">KM4, Mogadishu</p>
                  </div>
                </div>
                <button
                  onClick={() => handleBookDestination("Mogadishu Mall, Mogadishu")}
                  className="px-4 py-2 bg-gradient-to-r from-blue-main to-blue-light text-white rounded-xl font-bold text-xs hover:shadow-lg hover:shadow-blue-light/20 active:scale-95 transition-all shrink-0"
                >
                  Ride Now
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "vehicles" && (
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Preferred Ride Styles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Ride 1 */}
              <div className="bg-slate-950/20 border border-white/5 rounded-2xl p-5 hover:bg-slate-900/40 transition-all flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-base">
                    <i className="fas fa-leaf"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Electric Eco Ride</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Clean, zero emission electric cars</p>
                  </div>
                </div>
                <button
                  onClick={() => onBookRideWithDestination("")}
                  className="px-4 py-2 bg-gradient-to-r from-blue-main to-blue-light text-white rounded-xl font-bold text-xs hover:shadow-lg hover:shadow-blue-light/20 active:scale-95 transition-all"
                >
                  Select Type
                </button>
              </div>

              {/* Ride 2 */}
              <div className="bg-slate-950/20 border border-white/5 rounded-2xl p-5 hover:bg-slate-900/40 transition-all flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-base">
                    <i className="fas fa-taxi"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Comfort Class</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Spacious, premium quality standard rides</p>
                  </div>
                </div>
                <button
                  onClick={() => onBookRideWithDestination("")}
                  className="px-4 py-2 bg-gradient-to-r from-blue-main to-blue-light text-white rounded-xl font-bold text-xs hover:shadow-lg hover:shadow-blue-light/20 active:scale-95 transition-all"
                >
                  Select Type
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
