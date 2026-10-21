import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';

const MEALS = [
  { brand: 'Blue Buffalo Life Protection', portion: '1.5 cups', time: '08:30 AM', kcal: 420, emoji: '🥣' },
  { brand: 'Royal Canin Gastrointestinal', portion: '1.2 cups', time: '01:15 PM', kcal: 430, emoji: '🍽️' },
];

const NUTRIENTS = [
  { label: 'Protein', current: 45, total: 60, color: '#FF6B35' },
  { label: 'Fats', current: 22, total: 35, color: '#00a7cb' },
  { label: 'Carbs', current: 85, total: 110, color: '#2ECC71' },
];

const TOTAL_KCAL = 1200;
const CONSUMED = 850;
const REMAINING = TOTAL_KCAL - CONSUMED;
const RADIUS = 88;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const PROGRESS = CONSUMED / TOTAL_KCAL;
const STROKE_OFFSET = CIRCUMFERENCE * (1 - PROGRESS);

export default function NutritionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarCircle}>
            <MaterialCommunityIcons name="dog" size={20} color="#ab3500" />
          </View>
          <Text style={styles.headerTitle}>Nutrition</Text>
        </View>
        <TouchableOpacity>
          <MaterialCommunityIcons name="calendar-today" size={22} color="#4c5f7e" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* TODAY'S NUTRITION */}
        <View style={styles.nutritionCard}>
          <View style={styles.nutritionBgDecor} />
          <Text style={styles.nutritionCardTitle}>TODAY'S NUTRITION</Text>

          {/* Circular progress */}
          <View style={styles.circleWrapper}>
            <Svg width={200} height={200} viewBox="0 0 200 200">
              <Circle
                cx="100"
                cy="100"
                r={RADIUS}
                fill="transparent"
                stroke="#eae8e5"
                strokeWidth={12}
              />
              <Circle
                cx="100"
                cy="100"
                r={RADIUS}
                fill="transparent"
                stroke="#FF6B35"
                strokeWidth={12}
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={STROKE_OFFSET}
                strokeLinecap="round"
                rotation="-90"
                origin="100, 100"
              />
            </Svg>
            <View style={styles.circleCenter}>
              <Text style={styles.kcalNumber}>{CONSUMED}</Text>
              <Text style={styles.kcalLabel}>/ {TOTAL_KCAL} kcal</Text>
            </View>
          </View>

          <View style={styles.kcalRow}>
            <View style={styles.kcalCard}>
              <Text style={styles.kcalCardLabel}>REMAINING</Text>
              <Text style={[styles.kcalCardValue, { color: '#ab3500' }]}>{REMAINING} kcal</Text>
            </View>
            <View style={styles.kcalCard}>
              <Text style={styles.kcalCardLabel}>BURNED</Text>
              <Text style={styles.kcalCardValue}>120 kcal</Text>
            </View>
          </View>
        </View>

        {/* CALORIE CALCULATOR CTA */}
        <LinearGradient
          colors={['#ab3500', '#FF6B35']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.calcBtn}
        >
          <TouchableOpacity style={styles.calcBtnInner} activeOpacity={0.85}>
            <MaterialCommunityIcons name="calculator" size={20} color="#fff" />
            <Text style={styles.calcBtnText}>Calorie Calculator</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* MEAL SUMMARY */}
        <View style={styles.mealSection}>
          <View style={styles.mealHeader}>
            <Text style={styles.mealTitle}>Meal Summary</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.mealList}>
            {MEALS.map((meal, i) => (
              <View key={i} style={styles.mealCard}>
                <View style={styles.mealIconBox}>
                  <Text style={styles.mealEmoji}>{meal.emoji}</Text>
                </View>
                <View style={styles.mealContent}>
                  <Text style={styles.mealBrand}>{meal.brand}</Text>
                  <Text style={styles.mealMeta}>Portion: {meal.portion} • {meal.time}</Text>
                </View>
                <Text style={styles.mealKcal}>{meal.kcal} kcal</Text>
              </View>
            ))}
          </View>
        </View>

        {/* NUTRITIONAL BREAKDOWN */}
        <View style={styles.breakdownCard}>
          <Text style={styles.breakdownTitle}>Nutritional Breakdown</Text>
          <View style={styles.breakdownList}>
            {NUTRIENTS.map((n, i) => (
              <View key={i} style={styles.nutrientRow}>
                <View style={styles.nutrientLabels}>
                  <Text style={styles.nutrientLabel}>{n.label}</Text>
                  <Text style={styles.nutrientValue}>{n.current}g / {n.total}g</Text>
                </View>
                <View style={styles.nutrientTrack}>
                  <View style={[
                    styles.nutrientFill,
                    { width: `${(n.current / n.total) * 100}%` as any, backgroundColor: n.color }
                  ]} />
                </View>
              </View>
            ))}
          </View>
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
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#efeeeb', borderWidth: 2, borderColor: 'rgba(171,53,0,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#ab3500' },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },
  nutritionCard: {
    backgroundColor: '#ffffff', borderRadius: 24, padding: 24,
    marginBottom: 16, alignItems: 'center', position: 'relative', overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 }, elevation: 3,
  },
  nutritionBgDecor: {
    position: 'absolute', top: -40, right: -40,
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(171,53,0,0.04)',
  },
  nutritionCardTitle: {
    fontSize: 11, fontWeight: '800', color: '#4c5f7e',
    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 20, alignSelf: 'flex-start',
  },
  circleWrapper: { width: 200, height: 200, position: 'relative', alignItems: 'center', justifyContent: 'center' },
  circleCenter: { position: 'absolute', alignItems: 'center' },
  kcalNumber: { fontSize: 36, fontWeight: '800', color: '#1b1c1a' },
  kcalLabel: { fontSize: 12, fontWeight: '700', color: '#4c5f7e', textTransform: 'uppercase', letterSpacing: 0.5 },
  kcalRow: { flexDirection: 'row', gap: 12, width: '100%', marginTop: 20 },
  kcalCard: {
    flex: 1, backgroundColor: '#f5f3f0', borderRadius: 16,
    padding: 14, alignItems: 'center', gap: 4,
  },
  kcalCardLabel: { fontSize: 10, fontWeight: '800', color: '#594139', textTransform: 'uppercase', letterSpacing: 0.5 },
  kcalCardValue: { fontSize: 18, fontWeight: '700', color: '#1b1c1a' },
  calcBtn: { borderRadius: 999, marginBottom: 24 },
  calcBtnInner: {
    height: 54, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10, borderRadius: 999,
  },
  calcBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  mealSection: { marginBottom: 20 },
  mealHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  mealTitle: { fontSize: 20, fontWeight: '800', color: '#4c5f7e' },
  seeAll: { fontSize: 13, fontWeight: '700', color: '#ab3500' },
  mealList: { gap: 10 },
  mealCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#ffffff', borderRadius: 20, padding: 14,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 1,
  },
  mealIconBox: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: '#efeeeb', alignItems: 'center', justifyContent: 'center',
  },
  mealEmoji: { fontSize: 24 },
  mealContent: { flex: 1 },
  mealBrand: { fontSize: 13, fontWeight: '700', color: '#1b1c1a', marginBottom: 2 },
  mealMeta: { fontSize: 11, color: '#594139' },
  mealKcal: { fontSize: 13, fontWeight: '800', color: '#1b1c1a' },
  breakdownCard: {
    backgroundColor: '#4c5f7e', borderRadius: 24, padding: 24, gap: 20,
  },
  breakdownTitle: { fontSize: 17, fontWeight: '700', color: '#ffffff' },
  breakdownList: { gap: 16 },
  nutrientRow: { gap: 8 },
  nutrientLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  nutrientLabel: { fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1 },
  nutrientValue: { fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.7)' },
  nutrientTrack: { height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 999, overflow: 'hidden' },
  nutrientFill: { height: 8, borderRadius: 999 },
});
