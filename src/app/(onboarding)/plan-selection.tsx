import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const FREE_FEATURES = [
  { text: 'Up to 3 pet profiles', included: true },
  { text: 'Manual health logs', included: true },
  { text: 'Community forum access', included: true },
  { text: 'AI Symptom Checker', included: false },
];

const PREMIUM_FEATURES = [
  'Unlimited Pet Profiles',
  'Unlimited Health & Activity Logs',
  'AI Insights & Symptom Analysis',
  'Full Data Export (CSV/PDF)',
  'Smart Medication Reminders',
];

export default function PlanSelectionScreen() {
  const router = useRouter();

  const handleFreeTrial = () => {
    router.replace('/(onboarding)/pet-basic-info');
  };

  const handlePremium = () => {
    router.replace('/(onboarding)/pet-basic-info');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialCommunityIcons name="paw" size={20} color="#ab3500" />
            <Text style={styles.brand}>PetPulse</Text>
          </View>
          <TouchableOpacity onPress={() => router.replace('/(onboarding)/pet-basic-info')}>
            <MaterialCommunityIcons name="close" size={24} color="#4c5f7e" />
          </TouchableOpacity>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>

        {/* Hero text */}
        <View style={styles.hero}>
          <Text style={styles.heroTag}>ELEVATE YOUR CARE</Text>
          <Text style={styles.heroTitle}>
            Deep insights for your{' '}
            <Text style={styles.heroAccent}>best friend's</Text>
            {' '}health.
          </Text>
          <Text style={styles.heroSub}>
            Join 50,000+ pet parents using AI-powered health monitoring to extend the lives of their companions.
          </Text>
        </View>

        {/* Plan cards */}
        <View style={styles.cards}>

          {/* Free Plan */}
          <View style={styles.freeCard}>
            <View style={styles.cardTopRow}>
              <View>
                <Text style={styles.planName}>Free Trial</Text>
                <Text style={styles.planDesc}>Perfect for getting started</Text>
              </View>
              <View style={styles.basicBadge}>
                <Text style={styles.basicBadgeText}>BASIC</Text>
              </View>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.price}>$0</Text>
              <Text style={styles.pricePer}> / 14 days</Text>
            </View>

            <View style={styles.featureList}>
              {FREE_FEATURES.map((f, i) => (
                <View key={i} style={styles.featureRow}>
                  <MaterialCommunityIcons
                    name={f.included ? 'check-circle' : 'cancel'}
                    size={18}
                    color={f.included ? '#4c5f7e' : '#8d7168'}
                    style={{ opacity: f.included ? 1 : 0.4 }}
                  />
                  <Text style={[
                    styles.featureText,
                    !f.included && styles.featureTextDisabled
                  ]}>
                    {f.text}
                  </Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.freeBtn} onPress={handleFreeTrial} activeOpacity={0.85}>
              <Text style={styles.freeBtnText}>Start Free Trial</Text>
            </TouchableOpacity>
          </View>

          {/* Premium Plan */}
          <View style={styles.premiumCard}>
            {/* Popular ribbon */}
            <View style={styles.ribbon}>
              <Text style={styles.ribbonText}>POPULAR</Text>
            </View>

            <View style={styles.cardTopRow}>
              <View>
                <Text style={styles.planName}>Primary Plan</Text>
                <Text style={styles.premiumDesc}>Full health architecture</Text>
              </View>
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>PREMIUM</Text>
              </View>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.price}>$5.99</Text>
              <Text style={styles.pricePer}> / month</Text>
            </View>

            <View style={styles.featureList}>
              {PREMIUM_FEATURES.map((f, i) => (
                <View key={i} style={styles.featureRow}>
                  <MaterialCommunityIcons name="star-circle" size={18} color="#ab3500" />
                  <Text style={styles.premiumFeatureText}>{f}</Text>
                </View>
              ))}
            </View>

            <LinearGradient
              colors={['#ab3500', '#FF6B35']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.premiumGradientBtn}
            >
              <TouchableOpacity style={styles.btnInner} onPress={handlePremium} activeOpacity={0.85}>
                <Text style={styles.premiumBtnText}>Upgrade to Premium</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

        </View>

        {/* FAQ Section */}
        <View style={styles.faq}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqGrid}>
            <View style={styles.faqCard}>
              <Text style={styles.faqQ}>Can I cancel anytime?</Text>
              <Text style={styles.faqA}>Absolutely. No long-term contracts. Cancel with one tap in your profile settings.</Text>
            </View>
            <View style={styles.faqCard}>
              <Text style={styles.faqQ}>Is my data secure?</Text>
              <Text style={styles.faqA}>We use bank-grade encryption to ensure your pet's medical data is private and secure.</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fbf9f6' },
  scroll: { paddingBottom: 48 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: '#f5f3f0',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brand: { fontSize: 18, fontWeight: '800', color: '#ab3500', letterSpacing: -0.3 },

  progressBar: {
    height: 4, backgroundColor: '#efeeeb', width: '100%',
  },
  progressFill: {
    height: 4, backgroundColor: '#ab3500', width: '33%', borderRadius: 2,
  },

  hero: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24, alignItems: 'center' },
  heroTag: { fontSize: 11, fontWeight: '800', color: '#ab3500', letterSpacing: 2, marginBottom: 12 },
  heroTitle: { fontSize: 28, fontWeight: '800', color: '#1b1c1a', textAlign: 'center', lineHeight: 36, marginBottom: 12 },
  heroAccent: { color: '#FF6B35', fontStyle: 'italic' },
  heroSub: { fontSize: 14, color: '#594139', textAlign: 'center', lineHeight: 21, maxWidth: 300 },

  cards: { paddingHorizontal: 20, gap: 16 },

  freeCard: {
    backgroundColor: '#f5f3f0', borderRadius: 24, padding: 24, marginBottom: 4,
  },
  premiumCard: {
    backgroundColor: '#ffffff', borderRadius: 24, padding: 24,
    borderWidth: 2, borderColor: '#ab3500',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 4,
    overflow: 'hidden',
  },
  ribbon: {
    position: 'absolute', top: 16, right: -24,
    backgroundColor: '#ab3500', paddingHorizontal: 32, paddingVertical: 4,
    transform: [{ rotate: '45deg' }], width: 120, alignItems: 'center',
  },
  ribbonText: { color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 1.5 },

  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  planName: { fontSize: 20, fontWeight: '700', color: '#1b1c1a', marginBottom: 2 },
  planDesc: { fontSize: 13, color: '#594139' },
  premiumDesc: { fontSize: 13, color: '#ab3500', fontWeight: '600' },

  basicBadge: { backgroundColor: '#e4e2df', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  basicBadgeText: { fontSize: 10, fontWeight: '700', color: '#594139' },
  premiumBadge: { backgroundColor: '#ffdbd0', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  premiumBadgeText: { fontSize: 10, fontWeight: '700', color: '#832600' },

  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 20 },
  price: { fontSize: 36, fontWeight: '800', color: '#1b1c1a' },
  pricePer: { fontSize: 14, color: '#594139' },

  featureList: { gap: 12, marginBottom: 24 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureText: { fontSize: 14, color: '#594139' },
  featureTextDisabled: { textDecorationLine: 'line-through', opacity: 0.4 },
  premiumFeatureText: { fontSize: 14, color: '#1b1c1a', fontWeight: '500' },

  freeBtn: {
    backgroundColor: '#c7dbff', borderRadius: 999, height: 52,
    alignItems: 'center', justifyContent: 'center',
  },
  freeBtnText: { fontSize: 15, fontWeight: '700', color: '#4d607f' },

  premiumGradientBtn: { borderRadius: 999 },
  btnInner: { height: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 999 },
  premiumBtnText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },

  faq: { paddingHorizontal: 20, paddingTop: 40 },
  faqTitle: { fontSize: 20, fontWeight: '700', color: '#1b1c1a', textAlign: 'center', marginBottom: 16 },
  faqGrid: { gap: 12 },
  faqCard: { backgroundColor: '#f5f3f0', borderRadius: 16, padding: 20 },
  faqQ: { fontSize: 14, fontWeight: '700', color: '#1b1c1a', marginBottom: 6 },
  faqA: { fontSize: 13, color: '#594139', lineHeight: 20 },
});
