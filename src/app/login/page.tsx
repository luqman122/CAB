"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  
  const [identifierError, setIdentifierError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [identifierTouched, setIdentifierTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateIdentifier = (val: string) => {
    const trimmed = val.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(trimmed)) return true;
    const phoneRegex = /^[0-9]{7,9}$/;
    return phoneRegex.test(trimmed.replace(/\s+/g, ""));
  };

  const validatePassword = (val: string) => {
    return val.length >= 8;
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setIdentifier(val);
    if (identifierTouched) {
      setIdentifierError(!validateIdentifier(val));
    }
  };

  const handleIdentifierBlur = () => {
    setIdentifierTouched(true);
    setIdentifierError(!validateIdentifier(identifier));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (passwordTouched) {
      setPasswordError(!validatePassword(val));
    }
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    setPasswordError(!validatePassword(password));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isIdValid = validateIdentifier(identifier);
    const isPassValid = validatePassword(password);

    setIdentifierError(!isIdValid);
    setPasswordError(!isPassValid);
    setIdentifierTouched(true);
    setPasswordTouched(true);

    if (isIdValid && isPassValid) {
      setIsLoading(true);

      // Simulate API verification
      setTimeout(() => {
        const user = {
          name: "Ahmed Luqman",
          email: identifier.includes("@") ? identifier : "ahmed.luqman@email.com",
          phone: !identifier.includes("@") ? identifier : "612345678",
          avatar: "AH",
          rating: "4.95",
          joined: "June 2026",
        };
        localStorage.setItem("cab_user", JSON.stringify(user));
        setShowSuccess(true);
        setIsLoading(false);

        // Redirect to dashboard
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }, 1500);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-red-dark/10 p-6 overflow-hidden">
      {/* Floating particles background wrapper */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[
          { left: "10%", delay: "0s", duration: "18s" },
          { left: "25%", delay: "2s", duration: "22s" },
          { left: "40%", delay: "5s", duration: "20s" },
          { left: "60%", delay: "1s", duration: "25s" },
          { left: "75%", delay: "8s", duration: "19s" },
          { left: "90%", delay: "3s", duration: "24s" },
        ].map((style, idx) => (
          <div
            key={idx}
            className="absolute bottom-[-10px] w-1 h-1 bg-white/40 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)] animate-float"
            style={{
              left: style.left,
              animationDelay: style.delay,
              animationDuration: style.duration,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-[440px] glass-panel p-8 md:p-10 rounded-3xl shadow-2xl overflow-hidden min-h-[420px] flex flex-col justify-center">
        {showSuccess ? (
          <div className="text-center flex flex-col items-center justify-center py-6 animate-fade-in">
            <i className="fas fa-check-circle text-6xl text-green-light mb-5"></i>
            <h3 className="text-2xl font-extrabold text-white mb-3">Soo Galka Waa Lagu Guuleystay!</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-[300px]">
              Kulanti wacan! Bogga weyn ee CAB ayaa laguu wareejinayaa dhowr ilbiriqsi ka dib...
            </p>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8 flex flex-col items-center">
              <div className="w-[60px] h-[60px] rounded-2xl bg-gradient-to-r from-blue-main via-gold-main to-red-main text-white flex items-center justify-center text-2xl shadow-lg shadow-blue-light/10 mb-4">
                <i className="fas fa-taxi"></i>
              </div>
              <h1 className="text-3xl font-black tracking-widest text-white mb-1">CAB</h1>
              <p className="text-slate-400 text-sm font-semibold">Soo Gal Account-kaaga</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">E-mail ama Taleefan</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={identifier}
                    onChange={handleIdentifierChange}
                    onBlur={handleIdentifierBlur}
                    placeholder="Email-kaaga ama taleefankaaga geli"
                    className={`w-full py-3.5 pl-11 pr-4 text-sm font-medium text-white rounded-xl bg-slate-950/40 border transition-all ${
                      identifierTouched
                        ? identifierError
                          ? "border-red-light bg-red-main/5 focus:border-red-light focus:ring-4 focus:ring-red-light/10"
                          : "border-green-light bg-green-main/5 focus:border-green-light focus:ring-4 focus:ring-green-light/10"
                        : "border-white/10 hover:border-white/20 focus:border-blue-light focus:ring-4 focus:ring-blue-light/10"
                    }`}
                  />
                  <i className="fas fa-envelope absolute left-4 text-slate-500 text-sm"></i>
                </div>
                {identifierError && (
                  <p className="text-[11px] font-semibold text-red-light mt-1 flex items-center gap-1.5">
                    <i className="fas fa-exclamation-circle"></i> Fadlan geli e-mail sax ah ama lambar taleefan (7-9 lambar)
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-300">Password (Fure)</label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordBlur}
                    placeholder="Geli password-kaaga"
                    className={`w-full py-3.5 pl-11 pr-12 text-sm font-medium text-white rounded-xl bg-slate-950/40 border transition-all ${
                      passwordTouched
                        ? passwordError
                          ? "border-red-light bg-red-main/5 focus:border-red-light focus:ring-4 focus:ring-red-light/10"
                          : "border-green-light bg-green-main/5 focus:border-green-light focus:ring-4 focus:ring-green-light/10"
                        : "border-white/10 hover:border-white/20 focus:border-blue-light focus:ring-4 focus:ring-blue-light/10"
                    }`}
                  />
                  <i className="fas fa-lock absolute left-4 text-slate-500 text-sm"></i>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-slate-500 hover:text-slate-300 text-sm transition-colors"
                  >
                    <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                  </button>
                </div>
                {passwordError && (
                  <p className="text-[11px] font-semibold text-red-light mt-1 flex items-center gap-1.5">
                    <i className="fas fa-exclamation-circle"></i> Password-ku ma noqon karo wax ka yar 8 xaraf
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none hover:text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-white/10 bg-slate-950/40 text-blue-light focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span>I xasuuso</span>
                </label>
                <a href="#" className="hover:text-gold-light hover:underline transition-colors" onClick={(e) => { e.preventDefault(); alert("ForgotPassword mock: contact support at support@cab.so"); }}>
                  Ma ilowday furaha?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 py-4 rounded-xl font-bold text-white gradient-btn flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed text-sm uppercase tracking-wider"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner animate-spin"></i>
                    <span>Soo gelaya...</span>
                  </>
                ) : (
                  <>
                    <span>Soo Gal</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-xs text-slate-400 mt-8 font-medium">
              <p>
                Miyaanad lahayn Account?{" "}
                <Link href="/register" className="text-blue-light hover:underline font-bold transition-colors">
                  Abuur Halkan
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
