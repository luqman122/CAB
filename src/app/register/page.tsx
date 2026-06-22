"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Password strength state
  const [strengthText, setStrengthText] = useState("Maba jiro");
  const [strengthClass, setStrengthClass] = useState("text-slate-500");
  const [strengthFillWidth, setStrengthFillWidth] = useState("w-0");
  const [strengthFillBg, setStrengthFillBg] = useState("bg-slate-700");

  const checkPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (pass.length === 0) {
      setStrengthText("Maba jiro");
      setStrengthClass("text-slate-500");
      setStrengthFillWidth("w-0");
      setStrengthFillBg("bg-slate-700");
    } else if (score <= 2) {
      setStrengthText("Tabar-yar (Weak)");
      setStrengthClass("text-red-light");
      setStrengthFillWidth("w-[25%]");
      setStrengthFillBg("bg-red-main");
    } else if (score === 3) {
      setStrengthText("Dhexe (Fair)");
      setStrengthClass("text-gold-light");
      setStrengthFillWidth("w-[50%]");
      setStrengthFillBg("bg-gold-main");
    } else if (score === 4) {
      setStrengthText("Fiican (Good)");
      setStrengthClass("text-blue-light");
      setStrengthFillWidth("w-[75%]");
      setStrengthFillBg("bg-blue-main");
    } else {
      setStrengthText("Aad u Adag (Strong)");
      setStrengthClass("text-green-light");
      setStrengthFillWidth("w-full");
      setStrengthFillBg("bg-green-main");
    }
  };

  const validateName = (val: string) => {
    return val.trim().length >= 3 && val.trim().length <= 50;
  };

  const validateEmail = (val: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val.trim());
  };

  const validatePhone = (val: string) => {
    const phoneRegex = /^[0-9]{7,9}$/;
    return phoneRegex.test(val.trim().replace(/\s+/g, ""));
  };

  const validatePassword = (val: string) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$/;
    return passwordRegex.test(val);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (nameTouched) {
      setNameError(!validateName(val));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (emailTouched) {
      setEmailError(!validateEmail(val));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPhone(val);
    if (phoneTouched) {
      setPhoneError(!validatePhone(val));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    checkPasswordStrength(val);
    if (passwordTouched) {
      setPasswordError(!validatePassword(val));
    }
    if (confirmPasswordTouched) {
      setConfirmPasswordError(confirmPassword !== val);
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setConfirmPassword(val);
    if (confirmPasswordTouched || password.length > 0) {
      setConfirmPasswordTouched(true);
      setConfirmPasswordError(val !== password);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phone);
    const isPassValid = validatePassword(password);
    const isConfirmValid = confirmPassword === password;

    setNameError(!isNameValid);
    setEmailError(!isEmailValid);
    setPhoneError(!isPhoneValid);
    setPasswordError(!isPassValid);
    setConfirmPasswordError(!isConfirmValid);

    setNameTouched(true);
    setEmailTouched(true);
    setPhoneTouched(true);
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);

    if (isNameValid && isEmailValid && isPhoneValid && isPassValid && isConfirmValid) {
      setIsLoading(true);

      // Simulate API submit registration
      setTimeout(() => {
        setIsLoading(false);
        setShowSuccess(true);

        // Seeding user registration data
        const newUser = {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          avatar: name.trim().substring(0, 2).toUpperCase(),
          rating: "5.0",
          joined: "Today",
        };
        localStorage.setItem("cab_user", JSON.stringify(newUser));

        setTimeout(() => {
          router.push("/login");
        }, 2500);
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

      <div className="relative z-10 w-full max-w-[460px] glass-panel p-8 md:p-10 rounded-3xl shadow-2xl overflow-hidden min-h-[500px] flex flex-col justify-center">
        {showSuccess ? (
          <div className="text-center flex flex-col items-center justify-center py-6 animate-fade-in">
            <i className="fas fa-check-circle text-6xl text-green-light mb-5"></i>
            <h3 className="text-2xl font-extrabold text-white mb-3">Guul! Account-kaaga Waa La Sameeyay</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-[300px]">
              Diiwangelintaada waa lagu guuleystay. Waxaa laguu wareejinayaa bogga galista (Login) dhowr ilbiriqsi ka dib...
            </p>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Header */}
            <div className="text-center mb-6 flex flex-col items-center">
              <div className="w-[54px] h-[54px] rounded-2xl bg-gradient-to-r from-blue-main via-gold-main to-red-main text-white flex items-center justify-center text-xl shadow-lg shadow-blue-light/10 mb-3">
                <i className="fas fa-taxi"></i>
              </div>
              <h1 className="text-2xl font-black tracking-widest text-white mb-1">CAB</h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Abuur Account Cusub</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-300">Magacaaga oo Buuxa</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    onBlur={() => setNameTouched(true)}
                    placeholder="Magacaaga oo buuxa geli"
                    className={`w-full py-3 pl-10 pr-4 text-xs font-medium text-white rounded-xl bg-slate-950/40 border transition-all ${
                      nameTouched
                        ? nameError
                          ? "border-red-light bg-red-main/5"
                          : "border-green-light bg-green-main/5"
                        : "border-white/10 hover:border-white/20 focus:border-blue-light focus:ring-4 focus:ring-blue-light/10"
                    }`}
                  />
                  <i className="fas fa-user absolute left-3.5 text-slate-500 text-xs"></i>
                </div>
                {nameTouched && nameError && (
                  <p className="text-[10px] font-semibold text-red-light mt-0.5 flex items-center gap-1.5">
                    <i className="fas fa-exclamation-circle"></i> Magacaagu waa inuu ka koobnaadaa 3 ilaa 50 xaraf
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-300">E-mail</label>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={() => setEmailTouched(true)}
                    placeholder="Email-kaaga geli"
                    className={`w-full py-3 pl-10 pr-4 text-xs font-medium text-white rounded-xl bg-slate-950/40 border transition-all ${
                      emailTouched
                        ? emailError
                          ? "border-red-light bg-red-main/5"
                          : "border-green-light bg-green-main/5"
                        : "border-white/10 hover:border-white/20 focus:border-blue-light focus:ring-4 focus:ring-blue-light/10"
                    }`}
                  />
                  <i className="fas fa-envelope absolute left-3.5 text-slate-500 text-xs"></i>
                </div>
                {emailTouched && emailError && (
                  <p className="text-[10px] font-semibold text-red-light mt-0.5 flex items-center gap-1.5">
                    <i className="fas fa-exclamation-circle"></i> Fadlan geli email sax ah (tusaale: magac@domain.com)
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-300">Taleefanka (Phone)</label>
                <div className="relative flex items-center">
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    onBlur={() => setPhoneTouched(true)}
                    placeholder="61XXXXXXX ama 9XXXXXXX geli"
                    className={`w-full py-3 pl-10 pr-4 text-xs font-medium text-white rounded-xl bg-slate-950/40 border transition-all ${
                      phoneTouched
                        ? phoneError
                          ? "border-red-light bg-red-main/5"
                          : "border-green-light bg-green-main/5"
                        : "border-white/10 hover:border-white/20 focus:border-blue-light focus:ring-4 focus:ring-blue-light/10"
                    }`}
                  />
                  <i className="fas fa-phone absolute left-3.5 text-slate-500 text-xs"></i>
                </div>
                {phoneTouched && phoneError && (
                  <p className="text-[10px] font-semibold text-red-light mt-0.5 flex items-center gap-1.5">
                    <i className="fas fa-exclamation-circle"></i> Lambarka taleefanku waa inuu ahaadaa 7 ilaa 9 lambar
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-300">Password (Fure)</label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    onBlur={() => setPasswordTouched(true)}
                    placeholder="Abuur password ammaan ah"
                    className={`w-full py-3 pl-10 pr-10 text-xs font-medium text-white rounded-xl bg-slate-950/40 border transition-all ${
                      passwordTouched
                        ? passwordError
                          ? "border-red-light bg-red-main/5"
                          : "border-green-light bg-green-main/5"
                        : "border-white/10 hover:border-white/20 focus:border-blue-light focus:ring-4 focus:ring-blue-light/10"
                    }`}
                  />
                  <i className="fas fa-lock absolute left-3.5 text-slate-500 text-xs"></i>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-500 hover:text-slate-300 text-xs"
                  >
                    <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                  </button>
                </div>
                {passwordTouched && passwordError && (
                  <p className="text-[10px] font-semibold text-red-light mt-0.5 flex items-center gap-1.5 animate-fade-in">
                    <i className="fas fa-exclamation-circle"></i> Waa inuu yahay 8+ xaraf, oo leh xaraf weyn, xaraf yar, iyo lambar
                  </p>
                )}

                {/* Password Strength Indicator */}
                <div className="flex flex-col gap-1 mt-1 text-[10px] text-slate-400 font-semibold bg-slate-950/20 p-2 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span>Adkaysiga Furaha:</span>
                    <span className={`font-bold uppercase tracking-wider ${strengthClass}`}>{strengthText}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                    <div className={`h-full transition-all duration-300 ${strengthFillWidth} ${strengthFillBg}`} />
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-300">Xaqiiji Password-ka</label>
                <div className="relative flex items-center">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    onBlur={() => setConfirmPasswordTouched(true)}
                    placeholder="Ku celi password-ka"
                    className={`w-full py-3 pl-10 pr-10 text-xs font-medium text-white rounded-xl bg-slate-950/40 border transition-all ${
                      confirmPasswordTouched
                        ? confirmPasswordError
                          ? "border-red-light bg-red-main/5"
                          : "border-green-light bg-green-main/5"
                        : "border-white/10 hover:border-white/20 focus:border-blue-light focus:ring-4 focus:ring-blue-light/10"
                    }`}
                  />
                  <i className="fas fa-lock absolute left-3.5 text-slate-500 text-xs"></i>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 text-slate-500 hover:text-slate-300 text-xs"
                  >
                    <i className={showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                  </button>
                </div>
                {confirmPasswordTouched && confirmPasswordError && (
                  <p className="text-[10px] font-semibold text-red-light mt-0.5 flex items-center gap-1.5">
                    <i className="fas fa-exclamation-circle"></i> Password-yadu ma waafaqsana (iskuma mid aha)
                  </p>
                )}
              </div>

              {/* Notice */}
              <div className="text-[10px] text-slate-400 leading-relaxed mt-1 flex items-start gap-1.5 font-medium">
                <i className="fas fa-info-circle text-blue-light mt-0.5"></i>
                <span>
                  Markaad gujiso &quot;Abuur Account&quot;, waxaad ogolaatay{" "}
                  <a href="#" className="text-slate-200 hover:underline">
                    Heshiiska Cab
                  </a>{" "}
                  iyo{" "}
                  <a href="#" className="text-slate-200 hover:underline">
                    Siyaasadda Xogta
                  </a>
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 rounded-xl font-bold text-white gradient-btn flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed text-xs uppercase tracking-wider"
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner animate-spin"></i>
                    <span>Diiwangelinaya...</span>
                  </>
                ) : (
                  <>
                    <span>Abuur Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Note */}
            <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              <i className="fas fa-shield-alt text-slate-500"></i>
              <span>Xogtaada waa mid ammaan ah oo la ilaaliyo</span>
            </div>

            <div className="text-center text-xs text-slate-400 mt-6 font-medium">
              <p>
                Miyaad leedahay Account?{" "}
                <Link href="/login" className="text-blue-light hover:underline font-bold transition-colors">
                  Gal Halkan
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
