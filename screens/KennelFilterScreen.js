import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const FilterScreen = ({ navigation }) => {
  const [petType, setPetType] = useState("");

  const handleBookingNavigate = () => {
    navigation.navigate("BookingHouse", { petType });
  };

  return (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={petType}
        style={styles.picker}
        placeholder="Select Pet Type"
        onValueChange={(itemValue) => setPetType(itemValue)}
      >
        <Picker.Item label="Select Pet Type" value="" />
        <Picker.Item label="Dog" value="dog" />
        <Picker.Item label="Cat" value="cat" />
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginVertical: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  picker: {
    height: 38,
    width: "100%",
  },
});

export default FilterScreen;
