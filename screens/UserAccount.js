import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navbar from "../components/Navbar";
import UserService from "../services/UserService";
import defaultProfileImage from "../assets/ProfilePicture.png";

const UserAccount = ({ navigation }) => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");
      if (token) {
        // Token exists, fetch user data
        getUserById(userId, token);
      } else {
        // Token doesn't exist, navigate to Login screen
        console.log("Please login");
        navigation.navigate("Login");
      }
    };
    getToken();
  }, [navigation]);

  // Get user by id
  const getUserById = async (id, token) => {
    try {
      const data = await UserService.getUserById(id, token);
      console.log("user data:", data);
      setUserData(data);
    } catch (error) {
      // Handle error
      console.error("Error:", error.message);
    }
  };

  const goToMyBooking = () => {
    navigation.navigate("MyBookingScreen");
  };

  const switchAccounts = () => {
    navigation.navigate("SwitchAccounts");
  };

  const goToPetsUI = () => {
    navigation.navigate("PetsScreen");
  };

  const changeDetails = () => {
    navigation.navigate("ChangeDetails");
  };

  const notifications = () => {
    navigation.navigate("NotificationScreen");
  };
  const goToKennels = () => {
    navigation.navigate("MyKennelsScreen");
  };
  const goToVolunteerScreen = async () => {
    navigation.navigate("VolunteerScreen");
  };

  const deleteUserAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            const token = await AsyncStorage.getItem("token");
            const userId = await AsyncStorage.getItem("userId");
            try {
              const response = await UserService.delete(userId, token);
              console.log("User account deleted successfully", response);
              // Clear AsyncStorage or perform any logout actions here if needed
              await AsyncStorage.removeItem("token");
              await AsyncStorage.removeItem("userId");
              navigation.navigate("Signup");
            } catch (error) {
              console.error("Error deleting user account:", error.message);
              Alert.alert(
                "Error",
                "Failed to delete user account. Please try again later."
              );
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.outerContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={
              userData.profileImage
                ? { uri: userData.profileImage }
                : defaultProfileImage
            }
            style={styles.logo}
          />
          <Text style={styles.title}>
            {userData.firstName} {userData.lastName}
          </Text>
          <Text>{userData.email}</Text>
          <Text>{userData.phoneNumber}</Text>
          <Text style={styles.location}>
            {userData.address &&
              `${userData.address.address1} ${userData.address.address2} ${userData.address.city}`}
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={changeDetails}>
            <Text style={styles.buttonText}>Change Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={goToPetsUI}>
            <Text style={styles.buttonText}>Pets</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={goToMyBooking}>
            <Text style={styles.buttonText}>My Booking</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={switchAccounts}>
            <Text style={styles.buttonText}>Switch Accounts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={notifications}>
            <Text style={styles.buttonText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={goToKennels}>
            <Text style={styles.buttonText}>My Kennels (Remove later)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={goToVolunteerScreen}>
            <Text style={styles.buttonText}>Volunteer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "red" }]}
            onPress={deleteUserAccount}
          >
            <Text style={styles.buttonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 60,
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  location: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "black",
    padding: 10,
    width: "80%",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default UserAccount;
