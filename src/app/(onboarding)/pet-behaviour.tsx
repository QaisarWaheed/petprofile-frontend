import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import type { Pet } from '../../types';
import { petsService } from '../../services/pets.service';
import { usePetStore } from '../../stores/pet.store';

const WALK_OPTIONS = ['1-2 Times', '3-4 Times', '5+ Times'];
const TRAINING_LEVELS = [
  { label: 'Beginner', stars: 1 },
  { label: 'Intermediate', stars: 2 },
  { label: 'Advanced', stars: 3 },
];
const TRAITS = ['anxious', 'playful', 'calm', 'stubborn', 'social', 'protective', 'curious'];

export default function PetBehaviourScreen() {
  const router = useRouter();
  const activePet = usePetStore((s) => s.activePet);
  const updatePetStore = usePetStore((s) => s.updatePet);

  const [walkSchedule, setWalkSchedule] = useState('1-2 Times');
  const [trainingLevel, setTrainingLevel] = useState('Intermediate');
  const [selectedTraits, setSelectedTraits] = useState<string[]>(['anxious', 'calm']);
  const [breakfastTime] = useState('07:30');
  const [dinnerTime] = useState('18:30');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const toggleTrait = (t: string) => {
    setSelectedTraits(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  };

  const handleFinish = async () => {
    const petId =
      activePet?.id ??
      ((activePet as Pet & { _id?: string })?._id as string | undefined);
    if (!petId) {
      setFormError('No active pet found. Go back and try again.');
      return;
    }
    setFormError(null);
    setSaving(true);
    try {
      const payload = {
        behaviour: {
          walkSchedule,
          trainingLevel,
          traits: selectedTraits,
          mealTimes: [
            { label: 'Breakfast', time: breakfastTime },
            { label: 'Dinner', time: dinnerTime },
          ],
        },
      } as unknown as Partial<Pet>;

      const updated = await petsService.updatePet(petId, payload);
      updatePetStore(updated);
      router.replace('/(onboarding)/complete');
    } catch {
      setFormError('Could not save behaviour. Please try again.');
    } finally {
      setSaving(false);
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
          <Text style={styles.headerTitle}>Pet Profile</Text>
          <View style={styles.avatarCircle}>
            <MaterialCommunityIcons name="dog" size={20} color="#ab3500" />
          </View>
        </View>

        {/* PROGRESS */}
        <View style={styles.progressSection}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.stepLabel}>STEP 3 OF 3</Text>
            <Text style={styles.stepPercent}>100% COMPLETE</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* INTRO */}
          <View style={styles.intro}>
            <Text style={styles.introTitle}>Daily Routine & Personality</Text>
            <Text style={styles.introSub}>
              Let's map out the final details of your pet's lifestyle.
            </Text>
          </View>

          {/* BENTO GRID */}
          <View style={styles.grid}>

            {/* MEAL TIMES */}
            <View style={styles.bentoCard}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="food" size={18} color="#ab3500" />
                <Text style={styles.cardLabel}>MEAL TIMES</Text>
              </View>
              <Text style={styles.cardDesc}>When do you usually fill the bowl?</Text>
              <View style={styles.mealRow}>
                <Text style={styles.mealLabel}>Breakfast</Text>
                <Text style={styles.mealTime}>{breakfastTime}</Text>
              </View>
              <View style={styles.mealRow}>
                <Text style={styles.mealLabel}>Dinner</Text>
                <Text style={styles.mealTime}>{dinnerTime}</Text>
              </View>
            </View>

            {/* WALK SCHEDULE */}
            <View style={[styles.bentoCard, { backgroundColor: '#f5f3f0' }]}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="walk" size={18} color="#ab3500" />
                <Text style={styles.cardLabel}>WALK SCHEDULE</Text>
              </View>
              <Text style={styles.cardDesc}>How often do you venture outside together?</Text>
              <View style={styles.chipWrap}>
                {WALK_OPTIONS.map(opt => (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.chip,
                      walkSchedule === opt && styles.chipSelected,
                    ]}
                    onPress={() => setWalkSchedule(opt)}
                    activeOpacity={0.8}
                  >
                    <Text style={[
                      styles.chipText,
                      walkSchedule === opt && styles.chipTextSelected,
                    ]}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

          </View>

          {/* TRAINING LEVEL */}
          <View style={[styles.bentoCardFull, { marginBottom: 16 }]}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="school" size={18} color="#ab3500" />
              <Text style={styles.cardLabel}>TRAINING LEVEL</Text>
            </View>
            <Text style={styles.trainingTitle}>Education Milestone</Text>
            <Text style={styles.cardDesc}>How would you describe their response to commands?</Text>
            <View style={styles.trainingRow}>
              {TRAINING_LEVELS.map(level => {
                const active = trainingLevel === level.label;
                return (
                  <TouchableOpacity
                    key={level.label}
                    style={[styles.trainingCard, active && styles.trainingCardActive]}
                    onPress={() => setTrainingLevel(level.label)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.starsRow}>
                      {Array.from({ length: level.stars }).map((_, i) => (
                        <MaterialCommunityIcons
                          key={i}
                          name="star"
                          size={28}
                          color={active ? '#FF6B35' : '#8d7168'}
                        />
                      ))}
                    </View>
                    <Text style={[styles.trainingLabel, active && styles.trainingLabelActive]}>
                      {level.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* KNOWN TRAITS */}
          <View style={[styles.bentoCardFull, { backgroundColor: '#f5f3f0' }]}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="brain" size={18} color="#ab3500" />
              <Text style={styles.cardLabel}>KNOWN TRAITS</Text>
            </View>
            <Text style={styles.trainingTitle}>Choose all that apply</Text>
            <View style={styles.traitWrap}>
              {TRAITS.map(t => {
                const selected = selectedTraits.includes(t);
                return (
                  <TouchableOpacity
                    key={t}
                    style={[styles.traitChip, selected && styles.traitChipSelected]}
                    onPress={() => toggleTrait(t)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.traitText, selected && styles.traitTextSelected]}>{t}</Text>
                    {selected && (
                      <MaterialCommunityIcons name="check" size={14} color="#ab3500" />
                    )}
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity style={styles.traitChip} activeOpacity={0.8}>
                <Text style={styles.traitText}>+ Add Custom</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* CTA */}
          <View style={styles.ctaSection}>
            {formError ? (
              <Text style={styles.formError}>{formError}</Text>
            ) : null}
            <LinearGradient
              colors={['#ab3500', '#FF6B35']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBtn}
            >
              <TouchableOpacity
                style={styles.btnInner}
                onPress={() => void handleFinish()}
                activeOpacity={0.85}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.btnText}>Finish Setup</Text>
                    <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
            </LinearGradient>
            <TouchableOpacity
              style={styles.skipBtn}
              onPress={() => void handleFinish()}
              disabled={saving}
            >
              <Text style={styles.skipText}>SKIP FOR LATER</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 32 }} />
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
  backBtn: { padding: 8, borderRadius: 999 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#ab3500' },
  avatarCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#efeeeb', alignItems: 'center', justifyContent: 'center',
  },
  progressSection: { paddingHorizontal: 20, paddingBottom: 12 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  stepLabel: { fontSize: 10, fontWeight: '800', color: '#4c5f7e', letterSpacing: 1.5, textTransform: 'uppercase' },
  stepPercent: { fontSize: 10, fontWeight: '800', color: '#ab3500', letterSpacing: 1.5, textTransform: 'uppercase' },
  progressTrack: { height: 8, backgroundColor: '#eae8e5', borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: 8, backgroundColor: '#FF6B35', borderRadius: 999 },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },
  intro: { marginBottom: 24 },
  introTitle: { fontSize: 28, fontWeight: '800', color: '#1b1c1a', letterSpacing: -0.5, marginBottom: 8 },
  introSub: { fontSize: 15, color: '#594139', lineHeight: 22 },
  grid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  bentoCard: {
    flex: 1, backgroundColor: '#ffffff', borderRadius: 20, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 2, gap: 8,
  },
  bentoCardFull: {
    backgroundColor: '#ffffff', borderRadius: 20, padding: 20,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 2, gap: 10,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardLabel: { fontSize: 10, fontWeight: '800', color: '#4c5f7e', letterSpacing: 1.2, textTransform: 'uppercase' },
  cardDesc: { fontSize: 12, color: '#594139', lineHeight: 18 },
  mealRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#f5f3f0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
  },
  mealLabel: { fontSize: 12, fontWeight: '600', color: '#4c5f7e' },
  mealTime: { fontSize: 14, fontWeight: '700', color: '#ab3500' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999,
    backgroundColor: '#ffffff',
  },
  chipSelected: { backgroundColor: '#FF6B35' },
  chipText: { fontSize: 12, fontWeight: '700', color: '#4c5f7e' },
  chipTextSelected: { color: '#ffffff' },
  trainingTitle: { fontSize: 16, fontWeight: '700', color: '#1b1c1a' },
  trainingRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  trainingCard: {
    flex: 1, alignItems: 'center', gap: 6,
    padding: 12, borderRadius: 14,
    backgroundColor: '#f5f3f0',
  },
  trainingCardActive: {
    backgroundColor: '#FF6B35',
    shadowColor: '#FF6B35', shadowOpacity: 0.3,
    shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  starsRow: { flexDirection: 'row', gap: 2 },
  trainingLabel: { fontSize: 10, fontWeight: '800', color: '#594139', textTransform: 'uppercase', letterSpacing: 0.5 },
  trainingLabelActive: { color: '#ffffff' },
  traitWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  traitChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999,
    backgroundColor: '#ffffff', borderWidth: 1, borderColor: 'transparent',
  },
  traitChipSelected: {
    borderColor: '#ab3500', backgroundColor: 'rgba(171,53,0,0.05)',
  },
  traitText: { fontSize: 13, fontWeight: '600', color: '#4c5f7e' },
  traitTextSelected: { color: '#ab3500' },
  ctaSection: { marginTop: 28, gap: 16, alignItems: 'center' },
  formError: {
    fontSize: 13,
    color: '#ba1a1a',
    textAlign: 'center',
    alignSelf: 'stretch',
    marginBottom: 4,
  },
  gradientBtn: { borderRadius: 999, width: '100%' },
  btnInner: {
    height: 58, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8, borderRadius: 999,
  },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  skipBtn: { paddingVertical: 8 },
  skipText: { fontSize: 12, fontWeight: '700', color: '#4c5f7e', letterSpacing: 1.5 },
});
