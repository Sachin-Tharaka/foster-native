import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PetsService from "../services/PetsService";

const CustomerPetsScreen = ({ route, navigation }) => {
    const { customerId } = route.params || { customerId: "" };
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem("token");
      
      if (token) {
        // Token exists, fetch pets data
        getPetsByCustomerId(customerId, token);
      } else {
        // Token doesn't exist, navigate to Login screen
        console.log("Please login");
        navigation.navigate("Login");
      }
    };
    getToken();
  }, [navigation]);

  //get pets by user id
  const getPetsByCustomerId = async (id, token) => {
    try {
      const data = await PetsService.getPetsByOwnerId(id, token);
      console.log("pets data:", data);
      setPets(data);
    } catch (error) {
      // Handle error
      console.error("Error:", error.message);
    }
  };

  //handle click on pet
  const handleClickOnPet = (id) => {
    console.log("navigate to pet profile screen");
    navigation.navigate("CustomerPetProfileScreen", { petID: id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pets</Text>
      
      <ScrollView style={styles.list}>
        {pets.map((pet) => (
          <TouchableOpacity
            key={pet.petID}
            style={styles.entry}
            onPress={() => handleClickOnPet(pet.petID)}
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

export default CustomerPetsScreen;
