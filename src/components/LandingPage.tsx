"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { UserProfile, seedDefaultData } from "@/lib/storage";

export default function LandingPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Seed default datasets on startup
    seedDefaultData();

    // Check for cached user session
    const cached = localStorage.getItem("cab_user");
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch (e) {
        console.error(e);
      }
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-navy text-slate-100 overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-100px] right-[-100px] w-[500px] height-[500px] rounded-full bg-radial from-blue-light/10 to-transparent blur-3xl pointer-events-none z-0" style={{ height: '500px' }}></div>
      <div className="absolute bottom-[10%] left-[-200px] w-[500px] height-[500px] rounded-full bg-radial from-red-light/5 to-transparent blur-3xl pointer-events-none z-0" style={{ height: '500px' }}></div>

      {/* Header Navigation */}
      <header
        className={`fixed top-0 left-0 w-full px-[8%] py-5 z-50 flex justify-between items-center transition-all duration-300 ${
          isScrolled
            ? "py-3 bg-navy/95 backdrop-blur-md border-b border-white/5 shadow-lg"
            : "bg-navy/70 backdrop-blur-sm border-b border-white/5"
        }`}
      >
        <Link href="/" className="flex items-center gap-3 text-2xl font-extrabold tracking-widest text-white hover:opacity-90">
          <i className="fas fa-taxi gradient-text"></i> CAB
        </Link>

        <ul className="hidden md:flex items-center gap-8 list-none text-slate-400 font-medium text-sm">
          <li>
            <a href="#" className="text-white hover:text-white transition-colors">Home</a>
          </li>
          <li>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
          </li>
          <li>
            <a href="#about" className="hover:text-white transition-colors">About</a>
          </li>
          <li>
            <a href="#download" className="hover:text-white transition-colors">Download</a>
          </li>
        </ul>

        {/* CTA Container */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-slate-400 font-medium">
                Welcome, <strong className="text-white">{user.name.split(" ")[0]}</strong>!
              </span>
              <Link href="/dashboard" className="px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 bg-gradient-to-r from-blue-light via-gold-main to-red-light text-white hover:scale-[1.03] shadow-lg shadow-blue-light/20 flex items-center gap-2">
                Dashboard <i className="fas fa-arrow-right text-xs"></i>
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="px-6 py-2 rounded-xl text-slate-300 font-semibold text-sm border border-white/10 hover:bg-white/5 transition-all">
                Sign In
              </Link>
              <Link href="/login" className="px-6 py-2.5 rounded-xl font-semibold text-sm gradient-btn text-white hover:scale-[1.03] shadow-md shadow-blue-light/10">
                Book Ride
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Menu Icon */}
        <button
          className="block md:hidden text-white text-2xl"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </button>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[60px] bg-navy/95 backdrop-blur-md z-40 flex flex-col items-center gap-6 pt-12 md:hidden animate-fade-in">
          <a href="#" className="text-lg text-white font-medium" onClick={() => setMobileMenuOpen(false)}>Home</a>
          <a href="#features" className="text-lg text-slate-300 font-medium" onClick={() => setMobileMenuOpen(false)}>Features</a>
          <a href="#about" className="text-lg text-slate-300 font-medium" onClick={() => setMobileMenuOpen(false)}>About</a>
          <a href="#download" className="text-lg text-slate-300 font-medium" onClick={() => setMobileMenuOpen(false)}>Download</a>
          <div className="w-full px-12 h-[1px] bg-white/10 my-4"></div>
          {user ? (
            <Link href="/dashboard" className="w-[80%] py-3 text-center rounded-xl font-bold gradient-btn text-white" onClick={() => setMobileMenuOpen(false)}>
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex flex-col gap-4 w-[80%]">
              <Link href="/login" className="w-full py-3 text-center rounded-xl border border-white/15 text-slate-200 font-semibold" onClick={() => setMobileMenuOpen(false)}>
                Sign In
              </Link>
              <Link href="/login" className="w-full py-3 text-center rounded-xl gradient-btn text-white font-semibold" onClick={() => setMobileMenuOpen(false)}>
                Book Ride
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-screen px-[8%] pt-[150px] pb-20 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 z-10">
        <div className="flex-1 max-w-[620px] text-center lg:text-left flex flex-col items-center lg:items-start">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-blue-light bg-blue-light/10 border border-blue-light/20 mb-6 uppercase tracking-wider">
            <i className="fas fa-percentage text-gold-light"></i> Somalia's Premium Taxi Platform
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15] mb-6 tracking-tight text-white">
            Your Reliable Ride, <br className="hidden md:inline" />
            <span className="gradient-text">Anytime, Anywhere.</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed mb-8 max-w-[550px]">
            Book safe, fast, and comfortable taxi rides across Mogadishu in seconds. Get premium drivers, transparent pricing, and instant matching with Hormuud EVC Plus mobile wallet integrations.
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10 w-full">
            {user ? (
              <Link href="/dashboard" className="px-8 py-4 rounded-xl font-bold gradient-btn text-white shadow-lg shadow-red-main/20 flex items-center gap-3">
                <i className="fas fa-th-large"></i> Go to Dashboard
              </Link>
            ) : (
              <Link href="/login" className="px-8 py-4 rounded-xl font-bold gradient-btn text-white shadow-lg shadow-red-main/20 flex items-center gap-3">
                <i className="fas fa-taxi"></i> Book a Ride
              </Link>
            )}
            <a href="#features" className="px-8 py-4 rounded-xl font-bold border border-white/10 hover:bg-white/5 transition-all text-white">
              Learn More
            </a>
          </div>

          {/* Download Badges */}
          <div id="download" className="flex flex-wrap justify-center lg:justify-start gap-4 border-t border-white/10 pt-8 w-full max-w-[480px]">
            <a href="#" className="flex items-center gap-3 bg-slate-800/70 border border-white/5 px-5 py-2.5 rounded-xl text-white transition-all hover:border-slate-400 hover:-translate-y-0.5" onClick={(e) => { e.preventDefault(); alert("App Store download simulation active!"); }}>
              <i className="fab fa-apple text-2xl text-slate-100"></i>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[10px] text-slate-400">Download on the</span>
                <strong className="text-sm font-semibold">App Store</strong>
              </div>
            </a>
            <a href="#" className="flex items-center gap-3 bg-slate-800/70 border border-white/5 px-5 py-2.5 rounded-xl text-white transition-all hover:border-slate-400 hover:-translate-y-0.5" onClick={(e) => { e.preventDefault(); alert("Google Play download simulation active!"); }}>
              <i className="fab fa-google-play text-xl text-slate-100"></i>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[10px] text-slate-400">GET IT ON</span>
                <strong className="text-sm font-semibold">Google Play</strong>
              </div>
            </a>
          </div>
        </div>

        {/* Hero Image / Phone Mockup */}
        <div className="flex-1 flex justify-center items-center z-10 w-full max-w-[400px] lg:max-w-none">
          <div className="relative w-[310px] h-[620px] bg-slate-950 border-[10px] border-slate-800 rounded-[40px] shadow-2xl shadow-blue-light/15 overflow-hidden animate-float">
            {/* Phone Speaker/Camera Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140px] h-[24px] bg-slate-800 rounded-b-2xl z-20"></div>

            {/* Phone Screen Viewport */}
            <div className="w-full h-full bg-gradient-to-b from-[#0b0f19] to-[#172554] pt-8 px-5 pb-5 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-4">
                <span className="font-extrabold text-sm text-white">CAB App</span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-main via-gold-main to-red-main flex items-center justify-center font-bold text-xs text-white">
                  {user ? user.avatar : "AL"}
                </div>
              </div>

              {/* Simulated Map Box */}
              <div className="flex-1 bg-slate-900/60 rounded-2xl border border-white/5 relative overflow-hidden flex items-center justify-center mb-5">
                <div className="absolute inset-0 opacity-15 sim-map-grid"></div>
                <div className="absolute text-blue-light text-base animate-pulse-slow">
                  <i className="fas fa-taxi"></i>
                </div>
                <div className="z-10 bg-slate-950/80 px-3 py-1.5 rounded-full text-[10px] border border-white/5 font-semibold">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-light mr-1.5 animate-pulse"></span>
                  8 Drivers Online
                </div>
              </div>

              {/* Map Mock Input Card */}
              <div className="bg-slate-900/90 rounded-2xl p-4 border border-white/5 shadow-xl">
                <div className="bg-slate-950/80 rounded-xl p-2.5 text-xs text-slate-400 mb-2.5 flex items-center gap-2">
                  <i className="fas fa-circle text-blue-light text-[8px]"></i>
                  <span>Current Location</span>
                </div>
                <div className="bg-slate-950/80 rounded-xl p-2.5 text-xs text-slate-400 mb-3 flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-red-light text-[10px]"></i>
                  <span>Hamar-Weyne District...</span>
                </div>

                <Link
                  href={user ? "/dashboard" : "/login"}
                  className="w-full block py-2.5 text-center text-white bg-gradient-to-r from-blue-main via-gold-main to-red-main rounded-xl font-bold text-xs transition-opacity hover:opacity-90 active:scale-[0.98]"
                >
                  {user ? "Go to Dashboard" : "Book CAB"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-24 px-[8%] bg-slate-950 relative" id="features">
        <div className="max-w-[600px] mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Why Choose CAB?</h2>
          <p className="text-slate-400 text-sm md:text-base">
            We provide the safest, fastest, and most comfortable transport solutions across Mogadishu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel glass-panel-hover p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-radial from-blue-light/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <div className="w-[56px] h-[56px] rounded-2xl bg-blue-light/10 border border-blue-light/20 flex items-center justify-center text-blue-light text-xl mb-6">
              <i className="fas fa-bolt"></i>
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Instant Matching</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              No more waiting on streets. Our smart match router system links you with the nearest driver within 2 minutes of request.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-radial from-green-light/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <div className="w-[56px] h-[56px] rounded-2xl bg-green-light/10 border border-green-light/20 flex items-center justify-center text-green-light text-xl mb-6">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Safety First</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Every trip is tracked via live GPS. Share trip status with your family and access our 24/7 SOS service with one click.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-radial from-gold-light/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <div className="w-[56px] h-[56px] rounded-2xl bg-gold-light/10 border border-gold-light/20 flex items-center justify-center text-gold-light text-xl mb-6">
              <i className="fas fa-wallet"></i>
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Transparent Costs</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              No surprises. You see the exact fare estimate before you book. Pay cash or top up via EVC Plus, Visa, or PayPal.
            </p>
          </div>
        </div>
      </section>

      {/* Driver Partnership Section */}
      <section className="py-20 px-[8%]" id="about">
        <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-white/5 rounded-[30px] p-8 md:p-14 flex flex-col md:flex-row justify-between items-center gap-10 shadow-2xl">
          <div className="flex-1 max-w-[550px] text-center md:text-left">
            <h2 className="text-3xl font-extrabold text-white mb-4">Drive With CAB</h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-6">
              Become a CAB partner driver and start earning on your own terms. Set your schedule, take passenger bookings, and withdraw your earnings directly to your mobile money account daily.
            </p>
            <button
              onClick={() => alert("Driver portal registration mock active. Join as passenger for now!")}
              className="px-6 py-3 rounded-xl font-bold gradient-btn text-white shadow-md shadow-blue-light/10 flex items-center gap-2 mx-auto md:mx-0"
            >
              <i className="fas fa-car text-sm"></i> Start Driving
            </button>
          </div>
          <div className="hidden md:block text-slate-100/10 text-9xl">
            <i className="fas fa-taxi"></i>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/5 py-16 px-[8%]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-widest text-white">
              <i className="fas fa-taxi gradient-text"></i> CAB
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-[240px]">
              Somalia's premium taxi booking Single Page Web Application. Simple, fast, safe.
            </p>
            <div className="flex gap-3 mt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/5 text-slate-400 flex items-center justify-center transition-colors hover:bg-gradient-to-r hover:from-blue-main hover:to-red-main hover:text-white"><i className="fab fa-facebook-f text-sm"></i></a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/5 text-slate-400 flex items-center justify-center transition-colors hover:bg-gradient-to-r hover:from-blue-main hover:to-red-main hover:text-white"><i className="fab fa-twitter text-sm"></i></a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/5 text-slate-400 flex items-center justify-center transition-colors hover:bg-gradient-to-r hover:from-blue-main hover:to-red-main hover:text-white"><i className="fab fa-instagram text-sm"></i></a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/5 text-slate-400 flex items-center justify-center transition-colors hover:bg-gradient-to-r hover:from-blue-main hover:to-red-main hover:text-white"><i className="fab fa-linkedin-in text-sm"></i></a>
            </div>
          </div>
          <div>
            <h4 className="text-white text-sm font-bold mb-5">Company</h4>
            <ul className="flex flex-col gap-3 text-xs text-slate-400 list-none">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press Kit</a></li>
              <li><a href="#" className="hover:text-white transition-colors">CAB Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-bold mb-5">Services</h4>
            <ul className="flex flex-col gap-3 text-xs text-slate-400 list-none">
              <li><a href="#" className="hover:text-white transition-colors">Book a Ride</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Drive with Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Enterprise Solutions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cities Served</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-bold mb-5">Support</h4>
            <ul className="flex flex-col gap-3 text-xs text-slate-400 list-none">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Safety Guidelines</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; 2026 CAB Taxi booking platform. All rights reserved.</p>
          <p>Designed with ❤ for Mogadishu</p>
        </div>
      </footer>
    </div>
  );
}
