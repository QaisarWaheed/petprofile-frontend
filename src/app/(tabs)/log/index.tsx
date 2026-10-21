import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 48 - 12) / 2;

const LOG_TYPES = [
  { label: 'Meal', icon: 'food', iconBg: '#ffdbd0', iconColor: '#ab3500', route: '/(tabs)/log/meal' },
  { label: 'Walk', icon: 'walk', iconBg: '#d5e3ff', iconColor: '#4c5f7e', route: '/(tabs)/log/walk' },
  { label: 'Mood', icon: 'emoticon-happy-outline', iconBg: '#b5ebff', iconColor: '#00677e', route: '/(tabs)/log/mood' },
  { label: 'Symptom', icon: 'medical-bag', iconBg: '#ffdad6', iconColor: '#ba1a1a', route: '/(tabs)/log/symptom' },
  { label: 'Medication', icon: 'pill', iconBg: '#b5ebff', iconColor: '#00a7cb', route: '/(tabs)/log/medication' },
  { label: 'Vet Visit', icon: 'stethoscope', iconBg: '#efeeeb', iconColor: '#4c5f7e', route: '/(tabs)/log/vet-visit' },
  { label: 'Grooming', icon: 'content-cut', iconBg: '#ffdbd0', iconColor: '#ab3500', route: '/(tabs)/log/grooming' },
  { label: 'Expense', icon: 'cash', iconBg: '#c7dbff', iconColor: '#4d607f', route: '/(tabs)/log/expense' },
  { label: 'Weight', icon: 'scale-bathroom', iconBg: '#e4e2df', iconColor: '#594139', route: '/(tabs)/log/weight' },
] as const;

const RECENT_LOGS = [
  { icon: 'food', iconColor: '#ab3500', title: 'Breakfast', meta: '200g Kibble • 8:30 AM' },
  { icon: 'walk', iconColor: '#4c5f7e', title: 'Morning Walk', meta: '1.5 miles • 7:15 AM' },
];

export default function LogHubScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* TOP BAR */}
      <View style={styles.topBar}>
        <View style={styles.topLeft}>
          <View style={styles.avatarCircle}>
            <MaterialCommunityIcons name="dog" size={20} color="#ab3500" />
          </View>
          <Text style={styles.title}>Log Activity</Text>
        </View>
        <TouchableOpacity>
          <MaterialCommunityIcons name="cog-outline" size={22} color="#4c5f7e" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO TEXT */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Quick Log Hub</Text>
          <Text style={styles.heroSub}>What's happening with your pet today?</Text>
        </View>

        {/* LOG GRID */}
        <View style={styles.grid}>
          {LOG_TYPES.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.logCard}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.logIconCircle, { backgroundColor: item.iconBg }]}>
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={28}
                  color={item.iconColor}
                />
              </View>
              <Text style={styles.logLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}

          {/* VOICE LOG — spans full width */}
          <TouchableOpacity
            style={styles.voiceCard}
            onPress={() => router.push('/(tabs)/log/voice' as any)}
            activeOpacity={0.85}
          >
            <View style={styles.voiceIconCircle}>
              <MaterialCommunityIcons name="microphone" size={28} color="#fff" />
            </View>
            <Text style={styles.voiceLabel}>Voice Log</Text>
          </TouchableOpacity>
        </View>

        {/* RECENT LOGS */}
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>Recent Logs</Text>
            <TouchableOpacity>
              <Text style={styles.seeHistory}>See History</Text>
            </TouchableOpacity>
          </View>

          {RECENT_LOGS.map((log, i) => (
            <TouchableOpacity key={i} style={styles.recentRow} activeOpacity={0.8}>
              <View style={styles.recentIcon}>
                <MaterialCommunityIcons
                  name={log.icon as any}
                  size={20}
                  color={log.iconColor}
                />
              </View>
              <View style={styles.recentText}>
                <Text style={styles.recentName}>{log.title}</Text>
                <Text style={styles.recentMeta}>{log.meta}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#594139" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fbf9f6' },

  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fbf9f6',
  },
  topLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#c7dbff', alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 22, fontWeight: '800', color: '#ab3500', letterSpacing: -0.3 },

  scroll: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 40 },

  hero: { marginBottom: 20 },
  heroTitle: { fontSize: 28, fontWeight: '800', color: '#1b1c1a', letterSpacing: -0.5, marginBottom: 4 },
  heroSub: { fontSize: 15, color: '#594139', fontWeight: '500' },

  grid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 32,
  },
  logCard: {
    width: CARD_SIZE, backgroundColor: '#ffffff',
    borderRadius: 20, padding: 20,
    alignItems: 'center', gap: 12,
    shadowColor: '#1b1c1a', shadowOpacity: 0.06,
    shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 3,
  },
  logIconCircle: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
  },
  logLabel: { fontSize: 13, fontWeight: '700', color: '#4c5f7e', letterSpacing: 0.2 },

  voiceCard: {
    width: '100%', backgroundColor: '#FF6B35',
    borderRadius: 20, padding: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 12,
    shadowColor: '#FF6B35', shadowOpacity: 0.3,
    shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 4,
  },
  voiceIconCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  voiceLabel: { fontSize: 16, fontWeight: '700', color: '#fff', letterSpacing: 0.2 },

  recentSection: { gap: 10 },
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  recentTitle: { fontSize: 18, fontWeight: '700', color: '#1b1c1a' },
  seeHistory: { fontSize: 13, fontWeight: '700', color: '#ab3500' },

  recentRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#f5f3f0', borderRadius: 16, padding: 14,
  },
  recentIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center',
  },
  recentText: { flex: 1 },
  recentName: { fontSize: 14, fontWeight: '700', color: '#1b1c1a' },
  recentMeta: { fontSize: 12, color: '#594139', marginTop: 2 },
});
