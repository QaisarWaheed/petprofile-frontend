import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform, Image, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { petsService } from '../../services/pets.service';
import { usePetStore } from '../../stores/pet.store';

const GENDERS = ['Male', 'Female'];

const parseDate = (raw: string): string | undefined => {
  const cleaned = raw.replace(/\D/g, '');
  if (cleaned.length !== 8) return undefined;
  const day = cleaned.slice(0, 2);
  const month = cleaned.slice(2, 4);
  const year = cleaned.slice(4, 8);
  const date = new Date(`${year}-${month}-${day}`);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

export default function PetBasicInfoScreen() {
  const router = useRouter();
  const addPet = usePetStore((s) => s.addPet);
  const setActivePet = usePetStore((s) => s.setActivePet);

  const [species, setSpecies] = useState<'dog' | 'cat'>('dog');
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [dob, setDob] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | ''>('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images' as const,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleNext = async () => {
    setFormError(null);
    if (!name.trim()) {
      setFormError('Please enter your pet’s name.');
      return;
    }
    if (!gender) {
      setFormError('Please select a gender.');
      return;
    }
    const w = weight.trim() ? Number(weight) : undefined;
    if (weight.trim() && Number.isNaN(w)) {
      setFormError('Please enter a valid weight.');
      return;
    }
    setSaving(true);
    try {
      const pet = await petsService.createPet({
        name: name.trim(),
        species,
        breed: breed.trim() || undefined,
        dateOfBirth: parseDate(dob),
        gender: gender.toLowerCase() as 'male' | 'female',
        weight: Number(weight),
        profilePhoto: photo ?? undefined,
      });
      addPet(pet);
      setActivePet(pet);
      router.push('/(onboarding)/pet-health');
    } catch {
      setFormError('Could not save pet profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    router.push('/(onboarding)/pet-health');
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
            <Text style={styles.brand}>PetPulse</Text>
          </View>
          <View style={styles.stepPill}>
            <Text style={styles.stepText}>Step 1 of 3</Text>
          </View>
        </View>

        {/* PROGRESS BAR */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '33%' }]} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* INTRO */}
          <View style={styles.intro}>
            <Text style={styles.introTitle}>
              Tell us about your{' '}
              <Text style={styles.introAccent}>best friend</Text>
            </Text>
            <Text style={styles.introSub}>
              We'll use this to create a personalized health and nutrition plan for your pet.
            </Text>
          </View>

          {/* TWO COLUMN: Photo + Form */}
          <View style={styles.twoCol}>

            {/* PHOTO UPLOAD */}
            <View style={styles.photoCol}>
              <TouchableOpacity style={styles.photoUpload} onPress={pickPhoto} activeOpacity={0.8}>
                {photo ? (
                  <Image source={{ uri: photo }} style={styles.photoImage} />
                ) : (
                  <>
                    <View style={styles.photoIconCircle}>
                      <MaterialCommunityIcons name="camera-plus" size={28} color="#fff" />
                    </View>
                    <Text style={styles.photoLabel}>Upload Photo</Text>
                    <Text style={styles.photoSub}>Show us that cute face!</Text>
                  </>
                )}
              </TouchableOpacity>
              {/* Profile Ready badge */}
              <View style={styles.profileBadge}>
                <MaterialCommunityIcons name="star-circle" size={16} color="#ab3500" />
                <Text style={styles.profileBadgeText}>PROFILE READY</Text>
              </View>
            </View>

            {/* FORM */}
            <View style={styles.formCol}>

              {/* Species toggle */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>SPECIES</Text>
                <View style={styles.speciesRow}>
                  <TouchableOpacity
                    style={[styles.speciesBtn, species === 'dog' && styles.speciesBtnActive]}
                    onPress={() => setSpecies('dog')}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons name="dog" size={18} color={species === 'dog' ? '#fff' : '#4c5f7e'} />
                    <Text style={[styles.speciesText, species === 'dog' && styles.speciesTextActive]}>Dog</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.speciesBtn, species === 'cat' && styles.speciesBtnActive]}
                    onPress={() => setSpecies('cat')}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons name="cat" size={18} color={species === 'cat' ? '#fff' : '#4c5f7e'} />
                    <Text style={[styles.speciesText, species === 'cat' && styles.speciesTextActive]}>Cat</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Pet Name */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>PET'S NAME</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Luna"
                  placeholderTextColor="#8d7168"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              {/* Breed */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>BREED</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, { paddingRight: 40 }]}
                    placeholder="Search breeds..."
                    placeholderTextColor="#8d7168"
                    value={breed}
                    onChangeText={setBreed}
                  />
                  <MaterialCommunityIcons name="magnify" size={18} color="#8d7168" style={styles.inputIcon} />
                </View>
              </View>

            </View>
          </View>

          {/* SECOND ROW FIELDS */}
          <View style={styles.rowFields}>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.label}>BIRTHDAY</Text>
              <TextInput
                style={styles.input}
                placeholder="DD MM YYYY (e.g. 12 12 2025)"
                placeholderTextColor="#8d7168"
                value={dob}
                onChangeText={setDob}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.fieldGroup, { flex: 1 }]}>
              <Text style={styles.label}>WEIGHT (KG)</Text>
              <TextInput
                style={styles.input}
                placeholder="0.0"
                placeholderTextColor="#8d7168"
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          {/* GENDER */}
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { textAlign: 'center' }]}>GENDER</Text>
            <View style={styles.genderRow}>
              {GENDERS.map(g => {
                const active = gender === g;
                return (
                  <TouchableOpacity
                    key={g}
                    style={styles.genderOption}
                    onPress={() => setGender(g as 'Male' | 'Female')}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.genderCircle, active && styles.genderCircleActive]}>
                      <MaterialCommunityIcons
                        name={g === 'Male' ? 'gender-male' : 'gender-female'}
                        size={24}
                        color={active ? '#4d607f' : '#594139'}
                      />
                    </View>
                    <Text style={[styles.genderLabel, active && styles.genderLabelActive]}>{g}</Text>
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
                onPress={() => void handleNext()}
                activeOpacity={0.85}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Next: Health Details</Text>
                )}
              </TouchableOpacity>
            </LinearGradient>
            <TouchableOpacity style={styles.skipBtn} onPress={handleSkip} disabled={saving}>
              <Text style={styles.skipText}>I'll do this later</Text>
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
    paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#f5f3f0',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brand: { fontSize: 18, fontWeight: '800', color: '#ab3500', letterSpacing: -0.3 },
  stepPill: { backgroundColor: 'transparent' },
  stepText: { fontSize: 13, fontWeight: '500', color: '#594139' },
  progressTrack: { height: 4, backgroundColor: '#efeeeb', width: '100%' },
  progressFill: { height: 4, backgroundColor: '#ab3500', borderRadius: 2 },
  scroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  intro: { marginBottom: 24 },
  introTitle: { fontSize: 26, fontWeight: '800', color: '#1b1c1a', lineHeight: 34, marginBottom: 8 },
  introAccent: { color: '#ab3500' },
  introSub: { fontSize: 14, color: '#594139', lineHeight: 21 },
  twoCol: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  photoCol: { width: 120, alignItems: 'center', gap: 12 },
  photoUpload: {
    width: 120, height: 150, borderRadius: 16,
    backgroundColor: '#ffffff', borderWidth: 2,
    borderColor: 'rgba(225,191,181,0.35)', borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', gap: 8,
    overflow: 'hidden',
  },
  photoImage: { width: '100%', height: '100%', borderRadius: 14 },
  photoIconCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#FF6B35', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#FF6B35', shadowOpacity: 0.3, shadowRadius: 8, elevation: 3,
  },
  photoLabel: { fontSize: 13, fontWeight: '700', color: '#1b1c1a' },
  photoSub: { fontSize: 11, color: '#594139', textAlign: 'center' },
  profileBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#ffffff', borderRadius: 10, padding: 8,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 2,
  },
  profileBadgeText: { fontSize: 9, fontWeight: '800', color: '#4c5f7e', letterSpacing: 1 },
  formCol: { flex: 1, gap: 0 },
  fieldGroup: { marginBottom: 14 },
  label: {
    fontSize: 10, fontWeight: '800', color: '#344765',
    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6, marginLeft: 2,
  },
  input: {
    backgroundColor: '#f5f3f0', borderRadius: 12,
    paddingHorizontal: 14, height: 46, fontSize: 14, color: '#1b1c1a',
  },
  inputWrapper: { position: 'relative' },
  inputIcon: { position: 'absolute', right: 12, top: 13 },
  speciesRow: { flexDirection: 'row', gap: 8 },
  speciesBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, height: 46, borderRadius: 999, backgroundColor: '#f5f3f0',
  },
  speciesBtnActive: {
    backgroundColor: '#FF6B35',
    shadowColor: '#FF6B35', shadowOpacity: 0.3, shadowRadius: 6, elevation: 3,
  },
  speciesText: { fontSize: 13, fontWeight: '700', color: '#4c5f7e' },
  speciesTextActive: { color: '#ffffff' },
  rowFields: { flexDirection: 'row', gap: 12 },
  genderRow: { flexDirection: 'row', justifyContent: 'center', gap: 32 },
  genderOption: { alignItems: 'center', gap: 6 },
  genderCircle: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#f5f3f0', alignItems: 'center', justifyContent: 'center',
  },
  genderCircleActive: { backgroundColor: '#c7dbff' },
  genderLabel: { fontSize: 11, fontWeight: '700', color: '#8d7168', textTransform: 'uppercase', letterSpacing: 0.5 },
  genderLabelActive: { color: '#1b1c1a' },
  ctaSection: { marginTop: 24, gap: 14, alignItems: 'center' },
  formError: {
    fontSize: 13,
    color: '#ba1a1a',
    textAlign: 'center',
    alignSelf: 'stretch',
    marginBottom: 4,
  },
  gradientBtn: { borderRadius: 999, width: '100%' },
  btnInner: { height: 56, alignItems: 'center', justifyContent: 'center', borderRadius: 999 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  skipBtn: { paddingVertical: 8 },
  skipText: { fontSize: 13, fontWeight: '700', color: '#594139' },
});
