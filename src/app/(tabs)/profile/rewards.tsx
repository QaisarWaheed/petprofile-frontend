import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 52) / 2;

const CATEGORIES = ['All', 'Toys', 'Treats', 'Services'];

const PRODUCTS = [
  { id: 1, title: 'Organic Treats', xp: 500, locked: false, emoji: '🦴' },
  { id: 2, title: 'Plush Squeaker', xp: 850, locked: false, emoji: '🧸' },
  { id: 3, title: 'Full Grooming', xp: 3500, locked: true, emoji: '✂️' },
  { id: 4, title: 'Smart Cam', xp: 10000, locked: true, emoji: '📷' },
  { id: 5, title: 'Rope Tug Toy', xp: 400, locked: false, emoji: '🪢' },
  { id: 6, title: 'Dental Chews', xp: 600, locked: false, emoji: '🦷' },
];

export default function RewardsStoreScreen() {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialCommunityIcons name="gift" size={22} color="#ab3500" />
          <Text style={styles.headerTitle}>Rewards Store</Text>
        </View>
        <View style={styles.avatarCircle}>
          <MaterialCommunityIcons name="account" size={20} color="#ab3500" />
        </View>
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
          <MaterialCommunityIcons name="cash-multiple" size={44} color="#fff" style={{ marginBottom: 8 }} />
          <Text style={styles.balanceLabel}>YOUR BALANCE</Text>
          <Text style={styles.balanceAmount}>2,450 XP</Text>
          <View style={styles.levelPill}>
            <MaterialCommunityIcons name="trending-up" size={14} color="#fff" />
            <Text style={styles.levelText}>Level 12 Explorer</Text>
          </View>
        </LinearGradient>

        {/* CATEGORY FILTER */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, activeCategory === cat && styles.categoryChipActive]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.8}
            >
              <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* PRODUCT GRID */}
        <View style={styles.productGrid}>
          {PRODUCTS.map(product => (
            <View key={product.id} style={[styles.productCard, product.locked && styles.productCardLocked]}>
              {/* Emoji placeholder for image */}
              <View style={styles.productImageBox}>
                <Text style={styles.productEmoji}>{product.emoji}</Text>
                {product.locked && (
                  <View style={styles.lockOverlay}>
                    <MaterialCommunityIcons name="lock" size={28} color="#594139" />
                    <Text style={styles.lockLabel}>LOCKED</Text>
                    <Text style={styles.lockSub}>More XP needed</Text>
                  </View>
                )}
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productTitle}>{product.title}</Text>
                <View style={styles.productXpRow}>
                  <MaterialCommunityIcons
                    name="star-circle"
                    size={14}
                    color={product.locked ? '#8d7168' : '#ab3500'}
                  />
                  <Text style={[styles.productXp, product.locked && styles.productXpLocked]}>
                    {product.xp.toLocaleString()} XP
                  </Text>
                </View>
                {!product.locked && (
                  <TouchableOpacity style={styles.redeemBtn} activeOpacity={0.85}>
                    <Text style={styles.redeemBtnText}>Redeem</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* BONUS BANNER */}
        <View style={styles.bonusBanner}>
          <View style={styles.bonusContent}>
            <Text style={styles.bonusTitle}>Double XP Weekend!</Text>
            <Text style={styles.bonusSub}>
              Complete any daily activity to earn 2x the rewards today.
            </Text>
            <TouchableOpacity style={styles.bonusBtn}>
              <Text style={styles.bonusBtnText}>View Tasks</Text>
            </TouchableOpacity>
          </View>
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={72}
            color="#00a7cb"
            style={{ opacity: 0.7, transform: [{ rotate: '12deg' }] }}
          />
        </View>

        <View style={{ height: 100 }} />
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
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#ab3500' },
  avatarCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#eae8e5', alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },
  balanceCard: {
    borderRadius: 24, padding: 28,
    alignItems: 'center', marginBottom: 20,
    overflow: 'hidden', position: 'relative',
    shadowColor: '#ab3500', shadowOpacity: 0.25,
    shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 6,
  },
  balanceDecor: {
    position: 'absolute', right: -30, top: -30,
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)', fontSize: 11,
    fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4,
  },
  balanceAmount: { fontSize: 36, fontWeight: '800', color: '#fff', marginBottom: 12 },
  levelPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6,
  },
  levelText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  categories: { gap: 10, paddingBottom: 4, marginBottom: 20 },
  categoryChip: {
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999,
    backgroundColor: '#f5f3f0',
  },
  categoryChipActive: { backgroundColor: '#ab3500' },
  categoryText: { fontSize: 14, fontWeight: '700', color: '#594139' },
  categoryTextActive: { color: '#ffffff' },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  productCard: {
    width: CARD_SIZE, backgroundColor: '#ffffff', borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  productCardLocked: { opacity: 0.75 },
  productImageBox: {
    width: '100%', aspectRatio: 1, backgroundColor: '#f5f3f0',
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  productEmoji: { fontSize: 52 },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center', justifyContent: 'center', gap: 2,
  },
  lockLabel: { fontSize: 10, fontWeight: '800', color: '#594139', letterSpacing: 1 },
  lockSub: { fontSize: 9, color: '#594139' },
  productInfo: { padding: 12, gap: 6 },
  productTitle: { fontSize: 13, fontWeight: '700', color: '#1b1c1a' },
  productXpRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  productXp: { fontSize: 13, fontWeight: '700', color: '#ab3500' },
  productXpLocked: { color: '#8d7168' },
  redeemBtn: {
    backgroundColor: '#c7dbff', borderRadius: 999,
    paddingVertical: 8, alignItems: 'center', marginTop: 2,
  },
  redeemBtnText: { fontSize: 13, fontWeight: '700', color: '#4d607f' },
  bonusBanner: {
    backgroundColor: 'rgba(181,235,255,0.25)',
    borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: 'rgba(0,167,203,0.2)',
    flexDirection: 'row', alignItems: 'center', gap: 12,
    overflow: 'hidden',
  },
  bonusContent: { flex: 1, gap: 6 },
  bonusTitle: { fontSize: 17, fontWeight: '800', color: '#003744' },
  bonusSub: { fontSize: 12, color: '#004e60', lineHeight: 18 },
  bonusBtn: {
    backgroundColor: '#00a7cb', borderRadius: 999,
    paddingHorizontal: 16, paddingVertical: 8, alignSelf: 'flex-start', marginTop: 4,
  },
  bonusBtnText: { fontSize: 12, fontWeight: '700', color: '#fff' },
});
