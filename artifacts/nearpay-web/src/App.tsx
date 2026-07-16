import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { useEffect } from 'react';

// Pages
import LoginPage from './pages/LoginPage';
// Merchant
import DashboardPage from './pages/merchant/DashboardPage';
import DebtsPage from './pages/merchant/DebtsPage';
import CustomersPage from './pages/merchant/CustomersPage';
import AddDebtPage from './pages/merchant/AddDebtPage';
import DebtDetailPage from './pages/merchant/DebtDetailPage';
import AnalyticsPage from './pages/merchant/AnalyticsPage';
import AIPage from './pages/merchant/AIPage';
import MerchantSettingsPage from './pages/merchant/SettingsPage';
import MerchantNearbyPage from './pages/merchant/NearbyPage';
// Customer
import CustomerHomePage from './pages/customer/HomePage';
import CustomerNearbyPage from './pages/customer/NearbyPage';
import CustomerDebtsPage from './pages/customer/DebtsPage';
import CustomerPaymentsPage from './pages/customer/PaymentsPage';
import CustomerProfilePage from './pages/customer/ProfilePage';

import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

// A simple redirect component
function RootRedirect() {
  const [_, setLocation] = useLocation();
  useEffect(() => {
    const role = localStorage.getItem('nearpay_role');
    if (role === 'merchant') {
      setLocation('/merchant/dashboard');
    } else if (role === 'customer') {
      setLocation('/customer/home');
    } else {
      setLocation('/login');
    }
  }, [setLocation]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={RootRedirect} />
      <Route path="/login" component={LoginPage} />
      
      {/* Merchant Routes */}
      <Route path="/merchant/dashboard" component={DashboardPage} />
      <Route path="/merchant/debts" component={DebtsPage} />
      <Route path="/merchant/customers" component={CustomersPage} />
      <Route path="/merchant/add-debt" component={AddDebtPage} />
      <Route path="/merchant/debt/:id" component={DebtDetailPage} />
      <Route path="/merchant/analytics" component={AnalyticsPage} />
      <Route path="/merchant/ai" component={AIPage} />
      <Route path="/merchant/settings" component={MerchantSettingsPage} />
      <Route path="/merchant/nearby" component={MerchantNearbyPage} />

      {/* Customer Routes */}
      <Route path="/customer/home" component={CustomerHomePage} />
      <Route path="/customer/nearby" component={CustomerNearbyPage} />
      <Route path="/customer/debts" component={CustomerDebtsPage} />
      <Route path="/customer/payments" component={CustomerPaymentsPage} />
      <Route path="/customer/profile" component={CustomerProfilePage} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
