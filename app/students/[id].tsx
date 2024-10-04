// app/students/[id].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

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
        <Text>Студент не найден</Text>
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
      <MaterialIcons name="emoji-events" size={24} color="#FFD700" />
      <Text style={styles.ratingText}>{student.rating !== undefined ? student.rating : 'Не указано'}</Text>
    </View>
  );

  const renderQuestionFrequency = () => {
    const { questionsSolved } = student;
    let color = '#D3D3D3'; // Default to gray for zero questions
    if (questionsSolved > 0 && questionsSolved <= 10) {
      color = '#90EE90'; // Light green for few solved
    } else if (questionsSolved > 10) {
      color = '#008000'; // Dark green for many solved
    }

    return (
      <View style={[styles.questionFrequency, { backgroundColor: color }]}>
        <Text style={styles.frequencyText}>Решенных вопросов: {questionsSolved || 'Не указано'}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {renderAvatar()}
        <View style={styles.headerText}>
          <Text style={styles.name}>{student.name}</Text>
          <Text style={styles.email}>{student.email || 'Не указано'}</Text>
        </View>
      </View>

      <View style={styles.gridContainer}>
        <Text style={styles.info}>Университет: {student.university || 'Не указано'}</Text>
        <Text style={styles.info}>
          <FontAwesome name="music" size={16} color="#000" /> Музыкальные предпочтения: {student.music_taste || 'Не указано'}
        </Text>
        <Text style={styles.info}>
          <FontAwesome name="film" size={16} color="#000" /> Кино предпочтения: {student.movie_taste || 'Не указано'}
        </Text>
        {renderRating()}
      </View>

      {renderQuestionFrequency()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF', // White background
    paddingTop: 80,
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
    backgroundColor: '#0096FF', // Blue background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  defaultAvatarText: {
    fontSize: 40,
    color: '#FFFFFF', // White text
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
    // Any styles for gridContainer can be added here
  },
  info: {
    fontSize: 18,
    color: '#666',
    marginVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  questionFrequency: {
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  frequencyText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
