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

const PetProfileScreen = ({ route, navigation }) => {
  const { petID } = route.params || { PetID: "" };
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
  }, []);

  //get pet by id
  const getPetById = async (id, token) => {
    // call get pets by userid function
    try {
      const data = await PetsService.getPetById(id, token);
      console.log("pets data:", data);
      setPet(data);
    } catch (error) {
      // Handle error
      console.error("Error:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Edit Account</Text>
      </TouchableOpacity>

      <View style={styles.petContainer}>
        <Image
          style={styles.petImage}
          source={
            pet.petImages && pet.petImages.length > 0
              ? { uri: pet.petImages[0] }
              : null
          }
        />
        <table border={1}>
          <tr>
            <td>Name</td>
            <td>{pet.petName}</td>
          </tr>
          <tr>
            <td>Type</td>
            <td>{pet.petType}</td>
          </tr>
          <tr>
            <td>Breed</td>
            <td>{pet.petBreed}</td>
          </tr>
          <tr>
            <td>Age</td>
            <td>{pet.petAge} years old</td>
          </tr>
          <tr>
            <td>Weight</td>
            <td>{pet.petWeight} lbs</td>
          </tr>
          <tr>
            <td>Medical Conditions</td>
            <td>{pet.petMediConditions}</td>
          </tr>
          <tr>
            <td>Vaccination Status</td>
            <td>{pet.petVaccinationStatus}</td>
          </tr>
          <tr>
            <td>Owner</td>
            <td>{pet.ownerName}</td>
          </tr>
          <tr>
            <td>Contact</td>
            <td>{pet.ownerPhone}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{pet.ownerEmail}</td>
          </tr>
          <tr>
            <td>Address</td>
            <td>
              {pet.petAddress &&
                `${pet.petAddress.address1}, ${pet.petAddress.address2}, ${pet.petAddress.city}, ${pet.petAddress.zipCode}`}
            </td>
          </tr>
        </table>
      </View>

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
                        style={styles.petImage}
                      />
                    )}
                  </View>
                )
            )}
        </View>
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
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 40,
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
    border: "1px solid black",
    borderRadius: 5,
  },
});

export default PetProfileScreen;
