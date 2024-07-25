import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InvoiceService from "../services/InvoiceService";

const UserInvoiceScreen = ({ navigation }) => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");
      if (token) {
        // Token exists, fetch pets data

        getInvoiceByUserId(userId, token);
      } else {
        // Token doesn't exist, navigate to Login screen
        console.log("Please login");
        navigation.navigate("Login");
      }
    };
    getToken();
  }, []);

  //get pets by user id
  const getInvoiceByUserId = async (id, token) => {
    // call get pets by userid function
    try {
      const data = await InvoiceService.getInvoiceByUserId(id, token);
      console.log("pets data:", data);
      setInvoices(data);
    } catch (error) {
      // Handle error
      console.error("Error:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Invoices</Text>
      <ScrollView style={styles.list}>
        {invoices.map((invoice) => (
          <TouchableOpacity key={invoice.id} style={styles.entry}>
            <Text style={styles.name}>{invoice.invoiceId}</Text>
            <Text style={styles.name}>{invoice.booking.bookingID}</Text>

            <Text style={styles.name}>{invoice.amount}</Text>
            <Text style={styles.name}>{invoice.status}</Text>
            <Text style={styles.name}>{invoice.paymentMethod}</Text>
            <Text style={styles.name}>{invoice.createdAt}</Text>
            <Text style={styles.name}>{invoice.paymentDate}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffffff",
    marginTop: 100,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    margin: "auto",
    marginBottom: 30,
  },

  buttonContainer: {
    flexDirection: "row",
    width: "70%",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 20,
  },

  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "black",
    borderRadius: 20,
    elevation: 3,
    marginBottom: 20,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  change_button: {
    color: "blue",
    fontWeight: "bold",
  },

  list: {
    flex: 1,
  },
  entry: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default UserInvoiceScreen;
