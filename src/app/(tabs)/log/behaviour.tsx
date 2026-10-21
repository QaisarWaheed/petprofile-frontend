import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { usePetStore } from '../../../stores/pet.store';
import { useUiStore } from '../../../stores/ui.store';
import { useLogs } from '../../../hooks/useLogs';

const BEHAVIOURS = ['Anxious', 'Chewing', 'Clingy', 'Barking', 'Digging', 'Hyper', 'Napping'];
const SEVERITY_LABELS = ['Mild', 'Low', 'Moderate', 'High', 'Intense'];

export default function BehaviourLogScreen() {
  const router = useRouter();
  const petId = usePetStore((s) => s.activePet?.id);
  const pushToast = useUiStore((s) => s.pushToast);
  const { createLog } = useLogs(petId);
  const [selectedBehaviours, setSelectedBehaviours] = useState<string[]>(['Chewing']);
  const [trigger, setTrigger] = useState('');
  const [severity, setSeverity] = useState(3);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleBehaviour = (b: string) => {
    setSelectedBehaviours(prev =>
      prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]
    );
  };

  const handleSave = async () => {
    if (!petId) {
      pushToast('No active pet selected.', 'error');
      return;
    }
    setLoading(true);
    try {
      await createLog('behaviour', {
        behaviours: selectedBehaviours,
        trigger,
        severity,
        notes,
        loggedAt: new Date().toISOString(),
      });
      router.back();
    } catch {
      pushToast('Could not save behaviour log. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarCircle}>
              <MaterialCommunityIcons name="dog" size={20} color="#ab3500" />
            </View>
            <Text style={styles.headerTitle}>Behavior Log</Text>
          </View>
          <TouchableOpacity>
            <MaterialCommunityIcons name="dots-vertical" size={22} color="#4c5f7e" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* BEHAVIOUR TAGS */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>What did Cooper do?</Text>
              <Text style={styles.sectionHint}>SELECT BEHAVIORS</Text>
            </View>
            <View style={styles.tagWrap}>
              {BEHAVIOURS.map(b => {
                const active = selectedBehaviours.includes(b);
                return (
                  <TouchableOpacity
                    key={b}
                    style={[styles.tag, active && styles.tagActive]}
                    onPress={() => toggleBehaviour(b)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.tagText, active && styles.tagTextActive]}>{b}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* TRIGGER INPUT */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What triggered it?</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.triggerInput}
                placeholder="e.g., Loud thunder, delivery truck..."
                placeholderTextColor="#8d7168"
                value={trigger}
                onChangeText={setTrigger}
              />
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={20}
                color="#e1bfb5"
                style={styles.inputIcon}
              />
            </View>
          </View>

          {/* SEVERITY */}
          <View style={styles.severityCard}>
            <View style={styles.severityHeader}>
              <Text style={styles.sectionTitle}>Severity</Text>
              <View style={styles.severityBadge}>
                <Text style={styles.severityBadgeText}>{SEVERITY_LABELS[severity - 1]}</Text>
              </View>
            </View>
            <View style={styles.severityDots}>
              {[1, 2, 3, 4, 5].map(val => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.severityDot,
                    { backgroundColor: val <= severity ? '#ab3500' : '#e1bfb5' },
                    val === severity && styles.severityDotActive,
                  ]}
                  onPress={() => setSeverity(val)}
                  activeOpacity={0.8}
                />
              ))}
            </View>
            <View style={styles.severityLabels}>
              <Text style={styles.severityLabel}>Mild</Text>
              <Text style={styles.severityLabel}>Intense</Text>
            </View>
          </View>

          {/* NOTES */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Optional Notes</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Add more details about the incident..."
              placeholderTextColor="#8d7168"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* SAVE */}
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
                <>
                  <MaterialCommunityIcons name="check-circle" size={20} color="#fff" />
                  <Text style={styles.saveBtnText}>Save Log</Text>
                </>
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
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#fbf9f6',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#efeeeb', borderWidth: 2, borderColor: '#FF6B35',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#ab3500', letterSpacing: -0.3 },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#4c5f7e', marginBottom: 12 },
  sectionHint: { fontSize: 10, fontWeight: '800', color: '#594139', letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.6 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999,
    backgroundColor: '#ffffff', borderWidth: 1, borderColor: 'rgba(225,191,181,0.2)',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  tagActive: { backgroundColor: '#FF6B35', borderColor: '#FF6B35' },
  tagText: { fontSize: 14, fontWeight: '600', color: '#4c5f7e' },
  tagTextActive: { color: '#ffffff', fontWeight: '700' },
  inputWrapper: {
    backgroundColor: '#f5f3f0', borderRadius: 16,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16,
  },
  triggerInput: {
    flex: 1, height: 52, fontSize: 14, color: '#1b1c1a',
  },
  inputIcon: { marginLeft: 8 },
  severityCard: {
    backgroundColor: '#f5f3f0', borderRadius: 20, padding: 20,
    marginBottom: 24, gap: 16,
  },
  severityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  severityBadge: {
    backgroundColor: '#ffdbd0', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  severityBadgeText: { fontSize: 13, fontWeight: '700', color: '#ab3500' },
  severityDots: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 8,
  },
  severityDot: { width: 28, height: 28, borderRadius: 14 },
  severityDotActive: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 4, borderColor: '#fff',
    shadowColor: '#ab3500', shadowOpacity: 0.4,
    shadowRadius: 8, elevation: 4,
  },
  severityLabels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 },
  severityLabel: { fontSize: 10, fontWeight: '700', color: '#8d7168', textTransform: 'uppercase', letterSpacing: 0.8 },
  notesInput: {
    backgroundColor: '#f5f3f0', borderRadius: 16,
    padding: 16, fontSize: 14, color: '#1b1c1a', minHeight: 100,
  },
  saveBtn: { borderRadius: 999 },
  saveBtnInner: {
    height: 58, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10, borderRadius: 999,
  },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
