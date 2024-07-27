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
import Icon from "react-native-vector-icons/FontAwesome";

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

  const goToPetsUI = () => {
    navigation.navigate("PetsScreen");
  };

  const changeDetails = () => {
    navigation.navigate("ChangeDetails");
  };

  const notifications = () => {
    navigation.navigate("NotificationScreen");
  };
  const goToVolunteerScreen = async () => {
    navigation.navigate("VolunteerScreen");
  };
  const goToUserReceipts = async () => {
    navigation.navigate("UserInvoiceScreen");
  };
  const goToKennelReceipts = async () => {
    navigation.navigate("KennelInvoicesScreen");
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userId");
    navigation.navigate("Login");
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
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={changeDetails}>
              <Icon name="pencil" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("MyKennelsScreen")}
            >
              <Icon name="exchange" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={logout}>
              <Icon name="sign-out" size={24} color="black" />
            </TouchableOpacity>
          </View>
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
          <TouchableOpacity style={styles.button} onPress={goToPetsUI}>
            <Text style={styles.buttonText}>My Pet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={goToMyBooking}>
            <Text style={styles.buttonText}>My Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={notifications}>
            <Text style={styles.buttonText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={goToVolunteerScreen}>
            <Text style={styles.buttonText}>Become a Volunteer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={goToUserReceipts}>
            <Text style={styles.buttonText}>My Invoices</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={goToKennelReceipts}>
            <Text style={styles.buttonText}>Kennel Invoices</Text>
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
    position: "relative",
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  iconContainer: {
    top: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: 60,
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
