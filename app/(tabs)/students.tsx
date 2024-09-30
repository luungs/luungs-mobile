// app/students.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch the list of students from an API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('https://srv451534.hstgr.cloud/api/users'); // Replace with your API
        const data = await response.json();
        setStudents(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch students:', error);
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0096FF" />
      </View>
    );
  }

  return (
    <FlatList
      data={students}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => router.push(`/students/${item.id}`)}>
          <View style={styles.studentContainer}>
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.city}>{item.university}</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  studentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  infoContainer: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  city: {
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
