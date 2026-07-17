import { useEffect, useState } from 'react';
import { subscribePayments } from '../services/paymentService';
import { PaymentDoc } from '../types';

export function useMerchantPayments(merchantId: string | null) {
  const [payments, setPayments] = useState<PaymentDoc[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    if (!merchantId) { setLoading(false); return; }
    setLoading(true);
    setError(null);

    return subscribePayments(
      merchantId,
      (data) => {
        setPayments(data);
        setLoading(false);
      },
      (err) => {
        console.error('[useMerchantPayments] subscription error:', err);
        setError(err.message);
        setLoading(false);
      }
    );
  }, [merchantId]);

  return { payments, loading, error };
}
