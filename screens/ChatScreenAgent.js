// ChatScreenAgent.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from "react-native";
import ChatService from "../services/ChatService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";

const ChatScreenUser = ({ route }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [attachment, setAttachment] = useState(null);
  const { chatId } = route.params;
  const { kennelId } = route.params;

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

    const formData = new FormData();
    formData.append("chatThreadId", chatId);
    formData.append("message", inputText);
    formData.append("senderId", kennelId);
    if (attachment != null) {
      formData.append("attachment", {
        uri: attachment.uri,
        name: attachment.fileName,
        type: attachment.mimeType,
      });
    }
    formData.append("senderType", "Kennel");

    const response = await ChatService.sendMessage(token, formData);
    if (response.ok) {
      setInputText("");
      setAttachment(null);
      await fetchChatMessages(); // Fetch chat messages again after sending a message
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={
        item.senderType === "Kennel" ? styles.myMessage : styles.otherMessage
      }
    >
      <Text style={styles.messageText}>{item.message}</Text>
      {item.attachment && (
        <Image
          style={{ width: 200, height: 200 }}
          source={{ uri: item.attachment }}
        />
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
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity
            onPress={pickAttachment}
            style={styles.attachmentIcon}
          >
            <Icon name="paperclip" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleSend} style={styles.iconButton}>
          <Icon name="send" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E1E1E1",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  messageText: {
    fontSize: 16,
  },
  attachment: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#e1e1e1",
    padding: 10,
    backgroundColor: "#fff",
  },
  textInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#e1e1e1",
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "#f9f9f9",
    paddingRight: 40,
  },
  textInput: {
    flex: 1,
    padding: 10,
  },
  attachmentIcon: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  iconButton: {
    padding: 10,
  },
});

export default ChatScreenUser;
