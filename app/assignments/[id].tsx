import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, ScrollView, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Assignment() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [result, setResult] = useState({});

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const user_id = await AsyncStorage.getItem('user_id');
        const response = await fetch(`https://srv451534.hstgr.cloud/api/asignments/${id}/${parseInt(user_id)}`);
        const data = await response.json();

        // Pre-fill selectedAnswers and result based on user_answers
        const preSelectedAnswers = {};
        const preResult = {};
        
        if (data.type === 'test') {
          data.test.forEach((testItem, index) => {
            const userAnswer = testItem.user_answers[0];
            if (userAnswer) {
              const optionKey = Object.keys(testItem).find(key => testItem[key] === userAnswer.answer);
              preSelectedAnswers[index] = optionKey; // Save selected option
              preResult[index] = userAnswer.is_correct; // Save correctness
            }
          });
        } else if (data.type === 'task') {
          data.task.forEach((taskItem, index) => {
            const userAnswer = taskItem.user_answers[0];
            if (userAnswer) {
              preSelectedAnswers[index] = userAnswer.answer; // Save answer
              preResult[index] = userAnswer.is_correct; // Save correctness
            }
          });
        }

        setSelectedAnswers(preSelectedAnswers);
        setResult(preResult);
        setAssignment(data);
      } catch (error) {
        console.error('Error fetching assignment:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [id]);

  const handleRadioChange = async (questionIndex, option, answer, test_id) => {
    setSelectedAnswers((prevState) => ({
      ...prevState,
      [questionIndex]: option,
    }));

    const userId = parseInt(await AsyncStorage.getItem('user_id'));
    const assignmentData = assignment.type === 'test' ? {
      user_id: userId,
      test_id: test_id,
      answer: answer,
    } : {
      user_id: userId,
      task_id: assignment.id,
      answer: option,
    };

    try {
      const response = await fetch('https://srv451534.hstgr.cloud/api/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(assignmentData),
      });

      const responseData = await response.json();
      setResult((prevResult) => ({
        ...prevResult,
        [questionIndex]: responseData.is_correct,
      }));
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const handleSubmitAnswer = async (taskIndex, answer, task_id) => {
    const userId = parseInt(await AsyncStorage.getItem('user_id'));
    const assignmentData = {
      user_id: userId,
      task_id: task_id,
      answer: answer,
    };

    try {
      const response = await fetch('https://srv451534.hstgr.cloud/api/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(assignmentData),
      });

      const responseData = await response.json();
      setResult((prevResult) => ({
        ...prevResult,
        [taskIndex]: responseData.is_correct,
      }));
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
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
                    onPress={() => handleRadioChange(index, option, test[option], test.id)}
                    disabled={result[index]} // Disable if correct
                  >
                    <View style={[styles.radioCircle, selectedAnswers[index] === option && styles.selectedRadio]} />
                    <Text style={{ fontSize: 18 }}>{test[option]}</Text>
                  </TouchableOpacity>
                ))}
                {result[index] !== undefined && (
                  <Text style={[styles.resultText, result[index] ? styles.correct : styles.incorrect]}>
                    {result[index] ? 'Правильно' : 'Неправильно'}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
        {assignment.type === 'task' && (
          <View>
            <Text style={styles.subheading}>Задания</Text>
            {assignment.task.map((task, index) => (
              <View key={index} style={styles.taskItem}>
                <Text>{index + 1}. {task.question}</Text>
                {result[index] ? ( // Show answer as text if correct
                  <Text style={styles.answerText}>{selectedAnswers[index]}</Text>
                ) : (
                  <TextInput
                    style={styles.textArea}
                    placeholder="Введите ответ..."
                    multiline
                    value={selectedAnswers[index] || ''} // Pre-fill with previous answer
                    onChangeText={(text) => setSelectedAnswers((prev) => ({ ...prev, [index]: text }))}
                  />
                )}
                {result[index] !== undefined && (
                  <Text style={[styles.resultText, result[index] ? styles.correct : styles.incorrect]}>
                    {result[index] ? 'Правильно' : 'Неправильно'}
                  </Text>
                )}
                {!result[index] && ( // Only show button if the answer is incorrect
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => handleSubmitAnswer(index, selectedAnswers[index], task.id)}
                  >
                    <Text style={styles.buttonText}>Отправить ответ</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}
        <TouchableOpacity
          style={styles.viewAnswerButton}
          onPress={() => {
            const assignmentData = {
              id: assignment.id,
              title: assignment.title,
              description: assignment.description,
              test: assignment.test,
              task: assignment.task,
            };
            navigation.navigate('(tabs)', { screen: 'index', params: { assignmentData } });
          }}
        >
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
    borderRadius: 12,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadio: {
    backgroundColor: '#007bff',
  },
  taskItem: {
    marginBottom: 20,
  },
  answerText: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#c8c8c8',
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#c8c8c8',
    borderRadius: 5,
    padding: 10,
    minHeight: 80,
    marginVertical: 10,
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  viewAnswerButton: {
    marginTop: 20,
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    fontSize: 18,
    marginBottom: 80,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  resultText: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  correct: {
    color: 'green',
  },
  incorrect: {
    color: 'red',
  },
});

