"use client";

import React, { useState, useEffect } from "react";
import { UserProfile, SavedPlace } from "@/lib/storage";

interface BookRideProps {
  user: UserProfile | null;
  savedPlaces: SavedPlace[];
  walletBalance: number;
  onBookSuccess: (bookingDetails: any) => void;
  showToast: (msg: string, type: "success" | "error" | "warning" | "info") => void;
}

interface VehicleOption {
  id: string;
  name: string;
  desc: string;
  baseRate: number;
  eta: string;
  icon: string;
}

export default function BookRide({
  user,
  savedPlaces,
  walletBalance,
  onBookSuccess,
  showToast,
}: BookRideProps) {
  const [pickup, setPickup] = useState("Current Location");
  const [destination, setDestination] = useState("");
  
  // Options states
  const [addStop, setAddStop] = useState(false);
  const [roundTrip, setRoundTrip] = useState(false);
  const [scheduleTrip, setScheduleTrip] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [notes, setNotes] = useState("");

  // Promo code states
  const [promoCode, setPromoCode] = useState("");
  const [activePromo, setActivePromo] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  // Selected vehicle state
  const [selectedVehicle, setSelectedVehicle] = useState("eco");

  const vehicleOptions: VehicleOption[] = [
    { id: "eco", name: "Economy", desc: "Corolla or similar", baseRate: 0.8, eta: "2 mins", icon: "fa-car" },
    { id: "std", name: "Standard", desc: "Elantra comfort", baseRate: 1.0, eta: "3 mins", icon: "fa-taxi" },
    { id: "pre", name: "Premium", desc: "Camry or Accord", baseRate: 1.3, eta: "4 mins", icon: "fa-car-side" },
    { id: "lux", name: "Luxury", desc: "Lexus or Mercedes", baseRate: 2.2, eta: "6 mins", icon: "fa-gem" },
    { id: "suv", name: "SUV", desc: "Land Cruiser 4x4", baseRate: 1.8, eta: "5 mins", icon: "fa-truck-monster" },
    { id: "elec", name: "Electric", desc: "Tesla Model Y", baseRate: 1.1, eta: "4 mins", icon: "fa-leaf" },
    { id: "moto", name: "Motorbike", desc: "Fast city courier", baseRate: 0.4, eta: "1 min", icon: "fa-motorcycle" },
    { id: "van", name: "Family Van", desc: "8-Seater Toyota", baseRate: 1.6, eta: "5 mins", icon: "fa-shuttle-van" },
  ];

  // Calculate fare estimates
  const getFareEstimate = (baseRate: number) => {
    if (!destination) return 0.0;
    
    // Simulate raw distance based on address length
    const mockDistance = Math.max(3, (destination.length % 15) + 3.4);
    let total = mockDistance * baseRate;

    if (addStop) total += 1.50; // extra charge for stop
    if (roundTrip) total *= 1.5; // multiplier for round trip
    if (discountPercent > 0) total *= (1 - discountPercent / 100);

    return parseFloat(total.toFixed(2));
  };

  const handleApplyPromo = () => {
    const trimmed = promoCode.trim().toUpperCase();
    if (trimmed === "SAVE30") {
      setDiscountPercent(30);
      setActivePromo("SAVE30");
      showToast("Voucher applied! You get 30% off your ride.", "success");
    } else if (trimmed) {
      showToast("Voucher code invalid or expired!", "error");
    }
  };

  const handleSavedPlaceSelect = (addr: string) => {
    setDestination(addr);
    showToast(`Destination set to: ${addr}`, "info");
  };

  const handleSwapAddresses = () => {
    const temp = pickup;
    setPickup(destination);
    setDestination(temp);
  };

  const handleBook = () => {
    if (!destination) {
      showToast("Fadlan geli halka aad u socoto (Destination)!", "warning");
      return;
    }

    const selectedOpt = vehicleOptions.find((v) => v.id === selectedVehicle) || vehicleOptions[0];
    const finalFare = getFareEstimate(selectedOpt.baseRate);

    if (finalFare > walletBalance) {
      showToast("Wallet balance insufficient! Add money to book.", "error");
      return;
    }

    // Pass structured details to parent to launch assignment simulation
    onBookSuccess({
      pickup,
      destination,
      vehicle: selectedOpt.name,
      amount: finalFare,
      eta: selectedOpt.eta,
      addStop,
      roundTrip,
      scheduleTrip,
      scheduleDate,
      scheduleTime,
      notes,
      activePromo,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in pb-12">
      {/* Left Columns: Form Inputs & Vehicles list */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="glass-panel p-6 rounded-3xl">
          <h3 className="text-sm font-extrabold text-white mb-4 tracking-wider uppercase flex items-center gap-2">
            <i className="fas fa-route text-blue-light"></i> Trip Details
          </h3>

          {/* Form */}
          <div className="flex flex-col gap-4">
            {/* Pickup */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400">Halka Laga Qaadayo (Pickup)</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full py-3.5 pl-11 pr-12 text-sm font-medium text-white rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-light focus:outline-none"
                  placeholder="Geli halka lagaa qaadayo"
                />
                <i className="fas fa-circle absolute left-4 text-blue-light text-[8px]"></i>
                <button
                  onClick={() => {
                    setPickup("Current Location");
                    showToast("GPS location synchronized", "success");
                  }}
                  className="absolute right-4 text-slate-500 hover:text-slate-300 text-sm"
                  title="Use current location"
                >
                  <i className="fas fa-crosshairs"></i>
                </button>
              </div>
            </div>

            {/* Address Swap Divider */}
            <div className="flex justify-center -my-2.5 relative z-10">
              <button
                onClick={handleSwapAddresses}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-white/10 flex items-center justify-center text-xs transition-colors cursor-pointer"
                title="Swap addresses"
              >
                <i className="fas fa-exchange-alt rotate-90"></i>
              </button>
            </div>

            {/* Destination */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400">Halka Aad U Socoto (Destination)</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full py-3.5 pl-11 pr-4 text-sm font-medium text-white rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-light focus:outline-none"
                  placeholder="Halkaad u socotaa?"
                />
                <i className="fas fa-map-marker-alt absolute left-4 text-red-light text-sm"></i>
              </div>
            </div>

            {/* Trip multipliers toggle options */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              <button
                onClick={() => setAddStop(!addStop)}
                className={`py-2 px-3 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                  addStop
                    ? "bg-blue-light/10 border-blue-light text-blue-light"
                    : "bg-slate-950/20 border-white/5 text-slate-400 hover:bg-slate-900"
                }`}
              >
                <i className="fas fa-plus mr-1"></i> Add Stop (+$1.50)
              </button>
              <button
                onClick={() => setRoundTrip(!roundTrip)}
                className={`py-2 px-3 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                  roundTrip
                    ? "bg-blue-light/10 border-blue-light text-blue-light"
                    : "bg-slate-950/20 border-white/5 text-slate-400 hover:bg-slate-900"
                }`}
              >
                <i className="fas fa-redo mr-1"></i> Round Trip (1.5x)
              </button>
              <button
                onClick={() => setScheduleTrip(!scheduleTrip)}
                className={`py-2 px-3 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                  scheduleTrip
                    ? "bg-blue-light/10 border-blue-light text-blue-light"
                    : "bg-slate-950/20 border-white/5 text-slate-400 hover:bg-slate-900"
                }`}
              >
                <i className="far fa-calendar mr-1"></i> Schedule
              </button>
            </div>

            {/* Schedule Fields */}
            {scheduleTrip && (
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-950/20 rounded-2xl border border-white/5 animate-fade-in mt-1">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Date</label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="py-2.5 px-3 bg-slate-950/50 text-xs border border-white/5 rounded-xl text-white outline-none focus:border-blue-light"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Time</label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="py-2.5 px-3 bg-slate-950/50 text-xs border border-white/5 rounded-xl text-white outline-none focus:border-blue-light"
                  />
                </div>
              </div>
            )}

            {/* Optional Notes */}
            <div className="flex flex-col gap-1.5 mt-1">
              <label className="text-xs font-bold text-slate-400">Driver Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g., I'm holding a red shopping bag..."
                rows={2}
                className="w-full p-3.5 text-sm font-medium text-white rounded-xl bg-slate-950/40 border border-white/5 focus:border-blue-light focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Vehicle Selection Grid */}
        <div className="glass-panel p-6 rounded-3xl">
          <h3 className="text-sm font-extrabold text-white mb-4 tracking-wider uppercase">
            Select Ride Type
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {vehicleOptions.map((opt) => {
              const isSel = selectedVehicle === opt.id;
              const fare = getFareEstimate(opt.baseRate);
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedVehicle(opt.id)}
                  className={`border rounded-2xl p-4 text-left cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between min-h-[120px] ${
                    isSel
                      ? "bg-blue-light/10 border-blue-light shadow-sm"
                      : "bg-slate-950/20 border-white/5 hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <i className={`fas ${opt.icon} text-xl ${isSel ? "text-blue-light" : "text-slate-500"}`}></i>
                    <span className="text-[9px] bg-slate-800 text-slate-400 font-bold px-1.5 py-0.5 rounded">
                      {opt.eta}
                    </span>
                  </div>
                  <div className="mt-3">
                    <strong className="text-xs font-bold text-white block leading-tight">{opt.name}</strong>
                    <span className="text-[8px] text-slate-500 block leading-normal mt-0.5">{opt.desc}</span>
                    <strong className="text-xs font-black text-white block mt-1.5">
                      {destination ? `$${fare.toFixed(2)}` : `$${opt.baseRate.toFixed(2)}/km`}
                    </strong>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: Fare summary, Promos, and Book CTAs */}
      <div className="flex flex-col gap-6">
        {/* Saved Places select */}
        <div className="glass-panel p-6 rounded-3xl">
          <h3 className="text-sm font-extrabold text-white mb-4 tracking-wider uppercase">
            Quick Book Destinations
          </h3>
          <div className="flex flex-col gap-2.5">
            {savedPlaces.slice(0, 4).map((place) => (
              <button
                key={place.id}
                onClick={() => handleSavedPlaceSelect(place.address)}
                className="w-full bg-slate-950/20 hover:bg-slate-900 border border-white/5 rounded-2xl p-3.5 text-left transition-all hover:scale-[1.01] flex items-center gap-3.5 cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-xs text-blue-light shrink-0">
                  <i className={`fas ${place.icon}`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <strong className="text-xs font-bold text-white block leading-tight">{place.name}</strong>
                  <span className="text-[9px] text-slate-500 block truncate mt-0.5">{place.address}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Promo code card */}
        <div className="glass-panel p-6 rounded-3xl">
          <h3 className="text-sm font-extrabold text-white mb-3 tracking-wider uppercase">
            Apply Coupon Voucher
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter code (e.g. SAVE30)"
              className="flex-1 px-3.5 py-2.5 text-xs font-semibold text-white bg-slate-950/40 border border-white/5 rounded-xl outline-none focus:border-blue-light uppercase"
            />
            <button
              onClick={handleApplyPromo}
              className="py-2.5 px-4 bg-slate-850 hover:bg-slate-800 border border-white/10 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Apply
            </button>
          </div>
          {activePromo && (
            <div className="mt-3.5 bg-green-main/10 border border-green-main/20 text-green-light px-3.5 py-2.5 rounded-xl text-[10px] font-bold flex items-center justify-between">
              <span>Code Applied: {activePromo}</span>
              <span>-30% OFF</span>
            </div>
          )}
        </div>

        {/* Fare Summary checkout card */}
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between flex-1 min-h-[220px]">
          <div>
            <h3 className="text-sm font-extrabold text-white mb-4 tracking-wider uppercase">
              Fare Summary
            </h3>
            {destination ? (
              <div className="flex flex-col gap-3 text-xs font-semibold text-slate-400">
                <div className="flex justify-between">
                  <span>Pickup:</span>
                  <span className="text-white font-bold max-w-[150px] truncate">{pickup}</span>
                </div>
                <div className="flex justify-between">
                  <span>Destination:</span>
                  <span className="text-white font-bold max-w-[150px] truncate">{destination}</span>
                </div>
                <div className="flex justify-between">
                  <span>Vehicle Category:</span>
                  <span className="text-white font-bold">
                    {vehicleOptions.find((v) => v.id === selectedVehicle)?.name}
                  </span>
                </div>
                {addStop && (
                  <div className="flex justify-between text-blue-light text-[10px]">
                    <span>Stop multiplier:</span>
                    <span>+$1.50</span>
                  </div>
                )}
                {roundTrip && (
                  <div className="flex justify-between text-blue-light text-[10px]">
                    <span>Round Trip:</span>
                    <span>1.5x Factor</span>
                  </div>
                )}
                {discountPercent > 0 && (
                  <div className="flex justify-between text-green-light text-[10px]">
                    <span>Coupon Promo Discount:</span>
                    <span>-30%</span>
                  </div>
                )}
                <div className="h-[1px] bg-white/5 my-1" />
                <div className="flex justify-between text-sm">
                  <span className="font-extrabold text-white">Total Estimate:</span>
                  <strong className="text-base font-black text-white">
                    ${getFareEstimate(vehicleOptions.find((v) => v.id === selectedVehicle)?.baseRate || 1).toFixed(2)}
                  </strong>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 font-semibold text-xs flex flex-col items-center gap-3">
                <i className="fas fa-route text-2xl"></i>
                <p>Please enter your destination to view fare checkout estimates.</p>
              </div>
            )}
          </div>

          <button
            onClick={handleBook}
            className="w-full mt-6 py-4 rounded-xl font-bold text-white gradient-btn text-xs uppercase tracking-wider text-center"
          >
            {scheduleTrip ? (
              <>
                <i className="far fa-calendar-check mr-1 text-sm"></i> Confirm Scheduled Book
              </>
            ) : (
              <>
                <i className="fas fa-taxi mr-1 text-xs"></i> Book CAB Ride Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
