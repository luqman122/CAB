"use client";

import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  icon,
  children,
  footer,
  className = "",
}: ModalProps) {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0f172a]/70 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 animate-fade-in">
      <div
        className={`w-full max-w-[480px] bg-slate-900 border border-white/5 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto ${className}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-white/5">
          <h3 className="text-base font-bold text-white flex items-center gap-2.5">
            {icon && <i className={`${icon} text-blue-light`}></i>}
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-main hover:text-white text-slate-400 flex items-center justify-center text-xs transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/5 bg-slate-950/20">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
