import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { usePetStore } from '../../../stores/pet.store';
import { useLogs } from '../../../hooks/useLogs';

function clampWeight(n: number) {
  return Math.round(n * 10) / 10;
}

export default function WeightLogScreen() {
  const router = useRouter();
  const activePet = usePetStore((s) => s.activePet);
  const { createLog } = useLogs(activePet?.id);

  const [weight, setWeight] = useState('12.5');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const weightNum = Number(weight);
  const validWeight = !Number.isNaN(weightNum) && weightNum >= 0;

  const bump = (delta: number) => {
    const base = validWeight ? weightNum : 0;
    const next = clampWeight(base + delta);
    setWeight(String(next));
  };

  const handleSave = async () => {
    setError('');
    if (!activePet?.id) {
      setError('No active pet selected.');
      return;
    }
    if (!validWeight) {
      setError('Enter a valid weight.');
      return;
    }
    setLoading(true);
    try {
      await createLog('weight', {
        weight: Number(weight),
        unit: 'kg',
        notes,
        loggedAt: new Date().toISOString(),
      });
      router.back();
    } catch {
      setError('Could not save weight log. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#ab3500" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Weight Log</Text>
          </View>
          <View style={styles.avatarCircle}>
            <MaterialCommunityIcons name="dog" size={20} color="#ab3500" />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.heroCard}>
            <View style={styles.heroInner}>
              <TextInput
                style={styles.heroInput}
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
                selectTextOnFocus
              />
              <Text style={styles.kgLabel}>KG</Text>
            </View>
            <View style={styles.controls}>
              <TouchableOpacity
                style={styles.controlBtn}
                onPress={() => bump(0.1)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="plus" size={22} color="#ab3500" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.controlBtn}
                onPress={() => bump(-0.1)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="minus" size={22} color="#ab3500" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.trendCard}>
            <Text style={styles.trendLabel}>Previous weight</Text>
            <View style={styles.trendRow}>
              <Text style={styles.trendValue}>--</Text>
              <MaterialCommunityIcons name="trending-up" size={22} color="#8d7168" />
            </View>
          </View>

          <View style={styles.timeRow}>
            <View style={[styles.timeCard, { flex: 1 }]}>
              <View style={[styles.timeIconCircle, { backgroundColor: '#b5ebff' }]}>
                <MaterialCommunityIcons name="calendar-today" size={20} color="#00677e" />
              </View>
              <View>
                <Text style={styles.timeLabel}>DATE</Text>
                <Text style={styles.timeValue}>{todayLabel}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>NOTES (OPTIONAL)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Any context about this weigh-in..."
              placeholderTextColor="#8d7168"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <LinearGradient
            colors={['#ab3500', '#FF6B35']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveBtn}
          >
            <TouchableOpacity
              style={styles.saveBtnInner}
              onPress={handleSave}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveBtnText}>Save Log</Text>
              )}
            </TouchableOpacity>
          </LinearGradient>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
    backgroundColor: '#fbf9f6',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#ab3500' },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#efeeeb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },
  heroCard: {
    backgroundColor: '#f5f3f0',
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginBottom: 16,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroInner: { alignItems: 'center' },
  heroInput: {
    fontSize: 72,
    fontWeight: '800',
    color: '#ab3500',
    textAlign: 'center',
    minWidth: 200,
    paddingVertical: 0,
  },
  kgLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#b4c7eb',
    marginTop: -4,
  },
  controls: {
    position: 'absolute',
    right: 16,
    gap: 12,
  },
  controlBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  trendCard: {
    backgroundColor: '#f5f3f0',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trendLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#594139',
  },
  trendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  trendValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#4c5f7e',
  },
  timeRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  timeCard: {
    backgroundColor: '#f5f3f0',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#4c5f7e',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  timeValue: { fontSize: 14, fontWeight: '600', color: '#1b1c1a', marginTop: 2 },
  card: {
    backgroundColor: '#f5f3f0',
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    gap: 12,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4c5f7e',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  notesInput: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    fontSize: 14,
    color: '#1b1c1a',
    minHeight: 80,
  },
  error: {
    color: '#ba1a1a',
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  saveBtn: { borderRadius: 20, marginTop: 8 },
  saveBtnInner: {
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
