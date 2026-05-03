import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, ActivityIndicator,
  ImageBackground
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { usePetStore } from '../../../stores/pet.store';
import { useUiStore } from '../../../stores/ui.store';
import { useLogs } from '../../../hooks/useLogs';

const ENERGY_LEVELS = [
  { label: 'Low', icon: 'emoticon-happy-outline' as const },
  { label: 'Normal', icon: 'lightning-bolt' as const },
  { label: 'High', icon: 'rocket-launch' as const },
];

export default function WalkLogScreen() {
  const router = useRouter();
  const petId = usePetStore((s) => s.activePet?.id);
  const pushToast = useUiStore((s) => s.pushToast);
  const { createLog } = useLogs(petId);
  const [duration, setDuration] = useState(45);
  const [energyLevel, setEnergyLevel] = useState('Normal');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!petId) {
      pushToast('No active pet selected.', 'error');
      return;
    }
    setLoading(true);
    try {
      await createLog('walk', {
        duration,
        energyLevel,
        notes,
        loggedAt: new Date().toISOString(),
      });
      router.back();
    } catch {
      pushToast('Could not save walk log. Please try again.', 'error');
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
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#ab3500" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Walk Log</Text>
          </View>
          <TouchableOpacity style={styles.moreBtn}>
            <MaterialCommunityIcons name="dots-vertical" size={22} color="#ab3500" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* DURATION HERO */}
          <View style={styles.sectionLabel}>
            <Text style={styles.label}>WALK DURATION</Text>
          </View>
          <View style={styles.durationCard}>
            <View style={styles.durationCenter}>
              <Text style={styles.durationNumber}>{String(duration).padStart(2, '0')}</Text>
              <Text style={styles.durationUnit}>MINUTES</Text>
            </View>
            <View style={styles.durationControls}>
              <TouchableOpacity
                style={styles.controlBtn}
                onPress={() => setDuration(d => Math.min(d + 5, 300))}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="plus" size={22} color="#ab3500" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.controlBtn}
                onPress={() => setDuration(d => Math.max(d - 5, 0))}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="minus" size={22} color="#ab3500" />
              </TouchableOpacity>
            </View>
          </View>

          {/* ENERGY LEVEL */}
          <View style={styles.sectionLabel}>
            <Text style={styles.label}>ENERGY LEVEL</Text>
          </View>
          <View style={styles.energyRow}>
            {ENERGY_LEVELS.map(level => {
              const active = energyLevel === level.label;
              return (
                <TouchableOpacity
                  key={level.label}
                  style={[styles.energyCard, active && styles.energyCardActive]}
                  onPress={() => setEnergyLevel(level.label)}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name={level.icon}
                    size={32}
                    color={active ? '#ffffff' : '#4c5f7e'}
                  />
                  <Text style={[styles.energyLabel, active && styles.energyLabelActive]}>
                    {level.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ROUTE MAP */}
          <View style={styles.mapHeader}>
            <Text style={styles.label}>ROUTE MAP</Text>
            <TouchableOpacity style={styles.trackBtn}>
              <MaterialCommunityIcons name="crosshairs-gps" size={14} color="#ab3500" />
              <Text style={styles.trackBtnText}>START TRACKING</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.mapCard}>
            <ImageBackground
              source={{ uri: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69c8bf?w=800' }}
              style={styles.mapImage}
              imageStyle={{ borderRadius: 20, opacity: 0.6 }}
              resizeMode="cover"
            >
              <View style={styles.mapOverlay} />
              <TouchableOpacity style={styles.recordBtn} activeOpacity={0.85}>
                <MaterialCommunityIcons name="play-circle" size={22} color="#ab3500" />
                <Text style={styles.recordText}>Record GPS Path</Text>
              </TouchableOpacity>
            </ImageBackground>
          </View>

          {/* OBSERVATIONS */}
          <View style={styles.sectionLabel}>
            <Text style={styles.label}>OBSERVATIONS</Text>
          </View>
          <View style={styles.notesCard}>
            <TextInput
              style={styles.notesInput}
              placeholder="Met a new puppy friend! Buddy was very calm today..."
              placeholderTextColor="#8d7168"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <View style={styles.notesBtns}>
              <TouchableOpacity style={styles.notesIconBtn}>
                <MaterialCommunityIcons name="camera" size={16} color="#4c5f7e" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.notesIconBtn}>
                <MaterialCommunityIcons name="microphone" size={16} color="#4c5f7e" />
              </TouchableOpacity>
            </View>
          </View>

          {/* SAVE BUTTON */}
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
                  <MaterialCommunityIcons name="check-circle" size={22} color="#fff" />
                  <Text style={styles.saveBtnText}>Save Walk</Text>
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
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#ab3500' },
  moreBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },
  sectionLabel: { marginBottom: 10 },
  label: { fontSize: 11, fontWeight: '800', color: '#4c5f7e', letterSpacing: 1.5, textTransform: 'uppercase', paddingHorizontal: 4 },
  durationCard: {
    backgroundColor: '#f5f3f0', borderRadius: 24, paddingVertical: 32,
    paddingHorizontal: 20, marginBottom: 24,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  durationCenter: { alignItems: 'center' },
  durationNumber: { fontSize: 72, fontWeight: '800', color: '#ab3500', lineHeight: 80 },
  durationUnit: { fontSize: 16, fontWeight: '700', color: '#b4c7eb', letterSpacing: 2, marginTop: -8 },
  durationControls: {
    position: 'absolute', right: 20, gap: 12,
  },
  controlBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  energyRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  energyCard: {
    flex: 1, alignItems: 'center', gap: 8, padding: 16,
    borderRadius: 16, backgroundColor: '#ffffff',
    borderWidth: 2, borderColor: 'transparent',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  energyCardActive: {
    backgroundColor: '#FF6B35', borderColor: '#ab3500',
    shadowColor: '#FF6B35', shadowOpacity: 0.3,
    shadowRadius: 10, elevation: 4,
    transform: [{ scale: 1.05 }],
  },
  energyLabel: { fontSize: 10, fontWeight: '800', color: '#4c5f7e', textTransform: 'uppercase', letterSpacing: 1 },
  energyLabelActive: { color: '#ffffff' },
  mapHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 10, paddingHorizontal: 4,
  },
  trackBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  trackBtnText: { fontSize: 11, fontWeight: '800', color: '#ab3500', letterSpacing: 1 },
  mapCard: { borderRadius: 20, overflow: 'hidden', height: 180, marginBottom: 24 },
  mapImage: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(251,249,246,0.4)' },
  recordBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 999,
    paddingHorizontal: 20, paddingVertical: 12,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  recordText: { fontSize: 14, fontWeight: '700', color: '#1b1c1a' },
  notesCard: {
    backgroundColor: '#f5f3f0', borderRadius: 20, padding: 16,
    marginBottom: 20, position: 'relative',
  },
  notesInput: {
    fontSize: 14, color: '#1b1c1a', minHeight: 90,
    paddingBottom: 36,
  },
  notesBtns: {
    position: 'absolute', bottom: 12, right: 12,
    flexDirection: 'row', gap: 8,
  },
  notesIconBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  saveBtn: { borderRadius: 20 },
  saveBtnInner: {
    height: 58, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10, borderRadius: 20,
  },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
