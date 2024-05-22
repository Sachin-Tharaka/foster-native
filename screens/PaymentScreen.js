import React, { Component } from "react";
import { StripeProvider } from "@stripe/stripe-react-native";
import PaymentService from "../services/PaymentService";
import { View, StyleSheet } from "react-native";

const PaymentScreen = ({ navigation }) => {
  return (
    <View>
      <StripeProvider publishableKey="pk_test_51PGFGO2Mzh1pKqwn6HSotqsp8Dx27Ybk9OqinB1tWnl9Hm5PvQC6c17JMEJWGX72Uopgr9D6u6F8WgvcXlv4TSdX00HphqP7y4">
        <View style={styles.checkoutContainer}>
          <PaymentService />
        </View>
      </StripeProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  checkoutContainer: {
    marginTop: 100,
    width: "90%",
    margin: "auto",
    backgroundColor: "black",
  },
});

export default PaymentScreen;
