import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';

type Role = 'merchant' | 'customer';

export default function LoginScreen() {
  const [selectedRole, setSelectedRole] = useState<Role>('merchant');
  const { login } = useAuth();
  const insets = useSafeAreaInsets();

  const handleLogin = () => {
    login(selectedRole);
    if (selectedRole === 'merchant') {
      router.replace('/(tabs)/');
    } else {
      router.replace('/(customer)/');
    }
  };

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={[styles.root, { paddingTop: topPad }]}>
      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.logoWrap}>
          <View style={styles.logoBox}>
            <Text style={styles.logoN}>N</Text>
          </View>
          <View style={styles.logoPinBadge}>
            <Feather name="map-pin" size={9} color="#fff" />
          </View>
        </View>
        <Text style={styles.brand}>NearPay</Text>
        <Text style={styles.brandAr}>نيربي</Text>
        <Text style={styles.tagline}>Digital debts for neighborhood businesses</Text>
      </View>

      {/* Card */}
      <View style={[styles.card, { paddingBottom: botPad + 24 }]}>
        <Text style={styles.cardTitle}>Welcome back</Text>
        <Text style={styles.cardSub}>Choose your role to continue</Text>

        <View style={styles.roleRow}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.roleCard, selectedRole === 'merchant' && styles.roleCardActive]}
            onPress={() => setSelectedRole('merchant')}
          >
            <View style={[styles.roleIconWrap, selectedRole === 'merchant' && styles.roleIconActive]}>
              <Feather name="briefcase" size={22} color={selectedRole === 'merchant' ? '#fff' : '#16A34A'} />
            </View>
            <Text style={[styles.roleTitle, selectedRole === 'merchant' && styles.roleTitleActive]}>Merchant</Text>
            <Text style={[styles.roleSubtitle, selectedRole === 'merchant' && styles.roleSubtitleActive]}>تاجر</Text>
            {selectedRole === 'merchant' && (
              <View style={styles.checkBadge}>
                <Feather name="check" size={11} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.roleCard, selectedRole === 'customer' && styles.roleCardActive]}
            onPress={() => setSelectedRole('customer')}
          >
            <View style={[styles.roleIconWrap, selectedRole === 'customer' && styles.roleIconActive]}>
              <Feather name="user" size={22} color={selectedRole === 'customer' ? '#fff' : '#16A34A'} />
            </View>
            <Text style={[styles.roleTitle, selectedRole === 'customer' && styles.roleTitleActive]}>Customer</Text>
            <Text style={[styles.roleSubtitle, selectedRole === 'customer' && styles.roleSubtitleActive]}>عميل</Text>
            {selectedRole === 'customer' && (
              <View style={styles.checkBadge}>
                <Feather name="check" size={11} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.cta} onPress={handleLogin} activeOpacity={0.85}>
          <Text style={styles.ctaText}>
            Continue as {selectedRole === 'merchant' ? 'Merchant' : 'Customer'}
          </Text>
          <Feather name="arrow-right" size={18} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.demoNote}>Demo mode — no sign-in required</Text>
      </View>
    </View>
  );
}

const PRIMARY = '#16A34A';
const DARK = '#0F172A';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: DARK },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  logoWrap: { position: 'relative', marginBottom: 20 },
  logoBox: {
    width: 76,
    height: 76,
    backgroundColor: PRIMARY,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoN: { color: '#fff', fontSize: 38, fontFamily: 'Inter_700Bold', lineHeight: 44 },
  logoPinBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 24,
    height: 24,
    backgroundColor: '#15803D',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: DARK,
  },
  brand: { fontSize: 34, fontFamily: 'Inter_700Bold', color: '#FFFFFF', letterSpacing: -0.8 },
  brandAr: { fontSize: 16, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.4)', marginTop: 2, marginBottom: 10 },
  tagline: { fontSize: 14, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.45)', textAlign: 'center' },
  card: {
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  cardTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: DARK },
  cardSub: { fontSize: 14, fontFamily: 'Inter_400Regular', color: '#6B7280', marginTop: 4, marginBottom: 22 },
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  roleCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  roleCardActive: { borderColor: PRIMARY, backgroundColor: PRIMARY },
  roleIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  roleIconActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
  roleTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: DARK },
  roleTitleActive: { color: '#FFFFFF' },
  roleSubtitle: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#6B7280', marginTop: 2 },
  roleSubtitleActive: { color: 'rgba(255,255,255,0.7)' },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cta: {
    backgroundColor: PRIMARY,
    borderRadius: 16,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 14,
  },
  ctaText: { color: '#fff', fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  demoNote: { textAlign: 'center', fontSize: 12, fontFamily: 'Inter_400Regular', color: '#9CA3AF' },
});
