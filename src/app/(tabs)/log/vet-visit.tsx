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

export default function VetVisitLogScreen() {
  const router = useRouter();
  const activePet = usePetStore((s) => s.activePet);
  const { createLog } = useLogs(activePet?.id);

  const [clinicName, setClinicName] = useState('');
  const [vetName, setVetName] = useState('');
  const [reason, setReason] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [nextAppointment, setNextAppointment] = useState('');
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
      await createLog('vet_visit', {
        clinicName,
        vetName,
        reason,
        diagnosis,
        nextAppointment,
        notes,
        loggedAt: new Date().toISOString(),
      });
      router.back();
    } catch {
      setError('Could not save vet visit log. Please try again.');
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
            <Text style={styles.headerTitle}>Vet Visit</Text>
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
            <Text style={styles.cardLabel}>VISIT DETAILS</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Downtown Animal Hospital"
              placeholderTextColor="#8d7168"
              value={clinicName}
              onChangeText={setClinicName}
            />
            <TextInput
              style={styles.input}
              placeholder="e.g. Dr. Sarah Wilson"
              placeholderTextColor="#8d7168"
              value={vetName}
              onChangeText={setVetName}
            />
            <TextInput
              style={styles.input}
              placeholder="e.g. Annual checkup, vaccination..."
              placeholderTextColor="#8d7168"
              value={reason}
              onChangeText={setReason}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>OUTCOME</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Healthy, mild ear infection..."
              placeholderTextColor="#8d7168"
              value={diagnosis}
              onChangeText={setDiagnosis}
            />
            <TextInput
              style={styles.input}
              placeholder="DD / MM / YYYY"
              placeholderTextColor="#8d7168"
              value={nextAppointment}
              onChangeText={setNextAppointment}
              keyboardType="numbers-and-punctuation"
            />
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
              placeholder="Follow-up instructions, prescriptions..."
              placeholderTextColor="#8d7168"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
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
  },
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
    minHeight: 100,
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
