"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";

interface LiveMapProps {
  activeRide: any;
  walletBalance: number;
  onCancelRide: (fee: number, reason: string) => void;
  onRideComplete: (rating: number, review: string) => void;
  setActiveTab: (tab: string) => void;
  showToast: (msg: string, type: "success" | "error" | "warning" | "info") => void;
}

export default function LiveMap({
  activeRide,
  walletBalance,
  onCancelRide,
  onRideComplete,
  setActiveTab,
  showToast,
}: LiveMapProps) {
  // Simulation states: 'idle', 'matching', 'on_way', 'arrived', 'in_progress', 'completed'
  const [status, setStatus] = useState<"idle" | "matching" | "on_way" | "arrived" | "in_progress" | "completed">("idle");
  const [taxiTop, setTaxiTop] = useState("18%");
  const [taxiLeft, setTaxiLeft] = useState("8%");
  const [myLocBottom, setMyLocBottom] = useState("38%");
  const [myLocLeft, setMyLocLeft] = useState("38%");

  // Driver details
  const driverInfo = {
    name: "Mohamed Hassan",
    avatar: "MH",
    car: "Toyota Corolla",
    color: "Silver",
    plate: "ABC-1234",
    rating: "4.9",
  };

  // Modals
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("Changed my plans");
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  const cancelReasons = [
    "Changed my plans",
    "Driver is too far",
    "Wrong pickup location",
    "Found another ride",
    "Emergency came up",
    "Other",
  ];

  // Active ride simulation triggers
  useEffect(() => {
    if (!activeRide) {
      setStatus("idle");
      return;
    }

    // Step 1: Matching
    setStatus("matching");
    showToast("Finding your premium CAB driver...", "info");

    // Timer for Driver Found
    const matchTimer = setTimeout(() => {
      setStatus("on_way");
      showToast("Driver Found! Mohamed Hassan is on his way.", "success");

      // Animate taxi driving towards user
      setTimeout(() => {
        setTaxiTop("60%");
        setTaxiLeft("36%");
      }, 50);

      // Timer for Driver Arrived
      const arriveTimer = setTimeout(() => {
        setStatus("arrived");
        showToast("Driver has arrived! Waiting at pickup location.", "warning");

        // Timer for Trip Start and Progress
        const startTripTimer = setTimeout(() => {
          setStatus("in_progress");
          showToast("Ride started! Heading to your destination.", "info");

          // Move both taxi and user towards destination
          setTimeout(() => {
            setTaxiTop("35%");
            setTaxiLeft("75%");
            setMyLocBottom("63%");
            setMyLocLeft("75%");
          }, 50);

          // Timer for Trip Complete
          const completeTimer = setTimeout(() => {
            setStatus("completed");
            showToast("You have arrived at your destination!", "success");
            setRateModalOpen(true);
          }, 6000); // 6s duration for ride in progress

          return () => clearTimeout(completeTimer);
        }, 5000); // 5s wait at pickup before start

        return () => clearTimeout(startTripTimer);
      }, 8000); // 8s drive to user

      return () => clearTimeout(arriveTimer);
    }, 3000); // 3s matching delay

    return () => {
      clearTimeout(matchTimer);
    };
  }, [activeRide]);

  // Cancel ride action handler
  const handleCancelClick = () => {
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    setCancelModalOpen(false);
    onCancelRide(2.0, selectedReason); // $2 fee
    setStatus("idle");
    showToast("Ride cancelled. $2.00 cancellation fee applied.", "warning");

    // Reset coordinates
    setTaxiTop("18%");
    setTaxiLeft("8%");
    setMyLocBottom("38%");
    setMyLocLeft("38%");

    setTimeout(() => {
      setActiveTab("dashboard");
    }, 500);
  };

  // Rating submit handler
  const handleRatingSubmit = () => {
    setRateModalOpen(false);
    onRideComplete(rating, reviewText);
    setStatus("idle");
    showToast("Thank you for rating your driver!", "success");

    // Reset coordinates
    setTaxiTop("18%");
    setTaxiLeft("8%");
    setMyLocBottom("38%");
    setMyLocLeft("38%");

    setActiveTab("dashboard");
  };

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[500px] border border-white/5 rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
      {/* Map Grid Background */}
      <div className="absolute inset-0 bg-[#0b0f19] sim-map-grid opacity-60 z-0"></div>

      {/* Pulsing My Location Indicator */}
      <div
        className="absolute w-6 h-6 z-10 transition-all duration-[6000ms] cubic-bezier(0.16, 1, 0.3, 1)"
        style={{ bottom: myLocBottom, left: myLocLeft }}
      >
        <span className="absolute inline-flex h-full w-full rounded-full bg-blue-light/30 animate-ping"></span>
        <span className="relative flex rounded-full h-6 w-6 bg-blue-main border-2 border-white items-center justify-center text-[10px] text-white font-bold shadow-lg">
          Me
        </span>
      </div>

      {/* Moving Taxi Node */}
      {status !== "idle" && (
        <div
          className="absolute w-7 h-7 text-gold-light z-20 transition-all duration-[8000ms] ease-in-out text-lg"
          style={{ top: taxiTop, left: taxiLeft }}
        >
          <div className="relative flex items-center justify-center">
            <span className="absolute inline-flex h-full w-full rounded-full bg-gold-light/20 animate-ping"></span>
            <i className="fas fa-taxi drop-shadow-[0_2px_8px_rgba(245,158,11,0.5)]"></i>
          </div>
        </div>
      )}

      {/* Simulated Map Markers */}
      <div className="absolute top-[20%] left-[45%] text-[10px] text-slate-500 font-bold opacity-40 select-none">
        <i className="fas fa-circle text-[6px] mr-1.5"></i> KM4 Junction
      </div>
      <div className="absolute top-[55%] left-[20%] text-[10px] text-slate-500 font-bold opacity-40 select-none">
        <i className="fas fa-circle text-[6px] mr-1.5"></i> Hodan District
      </div>
      <div className="absolute top-[35%] left-[70%] text-[10px] text-slate-500 font-bold opacity-40 select-none">
        <i className="fas fa-circle text-[6px] mr-1.5"></i> Hamar-Weyne
      </div>
      <div className="absolute bottom-[20%] left-[80%] text-[10px] text-slate-500 font-bold opacity-40 select-none">
        <i className="fas fa-circle text-[6px] mr-1.5"></i> Lido Beach
      </div>

      {/* Overlay controls */}
      <div className="absolute top-5 left-5 flex flex-col gap-2 z-30">
        <button
          onClick={() => showToast("Map zoom-in simulation", "info")}
          className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-slate-100 flex items-center justify-center border border-white/5 text-sm cursor-pointer shadow-md"
        >
          <i className="fas fa-plus"></i>
        </button>
        <button
          onClick={() => showToast("Map zoom-out simulation", "info")}
          className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-slate-100 flex items-center justify-center border border-white/5 text-sm cursor-pointer shadow-md"
        >
          <i className="fas fa-minus"></i>
        </button>
      </div>

      {/* Active Assignment UI Card */}
      {status !== "idle" && (
        <div className="absolute bottom-5 right-5 left-5 sm:left-auto w-auto sm:w-[360px] bg-slate-900/95 backdrop-blur-md border border-white/5 rounded-3xl p-5 shadow-2xl z-30 animate-fade-in">
          {status === "matching" ? (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <i className="fas fa-spinner animate-spin text-3xl text-blue-light mb-4"></i>
              <strong className="text-sm text-white">Assigning Premium Driver...</strong>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                Finding the closest vehicle matching your criteria.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Status Header */}
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                  Ride Progress
                </span>
                <span className="text-[10px] bg-blue-light/10 text-blue-light font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  {status === "on_way" && "Driver En Route"}
                  {status === "arrived" && "Driver Arrived"}
                  {status === "in_progress" && "Trip In Progress"}
                  {status === "completed" && "Trip Finished"}
                </span>
              </div>

              {/* Driver Details */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 text-xs font-black text-slate-200 flex items-center justify-center shadow-inner">
                  {driverInfo.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{driverInfo.name}</h4>
                  <p className="text-[9px] text-slate-500 mt-0.5 truncate">
                    {driverInfo.car} ({driverInfo.color}) &bull; {driverInfo.plate}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1.5 justify-end">
                    <i className="fas fa-star text-[10px] text-gold-light"></i>
                    <span className="text-[10px] text-slate-200 font-bold">{driverInfo.rating}</span>
                  </div>
                  <span className="text-[9px] text-slate-500 mt-0.5 block">Estimated ETA: {activeRide.eta}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("messages")}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-white/5"
                >
                  <i className="fas fa-comments text-xs"></i> Contact
                </button>
                {(status === "on_way" || status === "arrived") && (
                  <button
                    onClick={handleCancelClick}
                    className="flex-1 py-2.5 bg-red-main/10 hover:bg-red-main/20 text-red-light rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-red-main/15"
                  >
                    <i className="fas fa-times text-xs"></i> Cancel Ride
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fallback Idle Alert */}
      {status === "idle" && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/45 p-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-white/5 text-slate-500 flex items-center justify-center text-2xl shadow-lg mb-4">
            <i className="fas fa-map-marked-alt"></i>
          </div>
          <strong className="text-sm text-slate-300">No Active Bookings found</strong>
          <p className="text-[11px] text-slate-500 mt-1 max-w-[280px] leading-relaxed">
            Please book a new taxi ride under the &quot;Book Ride&quot; panel to start live tracking.
          </p>
          <button
            onClick={() => setActiveTab("book-ride")}
            className="mt-5 py-2.5 px-6 rounded-xl font-bold text-white gradient-btn text-xs uppercase tracking-wider cursor-pointer"
          >
            Go Book Ride
          </button>
        </div>
      )}

      {/* 1. Cancel Ride Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Your Ride?"
        icon="fas fa-times-circle"
        className="max-w-[500px]"
        footer={
          <>
            <button
              onClick={() => setCancelModalOpen(false)}
              className="px-5 py-2.5 rounded-full border border-white/5 hover:bg-slate-800 text-xs font-bold text-slate-300 cursor-pointer"
            >
              <i className="fas fa-arrow-left mr-1"></i> Keep Ride
            </button>
            <button
              onClick={handleConfirmCancel}
              className="px-5 py-2.5 rounded-full text-white bg-red-main hover:bg-red-dark text-xs font-bold transition-all shadow-md shadow-red-main/10 flex items-center gap-1.5 cursor-pointer"
            >
              <i className="fas fa-times"></i> Yes, Cancel Ride
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4 bg-red-main/5 border border-red-main/15 p-4 rounded-2xl">
            <div className="w-11 h-11 rounded-full bg-red-main/10 text-red-light flex items-center justify-center shrink-0 text-lg">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div>
              <strong className="text-xs font-extrabold text-white block">Are you sure you want to cancel?</strong>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                A <span className="text-red-light font-bold">$2.00 cancellation fee</span> will be charged since your driver is already on the way.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              Reason for cancellation (optional)
            </label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {cancelReasons.map((reason, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedReason(reason)}
                  className={`py-2.5 px-3 rounded-xl border text-[10px] font-bold text-left transition-all cursor-pointer ${
                    selectedReason === reason
                      ? "bg-red-main/10 border-red-main text-red-light"
                      : "bg-slate-950/20 border-white/5 text-slate-400 hover:bg-slate-900"
                  }`}
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* 2. Rate Ride Modal */}
      <Modal
        isOpen={rateModalOpen}
        onClose={() => setRateModalOpen(false)}
        title="Rate Your Ride"
        icon="fas fa-star"
        footer={
          <button
            onClick={handleRatingSubmit}
            className="px-6 py-2.5 rounded-xl font-bold text-white gradient-btn text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <i className="fas fa-paper-plane"></i> Submit Rating
          </button>
        }
      >
        <div className="flex flex-col items-center text-center gap-4">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-main to-red-main text-white text-base font-black flex items-center justify-center shadow-lg mb-3">
              {driverInfo.avatar}
            </div>
            <strong className="text-sm font-extrabold text-white">{driverInfo.name}</strong>
            <span className="text-[10px] text-slate-500 mt-0.5">
              {driverInfo.car} ({driverInfo.color})
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-normal max-w-[280px]">
            How was your trip from <strong className="text-white">{activeRide?.pickup}</strong> to <strong className="text-white">{activeRide?.destination}</strong>?
          </p>

          {/* Star selector */}
          <div className="flex gap-2 text-2xl my-2 cursor-pointer">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="text-gold-light"
              >
                <i className={star <= rating ? "fas fa-star" : "far fa-star"}></i>
              </button>
            ))}
          </div>

          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write a comment... (optional)"
            rows={2}
            className="w-full p-3.5 text-xs font-semibold text-white bg-slate-950/40 border border-white/5 rounded-xl outline-none focus:border-blue-light resize-none mt-1"
          />
        </div>
      </Modal>
    </div>
  );
}
