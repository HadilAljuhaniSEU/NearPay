import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { subscribeDebtsByCustomerPhone } from '../services/debtService';
import { normalizeSaudiPhone } from '../utils/phone';
import { DebtDoc } from '../types';

/**
 * Real-time hook for all debts belonging to the currently-authenticated customer.
 *
 * Identifies the customer by the phone stored in customerProfiles/{uid}.phone
 * (NOT FirebaseAuth.user.phoneNumber, which is null for email-based auth).
 *
 * Flow:
 *  1. Listen for Firebase auth state.
 *  2. On sign-in, read customerProfiles/{uid} from Firestore to get the phone.
 *  3. Normalise the phone to E.164 and subscribe to debts matching that phone.
 */
export function useCustomerDebts() {
  const [debts, setDebts]               = useState<DebtDoc[]>([]);
  const [loading, setLoading]           = useState(true);
  const [phone, setPhone]               = useState<string | null>(null);
  const [authResolved, setAuthResolved] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [error, setError]               = useState<string | null>(null);

  // Watch auth state, then read phone from customerProfiles
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setPhone(null);
        setAuthResolved(true);
        return;
      }

      try {
        const snap = await getDoc(doc(db, 'customerProfiles', user.uid));
        if (snap.exists()) {
          const data = snap.data();
          const raw  = (data.phone as string | undefined) || '';
          setPhone(raw ? normalizeSaudiPhone(raw) : null);
        } else {
          setPhone(null);
        }
      } catch (err) {
        console.warn('[useCustomerDebts] could not read customerProfiles:', err);
        setPhone(null);
      }

      setAuthResolved(true);
    });

    return unsub;
  }, []);

  // Subscribe to debts once auth + phone are resolved
  useEffect(() => {
    if (!authResolved) return;
    if (!phone) {
      setLoading(false);
      return;
    }

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
      },
    );

    return unsub;
  }, [phone, authResolved]);

  return { debts, loading, phone, customerName, error };
}
