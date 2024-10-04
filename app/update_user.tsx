import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Menu, Provider, Divider } from 'react-native-paper';
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
  const [menuVisible, setMenuVisible] = useState(false);
  const [gradeInput, setGradeInput] = useState(''); // State for grade input

  const universities = [
    "МУА",
    "КазНМУ",
    "Мед. университет в г. Семей",
    "КазМУНО",
    "Актюбинский мед. университет",
  ];

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
        Alert.alert('Ошибка', 'Не удалось найти ID пользователя');
        return;
      }

      const response = await fetch(`https://srv451534.hstgr.cloud/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...user, grade: gradeInput }), // Set the grade from the input
      });

      if (response.ok) {
        Alert.alert('Успех', 'Пользователь успешно обновлён');
      } else {
        const errorData = await response.json();
        Alert.alert('Ошибка', errorData.message || 'Не удалось обновить пользователя');
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      Alert.alert('Ошибка', 'Что-то пошло не так при обновлении');
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
    <Provider>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ThemedView style={styles.container}>
          <ThemedText style={styles.title}>Обновите свой профиль</ThemedText>
          
          <TextInput
            style={styles.input}
            value={user.name}
            onChangeText={(text) => setUser({ ...user, name: text })}
            placeholder="Имя"
          />
          <TextInput
            style={styles.input}
            value={user.email}
            onChangeText={(text) => setUser({ ...user, email: text })}
            placeholder="Электронная почта"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            value={user.description}
            onChangeText={(text) => setUser({ ...user, description: text })}
            placeholder="Описание"
          />
          <TextInput
            style={styles.input}
            value={user.music_taste}
            onChangeText={(text) => setUser({ ...user, music_taste: text })}
            placeholder="Музыкальные предпочтения"
          />
          <TextInput
            style={styles.input}
            value={user.movie_taste}
            onChangeText={(text) => setUser({ ...user, movie_taste: text })}
            placeholder="Кинопредпочтения"
          />

          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setMenuVisible(true)}
              >
                <Text style={styles.menuButtonText}>
                  {user.university || "Выберите университет"}
                </Text>
              </TouchableOpacity>
            }
          >
            {universities.map((uni, index) => (
              <Menu.Item
                key={index}
                onPress={() => {
                  setUser({ ...user, university: uni });
                  setMenuVisible(false);
                }}
                title={uni}
              />
            ))}
            <Divider />
          </Menu>

          <TextInput
            style={styles.input}
            value={gradeInput}
            onChangeText={setGradeInput}
            placeholder="Ваш курс (1-6)"
            keyboardType="numeric" // Ensure numeric input
          />

          <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={updating}>
            <Text style={styles.buttonText}>Сохранить</Text>
          </TouchableOpacity>
          {updating && <ActivityIndicator size="small" color="#007bff" style={styles.updatingIndicator} />}
        </ThemedView>
      </TouchableWithoutFeedback>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    paddingTop: 90,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'left',
    color: '#0096FF',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: '#C0C0C0',
    fontSize: 16,
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  menuButton: {
    borderColor: '#C0C0C0',
    height: 50,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 4,
  },
  menuButtonText: {
    color: '#0096FF', // Menu button text color
    textAlign: 'center',
  },
  button: {
    height: 50,
    backgroundColor: '#0096FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 25,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

