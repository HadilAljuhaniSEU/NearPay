export const mockMerchant = {
  id: "m1",
  name: "متجر أبو خالد",
  englishName: "Abu Khalid Store",
  category: "grocery",
  balance: 12450,
  activeCustomers: 48,
  thisMonth: 3200,
  overdue: 1890,
  rating: 4.8,
};

export const mockCustomers = [
  { id: "c1", name: "Khalid Al-Saud", phone: "+966 50 123 4567", totalDebt: 450, debtCount: 2, risk: "low" as const, avatar: "KS", trustScore: 92 },
  { id: "c2", name: "Mohammed Al-Rashid", phone: "+966 55 987 6543", totalDebt: 1250, debtCount: 4, risk: "high" as const, avatar: "MR", trustScore: 41 },
  { id: "c3", name: "Fatima Al-Ghamdi", phone: "+966 54 456 7890", totalDebt: 850, debtCount: 3, risk: "medium" as const, avatar: "FA", trustScore: 68 },
  { id: "c4", name: "Abdullah Al-Fahad", phone: "+966 56 321 0987", totalDebt: 150, debtCount: 1, risk: "low" as const, avatar: "AA", trustScore: 85 }
];

export const mockDebts = [
  { id: "d1", customerId: "c1", amount: 200, date: "2024-10-15", dueDate: "2024-11-15", status: "pending", category: "grocery", notes: "Weekly groceries" },
  { id: "d2", customerId: "c2", amount: 1250, date: "2024-09-01", dueDate: "2024-10-01", status: "overdue", category: "electronics", notes: "New phone accessories" },
  { id: "d3", customerId: "c3", amount: 850, date: "2024-10-05", dueDate: "2024-11-05", status: "pending", category: "clothing", notes: "Winter jackets" },
  { id: "d4", customerId: "c1", amount: 250, date: "2024-10-10", dueDate: "2024-10-25", status: "pending", category: "grocery", notes: "More groceries" },
  { id: "d5", customerId: "c4", amount: 150, date: "2024-10-12", dueDate: "2024-10-26", status: "settled", category: "pharmacy", notes: "Medicines" },
];

export const mockTransactions = [
  { id: "t1", date: "2024-10-10", merchantName: "Abu Khalid Store", amount: 150, method: "Apple Pay", status: "paid" as const },
  { id: "t2", date: "2024-10-12", merchantName: "Riyadh Roasters", amount: 45, method: "Mada", status: "paid" as const },
  { id: "t3", date: "2024-10-15", merchantName: "Abu Khalid Store", amount: 200, method: "Credit Tab", status: "pending" as const },
];

export const mockNearbyMerchants = [
  { id: "n1", name: "Riyadh Roasters", category: "Cafe", distance: 0.2, rating: 4.9, verified: true, isOpen: true, avatar: "RR", phone: "+966501234567", address: "King Fahd Road, Riyadh" },
  { id: "n2", name: "Al-Noor Pharmacy", category: "Pharmacy", distance: 0.5, rating: 4.6, verified: true, isOpen: true, avatar: "AN", phone: "+966559876543", address: "Olaya Street, Riyadh" },
  { id: "n3", name: "Kingdom Electronics", category: "Electronics", distance: 1.2, rating: 4.5, verified: false, isOpen: false, avatar: "KE", phone: "+966541234567", address: "Tahlia Street, Riyadh" },
  { id: "n4", name: "Najd Supermarket", category: "Grocery", distance: 0.8, rating: 4.7, verified: true, isOpen: true, avatar: "NS", phone: "+966563210987", address: "Prince Mohammed Road, Riyadh" },
];

export const mockCustomerProfile = {
  name: "Khalid Al-Saud",
  phone: "+966 50 123 4567",
  score: 87,
  totalOwed: 450,
  avatar: "KS"
};
