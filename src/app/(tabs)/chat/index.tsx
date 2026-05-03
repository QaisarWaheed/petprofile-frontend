import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SUGGESTED_PROMPTS = [
  { text: 'Analyze mood trends', icon: 'chart-line' as const },
  { text: 'Recent health log', icon: 'clipboard-text' as const },
  { text: 'Food recommendations', icon: 'food' as const },
  { text: 'Activity summary', icon: 'run-fast' as const },
];

const RECENT_CONVERSATIONS = [
  {
    icon: 'walk' as const,
    title: "Cooper's Morning Walk",
    preview: 'Analysis of heart rate and pace during the 45-minute stroll...',
    time: '2h ago',
  },
  {
    icon: 'emoticon-happy-outline' as const,
    title: 'Mood Analysis',
    preview: 'Based on sleep patterns and interaction scores, Cooper is feeling...',
    time: 'Yesterday',
  },
  {
    icon: 'food-apple' as const,
    title: 'Diet Questions',
    preview: 'Switching to the grain-free option: pros and cons for Golden...',
    time: '3 days ago',
  },
];

export default function ChatHomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarCircle}>
            <MaterialCommunityIcons name="dog" size={20} color="#ab3500" />
          </View>
          <Text style={styles.brand}>PetPulse AI</Text>
        </View>
        <TouchableOpacity style={styles.settingsBtn}>
          <MaterialCommunityIcons name="cog-outline" size={22} color="#4c5f7e" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* HERO GREETING */}
        <View style={styles.heroSection}>
          <View style={styles.aiIconWrapper}>
            <View style={styles.aiIconBg}>
              <MaterialCommunityIcons name="robot" size={30} color="#ab3500" />
            </View>
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>AI</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>
            How can I help you and{' '}
            <Text style={styles.heroAccent}>Cooper</Text>
            {' '}today?
          </Text>
          <Text style={styles.heroSub}>
            I'm synced with Cooper's health data and activity logs.
          </Text>
        </View>

        {/* SUGGESTED PROMPTS */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SUGGESTED INSIGHTS</Text>
          <View style={styles.promptsWrap}>
            {SUGGESTED_PROMPTS.map((p, i) => (
              <TouchableOpacity
                key={i}
                style={styles.promptChip}
                onPress={() => router.push('/(tabs)/chat/thread' as any)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name={p.icon} size={18} color="#ab3500" />
                <Text style={styles.promptChipText}>{p.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* RECENT CONVERSATIONS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>RECENT CONVERSATIONS</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.convList}>
            {RECENT_CONVERSATIONS.map((c, i) => (
              <TouchableOpacity
                key={i}
                style={styles.convCard}
                onPress={() => router.push('/(tabs)/chat/thread' as any)}
                activeOpacity={0.8}
              >
                <View style={styles.convIconBox}>
                  <MaterialCommunityIcons name={c.icon} size={22} color="#FF6B35" />
                </View>
                <View style={styles.convContent}>
                  <View style={styles.convTopRow}>
                    <Text style={styles.convTitle}>{c.title}</Text>
                    <Text style={styles.convTime}>{c.time}</Text>
                  </View>
                  <Text style={styles.convPreview} numberOfLines={1}>{c.preview}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#e1bfb5" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(tabs)/chat/thread' as any)}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name="plus" size={28} color="#fff" />
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fbf9f6' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fbf9f6',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#efeeeb', borderWidth: 2, borderColor: '#FF6B35',
    alignItems: 'center', justifyContent: 'center',
  },
  brand: { fontSize: 20, fontWeight: '800', color: '#ab3500', letterSpacing: -0.3 },
  settingsBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  scroll: { paddingHorizontal: 20, paddingTop: 8 },

  heroSection: { marginBottom: 32 },
  aiIconWrapper: { position: 'relative', alignSelf: 'flex-start', marginBottom: 16 },
  aiIconBg: {
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: 'rgba(255,219,208,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  aiBadge: {
    position: 'absolute', top: -6, right: -6,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#ab3500', alignItems: 'center', justifyContent: 'center',
  },
  aiBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  heroTitle: { fontSize: 26, fontWeight: '800', color: '#1b1c1a', lineHeight: 34, marginBottom: 8 },
  heroAccent: { color: '#ab3500' },
  heroSub: { fontSize: 14, color: '#594139', lineHeight: 21 },

  section: { marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: '#4d607f', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 },
  viewAll: { fontSize: 13, fontWeight: '700', color: '#ab3500' },

  promptsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  promptChip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: '#ffffff', borderRadius: 999,
    borderWidth: 1, borderColor: 'rgba(225,191,181,0.15)',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  promptChipText: { fontSize: 13, fontWeight: '600', color: '#594139' },

  convList: { gap: 10 },
  convCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#f5f3f0', borderRadius: 20, padding: 14,
  },
  convIconBox: {
    width: 48, height: 48, borderRadius: 16,
    backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  convContent: { flex: 1, gap: 4 },
  convTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  convTitle: { fontSize: 14, fontWeight: '700', color: '#1b1c1a', flex: 1 },
  convTime: { fontSize: 11, color: '#594139', marginLeft: 8 },
  convPreview: { fontSize: 12, color: '#594139', lineHeight: 18 },

  fab: {
    position: 'absolute', bottom: 88, right: 20,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#ab3500', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#ab3500', shadowOpacity: 0.35,
    shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 8,
  },
});
