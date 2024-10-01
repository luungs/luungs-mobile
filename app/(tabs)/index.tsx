import React, { useState } from 'react';
import { Image, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, TextInput, FlatList, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { OpenAI } from "openai";
import { open_ai } from "@/api.tsx";

const api = new OpenAI({
  apiKey: open_ai,  
  baseURL: 'https://api.openai.com/v1', // Official OpenAI base URL
});

export default function HomeScreen() {
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState(''); 
  const [loading, setLoading] = useState(false); 

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { id: Date.now().toString(), text: input, role: 'user' };
      setMessages((prevMessages) => [...prevMessages, userMessage]); 
      setInput('');

      setLoading(true);
      try {
        const response = await api.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant.",
            },
            {
              role: "user",
              content: input,
            },
          ],
          temperature: 0.7,
          max_tokens: 256,
        });

        const aiMessage = {
          id: Date.now().toString(),
          text: response.choices[0].message.content,
          role: 'assistant',
        };

        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } catch (error) {
        console.error("Error fetching AI response:", error.response ? error.response.data : error.message);
        setMessages((prevMessages) => [...prevMessages, { id: Date.now().toString(), text: "Sorry, something went wrong.", role: 'error' }]);
      } finally {
        setLoading(false);
      }
    }
  };

  const renderItem = ({ item }) => {
    if (item.role === 'loading') {
      return (
        <View style={[styles.messageContainer, styles.loadingMessage]}>
          <ActivityIndicator size="small" color="#fff" />
          <ThemedText style={styles.loadingText}>Загрузка...</ThemedText>
        </View>
      );
    }

    return (
      <View style={[styles.messageContainer, item.role === 'assistant' ? styles.assistantMessage : styles.userMessage]}>
        <ThemedText style={styles.messageText}>{item.text}</ThemedText>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={{ color: '#0096FF', textAlign: 'center', fontSize: 28, fontWeight: '600', paddingVertical: 10 }}>Luungs</ThemedText>
      <FlatList
        data={loading ? [...messages, { id: Date.now().toString(), role: 'loading' }] : messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatList}
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Введите ваш запрос..."
            editable={!loading}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton} disabled={loading}>
            <ThemedText style={styles.sendButtonText}>Отправить</ThemedText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 60,
    justifyContent: 'space-between',
  },
  chatList: {
    paddingBottom: 80,
  },
  messageContainer: {
    marginVertical: 4,
    padding: 10,
    borderRadius: 10,
    maxWidth: '90%',
  },
  userMessage: {
    backgroundColor: '#F6F6F6',
    alignSelf: 'flex-end',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
  },
  loadingMessage: {
    backgroundColor: '#ccc',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 8,
    color: '#fff',
    fontSize: 16,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    fontSize: 18,
    padding: 10,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: '#fff',
  },
});

