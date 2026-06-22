"use client";

import React, { useEffect, useRef, useState } from "react";
import { UserProfile, RideRecord } from "@/lib/storage";

interface DashboardHomeProps {
  user: UserProfile | null;
  rides: RideRecord[];
  walletBalance: number;
  setActiveTab: (tab: string) => void;
  showToast: (msg: string, type: "success" | "error" | "warning" | "info") => void;
}

export default function DashboardHome({
  user,
  rides,
  walletBalance,
  setActiveTab,
  showToast,
}: DashboardHomeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [greeting, setGreeting] = useState("Ku soo dhawaada");
  const [clock, setClock] = useState("");

  // Greetings and Time Clock updates
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = now.getHours();

      if (hrs < 12) setGreeting("Subax wanaagsan");
      else if (hrs < 18) setGreeting("Galab wanaagsan");
      else setGreeting("Habeen wanaagsan");

      setClock(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  // Draw Canvas Weekly rides chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear and redraw based on dimensions
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Chart parameters
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const values = [5, 8, 12, 6, 9, 14, 11]; // Mock rides per day
    const maxVal = 16;

    ctx.clearRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = 30 + (i * (height - 60)) / 4;
      ctx.beginPath();
      ctx.moveTo(35, y);
      ctx.lineTo(width - 20, y);
      ctx.stroke();

      // Axis labels (y)
      ctx.fillStyle = "#64748b";
      ctx.font = "bold 9px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(Math.round(maxVal - (i * maxVal) / 4).toString(), 25, y + 3);
    }

    // Draw Bars
    const barWidth = 24;
    const spacing = (width - 65) / days.length;

    values.forEach((val, idx) => {
      const x = 45 + idx * spacing;
      const barHeight = ((height - 60) * val) / maxVal;
      const y = height - 30 - barHeight;

      // Rounded bar background/glow
      const grad = ctx.createLinearGradient(x, y, x, height - 30);
      grad.addColorStop(0, "#3b82f6"); // blue
      grad.addColorStop(0.5, "#b45309"); // gold
      grad.addColorStop(1, "#dc2626"); // red

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x - barWidth / 2, y, barWidth, barHeight, 6);
      ctx.fill();

      // Text values top of bars
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 9px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(val.toString(), x, y - 6);

      // Axis labels (x)
      ctx.fillStyle = "#94a3b8";
      ctx.font = "semibold 10px sans-serif";
      ctx.fillText(days[idx], x, height - 12);
    });
  }, [rides]);

  const recentRides = rides.slice(0, 3);

  const stats = [
    { label: "Guud ahaan Safarada", value: "47", desc: "Rides completed", icon: "fa-taxi", color: "text-blue-light bg-blue-light/10" },
    { label: "Fogaanta (Distance)", value: "342 km", desc: "Travel distance", icon: "fa-road", color: "text-gold-light bg-gold-light/10" },
    { label: "Qiimeyntaada (Rating)", value: "4.9 ★", desc: "Rider score", icon: "fa-star", color: "text-green-light bg-green-light/10" },
    { label: "Lacagta kuu Baaqatay", value: "$12.50", desc: "Discounts saved", icon: "fa-percentage", color: "text-red-light bg-red-light/10" },
  ];

  const quickActions = [
    { label: "Book CAB", desc: "Request immediate driver", icon: "fa-taxi text-blue-light", target: "book-ride" },
    { label: "Live Map", desc: "View online taxis map", icon: "fa-map-marked-alt text-green-light", target: "map" },
    { label: "Fund Wallet", desc: "Deposit money preset", icon: "fa-wallet text-gold-light", target: "wallet" },
    { label: "Promo Code", desc: "Apply active voucher", icon: "fa-percentage text-red-light", target: "promotions" },
    { label: "Help Center", desc: "24/7 SOS & faq options", icon: "fa-question-circle text-purple-400", target: "help" },
    { label: "Saved Places", desc: "Quick navigate book", icon: "fa-bookmark text-pink-400", target: "saved-places" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      {/* Welcome Banner */}
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">
            Welcome Back
          </span>
          <h1 className="text-xl md:text-2xl font-black text-white mt-2 leading-tight">
            {greeting}, {user ? user.name : "Ahmed"}! <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Mogadishu is running smoothly. Ready to plan your next trip?
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 bg-slate-800/40 border border-white/5 px-4 py-2.5 rounded-2xl">
          <i className="far fa-calendar-alt text-blue-light text-base"></i>
          <span className="text-xs font-bold text-slate-300">{clock}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-2xl flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-lg ${stat.color}`}>
              <i className={`fas ${stat.icon}`}></i>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-slate-500 uppercase block tracking-wider leading-none">
                {stat.label}
              </span>
              <strong className="text-base md:text-lg font-black text-white block mt-1.5 leading-none">
                {stat.value}
              </strong>
              <span className="text-[9px] text-slate-400 block mt-1 font-semibold">{stat.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Body: Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quick actions & Weekly chart */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Quick Actions Grid */}
          <div className="glass-panel p-6 rounded-3xl">
            <h3 className="text-sm font-extrabold text-white mb-4 tracking-wider uppercase">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveTab(action.target);
                    showToast(`Navigating to: ${action.label}`, "info");
                  }}
                  className="bg-slate-950/40 hover:bg-slate-900 border border-white/5 rounded-2xl p-4 text-left hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col gap-3 group cursor-pointer"
                >
                  <i className={`fas ${action.icon} text-lg group-hover:scale-110 transition-transform`}></i>
                  <div>
                    <strong className="text-xs font-bold text-white block leading-tight">
                      {action.label}
                    </strong>
                    <span className="text-[9px] text-slate-400 block mt-1 leading-normal">
                      {action.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Weekly chart */}
          <div className="glass-panel p-6 rounded-3xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-extrabold text-white tracking-wider uppercase">
                Safarada Todobaadkan (Weekly Rides)
              </h3>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded-full uppercase">
                Last 7 Days
              </span>
            </div>
            <div className="w-full h-48">
              <canvas ref={canvasRef} className="w-full h-full" />
            </div>
          </div>
        </div>

        {/* Right Column: Wallet Card & Recent Activity */}
        <div className="flex flex-col gap-6">
          {/* Wallet Summary Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-main via-blue-dark to-slate-950 border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col justify-between h-44">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-blue-light uppercase tracking-wider block">
                  Wallet Balance
                </span>
                <strong className="text-2xl font-black text-white mt-1.5 block">
                  ${walletBalance.toFixed(2)}
                </strong>
              </div>
              <i className="fas fa-wallet text-blue-light/50 text-3xl"></i>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("wallet")}
                className="flex-1 py-2.5 rounded-xl bg-white text-[#0f172a] font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer text-center"
              >
                Fund Wallet
              </button>
              <button
                onClick={() => setActiveTab("payments")}
                className="flex-1 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-white/5 text-white font-bold text-xs transition-colors cursor-pointer text-center"
              >
                Cards
              </button>
            </div>
          </div>

          {/* Recent Activity List */}
          <div className="glass-panel p-6 rounded-3xl flex-1 flex flex-col justify-between min-h-[280px]">
            <div>
              <h3 className="text-sm font-extrabold text-white mb-4 tracking-wider uppercase">
                Safaradii U Dambeeyay (Recent Rides)
              </h3>
              <div className="flex flex-col gap-3">
                {recentRides.map((ride, idx) => {
                  const isCompleted = ride.status === "completed";
                  const statusClass = isCompleted ? "text-green-light bg-green-light/10" : "text-red-light bg-red-light/10";
                  const statusText = ride.status === "completed" ? "Completed" : "Cancelled";
                  
                  return (
                    <div
                      key={idx}
                      onClick={() => setActiveTab("history")}
                      className="bg-slate-950/20 border border-white/5 rounded-2xl p-3.5 flex items-center gap-3.5 hover:bg-slate-900 transition-colors cursor-pointer"
                    >
                      <div className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-sm ${statusClass}`}>
                        <i className={`fas ${isCompleted ? "fa-taxi" : "fa-times-circle"}`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <strong className="text-xs font-bold text-white block truncate leading-tight">
                          To: {ride.to.split(",")[0]}
                        </strong>
                        <span className="text-[9px] text-slate-400 block mt-1 leading-none">
                          {ride.date} &bull; {ride.time}
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <strong className="text-xs font-black text-white block">
                          ${ride.amount.toFixed(2)}
                        </strong>
                        <span className={`text-[8px] font-bold uppercase block mt-1 ${isCompleted ? "text-green-light" : "text-red-light"}`}>
                          {statusText}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setActiveTab("history")}
              className="w-full mt-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-bold text-xs text-center transition-all cursor-pointer"
            >
              View Full History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
