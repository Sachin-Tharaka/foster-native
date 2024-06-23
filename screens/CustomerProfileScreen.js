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
import defaultProfileImage from "../assets/ProfilePicture.png"; 


const CustomerProfileScreen = ({ route, navigation }) => {
    const { customerId } = route.params || { customerId: "" };
  const [customerData, setCustomerData] = useState({});

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem("token");
     
      if (token) {
        // Token exists, fetch user data
        getCustomerById(customerId, token);
      } else {
        // Token doesn't exist, navigate to Login screen
        console.log("Please login");
        navigation.navigate("Login");
      }
    };
    getToken();
  }, [navigation]);

  // Get user by id
  const getCustomerById = async (id, token) => {
    try {
      const data = await UserService.getUserById(id, token);
      console.log("customer data:", data);
      setCustomerData(data);
    } catch (error) {
      // Handle error
      console.error("Error:", error.message);
    }
  };


  const goToPetsUI = () => {
   
    console.log("navigate to pet screen");
    navigation.navigate("CustomerPetsScreen",{customerId:customerId});
  };

  

  return (
    <View style={styles.outerContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={customerData.profileImage ? { uri: customerData.profileImage } : defaultProfileImage}
            style={styles.logo}
          />
          <Text style={styles.title}>
            {customerData.firstName} {customerData.lastName}
          </Text>
          <Text>{customerData.email}</Text>
          <Text>{customerData.phoneNumber}</Text>
          <Text style={styles.location}>
            {customerData.address &&
              `${customerData.address.address1} ${customerData.address.address2} ${customerData.address.city}`}
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
        
          <TouchableOpacity style={styles.button} onPress={goToPetsUI}>
            <Text style={styles.buttonText}>Pets</Text>
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

export default CustomerProfileScreen;
