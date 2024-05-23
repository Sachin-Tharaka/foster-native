import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserService from "../services/UserService";

const ChangeDetails = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");
    if (token && userId) {
      const updatedData = {
        firstName,
        lastName,
        email,
        phoneNumber,
        address: {
          address1,
          address2,
          city,
        },
      };

      try {
        const response = await UserService.updateUser(
          userId,
          updatedData,
          token
        );
        Alert.alert("Success", "Your details have been updated.");
        navigation.goBack();
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    } else {
      Alert.alert("Error", "Authentication error. Please log in again.");
      navigation.navigate("Login");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={styles.input}
      />
      <TextInput
        placeholder="Address 1"
        value={address1}
        onChangeText={setAddress1}
        style={styles.input}
      />
      <TextInput
        placeholder="Address 2"
        value={address2}
        onChangeText={setAddress2}
        style={styles.input}
      />
      <TextInput
        placeholder="City"
        value={city}
        onChangeText={setCity}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Update Details</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "black",
    padding: 10,
    alignItems: "center",
    marginTop: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
  },
});

export default ChangeDetails;
