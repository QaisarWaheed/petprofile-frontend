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

const MOODS = [
  { label: 'Excited', emoji: '🤩' },
  { label: 'Happy', emoji: '😊' },
  { label: 'Calm', emoji: '😌' },
  { label: 'Tired', emoji: '😴' },
  { label: 'Grumpy', emoji: '😠' },
];

const TRIGGERS = ['Post-Walk', 'Meal Time', 'Thunderstorm', 'Vet Visit', 'Playtime'];

export default function MoodLogScreen() {
  const router = useRouter();
  const petId = usePetStore((s) => s.activePet?.id);
  const pushToast = useUiStore((s) => s.pushToast);
  const { createLog } = useLogs(petId);
  const [selectedMood, setSelectedMood] = useState('Happy');
  const [notes, setNotes] = useState('');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleTrigger = (t: string) => {
    setSelectedTriggers(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  };

  const handleSave = async () => {
    if (!petId) {
      pushToast('No active pet selected.', 'error');
      return;
    }
    setLoading(true);
    try {
      await createLog('mood', {
        mood: selectedMood,
        triggers: selectedTriggers,
        notes,
        loggedAt: new Date().toISOString(),
      });
      router.back();
    } catch {
      pushToast('Could not save mood log. Please try again.', 'error');
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
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#ab3500" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mood Log</Text>
          <View style={styles.avatarCircle}>
            <MaterialCommunityIcons name="dog" size={20} color="#ab3500" />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* HERO */}
          <View style={styles.hero}>
            <Text style={styles.heroTag}>DAILY CHECK-IN</Text>
            <Text style={styles.heroTitle}>How is Cooper feeling?</Text>
            <Text style={styles.heroSub}>
              Logging moods helps identify patterns in your pet's health.
            </Text>
          </View>

          {/* MOOD GRID */}
          <View style={styles.moodGrid}>
            {MOODS.map(mood => {
              const active = selectedMood === mood.label;
              return (
                <TouchableOpacity
                  key={mood.label}
                  style={[
                    styles.moodCard,
                    active && styles.moodCardActive,
                  ]}
                  onPress={() => setSelectedMood(mood.label)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.moodEmoji, active && { transform: [{ scale: 1.2 }] }]}>
                    {mood.emoji}
                  </Text>
                  <Text style={[styles.moodLabel, active && styles.moodLabelActive]}>
                    {mood.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* NOTES */}
          <View style={styles.notesSection}>
            <View style={styles.notesHeader}>
              <Text style={styles.sectionLabel}>OPTIONAL NOTES</Text>
              <MaterialCommunityIcons name="pencil" size={18} color="#e1bfb5" />
            </View>
            <View style={styles.notesCard}>
              <TextInput
                style={styles.notesInput}
                placeholder="What triggered this mood? Any notable activities or behaviors?"
                placeholderTextColor="#8d7168"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* TRIGGERS */}
          <View style={styles.triggersSection}>
            <Text style={styles.sectionLabel}>COMMON TRIGGERS</Text>
            <View style={styles.triggersWrap}>
              {TRIGGERS.map(t => {
                const active = selectedTriggers.includes(t);
                return (
                  <TouchableOpacity
                    key={t}
                    style={[styles.triggerChip, active && styles.triggerChipActive]}
                    onPress={() => toggleTrigger(t)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.triggerText, active && styles.triggerTextActive]}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
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
                  <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
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
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fbf9f6',
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#4c5f7e' },
  avatarCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#efeeeb', borderWidth: 2, borderColor: '#FF6B35',
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },
  hero: { alignItems: 'center', marginBottom: 28 },
  heroTag: { fontSize: 10, fontWeight: '800', color: '#4c5f7e', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
  heroTitle: { fontSize: 26, fontWeight: '800', color: '#1b1c1a', textAlign: 'center', marginBottom: 6 },
  heroSub: { fontSize: 13, color: '#594139', textAlign: 'center', lineHeight: 20, maxWidth: 280 },
  moodGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 28,
    justifyContent: 'center',
  },
  moodCard: {
    width: '45%', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 20, paddingHorizontal: 12,
    backgroundColor: '#ffffff', borderRadius: 20,
    borderWidth: 2, borderColor: 'transparent',
    shadowColor: '#000', shadowOpacity: 0.04,
    shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1,
    gap: 8,
  },
  moodCardActive: {
    borderColor: '#FF6B35',
    backgroundColor: 'rgba(255,107,53,0.06)',
    transform: [{ scale: 1.05 }],
    shadowColor: '#FF6B35', shadowOpacity: 0.2,
    shadowRadius: 12, elevation: 3,
  },
  moodEmoji: { fontSize: 40 },
  moodLabel: { fontSize: 11, fontWeight: '800', color: '#4c5f7e', textTransform: 'uppercase', letterSpacing: 1 },
  moodLabelActive: { color: '#ab3500' },
  notesSection: { marginBottom: 24 },
  notesHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 10, paddingHorizontal: 4,
  },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: '#4c5f7e', letterSpacing: 1.5, textTransform: 'uppercase' },
  notesCard: {
    backgroundColor: '#f5f3f0', borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(225,191,181,0.2)',
  },
  notesInput: {
    padding: 16, fontSize: 14, color: '#1b1c1a',
    minHeight: 100,
  },
  triggersSection: { marginBottom: 28 },
  triggersWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  triggerChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999,
    backgroundColor: '#efeeeb',
  },
  triggerChipActive: { backgroundColor: '#4c5f7e' },
  triggerText: { fontSize: 13, fontWeight: '500', color: '#4c5f7e' },
  triggerTextActive: { color: '#ffffff', fontWeight: '700' },
  saveBtn: { borderRadius: 20 },
  saveBtnInner: {
    height: 58, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10, borderRadius: 20,
  },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
