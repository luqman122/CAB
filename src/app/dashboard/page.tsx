"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  safeStorage,
  seedDefaultData,
  UserProfile,
  SavedPlace,
  RideRecord,
  WalletTransaction,
  SystemNotification,
  PaymentMethod,
  ScheduledRide
} from "@/lib/storage";

// UI Components
import Sidebar from "@/components/ui/Sidebar";
import BottomNav from "@/components/ui/BottomNav";
import Header from "@/components/ui/Header";
import Toast from "@/components/ui/Toast";

// Dashboard Tabs Components
import DashboardHome from "@/components/dashboard/DashboardHome";
import BookRide from "@/components/dashboard/BookRide";
import LiveMap from "@/components/dashboard/LiveMap";
import RideHistory from "@/components/dashboard/RideHistory";
import ScheduledTrips from "@/components/dashboard/ScheduledTrips";
import Wallet from "@/components/dashboard/Wallet";
import Payments from "@/components/dashboard/Payments";
import Rewards from "@/components/dashboard/Rewards";
import Promotions from "@/components/dashboard/Promotions";
import Notifications from "@/components/dashboard/Notifications";
import Messages from "@/components/dashboard/Messages";
import Favorites from "@/components/dashboard/Favorites";
import SavedPlaces from "@/components/dashboard/SavedPlaces";
import Profile from "@/components/dashboard/Profile";
import Settings from "@/components/dashboard/Settings";
import Help from "@/components/dashboard/Help";

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Navigation & Shell states
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Synchronized Data States
  const [walletBalance, setWalletBalance] = useState(125.50);
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [unreadMsgs] = useState(2); // Mock unread messages count
  
  // Sub-components states
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [rides, setRides] = useState<RideRecord[]>([]);
  const [scheduledRides, setScheduledRides] = useState<ScheduledRide[]>([]);
  const [activeRide, setActiveRide] = useState<any>(null);

  // Global Toast Alert
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "warning" | "info" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" | "warning" | "info") => {
    setToast({ msg, type });
  };

  // Run on mount to initialize data
  useEffect(() => {
    setMounted(true);
    
    // Seed default data first
    seedDefaultData();

    // Protect route: redirect to login if no authenticated user
    const cachedUserStr = safeStorage.getItem("cab_user");
    if (!cachedUserStr) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(cachedUserStr));

    // Sync wallet balance
    const balance = safeStorage.getItem("cab_wallet_balance");
    if (balance) {
      setWalletBalance(parseFloat(balance));
    }

    // Sync saved places
    const placesStr = safeStorage.getItem("cab_saved_places");
    if (placesStr) {
      setSavedPlaces(JSON.parse(placesStr));
    }

    // Sync transactions
    const txnsStr = safeStorage.getItem("cab_transactions");
    if (txnsStr) {
      setTransactions(JSON.parse(txnsStr));
    }

    // Sync payment methods
    const pmStr = safeStorage.getItem("cab_payment_methods");
    if (pmStr) {
      setPaymentMethods(JSON.parse(pmStr));
    }

    // Sync rides history
    const ridesStr = safeStorage.getItem("cab_rides");
    if (ridesStr) {
      setRides(JSON.parse(ridesStr));
    }

    // Sync scheduled rides
    const scheduledStr = safeStorage.getItem("cab_scheduled_rides");
    if (scheduledStr) {
      setScheduledRides(JSON.parse(scheduledStr));
    }

    updateUnreadNotificationsCount();
  }, [router]);

  const updateUnreadNotificationsCount = () => {
    const notifsStr = safeStorage.getItem("cab_notifications");
    if (notifsStr) {
      const notifs = JSON.parse(notifsStr) as SystemNotification[];
      const unread = notifs.filter((n) => !n.read).length;
      setUnreadNotifs(unread);
    }
  };

  // Sync user updates from Profile
  const handleProfileRefresh = () => {
    const cachedUserStr = safeStorage.getItem("cab_user");
    if (cachedUserStr) {
      setUser(JSON.parse(cachedUserStr));
    }
  };

  // Sync wallet balance
  const syncWalletBalance = (newBalance: number) => {
    setWalletBalance(newBalance);
    safeStorage.setItem("cab_wallet_balance", newBalance.toFixed(2));
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    safeStorage.removeItem("cab_user");
    router.push("/login");
  };

  // Triggered from BookRide when user submits a booking request
  const handleBookRideSuccess = (bookingDetails: any) => {
    setActiveRide(bookingDetails);
    setActiveTab("map");
  };

  // Triggered from Favorites/SavedPlaces when user clicks a book/ride suggestion
  const handleBookRideWithDestination = (destination: string) => {
    setActiveTab("book-ride");
    // Pre-populate input in destination fields (simulated via local storage or custom window props)
    setTimeout(() => {
      const destInput = document.querySelector('input[placeholder="Halkaad u socotaa?"]') as HTMLInputElement;
      if (destInput) {
        destInput.value = destination;
        const event = new Event("input", { bubbles: true });
        destInput.dispatchEvent(event);
      }
    }, 100);
  };

  // Wallet Funding handler
  const handleFundWallet = (amount: number, method: string) => {
    const nextBalance = walletBalance + amount;
    syncWalletBalance(nextBalance);

    // Add top-up transaction
    const newTxn: WalletTransaction = {
      id: `T${200 + transactions.length + 1}`,
      desc: `Wallet Top-up (${method})`,
      type: "topup",
      amount: amount,
      date: "Today",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "success",
    };
    const updatedTxns = [newTxn, ...transactions];
    setTransactions(updatedTxns);
    safeStorage.setItem("cab_transactions", JSON.stringify(updatedTxns));

    // Add notification
    const notifsStr = safeStorage.getItem("cab_notifications");
    const notifs = notifsStr ? JSON.parse(notifsStr) as SystemNotification[] : [];
    const newNotif: SystemNotification = {
      id: `N${300 + notifs.length + 1}`,
      title: "Wallet Funded Successfully",
      text: `Added $${amount.toFixed(2)} to your wallet balance. New Balance is $${nextBalance.toFixed(2)}.`,
      time: "Just now",
      read: false,
      type: "wallet",
    };
    safeStorage.setItem("cab_notifications", JSON.stringify([newNotif, ...notifs]));
    updateUnreadNotificationsCount();

    showToast(`Successfully deposited $${amount.toFixed(2)}!`, "success");
  };

  // Wallet Withdrawal handler
  const handleWithdrawFunds = (amount: number) => {
    const nextBalance = Math.max(0, walletBalance - amount);
    syncWalletBalance(nextBalance);

    // Add withdrawal transaction
    const newTxn: WalletTransaction = {
      id: `T${200 + transactions.length + 1}`,
      desc: "Withdrawal to bank account",
      type: "ride", // charge outflow
      amount: -amount,
      date: "Today",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "success",
    };
    const updatedTxns = [newTxn, ...transactions];
    setTransactions(updatedTxns);
    safeStorage.setItem("cab_transactions", JSON.stringify(updatedTxns));

    // Add notification
    const notifsStr = safeStorage.getItem("cab_notifications");
    const notifs = notifsStr ? JSON.parse(notifsStr) as SystemNotification[] : [];
    const newNotif: SystemNotification = {
      id: `N${300 + notifs.length + 1}`,
      title: "Withdrawal Successful",
      text: `Withdrew $${amount.toFixed(2)} from your wallet. New Balance is $${nextBalance.toFixed(2)}.`,
      time: "Just now",
      read: false,
      type: "wallet",
    };
    safeStorage.setItem("cab_notifications", JSON.stringify([newNotif, ...notifs]));
    updateUnreadNotificationsCount();
  };

  // Payment Method handlers
  const handleAddPaymentMethod = (cardNum: string) => {
    const newMethod: PaymentMethod = {
      id: `PM${paymentMethods.length + 1}`,
      type: "Visa",
      details: `ending in ${cardNum.substring(12)}`,
      isDefault: false,
      icon: "fa-credit-card",
    };
    const updated = [...paymentMethods, newMethod];
    setPaymentMethods(updated);
    safeStorage.setItem("cab_payment_methods", JSON.stringify(updated));
  };

  const handleSetPrimaryPaymentMethod = (id: string) => {
    const updated = paymentMethods.map((pm) => ({
      ...pm,
      isDefault: pm.id === id,
    }));
    setPaymentMethods(updated);
    safeStorage.setItem("cab_payment_methods", JSON.stringify(updated));
  };

  const handleRemovePaymentMethod = (id: string) => {
    const updated = paymentMethods.filter((pm) => pm.id !== id);
    setPaymentMethods(updated);
    safeStorage.setItem("cab_payment_methods", JSON.stringify(updated));
  };

  // Cancel ride simulation handler from LiveMap
  const handleCancelRide = (fee: number, reason: string) => {
    if (!activeRide) return;

    // Deduct cancellation fee
    const nextBalance = Math.max(0, walletBalance - fee);
    syncWalletBalance(nextBalance);

    // Write transaction
    const newTxn: WalletTransaction = {
      id: `T${200 + transactions.length + 1}`,
      desc: `Cancellation fee (Ride Cancelled)`,
      type: "ride",
      amount: -fee,
      date: "Today",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "success",
    };
    const updatedTxns = [newTxn, ...transactions];
    setTransactions(updatedTxns);
    safeStorage.setItem("cab_transactions", JSON.stringify(updatedTxns));

    // Save cancelled ride to history
    const newHistory: RideRecord = {
      id: `R${100 + rides.length + 1}`,
      driver: "Mohamed Hassan",
      car: `${activeRide.vehicle} (Silver)`,
      plate: "ABC-1234",
      from: activeRide.pickup,
      to: activeRide.destination,
      date: "Today",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      amount: fee,
      status: "cancelled",
      rating: null,
      icon: "fa-times-circle",
      cancelReason: reason,
    };
    const updatedRides = [newHistory, ...rides];
    setRides(updatedRides);
    safeStorage.setItem("cab_rides", JSON.stringify(updatedRides));

    // Save notification
    const notifsStr = safeStorage.getItem("cab_notifications");
    const notifs = notifsStr ? JSON.parse(notifsStr) as SystemNotification[] : [];
    const newNotif: SystemNotification = {
      id: `N${300 + notifs.length + 1}`,
      title: "Ride Cancelled",
      text: `Your ride booking was cancelled. Reason: "${reason}". Cancellation fee of $${fee.toFixed(2)} was charged.`,
      time: "Just now",
      read: false,
      type: "ride",
    };
    safeStorage.setItem("cab_notifications", JSON.stringify([newNotif, ...notifs]));
    updateUnreadNotificationsCount();

    // Reset active ride
    setActiveRide(null);
  };

  // Completion ride simulation handler from LiveMap
  const handleRideComplete = (ratingVal: number, reviewText: string) => {
    if (!activeRide) return;

    const rideAmount = activeRide.amount;

    // Deduct fare amount
    const nextBalance = Math.max(0, walletBalance - rideAmount);
    syncWalletBalance(nextBalance);

    // Write transaction
    const newTxn: WalletTransaction = {
      id: `T${200 + transactions.length + 1}`,
      desc: `Ride payment (Completed)`,
      type: "ride",
      amount: -rideAmount,
      date: "Today",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "success",
    };
    const updatedTxns = [newTxn, ...transactions];
    setTransactions(updatedTxns);
    safeStorage.setItem("cab_transactions", JSON.stringify(updatedTxns));

    // Save completed ride to history
    const newHistory: RideRecord = {
      id: `R${100 + rides.length + 1}`,
      driver: "Mohamed Hassan",
      car: `${activeRide.vehicle} (Silver)`,
      plate: "ABC-1234",
      from: activeRide.pickup,
      to: activeRide.destination,
      date: "Today",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      amount: rideAmount,
      status: "completed",
      rating: ratingVal,
      icon: "fa-car",
    };
    const updatedRides = [newHistory, ...rides];
    setRides(updatedRides);
    safeStorage.setItem("cab_rides", JSON.stringify(updatedRides));

    // Save notification
    const notifsStr = safeStorage.getItem("cab_notifications");
    const notifs = notifsStr ? JSON.parse(notifsStr) as SystemNotification[] : [];
    const newNotif: SystemNotification = {
      id: `N${300 + notifs.length + 1}`,
      title: "Ride Completed Success",
      text: `Deducted $${rideAmount.toFixed(2)} from your wallet balance. Thank you for riding with CAB!`,
      time: "Just now",
      read: false,
      type: "wallet",
    };
    safeStorage.setItem("cab_notifications", JSON.stringify([newNotif, ...notifs]));
    updateUnreadNotificationsCount();

    // Reset active ride
    setActiveRide(null);
  };

  // Cancel scheduled trip
  const handleCancelScheduled = (id: string) => {
    const updated = scheduledRides.filter((r) => r.id !== id);
    setScheduledRides(updated);
    safeStorage.setItem("cab_scheduled_rides", JSON.stringify(updated));
  };

  // Prevent SSR flicker
  if (!mounted || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <i className="fas fa-spinner animate-spin text-4xl text-blue-light"></i>
          <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">Loading CAB Portal...</span>
        </div>
      </div>
    );
  }

  // Render correct component based on activeTab
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardHome
            user={user}
            rides={rides}
            walletBalance={walletBalance}
            setActiveTab={setActiveTab}
            showToast={showToast}
          />
        );
      case "book-ride":
        return (
          <BookRide
            user={user}
            savedPlaces={savedPlaces}
            walletBalance={walletBalance}
            onBookSuccess={handleBookRideSuccess}
            showToast={showToast}
          />
        );
      case "map":
        return (
          <LiveMap
            activeRide={activeRide}
            walletBalance={walletBalance}
            onCancelRide={handleCancelRide}
            onRideComplete={handleRideComplete}
            setActiveTab={setActiveTab}
            showToast={showToast}
          />
        );
      case "history":
        return <RideHistory rides={rides} showToast={showToast} />;
      case "scheduled":
        return (
          <ScheduledTrips
            scheduledRides={scheduledRides}
            onCancelScheduled={handleCancelScheduled}
            showToast={showToast}
          />
        );
      case "wallet":
        return (
          <Wallet
            walletBalance={walletBalance}
            transactions={transactions}
            paymentMethods={paymentMethods}
            onFundWallet={handleFundWallet}
            onWithdrawFunds={handleWithdrawFunds}
            showToast={showToast}
          />
        );
      case "payments":
        return (
          <Payments
            paymentMethods={paymentMethods}
            onAddPaymentMethod={handleAddPaymentMethod}
            onSetPrimaryPaymentMethod={handleSetPrimaryPaymentMethod}
            onRemovePaymentMethod={handleRemovePaymentMethod}
            showToast={showToast}
          />
        );
      case "rewards":
        return <Rewards />;
      case "promotions":
        return <Promotions />;
      case "notifications":
        return <Notifications />;
      case "messages":
        return <Messages />;
      case "favorites":
        return <Favorites onBookRideWithDestination={handleBookRideWithDestination} />;
      case "saved-places":
        return <SavedPlaces onBookRideWithDestination={handleBookRideWithDestination} />;
      case "profile":
        return <Profile onProfileUpdate={handleProfileRefresh} />;
      case "settings":
        return <Settings />;
      case "help":
        return <Help onNavigateToMessages={() => setActiveTab("messages")} />;
      default:
        return (
          <DashboardHome
            user={user}
            rides={rides}
            walletBalance={walletBalance}
            setActiveTab={setActiveTab}
            showToast={showToast}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 flex font-poppins relative">
      {/* Toast Alert */}
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Sidebar - Desktop & Mobile overlay */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        unreadNotifs={unreadNotifs}
        unreadMsgs={unreadMsgs}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col md:ml-[260px] min-w-0">
        {/* Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          unreadNotifs={unreadNotifs}
          unreadMsgs={unreadMsgs}
          onHamburgerClick={() => setSidebarOpen(true)}
          onLogout={handleLogout}
        />

        {/* Dynamic SPA Page Content */}
        <main className="flex-1 pt-[90px] px-6 pb-24 md:pb-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Sticky Bottom Navigation Menu */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
