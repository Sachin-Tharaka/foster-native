import React, {useEffect, useState} from 'react';
import {View, Button, StyleSheet, Alert} from 'react-native';
import {useStripe} from '@stripe/stripe-react-native';

export default function PaymentService() {
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentSheetParams = async () => {
    console.log('Fetching PaymentSheet params');
    const response = await fetch(
      'https://fosterpet.azurewebsites.net/api/payment/create-payment-intent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYWhlbGExMDBAZ21haWwuY29tIiwiaWF0IjoxNzE1NjcyNzI2LCJleHAiOjE3MTU4MDIzMjZ9.LuVFi58QN7KdU9M0uuBWxWzKkuIgKHx5hUt5nJxbQKM'
        },
      },
    );
    const {paymentIntent, ephemeralKey, customer} = await response.json();
    console.log(response.json());

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    console.log('Initializing PaymentSheet');
    const {paymentIntent, ephemeralKey, customer} =
      await fetchPaymentSheetParams();

    const {error} = await initPaymentSheet({
      merchantDisplayName: 'Example, Inc.',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane Doe',
      },
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    console.log('Opening PaymentSheet');
    const {error} = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
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
        title="Checkout"
        onPress={openPaymentSheet}
      />
    </View>
  );
}
