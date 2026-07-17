import { useEffect, useState } from 'react';
import { subscribeCustomers, fetchCustomer } from '../services/customerService';
import { CustomerDoc } from '../types';

export function useCustomers(merchantId: string | null) {
  const [customers, setCustomers] = useState<CustomerDoc[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    if (!merchantId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeCustomers(
      merchantId,
      (data) => {
        setCustomers(data);
        setLoading(false);
      },
      (err) => {
        console.error('[useCustomers] subscription error:', err);
        setError(err.message);
        setLoading(false); // unblock UI even on error
      }
    );

    return unsubscribe;
  }, [merchantId]);

  return { customers, loading, error };
}

export function useCustomer(customerId: string | null) {
  const [customer, setCustomer] = useState<CustomerDoc | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) {
      setLoading(false);
      return;
    }

    fetchCustomer(customerId)
      .then(setCustomer)
      .catch((err) => {
        console.error('[useCustomer] fetch error:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [customerId]);

  return { customer, loading, error };
}
