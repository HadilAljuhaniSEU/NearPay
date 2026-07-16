import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { CUSTOMER_PROFILE, NEARBY_MERCHANTS } from '@/data/mock';

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? '#22C55E' : score >= 60 ? '#F59E0B' : '#EF4444';
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Fair';
  return (
    <View style={styles.scoreRing}>
      <View style={[styles.scoreOuter, { borderColor: color }]}>
        <View style={[styles.scoreInner, { backgroundColor: color + '18' }]}>
          <Text style={[styles.scoreNum, { color }]}>{score}</Text>
          <Text style={[styles.scoreLbl, { color }]}>{label}</Text>
        </View>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const topPad = Platform.OS === 'web' ? 67 : insets.top + 16;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const linkedMerchants = NEARBY_MERCHANTS.filter((m) => m.totalDebt);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: botPad + 24 }}>
        {/* Profile Hero */}
        <View style={styles.hero}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.initials}>KA</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Feather name="check" size={10} color="#fff" />
            </View>
          </View>
          <Text style={styles.name}>{CUSTOMER_PROFILE.name}</Text>
          <Text style={styles.nameEn}>{CUSTOMER_PROFILE.nameEn}</Text>
          <Text style={styles.phone}>{CUSTOMER_PROFILE.phone}</Text>
          <Text style={styles.since}>Member since {CUSTOMER_PROFILE.memberSince}</Text>
        </View>

        {/* NearPay Score */}
        <View style={[styles.scoreCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.scoreCardTop}>
            <View>
              <Text style={[styles.scoreCardTitle, { color: colors.foreground }]}>NearPay Score</Text>
              <Text style={[styles.scoreCardSub, { color: colors.mutedForeground }]}>Credit trustworthiness rating</Text>
            </View>
            <ScoreRing score={CUSTOMER_PROFILE.nearPayScore} />
          </View>
          <View style={[styles.scoreDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statVal, { color: '#22C55E' }]}>{CUSTOMER_PROFILE.paidOnTime}</Text>
              <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>On-time</Text>
            </View>
            <View style={[styles.statSep, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statVal, { color: '#EF4444' }]}>{CUSTOMER_PROFILE.overdueCount}</Text>
              <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Overdue</Text>
            </View>
            <View style={[styles.statSep, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statVal, { color: colors.foreground }]}>SAR {CUSTOMER_PROFILE.totalOwed.toLocaleString()}</Text>
              <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>Total owed</Text>
            </View>
          </View>
        </View>

        {/* Linked Merchants */}
        {linkedMerchants.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Active Merchant Tabs</Text>
            {linkedMerchants.map((m, i) => (
              <View
                key={m.id}
                style={[styles.merchantRow, i < linkedMerchants.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}
              >
                <View style={[styles.merchantIcon, { backgroundColor: '#DCFCE7' }]}>
                  <Feather name={m.categoryIcon as any} size={16} color="#16A34A" />
                </View>
                <View style={styles.merchantInfo}>
                  <Text style={[styles.merchantName, { color: colors.foreground }]}>{m.name}</Text>
                  <Text style={[styles.merchantCat, { color: colors.mutedForeground }]}>{m.category} · {m.distance}</Text>
                </View>
                <Text style={[styles.merchantDebt, { color: '#F59E0B' }]}>
                  SAR {m.totalDebt?.toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Settings */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Account</Text>
          {[
            { icon: 'edit-2', label: 'Edit Profile' },
            { icon: 'bell', label: 'Notifications' },
            { icon: 'shield', label: 'Privacy' },
            { icon: 'help-circle', label: 'Help & Support' },
          ].map((r, i, arr) => (
            <View
              key={r.label}
              style={[styles.row, i < arr.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}
            >
              <View style={[styles.rowIcon, { backgroundColor: colors.muted }]}>
                <Feather name={r.icon as any} size={16} color={colors.mutedForeground} />
              </View>
              <Text style={[styles.rowLbl, { color: colors.foreground }]}>{r.label}</Text>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Feather name="log-out" size={18} color="#EF4444" />
          <Text style={styles.logoutTxt}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 20, paddingBottom: 16,
  },
  headerTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#fff' },
  hero: {
    backgroundColor: '#0F172A',
    alignItems: 'center', paddingBottom: 28, paddingTop: 8, paddingHorizontal: 24,
  },
  avatarWrap: { position: 'relative', marginBottom: 14 },
  avatar: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: '#16A34A', alignItems: 'center', justifyContent: 'center',
  },
  initials: { fontSize: 30, fontFamily: 'Inter_700Bold', color: '#fff' },
  verifiedBadge: {
    position: 'absolute', bottom: -4, right: -4,
    width: 22, height: 22, backgroundColor: '#16A34A',
    borderRadius: 11, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#0F172A',
  },
  name: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#fff' },
  nameEn: { fontSize: 14, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.5)', marginTop: 3 },
  phone: { fontSize: 13, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.45)', marginTop: 3 },
  since: { fontSize: 12, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.3)', marginTop: 4 },
  scoreCard: {
    marginHorizontal: 16, marginTop: 16, borderRadius: 18, borderWidth: 1,
  },
  scoreCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18 },
  scoreCardTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  scoreCardSub: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 3 },
  scoreRing: { alignItems: 'center' },
  scoreOuter: { width: 72, height: 72, borderRadius: 36, borderWidth: 4, alignItems: 'center', justifyContent: 'center' },
  scoreInner: { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center' },
  scoreNum: { fontSize: 22, fontFamily: 'Inter_700Bold', lineHeight: 26 },
  scoreLbl: { fontSize: 9, fontFamily: 'Inter_600SemiBold', letterSpacing: 0.5 },
  scoreDivider: { height: 1, marginHorizontal: 18 },
  statsRow: { flexDirection: 'row', padding: 16, alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 17, fontFamily: 'Inter_700Bold' },
  statLbl: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 3 },
  statSep: { width: 1, height: 30, marginHorizontal: 10 },
  section: { marginHorizontal: 16, marginTop: 12, borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  sectionTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold', padding: 16, paddingBottom: 10 },
  merchantRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  merchantIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  merchantInfo: { flex: 1 },
  merchantName: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  merchantCat: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  merchantDebt: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  rowIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rowLbl: { flex: 1, fontSize: 14, fontFamily: 'Inter_500Medium' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginHorizontal: 16, marginTop: 12,
    backgroundColor: '#FEF2F2', borderRadius: 16, padding: 16,
  },
  logoutTxt: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#EF4444' },
});
