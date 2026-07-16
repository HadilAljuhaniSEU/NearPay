import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import { DEBTS, Debt } from '@/data/mock';

type Filter = 'all' | 'pending' | 'overdue' | 'settled';

const STATUS = {
  pending: { color: '#F59E0B', bg: '#FFF7ED', label: 'Pending' },
  overdue: { color: '#EF4444', bg: '#FEF2F2', label: 'Overdue' },
  settled: { color: '#22C55E', bg: '#F0FDF4', label: 'Settled' },
};

function DebtRow({ item }: { item: Debt }) {
  const colors = useColors();
  const s = STATUS[item.status];
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: item.status === 'overdue' ? '#FCA5A5' : colors.border }]}>
      <View style={styles.cardTop}>
        <View style={[styles.avatar, { backgroundColor: item.status === 'overdue' ? '#FEF2F2' : '#DCFCE7' }]}>
          <Feather name={item.categoryIcon as any} size={18} color={item.status === 'overdue' ? '#EF4444' : '#16A34A'} />
        </View>
        <View style={styles.info}>
          <Text style={[styles.merchant, { color: colors.foreground }]}>{item.merchantName}</Text>
          <Text style={[styles.category, { color: colors.mutedForeground }]}>{item.category}</Text>
        </View>
        <View style={styles.right}>
          <Text style={[styles.amt, { color: colors.foreground }]}>SAR {item.amount.toLocaleString()}</Text>
          <View style={[styles.badge, { backgroundColor: s.bg }]}>
            <Text style={[styles.badgeTxt, { color: s.color }]}>{s.label}</Text>
          </View>
        </View>
      </View>
      <View style={[styles.cardBottom, { borderTopColor: colors.border }]}>
        <View style={styles.bottomLeft}>
          <Feather name="calendar" size={12} color={colors.mutedForeground} />
          <Text style={[styles.due, { color: item.status === 'overdue' ? '#EF4444' : colors.mutedForeground }]}>
            {item.status === 'overdue' ? 'Overdue · ' : 'Due '}
            {item.dueDate}
          </Text>
        </View>
        {item.status !== 'settled' && (
          <TouchableOpacity style={styles.payBtn}>
            <Text style={styles.payBtnTxt}>Pay Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function CustomerDebtsScreen() {
  const [filter, setFilter] = useState<Filter>('all');
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top + 16;

  const myDebts = DEBTS.filter((d) => d.customerId === '1');
  const filtered = filter === 'all' ? myDebts : myDebts.filter((d) => d.status === filter);
  const total = myDebts.filter((d) => d.status !== 'settled').reduce((s, d) => s + d.amount, 0);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <Text style={styles.headerTitle}>My Debts</Text>
        <View style={styles.totalBadge}>
          <Text style={styles.totalTxt}>SAR {total.toLocaleString()} owed</Text>
        </View>
      </View>

      <View style={[styles.filters, { borderBottomColor: colors.border }]}>
        {(['all', 'pending', 'overdue', 'settled'] as Filter[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterTxt, { color: filter === f ? '#fff' : colors.mutedForeground }]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DebtRow item={item} />}
        contentContainerStyle={[styles.list, { paddingBottom: Platform.OS === 'web' ? 100 : 110 }]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="check-circle" size={40} color="#22C55E" />
            <Text style={[styles.emptyTxt, { color: colors.foreground }]}>No debts found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    backgroundColor: '#0F172A', paddingHorizontal: 20, paddingBottom: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#fff' },
  totalBadge: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  totalTxt: { fontSize: 13, fontFamily: 'Inter_500Medium', color: 'rgba(255,255,255,0.75)' },
  filters: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, gap: 8, borderBottomWidth: 1 },
  filterBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  filterActive: { backgroundColor: '#0F172A' },
  filterTxt: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  list: { paddingHorizontal: 16, paddingTop: 12 },
  card: { borderRadius: 16, borderWidth: 1 },
  cardTop: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  avatar: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  info: { flex: 1 },
  merchant: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  category: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  right: { alignItems: 'flex-end' },
  amt: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  badge: { borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3, marginTop: 4 },
  badgeTxt: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  cardBottom: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1,
  },
  bottomLeft: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  due: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  payBtn: { backgroundColor: '#16A34A', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 5 },
  payBtnTxt: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: '#fff' },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTxt: { fontSize: 16, fontFamily: 'Inter_500Medium' },
});
