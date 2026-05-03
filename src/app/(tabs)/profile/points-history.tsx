import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useRouter } from 'expo-router';

type FilterType = 'All' | 'Earned' | 'Spent';

const TRANSACTIONS = [
  {
    id: 1,
    title: '7-Day Streak Bonus',
    date: 'Oct 24, 2023',
    xp: 150,
    type: 'earned' as const,
    iconBg: '#fef3c7',
    icon: 'fire' as const,
    iconColor: '#ab3500',
  },
  {
    id: 2,
    title: 'Redeemed Organic Treats',
    date: 'Oct 22, 2023',
    xp: -500,
    type: 'spent' as const,
    iconBg: '#c7dbff',
    icon: 'paw' as const,
    iconColor: '#4c5f7e',
  },
  {
    id: 3,
    title: 'Morning Health Log',
    date: 'Oct 21, 2023',
    xp: 25,
    type: 'earned' as const,
    iconBg: 'rgba(0,167,203,0.1)',
    icon: 'heart' as const,
    iconColor: '#00677e',
  },
  {
    id: 4,
    title: 'Level 5 Achievement',
    date: 'Oct 19, 2023',
    xp: 1000,
    type: 'earned' as const,
    iconBg: '#fef3c7',
    icon: 'star-circle' as const,
    iconColor: '#ab3500',
  },
  {
    id: 5,
    title: 'Vet Consultation Discount',
    date: 'Oct 15, 2023',
    xp: -1200,
    type: 'spent' as const,
    iconBg: '#c7dbff',
    icon: 'medical-bag' as const,
    iconColor: '#4c5f7e',
  },
];

export default function PointsHistoryScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('All');

  const filtered = TRANSACTIONS.filter(t => {
    if (filter === 'Earned') return t.xp > 0;
    if (filter === 'Spent') return t.xp < 0;
    return true;
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#ab3500" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Points History</Text>
        </View>
        <TouchableOpacity>
          <MaterialCommunityIcons name="help-circle-outline" size={22} color="#ab3500" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* BALANCE HERO */}
        <LinearGradient
          colors={['#ab3500', '#FF6B35']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <View style={styles.balanceDecor} />
          <View style={styles.balanceContent}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceNumber}>2,450</Text>
              <Text style={styles.balanceUnit}>XP</Text>
            </View>
          </View>
          <MaterialCommunityIcons
            name="star-four-points"
            size={140}
            color="rgba(255,255,255,0.15)"
            style={styles.balanceBgIcon}
          />
        </LinearGradient>

        {/* FILTER TABS */}
        <View style={styles.filterRow}>
          {(['All', 'Earned', 'Spent'] as FilterType[]).map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterTab, filter === f && styles.filterTabActive]}
              onPress={() => setFilter(f)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* TRANSACTIONS */}
        <View style={styles.transactionsSection}>
          <Text style={styles.sectionLabel}>RECENT ACTIVITY</Text>
          <View style={styles.transactionsList}>
            {filtered.map(t => (
              <TouchableOpacity key={t.id} style={styles.transactionCard} activeOpacity={0.8}>
                <View style={[styles.txIconBox, { backgroundColor: t.iconBg }]}>
                  <MaterialCommunityIcons name={t.icon} size={22} color={t.iconColor} />
                </View>
                <View style={styles.txContent}>
                  <Text style={styles.txTitle}>{t.title}</Text>
                  <Text style={styles.txDate}>{t.date}</Text>
                </View>
                <View style={styles.txAmount}>
                  <Text style={[
                    styles.txXp,
                    { color: t.xp > 0 ? '#16a34a' : '#4c5f7e' }
                  ]}>
                    {t.xp > 0 ? '+' : ''}{t.xp.toLocaleString()}
                  </Text>
                  <Text style={styles.txXpUnit}>XP</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fbf9f6' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fbf9f6',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#ab3500' },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },
  balanceCard: {
    borderRadius: 24, padding: 28, marginBottom: 20,
    overflow: 'hidden', position: 'relative',
    shadowColor: '#ab3500', shadowOpacity: 0.25,
    shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 6,
  },
  balanceDecor: {
    position: 'absolute', right: -30, bottom: -30,
    width: 150, height: 150, borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  balanceContent: { position: 'relative', zIndex: 1 },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)', fontSize: 11,
    fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6,
  },
  balanceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  balanceNumber: { fontSize: 48, fontWeight: '800', color: '#fff', lineHeight: 56 },
  balanceUnit: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 8 },
  balanceBgIcon: {
    position: 'absolute', right: -20, bottom: -20,
  },
  filterRow: {
    flexDirection: 'row', backgroundColor: '#f5f3f0',
    borderRadius: 999, padding: 4, marginBottom: 24, gap: 4,
  },
  filterTab: {
    flex: 1, paddingVertical: 10, borderRadius: 999,
    alignItems: 'center',
  },
  filterTabActive: { backgroundColor: '#ffffff', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  filterText: { fontSize: 13, fontWeight: '700', color: '#594139' },
  filterTextActive: { color: '#ab3500' },
  transactionsSection: { gap: 12 },
  sectionLabel: {
    fontSize: 11, fontWeight: '800', color: '#344765',
    letterSpacing: 1.5, textTransform: 'uppercase', paddingHorizontal: 4,
  },
  transactionsList: { gap: 10 },
  transactionCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#ffffff', borderRadius: 20, padding: 14,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  txIconBox: {
    width: 48, height: 48, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  txContent: { flex: 1 },
  txTitle: { fontSize: 14, fontWeight: '700', color: '#1b1c1a', marginBottom: 2 },
  txDate: { fontSize: 11, color: '#594139' },
  txAmount: { alignItems: 'flex-end' },
  txXp: { fontSize: 18, fontWeight: '800' },
  txXpUnit: { fontSize: 9, fontWeight: '700', color: '#594139', letterSpacing: 0.5 },
});
