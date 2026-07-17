import React, { ReactNode } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from './LanguageSwitcher';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  showLanguage?: boolean;
  showSettings?: boolean;
}

export const PageHeader = ({ title, subtitle, action, showBack = false, onBack, showLanguage = false, showSettings = false }: PageHeaderProps) => {
  const [_, setLocation] = useLocation();

  const handleBack = () => {
    if (onBack) onBack();
    else window.history.back();
  };

  return (
    <div className="px-6 py-4 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur-md z-40 border-b border-border/50">
      <div className="flex items-center gap-3">
        {showBack && (
          <Button variant="ghost" size="icon" onClick={handleBack} className="h-10 w-10 rounded-full -ml-3 hover:bg-secondary text-foreground">
            <ChevronLeft size={24} />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground leading-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground font-medium mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {showLanguage && <LanguageSwitcher />}
        {showSettings && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setLocation('/merchant/settings')}
            className="rounded-full h-9 w-9 bg-card border-border/60 text-foreground hover:bg-secondary"
          >
            <Settings size={16} />
          </Button>
        )}
        {action}
      </div>
    </div>
  );
};
