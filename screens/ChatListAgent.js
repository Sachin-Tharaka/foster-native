// ChatListAgent.js
import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import ChatService from "../services/ChatService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatListUser = ({ route, navigation }) => {
  const { kennelID } = route.params || { kennelID: "" };
  const [chatPreview, setChatPreview] = useState([]);

  useEffect(() => {
    const fetchChatPreview = async () => {
      const token = await AsyncStorage.getItem("token");
      const chatPreview = await ChatService.fetchMessagePreviewsAgent(token, kennelID);
      setChatPreview(chatPreview);
    };

    fetchChatPreview();
  });

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate("ChatAgent", { chatId: item.chatThreadId, kennelId: kennelID })}
    >
      <Text style={styles.chatName}>{item.chatThreadName}</Text>
      <Text style={styles.lastMessage}>{item.lastMessage.message}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chatPreview}
        keyExtractor={(item) => item.id}
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
