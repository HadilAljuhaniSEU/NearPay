import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import { NEARBY_MERCHANTS, NearbyMerchant } from '@/data/mock';

function MerchantCard({ item }: { item: NearbyMerchant }) {
  const [tabStarted, setTabStarted] = useState(!!item.totalDebt);
  const colors = useColors();

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardTop}>
        <View style={[styles.avatar, { backgroundColor: '#DCFCE7' }]}>
          <Feather name={item.categoryIcon as any} size={20} color="#16A34A" />
        </View>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: colors.foreground }]}>{item.name}</Text>
            {item.verified && (
              <View style={styles.verifiedBadge}>
                <Feather name="check" size={9} color="#fff" />
              </View>
            )}
          </View>
          <Text style={[styles.nameEn, { color: colors.mutedForeground }]}>{item.nameEn}</Text>
          <Text style={[styles.category, { color: colors.mutedForeground }]}>{item.category}</Text>
        </View>
        <View style={styles.right}>
          <View style={styles.ratingRow}>
            <Feather name="star" size={12} color="#F59E0B" />
            <Text style={[styles.rating, { color: colors.foreground }]}>{item.rating}</Text>
          </View>
          <View style={styles.distRow}>
            <Feather name="map-pin" size={11} color={colors.mutedForeground} />
            <Text style={[styles.dist, { color: colors.mutedForeground }]}>{item.distance}</Text>
          </View>
        </View>
      </View>

      {tabStarted && item.totalDebt && (
        <View style={[styles.tabBar, { backgroundColor: '#FFF7ED', borderTopColor: colors.border }]}>
          <Feather name="credit-card" size={13} color="#F59E0B" />
          <Text style={styles.tabTxt}>Open tab · SAR {item.totalDebt.toLocaleString()} owed</Text>
        </View>
      )}

      <View style={[styles.cardBottom, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.btn, tabStarted ? styles.btnSecondary : styles.btnPrimary]}
          onPress={() => setTabStarted(true)}
        >
          <Feather
            name={tabStarted ? 'eye' : 'plus-circle'}
            size={15}
            color={tabStarted ? '#16A34A' : '#fff'}
          />
          <Text style={[styles.btnTxt, { color: tabStarted ? '#16A34A' : '#fff' }]}>
            {tabStarted ? 'View Tab' : 'Start Tab'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnGhost, { borderColor: colors.border }]}>
          <Feather name="navigation" size={15} color={colors.foreground} />
          <Text style={[styles.btnTxt, { color: colors.foreground }]}>Directions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function NearbyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top + 16;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <View>
          <Text style={styles.headerTitle}>Nearby</Text>
          <View style={styles.locRow}>
            <Feather name="map-pin" size={12} color="rgba(255,255,255,0.5)" />
            <Text style={styles.locTxt}>Riyadh, Al Malaz</Text>
          </View>
        </View>
        <View style={styles.headerBadge}>
          <Feather name="wifi" size={13} color="#22C55E" />
          <Text style={styles.headerBadgeTxt}>{NEARBY_MERCHANTS.length} nearby</Text>
        </View>
      </View>

      <FlatList
        data={NEARBY_MERCHANTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MerchantCard item={item} />}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === 'web' ? 100 : 110 },
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    backgroundColor: '#0F172A', paddingHorizontal: 20, paddingBottom: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
  },
  headerTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#fff' },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  locTxt: { fontSize: 12, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.5)' },
  headerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(34,197,94,0.15)', borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  headerBadgeTxt: { fontSize: 12, fontFamily: 'Inter_500Medium', color: '#22C55E' },
  list: { padding: 16 },
  card: { borderRadius: 18, borderWidth: 1 },
  cardTop: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  avatar: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  verifiedBadge: { width: 16, height: 16, backgroundColor: '#16A34A', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  nameEn: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 1 },
  category: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 1 },
  right: { alignItems: 'flex-end', gap: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  rating: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  distRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  dist: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  tabBar: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1 },
  tabTxt: { fontSize: 12, fontFamily: 'Inter_500Medium', color: '#F59E0B' },
  cardBottom: {
    flexDirection: 'row', gap: 8,
    paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: 1,
  },
  btn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 12, paddingVertical: 10 },
  btnPrimary: { backgroundColor: '#16A34A' },
  btnSecondary: { backgroundColor: '#DCFCE7' },
  btnGhost: { borderWidth: 1 },
  btnTxt: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
});
