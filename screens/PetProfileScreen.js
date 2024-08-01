import React, { useEffect, useState } from "react";
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
import PetsService from "../services/PetsService";
import Navbar from "../components/Navbar";

const PetProfileScreen = ({ route, navigation }) => {
  const { petID } = route.params || { petID: "" };
  const [pet, setPet] = useState([]);

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        // Token exists, fetch pet data
        getPetById(petID, token);
      } else {
        // Token doesn't exist, navigate to Login screen
        console.log("Please login");
        navigation.navigate("Login");
      }
    };
    getToken();
  }, [navigation]);

  // Get pet by id
  const getPetById = async (id, token) => {
    try {
      const data = await PetsService.getPetById(id, token);
      console.log("pets data:", data);
      setPet(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  // Navigate to update screen
  const handleEditProfile = async () => {
    console.log("Navigate to update pet profile screen");
    navigation.navigate("UpdatePetProfileScreen", { petID: petID });
  };

  // Delete pet by id
  const handleDeletePet = async () => {
    Alert.alert(
      "Delete Pet",
      "Are you sure you want to delete this pet?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: deletePet },
      ],
      { cancelable: false }
    );
  };

  const deletePet = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await PetsService.delete(petID, token);
      console.log("Pet deleted successfully", response);
      navigation.navigate("PetsScreen");
    } catch (error) {
      console.error("Error deleting pet:", error.message);
      Alert.alert("Error", "Failed to delete pet. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.petContainer}>
        <Image
          style={styles.petImage}
          source={
            pet.petImages && pet.petImages.length > 0
              ? { uri: pet.petImages[0] }
              : null
          }
        />
        <View>
          <Text>Name: {pet.petName}</Text>
          <Text>Type: {pet.petType}</Text>
          <Text>Breed: {pet.petBreed}</Text>
          <Text>Age: {pet.petAge} years old</Text>
          <Text>Weight: {pet.petWeight} lbs</Text>
          <Text>Medical Conditions: {pet.petMediConditions}</Text>
          <Text>Vaccination Status: {pet.petVaccinationStatus}</Text>
          <Text>KASL Registration Number: {pet.kasl_regNo}</Text>
          <Text>Owner: {pet.ownerName}</Text>
          <Text>Contact: {pet.ownerPhone}</Text>
          <Text>Email: {pet.ownerEmail}</Text>
          <Text>
            Address:{" "}
            {pet.petAddress &&
              `${pet.petAddress.address1}, ${pet.petAddress.address2}, ${pet.petAddress.city}, ${pet.petAddress.zipCode}`}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
        <Text style={styles.buttonText}>Edit Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "red" }]}
        onPress={handleDeletePet}
      >
        <Text style={styles.buttonText}>Delete This Pet</Text>
      </TouchableOpacity>

      <ScrollView>
        <View style={styles.images}>
          {pet.petImages &&
            Array.isArray(pet.petImages) &&
            pet.petImages.map(
              (image, index) =>
                index % 2 === 0 && (
                  <View key={index} style={styles.petRow}>
                    <Image source={{ uri: image }} style={styles.image} />
                    {index + 1 < pet.petImages.length && (
                      <Image
                        source={{ uri: pet.petImages[index + 1] }}
                        style={styles.image}
                      />
                    )}
                  </View>
                )
            )}
        </View>
      </ScrollView>
      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffffff",
    paddingTop: 60,
  },
  petImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    margin: "auto",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "black",
    padding: 10,
    margin: "auto",
    borderRadius: 5,
    marginTop: 10,
    width: "90%",
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  petContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    margin: "auto",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
  },
  images: {
    marginTop: 40,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  petRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 5,
  },
});

export default PetProfileScreen;
