import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import KennelService from "../services/KennelService";
import AnimalTypeDropdown from "../components/AnimalTypeDropdown";

const AddChargingRatesScreen = ({ route, navigation }) => {
  const { kennelId } = route.params || { kennelId: "" };
  const [paymentRates, setPaymentRates] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const getTokenAndFetchData = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        getKennelById(kennelId, token);
      } else {
        navigation.navigate("Login");
      }
    };
    getTokenAndFetchData();
  }, [kennelId, navigation]);

  const getKennelById = async (id, token) => {
    try {
      const data = await KennelService.getKennelById(id, token);
      setPaymentRates(data.paymentRates || []);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const addRates = async () => {
    const formattedRates = paymentRates.map((rate) => ({
      animalType: rate.animalType,
      rate: parseFloat(rate.rate),
    }));

    if (
      formattedRates.some(
        (rate) => isNaN(rate.rate) || !rate.animalType || rate.rate === ""
      )
    ) {
      setError("All fields are required and rates must be numbers.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const data = {
        kennelId,
        paymentRates: formattedRates,
      };
      await KennelService.addRates(data, token);
      navigation.navigate("AgentHome", { kennelID: kennelId });
      setPaymentRates([{ animalType: "", rate: "" }]);
      setError(""); // Clear error on successful submission
    } catch (error) {
      console.error("Error:", error.message);
      setError("Failed to save payment rates");
    }
  };

  const handleAddField = () => {
    setPaymentRates([...paymentRates, { animalType: "", rate: "" }]);
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
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Add Payment Rates</Text>
        {error && <Text style={styles.error}>{error}</Text>}
        {paymentRates.map((rate, index) => (
          <View key={index} style={styles.rateContainer}>
            <AnimalTypeDropdown
              selectedAnimal={rate.animalType}
              onAnimalTypeChange={(value) =>
                handleInputChange(index, "animalType", value)
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Payment Rate"
              value={rate.rate.toString()}
              onChangeText={(value) => handleInputChange(index, "rate", value)}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveField(index)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddField}>
          <Text style={styles.addButtonText}>Add Another Rate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={addRates}>
          <Text style={styles.submitButtonText}>Save Payment Rates</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
    paddingTop: 60,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80, // Ensure enough space for buttons
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginHorizontal: "auto",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  rateContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  addButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  removeButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default AddChargingRatesScreen;
