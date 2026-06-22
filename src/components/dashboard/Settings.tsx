"use client";

import React, { useState, useEffect } from "react";
import Toast from "@/components/ui/Toast";

export default function Settings() {
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState("en");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "info" } | null>(null);

  // Toggle checks
  const [notifRide, setNotifRide] = useState(true);
  const [notifDriver, setNotifDriver] = useState(true);
  const [notifPromo, setNotifPromo] = useState(true);
  const [notifSecurity, setNotifSecurity] = useState(true);
  const [notifWallet, setNotifWallet] = useState(true);

  const [privLocation, setPrivLocation] = useState(true);
  const [privBiometrics, setPrivBiometrics] = useState(false);
  const [privAutoLogout, setPrivAutoLogout] = useState(false);

  useEffect(() => {
    // Check initial theme of document
    const root = document.documentElement;
    const theme = root.getAttribute("data-theme");
    setIsDark(theme !== "light");
  }, []);

  const handleThemeChange = (checked: boolean) => {
    setIsDark(checked);
    const root = document.documentElement;
    if (checked) {
      root.setAttribute("data-theme", "dark");
      setToast({ msg: "Dark Theme Enabled", type: "info" });
    } else {
      root.setAttribute("data-theme", "light");
      setToast({ msg: "Light Theme Enabled", type: "info" });
    }
  };

  const handleLangChange = (val: string) => {
    setLang(val);
    setToast({ msg: `Language changed to: ${val === "so" ? "Somali" : val === "ar" ? "Arabic" : "English"}`, type: "success" });
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-white">Settings</h2>
        <p className="text-xs text-slate-400 mt-1">Configure your design preference, notification alerts, and privacy rules</p>
      </div>

      {/* Appearance */}
      <div className="glass-panel p-6 rounded-3xl">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <i className="fas fa-palette text-blue-light"></i> Appearance
        </h3>
        <div className="flex flex-col gap-4 divide-y divide-white/5">
          <div className="flex items-center justify-between py-2">
            <div>
              <strong className="text-sm font-bold text-white block">Dark Mode Theme</strong>
              <span className="text-xs text-slate-400">Reduce glare and conserve mobile battery life</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isDark}
                onChange={(e) => handleThemeChange(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-light"></div>
            </label>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              <strong className="text-sm font-bold text-white block">Application Language</strong>
              <span className="text-xs text-slate-400 font-medium">Select your default app navigation text language</span>
            </div>
            <select
              value={lang}
              onChange={(e) => handleLangChange(e.target.value)}
              className="bg-slate-800 border border-white/5 rounded-xl px-4 py-2 text-xs font-bold text-slate-300 focus:outline-none focus:border-blue-light/40"
            >
              <option value="so">Somali (Soomaali)</option>
              <option value="en">English (US)</option>
              <option value="ar">Arabic (العربية)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-panel p-6 rounded-3xl">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <i className="fas fa-bell text-gold-light"></i> Notification Alerts
        </h3>
        <div className="flex flex-col gap-4 divide-y divide-white/5">
          {/* Item 1 */}
          <div className="flex items-center justify-between py-2">
            <div>
              <strong className="text-sm font-bold text-white block">Ride Updates</strong>
              <span className="text-xs text-slate-400">Driver assignment status, completion receipts</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifRide}
                onChange={(e) => setNotifRide(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-light"></div>
            </label>
          </div>
          {/* Item 2 */}
          <div className="flex items-center justify-between pt-4">
            <div>
              <strong className="text-sm font-bold text-white block">Driver Real-time Updates</strong>
              <span className="text-xs text-slate-400">Driver arrival notices, approach map alerts</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifDriver}
                onChange={(e) => setNotifDriver(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-light"></div>
            </label>
          </div>
          {/* Item 3 */}
          <div className="flex items-center justify-between pt-4">
            <div>
              <strong className="text-sm font-bold text-white block">Promotions & Offers</strong>
              <span className="text-xs text-slate-400">Personalized discounts, cashback alerts, voucher codes</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifPromo}
                onChange={(e) => setNotifPromo(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-light"></div>
            </label>
          </div>
          {/* Item 4 */}
          <div className="flex items-center justify-between pt-4">
            <div>
              <strong className="text-sm font-bold text-white block">Security & Login Alerts</strong>
              <span className="text-xs text-slate-400">Alerts when new logins are registered on this profile</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifSecurity}
                onChange={(e) => setNotifSecurity(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-light"></div>
            </label>
          </div>
          {/* Item 5 */}
          <div className="flex items-center justify-between pt-4">
            <div>
              <strong className="text-sm font-bold text-white block">Wallet Balance Warnings</strong>
              <span className="text-xs text-slate-400">Deposits, withdrawal confirmations, low balance warnings</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifWallet}
                onChange={(e) => setNotifWallet(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-light"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="glass-panel p-6 rounded-3xl">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <i className="fas fa-shield-alt text-emerald-400"></i> Privacy & Security
        </h3>
        <div className="flex flex-col gap-4 divide-y divide-white/5">
          {/* Item 1 */}
          <div className="flex items-center justify-between py-2">
            <div>
              <strong className="text-sm font-bold text-white block">Location Permissions</strong>
              <span className="text-xs text-slate-400 font-medium">Access coordinates for automated pickup selection</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 rounded bg-green-500/10 text-green-400 text-[10px] font-extrabold uppercase">Active</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privLocation}
                  onChange={(e) => setPrivLocation(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-light"></div>
              </label>
            </div>
          </div>
          {/* Item 2 */}
          <div className="flex items-center justify-between pt-4">
            <div>
              <strong className="text-sm font-bold text-white block">Biometric Lockout</strong>
              <span className="text-xs text-slate-400">Enable fingerprint ID / Face ID verification at startup</span>
            </div>
            <div className="flex items-center gap-3">
              <i className="fas fa-fingerprint text-blue-light text-lg"></i>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={privBiometrics}
                  onChange={(e) => setPrivBiometrics(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-light"></div>
              </label>
            </div>
          </div>
          {/* Item 3 */}
          <div className="flex items-center justify-between pt-4">
            <div>
              <strong className="text-sm font-bold text-white block">Connected Devices</strong>
              <span className="text-xs text-slate-400">2 terminals currently authenticated</span>
            </div>
            <button
              onClick={() => setToast({ msg: "Devices list: Chrome Windows (This) and Safari iPhone", type: "info" })}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <i className="fas fa-chevron-right text-xs"></i>
            </button>
          </div>
          {/* Item 4 */}
          <div className="flex items-center justify-between pt-4">
            <div>
              <strong className="text-sm font-bold text-white block">Inactivity Auto-Logout</strong>
              <span className="text-xs text-slate-400">Automatically logout after 30 minutes of idle window state</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privAutoLogout}
                onChange={(e) => setPrivAutoLogout(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-light"></div>
            </label>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="glass-panel p-6 rounded-3xl">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <i className="fas fa-info-circle text-purple-400"></i> About CAB System
        </h3>
        <div className="flex flex-col gap-4 divide-y divide-white/5">
          <div className="flex justify-between items-center py-2 cursor-pointer hover:text-white transition-all">
            <span className="text-xs font-semibold text-slate-300">Terms of Service Agreement</span>
            <i className="fas fa-chevron-right text-[10px] text-slate-500"></i>
          </div>
          <div className="flex justify-between items-center pt-4 cursor-pointer hover:text-white transition-all">
            <span className="text-xs font-semibold text-slate-300">Privacy & Cookie Management Policy</span>
            <i className="fas fa-chevron-right text-[10px] text-slate-500"></i>
          </div>
          <div className="flex justify-between items-center pt-4">
            <span className="text-xs font-semibold text-slate-300">System Code Version</span>
            <span className="text-xs font-bold text-slate-500">v2.4.1 (passenger-app)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
