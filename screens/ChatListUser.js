import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import ChatService from "../services/ChatService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatListUser = ({ navigation }) => {
  const [chatPreview, setChatPreview] = useState([]);

  useEffect(() => {
    const fetchChatPreview = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userId = await AsyncStorage.getItem("userId");
        const chatPreview = await ChatService.fetchMessagePreviewsUser(
          token,
          userId
        );
        setChatPreview(chatPreview);
      } catch (error) {
        console.error("Failed to fetch chat previews:", error);
      }
    };

    fetchChatPreview().then(() => console.log("ChatListUser fetchChatPreview"));
  }, []); // Added dependency array to run the effect only once on mount

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate("ChatScreenUser", { chatId: item.chatThreadId })
      }
    >
      <Text style={styles.chatName}>{item.chatThreadName}</Text>
      <Text style={styles.lastMessage}>{item.lastMessage.message}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chats</Text>
      <FlatList
        data={chatPreview}
        keyExtractor={(item) => item.chatThreadId} // Ensure this matches the correct field in your data
        renderItem={renderChatItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
    paddingTop: 60,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  chatItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  chatName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  lastMessage: {
    color: "#555",
  },
});

export default ChatListUser;
