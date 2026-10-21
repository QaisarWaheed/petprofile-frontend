import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import api from '../services/api';
import { notificationsService } from '../services/notifications.service';
import { useAuthStore } from '../stores/auth.store';
import { withMongoId } from '../utils/mongo';
import type { User } from '../types';

const queryClient = new QueryClient();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotifications() {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') return;
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    await notificationsService.registerPushToken(token);
  } catch (e) {
    console.warn('Push token registration failed', e);
  }
}

export default function RootLayout() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const setLoading = useAuthStore((s) => s.setLoading);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const token = await SecureStore.getItemAsync('auth_token');
        if (!token) {
          if (!cancelled) {
            setLoading(false);
            setReady(true);
          }
          return;
        }
        useAuthStore.setState({ token });
        const res = await api.get<User>('/users/me');
        const raw = res.data as User & { _id?: string };
        const user = withMongoId(raw);
        if (!cancelled) {
          await login(token, user);
          void registerForPushNotifications();
          router.replace('/(tabs)/home');
        }
      } catch {
        if (!cancelled) {
          await logout();
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setReady(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [login, logout, router, setLoading]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }} />
          {!ready ? (
            <View
              style={styles.bootOverlay}
              pointerEvents="auto"
            >
              <ActivityIndicator size="large" color="#FF6B35" />
            </View>
          ) : null}
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  bootOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F9F7F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
