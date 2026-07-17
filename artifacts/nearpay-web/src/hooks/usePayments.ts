import { useEffect, useState } from 'react';
import { subscribePayments } from '../services/paymentService';
import { PaymentDoc } from '../types';

export function useMerchantPayments(merchantId: string | null) {
  const [payments, setPayments] = useState<PaymentDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!merchantId) { setLoading(false); return; }
    setLoading(true);
    return subscribePayments(merchantId, (data) => {
      setPayments(data);
      setLoading(false);
    });
  }, [merchantId]);

  return { payments, loading };
}
