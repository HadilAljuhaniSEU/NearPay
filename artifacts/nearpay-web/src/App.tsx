import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
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
import CustomerOTPPage from './pages/customer/OTPPage';
import CustomerAuthPage from './pages/customer/CustomerAuthPage';
import CustomerComingSoonPage from './pages/customer/ComingSoonPage';

import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={LoginPage} />

      {/* ── Public routes — no auth required ── */}
      <Route path="/debt/approve/:token" component={DebtApprovalPage} />
      <Route path="/debt/pay/:token" component={DebtPaymentPage} />

      {/* ── Customer auth — email+password (active) ── */}
      <Route path="/customer/login" component={CustomerAuthPage} />
      {/* ── Customer OTP auth — preserved, re-enable via CUSTOMER_PHONE_OTP_ENABLED flag ── */}
      <Route path="/customer/otp" component={CustomerOTPPage} />

      {/* ── Protected merchant routes — Firebase email/password auth ── */}
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

      {/* ── Protected customer routes — redirects unauthenticated to /customer/login ── */}
      <Route path="/customer/home">
        <ProtectedRoute redirectTo="/customer/login"><CustomerHomePage /></ProtectedRoute>
      </Route>
      <Route path="/customer/nearby">
        <ProtectedRoute redirectTo="/customer/login"><CustomerNearbyPage /></ProtectedRoute>
      </Route>
      <Route path="/customer/debts">
        <ProtectedRoute redirectTo="/customer/login"><CustomerDebtsPage /></ProtectedRoute>
      </Route>
      <Route path="/customer/payments">
        <ProtectedRoute redirectTo="/customer/login"><CustomerPaymentsPage /></ProtectedRoute>
      </Route>
      <Route path="/customer/profile">
        <ProtectedRoute redirectTo="/customer/login"><CustomerProfilePage /></ProtectedRoute>
      </Route>
      <Route path="/customer/coming-soon">
        <ProtectedRoute redirectTo="/customer/login"><CustomerComingSoonPage /></ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, '')}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
