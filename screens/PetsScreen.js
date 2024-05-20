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
import PetsService from "../services/PetsService";

const PetsScreen = ({ navigation }) => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");
      if (token) {
        // Token exists, fetch pets data

        getPetsByUserId(userId, token);
      } else {
        // Token doesn't exist, navigate to Login screen
        console.log("Please login");
        navigation.navigate("Login");
      }
    };
    getToken();
  }, []);

  //get pets by user id
  const getPetsByUserId = async (id, token) => {
    // call get pets by userid function
    try {
      const data = await PetsService.getPetsByOwnerId(id, token);
      console.log("pets data:", data);
      setPets(data);
    } catch (error) {
      // Handle error
      console.error("Error:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pets</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Add Pet</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.list}>
        {pets.map((pet) => (
          <TouchableOpacity
            key={pet.petID}
            style={styles.entry}
            onPress={() =>
              navigation.navigate("PetProfileScreen", { petID: pet.petID })
            }
          >
            <Image source={{ uri: pet.petImages[0] }} style={styles.image} />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{pet.petName}</Text>
            </View>
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

export default PetsScreen;
