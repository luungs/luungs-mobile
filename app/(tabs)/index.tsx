import React, { useState } from 'react';
import { Image, StyleSheet, TextInput, FlatList, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { OpenAI } from "openai";

const api = new OpenAI({
  apiKey: 'sk-gSDT6wO5ZaqChMmnHRrmbEIwWMky9z0MCK0dmnchtbT3BlbkFJPhc7JSqJ5WLDb24hUEzINYq1fb_eJRRjyEbykn7lkA', // Use environment variable
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

  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.role === 'assistant' ? styles.assistantMessage : styles.userMessage]}>
      <ThemedText style={styles.messageText}>{item.text}</ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          editable={!loading}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton} disabled={loading}>
          <ThemedText style={styles.sendButtonText}>{loading ? "Sending..." : "Send"}</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  chatList: {
    paddingBottom: 80,
  },
  messageContainer: {
    marginVertical: 4,
    padding: 10,
    borderRadius: 10,
  },
  userMessage: {
    backgroundColor: '#e1ffc7',
    alignSelf: 'flex-start',
  },
  assistantMessage: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 10,
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

