import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SPECIALISTS = [
  {
    id: 1,
    name: 'Downtown Animal Hospital',
    specialty: 'Emergency & Trauma',
    rating: '4.9',
    badge: '24/7 CARE',
    badgeBg: '#ffdad6',
    badgeColor: '#93000a',
    icon: 'home-alert' as const,
    iconColor: '#ab3500',
  },
  {
    id: 2,
    name: 'Paws & Claws Dental',
    specialty: 'Veterinary Dentistry',
    rating: '4.7',
    badge: null,
    icon: 'tooth' as const,
    iconColor: '#00677e',
  },
  {
    id: 3,
    name: 'Dr. James T. Kirk',
    specialty: 'Exotic Animal Specialist',
    rating: '5.0',
    badge: null,
    icon: 'paw' as const,
    iconColor: '#ab3500',
  },
];

export default function VetContactsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.menuBtn}>
            <MaterialCommunityIcons name="menu" size={22} color="#4c5f7e" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vet Contacts</Text>
        </View>
        <TouchableOpacity style={styles.addBtn}>
          <MaterialCommunityIcons name="plus" size={22} color="#4c5f7e" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* SEARCH */}
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={20} color="#4c5f7e" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search clinics or veterinarians..."
            placeholderTextColor="#8d7168"
          />
          <MaterialCommunityIcons name="tune-variant" size={20} color="#4c5f7e" />
        </View>

        {/* PRIMARY VET SPOTLIGHT */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>PRIMARY CARE</Text>
        </View>
        <View style={styles.primaryCard}>
          <View style={styles.primaryBadge}>
            <MaterialCommunityIcons name="star" size={12} color="#ab3500" />
            <Text style={styles.primaryBadgeText}>Primary</Text>
          </View>
          <View style={styles.primaryContent}>
            <View style={styles.primaryAvatar}>
              <MaterialCommunityIcons name="doctor" size={40} color="#4c5f7e" />
            </View>
            <View style={styles.primaryInfo}>
              <Text style={styles.primaryName}>Dr. Sarah Wilson</Text>
              <Text style={styles.primarySpecialty}>General Practice & Nutrition</Text>
              <View style={styles.primaryLocation}>
                <MaterialCommunityIcons name="map-marker" size={14} color="#594139" />
                <Text style={styles.primaryLocationText}>4.2 miles away • Downtown</Text>
              </View>
              <View style={styles.primaryActions}>
                <TouchableOpacity style={styles.callBtn} activeOpacity={0.85}>
                  <MaterialCommunityIcons name="phone" size={18} color="#fff" />
                  <Text style={styles.callBtnText}>Call Clinic</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dirBtn} activeOpacity={0.85}>
                  <MaterialCommunityIcons name="directions" size={20} color="#4d607f" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* SAVED SPECIALISTS */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>SAVED SPECIALISTS</Text>
        </View>
        <View style={styles.specialistsGrid}>
          {SPECIALISTS.map(vet => (
            <TouchableOpacity key={vet.id} style={styles.vetCard} activeOpacity={0.85}>
              <View style={styles.vetCardTop}>
                <View style={styles.vetIconBox}>
                  <MaterialCommunityIcons name={vet.icon} size={22} color={vet.iconColor} />
                </View>
                {vet.badge && (
                  <View style={[styles.vetBadge, { backgroundColor: vet.badgeBg }]}>
                    <Text style={[styles.vetBadgeText, { color: vet.badgeColor }]}>{vet.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.vetName}>{vet.name}</Text>
              <Text style={styles.vetSpecialty}>{vet.specialty}</Text>
              <View style={styles.vetCardBottom}>
                <View style={styles.ratingRow}>
                  <MaterialCommunityIcons name="star" size={14} color="#ab3500" />
                  <Text style={styles.ratingText}>{vet.rating}</Text>
                </View>
                <View style={styles.vetActions}>
                  <TouchableOpacity style={styles.vetActionBtn}>
                    <MaterialCommunityIcons name="phone" size={18} color="#4c5f7e" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.vetActionBtn}>
                    <MaterialCommunityIcons name="map" size={18} color="#4c5f7e" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {/* Add Specialist card */}
          <TouchableOpacity style={styles.addCard} activeOpacity={0.8}>
            <View style={styles.addCardIcon}>
              <MaterialCommunityIcons name="plus-circle-outline" size={24} color="#594139" />
            </View>
            <Text style={styles.addCardText}>ADD SPECIALIST</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <MaterialCommunityIcons name="plus" size={26} color="#fff" />
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fbf9f6' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fbf9f6',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  menuBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#ab3500' },
  addBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#f5f3f0', borderRadius: 16,
    paddingHorizontal: 14, paddingVertical: 12, marginBottom: 24,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1b1c1a' },
  sectionHeader: { marginBottom: 12 },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: '#4c5f7e', letterSpacing: 1.5, textTransform: 'uppercase' },
  primaryCard: {
    backgroundColor: '#ffffff', borderRadius: 24, padding: 20,
    marginBottom: 28, position: 'relative',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 }, elevation: 3,
    borderWidth: 1, borderColor: 'rgba(225,191,181,0.15)',
  },
  primaryBadge: {
    position: 'absolute', top: 14, right: 14,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,107,53,0.1)', borderRadius: 999,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  primaryBadgeText: { fontSize: 10, fontWeight: '800', color: '#ab3500', letterSpacing: 0.5 },
  primaryContent: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  primaryAvatar: {
    width: 80, height: 80, borderRadius: 16,
    backgroundColor: '#f5f3f0', alignItems: 'center', justifyContent: 'center',
  },
  primaryInfo: { flex: 1, gap: 4 },
  primaryName: { fontSize: 18, fontWeight: '700', color: '#1b1c1a' },
  primarySpecialty: { fontSize: 14, fontWeight: '500', color: '#4c5f7e' },
  primaryLocation: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  primaryLocationText: { fontSize: 12, color: '#594139' },
  primaryActions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  callBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#ab3500', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 10,
  },
  callBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  dirBtn: {
    backgroundColor: '#c7dbff', borderRadius: 12,
    width: 44, height: 44, alignItems: 'center', justifyContent: 'center',
  },
  specialistsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  vetCard: {
    width: '47%', backgroundColor: '#f5f3f0', borderRadius: 20,
    padding: 14, gap: 8,
  },
  vetCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  vetIconBox: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center',
  },
  vetBadge: { borderRadius: 999, paddingHorizontal: 7, paddingVertical: 3 },
  vetBadgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  vetName: { fontSize: 14, fontWeight: '700', color: '#1b1c1a', lineHeight: 20 },
  vetSpecialty: { fontSize: 12, color: '#594139' },
  vetCardBottom: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: 'rgba(225,191,181,0.2)', paddingTop: 10, marginTop: 4,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 12, fontWeight: '700', color: '#1b1c1a' },
  vetActions: { flexDirection: 'row', gap: 4 },
  vetActionBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center',
  },
  addCard: {
    width: '47%', minHeight: 140, backgroundColor: 'rgba(239,238,235,0.5)',
    borderRadius: 20, borderWidth: 2, borderColor: 'rgba(225,191,181,0.25)',
    borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  addCardIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#eae8e5', alignItems: 'center', justifyContent: 'center',
  },
  addCardText: { fontSize: 10, fontWeight: '800', color: '#594139', letterSpacing: 1.5 },
  fab: {
    position: 'absolute', bottom: 88, right: 20,
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#ab3500', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#ab3500', shadowOpacity: 0.35,
    shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 8,
  },
});
