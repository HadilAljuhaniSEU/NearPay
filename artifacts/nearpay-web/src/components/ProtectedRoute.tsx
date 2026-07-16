import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuthContext } from '../contexts/AuthContext';
import { useT } from '../contexts/LanguageContext';
import { NearPayIcon } from './NearPayLogo';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext();
  const [_, setLocation] = useLocation();
  const t = useT();

  useEffect(() => {
    if (!loading && !user) {
      setLocation('/login');
    }
  }, [loading, user, setLocation]);

  if (loading) {
    return (
      <div className="app-container flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <NearPayIcon size={48} />
            <div className="absolute -inset-3 border-2 border-teal/30 rounded-full animate-spin border-t-teal" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
