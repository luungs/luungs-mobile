import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Text } from 'react-native'; // Use your preferred text component
import { useRouter } from 'expo-router';

export default function Assignments() {
  const router = useRouter();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false); // State for refreshing

  const fetchAssignments = async () => {
    try {
      const response = await fetch('https://srv451534.hstgr.cloud/api/asignments/');
      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true); // Start refreshing
    await fetchAssignments(); // Fetch data again
    setRefreshing(false); // End refreshing
  };

  const filteredAssignments = assignments.filter((assignment) =>
    assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRatingColor = (rating) => {
    if (rating >= 100 && rating <= 200) {
      return '#1CAA00'; // Green
    } else if (rating === 300) {
      return '#F9D300'; // Yellow
    } else if (rating >= 400 && rating <= 500) {
      return '#D00000'; // Red
    }
    return '#000'; // Default color (black) if no condition matches
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0096FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Поиск..."
        value={searchTerm}
        onChangeText={setSearchTerm} // Update search term on change
      />
      <FlatList
        data={filteredAssignments} // Use filtered assignments
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.assignmentCard} 
            onPress={() => router.push(`/assignments/${item.id}`)}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={[styles.rating, { color: getRatingColor(item.rating) }]}>
              Рейтинг: {item.rating}
            </Text>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        } // Add refresh control for pull-to-refresh
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 70,
    backgroundColor: '#FFFFFF',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    fontSize: 16,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  assignmentCard: {
    padding: 16,
    backgroundColor: '#fff',
    borderColor: '#D9D9D9',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
  },
  description: {
    color: '#717171',
    fontWeight: '300',
    marginTop: 7,
    fontSize: 16,
  },
  rating: {
    marginTop: 15,
    fontSize: 16,
  },
});
