import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/FontAwesome";
import PetsService from "../services/PetsService";
import BookingService from "../services/BookingService";
import VolunteerService from "../services/VounteerService";
import KennelService from "../services/KennelService";

const BookingCardScreen = ({ route, navigation }) => {
  const { kennelID } = route.params || { kennelID: "" };
  const { volunteerID } = route.params || { volunteerID: "" };

  const [petID, setPetID] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [pets, setPets] = useState([]);
  const [error, setError] = useState("");
  const [volunteer, setVolunteer] = useState(null);
  const [kennel, setKennel] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const ownerID = await AsyncStorage.getItem("userId");
        if (token) {
          getPetsByOwnerId(ownerID, token);
          if (volunteerID) {
            getVolunteerById(volunteerID, token);
          }
          if (kennelID) {
            getKennelById(kennelID, token);
          }
        } else {
          console.log("Please login");
          navigation.navigate("Login");
        }
      } catch (error) {
        console.error("Error getting token:", error.message);
      }
    };
    getToken();
  }, []);

  const getPetsByOwnerId = async (id, token) => {
    try {
      const data = await PetsService.getPetsByOwnerId(id, token);
      setPets(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const getVolunteerById = async (id, token) => {
    try {
      const data = await VolunteerService.getVolunteerById(id, token);
      setVolunteer(data);
    } catch (error) {
      console.error("Error fetching volunteer data:", error.message);
    }
  };

  const getKennelById = async (id, token) => {
    try {
      const data = await KennelService.getKennelById(id, token);
      setKennel(data);
    } catch (error) {
      console.error("Error fetching kennel data:", error.message);
    }
  };

  const isPetTypeAvailable = (petType) => {
    console.log("pet type:", petType);
    if (volunteer) {
      console.log("volunteer", volunteer.paymentRates);
      const volunteerPetTypes = volunteer.paymentRates.map(
        (rate) => rate.animalType
      );

      if (volunteerPetTypes.includes(petType)) {
        return true;
      }
    }
    if (kennel) {
      console.log("kennel", kennel.paymentRates);
      const kennelPetTypes = kennel.paymentRates.map((rate) => rate.animalType);

      if (kennelPetTypes.includes(petType)) {
        return true;
      }
    }
    return false;
  };

  const handleBooking = async () => {
    setError("");
    const selectedPet = pets.find((pet) => pet.petID === petID);
    if (!selectedPet) {
      setError("Pet is required.");
      return;
    }
    const petType = selectedPet.petType;
    if (!isPetTypeAvailable(petType)) {
      setError(
        "Selected pet type is not available for the kennel or volunteer."
      );
      return;
    }
    if (!selectedStartDate) {
      setError("Start date is required.");
      return;
    }
    if (!startTime) {
      setError("Start time is required.");
      return;
    }
    if (!selectedEndDate) {
      setError("End date is required.");
      return;
    }
    if (!endTime) {
      setError("End time is required.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      const startDate = new Date(
        selectedStartDate.setHours(startTime.getHours(), startTime.getMinutes())
      ).toISOString();

      const endDate = new Date(
        selectedEndDate.setHours(endTime.getHours(), endTime.getMinutes())
      ).toISOString();

      const data = kennelID
        ? {
            petID,
            kennelID,
            volunteerID: volunteerID || null,
            startDate,
            endDate,
          }
        : {
            petID,
            volunteerID: volunteerID || null,
            startDate,
            endDate,
          };
      console.log("Booking data: ", data);

      const responseData = await BookingService.booking(data, token);
      console.log("Booking completed:", responseData);
      navigation.navigate("PaymentScreen");
    } catch (error) {
      console.error("Booking failed:", error.message);
      setError("Booking failed");
    }
  };

  const backToHome = () => {
    navigation.navigate("BookingHouse");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={backToHome} style={styles.iconContainer}>
        <Icon name="arrow-left" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.text}>Booking Card</Text>
      {error && <Text style={styles.error}>{error}</Text>}

      <Picker
        selectedValue={petID}
        onValueChange={(itemValue, itemIndex) => setPetID(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Pet" value="" />
        {pets.map((pet) => (
          <Picker.Item key={pet.petID} label={pet.petName} value={pet.petID} />
        ))}
      </Picker>
      <TouchableOpacity
        onPress={() => setShowStartDatePicker(true)}
        style={styles.setterButton}
      >
        <Text>Select Start Date</Text>
      </TouchableOpacity>
      {showStartDatePicker && (
        <DateTimePicker
          value={selectedStartDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false);
            if (selectedDate) {
              setSelectedStartDate(selectedDate);
            }
          }}
        />
      )}

      <TouchableOpacity
        onPress={() => setShowStartTimePicker(true)}
        style={styles.setterButton}
      >
        <Text>Select Start Time</Text>
      </TouchableOpacity>
      {showStartTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedTime) => {
            setShowStartTimePicker(false);
            if (selectedTime) {
              setStartTime(selectedTime);
            }
          }}
        />
      )}

      <Text style={styles.showerText}>
        Start Date and Time: {selectedStartDate.toLocaleDateString()}{" "}
        {startTime.toLocaleTimeString()}
      </Text>

      <TouchableOpacity
        onPress={() => setShowEndDatePicker(true)}
        style={styles.setterButton}
      >
        <Text>Select End Date</Text>
      </TouchableOpacity>
      {showEndDatePicker && (
        <DateTimePicker
          value={selectedEndDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false);
            if (selectedDate) {
              setSelectedEndDate(selectedDate);
            }
          }}
        />
      )}

      <TouchableOpacity
        onPress={() => setShowEndTimePicker(true)}
        style={styles.setterButton}
      >
        <Text>Select End Time</Text>
      </TouchableOpacity>
      {showEndTimePicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedTime) => {
            setShowEndTimePicker(false);
            if (selectedTime) {
              setEndTime(selectedTime);
            }
          }}
        />
      )}

      <Text style={styles.showerText}>
        End Date and Time: {selectedEndDate.toLocaleDateString()}{" "}
        {endTime.toLocaleTimeString()}
      </Text>

      <TouchableOpacity onPress={handleBooking} style={styles.bookingButton}>
        <Text style={styles.bookingButtonText}>Book</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },
  iconContainer: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 16,
  },
  setterButton: {
    backgroundColor: "#ddd",
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  showerText: {
    marginBottom: 16,
    fontSize: 16,
    textAlign: "center",
  },
  bookingButton: {
    backgroundColor: "black",
    padding: 16,
    alignItems: "center",
    borderRadius: 8,
  },
  bookingButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 16,
    textAlign: "center",
  },
});

export default BookingCardScreen;
