import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from 'react-native'; // Use your preferred text component
import { useLocalSearchParams } from 'expo-router';

export default function Assignment() {
  const { id } = useLocalSearchParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const response = await fetch(`https://srv451534.hstgr.cloud/api/asignments/${id}`);
        const data = await response.json();
        setAssignment(data);
      } catch (error) {
        console.error('Error fetching assignment:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!assignment) {
    return <Text>Assignment not found</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>{assignment.title}</Text>
        <Text style={styles.description}>{assignment.description}</Text>
        {assignment.type === 'test' && (
          <View>
            <Text style={styles.subheading}>Задания</Text>
            {assignment.test.map((test, index) => (
              <View key={index} style={styles.testItem}>
                <Text>{test.question}</Text>
                {['a', 'b', 'c', 'd'].map((option) => (
                  <View key={option} style={styles.radioGroup}>
                    <Text>{test[option]}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
        {assignment.type === 'task' && (
          <View>
            <Text style={styles.subheading}>Задания</Text>
            {assignment.task.map((task, index) => (
              <Text key={index} style={styles.taskItem}>{index + 1}. {task.question}</Text>
            ))}
            <TextInput
              style={styles.textArea}
              placeholder="Введите ответ..."
              multiline
            />
          </View>
        )}
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.buttonText}>Ответить</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewAnswerButton}>
          <Text style={styles.buttonText}>Посмотреть ответ</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    color: '#666',
    marginVertical: 10,
  },
  subheading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  testItem: {
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  taskItem: {
    marginVertical: 4,
  },
  textArea: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewAnswerButton: {
    borderColor: '#007bff',
    borderWidth: 2,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
