export interface Customer {
  id: string;
  name: string;
  nameEn: string;
  phone: string;
  totalDebt: number;
  debtCount: number;
  risk: 'low' | 'medium' | 'high';
  initials: string;
}

export interface Debt {
  id: string;
  customerId: string;
  customerName: string;
  merchantName: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'overdue' | 'settled';
  category: string;
  categoryIcon: string;
  createdAt: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  type: 'payment' | 'debt';
  customerName: string;
  merchantName: string;
  amount: number;
  date: string;
  method?: string;
}

export interface NearbyMerchant {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  categoryIcon: string;
  rating: number;
  distance: string;
  verified: boolean;
  totalDebt?: number;
}

export const MERCHANT = {
  id: '1',
  name: 'متجر أبو خالد',
  nameEn: 'Abu Khalid Store',
  category: 'Grocery',
  city: 'Riyadh',
  phone: '+966 50 111 2222',
  totalCustomers: 48,
  totalReceivables: 12450,
  thisMonth: 3200,
  overdue: 1890,
  settled: 8760,
};

export const CUSTOMER_PROFILE = {
  id: 'c1',
  name: 'خالد السعود',
  nameEn: 'Khalid Al-Saud',
  phone: '+966 50 123 4567',
  email: 'khalid@example.com',
  nearPayScore: 87,
  totalOwed: 1100,
  paidOnTime: 12,
  overdueCount: 1,
  memberSince: 'March 2024',
};

export const CUSTOMERS: Customer[] = [
  { id: '1', name: 'خالد السعود', nameEn: 'Khalid Al-Saud', phone: '+966 50 123 4567', totalDebt: 1450, debtCount: 3, risk: 'medium', initials: 'KA' },
  { id: '2', name: 'محمد الرشيد', nameEn: 'Mohammed Al-Rashid', phone: '+966 55 234 5678', totalDebt: 2800, debtCount: 5, risk: 'high', initials: 'MR' },
  { id: '3', name: 'فاطمة الغامدي', nameEn: 'Fatima Al-Ghamdi', phone: '+966 54 345 6789', totalDebt: 350, debtCount: 1, risk: 'low', initials: 'FG' },
  { id: '4', name: 'عمر الزهراني', nameEn: 'Omar Al-Zahrani', phone: '+966 56 456 7890', totalDebt: 950, debtCount: 2, risk: 'low', initials: 'OZ' },
  { id: '5', name: 'نورة الشهري', nameEn: 'Nora Al-Shehri', phone: '+966 50 567 8901', totalDebt: 4200, debtCount: 7, risk: 'high', initials: 'NS' },
  { id: '6', name: 'عبدالله القحطاني', nameEn: 'Abdullah Al-Qahtani', phone: '+966 59 678 9012', totalDebt: 700, debtCount: 2, risk: 'medium', initials: 'AQ' },
];

export const DEBTS: Debt[] = [
  { id: '1', customerId: '1', customerName: 'خالد السعود', merchantName: 'متجر أبو خالد', amount: 450, dueDate: 'Dec 15, 2024', status: 'pending', category: 'Grocery', categoryIcon: 'shopping-bag', createdAt: 'Nov 1, 2024', notes: 'Weekly groceries' },
  { id: '2', customerId: '1', customerName: 'خالد السعود', merchantName: 'متجر أبو خالد', amount: 650, dueDate: 'Nov 20, 2024', status: 'overdue', category: 'Grocery', categoryIcon: 'shopping-bag', createdAt: 'Oct 20, 2024' },
  { id: '3', customerId: '2', customerName: 'محمد الرشيد', merchantName: 'متجر أبو خالد', amount: 1200, dueDate: 'Dec 1, 2024', status: 'overdue', category: 'Electronics', categoryIcon: 'cpu', createdAt: 'Oct 15, 2024' },
  { id: '4', customerId: '3', customerName: 'فاطمة الغامدي', merchantName: 'متجر أبو خالد', amount: 350, dueDate: 'Dec 20, 2024', status: 'pending', category: 'Clothing', categoryIcon: 'tag', createdAt: 'Nov 10, 2024' },
  { id: '5', customerId: '4', customerName: 'عمر الزهراني', merchantName: 'متجر أبو خالد', amount: 950, dueDate: 'Dec 10, 2024', status: 'pending', category: 'Pharmacy', categoryIcon: 'activity', createdAt: 'Nov 5, 2024' },
  { id: '6', customerId: '5', customerName: 'نورة الشهري', merchantName: 'متجر أبو خالد', amount: 2100, dueDate: 'Nov 28, 2024', status: 'overdue', category: 'Grocery', categoryIcon: 'shopping-bag', createdAt: 'Oct 28, 2024' },
  { id: '7', customerId: '2', customerName: 'محمد الرشيد', merchantName: 'متجر أبو خالد', amount: 800, dueDate: 'Dec 5, 2024', status: 'pending', category: 'Grocery', categoryIcon: 'shopping-bag', createdAt: 'Nov 8, 2024' },
  { id: '8', customerId: '6', customerName: 'عبدالله القحطاني', merchantName: 'متجر أبو خالد', amount: 700, dueDate: 'Dec 18, 2024', status: 'settled', category: 'Grocery', categoryIcon: 'shopping-bag', createdAt: 'Nov 2, 2024' },
];

export const TRANSACTIONS: Transaction[] = [
  { id: '1', type: 'payment', customerName: 'خالد السعود', merchantName: 'متجر أبو خالد', amount: 300, date: 'Nov 15', method: 'Apple Pay' },
  { id: '2', type: 'payment', customerName: 'عبدالله القحطاني', merchantName: 'متجر أبو خالد', amount: 700, date: 'Nov 14', method: 'STC Pay' },
  { id: '3', type: 'debt', customerName: 'نورة الشهري', merchantName: 'متجر أبو خالد', amount: 2100, date: 'Nov 13' },
  { id: '4', type: 'payment', customerName: 'عمر الزهراني', merchantName: 'متجر أبو خالد', amount: 450, date: 'Nov 12', method: 'Cash' },
  { id: '5', type: 'debt', customerName: 'محمد الرشيد', merchantName: 'متجر أبو خالد', amount: 800, date: 'Nov 11' },
];

export const NEARBY_MERCHANTS: NearbyMerchant[] = [
  { id: '2', name: 'مخبزة الريف', nameEn: 'Al-Reef Bakery', category: 'Bakery', categoryIcon: 'coffee', rating: 4.6, distance: '0.3 km', verified: true },
  { id: '3', name: 'صيدلية النور', nameEn: 'Al-Nour Pharmacy', category: 'Pharmacy', categoryIcon: 'activity', rating: 4.9, distance: '0.5 km', verified: true, totalDebt: 850 },
  { id: '4', name: 'إلكترونيات الوليد', nameEn: 'Al-Waleed Electronics', category: 'Electronics', categoryIcon: 'cpu', rating: 4.4, distance: '0.8 km', verified: false },
  { id: '5', name: 'ملابس أناقة', nameEn: 'Anaqah Fashion', category: 'Clothing', categoryIcon: 'tag', rating: 4.7, distance: '1.1 km', verified: true, totalDebt: 350 },
  { id: '6', name: 'مطعم البيت', nameEn: 'Al-Bayt Restaurant', category: 'Restaurant', categoryIcon: 'coffee', rating: 4.8, distance: '1.4 km', verified: true },
];

export const WEEKLY_COLLECTIONS = [
  { day: 'Sat', amount: 850 },
  { day: 'Sun', amount: 1200 },
  { day: 'Mon', amount: 650 },
  { day: 'Tue', amount: 1800 },
  { day: 'Wed', amount: 950 },
  { day: 'Thu', amount: 2100 },
  { day: 'Fri', amount: 450 },
];

export const AI_RESPONSES: Record<string, string> = {
  'Who owes the most?': 'محمد الرشيد owes the most — SAR 2,800 across 5 debts. 2 of them are already overdue. I recommend sending a WhatsApp reminder today.',
  'Collection summary': 'You\'ve collected SAR 3,200 this month, which is 78% of your SAR 4,100 target. Thursday was your best collection day with SAR 2,100 received.',
  'Overdue alerts': '3 customers have overdue debts totaling SAR 4,240:\n• محمد الرشيد — SAR 1,200 (overdue 14 days)\n• نورة الشهري — SAR 2,100 (overdue 6 days)\n• خالد السعود — SAR 650 (overdue 4 days)',
  'Best time to collect': 'Based on your payment history, Thursday and Tuesday afternoons (3–6 PM) have the highest success rates. I recommend sending reminders on Tuesday mornings for best results.',
};
