import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const BADGES_EARNED = [
  { label: 'Early Bird', icon: 'weather-sunny' as const, iconColor: '#854d0e', bgColor: '#fef9c3', borderColor: '#fde68a' },
  { label: 'Meal Master', icon: 'food' as const, iconColor: '#ab3500', bgColor: '#ffdbd0', borderColor: '#ffb59d' },
  { label: 'Walk Star', icon: 'paw' as const, iconColor: '#4c5f7e', bgColor: '#d5e3ff', borderColor: '#b4c7eb' },
];

const BADGES_LOCKED = [
  { label: 'Health Hero', icon: 'medical-bag' as const },
  { label: 'Social Butterfly', icon: 'account-group' as const },
  { label: 'Night Owl', icon: 'moon-waning-crescent' as const },
];

const STREAK = 12;
const MILESTONE = 15;
const PROGRESS = STREAK / MILESTONE;

export default function AchievementsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarCircle}>
            <MaterialCommunityIcons name="dog" size={20} color="#ab3500" />
          </View>
          <Text style={styles.headerTitle}>Pet Achievements</Text>
        </View>
        <TouchableOpacity>
          <MaterialCommunityIcons name="cog-outline" size={22} color="#4c5f7e" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* STREAK HERO */}
        <View style={styles.streakCard}>
          <View style={styles.streakBgDecor} />
          <LinearGradient
            colors={['#ab3500', '#FF6B35']}
            style={styles.streakCircle}
          >
            <MaterialCommunityIcons name="fire" size={44} color="#fff" />
            <Text style={styles.streakNumber}>{STREAK}</Text>
          </LinearGradient>
          <Text style={styles.streakTitle}>{STREAK}-Day Care Streak!</Text>
          <Text style={styles.streakSub}>You're doing great, Cooper's parent!</Text>
        </View>

        {/* BADGES */}
        <View style={styles.badgesSection}>
          <View style={styles.badgesHeader}>
            <Text style={styles.badgesTitle}>Your Badges</Text>
            <View style={styles.collectedBadge}>
              <Text style={styles.collectedText}>3 / 6 Collected</Text>
            </View>
          </View>

          <View style={styles.badgesGrid}>
            {/* Earned */}
            {BADGES_EARNED.map(b => (
              <View key={b.label} style={styles.badgeCard}>
                <View style={[styles.badgeIconCircle, { backgroundColor: b.bgColor, borderColor: b.borderColor }]}>
                  <MaterialCommunityIcons name={b.icon} size={36} color={b.iconColor} />
                </View>
                <Text style={styles.badgeLabel}>{b.label}</Text>
              </View>
            ))}

            {/* Locked */}
            {BADGES_LOCKED.map(b => (
              <View key={b.label} style={[styles.badgeCard, styles.badgeCardLocked]}>
                <View style={styles.lockedIconCircle}>
                  <MaterialCommunityIcons name={b.icon} size={36} color="#8d7168" />
                  <View style={styles.lockOverlay}>
                    <MaterialCommunityIcons name="lock" size={14} color="#1b1c1a" />
                  </View>
                </View>
                <Text style={styles.badgeLabelLocked}>{b.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* NEXT MILESTONE */}
        <View style={styles.milestoneCard}>
          <View style={styles.milestoneTop}>
            <View>
              <Text style={styles.milestoneTag}>NEXT MILESTONE</Text>
              <Text style={styles.milestoneTitle}>{MILESTONE}-Day Streak Reward</Text>
            </View>
            <View style={styles.milestoneCount}>
              <Text style={styles.milestoneNum}>{STREAK}</Text>
              <Text style={styles.milestoneDenom}>/{MILESTONE} days</Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={['#ab3500', '#FF6B35']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${PROGRESS * 100}%` as any }]}
            />
          </View>

          <View style={styles.milestoneNote}>
            <MaterialCommunityIcons name="information-outline" size={18} color="#ab3500" />
            <Text style={styles.milestoneNoteText}>
              {MILESTONE - STREAK} more days of consecutive care to unlock the "Super Parent" pack!
            </Text>
          </View>
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
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatarCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#c7dbff', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#4c5f7e' },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },

  streakCard: {
    backgroundColor: '#f5f3f0', borderRadius: 24, padding: 28,
    alignItems: 'center', marginBottom: 28, overflow: 'hidden', position: 'relative',
  },
  streakBgDecor: {
    position: 'absolute', top: -60, right: -60,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,107,53,0.08)',
  },
  streakCircle: {
    width: 120, height: 120, borderRadius: 60,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#ab3500', shadowOpacity: 0.25,
    shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 6,
  },
  streakNumber: { fontSize: 28, fontWeight: '900', color: '#fff', marginTop: -8 },
  streakTitle: { fontSize: 28, fontWeight: '800', color: '#1b1c1a', textAlign: 'center', letterSpacing: -0.5, marginBottom: 6 },
  streakSub: { fontSize: 15, color: '#594139', textAlign: 'center' },

  badgesSection: { marginBottom: 24 },
  badgesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  badgesTitle: { fontSize: 20, fontWeight: '700', color: '#4c5f7e' },
  collectedBadge: {
    backgroundColor: '#ffdbd0', borderRadius: 999,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  collectedText: { fontSize: 12, fontWeight: '700', color: '#ab3500' },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  badgeCard: {
    width: '30%', backgroundColor: '#ffffff', borderRadius: 20,
    padding: 16, alignItems: 'center', gap: 10,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  badgeCardLocked: { backgroundColor: '#f5f3f0', opacity: 0.6 },
  badgeIconCircle: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3,
  },
  lockedIconCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#e4e2df', alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  lockOverlay: {
    position: 'absolute', bottom: -4, right: -4,
    backgroundColor: '#fbf9f6', borderRadius: 999,
    padding: 4, borderWidth: 2, borderColor: '#f5f3f0',
  },
  badgeLabel: { fontSize: 12, fontWeight: '700', color: '#1b1c1a', textAlign: 'center' },
  badgeLabelLocked: { fontSize: 12, fontWeight: '700', color: '#594139', textAlign: 'center' },

  milestoneCard: {
    backgroundColor: '#f5f3f0', borderRadius: 24, padding: 20, gap: 14,
  },
  milestoneTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  milestoneTag: { fontSize: 10, fontWeight: '800', color: '#4c5f7e', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 },
  milestoneTitle: { fontSize: 18, fontWeight: '700', color: '#1b1c1a' },
  milestoneCount: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  milestoneNum: { fontSize: 28, fontWeight: '900', color: '#ab3500' },
  milestoneDenom: { fontSize: 15, fontWeight: '700', color: '#594139' },
  progressTrack: {
    height: 14, backgroundColor: '#e4e2df', borderRadius: 999, overflow: 'hidden',
  },
  progressFill: { height: 14, borderRadius: 999 },
  milestoneNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  milestoneNoteText: { flex: 1, fontSize: 13, color: '#594139', lineHeight: 19 },
});
