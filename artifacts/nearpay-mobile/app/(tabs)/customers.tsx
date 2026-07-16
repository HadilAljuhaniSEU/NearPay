import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import { CUSTOMERS, Customer } from '@/data/mock';

const RISK_CONFIG = {
  low: { color: '#22C55E', bg: '#F0FDF4', label: 'Low' },
  medium: { color: '#F59E0B', bg: '#FFF7ED', label: 'Medium' },
  high: { color: '#EF4444', bg: '#FEF2F2', label: 'High' },
};

function CustomerCard({ item }: { item: Customer }) {
  const colors = useColors();
  const r = RISK_CONFIG[item.risk];
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.avatar, { backgroundColor: item.risk === 'high' ? '#FEF2F2' : '#DCFCE7' }]}>
        <Text style={[styles.initials, { color: item.risk === 'high' ? '#EF4444' : '#16A34A' }]}>{item.initials}</Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.foreground }]}>{item.name}</Text>
        <Text style={[styles.nameEn, { color: colors.mutedForeground }]}>{item.nameEn}</Text>
        <Text style={[styles.phone, { color: colors.mutedForeground }]}>{item.phone}</Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.debtAmt, { color: colors.foreground }]}>SAR {item.totalDebt.toLocaleString()}</Text>
        <Text style={[styles.debtCount, { color: colors.mutedForeground }]}>{item.debtCount} debt{item.debtCount !== 1 ? 's' : ''}</Text>
        <View style={[styles.riskBadge, { backgroundColor: r.bg }]}>
          <View style={[styles.riskDot, { backgroundColor: r.color }]} />
          <Text style={[styles.riskTxt, { color: r.color }]}>{r.label} risk</Text>
        </View>
      </View>
    </View>
  );
}

export default function CustomersScreen() {
  const [query, setQuery] = useState('');
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top + 16;

  const filtered = query
    ? CUSTOMERS.filter(
        (c) =>
          c.name.includes(query) ||
          c.nameEn.toLowerCase().includes(query.toLowerCase()),
      )
    : CUSTOMERS;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <Text style={styles.headerTitle}>Customers</Text>
        <Text style={styles.headerCount}>{CUSTOMERS.length} total</Text>
      </View>

      <View style={[styles.searchWrap, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Search customers..."
            placeholderTextColor={colors.mutedForeground}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CustomerCard item={item} />}
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
  headerCount: { fontSize: 13, fontFamily: 'Inter_500Medium', color: 'rgba(255,255,255,0.5)' },
  searchWrap: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 14, borderWidth: 1,
    paddingHorizontal: 12, paddingVertical: 10, gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular' },
  list: { paddingHorizontal: 16, paddingTop: 12 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    padding: 14, borderRadius: 16, borderWidth: 1,
  },
  avatar: {
    width: 46, height: 46, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  initials: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  info: { flex: 1 },
  name: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  nameEn: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 1 },
  phone: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  right: { alignItems: 'flex-end' },
  debtAmt: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  debtCount: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  riskBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3, marginTop: 5,
  },
  riskDot: { width: 6, height: 6, borderRadius: 3 },
  riskTxt: { fontSize: 11, fontFamily: 'Inter_500Medium' },
});
