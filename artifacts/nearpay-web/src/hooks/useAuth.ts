import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  signInMerchant,
  signOutMerchant,
  resetMerchantPassword,
  registerMerchant,
  RegisterMerchantParams,
  checkCRExists,
  updateMerchantLanguage,
} from '../services/authService';
import { useAuthContext } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface UseAuthReturn {
  user: ReturnType<typeof useAuthContext>['user'];
  merchant: ReturnType<typeof useAuthContext>['merchant'];
  authLoading: boolean;
  actionLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  register: (params: RegisterMerchantParams) => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const { user, merchant, loading: authLoading } = useAuthContext();
  const { lang } = useLanguage();
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [_, setLocation] = useLocation();

  const signIn = async (email: string, password: string, rememberMe: boolean) => {
    setActionLoading(true);
    setError(null);
    try {
      const u = await signInMerchant(email, password, rememberMe);
      // Persist current language preference to Firestore
      await updateMerchantLanguage(u.uid, lang);
      setLocation('/merchant/dashboard');
    } catch (err: unknown) {
      setError(mapFirebaseError(err));
    } finally {
      setActionLoading(false);
    }
  };

  const register = async (params: RegisterMerchantParams) => {
    setActionLoading(true);
    setError(null);
    try {
      // Check for duplicate CR before creating the account
      const crTaken = await checkCRExists(params.commercialRegistration);
      if (crTaken) {
        setError(mapFirebaseError({ code: 'nearpay/cr-already-exists' }));
        return;
      }
      await registerMerchant({ ...params, language: lang });
      setLocation('/merchant/dashboard');
    } catch (err: unknown) {
      setError(mapFirebaseError(err));
    } finally {
      setActionLoading(false);
    }
  };

  const signOut = async () => {
    setActionLoading(true);
    try {
      await signOutMerchant();
      setLocation('/login');
    } catch (err: unknown) {
      console.error('Sign out error:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const sendPasswordReset = async (email: string) => {
    setActionLoading(true);
    setError(null);
    try {
      await resetMerchantPassword(email);
    } catch (err: unknown) {
      setError(mapFirebaseError(err));
    } finally {
      setActionLoading(false);
    }
  };

  return { user, merchant, authLoading, actionLoading, error, signIn, signOut, sendPasswordReset, register };
}

// ─── Map error codes to user-friendly messages ────────────────────────────────
function mapFirebaseError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? '';
  const map: Record<string, string> = {
    'auth/invalid-credential':        'Incorrect email or password.',
    'auth/user-not-found':            'No account found with this email.',
    'auth/wrong-password':            'Incorrect password.',
    'auth/too-many-requests':         'Too many attempts. Please try again later.',
    'auth/user-disabled':             'This account has been disabled.',
    'auth/invalid-email':             'Invalid email address.',
    'auth/email-already-in-use':      'An account with this email already exists.',
    'auth/weak-password':             'Password must be at least 8 characters.',
    'auth/network-request-failed':    'Network error. Check your connection.',
    'nearpay/cr-already-exists':      'A merchant with this Commercial Registration already exists.',
  };
  return map[code] ?? 'Something went wrong. Please try again.';
}
