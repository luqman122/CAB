"use client";

import React, { useState } from "react";
import { RideRecord } from "@/lib/storage";

interface RideHistoryProps {
  rides: RideRecord[];
  showToast: (msg: string, type: "success" | "error" | "warning" | "info") => void;
}

export default function RideHistory({ rides, showToast }: RideHistoryProps) {
  const [filter, setFilter] = useState<"all" | "completed" | "cancelled">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRides = rides.filter((ride) => {
    // Tab Filter
    if (filter !== "all" && ride.status !== filter) return false;

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDriver = ride.driver.toLowerCase().includes(q);
      const matchFrom = ride.from.toLowerCase().includes(q);
      const matchTo = ride.to.toLowerCase().includes(q);
      const matchCar = ride.car.toLowerCase().includes(q);
      return matchDriver || matchFrom || matchTo || matchCar;
    }

    return true;
  });

  return (
    <div className="glass-panel p-6 rounded-3xl animate-fade-in pb-12">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center border-b border-white/5 pb-5 mb-6">
        {/* Tabs */}
        <div className="flex gap-1.5 bg-slate-950/40 p-1.5 rounded-2xl border border-white/5">
          {(["all", "completed", "cancelled"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setFilter(tab);
                showToast(`Filter: ${tab.toUpperCase()}`, "info");
              }}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer ${
                filter === tab
                  ? "bg-blue-light/10 text-blue-light shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab === "all" ? "All Rides" : tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search driver, route..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 py-2.5 pl-9 pr-4 text-xs font-semibold text-white bg-slate-950/40 border border-white/5 rounded-xl outline-none focus:border-blue-light"
          />
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
        </div>
      </div>

      {/* Rides List */}
      <div className="flex flex-col gap-4">
        {filteredRides.length === 0 ? (
          <div className="text-center py-12 text-slate-500 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-3xl bg-slate-950 border border-white/5 flex items-center justify-center text-xl shadow-inner text-slate-600">
              <i className="fas fa-history"></i>
            </div>
            <strong className="text-sm text-slate-400">No Rides Found</strong>
            <p className="text-xs text-slate-500 leading-normal max-w-[240px]">
              No historical bookings found matching the active filters.
            </p>
          </div>
        ) : (
          filteredRides.map((ride) => {
            const isCompleted = ride.status === "completed";
            const statusClass = isCompleted
              ? "bg-green-light/10 text-green-light"
              : "bg-red-main/10 text-red-light";

            return (
              <div
                key={ride.id}
                className="bg-slate-950/20 border border-white/5 rounded-2xl p-5 hover:bg-slate-900/40 transition-all flex flex-col sm:flex-row justify-between gap-4"
              >
                {/* Left: Driver and Icon */}
                <div className="flex gap-4">
                  <div className={`w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-base ${statusClass}`}>
                    <i className={`fas ${ride.icon}`}></i>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div>
                      <strong className="text-xs text-white font-bold block">
                        To: {ride.to.split(",")[0]}
                      </strong>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-0.5 leading-none">
                        Driver: <strong className="text-slate-200">{ride.driver}</strong> ({ride.car})
                      </span>
                    </div>

                    {/* Route Path */}
                    <div className="flex flex-col gap-1.5 text-[10px] font-semibold text-slate-400 border-l-2 border-slate-800 pl-3 py-1 relative">
                      <div className="absolute left-[-4px] top-1.5 w-1.5 h-1.5 rounded-full bg-blue-light"></div>
                      <div className="absolute left-[-4.5px] bottom-1.5 w-2 h-2 rounded bg-red-light"></div>
                      <div className="truncate max-w-[280px]">Pick: {ride.from}</div>
                      <div className="truncate max-w-[280px]">Dest: {ride.to}</div>
                    </div>
                  </div>
                </div>

                {/* Right: Price, Status, Ratings */}
                <div className="flex sm:flex-col justify-between sm:justify-center items-end sm:text-right shrink-0 gap-2 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                  <div className="flex flex-col sm:items-end">
                    <strong className="text-sm font-black text-white">${ride.amount.toFixed(2)}</strong>
                    <span className="text-[9px] text-slate-500 mt-1 leading-none">
                      {ride.date} &bull; {ride.time}
                    </span>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1.5">
                    <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${statusClass}`}>
                      {ride.status}
                    </span>

                    {/* Star ratings rendering */}
                    {isCompleted && ride.rating && (
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <i
                            key={s}
                            className={`fas fa-star text-[10px] ${
                              s <= ride.rating ? "text-gold-light" : "text-slate-800"
                            }`}
                          ></i>
                        ))}
                      </div>
                    )}

                    {/* Show cancel reason label */}
                    {!isCompleted && ride.cancelReason && (
                      <span className="text-[9px] text-slate-500 italic">
                        Reason: &quot;{ride.cancelReason}&quot;
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
