import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

const AnimalTypeDropdown = ({ selectedAnimal, onAnimalTypeChange }) => {
  const animalTypes = [
    { label: "Dog", value: "Dog" },
    { label: "Cat", value: "Cat" },
    { label: "Bird", value: "Bird" },
    { label: "Rabbit", value: "Rabbit" },
  ];

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedAnimal}
        onValueChange={(itemValue) => onAnimalTypeChange(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select animal type" value="" />
        {animalTypes.map((animal) => (
          <Picker.Item
            key={animal.value}
            label={animal.label}
            value={animal.value}
          />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    height: 40,
    marginTop: 8,

    marginBottom: 8,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: "100%",
  },
});

export default AnimalTypeDropdown;
