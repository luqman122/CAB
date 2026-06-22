"use client";

import React, { useState } from "react";
import Toast from "@/components/ui/Toast";

interface FAQItem {
  q: string;
  a: string;
}

const faqs: FAQItem[] = [
  { q: "How do I book a CAB ride?", a: "Navigate to the 'Book Ride' page from the menu, enter your destination address or select one from your Saved Places, pick your preferred vehicle type, and click 'Book Now' to confirm." },
  { q: "What payment methods does CAB support?", a: "CAB supports Visa cards, MasterCard, Paypal account funding, and local Mobile Money integration such as Hormuud EVC Plus payment." },
  { q: "How is the ride price calculated?", a: "Fares are based on distance traveled, estimated travel duration, and the base cost modifier of the chosen vehicle class." },
  { q: "Can I schedule a ride in advance?", a: "Yes! Toggle the 'Schedule' button in the booking panel, choose your desired date and time, and click 'Schedule Ride' to submit." },
  { q: "What is the refund policy for cancelled rides?", a: "If you cancel a ride after a driver has already been assigned and is heading towards you, a standard cancellation fee of $2.00 is charged from your wallet." },
  { q: "How do I earn rewards points?", a: "You earn points automatically with every kilometer you travel on a CAB ride. You also get points from daily check-ins and successful referrals." },
  { q: "Is my personal information secure?", a: "Absolutely. We encrypt all user profiles, wallet credentials, and booking histories using secure local data tokens." },
  { q: "How do I contact my driver directly?", a: "When a ride is active, use the phone call or chat message icon on the bottom of the Live Map panel to connect instantly." }
];

interface HelpProps {
  onNavigateToMessages: () => void;
}

export default function Help({ onNavigateToMessages }: HelpProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const handleAction = (msg: string, type: "success" | "error" | "info" = "info") => {
    setToast({ msg, type });
  };

  const filtered = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <h2 className="text-xl font-black text-white">Help Center</h2>
        <p className="text-xs text-slate-400 mt-1">Get support, report ride anomalies, and find answers to frequent questions</p>
      </div>

      {/* Search Help */}
      <div className="relative">
        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search help topics, FAQs..."
          className="w-full bg-slate-800 border border-white/5 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-light/40"
        />
      </div>

      {/* Quick Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div
          onClick={onNavigateToMessages}
          className="bg-slate-950/30 border border-white/5 rounded-2xl p-5 hover:bg-slate-900/40 hover:border-white/10 transition-all flex flex-col items-center text-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-light/10 text-blue-light flex items-center justify-center text-base group-hover:scale-110 transition-transform">
            <i className="fas fa-comments"></i>
          </div>
          <div>
            <strong className="text-xs font-bold text-white block">Live Chat</strong>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Chat with support</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 text-[8px] font-extrabold uppercase">Online</span>
        </div>

        {/* Card 2 */}
        <div
          onClick={() => handleAction("Calling CAB Help Center: +252 61 000 1111...", "info")}
          className="bg-slate-950/30 border border-white/5 rounded-2xl p-5 hover:bg-slate-900/40 hover:border-white/10 transition-all flex flex-col items-center text-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-base group-hover:scale-110 transition-transform">
            <i className="fas fa-phone"></i>
          </div>
          <div>
            <strong className="text-xs font-bold text-white block">Call Support</strong>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Available 24/7</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[8px] font-bold uppercase">24/7</span>
        </div>

        {/* Card 3 */}
        <div
          onClick={() => handleAction("Email query draft opened to: support@cab.so", "success")}
          className="bg-slate-950/30 border border-white/5 rounded-2xl p-5 hover:bg-slate-900/40 hover:border-white/10 transition-all flex flex-col items-center text-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-base group-hover:scale-110 transition-transform">
            <i className="fas fa-envelope"></i>
          </div>
          <div>
            <strong className="text-xs font-bold text-white block">Email Support</strong>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Reply within 2 hours</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[8px] font-bold uppercase">&lt; 2 hours</span>
        </div>

        {/* Card 4 */}
        <div
          onClick={() => handleAction("Technical issue ticketing form sent to dev support", "success")}
          className="bg-slate-950/30 border border-white/5 rounded-2xl p-5 hover:bg-slate-900/40 hover:border-white/10 transition-all flex flex-col items-center text-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-red-main/10 text-red-light flex items-center justify-center text-base group-hover:scale-110 transition-transform">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <div>
            <strong className="text-xs font-bold text-white block">Report Issue</strong>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Technical problems</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-red-main/10 text-red-light text-[8px] font-extrabold uppercase">Ticket</span>
        </div>
      </div>

      {/* FAQ section */}
      <div className="glass-panel p-6 rounded-3xl">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <i className="fas fa-question-circle text-blue-light"></i> Frequently Asked Questions
        </h3>
        <div className="flex flex-col gap-2.5">
          {filtered.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">No matching FAQs found</p>
          ) : (
            filtered.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="border border-white/5 rounded-2xl overflow-hidden bg-slate-950/10">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left transition-all hover:bg-white/1"
                  >
                    <span className="text-xs font-bold text-white">{faq.q}</span>
                    <i className={`fas fa-chevron-down text-[10px] text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-light" : ""}`}></i>
                  </button>
                  <div
                    className={`px-5 transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-40 pb-4 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Extra help grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Emergency Help */}
        <div className="border border-red-main/20 bg-red-main/5 p-5 rounded-2xl flex flex-col gap-3">
          <div className="flex items-center gap-2 text-red-light">
            <i className="fas fa-exclamation-triangle text-base"></i>
            <strong className="text-xs font-black uppercase tracking-wider">Emergency Help</strong>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">Immediate safety assistance is active 24/7 for any emergencies encountered during your rides.</p>
          <button
            onClick={() => handleAction("Emergency SOS dispatched! Standby for phone connection.", "error")}
            className="w-full mt-auto py-2 bg-red-main text-white font-bold text-[10px] rounded-xl uppercase tracking-wider hover:bg-red-main/90 active:scale-95 transition-all"
          >
            Get Emergency Help
          </button>
        </div>

        {/* Lost & Found */}
        <div className="bg-slate-950/30 border border-white/5 p-5 rounded-2xl flex flex-col gap-3">
          <div className="flex items-center gap-2 text-blue-light">
            <i className="fas fa-search-location text-base"></i>
            <strong className="text-xs font-black uppercase tracking-wider">Lost &amp; Found</strong>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">Forgot a bag or phone? Easily register a lost-and-found report or directly call your previous driver.</p>
          <button
            onClick={() => handleAction("Lost & Found retrieval form submitted. We will contact your driver.", "success")}
            className="w-full mt-auto py-2 bg-slate-800 text-slate-300 font-bold text-[10px] rounded-xl uppercase tracking-wider hover:bg-slate-700/60 active:scale-95 transition-all"
          >
            Report Lost Item
          </button>
        </div>

        {/* Report Misconduct */}
        <div className="bg-slate-950/30 border border-white/5 p-5 rounded-2xl flex flex-col gap-3">
          <div className="flex items-center gap-2 text-purple-400">
            <i className="fas fa-user-slash text-base"></i>
            <strong className="text-xs font-black uppercase tracking-wider">Report Driver</strong>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">Report any driver misconduct, safety traffic violations, or unprofessional comments immediately.</p>
          <button
            onClick={() => handleAction("Driver report ticket opened. CAB Support will review.", "info")}
            className="w-full mt-auto py-2 bg-slate-800 text-slate-300 font-bold text-[10px] rounded-xl uppercase tracking-wider hover:bg-slate-700/60 active:scale-95 transition-all"
          >
            Report Misconduct
          </button>
        </div>
      </div>
    </div>
  );
}
