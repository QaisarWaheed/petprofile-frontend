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

const BODY_AREAS = [
  'Head',
  'Eyes',
  'Ears',
  'Mouth',
  'Body',
  'Legs',
  'Paws',
  'Tail',
];

const SEVERITY_DOT_COLORS = ['#cfd8dc', '#9e9e9e', '#ff9800', '#e53935', '#ba1a1a'];

export default function SymptomLogScreen() {
  const router = useRouter();
  const activePet = usePetStore((s) => s.activePet);
  const { createLog } = useLogs(activePet?.id);

  const [description, setDescription] = useState('');
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [severity, setSeverity] = useState(3);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleArea = (a: string) => {
    setSelectedAreas((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );
  };

  const handleSave = async () => {
    setError('');
    if (!activePet?.id) {
      setError('No active pet selected.');
      return;
    }
    setLoading(true);
    try {
      await createLog('symptom', {
        description,
        bodyAreas: selectedAreas,
        severity,
        notes,
        loggedAt: new Date().toISOString(),
      });
      router.back();
    } catch {
      setError('Could not save symptom log. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
            <Text style={styles.headerTitle}>Symptom Log</Text>
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
            <Text style={styles.cardLabel}>DESCRIBE THE SYMPTOM</Text>
            <TextInput
              style={styles.multilineInput}
              placeholder="e.g. limping on front left leg, not eating..."
              placeholderTextColor="#8d7168"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <Text style={styles.sectionLabel}>BODY AREA</Text>
          <View style={styles.bodyGrid}>
            {BODY_AREAS.map((area) => {
              const active = selectedAreas.includes(area);
              return (
                <TouchableOpacity
                  key={area}
                  style={[styles.bodyChip, active && styles.bodyChipActive]}
                  onPress={() => toggleArea(area)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.bodyChipText, active && styles.bodyChipTextActive]}>
                    {area}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>SEVERITY</Text>
            <View style={styles.severityDots}>
              {[1, 2, 3, 4, 5].map((val) => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.severityDot,
                    {
                      backgroundColor:
                        val <= severity ? SEVERITY_DOT_COLORS[val - 1] : '#e1bfb5',
                    },
                    val === severity && styles.severityDotActive,
                  ]}
                  onPress={() => setSeverity(val)}
                  activeOpacity={0.8}
                />
              ))}
            </View>
            <View style={styles.severityLabels}>
              <Text style={styles.severityLabel}>Mild</Text>
              <Text style={styles.severityLabel}>Severe</Text>
            </View>
          </View>

          <View style={styles.timeRow}>
            <View style={[styles.timeCard, { flex: 1 }]}>
              <View style={styles.timeIconCircle}>
                <MaterialCommunityIcons name="clock-outline" size={20} color="#ab3500" />
              </View>
              <View>
                <Text style={styles.timeLabel}>TIME</Text>
                <Text style={styles.timeValue}>{timeStr}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>NOTES (OPTIONAL)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Additional details..."
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
  },
  multilineInput: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#1b1c1a',
    minHeight: 104,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4c5f7e',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 4,
  },
  bodyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  bodyChip: {
    width: '31%',
    minWidth: '30%',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(225,191,181,0.25)',
  },
  bodyChipActive: {
    backgroundColor: '#ab3500',
    borderColor: '#ab3500',
  },
  bodyChipText: { fontSize: 13, fontWeight: '600', color: '#4c5f7e' },
  bodyChipTextActive: { color: '#ffffff', fontWeight: '700' },
  severityDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  severityDot: { width: 28, height: 28, borderRadius: 14 },
  severityDotActive: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  severityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  severityLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8d7168',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
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
    backgroundColor: 'rgba(171,53,0,0.1)',
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
