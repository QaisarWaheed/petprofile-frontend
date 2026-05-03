import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>

      {/* HERO IMAGE SECTION */}
      <View style={styles.heroContainer}>
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800' }}
          style={styles.heroImage}
          resizeMode="cover"
        >
          {/* Dark overlay for readability */}
          <View style={styles.heroOverlay} />

          {/* Floating health score card */}
          <View style={styles.floatingCard}>
            <View style={styles.floatingIconCircle}>
              <MaterialCommunityIcons name="heart" size={18} color="#fff" />
            </View>
            <View>
              <Text style={styles.floatingLabel}>DAILY HEALTH SCORE</Text>
              <Text style={styles.floatingValue}>98%</Text>
            </View>
          </View>
        </ImageBackground>

        {/* Diagonal clip effect at bottom */}
        <View style={styles.diagonalClip} />
      </View>

      {/* CONTENT SECTION */}
      <View style={styles.content}>

        {/* Brand */}
        <View style={styles.brandRow}>
          <MaterialCommunityIcons name="paw" size={30} color="#ab3500" />
          <Text style={styles.brandName}>PetPulse</Text>
        </View>

        <Text style={styles.headline}>Know your pet better</Text>
        <Text style={styles.subtext}>
          Comprehensive health tracking, activity logs, and wellness insights for your best friend.
        </Text>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="heart-pulse" size={22} color="#00677e" />
            <Text style={styles.statLabel}>REAL-TIME</Text>
            <Text style={styles.statValue}>Vitals</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="food" size={22} color="#FF6B35" />
            <Text style={styles.statLabel}>SMART</Text>
            <Text style={styles.statValue}>Nutrition</Text>
          </View>
        </View>

        {/* Buttons */}
        <LinearGradient
          colors={['#ab3500', '#FF6B35']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.signUpButton}
        >
          <TouchableOpacity
            style={styles.buttonInner}
            onPress={() => router.push('/(auth)/register')}
            activeOpacity={0.85}
          >
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </LinearGradient>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push('/(auth)/login')}
          activeOpacity={0.85}
        >
          <Text style={styles.loginText}>Log In</Text>
        </TouchableOpacity>

        {/* Footer icons */}
        <View style={styles.footerIcons}>
          <MaterialCommunityIcons name="flower" size={22} color="#4c5f7e" />
          <MaterialCommunityIcons name="heart-pulse" size={22} color="#4c5f7e" />
          <MaterialCommunityIcons name="dog" size={22} color="#4c5f7e" />
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf9f6',
  },
  heroContainer: {
    height: height * 0.44,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  diagonalClip: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: '#fbf9f6',
    transform: [{ skewY: '-3deg' }],
  },
  floatingCard: {
    position: 'absolute',
    bottom: 52,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  floatingIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#594139',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  floatingValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ab3500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 12,
    paddingBottom: 16,
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  brandName: {
    fontSize: 30,
    fontWeight: '800',
    color: '#ab3500',
    letterSpacing: -0.5,
  },
  headline: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4c5f7e',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 13,
    color: '#594139',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 19,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    gap: 4,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#594139',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1b1c1a',
  },
  signUpButton: {
    width: '100%',
    borderRadius: 999,
    marginBottom: 0,
  },
  buttonInner: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  signUpText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  loginButton: {
    width: '100%',
    height: 54,
    borderRadius: 999,
    backgroundColor: '#c7dbff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#4d607f',
    fontSize: 16,
    fontWeight: '700',
  },
  footerIcons: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
    opacity: 0.2,
  },
});
