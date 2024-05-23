import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import KennelService from "../services/KennelService";
import UserService from "../services/UserService";
import Navbar from "../components/Navbar";

const BookingHouseScreen = ({ navigation }) => {
  const [kennels, setKennels] = useState([]);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");
      if (token) {
        // Token exists, fetch kennels and user data
        getAllKennelNear(79.8, 6.9, 50000, token);
        getUserById(userId, token);
      } else {
        // Token doesn't exist, navigate to Login screen
        console.log("Please login");
        navigation.navigate("Login");
      }
    };
    getToken();
  }, []);

  //get all kennel near
  const getAllKennelNear = async (longitude, latitude, maxDistance, token) => {
    // call get all kennel near function
    try {
      const data = await KennelService.getAllKennelNear(
        longitude,
        latitude,
        maxDistance,
        token
      );
      console.log("kennel data:", data);
      setKennels(data);
    } catch (error) {
      // Handle error
      console.error("Error:", error.message);
    }
  };

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

  const goToChangeLocation = () => {
    //navigate to booking screen
    navigation.navigate("LocationSetterScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome, {userData.firstName}</Text>

      <View style={styles.location_container}>
        <View style={styles.location_container_details}>
          <View style={styles.location_container_icon}>
            <Icon name="map-marker" size={32} color="#333" />
          </View>
          <View style={styles.location_container_text}>
            <Text style={styles.address}>Home</Text>
            <Text style={styles.addressDetails}>Kandy Road, Kelaniya</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.change_button}
          onPress={goToChangeLocation}
        >
          <Text style={styles.change_button}>Change</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Professional</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text>Volunteer</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.list}>
        {kennels.map((kennel) => (
          <TouchableOpacity
            key={kennel.kennelId}
            style={styles.entry}
            onPress={() =>
              navigation.navigate("FosterProfile", {
                kennelId: kennel.kennelId,
              })
            }
          >
            <Image source={{ uri: kennel.images[0] }} style={styles.image} />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{kennel.kennelName}</Text>
              <Text style={styles.name}>{kennel.kennelAddress.city}</Text>
              <Text style={styles.rating}>★★★★</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View>
        <Navbar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffffff",
    marginTop: 60,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  address: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "left",
    padding: 0,
  },
  addressDetails: {
    fontSize: 14,
    color: "#666666",
    textAlign: "left",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "space-around",
    marginHorizontal: "auto",
    marginVertical: 20,
  },
  location_container: {
    backgroundColor: "#F2F2F2",
    borderRadius: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 30,
    paddingTop: 10,
    paddingBottom: 10,
  },
  location_container_details: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  location_container_icon: {
    marginRight: 12,
  },

  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
  },

  nav_button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    margin: "auto",
    marginTop: 5,
    width: 200,
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
  rating: {
    fontSize: 16,
    color: "#888888",
  },
});

export default BookingHouseScreen;
