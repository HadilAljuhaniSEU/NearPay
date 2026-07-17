import { Timestamp } from 'firebase/firestore';

// ─── User ────────────────────────────────────────────────────────────────────
export interface UserDoc {
  uid: string;
  email: string;
  role: 'merchant' | 'admin';
  merchantId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Merchant ────────────────────────────────────────────────────────────────
export interface MerchantDoc {
  id: string;
  // Registration fields
  merchantId: string;         // same as Firestore doc id / Firebase UID
  ownerName: string;
  storeName: string;
  commercialRegistration: string;
  businessType: string;
  city: string;
  phone: string;
  email: string;
  // Legacy / aggregated
  name: string;               // kept for backward compat (= storeName)
  category: string;           // kept for backward compat (= businessType)
  address: string;
  logoUrl?: string;
  totalOutstanding: number;
  totalCollected: number;
  customerCount: number;
  ownerId: string;            // Firebase Auth UID
  // Onboarding status
  status: 'pending' | 'active' | 'suspended';
  verified: boolean;
  trustScore: number;         // 0–100
  location: { lat: number; lng: number } | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Branch ──────────────────────────────────────────────────────────────────
export interface BranchDoc {
  id: string;
  merchantId: string;
  name: string;
  address: string;
  phone?: string;
  createdAt: Timestamp;
}

// ─── Customer ────────────────────────────────────────────────────────────────
export interface CustomerDoc {
  id: string;
  merchantId: string;
  fullName: string;
  phone: string;
  email?: string;
  trustScore: number;       // 0–100
  totalDebt: number;
  totalPaid: number;
  avatarUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Debt ────────────────────────────────────────────────────────────────────
export type DebtStatus = 'pending' | 'active' | 'overdue' | 'settled' | 'rejected';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type PaymentType = 'full' | 'installment' | 'flexible';

export interface DebtDoc {
  id: string;
  merchantId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  remainingAmount: number;
  description: string;
  status: DebtStatus;
  paymentType: PaymentType;
  dueDate: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  approvalStatus: ApprovalStatus;
  approvalToken: string;    // UUID — used in public approval link
  paymentToken: string;     // UUID — used in public payment link
}

// ─── Payment ─────────────────────────────────────────────────────────────────
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'cash' | 'card' | 'stcpay' | 'bank_transfer' | 'link';

export interface PaymentDoc {
  id: string;
  debtId: string;
  merchantId: string;
  customerId: string;
  amount: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: Timestamp;
}

// ─── Trust Score ─────────────────────────────────────────────────────────────
export interface TrustScoreDoc {
  customerId: string;
  merchantId: string;
  score: number;
  factors: {
    onTimePayments: number;
    totalPaid: number;
    debtCount: number;
  };
  updatedAt: Timestamp;
}

// ─── Analytics ───────────────────────────────────────────────────────────────
export interface AnalyticsDoc {
  merchantId: string;
  period: string; // 'YYYY-MM'
  totalDebts: number;
  totalCollected: number;
  newCustomers: number;
  settledDebts: number;
  overdueDebts: number;
  updatedAt: Timestamp;
}

// ─── Notification ────────────────────────────────────────────────────────────
// Reserved for FCM integration
export interface NotificationDoc {
  id: string;
  merchantId: string;
  customerId?: string;
  title: string;
  body: string;
  type: 'debt_approved' | 'debt_rejected' | 'payment_received' | 'debt_overdue';
  read: boolean;
  createdAt: Timestamp;
}

// ─── Merchant Settings ───────────────────────────────────────────────────────
export interface MerchantSettingsDoc {
  merchantId: string;
  notifyOnApproval: boolean;
  notifyOnPayment: boolean;
  notifyOnOverdue: boolean;
  defaultDueDays: number;
  defaultPaymentType: PaymentType;
  currency: string;
  language: 'ar' | 'en';
  updatedAt: Timestamp;
}

// ─── Utility types ───────────────────────────────────────────────────────────
/** Shape returned after Firestore reads — id always present */
export type WithId<T> = T & { id: string };

/** Public link params decoded from a token URL */
export interface DebtTokenPayload {
  debtId: string;
  merchantId: string;
  customerId: string;
  type: 'approval' | 'payment';
}
