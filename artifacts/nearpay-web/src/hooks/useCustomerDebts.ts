import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { subscribeDebtsByCustomerPhone } from '../services/debtService';
import { DebtDoc } from '../types';

/**
 * Real-time hook for all debts belonging to the currently-authenticated customer.
 * Identifies the customer by their Firebase phone auth phoneNumber.
 * NOTE: The phone format stored in Firestore (customerPhone) must match the
 * E.164 format returned by Firebase phone auth (e.g. +966XXXXXXXXX).
 */
export function useCustomerDebts() {
  const [debts, setDebts]               = useState<DebtDoc[]>([]);
  const [loading, setLoading]           = useState(true);
  const [phone, setPhone]               = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [error, setError]               = useState<string | null>(null);

  // Watch auth state to get customer phone
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setPhone(user?.phoneNumber ?? null);
    });
    return unsub;
  }, []);

  // Subscribe to debts once we have the phone
  useEffect(() => {
    if (phone === null) return; // still resolving auth
    if (!phone) { setLoading(false); return; }

    setLoading(true);
    setError(null);

    const unsub = subscribeDebtsByCustomerPhone(
      phone,
      (data) => {
        setDebts(data);
        if (data.length > 0 && !customerName) {
          setCustomerName(data[0].customerName);
        }
        setLoading(false);
      },
      (err) => {
        console.error('[useCustomerDebts] subscription error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsub;
  }, [phone]);

  return { debts, loading, phone, customerName, error };
}
