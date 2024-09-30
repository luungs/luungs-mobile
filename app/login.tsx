import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableWithoutFeedback, Keyboard, Alert, KeyboardAvoidingView, Platform } from 'react-native';
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
          <Text style={styles.title}>Luungs - Вход</Text>
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
          <Button title="Вход" onPress={handleLogin} color="#FFFFFF" />
          <Text style={styles.link}>
            'Нет аккаунта?{' '}
            <Link href="/register" style={styles.linkText}>Создать аккаунт</Link>
          </Text>
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
    backgroundColor: '#F7F7F7',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    color: '#0096FF', // Changed to #0096FF
  },
  input: {
    height: 44,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
  link: {
    marginTop: 16,
    textAlign: 'center',
  },
  linkText: {
    color: '#0096FF', // Changed to #0096FF
    fontWeight: '600',
  },
});