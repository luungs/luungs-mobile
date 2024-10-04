import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user_id = await AsyncStorage.getItem('user_id');
        const response = await fetch(`https://srv451534.hstgr.cloud/api/users/${parseInt(user_id)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user_id');
      router.push('/login');
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4682B4" />
      </View>
    );
  }

  const renderAvatar = () => {
    if (userData.avatar) {
      return <Image source={{ uri: userData.avatar }} style={styles.avatarLarge} />;
    }

    const firstLetter = userData.name.charAt(0).toUpperCase();
    return (
      <View style={styles.defaultAvatar}>
        <Text style={styles.defaultAvatarText}>{firstLetter}</Text>
      </View>
    );
  };

  const renderRating = () => (
    <View style={styles.ratingContainer}>
      <MaterialIcons name="emoji-events" size={24} color="#FFD700" />
      <Text style={styles.ratingText}>{userData.rating !== undefined ? userData.rating : 'Не указано'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {renderAvatar()}
        <View style={styles.headerText}>
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.email}>{userData.email}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.fillProfileButton}>
        <Text style={styles.fillProfileButtonText}>Заполнить профиль</Text>
      </TouchableOpacity>
      <View style={styles.gridContainer}>
        <Text style={styles.info}>Музыкальные предпочтения: {userData.music_taste || 'Не указано'}</Text>
        <Text style={styles.info}>Кино предпочтения: {userData.movie_taste || 'Не указано'}</Text>
        {renderRating()}
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <FontAwesome name="sign-out" size={20} color="#FFFFFF" />
        <Text style={styles.logoutButtonText}>Выйти с аккаунта</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 80,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  defaultAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0096FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  defaultAvatarText: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 18,
    color: '#666',
  },
  gridContainer: {
    marginVertical: 10,
  },
  info: {
    fontSize: 18,
    color: '#666',
    marginVertical: 8,
  },
  fillProfileButton: {
    backgroundColor: '#0096FF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginVertical: 10,
  },
  fillProfileButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FF4C4C',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  ratingText: {
    fontSize: 18,
    color: '#FFD700',
    marginLeft: 5,
  },
});

