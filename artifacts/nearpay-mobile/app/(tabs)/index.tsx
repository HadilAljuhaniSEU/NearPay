import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TRANSACTIONS, MERCHANT } from '@/data/mock';

function StatCard({
  label, value, icon, bg, iconColor,
}: { label: string; value: string; icon: string; bg: string; iconColor: string }) {
  const colors = useColors();
  return (
    <View style={[styles.stat, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.statIcon, { backgroundColor: bg }]}>
        <Feather name={icon as any} size={17} color={iconColor} />
      </View>
      <Text style={[styles.statVal, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>{label}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top + 16;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>مرحباً، أبو خالد</Text>
          <Text style={styles.subGreeting}>Abu Khalid Store · Riyadh</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Feather name="bell" size={19} color="#fff" />
            <View style={styles.notifDot} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/(tabs)/settings')}>
            <Feather name="settings" size={19} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balLbl}>Total Receivables</Text>
          <Text style={styles.balAmt}>SAR {MERCHANT.totalReceivables.toLocaleString()}</Text>
          <View style={styles.balRow}>
            <View style={styles.balBadge}>
              <Feather name="trending-up" size={12} color="#22C55E" />
              <Text style={styles.balTrend}>+8.2% this month</Text>
            </View>
          </View>
          <View style={styles.balDivider} />
          <View style={styles.balMeta}>
            <View>
              <Text style={styles.balMetaVal}>SAR {MERCHANT.thisMonth.toLocaleString()}</Text>
              <Text style={styles.balMetaLbl}>This Month</Text>
            </View>
            <View style={styles.balMetaSep} />
            <View>
              <Text style={[styles.balMetaVal, { color: '#FCA5A5' }]}>SAR {MERCHANT.overdue.toLocaleString()}</Text>
              <Text style={styles.balMetaLbl}>Overdue</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          <StatCard label="Customers" value={`${MERCHANT.totalCustomers}`} icon="users" bg="#DCFCE7" iconColor="#16A34A" />
          <StatCard label="Settled" value="SAR 8,760" icon="check-circle" bg="#F0FDF4" iconColor="#22C55E" />
          <StatCard label="Overdue" value="SAR 1,890" icon="alert-circle" bg="#FEF2F2" iconColor="#EF4444" />
          <StatCard label="This Month" value="SAR 3,200" icon="calendar" bg="#EFF6FF" iconColor="#3B82F6" />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick Actions</Text>
          <View style={styles.actions}>
            {[
              { icon: 'plus-circle', label: 'Add Debt', bg: '#DCFCE7', color: '#16A34A', route: '/(tabs)/debts' },
              { icon: 'users', label: 'Customers', bg: '#EFF6FF', color: '#3B82F6', route: '/(tabs)/customers' },
              { icon: 'bar-chart-2', label: 'Analytics', bg: '#F5F3FF', color: '#8B5CF6', route: '/(tabs)/analytics' },
              { icon: 'zap', label: 'AI Copilot', bg: '#FFF7ED', color: '#F59E0B', route: '/(tabs)/ai' },
            ].map((a) => (
              <TouchableOpacity key={a.icon} style={styles.actionBtn} onPress={() => router.push(a.route as any)} activeOpacity={0.75}>
                <View style={[styles.actionIcon, { backgroundColor: a.bg }]}>
                  <Feather name={a.icon as any} size={22} color={a.color} />
                </View>
                <Text style={[styles.actionLbl, { color: colors.foreground }]}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={[styles.section, { marginBottom: Platform.OS === 'web' ? 100 : 110 }]}>
          <View style={styles.sectionRow}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/debts')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
            </TouchableOpacity>
          </View>
          {TRANSACTIONS.map((tx) => (
            <View key={tx.id} style={[styles.txRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.txAvatar, { backgroundColor: tx.type === 'payment' ? '#DCFCE7' : '#FEF2F2' }]}>
                <Feather
                  name={tx.type === 'payment' ? 'arrow-down-left' : 'arrow-up-right'}
                  size={15}
                  color={tx.type === 'payment' ? '#16A34A' : '#EF4444'}
                />
              </View>
              <View style={styles.txInfo}>
                <Text style={[styles.txName, { color: colors.foreground }]}>{tx.customerName}</Text>
                <Text style={[styles.txDate, { color: colors.mutedForeground }]}>{tx.date}{tx.method ? ` · ${tx.method}` : ''}</Text>
              </View>
              <Text style={[styles.txAmt, { color: tx.type === 'payment' ? '#16A34A' : '#EF4444' }]}>
                {tx.type === 'payment' ? '+' : '-'}SAR {tx.amount.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: { flex: 1 },
  greeting: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
  subGreeting: { fontSize: 13, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.45)', marginTop: 2 },
  headerRight: { flexDirection: 'row', gap: 8 },
  iconBtn: {
    width: 38, height: 38,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute', top: 8, right: 8,
    width: 7, height: 7,
    backgroundColor: '#EF4444', borderRadius: 4,
    borderWidth: 1, borderColor: '#0F172A',
  },
  balanceCard: {
    backgroundColor: '#16A34A',
    margin: 16,
    borderRadius: 20,
    padding: 22,
  },
  balLbl: { fontSize: 13, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.7)' },
  balAmt: { fontSize: 38, fontFamily: 'Inter_700Bold', color: '#FFFFFF', marginTop: 4, letterSpacing: -1.5 },
  balRow: { marginTop: 8 },
  balBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  balTrend: { fontSize: 12, fontFamily: 'Inter_500Medium', color: '#DCFCE7' },
  balDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: 16 },
  balMeta: { flexDirection: 'row', alignItems: 'center' },
  balMetaVal: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#FFFFFF' },
  balMetaLbl: { fontSize: 12, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  balMetaSep: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 20 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8 },
  stat: { width: '47.5%', borderRadius: 16, padding: 14, borderWidth: 1 },
  statIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statVal: { fontSize: 17, fontFamily: 'Inter_700Bold', marginBottom: 2 },
  statLbl: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  seeAll: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  actionBtn: { alignItems: 'center', gap: 8 },
  actionIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  actionLbl: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  txRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: 12, borderRadius: 14, borderWidth: 1, marginBottom: 8,
  },
  txAvatar: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  txInfo: { flex: 1 },
  txName: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  txDate: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  txAmt: { fontSize: 14, fontFamily: 'Inter_700Bold' },
});
