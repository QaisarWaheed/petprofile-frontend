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
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { usePetStore } from '../../../stores/pet.store';
import { useLogs } from '../../../hooks/useLogs';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

const CATEGORIES: {
  key: string;
  label: string;
  icon: IconName;
}[] = [
  { key: 'food', label: 'Food', icon: 'food' },
  { key: 'vet', label: 'Vet', icon: 'stethoscope' },
  { key: 'grooming', label: 'Grooming', icon: 'content-cut' },
  { key: 'toys', label: 'Toys', icon: 'tennis-ball' },
  { key: 'medicine', label: 'Medicine', icon: 'pill' },
  { key: 'other', label: 'Other', icon: 'dots-horizontal' },
];

export default function ExpenseLogScreen() {
  const router = useRouter();
  const activePet = usePetStore((s) => s.activePet);
  const { createLog } = useLogs(activePet?.id);

  const [category, setCategory] = useState<string>('food');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setError('');
    if (!activePet?.id) {
      setError('No active pet selected.');
      return;
    }
    const n = Number(amount);
    if (Number.isNaN(n) || n < 0) {
      setError('Enter a valid amount.');
      return;
    }
    setLoading(true);
    try {
      await createLog('expense', {
        category,
        amount: n,
        description,
        loggedAt: new Date().toISOString(),
      });
      router.back();
    } catch {
      setError('Could not save expense log. Please try again.');
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
            <Text style={styles.headerTitle}>Expense Log</Text>
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
          <Text style={styles.sectionLabel}>CATEGORY</Text>
          <View style={styles.catGrid}>
            {CATEGORIES.map((c) => {
              const active = category === c.key;
              return (
                <TouchableOpacity
                  key={c.key}
                  style={[styles.catCard, active && styles.catCardActive]}
                  onPress={() => setCategory(c.key)}
                  activeOpacity={0.85}
                >
                  <MaterialCommunityIcons
                    name={c.icon}
                    size={26}
                    color={active ? '#ab3500' : '#4c5f7e'}
                  />
                  <Text style={[styles.catLabel, active && styles.catLabelActive]}>{c.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>AMOUNT</Text>
            <View style={styles.amountRow}>
              <Text style={styles.dollar}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor="#e1bfb5"
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder="What was this for?"
              placeholderTextColor="#8d7168"
              value={description}
              onChangeText={setDescription}
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
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4c5f7e',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginLeft: 4,
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  catCard: {
    width: '31%',
    flexGrow: 1,
    minWidth: '30%',
    aspectRatio: 1.1,
    maxWidth: '33%',
    backgroundColor: '#f5f3f0',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  catCardActive: {
    borderColor: '#ab3500',
    backgroundColor: '#ffdbd0',
  },
  catLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#594139',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  catLabelActive: { color: '#ab3500' },
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
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    minHeight: 64,
  },
  dollar: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ab3500',
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '800',
    color: '#ab3500',
    paddingVertical: 8,
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
