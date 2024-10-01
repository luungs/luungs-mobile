import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, TouchableWithoutFeedback, Keyboard, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Ошибка", "Пароли не совпадают");
      return;
    }

    try {
      const response = await fetch('https://srv451534.hstgr.cloud/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        router.push('/');
      } else {
        Alert.alert('Ошибка регистрации', data.message || 'Произошла ошибка');
      }
    } catch (error) {
      console.error('Error registering:', error);
      Alert.alert('Ошибка', 'Что-то пошло не так');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inner}>
          <Text style={styles.title}>Luungs</Text>
          <Text style={styles.subheader}>Создайте новый аккаунт, чтобы продолжить.</Text>
          <TextInput
            style={styles.input}
            placeholder="Ваше имя"
            value={name}
            onChangeText={setName}
            autoCapitalize="none"
            placeholderTextColor="#A0A0A0"
          />
          <TextInput
            style={styles.input}
            placeholder="Почта"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#A0A0A0"
          />
          <TextInput
            style={styles.input}
            placeholder="Пароль"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholderTextColor="#A0A0A0"
          />
          <TextInput
            style={styles.input}
            placeholder="Подтвердите пароль"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholderTextColor="#A0A0A0"
          />
          <Text style={styles.link}>
            Уже есть аккаунт?{' '}
            <Link href="/login" style={styles.linkText}>Войти</Link>
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Регистрация</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  inner: {
    flex: 1,
    marginTop: 80,
    padding: 16,
  },
  title: {
    fontSize: 35,
    fontWeight: '600',
    textAlign: 'left',
    color: '#0096FF',
  },
  subheader: {
    fontSize: 16,
    color: '#7E7E7E',
    fontWeight: '400',
    marginTop: 10,
    marginBottom: 24,
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
  link: {
    marginTop: 5,
    textAlign: 'right',
  },
  linkText: {
    color: '#0096FF',
    fontWeight: '600',
  },
});

