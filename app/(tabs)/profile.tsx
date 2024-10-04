import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  ScrollView, 
  RefreshControl 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from 'react-native-vector-icons';

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State for refreshing

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
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

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserData().then(() => setRefreshing(false)); // Refresh user data
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user_id');
      router.push('/login');
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleFillProfile = () => {
    router.push('/update_user'); // Navigate to the update_user.tsx component
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
      <Text style={styles.ratingText}>{userData.rating !== undefined ? userData.rating : 'Не указано'}</Text>
    </View>
  );

  return (
    <ScrollView 
      style={styles.container} 
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh} 
          colors={['#0096FF']} // Color of the spinner
        />
      }
    >
      <View style={styles.header}>
        {renderAvatar()}
        <View style={styles.headerText}>
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.email}>{userData.university}</Text>
        </View>
      </View>
      {renderRating()}
      <TouchableOpacity style={styles.fillProfileButton} onPress={handleFillProfile}>
        <Text style={styles.fillProfileButtonText}>Заполнить профиль</Text>
      </TouchableOpacity>
      <View style={styles.gridContainer}>
        <View style={styles.preferenceContainer}>
          <MaterialIcons name="music-note" size={24} color="#0096FF" />
          <Text style={styles.info}>Музыкальные предпочтения: {userData.music_taste || 'Не указано'}</Text>
        </View>
        <View style={styles.preferenceContainer}>
          <Ionicons name="film" size={24} color="#0096FF" />
          <Text style={styles.info}>Кино предпочтения: {userData.movie_taste || 'Не указано'}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialIcons name="logout" size={20} color="#FF4C4C" />
        <Text style={styles.logoutButtonText}>Выйти с аккаунта</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 90,
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
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: '#0096FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  defaultAvatarText: {
    fontSize: 30,
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
    fontSize: 16,
    color: '#666',
  },
  gridContainer: {
    marginVertical: 10,
  },
  preferenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  info: {
    fontSize: 15,
    color: '#666',
    marginLeft: 10,
  },
  fillProfileButton: {
    backgroundColor: 'black',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginVertical: 10,
  },
  fillProfileButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#FF4C4C',
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
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    padding: 20,
    marginVertical: 10,
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 24,
    color: '#0096FF',
    fontWeight: 'bold',
  },
});

