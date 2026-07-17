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
  // Core registration (doc stored at merchants/{uid})
  uid: string;
  businessName: string;
  commercialRegistration: string;
  ownerName: string;
  email: string;
  phone: string;
  role: 'merchant';
  status: 'active' | 'suspended';
  language: 'en' | 'ar';
  trustScore: number;   // 0–100, starts at 100
  createdAt: Timestamp;
  // Aggregate / operational fields (default 0)
  totalOutstanding: number;
  totalCollected: number;
  customerCount: number;
  // Legacy compat aliases used by existing pages
  name: string;         // = businessName
  ownerId: string;      // = uid
  // Optional
  logoUrl?: string;
  address?: string;
  city?: string;
  updatedAt?: Timestamp;
  // ── Geo / Discovery fields ──────────────────────────────────────────────────
  latitude?: number;
  longitude?: number;
  businessType?: string;
  whatsapp?: string;
  isVisible?: boolean;
  workingHours?: { open: string; close: string }; // "HH:MM" 24-h
  description?: string;
  // Future-prep (architecture only, not yet implemented):
  // featured?: boolean;
  // sponsored?: boolean;
  // verificationStatus?: 'unverified' | 'pending' | 'verified';
}

// ─── Discoverable Merchant (with computed distance) ───────────────────────────
export interface DiscoverableMerchant extends MerchantDoc {
  /** Kilometres from user, computed client-side; undefined when coords unknown. */
  distance?: number;
}

// ─── Customer Auth ────────────────────────────────────────────────────────────
export interface CustomerAuthDoc {
  uid: string;
  phone: string;
  displayName: string;
  createdAt: Timestamp;
  preferredLanguage: 'en' | 'ar';
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
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'disputed';
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
  // Extended fields
  merchantName?: string;
  referenceNumber?: string;
  paymentStatus?: 'unpaid' | 'partial' | 'paid';
  approvedAt?: Timestamp;
  paidAt?: Timestamp;
  disputeReason?: string;
  disputedAt?: Timestamp;
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
