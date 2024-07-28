import React from "react";
import { StripeProvider } from "@stripe/stripe-react-native";
import PaymentService from "../services/PaymentService";
import { View, StyleSheet, Text } from "react-native";

const BookingDetails = ({ bookingData }) => {
    return (
        <View style={styles.bookingDetailsContainer}>
            <Text style={styles.detailText}>Booking ID: {bookingData.bookingID}</Text>
            <Text style={styles.detailText}>Pet: {bookingData.pet.petName}</Text>
            <Text style={styles.detailText}>Owner: {bookingData.owner.firstName} {bookingData.owner.lastName}</Text>
            {bookingData.kennel !== null && (
                <Text style={styles.detailText}>Kennel: {bookingData.kennel.kennelName}</Text>
            )}
            {bookingData.volunteer !== null && (
                <Text style={styles.detailText}>Volunteer: {bookingData.volunteer.name}</Text>
            )}
            <Text style={styles.detailText}>Start Date: {new Date(bookingData.startDate).toLocaleString()}</Text>
            <Text style={styles.detailText}>End Date: {new Date(bookingData.endDate).toLocaleString()}</Text>
            <Text style={styles.detailText}>Rate: {bookingData.rate} LKR per Hour</Text>
            <Text style={styles.detailText}>Total: ${bookingData.total} LKR</Text>
        </View>
    );
};


const PaymentScreen = ({ navigation, route }) => {
    const { bookingData } = route.params;

    return (
        <View style={styles.container}>
            <BookingDetails bookingData={bookingData} />
            <StripeProvider publishableKey="pk_test_51PGFGO2Mzh1pKqwn6HSotqsp8Dx27Ybk9OqinB1tWnl9Hm5PvQC6c17JMEJWGX72Uopgr9D6u6F8WgvcXlv4TSdX00HphqP7y4">
                <View style={styles.checkoutContainer}>
                    <PaymentService navigation={navigation} bookingId={bookingData.bookingID} />
                </View>
            </StripeProvider>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    bookingDetailsContainer: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: "lightgray",
        borderRadius: 5,
    },
    detailText: {
        fontSize: 16,
        marginBottom: 5,
    },
    checkoutContainer: {
        marginTop: 20,
        padding: 20,
        backgroundColor: "black",
        borderRadius: 5,
    },
});

export default PaymentScreen;
