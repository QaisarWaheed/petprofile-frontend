import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import type { Pet } from '../../types';
import { petsService } from '../../services/pets.service';
import { usePetStore } from '../../stores/pet.store';

const ALLERGIES = ['None', 'Chicken', 'Dairy', 'Pollen', 'Flea Saliva'];

const VACCINES = [
  { name: 'Rabies', subtitle: 'Up to date' },
  { name: 'Distemper', subtitle: 'Select if completed' },
  { name: 'Bordetella', subtitle: 'Select if completed' },
  { name: 'Parvovirus', subtitle: 'Select if completed' },
];

const parseDate = (raw: string): string | undefined => {
  if (!raw.trim()) return undefined;
  const parts = raw.replace(/\D/g, '');
  if (parts.length !== 8) return undefined;
  const day = parts.slice(0, 2);
  const month = parts.slice(2, 4);
  const year = parts.slice(4, 8);
  const date = new Date(`${year}-${month}-${day}`);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

export default function PetHealthScreen() {
  const router = useRouter();
  const activePet = usePetStore((s) => s.activePet);
  const pets = usePetStore((s) => s.pets);
  const petId =
    activePet?.id ??
    (activePet as Pet & { _id?: string })?._id ??
    pets[0]?.id ??
    (pets[0] as Pet & { _id?: string })?._id;

  const updatePetStore = usePetStore((s) => s.updatePet);

  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(['Chicken']);
  const [conditions, setConditions] = useState('');
  const [medName, setMedName] = useState('');
  const [medDose, setMedDose] = useState('');
  const [lastVetVisit, setLastVetVisit] = useState('');
  const [selectedVaccines, setSelectedVaccines] = useState<string[]>(['Rabies']);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const toggleAllergy = (a: string) => {
    setSelectedAllergies(prev =>
      prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]
    );
  };

  const toggleVaccine = (v: string) => {
    setSelectedVaccines(prev =>
      prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]
    );
  };

  const handleContinue = async () => {
    if (!petId) {
      setFormError('Pet not found. Please go back and try again.');
      return;
    }
    setFormError(null);
    setSaving(true);
    try {
      const updated = await petsService.updatePet(petId, {
        health: {
          allergies: selectedAllergies.filter((a) => a !== 'None'),
          conditions: conditions.trim() ? [conditions.trim()] : [],
          medications: medName.trim()
            ? [{ name: medName.trim(), dosage: medDose.trim() || '' }]
            : [],
          lastVetVisit: parseDate(lastVetVisit),
          vaccines: selectedVaccines.map((v) => ({
            name: v,
            date: new Date().toISOString(),
            nextDue: null,
          })),
        },
      } as unknown as Partial<Pet>);
      updatePetStore(updated);
      router.push('/(onboarding)/pet-behaviour');
    } catch (e: unknown) {
      const err = e as { response?: { data?: unknown }; message?: string };
      console.error('Health save error:', err?.response?.data ?? err?.message ?? e);
      setFormError('Could not save health details. Please try again.');
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
          <Text style={styles.headerTitle}>Health Essentials</Text>
          <View style={styles.avatarCircle}>
            <MaterialCommunityIcons name="dog" size={20} color="#ab3500" />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* PROGRESS */}
          <View style={styles.progressSection}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.stepLabel}>STEP 2 OF 3</Text>
              <Text style={styles.stepPercent}>66%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '66%' }]} />
            </View>
          </View>

          {/* INTRO */}
          <View style={styles.intro}>
            <Text style={styles.introTitle}>
              Let's build a{' '}
              <Text style={styles.introAccent}>Health Baseline</Text>
              {' '}for your companion.
            </Text>
            <Text style={styles.introSub}>
              Detailed medical info helps us personalize their wellness journey and track milestones.
            </Text>
          </View>

          {/* ALLERGIES */}
          <View style={styles.fieldSection}>
            <View style={styles.fieldLabel}>
              <MaterialCommunityIcons name="alert-circle-outline" size={18} color="#4c5f7e" />
              <Text style={styles.labelText}>KNOWN ALLERGIES</Text>
            </View>
            <View style={styles.chipWrap}>
              {ALLERGIES.map(a => (
                <TouchableOpacity
                  key={a}
                  style={[
                    styles.chip,
                    selectedAllergies.includes(a) && styles.chipSelected,
                  ]}
                  onPress={() => toggleAllergy(a)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.chipText,
                    selectedAllergies.includes(a) && styles.chipTextSelected,
                  ]}>{a}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.chipAdd} activeOpacity={0.8}>
                <MaterialCommunityIcons name="plus" size={14} color="#ab3500" />
                <Text style={styles.chipAddText}>Add Other</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* CHRONIC CONDITIONS */}
          <View style={styles.fieldSection}>
            <View style={styles.fieldLabel}>
              <MaterialCommunityIcons name="file-document-outline" size={18} color="#4c5f7e" />
              <Text style={styles.labelText}>CHRONIC CONDITIONS</Text>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Hip Dysplasia, Diabetes, Anxiety..."
              placeholderTextColor="#8d7168"
              value={conditions}
              onChangeText={setConditions}
            />
          </View>

          {/* CURRENT MEDICATIONS */}
          <View style={styles.fieldSection}>
            <View style={styles.fieldLabel}>
              <MaterialCommunityIcons name="pill" size={18} color="#4c5f7e" />
              <Text style={styles.labelText}>CURRENT MEDICATIONS</Text>
            </View>
            <View style={styles.medRow}>
              <TextInput
                style={[styles.textInput, { flex: 1 }]}
                placeholder="Medication Name"
                placeholderTextColor="#8d7168"
                value={medName}
                onChangeText={setMedName}
              />
              <TextInput
                style={[styles.textInput, { flex: 1 }]}
                placeholder="Dosage (e.g. 5mg/day)"
                placeholderTextColor="#8d7168"
                value={medDose}
                onChangeText={setMedDose}
              />
            </View>
            <TouchableOpacity style={styles.addMoreBtn}>
              <MaterialCommunityIcons name="plus-circle-outline" size={16} color="#ab3500" />
              <Text style={styles.addMoreText}>Add another medication</Text>
            </TouchableOpacity>
          </View>

          {/* LAST VET VISIT */}
          <View style={styles.fieldSection}>
            <View style={styles.fieldLabel}>
              <MaterialCommunityIcons name="calendar-today" size={18} color="#4c5f7e" />
              <Text style={styles.labelText}>LAST VET VISIT</Text>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="DD / MM / YYYY"
              placeholderTextColor="#8d7168"
              value={lastVetVisit}
              onChangeText={setLastVetVisit}
              keyboardType="numeric"
            />
          </View>

          {/* VACCINE HISTORY */}
          <View style={styles.fieldSection}>
            <View style={styles.fieldLabel}>
              <MaterialCommunityIcons name="needle" size={18} color="#4c5f7e" />
              <Text style={styles.labelText}>VACCINE HISTORY</Text>
            </View>
            <View style={styles.vaccineGrid}>
              {VACCINES.map(v => {
                const selected = selectedVaccines.includes(v.name);
                return (
                  <TouchableOpacity
                    key={v.name}
                    style={[styles.vaccineCard, selected && styles.vaccineCardSelected]}
                    onPress={() => toggleVaccine(v.name)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.vaccineIcon, selected && styles.vaccineIconSelected]}>
                      <MaterialCommunityIcons
                        name={selected ? 'check-circle' : 'circle-outline'}
                        size={22}
                        color={selected ? '#ab3500' : '#594139'}
                      />
                    </View>
                    <View>
                      <Text style={styles.vaccineName}>{v.name}</Text>
                      <Text style={styles.vaccineSub}>{selected ? 'Up to date' : v.subtitle}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
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
                onPress={() => void handleContinue()}
                activeOpacity={0.85}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Continue to Lifestyle</Text>
                )}
              </TouchableOpacity>
            </LinearGradient>
            <Text style={styles.ctaNote}>You can always update these later in Settings.</Text>
          </View>

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
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#fbf9f6',
  },
  backBtn: { padding: 8, borderRadius: 999 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1b1c1a' },
  avatarCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#efeeeb', borderWidth: 2, borderColor: '#FF6B35',
    alignItems: 'center', justifyContent: 'center',
  },

  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },

  progressSection: { marginBottom: 32 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  stepLabel: { fontSize: 11, fontWeight: '800', color: '#4c5f7e', letterSpacing: 1.5, textTransform: 'uppercase' },
  stepPercent: { fontSize: 13, fontWeight: '800', color: '#ab3500' },
  progressTrack: { height: 10, backgroundColor: '#efeeeb', borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: 10, backgroundColor: '#ab3500', borderRadius: 999 },

  intro: { marginBottom: 32 },
  introTitle: { fontSize: 26, fontWeight: '800', color: '#1b1c1a', lineHeight: 34, marginBottom: 10 },
  introAccent: { color: '#ab3500' },
  introSub: { fontSize: 15, color: '#594139', lineHeight: 22 },

  fieldSection: { marginBottom: 28 },
  fieldLabel: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  labelText: { fontSize: 12, fontWeight: '800', color: '#4c5f7e', letterSpacing: 1.2, textTransform: 'uppercase' },

  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999,
    backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e1bfb5',
  },
  chipSelected: { backgroundColor: '#ab3500', borderColor: '#ab3500' },
  chipText: { fontSize: 14, fontWeight: '600', color: '#594139' },
  chipTextSelected: { color: '#ffffff' },
  chipAdd: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999,
    borderWidth: 1, borderColor: '#ab3500',
  },
  chipAddText: { fontSize: 14, fontWeight: '600', color: '#ab3500' },

  textInput: {
    backgroundColor: '#f5f3f0', borderRadius: 14,
    paddingHorizontal: 18, paddingVertical: 14,
    fontSize: 15, color: '#1b1c1a',
  },
  medRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  addMoreBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  addMoreText: { fontSize: 13, fontWeight: '700', color: '#ab3500' },

  vaccineGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  vaccineCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#ffffff', borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: 'rgba(225,191,181,0.3)',
    width: '47%',
  },
  vaccineCardSelected: { borderColor: 'rgba(171,53,0,0.25)', backgroundColor: '#fff9f7' },
  vaccineIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#eae8e5', alignItems: 'center', justifyContent: 'center',
  },
  vaccineIconSelected: { backgroundColor: '#ffdbd0' },
  vaccineName: { fontSize: 13, fontWeight: '700', color: '#1b1c1a' },
  vaccineSub: { fontSize: 11, color: '#594139', marginTop: 2 },

  ctaSection: { paddingTop: 8 },
  formError: {
    fontSize: 13,
    color: '#ba1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  gradientBtn: { borderRadius: 24 },
  btnInner: { height: 58, alignItems: 'center', justifyContent: 'center', borderRadius: 24 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  ctaNote: { textAlign: 'center', marginTop: 12, fontSize: 13, color: '#594139' },
});
