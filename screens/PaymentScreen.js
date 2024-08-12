import React from "react";
import { StripeProvider } from "@stripe/stripe-react-native";
import PaymentService from "../services/PaymentService";
import { View, StyleSheet, Text } from "react-native";

const BookingDetails = ({ bookingData }) => {
  return (
    <View style={styles.bookingDetailsContainer}>
      <Text style={styles.headerText}>Booking Details</Text>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Booking ID:</Text>
        <Text style={styles.value}>{bookingData.bookingID}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Pet:</Text>
        <Text style={styles.value}>{bookingData.pet.petName}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Owner:</Text>
        <Text style={styles.value}>
          {bookingData.owner.firstName} {bookingData.owner.lastName}
        </Text>
      </View>
      {bookingData.kennel !== null && (
        <View style={styles.detailRow}>
          <Text style={styles.label}>Kennel:</Text>
          <Text style={styles.value}>{bookingData.kennel.kennelName}</Text>
        </View>
      )}
      {bookingData.volunteer !== null && (
        <View style={styles.detailRow}>
          <Text style={styles.label}>Volunteer:</Text>
          <Text style={styles.value}>{bookingData.volunteer.name}</Text>
        </View>
      )}
      <View style={styles.detailRow}>
        <Text style={styles.label}>Start Date:</Text>
        <Text style={styles.value}>
          {new Date(bookingData.startDate).toLocaleString()}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>End Date:</Text>
        <Text style={styles.value}>
          {new Date(bookingData.endDate).toLocaleString()}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Rate:</Text>
        <Text style={styles.value}>{bookingData.rate} LKR per Hour</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.label}>Total:</Text>
        <Text style={styles.value}>{bookingData.total} LKR</Text>
      </View>
    </View>
  );
};

const PaymentScreen = ({ navigation, route }) => {
  const { bookingData } = route.params;

  return (
    <View style={styles.container}>
      <BookingDetails bookingData={bookingData} />
      <View style={styles.buttonContainer}>
        <StripeProvider publishableKey="pk_test_51PGFGO2Mzh1pKqwn6HSotqsp8Dx27Ybk9OqinB1tWnl9Hm5PvQC6c17JMEJWGX72Uopgr9D6u6F8WgvcXlv4TSdX00HphqP7y4">
          <PaymentService
            navigation={navigation}
            bookingId={bookingData.bookingID}
          />
        </StripeProvider>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    width: "90%",
    margin: "auto",
    justifyContent: "space-between",
  },
  bookingDetailsContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 3, // For shadow on Android
    shadowColor: "#000", // For shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#333",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    marginBottom: 20,
  },
});

export default PaymentScreen;
