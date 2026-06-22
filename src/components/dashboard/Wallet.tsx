"use client";

import React, { useState } from "react";
import { WalletTransaction, PaymentMethod } from "@/lib/storage";
import Modal from "@/components/ui/Modal";

interface WalletProps {
  walletBalance: number;
  transactions: WalletTransaction[];
  paymentMethods: PaymentMethod[];
  onFundWallet: (amount: number, method: string) => void;
  onWithdrawFunds: (amount: number) => void;
  showToast: (msg: string, type: "success" | "error" | "warning" | "info") => void;
}

export default function Wallet({
  walletBalance,
  transactions,
  paymentMethods,
  onFundWallet,
  onWithdrawFunds,
  showToast,
}: WalletProps) {
  const [txnFilter, setTxnFilter] = useState<"all" | "topup" | "ride" | "cashback">("all");

  // Fund modal states
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [presetAmount, setPresetAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");

  // Default payment selection
  React.useEffect(() => {
    if (paymentMethods.length > 0) {
      const defaultM = paymentMethods.find((p) => p.isDefault) || paymentMethods[0];
      setSelectedMethod(`${defaultM.type} ${defaultM.details}`);
    }
  }, [paymentMethods]);

  const handleFundSubmit = () => {
    const amt = parseFloat(customAmount || presetAmount);
    if (isNaN(amt) || amt <= 0) {
      showToast("Fadlan geli lacag sax ah!", "warning");
      return;
    }

    onFundWallet(amt, selectedMethod || "Visa ending in 4242");
    setFundModalOpen(false);
    setPresetAmount("");
    setCustomAmount("");
  };

  const handleWithdrawClick = () => {
    const amtStr = prompt("Enter amount to withdraw ($):");
    if (amtStr === null) return;

    const amt = parseFloat(amtStr);
    if (isNaN(amt) || amt <= 0) {
      showToast("Invalid withdrawal amount entered!", "error");
      return;
    }

    if (amt > walletBalance) {
      showToast("Insufficient wallet funds available!", "error");
      return;
    }

    onWithdrawFunds(amt);
    showToast(`Withdrawal of $${amt.toFixed(2)} requested!`, "success");
  };

  const filteredTxns = transactions.filter((t) => {
    if (txnFilter === "all") return true;
    return t.type === txnFilter;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in pb-12">
      {/* Left Column: Wallet details & presets */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        {/* Balance Hero Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-main via-blue-dark to-slate-950 border border-white/5 rounded-[30px] p-8 shadow-2xl flex flex-col justify-between min-h-[220px]">
          {/* Shines */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-radial from-blue-light/10 to-transparent blur-2xl pointer-events-none"></div>

          <div className="flex justify-between items-start z-10">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-blue-light uppercase tracking-widest leading-none">
                CAB Wallet Balance
              </span>
              <strong className="text-3xl md:text-4xl font-black text-white mt-3 block leading-none">
                ${walletBalance.toFixed(2)}
              </strong>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl text-blue-light shadow-inner">
              <i className="fas fa-wallet"></i>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6 z-10">
            <button
              onClick={() => setFundModalOpen(true)}
              className="py-3 rounded-xl bg-white text-[#0f172a] font-bold text-xs hover:bg-slate-100 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-blue-light/10"
            >
              <i className="fas fa-plus text-xs"></i> Fund Wallet
            </button>
            <button
              onClick={handleWithdrawClick}
              className="py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-white/5 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <i className="fas fa-arrow-up text-xs"></i> Withdraw
            </button>
            <button
              onClick={() => showToast("Mobile money peer transfer simulation", "info")}
              className="py-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-white/5 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <i className="fas fa-paper-plane text-xs"></i> Transfer
            </button>
          </div>
        </div>

        {/* Preset Cards Quick Deposits */}
        <div className="glass-panel p-6 rounded-3xl">
          <h3 className="text-sm font-extrabold text-white mb-4 tracking-wider uppercase">
            Quick Deposits Presets
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {[10, 25, 50, 100].map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  setPresetAmount(amt.toString());
                  setCustomAmount("");
                  setFundModalOpen(true);
                }}
                className="bg-slate-950/40 hover:bg-gradient-to-r hover:from-blue-main hover:to-red-main border border-white/5 hover:border-transparent py-4 rounded-xl font-bold text-sm text-slate-300 hover:text-white transition-all cursor-pointer text-center"
              >
                ${amt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Transaction History */}
      <div className="glass-panel p-6 rounded-3xl flex flex-col min-h-[360px]">
        <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
          <h3 className="text-sm font-extrabold text-white tracking-wider uppercase">
            Transactions
          </h3>

          <select
            value={txnFilter}
            onChange={(e) => setTxnFilter(e.target.value as any)}
            className="bg-slate-950/60 text-[10px] font-bold text-slate-400 border border-white/5 rounded-xl px-2.5 py-1.5 outline-none cursor-pointer focus:border-blue-light"
          >
            <option value="all">All</option>
            <option value="topup">Deposits</option>
            <option value="ride">Charges</option>
            <option value="cashback">Rewards</option>
          </select>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto max-h-[380px] flex flex-col gap-3">
          {filteredTxns.length === 0 ? (
            <div className="text-center py-12 text-slate-500 flex flex-col items-center justify-center gap-2 flex-1">
              <i className="fas fa-list-ul text-xl"></i>
              <p className="text-[10px] text-slate-500">No transactions recorded.</p>
            </div>
          ) : (
            filteredTxns.map((t) => {
              const isOut = t.amount < 0;
              const sign = isOut ? "-" : "+";
              const amtClass = isOut ? "text-red-light" : "text-green-light";
              let icon = "fa-arrow-down text-green-light bg-green-light/10";
              if (t.type === "ride") icon = "fa-taxi text-red-light bg-red-main/10";
              if (t.type === "cashback") icon = "fa-gift text-gold-light bg-gold-light/10";

              return (
                <div
                  key={t.id}
                  className="bg-slate-950/20 border border-white/5 rounded-2xl p-3.5 flex items-center justify-between gap-3 hover:bg-slate-900/40 transition-all"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs shrink-0 ${icon.split(" ")[1]} ${icon.split(" ")[2]}`}>
                    <i className={`fas ${icon.split(" ")[0]}`}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <strong className="text-xs font-bold text-white block truncate leading-tight">
                      {t.desc}
                    </strong>
                    <span className="text-[9px] text-slate-500 mt-1 block">
                      {t.date} &bull; {t.time}
                    </span>
                  </div>
                  <div className={`text-xs font-black shrink-0 ${amtClass}`}>
                    {sign}${Math.abs(t.amount).toFixed(2)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Fund Wallet Modal */}
      <Modal
        isOpen={fundModalOpen}
        onClose={() => setFundModalOpen(false)}
        title="Add Money to Wallet"
        icon="fas fa-plus-circle"
        footer={
          <>
            <button
              onClick={() => setFundModalOpen(false)}
              className="px-5 py-2 rounded-xl border border-white/5 hover:bg-slate-800 text-xs font-bold text-slate-400 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleFundSubmit}
              className="px-5 py-2.5 rounded-xl font-bold text-white gradient-btn text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <i className="fas fa-plus"></i> Add Money
            </button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          {/* Quick presets */}
          <div className="grid grid-cols-4 gap-2">
            {[10, 25, 50, 100].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => {
                  setPresetAmount(val.toString());
                  setCustomAmount("");
                }}
                className={`py-2 border text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  presetAmount === val.toString()
                    ? "bg-blue-light/10 border-blue-light text-blue-light"
                    : "bg-slate-950/20 border-white/5 text-slate-400 hover:bg-slate-900"
                }`}
              >
                ${val}
              </button>
            ))}
          </div>

          {/* Custom Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              Custom Amount
            </label>
            <div className="flex items-center bg-slate-950/40 border border-white/5 focus-within:border-blue-light rounded-xl px-4 transition-all">
              <span className="text-lg font-bold text-slate-500">$</span>
              <input
                type="number"
                placeholder="0.00"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setPresetAmount("");
                }}
                className="w-full bg-transparent border-none py-3 px-2 text-base font-black text-white focus:outline-none"
                min={1}
                max={10000}
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              Payment Method
            </label>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full py-3 px-4 text-xs font-bold bg-slate-950/40 border border-white/5 focus:border-blue-light rounded-xl text-white outline-none cursor-pointer"
            >
              {paymentMethods.map((m) => (
                <option key={m.id} value={`${m.type} ${m.details}`}>
                  {m.type === "Visa" ? "💳" : m.type === "PayPal" ? "💰" : "📱"} {m.type} {m.details}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
