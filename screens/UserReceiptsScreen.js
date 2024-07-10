import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserService from "../services/UserService";
import Navbar from "../components/Navbar";

const UserReceiptsScreen = ({ navigation }) => {
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    const getReceipts = async () => {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");
      if (token) {
        fetchUserReceipts(userId, token);
      } else {
        navigation.navigate("Login");
      }
    };
    getReceipts();
  }, [navigation]);

  const fetchUserReceipts = async (userId, token) => {
    try {
      const data = await UserService.getUserReceipts(userId, token);
      setReceipts(data);
    } catch (error) {
      console.error("Error fetching receipts:", error.message);
    }
  };

  const renderReceiptItem = ({ item }) => (
    <View style={styles.receiptItem}>
      <Text style={styles.receiptText}>Receipt ID: {item.id}</Text>
      <Text style={styles.receiptText}>Amount: ${item.amount}</Text>
      <Text style={styles.receiptText}>Date: {item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={receipts}
        renderItem={renderReceiptItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 60,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  receiptItem: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
  },
  receiptText: {
    fontSize: 16,
    color: "black",
  },
});

export default UserReceiptsScreen;
