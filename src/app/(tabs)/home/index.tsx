import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import type { Log, LogType } from '../../../types';
import { usePet } from '../../../hooks/usePet';
import { useLogs } from '../../../hooks/useLogs';
import { useAuthStore } from '../../../stores/auth.store';
import { aiService } from '../../../services/ai.service';

function truncateInsight(text: string, max: number) {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

function insightSummaryPayload(data: unknown): string {
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object' && 'summary' in data) {
    const s = (data as { summary?: unknown }).summary;
    return typeof s === 'string' ? s : '';
  }
  return '';
}

const QUICK_LOGS = [
  { icon: 'food', label: 'Meal', route: '/(tabs)/log/meal' },
  { icon: 'walk', label: 'Walk', route: '/(tabs)/log/walk' },
  { icon: 'emoticon-happy-outline', label: 'Mood', route: '/(tabs)/log/mood' },
  { icon: 'medical-bag', label: 'Symptom', route: '/(tabs)/log/symptom' },
] as const;

function logIconStyle(type: LogType): {
  icon: string;
  iconBg: string;
  iconColor: string;
} {
  const map: Partial<
    Record<
      LogType,
      {
        icon: string;
        iconBg: string;
        iconColor: string;
      }
    >
  > = {
    meal: { icon: 'food', iconBg: '#c7dbff', iconColor: '#4c5f7e' },
    walk: { icon: 'run', iconBg: '#b5ebff', iconColor: '#00677e' },
    mood: { icon: 'emoticon-happy-outline', iconBg: '#ffdbd0', iconColor: '#ab3500' },
    behaviour: { icon: 'paw', iconBg: '#fef3c7', iconColor: '#854d0e' },
    symptom: { icon: 'medical-bag', iconBg: '#ffdad6', iconColor: '#93000a' },
    medication: { icon: 'pill', iconBg: '#e9d5ff', iconColor: '#6b21a8' },
    vet_visit: { icon: 'hospital-building', iconBg: '#d5e3ff', iconColor: '#4c5f7e' },
    grooming: { icon: 'content-cut', iconBg: '#fce7f3', iconColor: '#9d174d' },
    expense: { icon: 'cash', iconBg: '#dcfce7', iconColor: '#166534' },
    weight: { icon: 'scale-bathroom', iconBg: '#e0e7ff', iconColor: '#3730a3' },
    training: { icon: 'school', iconBg: '#fef9c3', iconColor: '#854d0e' },
  };
  return (
    map[type] ?? {
      icon: 'notebook',
      iconBg: '#eae8e5',
      iconColor: '#594139',
    }
  );
}

function formatLogMeta(log: Log): string {
  const rel = formatDistanceToNow(new Date(log.loggedAt), { addSuffix: true });
  const data = log.data ?? {};
  const bits = Object.entries(data as Record<string, unknown>)
    .filter(([k]) => k !== 'loggedAt')
    .slice(0, 3)
    .map(([, v]) => String(v))
    .join(' • ');
  return bits ? `${rel} • ${bits}` : rel;
}

function logTitle(log: Log): string {
  return log.type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function HomeScreen() {
  const router = useRouter();
  const { activePet } = usePet();
  const petName = activePet?.name ?? 'your pet';
  const streak = useAuthStore((s) => s.user?.streakCount ?? 0);
  const { logs, isLoading } = useLogs(activePet?.id);

  const [weeklyInsight, setWeeklyInsight] = useState<string | null>(null);

  useEffect(() => {
    if (!activePet?.id) {
      setWeeklyInsight(null);
      return;
    }
    let cancelled = false;
    aiService
      .getWeeklySummary(activePet.id)
      .then((data) => {
        const s = insightSummaryPayload(data);
        if (!cancelled) setWeeklyInsight(s || null);
      })
      .catch(() => {
        if (!cancelled) setWeeklyInsight(null);
      });
    return () => {
      cancelled = true;
    };
  }, [activePet?.id]);

  const recentTwo = logs.slice(0, 2);

  const insightBody =
    weeklyInsight != null && weeklyInsight.length > 0
      ? truncateInsight(weeklyInsight, 220)
      : petName === 'your pet'
        ? "Your pet's weekly summary will appear once you select a pet and log activities."
        : `${petName}'s weekly summary will appear once you log activities — or open Weekly Summary below.`;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* TOP BAR */}
      <View style={styles.topBar}>
        <View style={styles.topLeft}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarCircle}>
              <MaterialCommunityIcons name="dog" size={22} color="#ab3500" />
            </View>
            <View style={styles.avatarBadge}>
              <Text style={styles.avatarBadgeText}>GR</Text>
            </View>
          </View>
          <Text style={styles.brand}>PetPulse</Text>
        </View>
        <View style={styles.streakPill}>
          <Text style={styles.streakText}>{streak} 🔥</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* STREAK HERO CARD */}
        <View style={styles.heroCard}>
          <View style={styles.heroBg} />
          <View style={styles.heroContent}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroLabel}>HEALTH JOURNEY</Text>
              <Text style={styles.heroTitle}>{streak} Day{'\n'}Streak!</Text>
              <View style={styles.heroPill}>
                <MaterialCommunityIcons name="fire" size={14} color="#ab3500" />
                <Text style={styles.heroPillText}>Keep it up, {petName}!</Text>
              </View>
            </View>
            <View style={styles.heroIconCircle}>
              <MaterialCommunityIcons name="paw" size={44} color="#fff" />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.weeklySummaryBtn}
          activeOpacity={0.85}
          onPress={() => router.push('/(tabs)/home/weekly-summary')}
        >
          <MaterialCommunityIcons name="calendar-text-outline" size={22} color="#ab3500" />
          <Text style={styles.weeklySummaryBtnText}>Weekly Summary</Text>
          <MaterialCommunityIcons name="chevron-right" size={22} color="#ab3500" />
        </TouchableOpacity>

        {/* AI INSIGHT CARD */}
        <View style={styles.insightCard}>
          <View style={styles.insightIconCircle}>
            <MaterialCommunityIcons name="brain" size={20} color="#004e60" />
          </View>
          <View style={styles.insightText}>
            <Text style={styles.insightTitle}>AI Insight</Text>
            <Text style={styles.insightBody}>{insightBody}</Text>
            <TouchableOpacity
              style={styles.insightViewLink}
              activeOpacity={0.75}
              onPress={() => router.push('/(tabs)/home/weekly-summary')}
            >
              <Text style={styles.insightViewLinkText}>View Summary →</Text>
            </TouchableOpacity>
          </View>
          <MaterialCommunityIcons
            name="creation"
            size={32}
            color="#00a7cb"
            style={styles.insightDecor}
          />
        </View>

        {/* QUICK LOG */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>QUICK LOG</Text>
        </View>
        <View style={styles.quickLogGrid}>
          {QUICK_LOGS.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.quickLogItem}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.75}
            >
              <View style={styles.quickLogIconBox}>
                <MaterialCommunityIcons name={item.icon as any} size={26} color="#4c5f7e" />
              </View>
              <Text style={styles.quickLogLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* BENTO ROW: Recent Logs + Next Up */}
        <View style={styles.bentoRow}>

          {/* Recent Logs */}
          <View style={[styles.bentoCard, { flex: 1.1 }]}>
            <View style={styles.bentoHeader}>
              <Text style={styles.bentoTitle}>RECENT LOGS</Text>
              <MaterialCommunityIcons name="history" size={16} color="#594139" />
            </View>
            {isLoading ? (
              <>
                <View style={styles.logSkeleton} />
                <View style={styles.logSkeleton} />
              </>
            ) : (
              recentTwo.map((log) => {
                const vis = logIconStyle(log.type);
                return (
                  <View key={log.id} style={styles.logRow}>
                    <View style={[styles.logIcon, { backgroundColor: vis.iconBg }]}>
                      <MaterialCommunityIcons
                        name={vis.icon as never}
                        size={16}
                        color={vis.iconColor}
                      />
                    </View>
                    <View>
                      <Text style={styles.logTitle}>{logTitle(log)}</Text>
                      <Text style={styles.logMeta}>{formatLogMeta(log)}</Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>

          {/* Next Up */}
          <View style={[styles.bentoCard, { flex: 1, backgroundColor: '#eae8e5' }]}>
            <View style={styles.bentoHeader}>
              <Text style={styles.bentoTitle}>NEXT UP</Text>
              <MaterialCommunityIcons name="calendar-month" size={16} color="#594139" />
            </View>
            <View style={styles.reminderCard}>
              <View style={styles.reminderTop}>
                <Text style={styles.reminderTime}>Today, 6:00 PM</Text>
                <MaterialCommunityIcons name="bell-ring" size={14} color="#ab3500" />
              </View>
              <Text style={styles.reminderTitle}>Monthly Flea & Tick Treatment</Text>
              <TouchableOpacity style={styles.reminderBtn}>
                <Text style={styles.reminderBtnText}>Mark as Done</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>

        {/* MAP SECTION */}
        <View style={styles.mapCard}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69c8bf?w=800' }}
            style={styles.mapImage}
            imageStyle={{ borderRadius: 20 }}
            resizeMode="cover"
          >
            <View style={styles.mapOverlay} />
            <View style={styles.mapContent}>
              <View>
                <Text style={styles.mapLabel}>FAVOURITE SPOT</Text>
                <Text style={styles.mapTitle}>Oakwood Central Park</Text>
              </View>
              <View style={styles.mapBtn}>
                <MaterialCommunityIcons name="navigation" size={20} color="#fff" />
              </View>
            </View>
          </ImageBackground>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(tabs)/log' as any)}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name="plus" size={28} color="#fff" />
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fbf9f6' },
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 12,
    backgroundColor: '#fbf9f6',
  },
  topLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarWrapper: { position: 'relative', width: 40, height: 40 },
  avatarCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#efeeeb', borderWidth: 2, borderColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarBadge: {
    position: 'absolute', bottom: -2, right: -2,
    backgroundColor: '#ab3500', borderRadius: 999,
    paddingHorizontal: 4, paddingVertical: 1,
    borderWidth: 1.5, borderColor: '#fff',
  },
  avatarBadgeText: { color: '#fff', fontSize: 7, fontWeight: '700' },
  brand: { fontSize: 18, fontWeight: '800', color: '#ab3500', letterSpacing: -0.3 },
  streakPill: {
    backgroundColor: '#f5f3f0', borderRadius: 999,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  streakText: { fontSize: 14, fontWeight: '700', color: '#ab3500' },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },
  heroCard: {
    backgroundColor: '#FF6B35', borderRadius: 24, padding: 24,
    marginBottom: 16, overflow: 'hidden', position: 'relative',
  },
  heroBg: {
    position: 'absolute', top: -40, right: -40,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  heroContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heroLeft: { flex: 1 },
  heroLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 },
  heroTitle: { color: '#fff', fontSize: 28, fontWeight: '800', lineHeight: 34, marginBottom: 12 },
  heroPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 999,
    paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start',
  },
  heroPillText: { color: '#ab3500', fontSize: 11, fontWeight: '700' },
  heroIconCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  weeklySummaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(171,53,0,0.15)',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  weeklySummaryBtnText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#ab3500',
  },
  insightCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 16,
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    borderLeftWidth: 4, borderLeftColor: '#00a7cb',
    marginBottom: 24, position: 'relative', overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  insightIconCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#b5ebff', alignItems: 'center', justifyContent: 'center',
  },
  insightText: { flex: 1 },
  insightTitle: { fontSize: 14, fontWeight: '700', color: '#1b1c1a', marginBottom: 4 },
  insightBody: { fontSize: 13, color: '#594139', lineHeight: 19 },
  insightViewLink: { alignSelf: 'flex-end', marginTop: 10 },
  insightViewLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ab3500',
  },
  insightDecor: { position: 'absolute', top: 8, right: 8, opacity: 0.15 },
  sectionHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 10, fontWeight: '800', color: '#1b1c1a', letterSpacing: 1.5, textTransform: 'uppercase' },
  quickLogGrid: {
    flexDirection: 'row', gap: 10, marginBottom: 24,
  },
  quickLogItem: { flex: 1, alignItems: 'center', gap: 6 },
  quickLogIconBox: {
    width: '100%', aspectRatio: 1, backgroundColor: '#f5f3f0',
    borderRadius: 16, alignItems: 'center', justifyContent: 'center',
  },
  quickLogLabel: { fontSize: 9, fontWeight: '700', color: '#594139', textTransform: 'uppercase', letterSpacing: 0.5 },
  bentoRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  bentoCard: {
    backgroundColor: '#f5f3f0', borderRadius: 20, padding: 14, gap: 10,
  },
  bentoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bentoTitle: { fontSize: 9, fontWeight: '800', color: '#1b1c1a', textTransform: 'uppercase', letterSpacing: 1 },
  logRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderRadius: 12, padding: 10 },
  logIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  logTitle: { fontSize: 11, fontWeight: '700', color: '#1b1c1a' },
  logMeta: { fontSize: 9, color: '#594139', marginTop: 1 },
  reminderCard: { backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 12, padding: 10, gap: 6 },
  reminderTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reminderTime: { fontSize: 9, fontWeight: '700', color: '#ab3500', textTransform: 'uppercase' },
  reminderTitle: { fontSize: 12, fontWeight: '700', color: '#1b1c1a', lineHeight: 16 },
  reminderBtn: { backgroundColor: '#fff', borderRadius: 999, paddingVertical: 6, alignItems: 'center', marginTop: 4 },
  reminderBtnText: { fontSize: 9, fontWeight: '700', color: '#1b1c1a' },
  mapCard: { borderRadius: 20, overflow: 'hidden', height: 180, marginBottom: 8 },
  mapImage: { width: '100%', height: '100%', justifyContent: 'flex-end' },
  mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 20 },
  mapContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', padding: 16 },
  mapLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 9, fontWeight: '700', textTransform: 'uppercase', marginBottom: 2 },
  mapTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  mapBtn: { backgroundColor: '#ab3500', width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  logSkeleton: {
    height: 44,
    backgroundColor: '#eae8e5',
    borderRadius: 12,
    marginBottom: 8,
  },
  fab: {
    position: 'absolute', bottom: 88, right: 20,
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#ab3500',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#ab3500', shadowOpacity: 0.4,
    shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 8,
  },
});
