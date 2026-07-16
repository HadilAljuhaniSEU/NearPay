import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuthContext } from '../contexts/AuthContext';

/**
 * Wraps any merchant page.
 * - While Firebase resolves the auth state: shows a full-screen loading spinner.
 * - If no authenticated user: redirects to /login.
 * - Otherwise: renders children.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();
  const [_, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      setLocation('/login');
    }
  }, [loading, user, setLocation]);

  if (loading) {
    return (
      <div className="app-container flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
