import React, { useState } from 'react';
import { Image, StyleSheet, TextInput, FlatList, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText'; // Assuming you have a themed text component
import { ThemedView } from '@/components/ThemedView'; // Assuming you have a themed view component

export default function HomeScreen() {
  const [messages, setMessages] = useState([]); // State for chat messages
  const [input, setInput] = useState(''); // State for input message

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { id: Date.now().toString(), text: input }]);
      setInput('');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.messageContainer}>
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
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <ThemedText style={styles.sendButtonText}>Send</ThemedText>
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
    paddingBottom: 80, // Add some space for the input area
  },
  messageContainer: {
    marginVertical: 4,
    padding: 10,
    backgroundColor: '#e1ffc7', // Light green background for messages
    borderRadius: 10,
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
    backgroundColor: '#007bff', // Blue color for send button
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sendButtonText: {
    color: '#fff',
  },
});
