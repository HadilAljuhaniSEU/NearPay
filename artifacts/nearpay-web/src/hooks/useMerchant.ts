import { useEffect, useState } from 'react';
import { fetchMerchantSettings, upsertMerchantSettings } from '../services/merchantService';
import { MerchantSettingsDoc } from '../types';
import { useAuthContext } from '../contexts/AuthContext';

export function useMerchant() {
  const { merchant, loading, error } = useAuthContext();
  return { merchant, loading, error };
}

export function useMerchantSettings() {
  const { merchant } = useAuthContext();
  const [settings, setSettings] = useState<MerchantSettingsDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!merchant?.id) {
      setLoading(false);
      return;
    }

    fetchMerchantSettings(merchant.id)
      .then(setSettings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [merchant?.id]);

  const saveSettings = async (
    data: Partial<Omit<MerchantSettingsDoc, 'merchantId' | 'updatedAt'>>
  ) => {
    if (!merchant?.id) return;
    setSaving(true);
    try {
      await upsertMerchantSettings(merchant.id, data);
      setSettings((prev) => (prev ? { ...prev, ...data } : null));
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return { settings, loading, error, saving, saveSettings };
}
