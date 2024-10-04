import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    const checkUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem('user_id');
        if (!userId) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error checking user_id from AsyncStorage:', error);
      }
    };

    checkUserId();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Главная',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="assignments"
        options={{
          title: 'Задачи',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'checkmark-done' : 'checkmark-done-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="students"
        options={{
          title: 'Студенты',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'people' : 'people-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
