"use client";

import React, { useState, useEffect } from "react";
import { storage, UserProfile } from "@/lib/storage";
import Toast from "@/components/ui/Toast";

interface ProfileProps {
  onProfileUpdate: () => void;
}

export default function Profile({ onProfileUpdate }: ProfileProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "warning" } | null>(null);
  
  // Form Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Male");
  const [birthday, setBirthday] = useState("1995-03-20");
  const [country, setCountry] = useState("Somalia");
  const [city, setCity] = useState("Mogadishu");
  const [language, setLanguage] = useState("English");
  const [bio, setBio] = useState("Regular CAB user who loves comfortable and safe rides around Mogadishu.");

  // Emergency contact fields
  const [emergName, setEmergName] = useState("Family Member");
  const [emergPhone, setEmergPhone] = useState("+252 61 654 321");

  // Change Password fields
  const [curPass, setCurPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confPass, setConfPass] = useState("");

  useEffect(() => {
    const raw = storage.getItem("cab_user");
    const cached = raw ? (JSON.parse(raw) as UserProfile) : null;
    if (cached) {
      setUser(cached);
      setName(cached.name);
      setEmail(cached.email);
      setPhone(cached.phone || "+252 61 234 567");
    }
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel edit, reset fields
      if (user) {
        setName(user.name);
        setEmail(user.email);
        setPhone(user.phone || "+252 61 234 567");
      }
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleSaveProfile = () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setToast({ msg: "Name, email, and phone cannot be empty!", type: "warning" });
      return;
    }

    if (user) {
      const initials = name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
      const updated: UserProfile = {
        ...user,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        avatar: initials,
      };

      setUser(updated);
      storage.setItem("cab_user", updated);
      setIsEditing(false);
      onProfileUpdate(); // notify parent (Header/Sidebar) to reload
      setToast({ msg: "Profile information updated successfully!", type: "success" });
    }
  };

  const handleAvatarClick = () => {
    setToast({ msg: "Avatar upload simulated. Photo updated successfully!", type: "success" });
  };

  const handleEmergUpdate = () => {
    if (!emergName.trim() || !emergPhone.trim()) {
      setToast({ msg: "Emergency contact fields cannot be empty", type: "warning" });
      return;
    }
    setToast({ msg: "Emergency contact details updated", type: "success" });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!curPass || !newPass || !confPass) {
      setToast({ msg: "Please fill in all password fields!", type: "warning" });
      return;
    }
    if (newPass !== confPass) {
      setToast({ msg: "New passwords do not match!", type: "error" });
      return;
    }
    setToast({ msg: "Password updated successfully!", type: "success" });
    setCurPass("");
    setNewPass("");
    setConfPass("");
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
        <h2 className="text-xl font-black text-white">My Profile</h2>
        <p className="text-xs text-slate-400 mt-1">Manage your personal information, emergency settings, and security credentials</p>
      </div>

      {/* Hero Profile Card */}
      {user && (
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl">
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-full bg-slate-800 text-3xl font-black text-slate-200 flex items-center justify-center border-2 border-white/10 shadow-inner">
              {user.avatar}
            </div>
            <button
              onClick={handleAvatarClick}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-light border-2 border-slate-950 text-white text-xs flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-md"
              title="Upload photo"
            >
              <i className="fas fa-camera"></i>
            </button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-black text-white leading-tight">{user.name}</h3>
            <p className="text-xs text-slate-400 mt-1">{user.email}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3.5">
              <span className="px-2.5 py-1 rounded-full bg-blue-light/10 border border-blue-light/20 text-blue-light text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1.5">
                <i className="fas fa-check-circle"></i> Verified Account
              </span>
              <span className="px-2.5 py-1 rounded-full bg-gold-light/10 border border-gold-light/20 text-gold-light text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1.5">
                <i className="fas fa-medal"></i> Gold Member
              </span>
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold tracking-wide flex items-center gap-1.5">
                <i className="fas fa-star text-gold-light"></i> 4.8 Rating
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Personal Info fields card */}
      <div className="glass-panel p-6 rounded-3xl">
        <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <i className="fas fa-user-edit text-blue-light"></i> Personal Information
          </h3>
          <button
            onClick={isEditing ? handleSaveProfile : handleEditToggle}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
              isEditing
                ? "bg-gradient-to-r from-blue-main to-blue-light text-white hover:shadow-lg hover:shadow-blue-light/20"
                : "bg-slate-800 hover:bg-slate-700/60 text-slate-300"
            }`}
          >
            {isEditing ? (
              <>
                <i className="fas fa-save"></i> Save Changes
              </>
            ) : (
              <>
                <i className="fas fa-edit"></i> Edit Profile
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">Full Name</label>
            <input
              type="text"
              value={name}
              disabled={!isEditing}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-800/40 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:border-blue-light/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">Email Address</label>
            <input
              type="email"
              value={email}
              disabled={!isEditing}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-800/40 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:border-blue-light/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">Phone Number</label>
            <input
              type="tel"
              value={phone}
              disabled={!isEditing}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-slate-800/40 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:border-blue-light/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">Gender</label>
            <select
              value={gender}
              disabled={!isEditing}
              onChange={(e) => setGender(e.target.value)}
              className="bg-slate-800/40 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:border-blue-light/40"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">Birthday</label>
            <input
              type="date"
              value={birthday}
              disabled={!isEditing}
              onChange={(e) => setBirthday(e.target.value)}
              className="bg-slate-800/40 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:border-blue-light/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">Country</label>
            <input
              type="text"
              value={country}
              disabled={!isEditing}
              onChange={(e) => setCountry(e.target.value)}
              className="bg-slate-800/40 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:border-blue-light/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">City</label>
            <input
              type="text"
              value={city}
              disabled={!isEditing}
              onChange={(e) => setCity(e.target.value)}
              className="bg-slate-800/40 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:border-blue-light/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500">Preferred Language</label>
            <select
              value={language}
              disabled={!isEditing}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-800/40 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:border-blue-light/40"
            >
              <option value="Somali">Somali</option>
              <option value="English">English</option>
              <option value="Arabic">Arabic</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-bold text-slate-500">Short Bio</label>
            <textarea
              value={bio}
              disabled={!isEditing}
              rows={3}
              onChange={(e) => setBio(e.target.value)}
              className="bg-slate-800/40 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:border-blue-light/40 resize-none"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/5">
            <button
              onClick={handleEditToggle}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700/60 text-slate-300 font-bold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-main to-blue-light text-white font-bold text-xs rounded-xl hover:shadow-lg hover:shadow-blue-light/20"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Emergency Contact */}
      <div className="glass-panel p-6 rounded-3xl">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <i className="fas fa-ambulance text-red-main"></i> Emergency Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400">Contact Person / Relation</label>
            <input
              type="text"
              value={emergName}
              onChange={(e) => setEmergName(e.target.value)}
              placeholder="e.g. Spouse, Brother"
              className="bg-slate-800/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-light/40"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400">Phone Number</label>
            <input
              type="tel"
              value={emergPhone}
              onChange={(e) => setEmergPhone(e.target.value)}
              placeholder="Phone..."
              className="bg-slate-800/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-light/40"
            />
          </div>
        </div>
        <button
          onClick={handleEmergUpdate}
          className="mt-4 px-5 py-2.5 bg-slate-800 hover:bg-slate-700/60 text-slate-300 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5"
        >
          <i className="fas fa-save"></i> Update Emergency Contact
        </button>
      </div>

      {/* Change Password */}
      <form onSubmit={handleChangePassword} className="glass-panel p-6 rounded-3xl">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <i className="fas fa-key text-gold-light"></i> Change Password
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400">Current Password</label>
            <input
              type="password"
              value={curPass}
              onChange={(e) => setCurPass(e.target.value)}
              placeholder="••••••••"
              className="bg-slate-800/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-light/40"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400">New Password</label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="••••••••"
              className="bg-slate-800/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-light/40"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400">Confirm New Password</label>
            <input
              type="password"
              value={confPass}
              onChange={(e) => setConfPass(e.target.value)}
              placeholder="••••••••"
              className="bg-slate-800/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-light/40"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 px-5 py-2.5 bg-gradient-to-r from-blue-main to-blue-light text-white rounded-xl font-bold text-xs hover:shadow-lg hover:shadow-blue-light/20 active:scale-95 transition-all flex items-center gap-1.5"
        >
          <i className="fas fa-lock"></i> Update Password
        </button>
      </form>

      {/* Danger Zone */}
      <div className="border border-red-main/10 bg-red-main/3 rounded-3xl p-6">
        <h3 className="text-xs font-bold text-red-light uppercase tracking-widest mb-4 flex items-center gap-2">
          <i className="fas fa-exclamation-triangle"></i> Danger Zone
        </h3>
        <div className="flex flex-col gap-4 divide-y divide-red-main/5">
          <div className="flex items-center justify-between gap-4 py-2">
            <div>
              <strong className="text-sm font-bold text-white block">Deactivate Account</strong>
              <span className="text-xs text-slate-400">Temporarily disable your profile profile access. Can reactivate anytime.</span>
            </div>
            <button
              onClick={() => setToast({ msg: "Deactivation process has been sent to your email", type: "warning" })}
              className="px-4 py-2.5 bg-red-main/10 border border-red-main/20 hover:bg-red-main/20 text-red-light rounded-xl font-bold text-xs transition-all"
            >
              Deactivate
            </button>
          </div>
          <div className="flex items-center justify-between gap-4 pt-4">
            <div>
              <strong className="text-sm font-bold text-white block">Delete Account Permanent</strong>
              <span className="text-xs text-slate-400">Deletes all your transactions, rides history, and wallet cash. Action is permanent.</span>
            </div>
            <button
              onClick={() => setToast({ msg: "Account deletion requires customer support confirmation. Please raise a ticket.", type: "error" })}
              className="px-4 py-2.5 bg-red-main text-white hover:bg-red-main/90 rounded-xl font-bold text-xs hover:shadow-lg hover:shadow-red-main/20 transition-all"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
