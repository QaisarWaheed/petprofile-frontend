import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ComponentProps } from 'react';
import { usePetStore } from '../../../stores/pet.store';
import { aiService } from '../../../services/ai.service';
import { useLogs } from '../../../hooks/useLogs';
import type { Log } from '../../../types';

type MciName = ComponentProps<typeof MaterialCommunityIcons>['name'];

const LOG_TYPE_CONFIG: Record<
  string,
  { icon: MciName; color: string; bg: string; label: string }
> = {
  meal: { icon: 'food', color: '#ab3500', bg: '#ffdbd0', label: 'Meal' },
  walk: { icon: 'walk', color: '#4c5f7e', bg: '#d5e3ff', label: 'Walk' },
  mood: { icon: 'emoticon-happy-outline', color: '#00677e', bg: '#b5ebff', label: 'Mood' },
  symptom: { icon: 'medical-bag', color: '#ba1a1a', bg: '#ffdad6', label: 'Symptom' },
  medication: { icon: 'pill', color: '#00677e', bg: '#b5ebff', label: 'Medication' },
  vet_visit: { icon: 'stethoscope', color: '#4c5f7e', bg: '#d5e3ff', label: 'Vet Visit' },
  grooming: { icon: 'content-cut', color: '#ab3500', bg: '#ffdbd0', label: 'Grooming' },
  expense: { icon: 'cash', color: '#4c5f7e', bg: '#d5e3ff', label: 'Expense' },
  weight: { icon: 'scale-bathroom', color: '#594139', bg: '#efeeeb', label: 'Weight' },
  behaviour: { icon: 'dog', color: '#854d0e', bg: '#fef3c7', label: 'Behaviour' },
};

function parseSummaryPayload(data: unknown): string {
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object' && 'summary' in data) {
    const s = (data as { summary?: unknown }).summary;
    return typeof s === 'string' ? s : '';
  }
  return '';
}

export default function WeeklySummaryScreen() {
  const router = useRouter();
  const activePet = usePetStore((s) => s.activePet);
  const { logs, fetchLogs, isLoading: logsLoading } = useLogs(activePet?.id);
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState('');

  const fetchSummary = useCallback(async () => {
    if (!activePet?.id) return;
    setSummaryLoading(true);
    setSummaryError('');
    try {
      const res = await aiService.getWeeklySummary(activePet.id);
      setSummary(parseSummaryPayload(res));
    } catch {
      setSummaryError('Could not load summary. Please try again.');
    } finally {
      setSummaryLoading(false);
    }
  }, [activePet?.id]);

  useEffect(() => {
    void fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    void fetchSummary();
  }, [fetchSummary]);

  const recentLogs = logs.slice(0, 10);

  const logCounts = useMemo(() => {
    return logs.reduce<Record<string, number>>((acc, log) => {
      acc[log.type] = (acc[log.type] ?? 0) + 1;
      return acc;
    }, {});
  }, [logs]);

  const petDisplayName = activePet?.name ?? 'your pet';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#ab3500" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Weekly Summary</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Text style={styles.heroTag}>THIS WEEK</Text>
          <Text style={styles.heroTitle}>
            {activePet?.name ?? 'Your pet'}
            {"'s\nHealth Report"}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.summaryIconCircle}>
              <MaterialCommunityIcons name="brain" size={20} color="#004e60" />
            </View>
            <Text style={styles.summaryTitle}>AI Summary</Text>
            <TouchableOpacity onPress={fetchSummary} style={styles.refreshBtn}>
              <MaterialCommunityIcons name="refresh" size={18} color="#ab3500" />
            </TouchableOpacity>
          </View>
          {summaryLoading ? (
            <ActivityIndicator color="#ab3500" style={{ marginVertical: 16 }} />
          ) : summaryError ? (
            <Text style={styles.errorText}>{summaryError}</Text>
          ) : summary ? (
            <Text style={styles.summaryText}>{summary}</Text>
          ) : (
            <Text style={styles.summaryPlaceholder}>
              Log some activities this week and I&apos;ll generate a health summary for{' '}
              {petDisplayName}.
            </Text>
          )}
        </View>

        <Text style={styles.sectionLabel}>ACTIVITY BREAKDOWN</Text>
        <View style={styles.statsGrid}>
          {Object.entries(logCounts).map(([type, count]) => {
            const config = LOG_TYPE_CONFIG[type] ?? {
              icon: 'paw' as MciName,
              color: '#594139',
              bg: '#efeeeb',
              label: type,
            };
            return (
              <View key={type} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: config.bg }]}>
                  <MaterialCommunityIcons name={config.icon} size={20} color={config.color} />
                </View>
                <Text style={styles.statCount}>{String(count)}</Text>
                <Text style={styles.statLabel}>{config.label}</Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionLabel}>RECENT ACTIVITY</Text>
        {logsLoading ? (
          <ActivityIndicator color="#ab3500" style={{ marginVertical: 16 }} />
        ) : recentLogs.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={40} color="#e1bfb5" />
            <Text style={styles.emptyText}>No logs this week yet</Text>
          </View>
        ) : (
          <View style={styles.logsList}>
            {recentLogs.map((log: Log, i: number) => {
              const config = LOG_TYPE_CONFIG[log.type] ?? {
                icon: 'paw' as MciName,
                color: '#594139',
                bg: '#efeeeb',
                label: log.type,
              };
              const timeAgo = log.loggedAt
                ? new Date(log.loggedAt).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })
                : '';
              return (
                <View key={log.id ?? `log-${i}`} style={styles.logRow}>
                  <View style={[styles.logIcon, { backgroundColor: config.bg }]}>
                    <MaterialCommunityIcons name={config.icon} size={18} color={config.color} />
                  </View>
                  <View style={styles.logContent}>
                    <Text style={styles.logType}>{config.label}</Text>
                    <Text style={styles.logTime}>{timeAgo}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fbf9f6' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1b1c1a' },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },
  heroSection: { marginBottom: 24 },
  heroTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ab3500',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  heroTitle: { fontSize: 28, fontWeight: '800', color: '#1b1c1a', lineHeight: 36 },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#00a7cb',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  summaryIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#b5ebff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTitle: { fontSize: 15, fontWeight: '700', color: '#1b1c1a', flex: 1 },
  refreshBtn: { padding: 4 },
  summaryText: { fontSize: 14, color: '#594139', lineHeight: 22 },
  summaryPlaceholder: {
    fontSize: 14,
    color: '#8d7168',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  errorText: { fontSize: 13, color: '#ba1a1a' },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4c5f7e',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    width: '30%',
    backgroundColor: '#f5f3f0',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    gap: 6,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCount: { fontSize: 20, fontWeight: '800', color: '#1b1c1a' },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#594139',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  logsList: { gap: 10, marginBottom: 16 },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  logIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logContent: { flex: 1 },
  logType: { fontSize: 14, fontWeight: '700', color: '#1b1c1a' },
  logTime: { fontSize: 12, color: '#594139', marginTop: 2 },
  emptyState: { alignItems: 'center', paddingVertical: 32, gap: 8 },
  emptyText: { fontSize: 14, color: '#8d7168' },
});
