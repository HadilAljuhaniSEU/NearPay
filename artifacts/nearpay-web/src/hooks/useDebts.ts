import { useEffect, useState } from 'react';
import { subscribeDebts, fetchDebt } from '../services/debtService';
import { DebtDoc } from '../types';

export function useDebts(merchantId: string | null) {
  const [debts, setDebts] = useState<DebtDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!merchantId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeDebts(merchantId, (data) => {
      setDebts(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [merchantId]);

  return { debts, loading, error };
}

export function useDebt(debtId: string | null) {
  const [debt, setDebt] = useState<DebtDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!debtId) {
      setLoading(false);
      return;
    }

    fetchDebt(debtId)
      .then(setDebt)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [debtId]);

  return { debt, loading, error };
}
