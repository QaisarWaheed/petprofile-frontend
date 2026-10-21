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

const GROOMING_TYPES = [
  { label: 'Full Groom', value: 'full_groom' },
  { label: 'Bath Only', value: 'bath_only' },
  { label: 'Nails Only', value: 'nails_only' },
] as const;

export default function GroomingLogScreen() {
  const router = useRouter();
  const activePet = usePetStore((s) => s.activePet);
  const { createLog } = useLogs(activePet?.id);

  const [groomingType, setGroomingType] =
    useState<(typeof GROOMING_TYPES)[number]['value']>('full_groom');
  const [isAtHome, setIsAtHome] = useState(true);
  const [groomerName, setGroomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setError('');
    if (!activePet?.id) {
      setError('No active pet selected.');
      return;
    }
    setLoading(true);
    try {
      await createLog('grooming', {
        groomingType,
        location: isAtHome ? 'home' : 'groomer',
        groomerName: isAtHome ? undefined : groomerName || undefined,
        notes,
        loggedAt: new Date().toISOString(),
      });
      router.back();
    } catch {
      setError('Could not save grooming log. Please try again.');
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
            <Text style={styles.headerTitle}>Grooming Log</Text>
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
          <View style={styles.card}>
            <Text style={styles.cardLabel}>GROOMING TYPE</Text>
            <View style={styles.typeRow}>
              {GROOMING_TYPES.map((t) => {
                const active = groomingType === t.value;
                return (
                  <TouchableOpacity
                    key={t.value}
                    style={[styles.typeChip, active && styles.typeChipActive]}
                    onPress={() => setGroomingType(t.value)}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>
                      {t.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <Text style={styles.cardLabel}>LOCATION</Text>
          <View style={styles.locRow}>
            <TouchableOpacity
              style={[styles.locCard, isAtHome ? styles.locCardActive : styles.locCardIdle]}
              onPress={() => setIsAtHome(true)}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons
                name="home-outline"
                size={36}
                color={isAtHome ? '#344765' : '#8d7168'}
              />
              <Text style={[styles.locTitle, isAtHome && styles.locTitleActive]}>At Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.locCard, !isAtHome ? styles.locCardActive : styles.locCardIdle]}
              onPress={() => setIsAtHome(false)}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons
                name="store-outline"
                size={36}
                color={!isAtHome ? '#344765' : '#8d7168'}
              />
              <Text style={[styles.locTitle, !isAtHome && styles.locTitleActive]}>Groomer</Text>
            </TouchableOpacity>
          </View>

          {!isAtHome ? (
            <View style={styles.card}>
              <Text style={styles.cardLabel}>GROOMER NAME</Text>
              <TextInput
                style={styles.input}
                placeholder="Groomer or salon name"
                placeholderTextColor="#8d7168"
                value={groomerName}
                onChangeText={setGroomerName}
              />
            </View>
          ) : null}

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
              placeholder="How did it go?"
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
    marginBottom: 6,
    marginLeft: 4,
  },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  typeChip: {
    flex: 1,
    minWidth: '28%',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(225,191,181,0.25)',
  },
  typeChipActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  typeChipText: { fontSize: 13, fontWeight: '700', color: '#4c5f7e', textAlign: 'center' },
  typeChipTextActive: { color: '#ffffff' },
  locRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  locCard: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 24,
    alignItems: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  locCardIdle: { backgroundColor: '#f5f3f0' },
  locCardActive: { backgroundColor: '#c7dbff', borderColor: 'rgba(52,71,101,0.15)' },
  locTitle: { fontSize: 15, fontWeight: '700', color: '#8d7168' },
  locTitleActive: { color: '#1b1c1a' },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    fontSize: 14,
    color: '#1b1c1a',
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
