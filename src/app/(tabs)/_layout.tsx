import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabIconProps = {
  name: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  size: number;
};

function TabIcon({ name, color, size }: TabIconProps) {
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 72 + insets.bottom,
          paddingBottom: insets.bottom + 8,
          paddingTop: 12,
          backgroundColor: 'rgba(255,255,255,0.85)',
          borderTopWidth: 0,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          shadowColor: '#1b1c1a',
          shadowOpacity: 0.06,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: -8 },
          elevation: 16,
        },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#4c5f7e',
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: 0.8,
          marginTop: 2,
        },
        tabBarItemStyle: {
          borderRadius: 999,
          marginHorizontal: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} color={color} size={size} />
          ),
          tabBarActiveTintColor: '#ffffff',
          tabBarActiveBackgroundColor: '#ab3500',
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: 'Log',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name={focused ? 'plus-circle' : 'plus-circle-outline'} color={color} size={size} />
          ),
          tabBarActiveTintColor: '#ffffff',
          tabBarActiveBackgroundColor: '#ab3500',
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name={focused ? 'chat' : 'chat-outline'} color={color} size={size} />
          ),
          tabBarActiveTintColor: '#ffffff',
          tabBarActiveBackgroundColor: '#ab3500',
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name={focused ? 'calendar' : 'calendar-outline'} color={color} size={size} />
          ),
          tabBarActiveTintColor: '#ffffff',
          tabBarActiveBackgroundColor: '#ab3500',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name={focused ? 'paw' : 'paw-outline'} color={color} size={size} />
          ),
          tabBarActiveTintColor: '#ffffff',
          tabBarActiveBackgroundColor: '#ab3500',
        }}
      />
    </Tabs>
  );
}
