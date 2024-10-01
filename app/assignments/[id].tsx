import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from 'react-native'; // Use your preferred text component
import { useLocalSearchParams } from 'expo-router';

export default function Assignment() {
  const { id } = useLocalSearchParams();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Track selected answers

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

  const handleRadioChange = (questionIndex, option) => {
    setSelectedAnswers((prevState) => ({
      ...prevState,
      [questionIndex]: option, // Set the selected option for the question
    }));
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0096FF" />
      </View>
    );
  }

  if (!assignment) {
    return <Text>Задание не найдено</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.subtitle}>Задание №{assignment.id}</Text>
        <Text style={styles.title}>{assignment.title}</Text>
        <Text style={styles.description}>{assignment.description}</Text>
        {assignment.type === 'test' && (
          <View>
            <Text style={styles.subheading}>Задания</Text>
            {assignment.test.map((test, index) => (
              <View key={index} style={styles.testItem}>
                <Text style={{ fontSize: 18, marginBottom: 10 }}>{test.question}</Text>
                {['a', 'b', 'c', 'd'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.radioContainer}
                    onPress={() => handleRadioChange(index, option)}
                  >
                    <View style={[styles.radioCircle, selectedAnswers[index] === option && styles.selectedRadio]} />
                    <Text style={{ fontSize: 18 }}>{test[option]}</Text>
                  </TouchableOpacity>
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
    paddingTop: 70,
    backgroundColor: '#FFFFFF',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  description: {
    color: '#666',
    marginVertical: 10,
    fontSize: 18,
  },
  subheading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  testItem: {
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderColor: '#007bff',
    borderWidth: 2,
    borderRadius: 12, // Make it a circle
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadio: {
    backgroundColor: '#007bff',
  },
  taskItem: {
    marginVertical: 4,
    fontSize: 18,
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
