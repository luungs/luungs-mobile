import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableWithoutFeedback, Keyboard, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch('https://srv451534.hstgr.cloud/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        console.log('Login successful', data);
        Alert.alert('Login Successful', 'Redirecting...');
        await AsyncStorage.setItem('user_id', '2');
        router.push('/');
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Login Error', 'Something went wrong');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inner}>
          <Text style={styles.title}>Luungs</Text>
          <Text style={styles.subheader}>Пожалуйста, войдите в свой аккаунт, чтобы продолжить.</Text>
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
          <Text style={styles.link}>
            Нет аккаунта?{' '}
            <Link href="/register" style={styles.linkText}>Создать аккаунт</Link>
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Вход</Text>
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
    color: '#0096FF', // Changed to #0096FF
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
    backgroundColor: '#0096FF', // Custom background color
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginTop: 16,
    marginTop: 40,
  },
  buttonText: {
    color: '#FFFFFF', // Text color
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    marginTop: 5,
    textAlign: 'right',
  },
  linkText: {
    color: '#0096FF', // Changed to #0096FF
    fontWeight: '600',
  },
});

