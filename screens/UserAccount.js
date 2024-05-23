import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navbar from "../components/Navbar";
import UserService from "../services/UserService";

const UserAccount = ({ navigation }) => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");
      if (token) {
        // Token exists, fetch  user data
        getUserById(userId, token);
      } else {
        // Token doesn't exist, navigate to Login screen
        console.log("Please login");
        navigation.navigate("Login");
      }
    };
    getToken();
  }, []);
  //get user by id
  const getUserById = async (id, token) => {
    // call get user by id function
    try {
      const data = await UserService.getUserById(id, token);
      console.log("user data:", data);
      setUserData(data);
    } catch (error) {
      // Handle error
      console.error("Error:", error.message);
    }
  };

  const goToBecomeAgent = () => {
    navigation.navigate("BecomeAgent");
  };

  const switchAccounts = () => {
    navigation.navigate("SwitchAccounts");
  };

  const goToUserHome = () => {
    navigation.navigate("AgentHome");
  };

  const goToPetsUI = () => {
    navigation.navigate("PetsScreen");
  };

  const changeDetails = () => {
    navigation.navigate("ChangeDetails");
  };

  return (
    <View style={styles.outerContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image source={{ uri: userData.profileImage }} style={styles.logo} />
          <Text style={styles.title}>
            {userData.firstName} {userData.lastName}
          </Text>
          <Text>{userData.email}</Text>
          <Text>{userData.phoneNumber} </Text>
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
          <TouchableOpacity style={styles.button} onPress={goToBecomeAgent}>
            <Text style={styles.buttonText}>Become an Agent</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={switchAccounts}>
            <Text style={styles.buttonText}>Switch Accounts</Text>
          </TouchableOpacity>
          <View>
            <Text>Other Agent UIs</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={goToUserHome}>
            <Text style={styles.buttonText}>Agent Home (Remove later)</Text>
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
