import { useEffect, useState } from 'react';
import { subscribeDebts, subscribeDebt } from '../services/debtService';
import { DebtDoc } from '../types';

export function useDebts(merchantId: string | null) {
  const [debts, setDebts]   = useState<DebtDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!merchantId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeDebts(
      merchantId,
      (data) => {
        setDebts(data);
        setLoading(false);
      },
      (err) => {
        console.error('[useDebts] subscription error:', err);
        setError(err.message);
        setLoading(false); // unblock UI even on error
      }
    );

    return unsubscribe;
  }, [merchantId]);

  return { debts, loading, error };
}

// Real-time single-debt hook — auto-updates after payments
export function useDebt(debtId: string | null) {
  const [debt, setDebt]     = useState<DebtDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!debtId) { setLoading(false); return; }
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeDebt(
      debtId,
      (d) => {
        setDebt(d);
        setLoading(false);
      },
      (err) => {
        console.error('[useDebt] subscription error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [debtId]);

  return { debt, loading, error };
}
