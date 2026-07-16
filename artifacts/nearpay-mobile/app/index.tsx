import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'expo-router';

export default function Index() {
  const { role } = useAuth();

  if (role === 'merchant') {
    return <Redirect href="/(tabs)/" />;
  }

  if (role === 'customer') {
    return <Redirect href="/(customer)/" />;
  }

  return <Redirect href="/login" />;
}
