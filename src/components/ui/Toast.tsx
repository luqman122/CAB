"use client";

import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "warning" | "info";
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  let icon = "fa-info-circle text-blue-light";
  let borderClass = "border-l-blue-light";

  if (type === "success") {
    icon = "fa-check-circle text-green-light";
    borderClass = "border-l-green-light";
  } else if (type === "error") {
    icon = "fa-exclamation-circle text-red-light";
    borderClass = "border-l-red-light";
  } else if (type === "warning") {
    icon = "fa-exclamation-triangle text-gold-light";
    borderClass = "border-l-gold-light";
  }

  return (
    <div className="fixed top-24 right-5 z-[3000] flex items-center gap-3 bg-slate-900 border border-white/5 border-l-4 ${borderClass} rounded-2xl p-4 shadow-2xl animate-fade-in max-w-[90%] sm:max-w-[380px]">
      <i className={`fas ${icon} text-lg shrink-0`}></i>
      <span className="text-xs font-semibold text-slate-200 flex-1 leading-normal">{message}</span>
      <button
        onClick={onClose}
        className="text-slate-500 hover:text-slate-200 text-xs transition-colors shrink-0 p-1"
      >
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
}

