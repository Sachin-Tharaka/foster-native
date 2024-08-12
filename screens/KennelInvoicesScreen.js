import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import KennelService from "../services/KennelService";
import Navbar from "../components/Navbar";

const KennelInvoicesScreen = ({ navigation }) => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const getInvoices = async () => {
      const token = await AsyncStorage.getItem("token");
      const kennelId = await AsyncStorage.getItem("kennelId");
      if (token) {
        fetchKennelInvoices(kennelId, token);
      } else {
        navigation.navigate("Login");
      }
    };
    getInvoices();
  }, [navigation]);

  const fetchKennelInvoices = async (kennelId, token) => {
    try {
      const data = await KennelService.getKennelInvoices(kennelId, token);
      setInvoices(data);
    } catch (error) {
      console.error("Error fetching invoices:", error.message);
    }
  };

  const renderInvoiceItem = ({ item }) => (
    <View style={styles.invoiceItem}>
      <Text style={styles.invoiceText}>Invoice ID: {item.id}</Text>
      <Text style={styles.invoiceText}>Amount: ${item.amount}</Text>
      <Text style={styles.invoiceText}>Date: {item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={invoices}
        renderItem={renderInvoiceItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
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
  invoiceItem: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
  },
  invoiceText: {
    fontSize: 16,
    color: "black",
  },
});

export default KennelInvoicesScreen;
