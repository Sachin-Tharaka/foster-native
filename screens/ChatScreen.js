// ChatScreen.js
import React, { useEffect, useState } from "react";
import {View, Text, FlatList, StyleSheet, Button, TextInput, Image} from "react-native";
import ChatService from "../services/ChatService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

const ChatScreen = ({ route }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [attachment, setAttachment] = useState(null);
  const { chatId } = route.params;

  // Fetch chat messages
  const fetchChatMessages = async () => {
    const token = await AsyncStorage.getItem("token");
    const messages = await ChatService.fetchMessages(token, chatId);
    setChatMessages(messages);
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  const pickAttachment = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      base64: false,
    });

    if (!result.canceled) {
      setAttachment(result.assets[0]);
      console.log(attachment);
    }
  };

    const handleSend = async () => {
      const token = await AsyncStorage.getItem("token");
      const senderId = await AsyncStorage.getItem("userId");

      const formData = new FormData();
      formData.append("chatThreadId", chatId);
      formData.append("message", inputText);
      formData.append("senderId", senderId);
      if (attachment != null) {
        formData.append("attachment", {
          uri: attachment.uri,
          name: attachment.fileName,
          type: attachment.mimeType,
        });
      }
      formData.append("senderType", "User");

      const response = await ChatService.sendMessage(token, formData);
      if (response.ok) {
        setInputText("");
        setAttachment(null);
        await fetchChatMessages(); // Fetch chat messages again after sending a message
      }
    }

  const renderMessage = ({ item }) => (
    <View
      style={
        item.senderType === "User" ? styles.myMessage : styles.otherMessage
      }
    >
      <Text style={styles.messageText}>{item.message}</Text>
      {item.attachment && (
          <Image style={{ width: 200, height: 200 }} source={{ uri: item.attachment }} />
      )}
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
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message"
          value={inputText}
          onChangeText={setInputText}
        />
        <Button title="Attach" onPress={pickAttachment} />
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
