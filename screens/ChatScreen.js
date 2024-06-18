import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
} from "react-native";

const dummyMessages = [
  { id: "1", text: "Hey, how are you?", sender: "Alice" },
  { id: "2", text: "I am good, thanks! And you?", sender: "Me" },
  { id: "3", text: "Doing well, just working on the app.", sender: "Alice" },
  { id: "4", text: "Awesome! Keep it up.", sender: "Me" },
];

const ChatScreen = ({ route }) => {
  const { chatId } = route.params;
  const [messages, setMessages] = useState(dummyMessages);
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (inputText.trim().length > 0) {
      const newMessage = {
        id: (messages.length + 1).toString(),
        text: inputText,
        sender: "Me",
      };
      setMessages([newMessage, ...messages]);
      setInputText("");
    }
  };

  const renderMessage = ({ item }) => (
    <View style={item.sender === "Me" ? styles.myMessage : styles.otherMessage}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message"
          value={inputText}
          onChangeText={setInputText}
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: "80%",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E1E1E1",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: "80%",
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#e1e1e1",
    padding: 10,
    backgroundColor: "#fff",
  },
  textInput: {
    flex: 1,
    padding: 10,
    borderColor: "#e1e1e1",
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 10,
  },
});

export default ChatScreen;
