import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import VounteerService from "../services/VounteerService";
import AnimalTypeDropdown from "../components/AnimalTypeDropdown";

const AddPetTypesToVolunteerProfileScreen = ({ route, navigation }) => {
  const { volunteerId } = route.params || { volunteerId: "" };
  const [paymentRates, setPaymentRates] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const getTokenAndFetchData = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        console.log("volunteer id" + volunteerId);
        getVolunteerById(volunteerId, token);
      } else {
        navigation.navigate("Login");
      }
    };
    getTokenAndFetchData();
  }, [volunteerId, navigation]);

  const getVolunteerById = async (id, token) => {
    try {
      const data = await VounteerService.getVolunteerById(id, token);
      setPaymentRates(data.paymentRates || []);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const addRates = async () => {
    const formattedRates = paymentRates.map((rate) => ({
      animalType: rate.animalType,
      rate: 0, // Set the default rate to 0
    }));

    if (formattedRates.some((rate) => !rate.animalType)) {
      setError("All fields are required.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const data = {
        volunteerId,
        paymentRates: formattedRates,
      };
      const response = await VounteerService.addRates(data, token);
      navigation.navigate("VolunteerScreen");
      setPaymentRates([{ animalType: "" }]);
    } catch (error) {
      console.error("Error:", error.message);
      setError("Failed to save pet types");
    }
  };

  const handleAddField = () => {
    setPaymentRates([...paymentRates, { animalType: "" }]);
  };

  const handleRemoveField = (index) => {
    const updatedRates = paymentRates.filter((_, i) => i !== index);
    setPaymentRates(updatedRates);
  };

  const handleInputChange = (index, name, value) => {
    const updatedRates = paymentRates.map((rate, i) => {
      if (i === index) {
        return { ...rate, [name]: value };
      }
      return rate;
    });
    setPaymentRates(updatedRates);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>Add Pet Types</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        {paymentRates.map((rate, index) => (
          <View key={index} style={styles.rateContainer}>
            <AnimalTypeDropdown
              selectedAnimal={rate.animalType}
              onAnimalTypeChange={(value) =>
                handleInputChange(index, "animalType", value)
              }
            />
            <TouchableOpacity
              onPress={() => handleRemoveField(index)}
              style={styles.removeButton}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity onPress={handleAddField} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add More</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={addRates} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Pet Types</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  error: {
    color: "red",
    marginTop: 5,
    marginBottom: 10,
  },
  rateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  removeButton: {
    marginLeft: 10,
    backgroundColor: "#8B0000",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    height: 50,
    justifyContent: "center",
  },
  removeButtonText: {
    color: "white",
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default AddPetTypesToVolunteerProfileScreen;
