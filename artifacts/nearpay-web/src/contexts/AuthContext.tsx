import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange } from '../services/authService';
import { fetchMerchantByOwner } from '../services/merchantService';
import { MerchantDoc } from '../types';

interface AuthState {
  user: User | null;
  merchant: MerchantDoc | null;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthState>({
  user: null,
  merchant: null,
  loading: true,
  error: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [merchant, setMerchant] = useState<MerchantDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      setError(null);

      if (firebaseUser) {
        try {
          const m = await fetchMerchantByOwner(firebaseUser.uid);
          setMerchant(m);
        } catch (err: unknown) {
          console.error('Failed to fetch merchant doc:', err);
          setError('Could not load merchant profile.');
          setMerchant(null);
        }
      } else {
        setMerchant(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, merchant, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthState {
  return useContext(AuthContext);
}
