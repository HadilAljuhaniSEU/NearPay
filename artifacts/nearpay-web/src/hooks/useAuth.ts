import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  signInMerchant,
  signOutMerchant,
  resetMerchantPassword,
  registerMerchant,
} from '../services/authService';
import { useAuthContext } from '../contexts/AuthContext';

interface UseAuthReturn {
  user: ReturnType<typeof useAuthContext>['user'];
  merchant: ReturnType<typeof useAuthContext>['merchant'];
  authLoading: boolean;
  actionLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  register: (email: string, password: string, businessName: string, phone: string) => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const { user, merchant, loading: authLoading, error: ctxError } = useAuthContext();
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(ctxError);
  const [_, setLocation] = useLocation();

  const signIn = async (email: string, password: string, rememberMe: boolean) => {
    setActionLoading(true);
    setError(null);
    try {
      await signInMerchant(email, password, rememberMe);
      localStorage.setItem('nearpay_role', 'merchant');
      setLocation('/merchant/dashboard');
    } catch (err: unknown) {
      const msg = mapFirebaseError(err);
      setError(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const register = async (email: string, password: string, businessName: string, phone: string) => {
    setActionLoading(true);
    setError(null);
    try {
      await registerMerchant(email, password, businessName, phone);
      localStorage.setItem('nearpay_role', 'merchant');
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
      localStorage.removeItem('nearpay_role');
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

  return {
    user,
    merchant,
    authLoading,
    actionLoading,
    error,
    signIn,
    signOut,
    sendPasswordReset,
    register,
  };
}

// ─── Map Firebase error codes to user-friendly messages ──────────────────────
function mapFirebaseError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? '';
  const map: Record<string, string> = {
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  };
  return map[code] ?? 'Something went wrong. Please try again.';
}
