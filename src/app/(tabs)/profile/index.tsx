import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useMemo } from 'react';
import { useAuthStore } from '../../../stores/auth.store';
import { usePetStore } from '../../../stores/pet.store';
import { petsService } from '../../../services/pets.service';

const MENU_ITEMS = [
  {
    icon: 'paw',
    label: 'Edit Pet Profile',
    bg: '#ffdbd0',
    iconColor: '#ab3500',
    route: '/(tabs)/profile/edit-pet',
  },
  {
    icon: 'account-multiple',
    label: 'Manage Users',
    bg: '#d5e3ff',
    iconColor: '#4c5f7e',
    route: '/(tabs)/profile/manage-users',
  },
  {
    icon: 'bell-outline',
    label: 'Notifications',
    bg: '#b5ebff',
    iconColor: '#00677e',
    route: '/(tabs)/profile/notifications-settings',
  },
  {
    icon: 'credit-card-outline',
    label: 'Subscription & Billing',
    bg: '#ffdbd0',
    iconColor: '#ab3500',
    route: '/(tabs)/profile/subscription',
  },
  {
    icon: 'gift-outline',
    label: 'Referral & Rewards',
    bg: '#d5e3ff',
    iconColor: '#4c5f7e',
    route: '/(tabs)/profile/referral',
  },
  {
    icon: 'trophy-outline',
    label: 'Achievements',
    bg: '#fef3c7',
    iconColor: '#854d0e',
    route: '/(tabs)/profile/achievements',
  },
  {
    icon: 'shield-lock-outline',
    label: 'Privacy & Data',
    bg: '#efeeeb',
    iconColor: '#594139',
    route: '/(tabs)/profile/privacy',
  },
  {
    icon: 'medical-bag',
    label: 'Vet Contacts',
    bg: '#ffdad6',
    iconColor: '#ba1a1a',
    route: '/(tabs)/profile/vet-contacts',
  },
  {
    icon: 'food',
    label: 'Nutrition Tracker',
    bg: '#d5e3ff',
    iconColor: '#4c5f7e',
    route: '/(tabs)/profile/nutrition',
  },
] as const;

function initials(firstName?: string, lastName?: string): string | null {
  const f = firstName?.trim();
  const l = lastName?.trim();
  if (!f && !l) return null;
  const a = f?.[0] ?? '';
  const b = l?.[0] ?? '';
  return `${a}${b}`.toUpperCase();
}

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const activePet = usePetStore((s) => s.activePet);
  const pets = usePetStore((s) => s.pets);
  const setPets = usePetStore((s) => s.setPets);

  useEffect(() => {
    let cancelled = false;
    petsService
      .getMyPets()
      .then((list) => {
        if (!cancelled) setPets(list);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [setPets]);

  const displayName = useMemo(() => {
    const parts = [user?.firstName?.trim(), user?.lastName?.trim()].filter(Boolean);
    return parts.length ? parts.join(' ') : 'Pet parent';
  }, [user?.firstName, user?.lastName]);

  const avInitials = initials(user?.firstName, user?.lastName);
  const planLabel = (user?.subscriptionPlan ?? 'free').toUpperCase();
  const rewardPoints = user?.rewardPoints ?? 0;
  const streak = user?.streakCount ?? 0;
  const petCount = pets.length;

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/welcome');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Profile header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarOuter}>
            {avInitials ? (
              <Text style={styles.avatarInitials}>{avInitials}</Text>
            ) : (
              <MaterialCommunityIcons name="account" size={40} color="#ffffff" />
            )}
          </View>
          <Text style={styles.userName}>{displayName}</Text>
          {user?.email ? (
            <Text style={styles.userEmail}>{user.email}</Text>
          ) : null}
          <View style={styles.planPill}>
            <Text style={styles.planPillText}>{planLabel}</Text>
          </View>
          <View style={styles.pointsRow}>
            <MaterialCommunityIcons name="fire" size={18} color="#ffffff" />
            <Text style={styles.pointsRowText}>{rewardPoints} points</Text>
          </View>
        </View>

        {/* 2. Active pet */}
        <TouchableOpacity
          style={styles.petCard}
          activeOpacity={0.85}
          onPress={() => router.push('/(tabs)/profile/edit-pet')}
        >
          {activePet ? (
            <View style={styles.petRow}>
              <View style={styles.petIconCircle}>
                <MaterialCommunityIcons name="dog" size={22} color="#ab3500" />
              </View>
              <View style={styles.petInfo}>
                <Text style={styles.petName}>{activePet.name}</Text>
                <Text style={styles.petMeta} numberOfLines={1}>
                  {activePet.species}
                  {activePet.breed ? ` · ${activePet.breed}` : ''}
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={22} color="#8d7168" />
            </View>
          ) : (
            <View style={styles.petRow}>
              <View style={[styles.petIconCircle, styles.addPetCircle]}>
                <MaterialCommunityIcons name="plus" size={22} color="#ab3500" />
              </View>
              <Text style={styles.addPetText}>Add your first pet</Text>
              <MaterialCommunityIcons name="chevron-right" size={22} color="#8d7168" />
            </View>
          )}
        </TouchableOpacity>

        {/* 3. Quick stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="fire" size={20} color="#ab3500" />
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statCaption}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="star" size={20} color="#FF6B35" />
            <Text style={styles.statValue}>{rewardPoints}</Text>
            <Text style={styles.statCaption}>Points</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="paw" size={20} color="#4c5f7e" />
            <Text style={styles.statValue}>{petCount}</Text>
            <Text style={styles.statCaption}>Pets</Text>
          </View>
        </View>

        {/* 4. Settings menu */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, index) => (
            <View key={item.route}>
              <TouchableOpacity
                style={styles.menuRow}
                activeOpacity={0.75}
                onPress={() => router.push(item.route)}
              >
                <View style={[styles.menuIconCircle, { backgroundColor: item.bg }]}>
                  <MaterialCommunityIcons name={item.icon} size={22} color={item.iconColor} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <MaterialCommunityIcons name="chevron-right" size={22} color="#c4b5a8" />
              </TouchableOpacity>
              {index < MENU_ITEMS.length - 1 ? <View style={styles.menuDivider} /> : null}
            </View>
          ))}
        </View>

        {/* 5. Logout */}
        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.85} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout-variant" size={20} color="#ba1a1a" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* 6. Version */}
        <Text style={styles.version}>Pet Profile v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fbf9f6' },
  scroll: { flex: 1 },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  profileHeader: {
    backgroundColor: '#FF6B35',
    borderRadius: 24,
    padding: 24,
    marginBottom: 8,
    shadowColor: '#FF6B35',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  avatarOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  planPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 14,
  },
  planPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.8,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pointsRowText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  petCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginVertical: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  petRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  petIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffdbd0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPetCircle: {
    backgroundColor: '#ffdbd0',
  },
  petInfo: { flex: 1 },
  petName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1b1c1a',
  },
  petMeta: {
    fontSize: 13,
    color: '#594139',
    marginTop: 2,
  },
  addPetText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#ab3500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f5f3f0',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    minHeight: 88,
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1b1c1a',
    textAlign: 'center',
  },
  statCaption: {
    fontSize: 11,
    fontWeight: '600',
    color: '#594139',
    textAlign: 'center',
  },
  menuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
  },
  menuIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1b1c1a',
  },
  menuDivider: {
    height: 1,
    marginLeft: 66,
    backgroundColor: 'rgba(225,191,181,0.3)',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f5f3f0',
    borderRadius: 999,
    height: 52,
    marginBottom: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ba1a1a',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#8d7168',
    marginTop: 8,
  },
});
