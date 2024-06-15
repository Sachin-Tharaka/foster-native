// ChatScreen.js
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const dummyMessages = [
  { id: "1", text: "Hey, how are you?", sender: "Alice" },
  { id: "2", text: "I am good, thanks! And you?", sender: "Me" },
  { id: "3", text: "Doing well, just working on the app.", sender: "Alice" },
  { id: "4", text: "Awesome! Keep it up.", sender: "Me" },
];

const ChatScreen = ({ route }) => {
  const { chatId } = route.params;

  const renderMessage = ({ item }) => (
    <View style={item.sender === "Me" ? styles.myMessage : styles.otherMessage}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={dummyMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        inverted
      />
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
});

export default ChatScreen;
