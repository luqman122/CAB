"use client";

import React, { useState } from "react";
import Toast from "@/components/ui/Toast";

interface Promo {
  id: string;
  code: string;
  title: string;
  desc: string;
  discount: string;
  expiry: string;
  type: "percentage" | "flat" | "free";
  color: string;
  icon: string;
  used: boolean;
  applicable: string;
}

const defaultPromos: Promo[] = [
  {
    id: "P1",
    code: "SAVE30",
    title: "30% Off Your Next Ride",
    desc: "Get 30% discount on your next 3 rides. Valid for Economy and Comfort vehicles.",
    discount: "30%",
    expiry: "June 30, 2026",
    type: "percentage",
    color: "from-blue-main to-blue-light",
    icon: "fa-percentage",
    used: false,
    applicable: "Economy, Comfort",
  },
  {
    id: "P2",
    code: "NEWUSER50",
    title: "Welcome Bonus - $5 Off",
    desc: "New user exclusive. Get $5 off on your first completed ride.",
    discount: "$5",
    expiry: "July 15, 2026",
    type: "flat",
    color: "from-gold-main to-gold-light",
    icon: "fa-gift",
    used: false,
    applicable: "All ride types",
  },
  {
    id: "P3",
    code: "ECOFREE",
    title: "Free Electric Ride",
    desc: "Enjoy one completely free Electric CAB ride. Help the environment!",
    discount: "FREE",
    expiry: "July 1, 2026",
    type: "free",
    color: "from-emerald-700 to-emerald-500",
    icon: "fa-leaf",
    used: true,
    applicable: "Electric only",
  },
  {
    id: "P4",
    code: "WEEKEND20",
    title: "Weekend Special 20% Off",
    desc: "Every weekend, enjoy 20% off all Premium and Luxury rides.",
    discount: "20%",
    expiry: "Aug 31, 2026",
    type: "percentage",
    color: "from-purple-700 to-purple-500",
    icon: "fa-umbrella-beach",
    used: false,
    applicable: "Premium, Luxury",
  },
  {
    id: "P5",
    code: "REFER10",
    title: "Referral Reward - $10",
    desc: "Referred a friend? Claim $10 wallet credit when your friend completes their first ride.",
    discount: "$10",
    expiry: "Dec 31, 2026",
    type: "flat",
    color: "from-red-main to-red-light",
    icon: "fa-users",
    used: false,
    applicable: "All ride types",
  },
  {
    id: "P6",
    code: "AIRPORT15",
    title: "Airport Transfer Deal",
    desc: "Book any ride to/from Aden Abdulle Airport and save 15% on your fare.",
    discount: "15%",
    expiry: "Sept 15, 2026",
    type: "percentage",
    color: "from-sky-700 to-sky-500",
    icon: "fa-plane",
    used: false,
    applicable: "Airport rides",
  },
];

export default function Promotions() {
  const [promos] = useState<Promo[]>(defaultPromos);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [inputCode, setInputCode] = useState("");

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setToast({ msg: `Code "${code}" copied to clipboard!`, type: "success" });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const applyCode = () => {
    if (!inputCode.trim()) return;
    const found = promos.find(
      (p) => p.code.toLowerCase() === inputCode.trim().toLowerCase()
    );
    if (found) {
      setToast({ msg: `Promo "${found.code}" applied! ${found.discount} discount activated.`, type: "success" });
    } else {
      setToast({ msg: "Invalid promo code. Please try again.", type: "error" });
    }
    setInputCode("");
  };

  const activePromos = promos.filter((p) => !p.used);
  const usedPromos = promos.filter((p) => p.used);

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 p-6 md:p-8 shadow-xl">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-4 right-8 text-8xl font-black text-white/10 select-none">%</div>
          <div className="absolute bottom-2 right-32 text-5xl font-black text-white/5 select-none">$</div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gold-light/15 border border-gold-light/25 flex items-center justify-center">
              <i className="fas fa-percentage text-gold-light text-sm"></i>
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              CAB Promotions
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white leading-tight mb-1">
            Your Exclusive Offers 🎁
          </h2>
          <p className="text-xs text-slate-400 max-w-md">
            Unlock savings on your rides. Copy a promo code and apply it at checkout, or enter a code you received below.
          </p>

          {/* Promo input */}
          <div className="flex gap-2 mt-5 max-w-md">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && applyCode()}
              placeholder="Enter promo code..."
              className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-light/50 focus:ring-1 focus:ring-blue-light/20 transition-all"
            />
            <button
              onClick={applyCode}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-main to-blue-light text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-blue-light/20 active:scale-95 transition-all"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Active Promo Cards */}
      <div>
        <h3 className="text-sm font-extrabold text-white mb-4 tracking-wider uppercase flex items-center gap-2">
          <i className="fas fa-tags text-green-400 text-xs"></i>
          Active Offers ({activePromos.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activePromos.map((promo) => (
            <div
              key={promo.id}
              className="relative overflow-hidden glass-panel rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all group cursor-pointer"
            >
              {/* Gradient stripe */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${promo.color} rounded-t-2xl`} />

              <div className="flex items-start gap-4 pt-1">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-r ${promo.color} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                  <i className={`fas ${promo.icon} text-white text-base`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <span className={`text-lg font-black bg-gradient-to-r ${promo.color} bg-clip-text text-transparent`}>
                        {promo.discount} OFF
                      </span>
                      <h4 className="text-sm font-bold text-white leading-tight mt-0.5">
                        {promo.title}
                      </h4>
                    </div>
                    <button
                      onClick={() => copyCode(promo.code)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-extrabold uppercase tracking-wider border transition-all ${
                        copiedCode === promo.code
                          ? "bg-green-500/20 border-green-500/30 text-green-400"
                          : "bg-blue-light/10 border-blue-light/20 text-blue-light hover:bg-blue-light/20"
                      }`}
                    >
                      <i className={`fas ${copiedCode === promo.code ? "fa-check" : "fa-copy"} text-[10px]`}></i>
                      {copiedCode === promo.code ? "Copied!" : promo.code}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{promo.desc}</p>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5">
                    <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <i className="fas fa-car text-[9px]"></i>
                      {promo.applicable}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <i className="fas fa-clock text-[9px]"></i>
                      Expires {promo.expiry}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Used Promos */}
      {usedPromos.length > 0 && (
        <div>
          <h3 className="text-sm font-extrabold text-slate-500 mb-4 tracking-wider uppercase flex items-center gap-2">
            <i className="fas fa-check-circle text-slate-600 text-xs"></i>
            Already Used ({usedPromos.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {usedPromos.map((promo) => (
              <div
                key={promo.id}
                className="relative overflow-hidden rounded-2xl p-5 bg-slate-950/40 border border-white/5 opacity-60"
              >
                <div className="absolute inset-0 bg-slate-950/40 rounded-2xl flex items-center justify-center">
                  <span className="px-4 py-1.5 bg-slate-800 border border-white/10 rounded-full text-[10px] font-extrabold text-slate-400 uppercase tracking-widest rotate-[-5deg]">
                    Used
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                    <i className={`fas ${promo.icon} text-slate-500 text-base`}></i>
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-500">{promo.code}</span>
                    <h4 className="text-sm font-bold text-slate-500 mt-0.5">{promo.title}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
