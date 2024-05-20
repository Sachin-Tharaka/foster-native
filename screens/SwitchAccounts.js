import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserService from "../services/UserService";

const SwitchAccounts = ({ navigation }) => {
  // const [accounts, setAccounts] = useState([]);

  // useEffect(() => {
  //   const fetchAccounts = async () => {
  //     const token = await AsyncStorage.getItem("token");
  //     if (token) {
  //       try {
  //         const fetchedAccounts = await UserService.getAccounts(token);
  //         setAccounts(fetchedAccounts);
  //       } catch (error) {
  //         console.error("Failed to fetch accounts:", error);
  //       }
  //     } else {
  //       navigation.navigate("Login");
  //     }
  //   };

  //   fetchAccounts();
  // }, []);

  // const handleSwitch = async (accountId) => {
  //   await AsyncStorage.setItem("currentAccountId", accountId);
  //   navigation.goBack(); // Or refresh the data contextually based on the account switched to
  // };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.accountText}>Switch Accounts</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 60,
    padding: 30,
  },
  accountContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  accountText: {
    width: "90%",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default SwitchAccounts;
