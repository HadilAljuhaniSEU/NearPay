import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { useEffect } from 'react';

import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
// Public (no auth)
import DebtApprovalPage from './pages/public/DebtApprovalPage';
import DebtPaymentPage from './pages/public/DebtPaymentPage';
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

      {/* ── Public routes — no auth required ── */}
      <Route path="/debt/approve/:token" component={DebtApprovalPage} />
      <Route path="/debt/pay/:token" component={DebtPaymentPage} />

      {/* ── Protected merchant routes ── */}
      <Route path="/merchant/dashboard">
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      </Route>
      <Route path="/merchant/debts">
        <ProtectedRoute><DebtsPage /></ProtectedRoute>
      </Route>
      <Route path="/merchant/customers">
        <ProtectedRoute><CustomersPage /></ProtectedRoute>
      </Route>
      <Route path="/merchant/add-debt">
        <ProtectedRoute><AddDebtPage /></ProtectedRoute>
      </Route>
      <Route path="/merchant/debt/:id">
        <ProtectedRoute><DebtDetailPage /></ProtectedRoute>
      </Route>
      <Route path="/merchant/analytics">
        <ProtectedRoute><AnalyticsPage /></ProtectedRoute>
      </Route>
      <Route path="/merchant/ai">
        <ProtectedRoute><AIPage /></ProtectedRoute>
      </Route>
      <Route path="/merchant/settings">
        <ProtectedRoute><MerchantSettingsPage /></ProtectedRoute>
      </Route>
      <Route path="/merchant/nearby">
        <ProtectedRoute><MerchantNearbyPage /></ProtectedRoute>
      </Route>

      {/* ── Customer routes — no Firebase auth needed ── */}
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
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
