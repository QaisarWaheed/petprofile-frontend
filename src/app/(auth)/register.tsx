import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../stores/auth.store';
import { authService } from '../../services/auth.service';

function getRegisterErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string | string[] };
    const m = data?.message;
    if (Array.isArray(m)) return m.join(', ');
    if (typeof m === 'string') return m;
  }
  return 'Registration failed. Please try again.';
}

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    try {
      setLoading(true);
      const { access_token, user } = await authService.register({
        firstName,
        lastName,
        email,
        password,
      });
      await login(access_token, user);
      router.replace('/(onboarding)/plan-selection');
    } catch (err: unknown) {
      setError(getRegisterErrorMessage(err));
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
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#1b1c1a" />
          </TouchableOpacity>

          {/* Brand */}
          <Text style={styles.brand}>PetPulse</Text>

          {/* Title */}
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Get started with a free account today.</Text>

          {/* Form Card */}
          <View style={styles.card}>

            {/* First Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>FIRST NAME</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="John"
                  placeholderTextColor="#8d7168"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Last Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>LAST NAME</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Doe"
                  placeholderTextColor="#8d7168"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="hello@petpulse.com"
                  placeholderTextColor="#8d7168"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>PASSWORD</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { paddingRight: 48 }]}
                  placeholder="••••••••"
                  placeholderTextColor="#8d7168"
                  value={password}
                  onChangeText={setPassword}
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

            {/* Confirm Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>CONFIRM PASSWORD</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { paddingRight: 48 }]}
                  placeholder="••••••••"
                  placeholderTextColor="#8d7168"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirm}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowConfirm(!showConfirm)}
                >
                  <MaterialCommunityIcons
                    name={showConfirm ? 'eye-off' : 'eye'}
                    size={20}
                    color="#8d7168"
                  />
                </TouchableOpacity>
              </View>
            </View>

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
                onPress={handleRegister}
                activeOpacity={0.85}
                disabled={loading}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={styles.btnText}>Create Account</Text>
                }
              </TouchableOpacity>
            </LinearGradient>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR SIGN UP WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social buttons */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn}>
                <Text style={styles.socialText}>G  Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialBtn}>
                <Text style={styles.socialText}> Apple</Text>
              </TouchableOpacity>
            </View>

            {/* Login redirect */}
            <View style={styles.loginRedirect}>
              <Text style={styles.loginRedirectText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.loginRedirectLink}>Sign in here</Text>
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
    backgroundColor: '#f5f3f0',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  fieldGroup: { marginBottom: 18 },
  label: {
    fontSize: 11, fontWeight: '800', color: '#344765',
    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8, marginLeft: 4,
  },
  inputWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(225,191,181,0.25)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1, height: 52, paddingHorizontal: 18,
    fontSize: 15, color: '#1b1c1a',
  },
  eyeBtn: { position: 'absolute', right: 14, padding: 4 },
  error: { color: '#ba1a1a', fontSize: 13, marginBottom: 12, textAlign: 'center' },
  gradientBtn: { borderRadius: 999, marginTop: 8 },
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
  loginRedirect: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginRedirectText: { fontSize: 14, color: '#594139' },
  loginRedirectLink: { fontSize: 14, fontWeight: '700', color: '#ab3500' },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: 24, marginTop: 24 },
  footerLink: { fontSize: 11, fontWeight: '700', color: '#8d7168', letterSpacing: 1, textTransform: 'uppercase' },
});
