import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { DEBTS, CUSTOMER_PROFILE, NEARBY_MERCHANTS } from '@/data/mock';

export default function CustomerHomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top + 16;

  const myDebts = DEBTS.filter((d) => d.status !== 'settled').slice(0, 3);
  const totalOwed = myDebts.reduce((s, d) => s + d.amount, 0);
  const overdueCount = myDebts.filter((d) => d.status === 'overdue').length;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <View>
          <Text style={styles.greeting}>مرحباً، {CUSTOMER_PROFILE.name}</Text>
          <Text style={styles.subGreeting}>Riyadh · NearPay Customer</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <Feather name="bell" size={19} color="#fff" />
          {overdueCount > 0 && <View style={styles.notifDot} />}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Platform.OS === 'web' ? 100 : 110 }}>
        {/* Balance Card */}
        <View style={styles.balCard}>
          <Text style={styles.balLbl}>Total You Owe</Text>
          <Text style={styles.balAmt}>SAR {totalOwed.toLocaleString()}</Text>
          {overdueCount > 0 && (
            <View style={styles.overdueWarn}>
              <Feather name="alert-circle" size={13} color="#FCA5A5" />
              <Text style={styles.overdueWarnTxt}>{overdueCount} overdue payment{overdueCount > 1 ? 's' : ''}</Text>
            </View>
          )}
          <View style={styles.balDivider} />
          <View style={styles.scoreRow}>
            <View>
              <Text style={styles.scoreVal}>{CUSTOMER_PROFILE.nearPayScore}</Text>
              <Text style={styles.scoreLbl}>NearPay Score</Text>
            </View>
            <View style={styles.scoreSep} />
            <View>
              <Text style={styles.scoreVal}>{CUSTOMER_PROFILE.paidOnTime}</Text>
              <Text style={styles.scoreLbl}>On-time pays</Text>
            </View>
            <View style={styles.scoreSep} />
            <View>
              <Text style={[styles.scoreVal, { color: '#FCA5A5' }]}>{CUSTOMER_PROFILE.overdueCount}</Text>
              <Text style={styles.scoreLbl}>Overdue</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actions}>
          {[
            { icon: 'map-pin', label: 'Nearby', bg: '#DCFCE7', color: '#16A34A', route: '/(customer)/nearby' },
            { icon: 'file-text', label: 'My Debts', bg: '#FFF7ED', color: '#F59E0B', route: '/(customer)/debts' },
            { icon: 'dollar-sign', label: 'Pay Now', bg: '#EFF6FF', color: '#3B82F6', route: '/(customer)/payments' },
            { icon: 'user', label: 'Profile', bg: '#F5F3FF', color: '#8B5CF6', route: '/(customer)/profile' },
          ].map((a) => (
            <TouchableOpacity key={a.icon} style={styles.actionBtn} onPress={() => router.push(a.route as any)} activeOpacity={0.75}>
              <View style={[styles.actionIcon, { backgroundColor: a.bg }]}>
                <Feather name={a.icon as any} size={22} color={a.color} />
              </View>
              <Text style={[styles.actionLbl, { color: colors.foreground }]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Active Debts */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Active Debts</Text>
            <TouchableOpacity onPress={() => router.push('/(customer)/debts')}>
              <Text style={[styles.seeAll, { color: '#16A34A' }]}>See all</Text>
            </TouchableOpacity>
          </View>
          {myDebts.map((d) => (
            <View key={d.id} style={[styles.debtCard, { backgroundColor: colors.card, borderColor: d.status === 'overdue' ? '#FCA5A5' : colors.border }]}>
              <View style={[styles.debtAvatar, { backgroundColor: d.status === 'overdue' ? '#FEF2F2' : '#DCFCE7' }]}>
                <Feather name={d.categoryIcon as any} size={18} color={d.status === 'overdue' ? '#EF4444' : '#16A34A'} />
              </View>
              <View style={styles.debtInfo}>
                <Text style={[styles.debtMerchant, { color: colors.foreground }]}>{d.merchantName}</Text>
                <Text style={[styles.debtDate, { color: d.status === 'overdue' ? '#EF4444' : colors.mutedForeground }]}>
                  {d.status === 'overdue' ? 'OVERDUE · ' : 'Due '}
                  {d.dueDate}
                </Text>
              </View>
              <View style={styles.debtRight}>
                <Text style={[styles.debtAmt, { color: colors.foreground }]}>SAR {d.amount.toLocaleString()}</Text>
                <TouchableOpacity style={styles.payBtn}>
                  <Text style={styles.payBtnTxt}>Pay</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Nearby Merchants */}
        <View style={[styles.section, { marginBottom: 0 }]}>
          <View style={styles.sectionRow}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Nearby Merchants</Text>
            <TouchableOpacity onPress={() => router.push('/(customer)/nearby')}>
              <Text style={[styles.seeAll, { color: '#16A34A' }]}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hScroll}>
            {NEARBY_MERCHANTS.slice(0, 4).map((m) => (
              <View key={m.id} style={[styles.merchantChip, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.merchantChipIcon, { backgroundColor: '#DCFCE7' }]}>
                  <Feather name={m.categoryIcon as any} size={18} color="#16A34A" />
                </View>
                <Text style={[styles.merchantChipName, { color: colors.foreground }]} numberOfLines={1}>{m.name}</Text>
                <Text style={[styles.merchantChipDist, { color: colors.mutedForeground }]}>{m.distance}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    backgroundColor: '#0F172A', paddingHorizontal: 20, paddingBottom: 20,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
  },
  greeting: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#fff' },
  subGreeting: { fontSize: 13, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.45)', marginTop: 2 },
  iconBtn: {
    width: 38, height: 38, backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12, alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  notifDot: { position: 'absolute', top: 8, right: 8, width: 7, height: 7, backgroundColor: '#EF4444', borderRadius: 4, borderWidth: 1, borderColor: '#0F172A' },
  balCard: { backgroundColor: '#16A34A', margin: 16, borderRadius: 20, padding: 22 },
  balLbl: { fontSize: 13, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.7)' },
  balAmt: { fontSize: 34, fontFamily: 'Inter_700Bold', color: '#fff', marginTop: 4, letterSpacing: -1 },
  overdueWarn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start' },
  overdueWarnTxt: { fontSize: 12, fontFamily: 'Inter_500Medium', color: '#FCA5A5' },
  balDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: 16 },
  scoreRow: { flexDirection: 'row', alignItems: 'center' },
  scoreVal: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#fff' },
  scoreLbl: { fontSize: 11, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  scoreSep: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 18 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 20 },
  actionBtn: { alignItems: 'center', gap: 8 },
  actionIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  actionLbl: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  seeAll: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  debtCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, borderWidth: 1, marginBottom: 8 },
  debtAvatar: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  debtInfo: { flex: 1 },
  debtMerchant: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  debtDate: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  debtRight: { alignItems: 'flex-end', gap: 6 },
  debtAmt: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  payBtn: { backgroundColor: '#16A34A', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4 },
  payBtnTxt: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#fff' },
  hScroll: { marginHorizontal: -4 },
  merchantChip: {
    width: 110, borderRadius: 16, borderWidth: 1,
    padding: 14, alignItems: 'center', marginHorizontal: 4,
  },
  merchantChipIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  merchantChipName: { fontSize: 13, fontFamily: 'Inter_600SemiBold', textAlign: 'center' },
  merchantChipDist: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 3 },
});
