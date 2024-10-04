// app/students/[id].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function StudentDetail() {
  const { id } = useLocalSearchParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`https://srv451534.hstgr.cloud/api/users/${id}`);
        const data = await response.json();
        setStudent(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch student details:', error);
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0096FF" />
      </View>
    );
  }

  if (!student) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Студент не найден</Text>
      </View>
    );
  }

  const renderAvatar = () => {
    if (student.avatar) {
      return <Image source={{ uri: student.avatar }} style={styles.avatarLarge} />;
    }

    const firstLetter = student.name.charAt(0).toUpperCase();
    return (
      <View style={styles.defaultAvatar}>
        <Text style={styles.defaultAvatarText}>{firstLetter}</Text>
      </View>
    );
  };

  const renderRating = () => (
    <View style={styles.ratingContainer}>
      <Text style={styles.ratingText}>{student.rating !== undefined ? student.rating : 'Не указано'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {renderAvatar()}
        <View style={styles.headerText}>
          <Text style={styles.name}>{student.name}</Text>
          <Text style={styles.university}>{student.university || 'Не указано'}</Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.ratingWrapper}>
          {renderRating()}
        </View>
        <Text style={styles.info}>
          <MaterialIcons name="music-note" size={24} color="#0096FF" /> {student.music_taste || 'Не указано'}
        </Text>
        <Text style={styles.info}>
          <MaterialIcons name="theater-comedy" size={24} color="#0096FF" /> {student.movie_taste || 'Не указано'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
    paddingTop: 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 16,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  defaultAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0096FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  defaultAvatarText: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  university: {
    fontSize: 18,
    color: '#666',
  },
  infoContainer: {
    marginTop: 0,
  },
  info: {
    fontSize: 18,
    color: '#333',
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#FF0000',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'center',
  },
  ratingWrapper: {
    marginTop: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0096FF',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#F0F8FF', // Light blue background for rating
  },
  ratingText: {
    fontSize: 24,
    color: '#0096FF',
    marginLeft: 8,
  },
});

