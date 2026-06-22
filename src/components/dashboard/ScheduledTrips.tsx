"use client";

import React from "react";
import { ScheduledRide } from "@/lib/storage";

interface ScheduledTripsProps {
  scheduledRides: ScheduledRide[];
  onCancelScheduled: (id: string) => void;
  showToast: (msg: string, type: "success" | "error" | "warning" | "info") => void;
}

export default function ScheduledTrips({
  scheduledRides,
  onCancelScheduled,
  showToast,
}: ScheduledTripsProps) {
  const handleCancelClick = (id: string) => {
    if (confirm("Cancel this scheduled trip?")) {
      onCancelScheduled(id);
      showToast("Scheduled trip cancelled successfully", "success");
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl animate-fade-in pb-12">
      <h3 className="text-sm font-extrabold text-white mb-6 tracking-wider uppercase flex items-center gap-2">
        <i className="far fa-calendar-alt text-blue-light"></i> Scheduled Bookings
      </h3>

      <div className="flex flex-col gap-4">
        {scheduledRides.length === 0 ? (
          <div className="text-center py-12 text-slate-500 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-3xl bg-slate-950 border border-white/5 flex items-center justify-center text-xl shadow-inner text-slate-600">
              <i className="fas fa-calendar-times"></i>
            </div>
            <strong className="text-sm text-slate-400">No Scheduled Trips</strong>
            <p className="text-xs text-slate-500 leading-normal max-w-[240px]">
              You have no upcoming scheduled bookings. Plan one in the &quot;Book Ride&quot; panel.
            </p>
          </div>
        ) : (
          scheduledRides.map((ride) => (
            <div
              key={ride.id}
              className="bg-slate-950/20 border border-white/5 rounded-2xl p-5 hover:bg-slate-900/40 transition-all flex flex-col sm:flex-row justify-between gap-4"
            >
              {/* Route */}
              <div className="flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-blue-light/10 text-blue-light shrink-0 flex items-center justify-center text-base">
                  <i className="far fa-calendar-alt"></i>
                </div>
                <div className="flex flex-col gap-2">
                  <div>
                    <strong className="text-xs text-white font-bold block">
                      To: {ride.to.split(",")[0]}
                    </strong>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5 leading-none">
                      Scheduled Date: <strong className="text-slate-200">{ride.date} at {ride.time}</strong> &bull; Vehicle: {ride.vehicle}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 text-[10px] font-semibold text-slate-400 border-l-2 border-slate-800 pl-3 py-1 relative">
                    <div className="absolute left-[-4px] top-1.5 w-1.5 h-1.5 rounded-full bg-blue-light"></div>
                    <div className="absolute left-[-4.5px] bottom-1.5 w-2 h-2 rounded bg-red-light"></div>
                    <div className="truncate max-w-[280px]">Pick: {ride.from}</div>
                    <div className="truncate max-w-[280px]">Dest: {ride.to}</div>
                  </div>
                </div>
              </div>

              {/* Price & Delete */}
              <div className="flex sm:flex-col justify-between sm:justify-center items-end sm:text-right shrink-0 gap-2 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0">
                <div className="flex flex-col sm:items-end">
                  <strong className="text-sm font-black text-white">{ride.price}</strong>
                  <span className="text-[9px] text-slate-500 mt-1 leading-none">
                    Status: <span className="text-blue-light uppercase tracking-wider font-bold">Pending Match</span>
                  </span>
                </div>

                <button
                  onClick={() => handleCancelClick(ride.id)}
                  className="py-1.5 px-3 bg-red-main/10 hover:bg-red-main/20 text-red-light rounded-xl font-bold text-[10px] border border-red-main/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <i className="fas fa-trash-alt text-xs"></i> Cancel Booking
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
