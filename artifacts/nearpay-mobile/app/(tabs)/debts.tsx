import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import { DEBTS, Debt } from '@/data/mock';

type Filter = 'all' | 'pending' | 'overdue' | 'settled';

const STATUS_CONFIG = {
  pending: { color: '#F59E0B', bg: '#FFF7ED', label: 'Pending' },
  overdue: { color: '#EF4444', bg: '#FEF2F2', label: 'Overdue' },
  settled: { color: '#22C55E', bg: '#F0FDF4', label: 'Settled' },
};

function DebtCard({ item }: { item: Debt }) {
  const colors = useColors();
  const s = STATUS_CONFIG[item.status];
  const isOverdue = item.status === 'overdue';
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: isOverdue ? '#FCA5A5' : colors.border }]}>
      <View style={styles.cardTop}>
        <View style={[styles.avatar, { backgroundColor: isOverdue ? '#FEF2F2' : '#DCFCE7' }]}>
          <Feather name={item.categoryIcon as any} size={18} color={isOverdue ? '#EF4444' : '#16A34A'} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardName, { color: colors.foreground }]}>{item.customerName}</Text>
          <Text style={[styles.cardCat, { color: colors.mutedForeground }]}>{item.category} · {item.createdAt}</Text>
        </View>
        <View>
          <Text style={[styles.cardAmt, { color: item.status === 'settled' ? '#22C55E' : colors.foreground }]}>
            SAR {item.amount.toLocaleString()}
          </Text>
          <View style={[styles.badge, { backgroundColor: s.bg }]}>
            <Text style={[styles.badgeTxt, { color: s.color }]}>{s.label}</Text>
          </View>
        </View>
      </View>
      <View style={[styles.cardBottom, { borderTopColor: colors.border }]}>
        <Feather name="calendar" size={13} color={colors.mutedForeground} />
        <Text style={[styles.dueText, { color: isOverdue ? '#EF4444' : colors.mutedForeground }]}>
          {isOverdue ? 'Overdue · ' : 'Due '}
          {item.dueDate}
        </Text>
      </View>
    </View>
  );
}

export default function DebtsScreen() {
  const [filter, setFilter] = useState<Filter>('all');
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top + 16;

  const filtered = filter === 'all' ? DEBTS : DEBTS.filter((d) => d.status === filter);
  const counts = {
    all: DEBTS.length,
    pending: DEBTS.filter((d) => d.status === 'pending').length,
    overdue: DEBTS.filter((d) => d.status === 'overdue').length,
    settled: DEBTS.filter((d) => d.status === 'settled').length,
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <Text style={styles.headerTitle}>Debts</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Feather name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={[styles.filters, { borderBottomColor: colors.border }]}>
        {(['all', 'pending', 'overdue', 'settled'] as Filter[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterTxt, { color: filter === f ? '#fff' : colors.mutedForeground }]}>
              {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DebtCard item={item} />}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === 'web' ? 100 : 110 },
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#fff' },
  addBtn: {
    width: 36, height: 36,
    backgroundColor: '#16A34A',
    borderRadius: 11, alignItems: 'center', justifyContent: 'center',
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 1,
  },
  filterBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: 'transparent' },
  filterActive: { backgroundColor: '#0F172A' },
  filterTxt: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  list: { paddingHorizontal: 16, paddingTop: 12 },
  card: { borderRadius: 16, borderWidth: 1 },
  cardTop: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  avatar: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  cardCat: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  cardAmt: { fontSize: 15, fontFamily: 'Inter_700Bold', textAlign: 'right' },
  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginTop: 4, alignSelf: 'flex-end' },
  badgeTxt: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  cardBottom: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1 },
  dueText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
});
