import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../stores/auth.store';

function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string | string[] };
    const m = data?.message;
    if (Array.isArray(m)) return m.join(', ');
    if (typeof m === 'string') return m;
  }
  return 'Sign in failed. Please try again.';
}

export default function LoginScreen() {
  const router = useRouter();
  const loginStore = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const { access_token, user } = await authService.login({
        email: email.trim(),
        password,
      });
      await loginStore(access_token, user);
      router.replace('/(tabs)/home');
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* BACK */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#1b1c1a" />
          </TouchableOpacity>

          {/* BRAND */}
          <Text style={styles.brand}>PetPulse</Text>

          {/* TITLE */}
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>

          {/* FORM CARD */}
          <View style={styles.card}>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="hello@petpulse.com"
                  placeholderTextColor="#8d7168"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>PASSWORD</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { paddingRight: 48 }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#8d7168"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#8d7168"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot password */}
            <TouchableOpacity
              style={styles.forgotWrap}
              onPress={() => router.push('/(auth)/forgot-password')}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Error */}
            {error ? <Text style={styles.error}>{error}</Text> : null}

            {/* Submit */}
            <LinearGradient
              colors={['#ab3500', '#FF6B35']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBtn}
            >
              <TouchableOpacity
                style={styles.btnInner}
                onPress={onSubmit}
                activeOpacity={0.85}
                disabled={loading}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.btnText}>Sign In</Text>
                }
              </TouchableOpacity>
            </LinearGradient>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR SIGN IN WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn}>
                <Text style={styles.socialText}>G  Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Text style={styles.socialText}> Apple</Text>
              </TouchableOpacity>
            </View>

            {/* Register redirect */}
            <View style={styles.registerRedirect}>
              <Text style={styles.registerRedirectText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text style={styles.registerRedirectLink}>Sign up here</Text>
              </TouchableOpacity>
            </View>

          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity><Text style={styles.footerLink}>Privacy Policy</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.footerLink}>Terms of Service</Text></TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fbf9f6' },
  scroll: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
  backBtn: { marginBottom: 16, alignSelf: 'flex-start', padding: 4 },
  brand: { fontSize: 22, fontWeight: '800', color: '#ab3500', letterSpacing: -0.5, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700', color: '#1b1c1a', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#594139', marginBottom: 24 },
  card: {
    backgroundColor: '#f5f3f0', borderRadius: 24, padding: 24,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  fieldGroup: { marginBottom: 18 },
  label: {
    fontSize: 11, fontWeight: '800', color: '#344765',
    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8, marginLeft: 4,
  },
  inputWrapper: {
    backgroundColor: '#ffffff', borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(225,191,181,0.25)',
    flexDirection: 'row', alignItems: 'center',
  },
  input: {
    flex: 1, height: 52, paddingHorizontal: 18,
    fontSize: 15, color: '#1b1c1a',
  },
  eyeBtn: { position: 'absolute', right: 14, padding: 4 },
  forgotWrap: { alignSelf: 'flex-end', marginBottom: 16, marginTop: -8 },
  forgotText: { fontSize: 14, fontWeight: '600', color: '#ab3500' },
  error: { color: '#ba1a1a', fontSize: 13, marginBottom: 12, textAlign: 'center' },
  gradientBtn: { borderRadius: 999, marginTop: 4 },
  btnInner: { height: 54, alignItems: 'center', justifyContent: 'center', borderRadius: 999 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24, gap: 8 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e1bfb5', opacity: 0.3 },
  dividerText: { fontSize: 11, fontWeight: '700', color: '#8d7168', letterSpacing: 1.5 },
  socialRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  socialBtn: {
    flex: 1, height: 52, borderRadius: 999,
    backgroundColor: '#ffffff', borderWidth: 1, borderColor: 'rgba(225,191,181,0.2)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  socialText: { fontSize: 14, fontWeight: '600', color: '#1b1c1a' },
  registerRedirect: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  registerRedirectText: { fontSize: 14, color: '#594139' },
  registerRedirectLink: { fontSize: 14, fontWeight: '700', color: '#ab3500' },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: 24, marginTop: 24 },
  footerLink: { fontSize: 11, fontWeight: '700', color: '#8d7168', letterSpacing: 1, textTransform: 'uppercase' },
});
