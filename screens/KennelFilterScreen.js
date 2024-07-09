import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { Picker } from "@react-native-picker/picker";

const FilterScreen = ({ navigation }) => {
  const [petType, setPetType] = useState("dog");
  const [numberOfPets, setNumberOfPets] = useState(1);

  const handleApplyFilters = () => {
    navigation.navigate("BookingHouse", { petType, numberOfPets });
  };

  const handleBookingNavigate = () => {
    navigation.navigate("BookingHouse", { petType, numberOfPets });
  };

  const renderNumberOfPetsButtons = () => {
    const buttons = [];
    for (let i = 1; i <= 10; i++) {
      buttons.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.petButton,
            numberOfPets === i && styles.selectedPetButton,
          ]}
          onPress={() => setNumberOfPets(i)}
        >
          <Text
            style={[
              styles.petButtonText,
              numberOfPets === i && styles.selectedPetButtonText,
            ]}
          >
            {i}
          </Text>
        </TouchableOpacity>
      );
    }
    return buttons;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pet Details</Text>
      <Text style={styles.label}>Select Pet Type</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={petType}
          style={styles.picker}
          onValueChange={(itemValue) => setPetType(itemValue)}
        >
          <Picker.Item label="Dog" value="dog" />
          <Picker.Item label="Cat" value="cat" />
        </Picker>
      </View>
      <Text style={styles.label}>Number of Pets</Text>
      <View style={styles.petButtonsContainer}>
        {renderNumberOfPetsButtons()}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleApplyFilters}>
        <Text style={styles.buttonText}>Apply Filters</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleBookingNavigate}>
        <Text style={styles.buttonText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: "#555",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  petButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  petButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    margin: 5,
    minWidth: 40,
    alignItems: "center",
  },
  selectedPetButton: {
    backgroundColor: "#333",
  },
  petButtonText: {
    color: "#333",
    fontSize: 18,
  },
  selectedPetButtonText: {
    color: "#fff",
  },
  button: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});

export default FilterScreen;
