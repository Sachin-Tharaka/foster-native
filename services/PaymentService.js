import React, { useEffect, useState } from "react";
import { View, Button, Alert } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function PaymentService({ navigation, bookingId }) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentSheetParams = async () => {
    try {
      console.log("Fetching PaymentSheet params");
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await fetch(
          `https://fosterpet.azurewebsites.net/api/payment/create-payment-intent?bookingId=${bookingId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            }
          }
      );

      if (!response.ok) {
        const message = `An error has occurred: ${response.status}`;
        throw new Error(message);
      }

      const { paymentIntent, ephemeralKey, customer } = await response.json();
      return {
        paymentIntent,
        ephemeralKey,
        customer,
      };
    } catch (error) {

      console.error("Error fetching payment sheet params:", error);
      throw error;
    }
  };

  const initializePaymentSheet = async () => {
    console.log("Initializing PaymentSheet");
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: "Jane Doe",
      },
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    console.log("Opening PaymentSheet");
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "Your order is confirmed!");
      navigation.navigate("MyBookingScreen");
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <View>
      <Button
        variant="primary"
        disabled={!loading}
        title="Pay Now"
        onPress={openPaymentSheet}
      />
    </View>
  );
}
