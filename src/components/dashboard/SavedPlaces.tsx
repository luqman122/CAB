"use client";

import React, { useState, useEffect } from "react";
import { storage } from "@/lib/storage";
import Toast from "@/components/ui/Toast";

interface SavedPlace {
  id: string;
  name: string;
  address: string;
  icon: string;
  type: string;
}

interface SavedPlacesProps {
  onBookRideWithDestination: (destination: string) => void;
}

export default function SavedPlaces({ onBookRideWithDestination }: SavedPlacesProps) {
  const [places, setPlaces] = useState<SavedPlace[]>([]);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newIcon, setNewIcon] = useState("fa-bookmark");

  useEffect(() => {
    const raw = storage.getItem("cab_saved_places");
    const stored = raw ? (JSON.parse(raw) as SavedPlace[]) : [];
    setPlaces(stored);
  }, []);

  const handleBook = (address: string) => {
    onBookRideWithDestination(address);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = places.filter((p) => p.id !== id);
    setPlaces(updated);
    storage.setItem("cab_saved_places", updated);
    setToast({ msg: "Saved place removed successfully", type: "success" });
  };

  const handleAddPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newAddress.trim()) {
      setToast({ msg: "Please fill in all fields", type: "error" });
      return;
    }

    const newPlace: SavedPlace = {
      id: `SP_${Date.now()}`,
      name: newName.trim(),
      address: newAddress.trim(),
      icon: newIcon,
      type: "other",
    };

    const updated = [...places, newPlace];
    setPlaces(updated);
    storage.setItem("cab_saved_places", updated);

    setNewName("");
    setNewAddress("");
    setNewIcon("fa-bookmark");
    setShowAddForm(false);
    setToast({ msg: "New place saved successfully!", type: "success" });
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">Saved Places</h2>
          <p className="text-xs text-slate-400 mt-1">Your favorite locations for quick, one-click taxi bookings</p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-main to-blue-light text-white rounded-xl font-bold text-xs hover:shadow-lg hover:shadow-blue-light/20 active:scale-95 transition-all"
          >
            <i className="fas fa-plus-circle"></i>
            Add New Place
          </button>
        )}
      </div>

      {/* Add New Place Form */}
      {showAddForm && (
        <form onSubmit={handleAddPlace} className="glass-panel p-6 rounded-3xl flex flex-col gap-4 animate-slide-up">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Save New Place</h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400">Place Name (e.g. Gym, Library)</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter name..."
                className="bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-light/50"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400">Street Address</label>
              <input
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Enter address..."
                className="bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-light/50"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400">Choose Icon</label>
            <div className="flex gap-2 flex-wrap">
              {[
                { name: "fa-home", label: "Home" },
                { name: "fa-briefcase", label: "Work" },
                { name: "fa-plane", label: "Airport" },
                { name: "fa-hospital", label: "Hospital" },
                { name: "fa-shopping-bag", label: "Shop" },
                { name: "fa-umbrella-beach", label: "Beach" },
                { name: "fa-bookmark", label: "Other" },
              ].map((ic) => (
                <button
                  type="button"
                  key={ic.name}
                  onClick={() => setNewIcon(ic.name)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    newIcon === ic.name
                      ? "bg-blue-light/10 border-blue-light/35 text-blue-light"
                      : "bg-slate-900 border-white/5 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <i className={`fas ${ic.name}`}></i>
                  {ic.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-2 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-5 py-2.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-main to-blue-light text-white font-bold text-xs rounded-xl hover:shadow-lg hover:shadow-blue-light/20"
            >
              Save Place
            </button>
          </div>
        </form>
      )}

      {/* Places Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {places.map((place) => (
          <div
            key={place.id}
            onClick={() => handleBook(place.address)}
            className="group relative overflow-hidden glass-panel rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all flex items-center justify-between gap-4 cursor-pointer hover:bg-white/1"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-blue-light/10 text-blue-light flex items-center justify-center text-base shrink-0 border border-blue-light/20 group-hover:scale-110 transition-transform">
                <i className={`fas ${place.icon}`}></i>
              </div>
              <div className="min-w-0">
                <strong className="text-sm font-bold text-white block truncate leading-tight">
                  {place.name}
                </strong>
                <span className="text-[11px] text-slate-400 block truncate mt-1 leading-normal">
                  {place.address}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={(e) => handleDelete(e, place.id)}
                className="w-8 h-8 rounded-lg bg-red-main/10 text-red-light flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 hover:bg-red-main/20 transition-all"
                title="Delete Place"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
              <i className="fas fa-chevron-right text-xs text-slate-600 group-hover:text-slate-400 transition-colors pl-1"></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
