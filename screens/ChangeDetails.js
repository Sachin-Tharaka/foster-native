import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import UserService from "../services/UserService";
import NotificationService from "../services/NotificationService";

const ChangeDetails = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userAddress1, setUserAddress1] = useState("");
  const [userAddress2, setUserAddress2] = useState("");
  const [userCity, setUserCity] = useState("");
  const [userZip, setUserZip] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");
      if (token && userId) {
        getUserById(userId, token);
      } else {
        console.log("Please login");
        navigation.navigate("Login");
      }
    };
    getToken();
  }, [navigation]);

  const getUserById = async (id, token) => {
    try {
      const data = await UserService.getUserById(id, token);
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setEmail(data.email);
      setPhoneNumber(data.phoneNumber);
      setUserAddress1(data.address.address1);
      setUserAddress2(data.address.address2);
      setUserCity(data.address.city);
      setUserZip(data.address.zipCode.toString());
      setProfileImage(data.profileImage.imageUrl);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async () => {
    if (!firstName) {
      Alert.alert("Error", "First Name cannot be null.");
      return;
    }
    if (!lastName) {
      Alert.alert("Error", "Last Name cannot be null.");
      return;
    }
    if (!email) {
      Alert.alert("Error", "Email cannot be null.");
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email.");
      return;
    }
    if (!password) {
      Alert.alert("Error", "Password cannot be null.");
      return;
    }

    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");
    if (token && userId) {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phoneNumber", phoneNumber);
      formData.append("address1", userAddress1);
      formData.append("address2", userAddress2);
      formData.append("city", userCity);
      formData.append("zipCode", userZip);

      if (profileImage) {
        const uriParts = profileImage.split(".");
        const fileType = uriParts[uriParts.length - 1];
        formData.append("profileImage", {
          uri: profileImage,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      try {
        await UserService.updateUser(formData, token);
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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.uri);
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
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="Address 1"
        value={userAddress1}
        onChangeText={setUserAddress1}
        style={styles.input}
      />
      <TextInput
        placeholder="Address 2"
        value={userAddress2}
        onChangeText={setUserAddress2}
        style={styles.input}
      />
      <TextInput
        placeholder="City"
        value={userCity}
        onChangeText={setUserCity}
        style={styles.input}
      />
      <TextInput
        placeholder="Zip Code"
        value={userZip}
        onChangeText={setUserZip}
        style={styles.input}
      />
      <View style={styles.imageContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.image} />
        ) : (
          <Text>No profile picture</Text>
        )}
      </View>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Update Profile Picture</Text>
      </TouchableOpacity>
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
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default ChangeDetails;
