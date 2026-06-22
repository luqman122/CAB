"use client";

import React from "react";
import { PaymentMethod } from "@/lib/storage";

interface PaymentsProps {
  paymentMethods: PaymentMethod[];
  onAddPaymentMethod: (cardNum: string) => void;
  onSetPrimaryPaymentMethod: (id: string) => void;
  onRemovePaymentMethod: (id: string) => void;
  showToast: (msg: string, type: "success" | "error" | "warning" | "info") => void;
}

export default function Payments({
  paymentMethods,
  onAddPaymentMethod,
  onSetPrimaryPaymentMethod,
  onRemovePaymentMethod,
  showToast,
}: PaymentsProps) {
  const handleAddCard = () => {
    const cardNum = prompt("Enter Card Number (16 Digits):");
    if (cardNum === null) return;

    const trimmed = cardNum.trim();
    if (trimmed.length === 16 && /^[0-9]+$/.test(trimmed)) {
      onAddPaymentMethod(trimmed);
      showToast("New payment method added successfully!", "success");
    } else {
      showToast("Invalid card number details! Must be 16 digits.", "error");
    }
  };

  const handleSetPrimary = (id: string) => {
    onSetPrimaryPaymentMethod(id);
    showToast("Primary payment method updated", "success");
  };

  const handleRemove = (id: string) => {
    const method = paymentMethods.find((p) => p.id === id);
    if (method?.isDefault) {
      showToast("Cannot delete your primary payment method!", "warning");
      return;
    }

    if (confirm("Remove this payment method?")) {
      onRemovePaymentMethod(id);
      showToast("Payment method removed", "success");
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl animate-fade-in pb-12">
      <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
        <h3 className="text-sm font-extrabold text-white tracking-wider uppercase flex items-center gap-2">
          <i className="fas fa-credit-card text-blue-light"></i> Payment Methods
        </h3>
        <button
          onClick={handleAddCard}
          className="py-2 px-4 rounded-xl font-bold text-white gradient-btn text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <i className="fas fa-plus"></i> Add Card
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((pm) => (
          <div
            key={pm.id}
            className="bg-slate-950/20 border border-white/5 rounded-2xl p-5 hover:bg-slate-900/40 transition-all flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-lg text-blue-light shrink-0">
                <i className={`fas ${pm.icon}`}></i>
              </div>
              <div className="flex flex-col">
                <strong className="text-xs text-white font-bold block">{pm.type}</strong>
                <span className="text-[10px] text-slate-500 font-semibold block mt-0.5 leading-none">
                  {pm.details}
                </span>
                {pm.isDefault && (
                  <span className="text-[8px] font-extrabold tracking-wider text-green-light bg-green-light/10 border border-green-light/15 py-0.5 px-2 rounded-full mt-2 w-max leading-none">
                    Primary
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!pm.isDefault && (
                <button
                  onClick={() => handleSetPrimary(pm.id)}
                  className="text-[10px] font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Set Primary
                </button>
              )}
              <button
                onClick={() => handleRemove(pm.id)}
                className="w-8 h-8 rounded-full bg-slate-950/40 hover:bg-red-main text-slate-500 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer border border-white/5"
                title="Remove method"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
