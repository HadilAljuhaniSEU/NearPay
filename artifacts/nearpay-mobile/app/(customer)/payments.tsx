import React from 'react';
import {
  View, Text, StyleSheet, FlatList, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import { TRANSACTIONS } from '@/data/mock';

const METHOD_ICONS: Record<string, string> = {
  'Apple Pay': 'smartphone',
  'STC Pay': 'smartphone',
  Cash: 'dollar-sign',
};

export default function PaymentsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top + 16;

  const payments = TRANSACTIONS.filter((t) => t.type === 'payment');
  const totalPaid = payments.reduce((s, t) => s + t.amount, 0);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <Text style={styles.headerTitle}>Payments</Text>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={[styles.summaryCard, { backgroundColor: '#16A34A' }]}>
          <Text style={styles.summaryLbl}>Total Paid</Text>
          <Text style={styles.summaryAmt}>SAR {totalPaid.toLocaleString()}</Text>
          <Text style={styles.summaryPeriod}>Last 30 days</Text>
        </View>
        <View style={[styles.summaryMini, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="check-circle" size={18} color="#22C55E" />
          <Text style={[styles.miniVal, { color: colors.foreground }]}>{payments.length}</Text>
          <Text style={[styles.miniLbl, { color: colors.mutedForeground }]}>Payments</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Transaction History</Text>

      <FlatList
        data={payments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.iconWrap}>
              <Feather
                name={(METHOD_ICONS[item.method ?? ''] ?? 'credit-card') as any}
                size={17}
                color="#16A34A"
              />
            </View>
            <View style={styles.rowInfo}>
              <Text style={[styles.rowMerchant, { color: colors.foreground }]}>{item.merchantName}</Text>
              <Text style={[styles.rowMeta, { color: colors.mutedForeground }]}>
                {item.date}{item.method ? ` · ${item.method}` : ''}
              </Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.rowAmt}>+SAR {item.amount.toLocaleString()}</Text>
              <View style={styles.rowBadge}>
                <Text style={styles.rowBadgeTxt}>Paid</Text>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === 'web' ? 100 : 110 },
        ]}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="inbox" size={36} color="#9CA3AF" />
            <Text style={[styles.emptyTxt, { color: colors.mutedForeground }]}>No payments yet</Text>
          </View>
        }
      />
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
  summary: { flexDirection: 'row', gap: 12, padding: 16 },
  summaryCard: { flex: 1, borderRadius: 18, padding: 18 },
  summaryLbl: { fontSize: 13, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.7)' },
  summaryAmt: { fontSize: 28, fontFamily: 'Inter_700Bold', color: '#fff', marginTop: 4, letterSpacing: -1 },
  summaryPeriod: { fontSize: 12, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.55)', marginTop: 4 },
  summaryMini: {
    width: 90, borderRadius: 18, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center', padding: 14, gap: 4,
  },
  miniVal: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  miniLbl: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  sectionTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold', paddingHorizontal: 16, marginBottom: 10 },
  list: { paddingHorizontal: 16 },
  row: {
    flexDirection: 'row', alignItems: 'center',
    padding: 14, borderRadius: 16, borderWidth: 1,
  },
  iconWrap: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  rowInfo: { flex: 1 },
  rowMerchant: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  rowMeta: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  rowRight: { alignItems: 'flex-end', gap: 4 },
  rowAmt: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#16A34A' },
  rowBadge: { backgroundColor: '#DCFCE7', borderRadius: 7, paddingHorizontal: 8, paddingVertical: 2 },
  rowBadgeTxt: { fontSize: 11, fontFamily: 'Inter_500Medium', color: '#16A34A' },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTxt: { fontSize: 15, fontFamily: 'Inter_500Medium' },
});
