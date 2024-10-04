import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/ThemedText'; // Assuming you have a ThemedText component
import { ThemedView } from '@/components/ThemedView'; // Assuming you have a ThemedView component

export default function UpdateUserScreen() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    description: '',
    music_taste: '',
    movie_taste: '',
    university: '',
    grade: '',
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = await AsyncStorage.getItem('user_id');
        if (userId) {
          const response = await fetch(`https://srv451534.hstgr.cloud/api/users/${userId}`);
          const userData = await response.json();
          setUser({
            name: userData.name || '',
            email: userData.email || '',
            description: userData.description || '',
            music_taste: userData.music_taste || '',
            movie_taste: userData.movie_taste || '',
            university: userData.university || '',
            grade: userData.grade || '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        Alert.alert('Error', 'User ID not found');
        return;
      }

      const response = await fetch(`https://srv451534.hstgr.cloud/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        Alert.alert('Success', 'User updated successfully');
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to update user');
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      Alert.alert('Error', 'Something went wrong while updating');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Update Your Profile</ThemedText>
      <TextInput
        style={styles.input}
        value={user.name}
        onChangeText={(text) => setUser({ ...user, name: text })}
        placeholder="Name"
      />
      <TextInput
        style={styles.input}
        value={user.email}
        onChangeText={(text) => setUser({ ...user, email: text })}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={user.description}
        onChangeText={(text) => setUser({ ...user, description: text })}
        placeholder="Description"
      />
      <TextInput
        style={styles.input}
        value={user.music_taste}
        onChangeText={(text) => setUser({ ...user, music_taste: text })}
        placeholder="Music Taste"
      />
      <TextInput
        style={styles.input}
        value={user.movie_taste}
        onChangeText={(text) => setUser({ ...user, movie_taste: text })}
        placeholder="Movie Taste"
      />
      <TextInput
        style={styles.input}
        value={user.university}
        onChangeText={(text) => setUser({ ...user, university: text })}
        placeholder="University"
      />
      <TextInput
        style={styles.input}
        value={user.grade}
        onChangeText={(text) => setUser({ ...user, grade: text })}
        placeholder="Grade"
      />

      <Button title="Сохранить" onPress={handleUpdate} disabled={updating} />

      {updating && <ActivityIndicator size="small" color="#007bff" style={styles.updatingIndicator} />}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updatingIndicator: {
    marginTop: 10,
  },
});

