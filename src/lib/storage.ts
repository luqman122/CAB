// Next.js client-safe localStorage data layer & default data seeding

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  rating: string;
}

export interface RideRecord {
  id: string;
  driver: string;
  car: string;
  plate: string;
  from: string;
  to: string;
  date: string;
  time: string;
  amount: number;
  status: 'completed' | 'cancelled' | 'upcoming';
  rating: number | null;
  icon: string;
  cancelReason?: string;
}

export interface WalletTransaction {
  id: string;
  desc: string;
  type: 'topup' | 'ride' | 'cashback';
  amount: number;
  date: string;
  time: string;
  status: 'success' | 'failed' | 'pending';
}

export interface SystemNotification {
  id: string;
  title: string;
  text: string;
  time: string;
  read: boolean;
  type: 'ride' | 'wallet' | 'promo' | 'achievement' | 'security';
}

export interface SavedPlace {
  id: string;
  name: string;
  address: string;
  icon: string;
  type: 'home' | 'work' | 'airport' | 'hospital' | 'mall' | 'beach' | 'other';
}

export interface PaymentMethod {
  id: string;
  type: string;
  details: string;
  isDefault: boolean;
  icon: string;
}

export interface ScheduledRide {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  vehicle: string;
  price: string;
  status: string;
}

export interface ChatMessage {
  sender: 'user' | 'received';
  text: string;
  time: string;
}

export interface ChatChannels {
  driver: ChatMessage[];
  support: ChatMessage[];
  system: ChatMessage[];
}

// Client-safe localstorage getter/setter
export const safeStorage = {
  getItem(key: string, defaultValue = ''): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key) || defaultValue;
    }
    return defaultValue;
  },
  setItem(key: string, value: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  },
  removeItem(key: string): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  }
}
export const storage = safeStorage;

// Seed default datasets if missing
export const seedDefaultData = () => {
  if (typeof window === 'undefined') return;

  // 1. Seed user profile if cached login doesn't exist
  if (!localStorage.getItem('cab_user')) {
    const defaultUser: UserProfile = {
      name: 'Ahmed Luqman',
      email: 'ahmed.luqman@email.com',
      phone: '612345678',
      avatar: 'AL',
      rating: '4.9'
    };
    localStorage.setItem('cab_user', JSON.stringify(defaultUser));
  }

  // 2. Rides
  if (!localStorage.getItem('cab_rides')) {
    const defaultRides: RideRecord[] = [
      { id: 'R101', driver: 'Mohamed Hassan', car: 'Toyota Corolla (Silver)', plate: 'ABC-1234', from: 'KM4 Junction, Mogadishu', to: 'Hamar-Weyne District', date: 'June 20, 2026', time: '14:30', amount: 6.72, status: 'completed', rating: 5, icon: 'fa-car' },
      { id: 'R102', driver: 'Abdi Rahman', car: 'Hyundai Elantra (White)', plate: 'XYZ-5678', from: 'Hodan District, Mogadishu', to: 'Aden Abdulle Airport', date: 'June 18, 2026', time: '09:15', amount: 12.50, status: 'completed', rating: 4, icon: 'fa-taxi' },
      { id: 'R103', driver: 'Guled Ali', car: 'Kia Optima (Black)', plate: 'KLA-9012', from: 'Martini Hospital, Mogadishu', to: 'KM4 Junction, Mogadishu', date: 'June 15, 2026', time: '18:45', amount: 5.20, status: 'completed', rating: 5, icon: 'fa-car-side' },
      { id: 'R104', driver: 'Farah Ahmed', car: 'Suzuki Alto (Blue)', plate: 'SZK-3456', from: 'Bondhere, Mogadishu', to: 'Hamar-Weyne District', date: 'June 10, 2026', time: '11:00', amount: 4.80, status: 'completed', rating: 3, icon: 'fa-taxi' },
      { id: 'R105', driver: 'Hassan Yusuf', car: 'Toyota Prius (Eco Green)', plate: 'PRS-7890', from: 'Mogadishu Mall, Mogadishu', to: 'Hodan District', date: 'June 08, 2026', time: '15:20', amount: 7.20, status: 'cancelled', rating: null, icon: 'fa-leaf' },
      { id: 'R106', driver: 'Mohamed Hassan', car: 'Toyota Corolla (Silver)', plate: 'ABC-1234', from: 'Hodan District, Mogadishu', to: 'Martini Hospital', date: 'June 03, 2026', time: '08:00', amount: 6.72, status: 'completed', rating: 5, icon: 'fa-car' }
    ];
    localStorage.setItem('cab_rides', JSON.stringify(defaultRides));
  }

  // 3. Transactions
  if (!localStorage.getItem('cab_transactions')) {
    const defaultTxns: WalletTransaction[] = [
      { id: 'T201', desc: 'Wallet Top-up (Visa)', type: 'topup', amount: 50.00, date: 'June 20, 2026', time: '12:00', status: 'success' },
      { id: 'T202', desc: 'Ride payment (R101)', type: 'ride', amount: -6.72, date: 'June 20, 2026', time: '14:48', status: 'success' },
      { id: 'T203', desc: 'Cashback reward', type: 'cashback', amount: 1.50, date: 'June 20, 2026', time: '14:50', status: 'success' },
      { id: 'T204', desc: 'Ride payment (R102)', type: 'ride', amount: -12.50, date: 'June 18, 2026', time: '09:45', status: 'success' },
      { id: 'T205', desc: 'Wallet Top-up (Mobile Money)', type: 'topup', amount: 20.00, date: 'June 17, 2026', time: '10:30', status: 'success' },
      { id: 'T206', desc: 'Ride payment (R103)', type: 'ride', amount: -5.20, date: 'June 15, 2026', time: '19:10', status: 'success' },
      { id: 'T207', desc: 'Referral reward', type: 'cashback', amount: 5.00, date: 'June 12, 2026', time: '16:00', status: 'success' },
      { id: 'T208', desc: 'Ride payment (R104)', type: 'ride', amount: -4.80, date: 'June 10, 2026', time: '11:25', status: 'success' }
    ];
    localStorage.setItem('cab_transactions', JSON.stringify(defaultTxns));
  }

  // 4. Wallet Balance
  if (!localStorage.getItem('cab_wallet_balance')) {
    localStorage.setItem('cab_wallet_balance', '125.50');
  }

  // 5. Notifications
  if (!localStorage.getItem('cab_notifications')) {
    const defaultNotifs: SystemNotification[] = [
      { id: 'N301', title: 'Ride Completed', text: 'Your ride R101 with Mohamed Hassan has been successfully completed. Rate your experience!', time: '1 day ago', read: false, type: 'ride' },
      { id: 'N302', title: 'Top-up Successful', text: 'You have added $50.00 to your wallet using Visa card ending in 4242.', time: '1 day ago', read: false, type: 'wallet' },
      { id: 'N303', title: 'Special Promo Added', text: 'Use promo code SAVE30 to get 30% off your next 3 rides!', time: '2 days ago', read: false, type: 'promo' },
      { id: 'N304', title: 'New Achievement unlocked!', text: 'Congratulations! You earned the "5-Star Rider" badge.', time: '3 days ago', read: true, type: 'achievement' },
      { id: 'N305', title: 'System Security Update', text: 'We have upgraded security measures. Set up biometric login in settings.', time: '4 days ago', read: true, type: 'security' }
    ];
    localStorage.setItem('cab_notifications', JSON.stringify(defaultNotifs));
  }

  // 6. Saved Places
  if (!localStorage.getItem('cab_saved_places')) {
    const defaultPlaces: SavedPlace[] = [
      { id: 'SP1', name: 'Home', address: 'Hodan, Mogadishu', icon: 'fa-home', type: 'home' },
      { id: 'SP2', name: 'Work', address: 'Hamar-Weyne, Mogadishu', icon: 'fa-briefcase', type: 'work' },
      { id: 'SP3', name: 'Airport', address: 'Aden Abdulle International Airport', icon: 'fa-plane', type: 'airport' },
      { id: 'SP4', name: 'Martini Hospital', address: 'Martini Hospital, Mogadishu', icon: 'fa-hospital', type: 'hospital' },
      { id: 'SP5', name: 'Mogadishu Mall', address: 'KM4 Mogadishu Mall', icon: 'fa-shopping-bag', type: 'mall' },
      { id: 'SP6', name: 'Beach House', address: 'Lido Beach, Mogadishu', icon: 'fa-umbrella-beach', type: 'beach' }
    ];
    localStorage.setItem('cab_saved_places', JSON.stringify(defaultPlaces));
  }

  // 7. Payment Methods
  if (!localStorage.getItem('cab_payment_methods')) {
    const defaultMethods: PaymentMethod[] = [
      { id: 'PM1', type: 'Visa', details: 'ending in 4242', isDefault: true, icon: 'fa-credit-card' },
      { id: 'PM2', type: 'Mobile Money', details: 'EVC Plus (612345678)', isDefault: false, icon: 'fa-mobile-alt' },
      { id: 'PM3', type: 'PayPal', details: 'ahmed.luqman@email.com', isDefault: false, icon: 'fab fa-paypal' }
    ];
    localStorage.setItem('cab_payment_methods', JSON.stringify(defaultMethods));
  }

  // 8. Scheduled Rides
  if (!localStorage.getItem('cab_scheduled_rides')) {
    const defaultScheduled: ScheduledRide[] = [
      { id: 'S401', from: 'Home - Hodan, Mogadishu', to: 'Aden Abdulle Airport', date: '2026-06-25', time: '08:00 AM', vehicle: 'Comfort', price: '$12.50', status: 'pending' }
    ];
    localStorage.setItem('cab_scheduled_rides', JSON.stringify(defaultScheduled));
  }

  // 9. Chat Messages history
  if (!localStorage.getItem('cab_chat_history')) {
    const defaultChat: ChatChannels = {
      driver: [
        { sender: 'received', text: "Hello! I am your driver Mohamed Hassan. I'm heading to your pickup location now.", time: '14:20' },
        { sender: 'user', text: 'Hi! Perfect, I will wait for you outside.', time: '14:22' },
        { sender: 'received', text: 'Traffic is a bit heavy near KM4, but I should arrive in about 5 minutes.', time: '14:23' }
      ],
      support: [
        { sender: 'received', text: 'Welcome to CAB Customer Support. How can we help you today?', time: 'Yesterday' },
        { sender: 'user', text: 'Can I link multiple mobile numbers to one wallet?', time: 'Yesterday' },
        { sender: 'received', text: 'Currently, you can only link one primary phone number for Hormuud EVC Plus cashouts. Let us know if you need help updating it.', time: 'Yesterday' }
      ],
      system: [
        { sender: 'received', text: 'Welcome to CAB! Your account has been successfully created.', time: 'June 01' },
        { sender: 'received', text: 'Verify your email address in settings to secure your taxi wallet balance.', time: 'June 01' }
      ]
    };
    localStorage.setItem('cab_chat_history', JSON.stringify(defaultChat));
  }
};
