import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const LandingScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const [emailError, setEmailError] = useState("");

  //reset password
  const handleContinue = () => {
    setEmailError("");

    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!email) {
      setEmailError("Email is required.");
      return;
    } else if (!regex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    // Call the reset passowrd function
  };

  //resend email
  const handleSkip = () => {
    //call resend email function
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Foster Pet</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={() => {
            // Handle login button press
            navigation.navigate("Login");
          }}
        >
          <Text style={[styles.buttonText, styles.loginButtonText]}>
            Log In
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.signupButton]}
          onPress={() => {
            // Handle signup button press
            navigation.navigate("Signup");
          }}
        >
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>
      </View>
      <Text>
        Skip for now?{" "}
        <Text style={styles.skip} onPress={() => navigation.navigate("Home")}>
          Skip
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },

  buttonContainer: {
    flexDirection: "row", // Arrange buttons horizontally
  },
  button: {
    flex: 1, // Equal width for both buttons
    padding: 10,
    borderRadius: 5,
    margin: 10,
    width: 100,
  },
  buttonText: {
    color: "white",

    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  loginButtonText: {
    color: "black",
  },
  loginButton: {
    borderWidth: 1,
    borderColor: "black",
    borderStyle: "solid",
  },
  signupButton: {
    backgroundColor: "black",
  },
  error: {
    color: "red",
    marginTop: 5,
    marginBottom: 10,
  },

  skip: {
    marginTop: 10,
    color: "blue",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default LandingScreen;
