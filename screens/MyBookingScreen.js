import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BookingService from "../services/BookingService";

const MyBookingScreen = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("userId");
      if (token) {
        getBookingByUserId(userId, token);
      } else {
        console.log("Please login");
        navigation.navigate("Login");
      }
    };
    getToken();
  }, [navigation]);

  // Function to fetch bookings by user ID
  const getBookingByUserId = async (id, token) => {
    try {
      const data = await BookingService.getBookingByUserId(id, token);
      console.log(data);
      setBookings(data); // Set the bookings state with fetched data
    } catch (error) {
      console.error("Error fetching bookings:", error.message);
    }
  };

  const cancelBooking = async (bookingId) => {
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("userId");
    try {
      const response = await BookingService.cancelBooking(bookingId, token);
      console.log("Booking cancelled:", response);
      getBookingByUserId(userId, token);
    } catch (error) {
      console.error("Error cancelling booking:", error.message);
    }
  };

  const handlePetProfilePress = (petId) => {
    navigation.navigate("PetProfileScreen", { petID: petId });
  };

  const handleKennelProfilePress = (kennelId) => {
    navigation.navigate("FosterProfile", { kennelId: kennelId });
  };

  const handleVolunteerProfilePress = (volunteerId) => {
    navigation.navigate("VolunteerProfileScreen", { volunteerId: volunteerId });
  };

  const handleAddReviewPress = (bookingId, kennelId, volunteerId) => {
    navigation.navigate("AddReviewScreen", {
      bookingId,
      kennelId,
      volunteerId,
    });
  };

  const renderButtons = (booking) => {
    const buttons = [];

    buttons.push(
      <TouchableOpacity
        key="petProfile"
        style={styles.button}
        onPress={() => handlePetProfilePress(booking.petID)}
      >
        <Text style={styles.buttonText}>Pet Profile</Text>
      </TouchableOpacity>
    );

    if (booking.kennelID) {
      buttons.push(
        <TouchableOpacity
          key="kennelProfile"
          style={styles.button}
          onPress={() => handleKennelProfilePress(booking.kennelID)}
        >
          <Text style={styles.buttonText}>Kennel Profile</Text>
        </TouchableOpacity>
      );
    }

    if (booking.volunteerID) {
      buttons.push(
        <TouchableOpacity
          key="volunteerProfile"
          style={styles.button}
          onPress={() => handleVolunteerProfilePress(booking.volunteerID)}
        >
          <Text style={styles.buttonText}>Volunteer Profile</Text>
        </TouchableOpacity>
      );
    }

    if (booking.status === "PENDING") {
      buttons.push(
        <TouchableOpacity
          key="cancelBooking"
          style={styles.button}
          onPress={() => cancelBooking(booking.bookingID)}
        >
          <Text style={styles.buttonText}>Cancel Booking</Text>
        </TouchableOpacity>
      );
    }

    if (booking.status === "COMPLETED") {
      buttons.push(
        <TouchableOpacity
          key="addReview"
          style={styles.button}
          onPress={() =>
            handleAddReviewPress(
              booking.bookingID,
              booking.kennelID,
              booking.volunteerID
            )
          }
        >
          <Text style={styles.buttonText}>Add Review</Text>
        </TouchableOpacity>
      );
    }

    return buttons;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>My Bookings</Text>
      {bookings.map((booking) => (
        <View key={booking.bookingID} style={styles.bookingContainer}>
          <Text style={styles.bookingText}>
            Start Date: {new Date(booking.startDate).toLocaleString()}
          </Text>
          <Text style={styles.bookingText}>
            End Date: {new Date(booking.endDate).toLocaleString()}
          </Text>
          <Text style={styles.bookingText}>Status: {booking.status}</Text>
          <View style={styles.buttonContainer}>{renderButtons(booking)}</View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  bookingContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
  },
  bookingText: {
    fontSize: 18,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default MyBookingScreen;
