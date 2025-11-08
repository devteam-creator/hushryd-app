import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, Tabs } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, Text, TouchableOpacity, View } from 'react-native';
import HushRydLogoImage from '../../components/HushRydLogoImage';
import SideMenu from '../../components/SideMenu';

import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);
  const { user, admin, isAuthenticated, logout } = useAuth();
  const isWeb = Platform.OS === 'web';

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🔴 Starting logout process...');
              await logout();
              console.log('✅ Logout successful');
              // Redirect to login
              router.replace('/login' as any);
            } catch (error) {
              console.error('Logout error:', error);
              // Still redirect to login even if there's an error
              router.replace('/login' as any);
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: isWeb ? colors.tint : colors.secondary,
          tabBarInactiveTintColor: isWeb ? colors.tabIconDefault : '#4E4E4E',
          headerShown: useClientOnlyValue(false, true),
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '700',
            marginBottom: Platform.OS === 'web' ? 0 : 4,
          },
          tabBarStyle: {
            height: isWeb ? 60 : 78,
            paddingBottom: isWeb ? 8 : 14,
            paddingTop: isWeb ? 8 : 10,
            backgroundColor: isWeb ? '#FFFFFF' : colors.primary,
            borderTopLeftRadius: isWeb ? 0 : 28,
            borderTopRightRadius: isWeb ? 0 : 28,
            marginHorizontal: isWeb ? 0 : 16,
            marginBottom: isWeb ? 0 : 12,
            borderTopWidth: 0,
            elevation: 10,
            shadowColor: '#000000',
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: -4 },
            shadowRadius: 12,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Search',
            headerTitle: () => (
              <HushRydLogoImage 
                size="small" 
                showBackground={false}
              />
            ),
            headerLeft: () => (
              <TouchableOpacity
                style={{ marginLeft: 15 }}
                onPress={() => setIsSideMenuVisible(true)}
              >
                <Text style={{ fontSize: 24, color: Colors[colorScheme ?? 'light'].tint }}>☰</Text>
              </TouchableOpacity>
            ),
            headerRight: () => (
              user ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15, gap: 12 }}>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: Colors[colorScheme ?? 'light'].tint, fontSize: 14, fontWeight: '600' }}>
                      Welcome, {user.firstName || 'User'}!
                    </Text>
                    <Text style={{ color: Colors[colorScheme ?? 'light'].textSecondary, fontSize: 12 }}>
                      {(user as any).role || 'User'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#ef4444',
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 6,
                    }}
                    onPress={handleLogout}
                  >
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                      Logout
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 15, gap: 20 }}>
                  {isWeb && (
                    <TouchableOpacity onPress={() => router.push('/about' as any)}>
                      <Text style={{ color: Colors[colorScheme ?? 'light'].tint, fontSize: 14, fontWeight: '600' }}>
                        About Us
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => router.push('/login' as any)}>
                    <Text style={{ color: Colors[colorScheme ?? 'light'].tint, fontSize: 14, fontWeight: '600' }}>
                      Login
                    </Text>
                  </TouchableOpacity>
                </View>
              )
            ),
            tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
          }}
        />
        <Tabs.Screen
          name="rides"
          options={{
            title: 'My Rides',
            tabBarIcon: ({ color }) => <TabBarIcon name="car" color={color} />,
          }}
        />
        <Tabs.Screen
          name="publish"
          options={{
            title: 'Publish',
            tabBarIcon: ({ color }) => <TabBarIcon name="plus-circle" color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          }}
        />
      </Tabs>
      
      <SideMenu 
        isVisible={isSideMenuVisible} 
        onClose={() => setIsSideMenuVisible(false)} 
      />
    </>
  );
}
