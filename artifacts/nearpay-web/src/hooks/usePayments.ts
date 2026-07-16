import { useEffect, useState } from 'react';
import { subscribePayments, fetchPaymentsForDebt } from '../services/paymentService';
import { PaymentDoc } from '../types';

export function usePayments(merchantId: string | null) {
  const [payments, setPayments] = useState<PaymentDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!merchantId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribePayments(merchantId, (data) => {
      setPayments(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [merchantId]);

  return { payments, loading, error };
}

export function useDebtPayments(debtId: string | null) {
  const [payments, setPayments] = useState<PaymentDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!debtId) {
      setLoading(false);
      return;
    }

    fetchPaymentsForDebt(debtId)
      .then(setPayments)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [debtId]);

  return { payments, loading, error };
}
