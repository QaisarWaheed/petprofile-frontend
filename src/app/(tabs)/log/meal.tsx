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

const APPETITE_LABELS = ['Low', '', 'Normal', '', 'Great'];
const APPETITE_EMOJIS = ['😞', '😕', '😐', '😊', '😋'];

export default function MealLogScreen() {
  const router = useRouter();
  const petId = usePetStore((s) => s.activePet?.id);
  const pushToast = useUiStore((s) => s.pushToast);
  const { createLog } = useLogs(petId);

  const [foodBrand, setFoodBrand] = useState('');
  const [portion, setPortion] = useState('');
  const [unit, setUnit] = useState('g');
  const [appetite, setAppetite] = useState(4);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!petId) {
      pushToast('No active pet selected.', 'error');
      return;
    }
    setLoading(true);
    try {
      await createLog('meal', {
        foodBrand,
        portion: Number(portion),
        unit,
        appetite,
        notes,
        loggedAt: new Date().toISOString(),
      });
      router.back();
    } catch {
      pushToast('Could not save meal log. Please try again.', 'error');
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
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#ab3500" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Meal Log</Text>
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

          {/* FOOD DETAILS */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>FOOD DETAILS</Text>
            <View style={styles.searchWrapper}>
              <MaterialCommunityIcons name="magnify" size={20} color="#8d7168" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Food Brand/Type (e.g., Royal Canin Adult)"
                placeholderTextColor="#8d7168"
                value={foodBrand}
                onChangeText={setFoodBrand}
              />
            </View>
            <View style={styles.portionRow}>
              <TextInput
                style={[styles.textInput, { flex: 1 }]}
                placeholder="Portion"
                placeholderTextColor="#8d7168"
                value={portion}
                onChangeText={setPortion}
                keyboardType="numeric"
              />
              <View style={styles.unitSelector}>
                {['g', 'cups', 'oz'].map(u => (
                  <TouchableOpacity
                    key={u}
                    style={[styles.unitBtn, unit === u && styles.unitBtnActive]}
                    onPress={() => setUnit(u)}
                  >
                    <Text style={[styles.unitText, unit === u && styles.unitTextActive]}>{u}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* TIME & DATE */}
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
            <View style={[styles.timeCard, { flex: 1 }]}>
              <View style={[styles.timeIconCircle, { backgroundColor: '#b5ebff' }]}>
                <MaterialCommunityIcons name="calendar-today" size={20} color="#00677e" />
              </View>
              <View>
                <Text style={styles.timeLabel}>DATE</Text>
                <Text style={styles.timeValue}>Today</Text>
              </View>
            </View>
          </View>

          {/* APPETITE SLIDER */}
          <View style={styles.card}>
            <View style={styles.appetiteHeader}>
              <Text style={styles.cardLabel}>APPETITE</Text>
              <Text style={{ fontSize: 24 }}>{APPETITE_EMOJIS[appetite - 1]}</Text>
            </View>
            <View style={styles.sliderTrack}>
              {[1, 2, 3, 4, 5].map(val => (
                <TouchableOpacity
                  key={val}
                  style={[
                    styles.sliderDot,
                    { backgroundColor: val <= appetite ? '#ab3500' : '#e4e2df' },
                    val === appetite && styles.sliderDotActive,
                  ]}
                  onPress={() => setAppetite(val)}
                  activeOpacity={0.8}
                />
              ))}
            </View>
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>Low</Text>
              <Text style={styles.sliderLabel}>Normal</Text>
              <Text style={styles.sliderLabel}>Great</Text>
            </View>
          </View>

          {/* PHOTO UPLOAD */}
          <TouchableOpacity style={styles.photoCard} activeOpacity={0.8}>
            <MaterialCommunityIcons name="camera-plus-outline" size={32} color="#8d7168" />
            <Text style={styles.photoText}>Add Photo (Optional)</Text>
          </TouchableOpacity>

          {/* NOTES */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>NOTES</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Finished everything, added a little water..."
              placeholderTextColor="#8d7168"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
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
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.saveBtnText}>Save Log</Text>
              }
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
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#ab3500' },
  avatarCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#efeeeb', alignItems: 'center', justifyContent: 'center',
  },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },
  card: {
    backgroundColor: '#f5f3f0', borderRadius: 20, padding: 20,
    marginBottom: 14, gap: 12,
  },
  cardLabel: {
    fontSize: 11, fontWeight: '800', color: '#4c5f7e',
    letterSpacing: 1.5, textTransform: 'uppercase',
  },
  searchWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#ffffff', borderRadius: 16,
    paddingHorizontal: 14,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1, height: 52, fontSize: 14, color: '#1b1c1a',
  },
  portionRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  textInput: {
    backgroundColor: '#ffffff', borderRadius: 16,
    paddingHorizontal: 16, height: 52,
    fontSize: 14, color: '#1b1c1a',
  },
  unitSelector: {
    flexDirection: 'row', backgroundColor: '#ffffff',
    borderRadius: 16, overflow: 'hidden',
  },
  unitBtn: { paddingHorizontal: 12, paddingVertical: 14 },
  unitBtnActive: { backgroundColor: '#ab3500' },
  unitText: { fontSize: 13, fontWeight: '700', color: '#4c5f7e' },
  unitTextActive: { color: '#ffffff' },
  timeRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  timeCard: {
    backgroundColor: '#f5f3f0', borderRadius: 20, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  timeIconCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(171,53,0,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  timeLabel: { fontSize: 9, fontWeight: '800', color: '#4c5f7e', letterSpacing: 1, textTransform: 'uppercase' },
  timeValue: { fontSize: 14, fontWeight: '600', color: '#1b1c1a', marginTop: 2 },
  appetiteHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sliderTrack: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 8 },
  sliderDot: { width: 28, height: 28, borderRadius: 14 },
  sliderDotActive: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 4, borderColor: '#fff',
    shadowColor: '#ab3500', shadowOpacity: 0.4,
    shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 },
  sliderLabel: { fontSize: 10, fontWeight: '700', color: '#8d7168', textTransform: 'uppercase' },
  photoCard: {
    backgroundColor: '#f5f3f0', borderRadius: 20,
    borderWidth: 2, borderColor: '#e1bfb5', borderStyle: 'dashed',
    height: 120, alignItems: 'center', justifyContent: 'center',
    gap: 8, marginBottom: 14,
  },
  photoText: { fontSize: 14, fontWeight: '500', color: '#8d7168' },
  notesInput: {
    backgroundColor: '#ffffff', borderRadius: 16,
    padding: 14, fontSize: 14, color: '#1b1c1a',
    minHeight: 80,
  },
  saveBtn: { borderRadius: 20, marginTop: 8 },
  saveBtnInner: { height: 58, alignItems: 'center', justifyContent: 'center', borderRadius: 20 },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
