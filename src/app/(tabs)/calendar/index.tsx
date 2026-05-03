import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const EVENTS: Record<number, string[]> = {
  3: ['meal', 'walk'],
  6: ['health'],
  10: ['meal', 'walk', 'health'],
  20: ['med'],
};

const DOT_COLORS: Record<string, string> = {
  meal: '#ab3500',
  walk: '#4c5f7e',
  health: '#00a7cb',
  med: '#ba1a1a',
};

const LEGEND = [
  { label: 'Meals', color: '#ab3500' },
  { label: 'Walks', color: '#4c5f7e' },
  { label: 'Health', color: '#00a7cb' },
  { label: 'Meds', color: '#ba1a1a' },
];

// October 2023 starts on Sunday (index 6 in Mon-Sun grid) = 6 empty cells before day 1
const EMPTY_BEFORE = 6;
const DAYS_IN_MONTH = 31;
const TODAY = 10;

export default function CalendarScreen() {
  const router = useRouter();
  const [month] = useState('October 2023');

  const cells: (number | null)[] = [
    ...Array(EMPTY_BEFORE).fill(null),
    ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
  ];

  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarCircle}>
            <MaterialCommunityIcons name="dog" size={20} color="#ab3500" />
          </View>
          <Text style={styles.headerTitle}>Pet Calendar</Text>
        </View>
        <TouchableOpacity>
          <MaterialCommunityIcons name="bell-outline" size={24} color="#ab3500" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* MONTH NAVIGATION */}
        <View style={styles.monthNav}>
          <View style={styles.monthLeft}>
            <Text style={styles.monthTitle}>{month}</Text>
            <View style={styles.navBtns}>
              <TouchableOpacity style={styles.navBtn}>
                <MaterialCommunityIcons name="chevron-left" size={20} color="#4c5f7e" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.navBtn}>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#4c5f7e" />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.todayBtn}>
            <Text style={styles.todayBtnText}>Today</Text>
          </TouchableOpacity>
        </View>

        {/* CALENDAR GRID */}
        <View style={styles.calendarCard}>

          {/* Day headers */}
          <View style={styles.dayHeaders}>
            {DAYS.map(d => (
              <Text key={d} style={styles.dayHeader}>{d}</Text>
            ))}
          </View>

          {/* Date cells */}
          <View style={styles.grid}>
            {cells.map((day, i) => {
              if (!day) return <View key={`empty-${i}`} style={styles.cell} />;
              const isToday = day === TODAY;
              const dots = EVENTS[day] ?? [];
              return (
                <TouchableOpacity
                  key={day}
                  style={styles.cell}
                  activeOpacity={0.8}
                  onPress={() => router.push('/(tabs)/calendar/event-detail' as any)}
                >
                  <View style={[styles.dateCircle, isToday && styles.dateCircleToday]}>
                    {isToday && (
                      <View style={styles.todayBadge}>
                        <Text style={styles.todayBadgeText}>Today</Text>
                      </View>
                    )}
                    <Text style={[styles.dateNum, isToday && styles.dateNumToday]}>{day}</Text>
                    {dots.length > 0 && (
                      <View style={styles.dots}>
                        {dots.map((type, j) => (
                          <View key={j} style={[styles.dot, { backgroundColor: DOT_COLORS[type] }]} />
                        ))}
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            {LEGEND.map(l => (
              <View key={l.label} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: l.color }]} />
                <Text style={styles.legendLabel}>{l.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* UPCOMING REMINDERS */}
        <View style={styles.remindersSection}>
          <View style={styles.remindersHeader}>
            <Text style={styles.remindersTitle}>Upcoming Reminders</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {/* Reminder 1 */}
          <View style={styles.reminderCard}>
            <View style={[styles.reminderIcon, { backgroundColor: 'rgba(255,218,214,0.4)' }]}>
              <MaterialCommunityIcons name="medical-bag" size={22} color="#ba1a1a" />
            </View>
            <View style={styles.reminderContent}>
              <Text style={styles.reminderTitle}>Flea Treatment</Text>
              <Text style={styles.reminderMeta}>Tomorrow at 09:00 AM</Text>
            </View>
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>URGENT</Text>
            </View>
          </View>

          {/* Reminder 2 */}
          <View style={styles.reminderCard}>
            <View style={[styles.reminderIcon, { backgroundColor: 'rgba(199,219,255,0.4)' }]}>
              <MaterialCommunityIcons name="needle" size={22} color="#4c5f7e" />
            </View>
            <View style={styles.reminderContent}>
              <Text style={styles.reminderTitle}>Rabies Vaccination</Text>
              <Text style={styles.reminderMeta}>In 3 days • Pet Clinic East</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#e1bfb5" />
          </View>

          {/* Stock Up Card */}
          <View style={styles.stockCard}>
            <View style={styles.stockContent}>
              <Text style={styles.stockTitle}>Stock Up!</Text>
              <Text style={styles.stockSub}>
                You have only 2 days of Kibble left. Add to shopping list?
              </Text>
              <TouchableOpacity style={styles.stockBtn}>
                <Text style={styles.stockBtnText}>Add Now</Text>
              </TouchableOpacity>
            </View>
            <MaterialCommunityIcons
              name="basket"
              size={80}
              color="rgba(255,255,255,0.2)"
              style={styles.stockDecor}
            />
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const CELL_SIZE = Math.floor((width - 80) / 7);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fbf9f6' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fbf9f6',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#efeeeb', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#4c5f7e' },
  scroll: { paddingHorizontal: 16, paddingTop: 8 },
  monthNav: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16,
  },
  monthLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  monthTitle: { fontSize: 24, fontWeight: '800', color: '#4c5f7e', letterSpacing: -0.5 },
  navBtns: { flexDirection: 'row', gap: 4 },
  navBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  todayBtn: {
    backgroundColor: '#c7dbff', borderRadius: 999,
    paddingHorizontal: 16, paddingVertical: 8,
  },
  todayBtnText: { fontSize: 13, fontWeight: '700', color: '#4d607f' },
  calendarCard: {
    backgroundColor: '#f5f3f0', borderRadius: 24, padding: 16, marginBottom: 24,
  },
  dayHeaders: { flexDirection: 'row', marginBottom: 8 },
  dayHeader: {
    width: CELL_SIZE, textAlign: 'center',
    fontSize: 9, fontWeight: '800', color: 'rgba(76,95,126,0.6)',
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: CELL_SIZE, alignItems: 'center', paddingVertical: 4 },
  dateCircle: {
    width: CELL_SIZE - 4, height: CELL_SIZE - 4, borderRadius: (CELL_SIZE - 4) / 2,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#ffffff',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
    position: 'relative',
  },
  dateCircleToday: {
    borderWidth: 2, borderColor: '#ab3500',
  },
  todayBadge: {
    position: 'absolute', top: -10,
    backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 999,
    paddingHorizontal: 4, paddingVertical: 1,
  },
  todayBadgeText: { fontSize: 7, fontWeight: '800', color: '#ab3500' },
  dateNum: { fontSize: 13, fontWeight: '600', color: '#1b1c1a' },
  dateNumToday: { fontWeight: '800', color: '#ab3500' },
  dots: {
    flexDirection: 'row', gap: 2, position: 'absolute', bottom: -6,
  },
  dot: { width: 5, height: 5, borderRadius: 3 },
  legend: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12,
    justifyContent: 'center', marginTop: 20,
    paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(225,191,181,0.25)',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 9, fontWeight: '800', color: '#594139', textTransform: 'uppercase', letterSpacing: 1 },
  remindersSection: { gap: 12 },
  remindersHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  remindersTitle: { fontSize: 18, fontWeight: '700', color: '#4c5f7e' },
  viewAll: { fontSize: 13, fontWeight: '700', color: '#ab3500' },
  reminderCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#ffffff', borderRadius: 20, padding: 14,
    borderWidth: 1, borderColor: 'rgba(225,191,181,0.15)',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 1,
  },
  reminderIcon: {
    width: 48, height: 48, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  reminderContent: { flex: 1 },
  reminderTitle: { fontSize: 14, fontWeight: '700', color: '#1b1c1a', marginBottom: 2 },
  reminderMeta: { fontSize: 12, color: '#594139' },
  urgentBadge: {
    backgroundColor: '#ffdad6', borderRadius: 999,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  urgentText: { fontSize: 9, fontWeight: '800', color: '#ba1a1a', letterSpacing: 1 },
  stockCard: {
    backgroundColor: '#FF6B35', borderRadius: 20, padding: 20,
    overflow: 'hidden', flexDirection: 'row', alignItems: 'center',
  },
  stockContent: { flex: 1 },
  stockTitle: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 4 },
  stockSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 19, maxWidth: 200, marginBottom: 14 },
  stockBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 999,
    paddingHorizontal: 16, paddingVertical: 8, alignSelf: 'flex-start',
  },
  stockBtnText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  stockDecor: { position: 'absolute', right: -10, bottom: -10 },
});
