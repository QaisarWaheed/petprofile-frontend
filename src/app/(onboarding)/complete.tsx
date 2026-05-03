import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function OnboardingCompleteScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

      {/* BACKGROUND DECORATIONS */}
      <View style={styles.decorContainer} pointerEvents="none">
        <MaterialCommunityIcons
          name="party-popper"
          size={40}
          color="#ab3500"
          style={[styles.decor, { top: '10%', left: '12%', transform: [{ rotate: '-12deg' }] }]}
        />
        <MaterialCommunityIcons
          name="star"
          size={28}
          color="#00a7cb"
          style={[styles.decor, { top: '18%', right: '8%', transform: [{ rotate: '45deg' }] }]}
        />
        <MaterialCommunityIcons
          name="flower"
          size={48}
          color="#FF6B35"
          style={[styles.decor, { bottom: '28%', left: '4%', transform: [{ rotate: '12deg' }] }]}
        />
        <MaterialCommunityIcons
          name="paw"
          size={40}
          color="#4c5f7e"
          style={[styles.decor, { bottom: '14%', right: '12%', transform: [{ rotate: '-45deg' }] }]}
        />
        <MaterialCommunityIcons
          name="heart"
          size={22}
          color="#e1bfb5"
          style={[styles.decor, { top: '38%', right: '22%', transform: [{ rotate: '90deg' }] }]}
        />
      </View>

      {/* MAIN CONTENT */}
      <View style={styles.content}>

        {/* AVATAR */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarRing} />
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400' }}
            style={styles.avatar}
            resizeMode="cover"
          />
          <View style={styles.verifiedBadge}>
            <MaterialCommunityIcons name="check-decagram" size={28} color="#fff" />
          </View>
        </View>

        {/* TEXT */}
        <View style={styles.textSection}>
          <Text style={styles.title}>You're all set, Luna!</Text>
          <Text style={styles.subtitle}>
            We've personalized your experience to help Luna thrive.
          </Text>
        </View>

        {/* CTA BUTTON */}
        <View style={styles.ctaSection}>
          <LinearGradient
            colors={['#ab3500', '#FF6B35']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBtn}
          >
            <TouchableOpacity
              style={styles.btnInner}
              onPress={handleGetStarted}
              activeOpacity={0.85}
            >
              <Text style={styles.btnText}>Let's get started</Text>
              <MaterialCommunityIcons name="arrow-right" size={22} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* FEATURE HIGHLIGHTS */}
        <View style={styles.bentoGrid}>
          <View style={styles.bentoCard}>
            <View style={styles.bentoIconWrap}>
              <MaterialCommunityIcons
                name={'shield-heart' as never}
                size={18}
                color="#4d607f"
              />
            </View>
            <Text style={styles.bentoLabel}>HEALTH TRACKED</Text>
          </View>
          <View style={styles.bentoCard}>
            <View style={[styles.bentoIconWrap, { backgroundColor: '#b5ebff' }]}>
              <MaterialCommunityIcons name="brain" size={18} color="#004e60" />
            </View>
            <Text style={styles.bentoLabel}>BEHAVIOR MAP</Text>
          </View>
          <View style={styles.bentoCard}>
            <View style={[styles.bentoIconWrap, { backgroundColor: '#ffdbd0' }]}>
              <MaterialCommunityIcons name="calendar-check" size={18} color="#832600" />
            </View>
            <Text style={styles.bentoLabel}>REMINDERS SET</Text>
          </View>
          <View style={styles.bentoCard}>
            <View style={[styles.bentoIconWrap, { backgroundColor: '#d5e3ff' }]}>
              <MaterialCommunityIcons name="chart-line" size={18} color="#344765" />
            </View>
            <Text style={styles.bentoLabel}>AI INSIGHTS</Text>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fbf9f6' },

  decorContainer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2,
  },
  decor: { position: 'absolute' },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },

  avatarContainer: {
    position: 'relative',
    width: 220,
    height: 220,
    marginBottom: 36,
  },
  avatarRing: {
    position: 'absolute',
    top: -8,
    left: -8,
    width: 236,
    height: 236,
    borderRadius: 118,
    borderWidth: 3,
    borderColor: 'rgba(171,53,0,0.12)',
  },
  avatar: {
    width: 220,
    height: 220,
    borderRadius: 110,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -4,
    right: 8,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ab3500',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ab3500',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  textSection: {
    alignItems: 'center',
    marginBottom: 36,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1b1c1a',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#594139',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },

  ctaSection: { width: '100%', marginBottom: 32 },
  gradientBtn: { borderRadius: 999 },
  btnInner: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 999,
  },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '700' },

  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: '100%',
  },
  bentoCard: {
    width: '47%',
    backgroundColor: '#f5f3f0',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  bentoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#c7dbff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bentoLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#594139',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
