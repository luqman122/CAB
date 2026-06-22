"use client";

import React from "react";

export default function Rewards() {
  const points = 720;
  const targetPoints = 1000;
  const progressPercent = Math.min(100, Math.round((points / targetPoints) * 100));

  const badges = [
    { name: "5-Star Rider", desc: "Keep 4.9+ score rating", icon: "fa-star text-gold-light bg-gold-light/10" },
    { name: "Eco Warrior", desc: "Take 5+ Electric CAB rides", icon: "fa-leaf text-green-light bg-green-light/10" },
    { name: "Night Owl", desc: "Book 10+ rides after 10 PM", icon: "fa-moon text-purple-400 bg-purple-400/10" },
    { name: "High Flyer", desc: "Take 3+ Airport rides", icon: "fa-plane text-blue-light bg-blue-light/10" },
    { name: "Mogadishu Pioneer", desc: "Join CAB since year launch", icon: "fa-flag text-red-light bg-red-main/10" },
    { name: "Thrifty Saver", desc: "Use 5+ promo vouchers", icon: "fa-tag text-pink-400 bg-pink-400/10" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      {/* Level Hero Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex-1 flex flex-col">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">
            Current Tier status
          </span>
          <h2 className="text-xl md:text-2xl font-black text-white mt-3 leading-tight">
            Gold Level Member <span className="text-gold-light">🌟</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-[400px]">
            You earn 1.5x points multipliers on all completed trips. Earn 280 more points to reach Platinum!
          </p>

          {/* Progress Bar */}
          <div className="w-full mt-6">
            <div className="flex justify-between items-center text-xs font-bold mb-2">
              <span className="text-slate-400">{points} Points</span>
              <span className="text-slate-400">{targetPoints} Points</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-main via-gold-main to-red-main rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center shrink-0 w-24 h-24 rounded-2xl bg-gold-light/10 border border-gold-light/25 shadow-lg shadow-gold-light/5 text-center">
          <span className="text-2xl font-black text-gold-light">{points}</span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">
            Total Points
          </span>
        </div>
      </div>

      {/* Badges and milestones */}
      <div className="glass-panel p-6 rounded-3xl">
        <h3 className="text-sm font-extrabold text-white mb-6 tracking-wider uppercase">
          Your Achievements & Badges
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {badges.map((badge, idx) => (
            <div
              key={idx}
              className="bg-slate-950/20 border border-white/5 rounded-2xl p-5 hover:bg-slate-900/40 transition-all flex flex-col items-center text-center gap-4 group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${badge.icon} group-hover:scale-110 transition-transform`}>
                <i className={`fas ${badge.icon.split(" ")[0]}`}></i>
              </div>
              <div>
                <strong className="text-xs font-bold text-white block leading-tight">
                  {badge.name}
                </strong>
                <span className="text-[9px] text-slate-500 block leading-normal mt-1 max-w-[150px]">
                  {badge.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
