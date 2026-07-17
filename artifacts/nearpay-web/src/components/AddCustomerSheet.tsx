import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createCustomer } from '../services/customerService';
import { CustomerDoc } from '../types';
import { isValidSaudiPhone, normalizeSaudiPhone } from '../utils/phone';
import { useT } from '../contexts/LanguageContext';

interface Props {
  merchantId: string;
  open: boolean;
  onClose: () => void;
  onCreated: (customer: CustomerDoc) => void;
}

export function AddCustomerSheet({ merchantId, open, onClose, onCreated }: Props) {
  const t = useT();
  const [fullName, setFullName]   = useState('');
  const [phone, setPhone]         = useState('');
  const [email, setEmail]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');

  const reset = () => { setFullName(''); setPhone(''); setEmail(''); setError(''); };

  const handleClose = () => { reset(); onClose(); };

  const handleSave = async () => {
    setError('');
    if (!fullName.trim()) { setError(t('fill_all_fields')); return; }
    if (!phone.trim())    { setError(t('fill_all_fields')); return; }
    if (!isValidSaudiPhone(phone)) { setError(t('invalid_saudi_phone')); return; }

    setLoading(true);
    try {
      const id = await createCustomer({
        merchantId,
        fullName: fullName.trim(),
        phone: normalizeSaudiPhone(phone),
        email: email.trim() || undefined,
        trustScore: 80,
        totalDebt: 0,
        totalPaid: 0,
      });
      const created: CustomerDoc = {
        id,
        merchantId,
        fullName: fullName.trim(),
        phone: normalizeSaudiPhone(phone),
        email: email.trim() || undefined,
        trustScore: 80,
        totalDebt: 0,
        totalPaid: 0,
        createdAt: {} as any,
        updatedAt: {} as any,
      };
      reset();
      onCreated(created);
    } catch {
      setError(t('load_failed'));
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "h-12 rounded-[18px] bg-secondary/50 border border-border/60 focus-visible:border-teal focus-visible:ring-1 text-sm font-medium";

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          {/* Sheet */}
          <motion.div
            key="sheet"
            className="fixed bottom-0 left-0 right-0 bg-card z-50 rounded-t-[28px] border-t border-border/60"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            <div className="px-5 pt-3 pb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                       style={{ background: 'rgba(46,216,195,0.12)' }}>
                    <UserPlus size={19} style={{ color: '#2ED8C3' }} />
                  </div>
                  <h2 className="text-lg font-bold">{t('add_customer_title')}</h2>
                </div>
                <button onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <Input
                  type="text"
                  placeholder={t('customer_name_label')}
                  className={inputCls}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoFocus
                />
                <Input
                  type="tel"
                  placeholder={t('saudi_phone_placeholder')}
                  className={inputCls}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  dir="ltr"
                />
                <Input
                  type="email"
                  placeholder={t('customer_email_label')}
                  className={inputCls}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && (
                <div className="mt-3 p-3 bg-destructive/8 rounded-xl border border-destructive/15">
                  <p className="text-sm font-semibold text-destructive text-center">{error}</p>
                </div>
              )}

              <Button
                onClick={handleSave}
                disabled={!fullName || !phone || loading}
                className="w-full h-13 rounded-[18px] font-bold mt-5 text-sm gap-2"
              >
                {loading ? (
                  <div className="flex gap-1.5">
                    {[0,150,300].map(d => (
                      <div key={d} className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                ) : (
                  <>{t('save_customer_btn')} <UserPlus size={16} /></>
                )}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
