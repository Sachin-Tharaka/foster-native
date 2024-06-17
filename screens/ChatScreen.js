// ChatScreen.js
import React, {useEffect, useState} from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import ChatService from "../services/ChatService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatScreen = ({ route }) => {

  const[chatMessages, setChatMessages] = useState([]);
  const { chatId } = route.params;

    useEffect(() => {
    // Fetch chat messages
    const fetchChatMessages = async () => {
      const token = await AsyncStorage.getItem("token");
      const messages = await ChatService.fetchMessages(token, chatId);
      setChatMessages(messages);
    };

    fetchChatMessages();
    }, []);


  const renderMessage = ({ item }) => (
    <View style={item.senderType === "User" ? styles.myMessage : styles.otherMessage}>
      <Text style={styles.messageText}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatMessages}
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
