// ChatList.js
import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const dummyChats = [
  { id: "1", name: "Alice", lastMessage: "Hey, how are you?" },
  { id: "2", name: "Bob", lastMessage: "Are we still on for tomorrow?" },
  { id: "3", name: "Charlie", lastMessage: "Check this out!" },
];

const ChatList = ({ navigation }) => {
  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate("Chat", { chatId: item.id })}
    >
      <Text style={styles.chatName}>{item.name}</Text>
      <Text style={styles.lastMessage}>{item.lastMessage}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={dummyChats}
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

export default ChatList;
