import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import { WEEKLY_COLLECTIONS, CUSTOMERS, MERCHANT } from '@/data/mock';

const PERIODS = ['Week', 'Month', 'Quarter'];

const maxVal = Math.max(...WEEKLY_COLLECTIONS.map((d) => d.amount));

export default function AnalyticsScreen() {
  const [period, setPeriod] = useState(0);
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top + 16;
  const botPad = Platform.OS === 'web' ? 100 : 110;

  const collectionRate = Math.round(
    (MERCHANT.settled / (MERCHANT.totalReceivables)) * 100,
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <Text style={styles.headerTitle}>Analytics</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: botPad }}>
        {/* Period Selector */}
        <View style={styles.periods}>
          {PERIODS.map((p, i) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodBtn, i === period && styles.periodActive]}
              onPress={() => setPeriod(i)}
            >
              <Text style={[styles.periodTxt, { color: i === period ? '#fff' : colors.mutedForeground }]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary Stats */}
        <View style={styles.summaryRow}>
          {[
            { label: 'Collected', value: `SAR ${MERCHANT.settled.toLocaleString()}`, color: '#22C55E' },
            { label: 'Pending', value: `SAR ${(MERCHANT.totalReceivables - MERCHANT.settled).toLocaleString()}`, color: '#F59E0B' },
          ].map((s) => (
            <View key={s.label} style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.summaryVal, { color: s.color }]}>{s.value}</Text>
              <Text style={[styles.summaryLbl, { color: colors.mutedForeground }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Bar Chart */}
        <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.chartTitle, { color: colors.foreground }]}>Daily Collections</Text>
          <Text style={[styles.chartSub, { color: colors.mutedForeground }]}>This week · SAR</Text>
          <View style={styles.chart}>
            {WEEKLY_COLLECTIONS.map((d, i) => {
              const h = Math.max(8, (d.amount / maxVal) * 120);
              const isHighest = d.amount === maxVal;
              return (
                <View key={i} style={styles.barWrap}>
                  {isHighest && (
                    <Text style={styles.barLabel}>{d.amount.toLocaleString()}</Text>
                  )}
                  <View style={[styles.bar, { height: h, backgroundColor: isHighest ? '#16A34A' : '#DCFCE7' }]} />
                  <Text style={[styles.dayLabel, { color: colors.mutedForeground }]}>{d.day}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Collection Rate */}
        <View style={[styles.rateCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.rateLeft}>
            <Text style={[styles.rateTitle, { color: colors.foreground }]}>Collection Rate</Text>
            <Text style={[styles.rateSub, { color: colors.mutedForeground }]}>Settled vs Total</Text>
          </View>
          <View style={styles.rateRight}>
            <Text style={[styles.rateValue, { color: '#16A34A' }]}>{collectionRate}%</Text>
            <View style={[styles.rateBar, { backgroundColor: colors.muted }]}>
              <View style={[styles.rateBarFill, { width: `${collectionRate}%` as any }]} />
            </View>
          </View>
        </View>

        {/* Top Debtors */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Top Debtors</Text>
          {CUSTOMERS.slice().sort((a, b) => b.totalDebt - a.totalDebt).slice(0, 4).map((c, i) => (
            <View key={c.id} style={[styles.debtorRow, i < 3 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}>
              <View style={[styles.rank, { backgroundColor: i === 0 ? '#16A34A' : colors.muted }]}>
                <Text style={[styles.rankNum, { color: i === 0 ? '#fff' : colors.mutedForeground }]}>{i + 1}</Text>
              </View>
              <View style={styles.debtorInfo}>
                <Text style={[styles.debtorName, { color: colors.foreground }]}>{c.name}</Text>
                <Text style={[styles.debtorCount, { color: colors.mutedForeground }]}>{c.debtCount} debts</Text>
              </View>
              <Text style={[styles.debtorAmt, { color: c.risk === 'high' ? '#EF4444' : colors.foreground }]}>
                SAR {c.totalDebt.toLocaleString()}
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
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#fff' },
  periods: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 14 },
  periodBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'transparent' },
  periodActive: { backgroundColor: '#0F172A' },
  periodTxt: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  summaryRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginBottom: 12 },
  summaryCard: {
    flex: 1, borderRadius: 16, borderWidth: 1,
    padding: 16, alignItems: 'center',
  },
  summaryVal: { fontSize: 18, fontFamily: 'Inter_700Bold', marginBottom: 4 },
  summaryLbl: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  chartCard: {
    marginHorizontal: 16, borderRadius: 18, borderWidth: 1,
    padding: 18, marginBottom: 12,
  },
  chartTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  chartSub: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2, marginBottom: 20 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 150 },
  barWrap: { alignItems: 'center', flex: 1, justifyContent: 'flex-end', gap: 6 },
  barLabel: { fontSize: 10, fontFamily: 'Inter_600SemiBold', color: '#16A34A' },
  bar: { width: 28, borderRadius: 6 },
  dayLabel: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  rateCard: {
    marginHorizontal: 16, borderRadius: 18, borderWidth: 1,
    padding: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 12,
  },
  rateLeft: { flex: 1 },
  rateTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  rateSub: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  rateRight: { alignItems: 'flex-end' },
  rateValue: { fontSize: 26, fontFamily: 'Inter_700Bold', marginBottom: 6 },
  rateBar: { width: 80, height: 6, borderRadius: 3, overflow: 'hidden' },
  rateBarFill: { height: '100%', backgroundColor: '#16A34A', borderRadius: 3 },
  section: { marginHorizontal: 16, borderRadius: 18, borderWidth: 1, overflow: 'hidden' },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', padding: 16, paddingBottom: 12 },
  debtorRow: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  rank: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rankNum: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  debtorInfo: { flex: 1 },
  debtorName: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  debtorCount: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  debtorAmt: { fontSize: 14, fontFamily: 'Inter_700Bold' },
});
