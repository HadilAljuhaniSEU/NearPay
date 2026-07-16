import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { MERCHANT } from '@/data/mock';

export default function SettingsScreen() {
  const [notifs, setNotifs] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [sms, setSms] = useState(false);
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const topPad = Platform.OS === 'web' ? 67 : insets.top + 16;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: botPad + 24 }}>
        {/* Profile */}
        <View style={[styles.profileCard, { backgroundColor: '#0F172A' }]}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitials}>AK</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{MERCHANT.name}</Text>
            <Text style={styles.profileNameEn}>{MERCHANT.nameEn}</Text>
            <Text style={styles.profilePhone}>{MERCHANT.phone}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Feather name="edit-2" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Business Info */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>BUSINESS</Text>
          {[
            { icon: 'briefcase', label: 'Business Name', value: MERCHANT.nameEn },
            { icon: 'tag', label: 'Category', value: MERCHANT.category },
            { icon: 'map-pin', label: 'City', value: MERCHANT.city },
            { icon: 'phone', label: 'Phone', value: MERCHANT.phone },
          ].map((row, i, arr) => (
            <View
              key={row.label}
              style={[styles.row, i < arr.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}
            >
              <View style={[styles.rowIcon, { backgroundColor: '#DCFCE7' }]}>
                <Feather name={row.icon as any} size={16} color="#16A34A" />
              </View>
              <View style={styles.rowInfo}>
                <Text style={[styles.rowLabel, { color: colors.mutedForeground }]}>{row.label}</Text>
                <Text style={[styles.rowValue, { color: colors.foreground }]}>{row.value}</Text>
              </View>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </View>
          ))}
        </View>

        {/* Notifications */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>NOTIFICATIONS</Text>
          {[
            { label: 'Push Notifications', sub: 'Debt & payment alerts', value: notifs, set: setNotifs },
            { label: 'Payment Reminders', sub: 'Auto-send to customers', value: reminders, set: setReminders },
            { label: 'SMS Alerts', sub: 'Text message reminders', value: sms, set: setSms },
          ].map((row, i, arr) => (
            <View
              key={row.label}
              style={[styles.row, i < arr.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}
            >
              <View style={styles.rowInfo}>
                <Text style={[styles.rowValue, { color: colors.foreground }]}>{row.label}</Text>
                <Text style={[styles.rowLabel, { color: colors.mutedForeground }]}>{row.sub}</Text>
              </View>
              <Switch
                value={row.value}
                onValueChange={row.set}
                trackColor={{ false: colors.border, true: '#16A34A' }}
                thumbColor="#fff"
              />
            </View>
          ))}
        </View>

        {/* About */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>NEARPAY</Text>
          {[
            { icon: 'info', label: 'Version', value: '1.0.0 · MVP' },
            { icon: 'shield', label: 'Privacy Policy', chevron: true },
            { icon: 'file-text', label: 'Terms of Service', chevron: true },
            { icon: 'mail', label: 'Support', value: 'support@nearpay.sa' },
          ].map((row, i, arr) => (
            <View
              key={row.label}
              style={[styles.row, i < arr.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}
            >
              <View style={[styles.rowIcon, { backgroundColor: colors.muted }]}>
                <Feather name={row.icon as any} size={16} color={colors.mutedForeground} />
              </View>
              <View style={styles.rowInfo}>
                <Text style={[styles.rowValue, { color: colors.foreground }]}>{row.label}</Text>
                {row.value && <Text style={[styles.rowLabel, { color: colors.mutedForeground }]}>{row.value}</Text>}
              </View>
              {row.chevron && <Feather name="chevron-right" size={16} color={colors.mutedForeground} />}
            </View>
          ))}
        </View>

        {/* Logout */}
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
  profileCard: {
    margin: 16, borderRadius: 18, padding: 18,
    flexDirection: 'row', alignItems: 'center',
  },
  profileAvatar: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: '#16A34A', alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  profileInitials: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#fff' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 17, fontFamily: 'Inter_700Bold', color: '#fff' },
  profileNameEn: { fontSize: 13, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  profilePhone: { fontSize: 12, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.45)', marginTop: 2 },
  editBtn: {
    width: 34, height: 34,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10, alignItems: 'center', justifyContent: 'center',
  },
  section: {
    marginHorizontal: 16, marginBottom: 12,
    borderRadius: 18, borderWidth: 1, overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 11, fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.8, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8,
  },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  rowIcon: {
    width: 34, height: 34, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  rowInfo: { flex: 1 },
  rowLabel: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 1 },
  rowValue: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginHorizontal: 16, marginTop: 4,
    backgroundColor: '#FEF2F2', borderRadius: 16, padding: 16,
  },
  logoutTxt: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#EF4444' },
});
