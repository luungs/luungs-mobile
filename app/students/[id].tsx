// app/students/[id].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function StudentDetail() {
  const { id } = useLocalSearchParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`https://srv451534.hstgr.cloud/api/users/${id}`); // Replace with your API
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
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!student) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Student not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: student.avatar }} style={styles.avatarLarge} />
      <Text style={styles.name}>{student.name}</Text>
      <Text style={styles.info}>City: {student.city}</Text>
      <Text style={styles.info}>Email: {student.email}</Text>
      {/* You can add more details here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
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
});
