import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableWithoutFeedback, Keyboard, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords don't match");
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
        Alert.alert('Registration Successful', 'Redirecting to login...');
        // Navigate to login page after successful registration
        router.push('/login');
      } else {
        Alert.alert('Registration Failed', data.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Error registering:', error);
      Alert.alert('Registration Error', 'Something went wrong');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inner}>
          <Text style={styles.title}>Регистрация</Text>
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
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#A0A0A0"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholderTextColor="#A0A0A0"
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            placeholderTextColor="#A0A0A0"
          />
          <Button title="Register" onPress={handleRegister} color="#4682B4" />
          <Text style={styles.link}>
            Already have an account?{' '}
            <Link href="/login" style={styles.linkText}>Login here</Link>
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
    color: '#4682B4', // VK-like blue color
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
    color: '#4682B4',
    fontWeight: '600',
  },
});
