import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const IN_PROGRESS = [
  {
    icon: 'heart' as const,
    iconBg: '#ffdbd0',
    iconColor: '#ab3500',
    title: 'Healthy Habit',
    desc: 'Maintain a consistent feeding schedule for 7 consecutive days.',
    progress: 5,
    total: 7,
    progressColor: '#FF6B35',
    status: 'IN PROGRESS',
    statusColor: '#ab3500',
    statusBg: 'rgba(255,107,53,0.1)',
  },
  {
    icon: 'food' as const,
    iconBg: '#b5ebff',
    iconColor: '#00677e',
    title: 'Nutritionist',
    desc: 'Consult with a professional nutritionist or log 30 customized meals.',
    progress: 12,
    total: 30,
    progressColor: '#00a7cb',
    status: 'LOCKED',
    statusColor: '#00677e',
    statusBg: 'rgba(0,167,203,0.1)',
  },
];

const COMING_SOON = [
  { icon: 'account-group' as const, title: 'Social Butterfly', desc: 'Attend 3 pet meetups in your local area.' },
  { icon: 'pill' as const, title: 'Wellness Guru', desc: 'Complete a full annual checkup and vaccination cycle.' },
];

export default function AchievementsListScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <MaterialCommunityIcons name="dog" size={20} color="#ab3500" />
        </View>
        <Text style={styles.headerTitle}>Milestones</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons name="cog-outline" size={22} color="#ab3500" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* STREAK HERO */}
        <View style={styles.heroCard}>
          <View style={styles.heroDecor} />
          <View style={styles.heroLeft}>
            <View style={styles.heroPill}>
              <Text style={styles.heroPillText}>CURRENT STREAK</Text>
            </View>
            <Text style={styles.heroNumber}>12 Days!</Text>
            <Text style={styles.heroSub}>
              You and Luna are crushing your daily health goals. Keep it up!
            </Text>
          </View>
          <View style={styles.xpCard}>
            <View style={styles.xpIconCircle}>
              <MaterialCommunityIcons name="fire" size={28} color="#ab3500" />
            </View>
            <View>
              <Text style={styles.xpNumber}>1,240</Text>
              <Text style={styles.xpLabel}>TOTAL XP POINTS</Text>
            </View>
          </View>
        </View>

        {/* FEATURED: FIRST WALK */}
        <View style={styles.featuredCard}>
          <View style={styles.featuredIconBox}>
            <MaterialCommunityIcons name="walk" size={44} color="#4c5f7e" />
            <View style={styles.checkBadge}>
              <MaterialCommunityIcons name="check" size={12} color="#fff" />
            </View>
          </View>
          <View style={styles.featuredContent}>
            <Text style={styles.featuredTitle}>First Walk</Text>
            <Text style={styles.featuredDesc}>
              Completed your first outdoor adventure. You've unlocked the "Explorer" badge!
            </Text>
            <View style={styles.featuredTags}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>COMMUNITY</Text>
              </View>
              <View style={[styles.tag, { backgroundColor: 'rgba(171,53,0,0.08)' }]}>
                <Text style={[styles.tagText, { color: '#ab3500' }]}>+50 XP EARNED</Text>
              </View>
            </View>
          </View>
        </View>

        {/* HINT CARD */}
        <View style={styles.hintCard}>
          <MaterialCommunityIcons name="lightbulb-on" size={32} color="#ab3500" />
          <Text style={styles.hintTitle}>Next Milestone Hint</Text>
          <Text style={styles.hintText}>
            Log 3 healthy meals this week to unlock the{' '}
            <Text style={{ fontWeight: '700' }}>Nutritionist</Text> badge!
          </Text>
        </View>

        {/* IN PROGRESS */}
        <View style={styles.progressSection}>
          {IN_PROGRESS.map((item, i) => (
            <View key={i} style={styles.progressCard}>
              <View style={styles.progressCardTop}>
                <View style={[styles.progressIconBox, { backgroundColor: item.iconBg }]}>
                  <MaterialCommunityIcons name={item.icon} size={28} color={item.iconColor} />
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.statusBg }]}>
                  <Text style={[styles.statusText, { color: item.statusColor }]}>{item.status}</Text>
                </View>
              </View>
              <Text style={styles.progressTitle}>{item.title}</Text>
              <Text style={styles.progressDesc}>{item.desc}</Text>
              <View style={styles.progressBar}>
                <View style={styles.progressTrackLabels}>
                  <Text style={styles.progressTrackLabel}>PROGRESS</Text>
                  <Text style={styles.progressTrackLabel}>{item.progress}/{item.total}</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[
                    styles.progressFill,
                    { width: `${(item.progress / item.total) * 100}%` as any, backgroundColor: item.progressColor }
                  ]} />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* COMING SOON */}
        <View style={styles.comingSoonSection}>
          <View style={styles.comingSoonHeader}>
            <MaterialCommunityIcons name="shield-star" size={22} color="#4c5f7e" />
            <Text style={styles.comingSoonTitle}>Coming Soon</Text>
          </View>
          {COMING_SOON.map((item, i) => (
            <View key={i} style={styles.comingSoonCard}>
              <View style={styles.comingSoonIcon}>
                <MaterialCommunityIcons name={item.icon} size={24} color="#b4c7eb" />
              </View>
              <View style={styles.comingSoonContent}>
                <Text style={styles.comingSoonName}>{item.title}</Text>
                <Text style={styles.comingSoonDesc}>{item.desc}</Text>
              </View>
              <MaterialCommunityIcons name="lock" size={20} color="rgba(89,65,57,0.3)" />
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fbf9f6' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#fbf9f6',
  },
  avatarCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#c7dbff', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#ab3500' },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },

  heroCard: {
    backgroundColor: '#FF6B35', borderRadius: 24, padding: 20,
    marginBottom: 16, overflow: 'hidden', position: 'relative',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12,
  },
  heroDecor: {
    position: 'absolute', right: -30, bottom: -30,
    opacity: 0.15,
  },
  heroLeft: { flex: 1 },
  heroPill: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 8,
  },
  heroPillText: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase' },
  heroNumber: { fontSize: 32, fontWeight: '800', color: '#fff', marginBottom: 6 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 18 },
  xpCard: {
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  xpIconCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  xpNumber: { fontSize: 22, fontWeight: '800', color: '#fff' },
  xpLabel: { fontSize: 9, fontWeight: '800', color: 'rgba(255,255,255,0.7)', letterSpacing: 1, textTransform: 'uppercase' },

  featuredCard: {
    backgroundColor: '#ffffff', borderRadius: 24, padding: 20,
    flexDirection: 'row', gap: 16, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12, elevation: 2,
  },
  featuredIconBox: {
    width: 80, height: 80, borderRadius: 16,
    backgroundColor: '#c7dbff', alignItems: 'center', justifyContent: 'center',
    position: 'relative', flexShrink: 0,
  },
  checkBadge: {
    position: 'absolute', top: -6, right: -6,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#2ECC71', alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: '#fff',
  },
  featuredContent: { flex: 1 },
  featuredTitle: { fontSize: 17, fontWeight: '800', color: '#1b1c1a', marginBottom: 4 },
  featuredDesc: { fontSize: 13, color: '#594139', lineHeight: 19, marginBottom: 10 },
  featuredTags: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  tag: {
    backgroundColor: '#c7dbff', borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  tagText: { fontSize: 10, fontWeight: '800', color: '#4d607f', letterSpacing: 0.5 },

  hintCard: {
    backgroundColor: 'rgba(171,53,0,0.05)', borderRadius: 20,
    borderWidth: 2, borderColor: 'rgba(255,107,53,0.12)',
    padding: 20, alignItems: 'center', gap: 6, marginBottom: 16,
  },
  hintTitle: { fontSize: 15, fontWeight: '700', color: '#ab3500' },
  hintText: { fontSize: 13, color: '#594139', textAlign: 'center', lineHeight: 19 },

  progressSection: { gap: 12, marginBottom: 16 },
  progressCard: {
    backgroundColor: '#ffffff', borderRadius: 24, padding: 20, gap: 8,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12, elevation: 1,
  },
  progressCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  progressIconBox: {
    width: 56, height: 56, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  statusBadge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  progressTitle: { fontSize: 16, fontWeight: '700', color: '#1b1c1a' },
  progressDesc: { fontSize: 13, color: '#594139', lineHeight: 19 },
  progressBar: { marginTop: 4, gap: 6 },
  progressTrackLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  progressTrackLabel: { fontSize: 10, fontWeight: '800', color: '#594139', textTransform: 'uppercase', letterSpacing: 0.5 },
  progressTrack: { height: 10, backgroundColor: '#eae8e5', borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: 10, borderRadius: 999 },

  comingSoonSection: { gap: 10 },
  comingSoonHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  comingSoonTitle: { fontSize: 20, fontWeight: '700', color: '#4c5f7e' },
  comingSoonCard: {
    backgroundColor: '#f5f3f0', borderRadius: 20, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  comingSoonIcon: {
    width: 48, height: 48, borderRadius: 999,
    backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center',
    opacity: 0.6,
  },
  comingSoonContent: { flex: 1 },
  comingSoonName: { fontSize: 14, fontWeight: '700', color: '#1b1c1a', opacity: 0.6, marginBottom: 2 },
  comingSoonDesc: { fontSize: 12, color: '#594139' },
});
